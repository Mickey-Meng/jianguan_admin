<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="10">
       <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="标段编号" prop="bdbh">
            <el-input
            v-model="queryParams.bdbh"
            placeholder="请输入标段编号"
            clearable
            @keyup.enter.native="handleQuery"
            />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
        </el-form>
      </el-col> -->
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>
    <el-table v-loading="loading" :header-cell-style="headercellStyle"
      :cell-style="cellStyle" :data="ledgerApprovalNoList">
      <el-table-column label="一级子目录" align="center" prop="zmmc" />
      <el-table-column label="原始清单金额" align="center" prop="zje" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
        {{ dealNumberFormat(Number(scope.row.zje)) }}
        </template>
      </el-table-column>
      <el-table-column label="变更清单金额" align="center" prop="bgje" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
        {{ dealNumberFormat(Number(scope.row.bgje)) }}
        </template>
      </el-table-column>
      <el-table-column label="分解总金额（元）" align="center" prop="shje" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
        {{ dealNumberFormat(Number(scope.row.shje)) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { chapterCollectBill } from "@/api/bill/contractBill";
import { dealNumberFormat } from "@/utils/utils.js";
export default {
  name: "LedgerApprovalNo",
  dicts: ['data_status'],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      showSearch: true,
      // 期数管理表格数据
      ledgerApprovalNoList: [],
      // 查询参数
      queryParams: {
      },
      headercellStyle: {
          fontFamily: 'PingFangSC-Regular',
          background: '#F7F8FB',
          color: '#12182A',
          fontWeight: 600,
          height: '44px',
          fontSize: '14px',
      },
      cellStyle: {
          fontFamily: 'PingFangSC-Regular',
          color: '#3A4566',
          height: '44px',
          fontSize: '14px',
      },
      dealNumberFormat
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询期数管理列表 */
    getList() {
      this.loading = true;
      chapterCollectBill(this.queryParams).then(response => {
        this.ledgerApprovalNoList = response.data;
      }).finally(() => {
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
  }
};
</script>
