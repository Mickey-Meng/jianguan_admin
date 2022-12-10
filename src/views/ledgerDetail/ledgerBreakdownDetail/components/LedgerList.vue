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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="contractBillList"
      :height="'calc(100vh - 455px)'"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="left"/>
      <el-table-column fixed="left" label="标段编号" prop="bdbh" min-width="90" :show-overflow-tooltip="true"/>
      <el-table-column label="子目号" align="center" min-width="120" :show-overflow-tooltip="true" prop="zmh"/>
      <el-table-column label="子目名称" align="center" min-width="180" :show-overflow-tooltip="true" prop="zmmc"/>
      <el-table-column label="单位" align="center" min-width="80" prop="dw"/>
      <el-table-column label="合同单价" align="center" min-width="110" prop="htdj"/>
      <el-table-column label="新增单价" align="center" min-width="110" prop="xzdj"/>
      <el-table-column label="合同数量" align="center" min-width="110" prop="htsl"/>
      <el-table-column label="修正数量" align="center" min-width="110" prop="xzsl"/>
      <el-table-column label="审核数量" align="center" min-width="110" prop="shsl"/>
      <el-table-column label="合同金额" align="center" min-width="110" prop="htje"/>
      <el-table-column label="修正金额" align="center" min-width="110" prop="xzje"/>
      <el-table-column label="审核金额" align="center" min-width="110" prop="shje"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
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
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  listContractBillPage,
  getContractBill,
  delContractBill,
  addContractBill,
  updateContractBill
} from "@/api/bill/contractBill";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ContractBill",
  dicts: ['data_status'],
  components: {
    Treeselect
  },
  props: {
    close: {
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 工程量清单表格数据
      contractBillList: [],
      // 弹出层标题
      title: "",
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
      // 选中的数据集合
      selectionList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工程量清单列表 */
    getList() {
      this.loading = true;
      listContractBillPage(this.queryParams).then(response => {
        this.contractBillList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
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
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // console.error('selection', selection);
      selection.forEach(row => {
        var list = [];
        if (this.selectionList.length) {
          list = this.selectionList.filters(v => v.id === row.id);
        }
        if (list.length === 1) {
          this.selectionList = this.selectionList.filters(v => v.id !== row.id);
        } else {
          row.action = 'add';
          this.selectionList = [...this.selectionList, row];
        }
      })
    },
    submitForm() {
      if (!this.selectionList.length) {

        console.log("123")
        this.$message.warning('请选择台账分解清单数据后点击确定！');
        return;
      }
      this.$emit('getSelectionData', this.selectionList);
      this.close();
    },
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;

  .dialog-footer {
    text-align: right;
    margin-top: 36px;
  }
}
</style>
