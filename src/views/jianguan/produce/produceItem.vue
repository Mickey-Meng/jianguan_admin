<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="tableOpen" width="1100px" append-to-body>
      <h4 class="form-header h4">构建类型信息</h4>
      <el-row>
          <el-form :model="componentType" label-width="100px">
              <el-col :span="8" :offset="2">
                  <el-form-item label="构建类型名称" prop="name">
                  <el-input v-model="componentType.name" disabled />
                  </el-form-item>
              </el-col>
              <el-col :span="8" :offset="2">
                  <el-form-item label="构建类型编码" prop="code">
                  <el-input  v-model="componentType.code" disabled />
                  </el-form-item>
              </el-col>
          </el-form>
      </el-row>
      <el-row>
        <h4 class="form-header h4">工序信息</h4>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="工序名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入工序名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="是否有效" prop="isEffect">

            <el-select
                v-model="queryParams.isEffect"
                placeholder="是否有效"
                clearable
                @keyup.enter.native="handleQuery"
                style="width: 240px"
              >
                <el-option
                  v-for="dict in dict.type.jg_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['jg:produce:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['jg:produce:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['jg:produce:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <!--
        v-if="refreshTable"
        v-loading="loading"
        :row-key="row => row.id"
        @row-click="clickRow"
        ref="produceListTable"
        @selection-change="handleSelectionChange"
        :data="produceList.slice((pageNum-1)*pageSize, pageNum*pageSize)"
       -->
        <el-table v-loading="loading" :data="produceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="工序名称" align="center" prop="name" />
        <el-table-column label="工序顺序" align="center" prop="orderNum" />
        <el-table-column label="是否有效" align="center" prop="isEffect" >
          <template slot-scope="scope">
              <dict-tag :options="dict.type.jg_yes_no" :value="scope.row.isEffect"/>
            </template>
        </el-table-column>

        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['jg:produce:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['jg:produce:remove']"
            >删除</el-button>

            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleOnlineForms(scope.row)"
            >在线表单</el-button>

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
      <div slot="footer" class="dialog-footer">
        <el-button @click="tableOpen = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改工序信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="工序名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入工序名称" />
              </el-form-item>
            </el-col><el-col :span="24">
              <el-form-item label="工序顺序" prop="orderNum">
                <el-input v-model="form.orderNum" placeholder="请输入工序顺序" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="是否有效" prop="isEffect">
                <el-radio-group v-model="form.isEffect">
                  <el-radio
                    v-for="dict in dict.type.jg_yes_no"
                    :key="dict.value"
                    :label="dict.value"
                  >{{dict.label}}</el-radio>
                </el-radio-group>
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
      <!-- 在线表单 -->
      <online-forms :produceItem="currentProduceItem" ref="onlineForms"/>
  </div>
</template>

<script>
import { listProduce, listProduceByTypeId, getProduce, delProduce, addProduce, updateProduce,importProduces } from "@/api/jianguan/produce/produce";
import onlineForms from "./onlineForms";

export default {
  name: "ProduceItem",
  components: { onlineForms },
  dicts:['jg_yes_no'],
  props: ['componentType'],
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
      // 总条数
      total: 0,
      // 工序信息表格数据
      produceList: [],
      // 弹出层标题
      title: "",
      // 是否显示工序明细维护弹出层
      tableOpen: false,
      // 是否显示弹出层
      open: false,
      // 是否编辑 true　修改true 查看详情false
      edit: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 分页信息
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        conponentTypeCode: undefined,
        name: undefined,
        orderNum: undefined,
        isEffect: undefined,
      },
      currentProduceItem: undefined,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        componentTypeCode: [
          { required: true, message: "构建类型编码不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "工序名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        isEffect: [
          { required: true, message: "不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    //this.getList();
  },
  methods: {
    // 显示弹框
    show() {
      this.tableOpen = true;
      this.title = "工序信息";
      this.getList();
    },
    clickRow(row) {
      this.$refs.produceListTable.toggleRowSelection(row, true);
    },
    /** 查询工序信息列表 */
    getList() {
      this.loading = true;
      console.log("获取到的构建类型ID:" + this.componentType.id);
      this.queryParams.componentTypeId = this.componentType.id;
      listProduce(this.queryParams).then(response => {
       // this.produceList = response.data.produceAllList;
        this.produceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        conponentTypeCode: undefined,
        name: undefined,
        orderNum: undefined,
        isEffect: undefined,
        remark: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
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
      this.title = "添加工序信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.edit = true;
      this.reset();
      const id = row.id || this.ids
      getProduce(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改工序信息";
      });
    },
    
    /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.edit = false;
      this.reset();
      const id = row.id || this.ids
      getProduce(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "查看工序信息";
      });
    },

    // 在线表单
    handleOnlineForms(row){
      this.currentProduceItem = row;
      // 在线表单
      setTimeout(() =>{
        this.$refs.onlineForms.onLuckySheetReady();
      }, 200);
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.componentTypeId = this.componentType.id;
          this.form.componentTypeCode = this.componentType.code;
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateProduce(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addProduce(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除工序信息编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delProduce(ids);
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
      this.download('system/produce/export', {
        ...this.queryParams
      }, `produce_${new Date().getTime()}.xlsx`)
    },
    //导入工序明细
    handleImportProduce(){
      const produceIds = this.ids.join(",");
      if (produceIds === "") {
        this.$modal.msgError("请选择要维护的工序数据!");
        return;
      }
      importProduces(produceIds, { componentTypeId: this.componentType.id, componentTypeCode: this.componentType.code }).then(res => {
        this.$modal.msgSuccess(res.msg);
        if (res.code === 200) {
          this.tableOpen = false;
          // this.$emit("ok");
        }
      });
    }
  }
};
</script>
