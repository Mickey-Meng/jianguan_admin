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
          v-hasPermi="['ql:finReceivable:add']"
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
          v-hasPermi="['ql:finReceivable:edit']"
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
          v-hasPermi="['ql:finReceivable:remove']"
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
          v-hasPermi="['ql:finReceivable:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="finReceivableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="id" v-if="false"/>
<!--      <el-table-column label="合同id" align="center" prop="contractId" v-if="false"/>-->
<!--      <el-table-column label="合同编号" align="center" prop="contractCode"/>-->
<!--      <el-table-column label="合同名称" align="center" prop="contractName"/>-->
<!--      <el-table-column label="客户id" align="center" prop="customerId" v-if="false"/>-->
      <el-table-column label="客户名称" align="center" prop="customerName"/>
      <el-table-column label="本次收款款金额" align="center" prop="receivableAmount" v-if="false"/>
      <el-table-column label="收款日期" align="center" prop="receivableDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receivableDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款摘要" align="center" prop="receivableSummary" v-if="false"/>
      <el-table-column label="收款账号" align="center" prop="accountNo"/>
      <el-table-column label="开户银行" align="center" prop="bankName"/>
      <el-table-column label="发票编号" align="center" prop="invoiceNo"/>
      <el-table-column label="备注" align="center" prop="remark" v-if="false"/>
      <el-table-column label="部门ID" align="center" prop="deptId" v-if="false"/>
      <el-table-column label="附件" align="center" prop="fj" v-if="false"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,false)"
            v-hasPermi="['ql:finReceivable:query']"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,true)"
            v-hasPermi="['ql:finReceivable:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ql:finReceivable:remove']"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleReport(scope.row)"
          >报表
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

    <!-- 添加或修改收款记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
<!--          <el-col :span="12">-->
<!--            <el-form-item label="合同编号" prop="contractCode">-->
<!--              <el-autocomplete-->
<!--                style="width: 100%"-->
<!--                v-model="form.contractCode"-->
<!--                :fetch-suggestions="queryContractSaleSearchAsync"-->
<!--                placeholder="请输入合同编号"-->
<!--                @select="handleContractSaleSelect"-->
<!--              ></el-autocomplete>-->
<!--            </el-form-item>-->
<!--            <input v-model="form.contractId" type="hidden"/>-->
<!--          </el-col>-->

<!--          <el-col :span="12">-->
<!--            <el-form-item label="合同名称" prop="contractName">-->
<!--              <el-input v-model="form.contractName" placeholder="请输入合同名称"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->

<!--          <el-col :span="12">-->
<!--            <el-form-item label="客户名称" prop="customerName">-->
<!--              <el-input v-model="form.customerName" placeholder="请输入客户名称"/>-->
<!--              <input v-model="form.customerId" type="hidden"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="本次收款款金额" prop="receivableAmount">-->
<!--              <el-input v-model="form.receivableAmount" placeholder="请输入本次收款款金额"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12" v-show="false">
            <el-form-item label="客户Id" prop="customerId"  >
              <el-input v-model="form.customerId"/>
              <input v-model="form.customerId" type="hidden"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-autocomplete
                style="width: 100%"
                v-model="form.customerName"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入供应商名称"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="收款日期" prop="receivableDate">
              <el-date-picker clearable
                              v-model="form.receivableDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择收款日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款摘要" prop="receivableSummary">
              <el-input v-model="form.receivableSummary" placeholder="请输入收款摘要"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款账号" prop="accountNo">
              <el-input v-model="form.accountNo" placeholder="请输入收款账号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行" prop="bankName">
              <el-input v-model="form.bankName" placeholder="请输入开户银行"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票编号" prop="invoiceNo">
              <el-input v-model="form.invoiceNo" placeholder="请输入发票编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="银行流水截图" prop="fj">
              <image-upload v-model="form.fj" ></image-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <wti-form ref="wtiForm" :fields="fields" :border-form="false" @updateValue="updateValue"
                      label-position="right" label-width="140px" child-label-width="120px" :data="form">
            </wti-form>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"  v-if="edit" >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listFinReceivable,
  getFinReceivable,
  delFinReceivable,
  addFinReceivable,
  updateFinReceivable
} from "@/api/finReceivable/finReceivable";
import {listContractInfoSale} from "@/api/contractInfoSale/contractInfoSale";
import fields from './fields';
import {
  listBasisCustomer,
} from "@/api/basisCustomer/basisCustomer";

