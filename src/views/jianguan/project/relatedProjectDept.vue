<template>
  <!-- 导入表 -->
  <el-dialog title="关联部门" :visible.sync="visible" width="65%" top="15vh" append-to-body>
    <h4 class="form-header h4">项目信息</h4>
    <el-row>
      <el-form ref="form" :model="project" label-width="80px">
      <el-col :span="8" :offset="2">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="project.projectName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-form-item label="项目编码" prop="projectCode">
          <el-input  v-model="project.projectCode" disabled />
        </el-form-item>
      </el-col>
    </el-form>
    </el-row>

    <!--
      列表树相关参数：
        v-if="refreshTable"
        :default-expand-all="true"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    -->
    <el-row>
      <h4 class="form-header h4">部门信息</h4>
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :row-key="row => row.deptId"
        @row-click="clickRow"
        ref="deptTreeTable"
        @selection-change="handleSelectionChange"
        :data="deptList.slice((pageNum-1)*pageSize, pageNum*pageSize)">

        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column label="序号" type="index" align="center"/>
        <el-table-column prop="deptName" label="部门名称" width="500"></el-table-column>
        <el-table-column prop="orderNum" label="排序" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="200">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 分页格式
        pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getProjectDeptList"
    -->
    <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" />

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleDoRelatedDept">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getProjectDept, doRelatedDept } from "@/api/jianguan/project/project";

export default {
  props: ['project'],
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      visible: false,
      loading: true,
      // 分页信息
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 选中数组值
      deptIds: [],
      // 表数据
      deptList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    // 显示弹框
    show() {
      this.clearRowSelection();
      this.getProjectDeptList();
    },
    clickRow(row) {
      this.$refs.deptTreeTable.toggleRowSelection(row, true);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.deptIds = selection.map(item => item.deptId);
    },
    // 查询表数据
    getProjectDeptList() {
      this.visible = true;
      this.loading = true;
      getProjectDept(this.project.id, this.queryParams).then(response => {
        // this.deptList = this.handleTree(response.data, "deptId"); // 部门树格式
        /** 分页数据
          this.deptList = response.data.deptPageList.rows;
          this.total = response.data.deptPageList.total;
        **/
        this.deptList = response.data.deptAllList;
        this.pageNum = 1;
        this.pageSize = 10;
        this.total = this.deptList.length;
        console.log("getProjectDept->getProjectDept...");
        console.log(this.deptList);
        this.$nextTick(() => {
          this.deptList.forEach((row) => {
            this.$refs.deptTreeTable.toggleRowSelection(row, row.relatedProject === '1');
          });
        });
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
    /**
     * 关闭弹框
     */
    handleClose () {
      this.visible = false;
      this.clearRowSelection();
    },
    /**
     * 清空勾选的数据
     */
    clearRowSelection() {
      if (this.deptIds.length > 0) {
        this.deptIds = [];
        this.$refs.deptTreeTable.clearSelection(row);
      }
    },
    /** 导入按钮操作 */
    handleDoRelatedDept() {
      const deptIds = Array.from(new Set(this.deptIds)).join(",");
      if (deptIds == "") {
        this.$modal.msgError("请选择要关联的部门数据");
        return;
      }
      console.log("handleDoRelatedDept...");
      console.log({ deptIds: deptIds, projectId: this.project.id });
      doRelatedDept({ deptIds: deptIds, projectId: this.project.id }).then(res => {
        this.$modal.msgSuccess(res.msg);
        if (res.code === 200) {
          this.visible = false;
          this.$emit("ok");
        }
      });
    }
  }
};
</script>
