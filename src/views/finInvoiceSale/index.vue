<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="合同编号" prop="contractCode">
        <el-input
          v-model="queryParams.contractCode"
          placeholder="请输入合同编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发票编号" prop="invoiceNo">
        <el-input
          v-model="queryParams.invoiceNo"
          placeholder="请输入发票编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开票金额" prop="invoiceAmount">
        <el-input
          v-model="queryParams.invoiceAmount"
          placeholder="请输入本次开票金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开票日期" prop="invoiceDate">
        <el-date-picker clearable
                        v-model="queryParams.invoiceDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择开票日期">
        </el-date-picker>
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
          v-hasPermi="['ql:finInvoiceSale:add']"
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
          v-hasPermi="['ql:finInvoiceSale:edit']"
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
          v-hasPermi="['ql:finInvoiceSale:remove']"
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
          v-hasPermi="['ql:finInvoiceSale:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="finInvoiceSaleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="id" v-if="false"/>
      <el-table-column label="合同id" align="center" prop="contractId" v-if="false"/>
      <el-table-column label="合同编号" align="center" prop="contractCode"/>
      <el-table-column label="合同名称" align="center" prop="contractName"/>
      <el-table-column label="客户id" align="center" prop="customerId" v-if="false"/>
      <el-table-column label="客户名称" align="center" prop="customerName"/>
      <el-table-column label="发票编号" align="center" prop="invoiceNo"/>
      <el-table-column label="开票金额" align="center" prop="invoiceAmount"/>
      <el-table-column label="开票日期" align="center" prop="invoiceDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.invoiceDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ql:finInvoiceSale:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ql:finInvoiceSale:remove']"
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

    <!-- 添加或修改销售开票对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contractCode">
              <el-autocomplete
                style="width: 100%"
                v-model="form.contractCode"
                :fetch-suggestions="queryContractSaleSearchAsync"
                placeholder="请输入合同编号"
                @select="handleContractSaleSelect"
              ></el-autocomplete>
            </el-form-item>
            <input v-model="form.contractId" type="hidden"/>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="form.contractName" placeholder="请输入合同名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户id" prop="customerId">
              <el-input v-model="form.customerId" placeholder="请输入客户id"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="form.customerName" placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票编号" prop="invoiceNo">
              <el-input v-model="form.invoiceNo" placeholder="请输入发票编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="本次开票金额" prop="invoiceAmount">
              <el-input v-model="form.invoiceAmount" placeholder="请输入本次开票金额"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票日期" prop="invoiceDate">
              <el-date-picker clearable
                              v-model="form.invoiceDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择开票日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行流水截图" prop="fj">
              <el-input v-model="form.fj" type="textarea" placeholder="请输入内容"/>
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
import {
  listFinInvoiceSale,
  getFinInvoiceSale,
  delFinInvoiceSale,
  addFinInvoiceSale,
  updateFinInvoiceSale
} from "@/api/finInvoiceSale/finInvoiceSale";
import {listContractInfoSale} from "@/api/contractInfoSale/contractInfoSale";

export default {
  name: "FinInvoiceSale",
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
      // 销售开票表格数据
      finInvoiceSaleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractId: undefined,
        contractCode: undefined,
        contractName: undefined,
        customerId: undefined,
        customerName: undefined,
        invoiceNo: undefined,
        invoiceAmount: undefined,
        invoiceDate: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          {required: true, message: "id不能为空", trigger: "blur"}
        ],
        contractId: [
          {required: true, message: "合同id不能为空", trigger: "blur"}
        ],
        contractCode: [
          {required: true, message: "合同编号不能为空", trigger: "onchange"}
        ],
        contractName: [
          {required: true, message: "合同名称不能为空", trigger: "blur"}
        ],
        customerId: [
          {required: true, message: "客户id不能为空", trigger: "blur"}
        ],
        customerName: [
          {required: true, message: "客户名称不能为空", trigger: "blur"}
        ],
        invoiceNo: [
          {required: true, message: "发票编号不能为空", trigger: "blur"}
        ],
        invoiceAmount: [
          {required: true, message: "本次开票金额不能为空", trigger: "blur"}
        ],
        invoiceDate: [
          {required: true, message: "开票日期不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询销售开票列表 */
    getList() {
      this.loading = true;
      listFinInvoiceSale(this.queryParams).then(response => {
        this.finInvoiceSaleList = response.rows;
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
        contractId: undefined,
        contractCode: undefined,
        contractName: undefined,
        customerId: undefined,
        customerName: undefined,
        invoiceNo: undefined,
        invoiceAmount: undefined,
        invoiceDate: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        fj: undefined,
        deptId: undefined
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
      this.title = "添加销售开票";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getFinInvoiceSale(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改销售开票";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateFinInvoiceSale(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addFinInvoiceSale(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除销售开票编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delFinInvoiceSale(ids);
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
      this.download('ql/finInvoiceSale/export', {
        ...this.queryParams
      }, `finInvoiceSale_${new Date().getTime()}.xlsx`)
    },


    //关联销售合同

    queryContractSaleSearchAsync(queryString, cb) {
      const queryParams = {
        contractCode: queryString,
      };
      let flag = false;
      listContractInfoSale(queryParams).then(response => {
        flag = true;
        if (response.rows.length) {
          const d = response.rows.map(item => {
            return {
              value: item.contractCode,
              label: item.id,
              item: {
                id: item.id,
                contractCode: item.contractCode,
                customerName: item.customerName,
                customerId: item.customerId,
                contractName: item.contractName,
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

    handleContractSaleSelect(item) {
      this.form.contractCode = item.item.contractCode;
      this.form.customerName = item.item.customerName;
      this.form.customerId = item.item.customerId;
      this.form.contractName = item.item.contractName;
      this.form.contractId = item.item.id;
    },

  }
};
</script>
