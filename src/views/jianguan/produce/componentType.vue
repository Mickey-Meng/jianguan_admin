<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="构建类型名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入构建类型名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="构建类型编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入构建类型编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery('query')">搜索</el-button>
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
          v-hasPermi="['jg:componentType:add']"
        >新增</el-button>
      </el-col>      
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['jg:componentType:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['jg:componentType:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['jg:componentType:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="componentTypeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="true"/>
      <el-table-column label="工序库" align="center" prop="libraryId" />
      <el-table-column label="构建类型名称" align="center" prop="name" />
      <el-table-column label="构建类型编号" align="center" prop="code" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jg:componentType:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['jg:componentType:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleProduceItem(scope.row)"
          >工序维护</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改构建类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="所属工序库" prop="libraryId">
                <treeselect
                  :multiple="false"
                  :searchable="true"
                  v-model="form.libraryId"
                  :options="produceLibraryTreeOptions"
                  :normalizer="normalizer"
                  :show-count="true"
                  placeholder="选择工序库"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="构建类型名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入构建类型名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="构建类型编号" prop="code">
                <el-input v-model="form.code" placeholder="请输入构建类型编号" />
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
     <!-- 工序详情-->
     <produce-item :componentType="currentComponentType" ref="produceItem"/>
  </div>
</template>

<script>
import { listComponentType, getComponentType, delComponentType, addComponentType, updateComponentType } from "@/api/jianguan/produce/componentType";
import { listProduceLibrary } from "@/api/jianguan/produce/produceLibrary";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import produceItem from "./produceItem";
import bus from "@/utils/eventBus";

export default {
  name: "ComponentType",
  components: { Treeselect, produceItem },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 构建类型表格数据
      componentTypeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否编辑 true　修改true 查看详情false
      edit: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        libraryId: undefined,
        name: undefined,
        code: undefined,
      },
      //工序库下拉树
      produceLibraryTreeOptions: [],
      // 当前操作的工序库
      currentComponentType: undefined,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        libraryId: [
          { required: true, message: "工序库不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "构建类型名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "构建类型编号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    bus.$on("clickLibraryRow", libraryRow =>{
      this.queryParams.libraryId = libraryRow.id;
      this.getList();
    });
  },
  methods: {
    /** 查询构建类型列表 */
    getList() {
      this.loading = true;
      listComponentType(this.queryParams).then(response => {
        this.componentTypeList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        libraryId: undefined,
        name: undefined,
        code: undefined,
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
    handleQuery(type) {
      this.queryParams.pageNum = 1;
      if (type === 'query') {
        this.queryParams.libraryId = undefined;
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
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
      this.title = "添加构建类型";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.edit = true;
      this.reset();
      const id = row.id || this.ids
      getComponentType(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改构建类型";
      });
    },
    
    /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.edit = false;
      this.reset();
      const id = row.id || this.ids
      getComponentType(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "查看构建类型";
      });
    },
    // 维护工序
    handleProduceItem(row){
      console.log("handleProduceItem...");
      console.log(row);
      this.currentComponentType = row;
      // 维护工序
      setTimeout(() =>{
          this.$refs.produceItem.show();
        }, 200);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateComponentType(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addComponentType(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除构建类型编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delComponentType(ids);
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
      this.download('system/componentType/export', {
        ...this.queryParams
      }, `componentType_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
