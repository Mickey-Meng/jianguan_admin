<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="报销订单ID" prop="reimbursementOrderId">
        <el-input
          v-model="queryParams.reimbursementOrderId"
          placeholder="请输入报销订单ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消费日期" prop="reimbursementDate">
        <el-date-picker clearable
          v-model="queryParams.reimbursementDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择消费日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="消费金额" prop="finAmount">
        <el-input
          v-model="queryParams.finAmount"
          placeholder="请输入消费金额"
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
          v-hasPermi="['finReimbursementItem:finReimbursementItem:add']"
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
          v-hasPermi="['finReimbursementItem:finReimbursementItem:edit']"
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
          v-hasPermi="['finReimbursementItem:finReimbursementItem:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['finReimbursementItem:finReimbursementItem:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="finReimbursementItemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="true"/>
      <el-table-column label="报销订单ID" align="center" prop="reimbursementOrderId" />
      <el-table-column label="报销类型" align="center" prop="finReimbursementType" />
      <el-table-column label="消费日期" align="center" prop="reimbursementDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reimbursementDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费金额" align="center" prop="finAmount" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['finReimbursementItem:finReimbursementItem:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['finReimbursementItem:finReimbursementItem:remove']"
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

    <!-- 添加或修改费用报销明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="报销订单ID" prop="reimbursementOrderId">
          <el-input v-model="form.reimbursementOrderId" placeholder="请输入报销订单ID" />
        </el-form-item>
        <el-form-item label="消费日期" prop="reimbursementDate">
          <el-date-picker clearable
            v-model="form.reimbursementDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择消费日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="消费金额" prop="finAmount">
          <el-input v-model="form.finAmount" placeholder="请输入消费金额" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listFinReimbursementItem, getFinReimbursementItem, delFinReimbursementItem, addFinReimbursementItem, updateFinReimbursementItem } from "@/api/finReimbursementItem/finReimbursementItem";

export default {
  name: "FinReimbursementItem",
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
      // 费用报销明细表格数据
      finReimbursementItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        reimbursementOrderId: undefined,
        finReimbursementType: undefined,
        reimbursementDate: undefined,
        finAmount: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "id不能为空", trigger: "blur" }
        ],
        reimbursementOrderId: [
          { required: true, message: "报销订单ID不能为空", trigger: "blur" }
        ],
        finReimbursementType: [
          { required: true, message: "报销类型不能为空", trigger: "change" }
        ],
        reimbursementDate: [
          { required: true, message: "消费日期不能为空", trigger: "blur" }
        ],
        finAmount: [
          { required: true, message: "消费金额不能为空", trigger: "blur" }
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
    /** 查询费用报销明细列表 */
    getList() {
      this.loading = true;
      listFinReimbursementItem(this.queryParams).then(response => {
        this.finReimbursementItemList = response.rows;
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
        reimbursementOrderId: undefined,
        finReimbursementType: undefined,
        reimbursementDate: undefined,
        finAmount: undefined,
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加费用报销明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getFinReimbursementItem(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改费用报销明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateFinReimbursementItem(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addFinReimbursementItem(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除费用报销明细编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delFinReimbursementItem(ids);
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
      this.download('finReimbursementItem/finReimbursementItem/export', {
        ...this.queryParams
      }, `finReimbursementItem_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
