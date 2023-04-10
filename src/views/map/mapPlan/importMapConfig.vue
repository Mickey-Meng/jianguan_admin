<template>
  <!-- 导入表 -->
  <el-dialog title="导入地图服务" :visible.sync="visible" width="65%" top="15vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="服务名称" prop="serverName">
        <el-input
          v-model="queryParams.serverName"
          placeholder="请输入服务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务地址" prop="serverUrl">
        <el-input
          v-model="queryParams.serverUrl"
          placeholder="请输入服务地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务类型" prop="serverType">
        <el-input
          v-model="queryParams.serverType"
          placeholder="请输入服务类型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table @row-click="clickRow" ref="table" :data="importMapConfigList" @selection-change="handleSelectionChange" height="260px">
        <el-table-column type="selection" width="55" />
        <el-table-column label="服务名称" align="center" prop="serverName" />
        <el-table-column label="服务编码" align="center" prop="serverCode" />
        <el-table-column label="服务地址" align="center" prop="serverUrl" width="150"/>
        <el-table-column label="服务类型" align="center" prop="serverType" />
        <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="属性信息" align="center" prop="attrbuites" />
        <el-table-column label="服务缩率图" align="center" prop="thumbnail" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleImportMapConfig">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listMapServerConfig } from "@/api/map/mapServerConfig";
import { importMapConfig } from "@/api/map/mapPlanServer";
export default {
  props: ['mapPlanId'],
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      mapServerIds: [],
      // 总条数
      total: 0,
      // 表数据
      importMapConfigList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tableName: undefined,
        tableComment: undefined
      }
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
      this.mapServerIds = selection.map(item => item.id);
    },
    // 查询表数据
    getList() {
      listMapServerConfig(this.queryParams).then(res => {
        if (res.code === 200) {
          this.importMapConfigList = res.rows;
          this.total = res.total;
        }
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
    /** 导入按钮操作 */
    handleImportMapConfig() {
      const mapServerIds = this.mapServerIds.join(",");
      if (mapServerIds == "") {
        this.$modal.msgError("请选择要导入的地图服务配置数据");
        return;
      }
      importMapConfig({ serverIds: mapServerIds, planId: this.mapPlanId }).then(res => {
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
