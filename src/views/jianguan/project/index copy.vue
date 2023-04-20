<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编码" prop="projectCode">
        <el-input
          v-model="queryParams.projectCode"
          placeholder="请输入编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="父级ID" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入父级ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门类型" prop="projectArea">
        <el-input
          v-model="queryParams.projectArea"
          placeholder="请输入部门类型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <el-form-item label="合同号" prop="contractNum">
        <el-input
          v-model="queryParams.contractNum"
          placeholder="请输入合同号"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['jg:project:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['jg:project:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['jg:project:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['jg:project:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="projectInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" v-if="true"/>
      <el-table-column label="名称" align="center" prop="projectName" />
      <el-table-column label="编码" align="center" prop="projectCode" />
      <el-table-column label="父级ID" align="center" prop="parentId" />
      <el-table-column label="部门类型" align="center" prop="projectArea" />
      <el-table-column label="级别" align="center" prop="groupLevel" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="是否显示" align="center" prop="visible" />
      <el-table-column label="顺序" align="center" prop="orderNum" />
      <el-table-column label="组织ID" align="center" prop="groupId" />
      <el-table-column label="是否自管" align="center" prop="isAuto" />
      <el-table-column label="项目照片" align="center" prop="projectPic" />
      <el-table-column label="合同号" align="center" prop="contractNum" />
      <el-table-column label="坐标" align="center" prop="coordinate" />
      <el-table-column label="投资金额" align="center" prop="investment" />
      <el-table-column label="项目类型" align="center" prop="projectType" />
      <el-table-column label="项目点" align="center" prop="projectPoint" />
      <el-table-column label="项目线" align="center" prop="projectLine" />
      <el-table-column label="项目面" align="center" prop="projectSurface" />
      <el-table-column label="项目简介" align="center" prop="introduction" :show-overflow-tooltip="true" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" fixed="right ">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jg:project:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['jg:project:remove']"
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

    <!-- 添加或修改项目信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-row :gutter="20">
<el-col :span="12">
        <el-form-item label="名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入名称" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="编码" prop="projectCode">
          <el-input v-model="form.projectCode" placeholder="请输入编码" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="父级ID" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父级ID" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="部门类型" prop="projectArea">
          <el-input v-model="form.projectArea" placeholder="请输入部门类型" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="级别" prop="groupLevel">
          <el-input v-model="form.groupLevel" placeholder="请输入级别" />
        </el-form-item>
</el-col><el-col :span="12">
</el-col><el-col :span="12">
        <el-form-item label="是否显示" prop="visible">
          <el-input v-model="form.visible" placeholder="请输入是否显示" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入顺序" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="组织ID" prop="groupId">
          <el-input v-model="form.groupId" type="textarea" placeholder="请输入内容" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="是否自管" prop="isAuto">
          <el-input v-model="form.isAuto" placeholder="请输入是否自管" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="项目照片" prop="projectPic">
          <el-input v-model="form.projectPic" type="textarea" placeholder="请输入内容" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="合同号" prop="contractNum">
          <el-input v-model="form.contractNum" placeholder="请输入合同号" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="坐标" prop="coordinate">
          <el-input v-model="form.coordinate" type="textarea" placeholder="请输入内容" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="投资金额" prop="investment">
          <el-input v-model="form.investment" placeholder="请输入投资金额" />
        </el-form-item>
</el-col><el-col :span="12">
</el-col><el-col :span="12">
        <el-form-item label="项目点" prop="projectPoint">
          <el-input v-model="form.projectPoint" placeholder="请输入项目点" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="项目线" prop="projectLine">
          <el-input v-model="form.projectLine" placeholder="请输入项目线" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="项目面" prop="projectSurface">
          <el-input v-model="form.projectSurface" placeholder="请输入项目面" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="项目简介" prop="introduction">
          <el-input v-model="form.introduction" type="textarea" placeholder="请输入内容" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
</el-col>          </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProjectInfo, getProjectInfo, delProjectInfo, addProjectInfo, updateProjectInfo } from "@/api/jianguan/project/project";

export default {
  name: "ProjectInfo",
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
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
      // 项目信息表格数据
      projectInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: undefined,
        projectCode: undefined,
        parentId: undefined,
        projectArea: undefined,
        groupLevel: undefined,
        status: undefined,
        visible: undefined,
        orderNum: undefined,
        groupId: undefined,
        isAuto: undefined,
        projectPic: undefined,
        contractNum: undefined,
        coordinate: undefined,
        investment: undefined,
        projectType: undefined,
        projectPoint: undefined,
        projectLine: undefined,
        projectSurface: undefined,
        introduction: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "自增主键不能为空", trigger: "blur" }
        ],
        projectName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        projectCode: [
          { required: true, message: "编码不能为空", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "父级ID不能为空", trigger: "blur" }
        ],
        projectArea: [
          { required: true, message: "部门类型不能为空", trigger: "blur" }
        ],
        groupLevel: [
          { required: true, message: "级别不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        visible: [
          { required: true, message: "是否显示不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "顺序不能为空", trigger: "blur" }
        ],
        groupId: [
          { required: true, message: "组织ID不能为空", trigger: "blur" }
        ],
        isAuto: [
          { required: true, message: "是否自管：0-否，1-是不能为空", trigger: "blur" }
        ],
        projectPic: [
          { required: true, message: "项目照片不能为空", trigger: "blur" }
        ],
        contractNum: [
          { required: true, message: "合同号不能为空", trigger: "blur" }
        ],
        coordinate: [
          { required: true, message: "坐标不能为空", trigger: "blur" }
        ],
        investment: [
          { required: true, message: "投资金额不能为空", trigger: "blur" }
        ],
        projectType: [
          { required: true, message: "项目类型不能为空", trigger: "change" }
        ],
        projectPoint: [
          { required: true, message: "项目点不能为空", trigger: "blur" }
        ],
        projectLine: [
          { required: true, message: "项目线不能为空", trigger: "blur" }
        ],
        projectSurface: [
          { required: true, message: "项目面不能为空", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "项目简介不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询项目信息列表 */
    getList() {
      this.loading = true;
      listProjectInfo(this.queryParams).then(response => {
        this.projectInfoList = response.rows;
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
        projectName: undefined,
        projectCode: undefined,
        parentId: undefined,
        projectArea: undefined,
        groupLevel: undefined,
        status: 0,
        visible: undefined,
        orderNum: undefined,
        groupId: undefined,
        isAuto: undefined,
        projectPic: undefined,
        contractNum: undefined,
        coordinate: undefined,
        investment: undefined,
        projectType: undefined,
        projectPoint: undefined,
        projectLine: undefined,
        projectSurface: undefined,
        introduction: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
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
      this.title = "添加项目信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getProjectInfo(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改项目信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateProjectInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addProjectInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除项目信息编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delProjectInfo(ids);
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
      this.download('system/projectInfo/export', {
        ...this.queryParams
      }, `projectInfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
