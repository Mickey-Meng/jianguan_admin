<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="empName">
        <el-input
          v-model="queryParams.empName"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证" prop="empId">
        <el-input
          v-model="queryParams.empId"
          placeholder="请输入身份证号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobilePhone">
        <el-input
          v-model="queryParams.mobilePhone"
          placeholder="请输入手机号"
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
          v-hasPermi="['finEmp:finEmp:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['finEmp:finEmp:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['finEmp:finEmp:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['finEmp:finEmp:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="finEmpList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ID ,主键" align="center" prop="id" v-if="false"/>
      <el-table-column label="姓名" align="center" prop="empName"/>
      <el-table-column label="年龄" align="center" prop="empAge"/>
      <el-table-column label="性别" align="center" prop="empGender">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.empGender"/>
        </template>
      </el-table-column>
      <el-table-column label="基础工资" align="center" prop="empBasepay"/>
      <el-table-column label="身份证号码" align="center" prop="empId" width="220"/>
      <el-table-column label="手机号" align="center" prop="mobilePhone"/>
      <el-table-column label="紧急联系人" align="center" prop="emergencyContact"/>
      <el-table-column label="紧急联系人电话" align="center" prop="emergencyPhone"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['finEmp:finEmp:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['finEmp:finEmp:remove']"
          >删除
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

    <!-- 添加或修改员工信息管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="empName">
            <el-input v-model="form.empName" placeholder="请输入姓名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="empAge">
            <el-input v-model="form.empAge" placeholder="请输入年龄"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="empGender">
            <el-select v-model="form.empGender" placeholder="请选择性别">
              <el-option
                v-for="dict in dict.type.sys_user_sex"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期" prop="empRzDate">
            <el-date-picker clearable
                            v-model="form.empRzDate"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择入职日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门描述" />
            </el-form-item>
          </el-col>
        <el-col :span="12">
          <el-form-item label="基础工资" prop="empBasepay">
            <el-input v-model="form.empBasepay" placeholder="请输入基础工资"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号码" prop="empId">
            <el-input v-model="form.empId" placeholder="请输入身份证号码"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="家庭住址" prop="empAddr">
            <el-input v-model="form.empAddr" placeholder="请输入家庭住址"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="mobilePhone">
            <el-input v-model="form.mobilePhone" placeholder="请输入手机号"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="紧急联系人" prop="emergencyContact">
            <el-input v-model="form.emergencyContact" placeholder="请输入紧急联系人"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="紧急联系人电话" prop="emergencyPhone">
            <el-input v-model="form.emergencyPhone" placeholder="请输入紧急联系人电话"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listFinEmp, getFinEmp, delFinEmp, addFinEmp, updateFinEmp} from "@/api/finEmp/finEmp";

export default {
  name: "FinEmp",
  dicts: ['sys_user_sex'],
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
      // 员工信息管理表格数据
      finEmpList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        empName: undefined,
        empId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          {required: true, message: "ID ,主键不能为空", trigger: "blur"}
        ],
        empName: [
          {required: true, message: "姓名不能为空", trigger: "blur"}
        ],
        empGender: [
          {required: true, message: "性别不能为空", trigger: "change"}
        ],
        empBasepay: [
          {required: true, message: "基础工资不能为空", trigger: "blur"}
        ],
        empId: [
          {required: true, message: "身份证号码不能为空", trigger: "blur"}
        ],
        mobilePhone: [
          {required: true, message: "手机号不能为空", trigger: "blur"}
        ],
        deptName: [
          {required: true, message: "部门不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询员工信息管理列表 */
    getList() {
      this.loading = true;
      listFinEmp(this.queryParams).then(response => {
        this.finEmpList = response.rows;
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
        empName: undefined,
        empAge: undefined,
        empGender: undefined,
        empRzDate: undefined,
        empBasepay: undefined,
        deptName: undefined,
        empId: undefined,
        empAddr: undefined,
        delFlag: undefined,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加员工信息管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getFinEmp(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改员工信息管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateFinEmp(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addFinEmp(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除员工信息管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delFinEmp(ids);
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
      this.download('finEmp/finEmp/export', {
        ...this.queryParams
      }, `finEmp_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