export default {
  name: "FinReceivable",
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
      // 收款记录表格数据
      finReceivableList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      edit: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractId: undefined,
        contractCode: undefined,
        contractName: undefined,
        customerId: undefined,
        customerName: undefined,
        receivableAmount: undefined,
        receivableDate: undefined,
        receivableSummary: undefined,
        accountNo: undefined,
        bankName: undefined,
        invoiceNo: undefined,
        fj: undefined
      },
      // 表单参数
      form: {
        receivableOutboundRels:[]
      },
      // 表单校验
      rules: {
        id: [
          {required: true, message: "id不能为空", trigger: "blur"}
        ],
        contractId: [
        //   {required: true, message: "合同id不能为空", trigger: "blur"}
        // ],
        // contractCode: [
        //   {required: true, message: "合同编号不能为空", trigger: "onchange"}
        // ],
        // contractName: [
        //   {required: true, message: "合同名称不能为空", trigger: "blur"}
        ],
        customerId: [
        //   {required: true, message: "客户id不能为空", trigger: "blur"}
        // ],
        // customerName: [
        //   {required: true, message: "客户名称不能为空", trigger: "blur"}
        ],
        receivableAmount: [
          {required: true, message: "本次收款款金额不能为空", trigger: "blur"}
        ],
        receivableDate: [
          {required: true, message: "收款日期不能为空", trigger: "blur"}
        ],
        receivableSummary: [
          {required: true, message: "收款摘要不能为空", trigger: "blur"}
        ],
        accountNo: [
          {required: true, message: "收款账号不能为空", trigger: "blur"}
        ],
        bankName: [
          {required: true, message: "开户银行不能为空", trigger: "blur"}
        ],
        invoiceNo: [
          {required: true, message: "发票编号不能为空", trigger: "blur"}
        ]
      },
      fields
    };
  },
  created() {
    this.getList();
  },
  methods: {
    updateValue(params) {

    },
    /** 查询收款记录列表 */
    getList() {
      this.loading = true;
      listFinReceivable(this.queryParams).then(response => {
        this.finReceivableList = response.rows;
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
        receivableAmount: undefined,
        receivableDate: undefined,
        receivableSummary: undefined,
        accountNo: undefined,
        bankName: undefined,
        invoiceNo: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        deptId: undefined,
        fj: undefined
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
      this.edit = true;
      this.title = "添加收款记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row,isEdit) {
      this.loading = true;
      this.edit = isEdit;
      this.reset();
      const id = row.id || this.ids
      getFinReceivable(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改收款记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.receivableOutboundRels = this.$refs.wtiForm.formData.receivableOutboundRels;
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateFinReceivable(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addFinReceivable(this.form).then(response => {
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
    // 跳转到报表页面
    handleReport(row) {
      this.$router.push("/receivable?view=816087729222406144&id=" + row.id);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除收款记录编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delFinReceivable(ids);
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
      this.download('ql/finReceivable/export', {
        ...this.queryParams
      }, `finReceivable_${new Date().getTime()}.xlsx`)
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
                contractId: item.id,
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
      this.form.contractId = item.item.contractId;
      this.form.customerName = item.item.customerName;
      this.form.customerId = item.item.customerId;
      this.form.contractName = item.item.contractName;
    },

    querySearchAsync(queryString, cb) {
      const queryParams = {
        customerName: queryString,
      };
      let flag = false;
      listBasisCustomer(queryParams).then(response => {
        flag = true;
        if (response.rows.length) {
          const d = response.rows.map(item => {
            return {
              value: item.customerName,
              label: item.id,
              item: {
                customerId: item.id
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
      this.form.customerId = item.item.customerId;
      console.log(item);
      localStorage.setItem("finReceivable_customerId", item.item.customerId)
      localStorage.setItem("finReceivable_customerName", item.value)
    },
  }
};
</script>
