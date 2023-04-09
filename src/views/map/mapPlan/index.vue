<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--方案树列表-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="mapPlanName"
            placeholder="请输入方案名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="mapPlanTreeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>

      <!--关联的地图服务数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="方案名称" prop="planName">
            <el-input
              v-model="queryParams.planName"
              placeholder="请输入方案名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="分组类型" prop="groupType">
            <el-input
              v-model="queryParams.groupType"
              placeholder="请输入分组类型"
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
              type="warning"
              plain
              icon="el-icon-import"
              size="mini"
              @click="openImportMapConfig"
              v-hasPermi="['map:mapServerConfig:list']"
            >导入地图服务数据</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="mapServerConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" v-if="false"/>
      <el-table-column label="服务名称" align="center" prop="serverName" />
      <el-table-column label="服务编码" align="center" prop="serverCode" />
      <el-table-column label="服务地址" align="center" prop="serverUrl" width="150"/>
      <el-table-column label="服务类型" align="center" prop="serverType" />
      <el-table-column label="是否可见" align="center" prop="visiable" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.visiable"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="属性信息" align="center" prop="attrbuites" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="添加时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:mapServerConfig:remove']"
          >删除</el-button>
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
      </el-col>
    </el-row>

    <!-- 添加或修改地图方案管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-row :gutter="20">
<el-col :span="12">
        <el-form-item label="方案名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入方案名称" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="父级ID" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父级ID" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="层级" prop="level">
          <el-input v-model="form.level" placeholder="请输入层级" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="分组" prop="group">
          <el-input v-model="form.group" placeholder="请输入分组" />
        </el-form-item>
</el-col><el-col :span="12">
</el-col><el-col :span="12">
        <el-form-item label="顺序编号" prop="orderNumber">
          <el-input v-model="form.orderNumber" placeholder="请输入顺序编号" />
        </el-form-item>
</el-col><el-col :span="12">
</el-col>          </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 导入地图服务列表-->
    <import-map-config ref="importMapConfig" @ok="handleQuery" />
  </div>
</template>

<script>
import { listMapPlan, getMapPlan, delMapPlan, addMapPlan, updateMapPlan, getMapPlanTree } from "@/api/map/mapPlan";
import importMapConfig from "./importMapConfig";

export default {
  name: "mapPlan",
  components: { importMapConfig },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 方案树选项
      mapPlanTreeData: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 方案名称
      mapPlanName: undefined,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 地图方案管理表格数据
      planList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planName: undefined,
        parentId: undefined,
        level: undefined,
        group: undefined,
        status: undefined,
        orderNumber: undefined,
        groupType: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        planName: [
          { required: true, message: "方案名称不能为空", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "父级ID不能为空", trigger: "blur" }
        ],
        level: [
          { required: true, message: "层级不能为空", trigger: "blur" }
        ],
        group: [
          { required: true, message: "分组不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        orderNumber: [
          { required: true, message: "顺序编号不能为空", trigger: "blur" }
        ],
        groupType: [
          { required: true, message: "分组类型不能为空", trigger: "change" }
        ],
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    mapPlanName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getMapPlanTree();
  },
  methods: {
    /** 查询部门下拉树结构 */
    getMapPlanTree() {
      getMapPlanTree().then(response => {
        this.mapPlanTreeData = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.parentId = data.id;
      this.handleQuery();
    },
    /** 查询地图方案管理列表 */
    getList() {
      this.loading = true;
      listMapPlan(this.queryParams).then(response => {
        this.planList = response.rows;
        this.total = response.total;
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
        id: undefined,
        planName: undefined,
        parentId: undefined,
        level: undefined,
        group: undefined,
        status: "0",
        orderNumber: undefined,
        groupType: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
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

    /** 打开导入表弹窗 */
    openImportMapConfig() {
      this.$refs.importMapConfig.show();
    },



    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加地图方案管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getMapPlan(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改地图方案管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateMapPlan(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addMapPlan(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除地图方案管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delMapPlan(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/plan/export', {
        ...this.queryParams
      }, `plan_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
