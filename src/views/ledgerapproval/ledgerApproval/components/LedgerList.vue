<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form-item label="标段编号" prop="bdbh">
        <el-input
          v-model="queryParams.bdbh"
          placeholder="请输入标段编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="子目号" prop="zmh">
        <el-input v-model="queryParams.zmh" placeholder="请输入子目号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="子目名称" prop="zmmc">
        <el-input v-model="queryParams.zmmc" placeholder="请输入子目名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="ledgerBreakdownDetailList" :height="'calc(100vh - 455px)'"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="left" />
      <el-table-column label="工程部位" fixed="left" align="center" prop="fjmulu" min-width="280"
        :show-overflow-tooltip="true" />
      <el-table-column label="子目号" align="left" prop="zmh" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column label="子目名称" align="center" prop="zmmc" min-width="140" :show-overflow-tooltip="true" />
      <el-table-column label="单位" align="center" prop="dw" min-width="100" :show-overflow-tooltip="true" />
      <el-table-column label="合同单价" align="center" prop="htdj" min-width="140" />
      <el-table-column label="设计数量" align="center" prop="sjsl" min-width="140" />
      <el-table-column label="分解数量" align="center" prop="fjsl" min-width="140" />
      <el-table-column label="变更数量" align="center" prop="bgsl" min-width="140" />
      <el-table-column label="变更分解数量" align="center" prop="bgfjsl" min-width="140" />
      <el-table-column label="已计量数量" align="center" prop="yjlsl" min-width="120" />
<!--      <el-table-column label="分解类型" align="center" prop="fjlx" min-width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.change_status" :value="scope.row.fjlx" />
        </template>
      </el-table-column>-->
      <el-table-column label="状态" align="center" prop="status" min-width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.data_status" :value="scope.row.status" />
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { listLedgerBreakdownLeaf } from "@/api/ledgerDetail/ledgerBreakdownDetail";
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
      default: () => { }
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 台账分解清单表格数据
      ledgerBreakdownDetailList: [],
      // 弹出层标题
      title: "",
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      total: 0,
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
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
        bgsl: undefined,
        bgje: undefined,
        zsl: undefined,
        zje: undefined,
        status: undefined,
        parentId: undefined,
        yjlsl: 0,
        // 台账分解流程取消，台账分解不再查询状态为2的数据，改为查询状态为0的数据
        // reviewCode: '2'  20230803 ,查询为0的数据
      },
      // 选中的数据集合
      selectionList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询台账分解明细清单列表 */
    getList() {
      this.loading = true;
        listLedgerBreakdownLeaf(this.queryParams).then(response => {
        this.ledgerBreakdownDetailList = response.data;
        // this.total = response.total;
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
        bgsl: null,
        bgje: null,
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
      // this.queryParams.pageNum = 1;
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
      this.selectionList = selection;
      // selection.forEach(row => {
      //   const list = [];
      //   if (this.selectionList.length) {
      //     list = this.selectionList.filters(v => v.id === row.id);
      //   }
      //   if (list.length === 1) {
      //     this.selectionList = this.selectionList.filters(v => v.id !== row.id);
      //   } else {
      //     row.action = 'add';
      //     this.selectionList = [...this.selectionList, row];
      //   }
      // })
    },
    submitForm() {
      if (!this.selectionList.length) {
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
