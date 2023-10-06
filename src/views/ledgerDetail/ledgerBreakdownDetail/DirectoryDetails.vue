<template>
  <el-table
    v-loading="loading"
    :header-cell-style="headercellStyle"
    :cell-style="cellStyle"
    :data="detailsData"
  >
    <el-table-column label="子目号" align="center" prop="zmh" />
    <el-table-column label="父级目录" align="center" prop="fjmulu" />
    <el-table-column label="设计数量" align="center" prop="sjsl" />
    <el-table-column label="分解数量" align="center" prop="fjsl" />
    <el-table-column label="变更数量" align="center" prop="bgsl" />
    <el-table-column label="已计量数量" align="center" prop="yjlsl" type="hidden"/>
  </el-table>
</template>
<script>
import { queryBreakdownDetails } from "@/api/ledgerDetail/ledgerBreakdownDetail";
export default {
  name: "MeasurementNo",
  data() {
    return {
      // 遮罩层
      loading: true,
      headercellStyle: {
        fontFamily: "PingFangSC-Regular",
        background: "#F7F8FB",
        color: "#12182A",
        fontWeight: 600,
        height: "44px",
        fontSize: "14px",
      },
      // 中间计量期数管理表格数据
      detailsData: [],
      cellStyle: {
        fontFamily: "PingFangSC-Regular",
        color: "#3A4566",
        height: "44px",
        fontSize: "14px",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() { //  台账分解明细，跳转到某子目号的详细分解明细
      this.loading = true;
      const query = {
        zmh: this.$route.query.zmh,
        // yjlsl: 0
      };
      queryBreakdownDetails(query).then((response) => {
        this.detailsData = response.data;
        this.loading = false;
      });
    },
  },
};
</script>
