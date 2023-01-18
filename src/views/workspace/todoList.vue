<template>
  <div>
    <panel :title="'我的待办列表'" iconClass="more">
      <div slot="body">
        <div class="content">
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="70px">
            <el-form-item label="流程名称" prop="processName">
              <el-input
                v-model="queryParams.processName"
                placeholder="请输入流程名称"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="单号" prop="id">
              <el-input
                v-model="queryParams.id"
                placeholder="请输入单号"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table v-loading="loading" :header-cell-style="headercellStyle"
                  :cell-style="cellStyle" :data="contractInfoList">
            <el-table-column label="序号" align="center" width="80">
              <template slot-scope="scope">
                <div>
                  {{ (scope.$index)/queryParams.pageSize + 1  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="流程类型" align="center" min-width="100" prop="bdbh" />
            <el-table-column label="流程名称" align="center" min-width="100" prop="htbh" />
            <el-table-column label="单号" align="center" min-width="120" prop="xmmc" />
            <el-table-column label="审批节点" align="center" min-width="120" prop="xmmc" />
            <el-table-column label="流程发起人" align="center" min-width="120" prop="xmmc" />
            <el-table-column label="流程发起时间" align="center" min-width="120" prop="xmmc" />
            <el-table-column label="任务创建时间" align="center" min-width="120" prop="xmmc" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['contractInfo:contractInfo:edit']"
                >处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import panel from '@/components/Panel';
import { listContractInfo } from "@/api/contractInfo/contractInfo";
export default {
  components: {
    panel
  },
  data () {
    return {
      contractInfoList: [],
      queryParams: {
        processName: '',
        id: ''
      }
    }
  },
  methods: {
    /** 查询合同条款列表 */
    getList() {
      this.loading = true;
      listContractInfo(this.queryParams).then(response => {
        this.contractInfoList = response.rows;
        this.loading = false;
      });
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
}
</script>

<style lang="scss" scoped>
  .content {
    width: 100%;
    padding: 20px;
    .block {
      display: inline-block;
      width: 25%;
      padding: 20px 10px;
      >span {
        display: block;
        text-align: center;
      }
      .icon-custom {
        color: rgb(90, 184, 91);
        margin-bottom: 12px;
        .svg-icon {
          font-size: 48px;
        }
        .text {
          font-size: 14px;
        }
      }
    }
  }
</style>