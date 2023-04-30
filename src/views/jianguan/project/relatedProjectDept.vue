<template>
  <!-- 导入表 -->
  <el-dialog title="关联部门" :visible.sync="visible" width="65%" top="15vh" append-to-body>
    <h4 class="form-header h4">项目信息</h4>
    <el-row>
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
    </el-row>
    
    <el-row>
      <h4 class="form-header h4">部门信息</h4>
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="deptList"
        row-key="deptId"
        :default-expand-all="isExpandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @selection-change="handleSelectionChange"
      >
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

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleDoRelatedDept">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listDept } from "@/api/system/dept";
import { doRelatedDept } from "@/api/jianguan/project/project";

export default {
  props: ['project', 'projectId'],
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      visible: false,
      loading: true,
      // 是否展开，默认全部展开
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 选中数组值
      deptIds: [],
      // 表数据
      deptList: []
    };
  },
  methods: {
    // 显示弹框
    show() {
      this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.deptIds = selection.map(item => item.deptId);
    },
    // 查询表数据
    getList() {
      console.log("getList...");
      listDept().then(response => {
        this.deptList = this.handleTree(response.data, "deptId");
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
    /** 导入按钮操作 */
    handleDoRelatedDept() {
      const deptIds = this.deptIds.join(",");
      if (deptIds == "") {
        this.$modal.msgError("请选择要关联的部门数据");
        return;
      }
      console.log("handleDoRelatedDept...");
      console.log({ deptIds: deptIds, projectId: this.project.id });
      doRelatedDept({ deptIds: deptIds, projectId: this.projectId }).then(res => {
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
