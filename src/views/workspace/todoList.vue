<template>
  <div>
    <panel :title="'我的待办列表'" iconClass="more">
      <div slot="body">
        <div class="content">
          <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <!-- <el-form-item label="流程名称" prop="procDefName">
              <el-input
                v-model="queryParams.procDefName"
                placeholder="请输入名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item> -->
            <el-form-item label="开始时间" prop="deployTime">
              <el-date-picker clearable size="small"
                              v-model="queryParams.deployTime"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table v-loading="loading" :data="todoList">
            <!-- <el-table-column type="selection" width="55" align="center"/> -->
            <el-table-column label="任务编号" align="left" prop="taskId" :show-overflow-tooltip="true"/>
            <el-table-column label="流程名称" align="center" prop="procDefName"/>
            <el-table-column label="任务节点" align="center" prop="taskName"/>
            <el-table-column label="流程版本" align="center">
              <template slot-scope="scope">
                <el-tag size="medium" >v{{scope.row.procDefVersion}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="流程发起人" align="center">
              <template slot-scope="scope">
                <label>{{scope.row.startUserName}} <el-tag type="info" size="mini">{{scope.row.startDeptName}}</el-tag></label>
              </template>
            </el-table-column>
            <el-table-column label="接收时间" align="center" prop="createTime" width="180"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit-outline"
                  @click="handleProcess(scope.row)"
                  v-hasPermi="['workflow:process:approval']"
                >办理
                </el-button>
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
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import panel from '@/components/Panel';
import { listTodoProcess } from '@/api/workflow/process';
export default {
  components: {
    panel
  },
  data () {
    return {
      total: 0,
      todoList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        procDefName: null,
        category: null
      },
      loading: false
    }
  },
  mounted () {
    this.getList();
  },
  methods: {
    /** 查询合同条款列表 */
    /** 查询流程定义列表 */
    getList() {
      this.loading = true;
      listTodoProcess(this.queryParams).then(response => {
        this.todoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 跳转到处理页面
    handleProcess(row) {
      this.$router.push({
        path: '/work/detail',
        query: {
          definitionId: row.procDefId,
          procInsId: row.procInsId,
          deployId: row.deployId,
          taskId: row.taskId,
          finished: true
        }
      })
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
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        category: null,
        key: null,
        tenantId: null,
        deployTime: null,
        derivedFrom: null,
        derivedFromRoot: null,
        parentDeploymentId: null,
        engineVersion: null
      };
      this.resetForm("form");
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