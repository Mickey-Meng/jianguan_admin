<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" >
      <el-form-item label="工序库名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入工序库名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工序库编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入工序库编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['jg:produceLibrary:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['jg:produceLibrary:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="produceLibraryList"
      row-key="id"
      :height="'calc(100vh - 205px)'"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @row-click="handleClickRow"
    >
      <el-table-column label="工序库名称" align="center" prop="name" />
      <el-table-column label="工序库编号" align="center" prop="code" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.name !== '顶级'">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jg:produceLibrary:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['jg:produceLibrary:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改工序库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="上级工序库" prop="parentId">
              <treeselect
                :multiple="false"
                :searchable="true"
                v-model="form.parentId"
                :options="produceLibraryTreeOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级工序库"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工序库名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入工序库名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工序库编号" prop="code">
              <el-input v-model="form.code" placeholder="请输入工序库编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>          
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm" v-if="edit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProduceLibrary, getProduceLibrary, delProduceLibrary, addProduceLibrary, updateProduceLibrary } from "@/api/jianguan/produce/produceLibrary";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import bus from "@/utils/eventBus";

export default {
  name: "ProduceLibrary",
  components: { Treeselect },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 工序库表格数据
      produceLibraryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否编辑 true　修改true 查看详情false
      edit: true,
      // 查询参数
      queryParams: {
        name: undefined,
        code: undefined,
      },

      // 是否展开，默认全部折叠
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      //工序库下拉树
      produceLibraryTreeOptions: [],

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级工序库不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "工序库名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "工序库编号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工序库列表 */
    getList() {
      this.loading = true;
      listProduceLibrary(this.queryParams).then(response => {
        this.produceLibraryList = this.handleTree(response.data, "id");
        this.loading = false;
      });
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 转换项目数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        projectId: undefined,
        parentId: undefined,
        name: undefined,
        code: undefined,
        orderNum: undefined,
        groupLevel: undefined,
        remark: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
      listProduceLibrary().then(response => {
        this.produceLibraryTreeOptions = this.handleTree(response.data, "id");
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 点击当前行
    handleClickRow(currentRow){
      if (currentRow.name !== "顶级") {
        console.log("发送数据[handleClickRow]...");
        bus.$emit('clickLibraryRow', currentRow);
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.edit = true;
      this.title = "添加工序库";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.edit = true;
      this.reset();
      const id = row.id || this.ids
      getProduceLibrary(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改工序库";
      });
    },
    
    /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.edit = false;
      this.reset();
      const id = row.id || this.ids
      getProduceLibrary(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "查看工序库";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateProduceLibrary(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addProduceLibrary(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除工序库编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delProduceLibrary(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/produceLibrary/export', {
        ...this.queryParams
      }, `produceLibrary_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
