<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="月份" prop="payDate">
        <el-date-picker clearable
          v-model="queryParams.payDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择月份">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="员工姓名" prop="empName">
        <el-input
          v-model="queryParams.empName"
          placeholder="请输入员工姓名"
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
          v-hasPermi="['finWages:finWages:add']"
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
          v-hasPermi="['finWages:finWages:edit']"
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
          v-hasPermi="['finWages:finWages:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['finWages:finWages:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="finWagesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="" align="center" prop="id" v-if="false"/>
      <el-table-column label="月份" align="center" prop="payDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工姓名" align="center" prop="empName" />
      <el-table-column label="出勤天数" align="center" prop="attendanceDays" />
      <el-table-column label="加班天数" align="center" prop="workOvertimeDays" />
      <el-table-column label="工资" align="center" prop="preTaxPay" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['finWages:finWages:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['finWages:finWages:remove']"
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

    <!-- 添加或修改工资管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="月份" prop="payDate">
              <el-date-picker clearable
                              v-model="form.payDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择月份">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工id" prop="empId">
              <el-input v-model="form.empId" placeholder="请输入员工id" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工姓名" prop="empName">
              <el-autocomplete
                style="width: 100%"
                v-model="form.empName"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入员工姓名"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="基础工资" prop="basePay">
              <el-input v-model="form.basePay" placeholder="请输入基础工资" onchange="updatePreTaxPay" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="基础天数" prop="baseDays">
              <el-input v-model="form.baseDays" placeholder="请输入基础天数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出勤天数" prop="attendanceDays">
              <el-input v-model="form.attendanceDays" placeholder="请输入出勤天数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法定假日公休天数" prop="legalHolidayDays">
              <el-input v-model="form.legalHolidayDays" placeholder="请输入法定假日公休天数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加班天数" prop="workOvertimeDays">
              <el-input v-model="form.workOvertimeDays" placeholder="请输入加班天数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出差天数" prop="evectionDays">
              <el-input v-model="form.evectionDays" placeholder="请输入出差天数" onchange="updatePreTaxPay"  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出差补贴" prop="evectionMoney">
              <el-input v-model="form.evectionMoney" placeholder="请输入出差补贴" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="全勤奖" prop="fullAttendanceBonus">
              <el-input v-model="form.fullAttendanceBonus" placeholder="请输入全勤奖" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="饭补" prop="mealAllowance">
              <el-input v-model="form.mealAllowance" placeholder="请输入饭补" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预付工资" prop="payInAdvance">
              <el-input v-model="form.payInAdvance" placeholder="请输入预付工资" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社保" prop="socialSecurity">
              <el-input v-model="form.socialSecurity" placeholder="请输入社保" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人所得税" prop="tax">
              <el-input v-model="form.tax" placeholder="请输入个人所得税" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税前工资" prop="preTaxPay">
              <el-input v-model="form.preTaxPay" placeholder="请输入税前工资" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税后工资" prop="afterTaxPay">
              <el-input v-model="form.afterTaxPay" placeholder="请输入税后工资" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际到手工资" prop="netPay">
              <el-input v-model="form.netPay" placeholder="请输入实际到手工资" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listFinWages, getFinWages, delFinWages, addFinWages, updateFinWages } from "@/api/finWages/finWages";
import {listFinEmp} from "@/api/finEmp/finEmp";

export default {
  name: "FinWages",
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
      // 工资管理表格数据
      finWagesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        payDate: undefined,
        empName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        payDate: [
          { required: true, message: "月份不能为空", trigger: "blur" }
        ],
        basePay: [
          { required: true, message: "基础工资不能为空", trigger: "blur" }
        ],
        baseDays: [
          { required: true, message: "基础天数不能为空", trigger: "blur" }
        ],
        attendanceDays: [
          { required: true, message: "出勤天数不能为空", trigger: "blur" }
        ],
        legalHolidayDays: [
          { required: true, message: "法定假日公休天数不能为空", trigger: "blur" }
        ],
        workOvertimeDays: [
          { required: true, message: "加班天数不能为空", trigger: "blur" }
        ],
        evectionDays: [
          { required: true, message: "出差天数不能为空", trigger: "blur" }
        ],
        evectionMoney: [
          { required: true, message: "出差补贴不能为空", trigger: "blur" }
        ],
        fullAttendanceBonus: [
          { required: true, message: "全勤奖不能为空", trigger: "blur" }
        ],
        mealAllowance: [
          { required: true, message: "饭补不能为空", trigger: "blur" }
        ],
        payInAdvance: [
          { required: true, message: "预付工资不能为空", trigger: "blur" }
        ],
        socialSecurity: [
          { required: true, message: "社保不能为空", trigger: "blur" }
        ],
        tax: [
          { required: true, message: "个人所得税不能为空", trigger: "blur" }
        ],
        preTaxPay: [
          { required: true, message: "税前工资不能为空", trigger: "blur" }
        ],
        afterTaxPay: [
          { required: true, message: "税后工资不能为空", trigger: "blur" }
        ],
        netPay: [
          { required: true, message: "实际到手工资不能为空", trigger: "blur" }
        ],
        empName: [
          { required: true, message: "员工姓名不能为空", trigger: "blur,change" }
        ],
        empId: [
          { required: true, message: "员工id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工资管理列表 */
    getList() {
      this.loading = true;
      listFinWages(this.queryParams).then(response => {
        this.finWagesList = response.rows;
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
        payDate: undefined,
        basePay: undefined,
        baseDays: undefined,
        attendanceDays: undefined,
        legalHolidayDays: undefined,
        workOvertimeDays: undefined,
        evectionDays: undefined,
        evectionMoney: undefined,
        fullAttendanceBonus: undefined,
        mealAllowance: undefined,
        payInAdvance: undefined,
        socialSecurity: undefined,
        tax: undefined,
        preTaxPay: undefined,
        afterTaxPay: undefined,
        netPay: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        empName: undefined,
        empId: undefined
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
    updatePreTaxPay(){

      this.form.preTaxPay = this.form.evectionMoney + this.form.basePay;
    }
    ,
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工资管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getFinWages(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改工资管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateFinWages(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addFinWages(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除工资管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delFinWages(ids);
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

      this.download('finWages/finWages/export', {
        ...this.queryParams
      }, `finWages_${new Date().getTime()}.xlsx`)
    },

    /*
    *    **/
    querySearchAsync(queryString, cb) {
      const queryParams = {
        empName: queryString,
      };
      let flag = false;
      listFinEmp(queryParams).then(response => {
        flag = true;
        if (response.rows.length) {
          const d = response.rows.map(item => {
            return {
              value: item.empName,
              label: item.empId,
              item: {
                empId: item.id,
              }
            };
          });
          cb(d);
        } else {
          cb([]);
        }
      }).finally(() => {
        if (!flag) {
          cb([]);
        }
      });

    },

    handleSelect(item) {
      this.form.empId = item.item.empId;
      console.log(item);
    }

  }

};
</script>
