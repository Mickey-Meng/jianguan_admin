<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标段编号" prop="bdbh">
        <el-input
          v-model="queryParams.bdbh"
          placeholder="请输入标段编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="子目号" prop="zmh">
        <el-input
          v-model="queryParams.zmh"
          placeholder="请输入子目号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="子目名称" prop="zmmc">
        <el-input
          v-model="queryParams.zmmc"
          placeholder="请输入子目名称"
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
          v-hasPermi="['bill:contractBill:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="contractBillList"
      row-key="zmh"
      :default-expand-all="isExpandAll"
      :height="'cacl(100vh - 205px)'"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column fixed="left" label="标段编号" prop="bdbh" min-width="140" :show-overflow-tooltip="true"/>
      <el-table-column label="子目号" align="center" min-width="120" :show-overflow-tooltip="true" prop="zmh" />
      <el-table-column label="子目名称" align="center" min-width="180" :show-overflow-tooltip="true" prop="zmmc" />
      <el-table-column label="单位" align="center" min-width="80" prop="dw" />
      <el-table-column label="合同单价" align="center" min-width="110" prop="htdj" />
      <el-table-column label="新增单价" align="center" min-width="110" prop="xzdj" />
      <el-table-column label="合同数量" align="center" min-width="110" prop="htsl" />
      <el-table-column label="修正数量" align="center" min-width="110" prop="xzsl" />
      <el-table-column label="审核数量" align="center" min-width="110" prop="shsl" />
      <el-table-column label="合同金额" align="center" min-width="110" prop="htje" />
      <el-table-column label="修正金额" align="center" min-width="110" prop="xzje" />
      <el-table-column label="审核金额" align="center" min-width="110" prop="shje" />
      <!-- <el-table-column label="总数量" align="center" prop="zsl" />
      <el-table-column label="总金额" align="center" prop="zje" /> -->
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="树id" align="center" prop="parentId" /> -->
      <el-table-column fixed="right" label="操作" width="160" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bill:contractBill:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['bill:contractBill:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bill:contractBill:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改工程量清单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="850px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标段编号" prop="bdbh">
              <el-input v-model="form.bdbh" placeholder="请输入标段编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子目号" prop="zmh">
              <el-input v-model="form.zmh" placeholder="请输入子目号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子目名称" prop="zmmc">
              <el-input v-model="form.zmmc" placeholder="请输入子目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子目号父节点" prop="zmhParent">
              <treeselect v-model="form.zmhParent" :options="contractBillOptions" :normalizer="normalizer" placeholder="请选择子目号父节点" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子目号祖级列表" prop="zmhAncestors">
              <el-input v-model="form.zmhAncestors" placeholder="请输入子目号祖级列表" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="dw">
              <el-input v-model="form.dw" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同单价" prop="htdj">
              <el-input v-model="form.htdj" placeholder="请输入合同单价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新增单价" prop="xzdj">
              <el-input v-model="form.xzdj" placeholder="请输入新增单价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同数量" prop="htsl">
              <el-input v-model="form.htsl" placeholder="请输入合同数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同金额" prop="htje">
              <el-input v-model="form.htje" placeholder="请输入合同金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核数量" prop="shsl">
              <el-input v-model="form.shsl" placeholder="请输入审核数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核金额" prop="shje">
              <el-input v-model="form.shje" placeholder="请输入审核金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修正数量" prop="xzsl">
              <el-input v-model="form.xzsl" placeholder="请输入修正数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修正金额" prop="xzje">
              <el-input v-model="form.xzje" placeholder="请输入修正金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.data_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listContractBill, getContractBill, delContractBill, addContractBill, updateContractBill } from "@/api/bill/contractBill";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ContractBill",
  dicts: ['data_status'],
  components: {
    Treeselect
  },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 工程量清单表格数据
      contractBillList: [],
      // 工程量清单树选项
      contractBillOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        bdbh: undefined,
        zmh: undefined,
        zmmc: undefined,
        zmhParent: undefined,
        zmhAncestors: undefined,
        dw: undefined,
        htdj: undefined,
        xzdj: undefined,
        htsl: undefined,
        htje: undefined,
        shsl: undefined,
        shje: undefined,
        xzsl: undefined,
        xzje: undefined,
        zsl: undefined,
        zje: undefined,
        status: undefined,
        parentId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "ID不能为空", trigger: "blur" }
        ],
        bdbh: [
          { required: true, message: "标段编号不能为空", trigger: "blur" }
        ],
        zmh: [
          { required: true, message: "子目号不能为空", trigger: "blur" }
        ],
        zmmc: [
          { required: true, message: "子目名称不能为空", trigger: "blur" }
        ],
        zmhParent: [
          { required: true, message: "子目号父节点不能为空", trigger: "blur" }
        ],
        zmhAncestors: [
          { required: true, message: "子目号祖级列表不能为空", trigger: "blur" }
        ],
        dw: [
          { required: true, message: "单位不能为空", trigger: "blur" }
        ],
        htdj: [
          { required: true, message: "合同单价不能为空", trigger: "blur" }
        ],
        xzdj: [
          { required: true, message: "新增单价不能为空", trigger: "blur" }
        ],
        htsl: [
          { required: true, message: "合同数量不能为空", trigger: "blur" }
        ],
        htje: [
          { required: true, message: "合同金额不能为空", trigger: "blur" }
        ],
        shsl: [
          { required: true, message: "审核数量不能为空", trigger: "blur" }
        ],
        shje: [
          { required: true, message: "审核金额不能为空", trigger: "blur" }
        ],
        xzsl: [
          { required: true, message: "修正数量不能为空", trigger: "blur" }
        ],
        xzje: [
          { required: true, message: "修正金额不能为空", trigger: "blur" }
        ],
        zsl: [
          { required: true, message: "总数量不能为空", trigger: "blur" }
        ],
        zje: [
          { required: true, message: "总金额不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "树id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工程量清单列表 */
    getList() {
      this.loading = true;
      listContractBill(this.queryParams).then(response => {
        this.contractBillList = this.handleTree(response.data, "zmh", "zmhParent");
        this.loading = false;
      });
    },
    /** 转换工程量清单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.zmh,
        label: node.zmmc,
        children: node.children
      };
    },
	/** 查询工程量清单下拉树结构 */
    getTreeselect() {
      listContractBill().then(response => {
        this.contractBillOptions = [];
        const data = { zmh: 0, zmmc: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "zmh", "zmhParent");
        this.contractBillOptions.push(data);
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
        id: null,
        bdbh: null,
        zmh: null,
        zmmc: null,
        zmhParent: null,
        zmhAncestors: null,
        dw: null,
        htdj: null,
        xzdj: null,
        htsl: null,
        htje: null,
        shsl: null,
        shje: null,
        xzsl: null,
        xzje: null,
        zsl: null,
        zje: null,
        status: "0",

        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        parentId: null
      };
      this.resetForm("form");
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
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.zmh) {
        this.form.zmhParent = row.zmh;
      } else {
        this.form.zmhParent = 0;
      }
      this.open = true;
      this.title = "添加工程量清单";
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
	  this.loading = true;
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.zmhParent = row.zmh;
      }
      getContractBill(row.id).then(response => {
	    this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改工程量清单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
		  this.buttonLoading = true;
          if (this.form.id != null) {
            updateContractBill(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addContractBill(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除工程量清单编号为"' + row.id + '"的数据项？').then(() => {
        this.loading = true;
        return delContractBill(row.id);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
  .app-container {
    height: 100%;
    .el-table {
      height: calc(100% - 100px);
      overflow: auto;
    }
  }
</style>
