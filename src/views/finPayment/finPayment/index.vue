<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!--      <el-form-item label="合同id" prop="contractId">
              <el-input
                v-model="queryParams.contractId"
                placeholder="请输入合同id"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>-->

      <el-form-item label="合同编号" prop="contractCode">
        <el-input
          v-model="queryParams.contractCode"
          placeholder="请输入合同编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>



      <el-form-item label="供应商" prop="supplierName">
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="本次付款金额" prop="payAmount">
              <el-input
                v-model="queryParams.payAmount"
                placeholder="请输入本次付款金额"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="欠付款金额" prop="unpaid">
              <el-input
                v-model="queryParams.unpaid"
                placeholder="请输入欠付款金额"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>-->
      <el-form-item label="付款时间" prop="paymentDate">
        <el-date-picker clearable
                        v-model="queryParams.paymentDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择付款时间">
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
          v-hasPermi="['finPayment:finPayment:add']"
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
          v-hasPermi="['finPayment:finPayment:edit']"
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
          v-hasPermi="['finPayment:finPayment:remove']"
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
          v-hasPermi="['finPayment:finPayment:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="finPaymentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="id" v-if="false"/>
      <el-table-column label="合同id" align="center" prop="contractId" v-if="false"/>
<!--      <el-table-column label="合同编号" align="center" prop="contractCode"/>-->
      <el-table-column label="供应商" align="center" prop="supplierName"/>
      <el-table-column label="本次付款金额" align="center" prop="payAmount"/>
      <el-table-column prop="payType" label="付款方式" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pay_type" :value="scope.row.payType"/>
        </template>
      </el-table-column>


      <el-table-column label="付款时间" align="center" prop="paymentDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.paymentDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" align="center" prop="remark" v-if="false"/>
      <el-table-column label="部门ID" align="center" prop="deptId" v-if="false"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,false)"
            v-hasPermi="['finPayment:finPayment:query']"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,true)"
            v-hasPermi="['finPayment:finPayment:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['finPayment:finPayment:remove']"
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

    <!-- 添加或修改供应商付款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
<!--          <el-col :span="12">
            <el-form-item label="合同id" prop="contractId">
              <el-input v-model="form.contractId" placeholder="请输入合同id"/>
            </el-form-item>
          </el-col>-->
          <!--
                    <el-col :span="12" v-show="false">
                      <el-form-item label="采购合同编码" prop="contractCode">
                        <el-input v-model="form.contractCode" placeholder="通过入库单 带出合同编码" readonly="readonly"/>
                        <input v-model="form.contractId" placeholder="请输入合同id" type="hidden"/>

                      </el-form-item>
                    </el-col>
                    -->
          <!--

                    <el-col :span="12">
                      <el-form-item label="采购合同编码" prop="contractCode">
                        <el-autocomplete
                          style="width: 100%"
                          v-model="form.contractCode"
                          :fetch-suggestions="queryContractSearchAsync"
                          placeholder="请输入合同编号"
                          @select="handleContractSelect"
                        ></el-autocomplete>
                      </el-form-item>
                    </el-col>
          -->
          <!--
                    <el-col :span="12" v-show="false">
                      <el-form-item label="入库单号" prop="warehousingCode">
                        <el-autocomplete
                          style="width: 100%"
                          v-model="form.warehousingCode"
                          :fetch-suggestions="queryWarehousingSearchAsync"
                          placeholder="请输入入库单号"
                          @select="handleWarehousingSelect"
                        ></el-autocomplete>
                      </el-form-item>
                    </el-col>

-->
                    <el-col :span="12" v-show="false">
                      <el-form-item label="供应商名称" prop="supplierName"  >
                        <el-input v-model="form.supplierName" placeholder="请输入供应商名称"/>
                        <input v-model="form.supplierId" type="hidden"/>
                      </el-form-item>
                    </el-col>

                              <el-col :span="12">
                                <el-form-item label="供应商名称" prop="supplierName">
                                  <el-autocomplete
                                    style="width: 100%"
                                    v-model="form.supplierName"
                                    :fetch-suggestions="querySearchAsync"
                                    placeholder="请输入供应商名称"
                                    @select="handleSelect"
                                  ></el-autocomplete>
                                </el-form-item>
                              </el-col>
        <!--
          <el-col :span="12">
            <el-form-item label="本次付款金额" prop="payAmount">
              <el-input v-model="form.payAmount" placeholder="请输入本次付款金额"/>
            </el-form-item>
          </el-col>
-->
          <el-col :span="12">
            <el-form-item label="付款方式" prop="payType">
              <el-select v-model="form.payType" placeholder="请选择付款方式">
                <el-option
                  v-for="dict in dict.type.pay_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="付款时间" prop="paymentDate">
              <el-date-picker clearable
                              v-model="form.paymentDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择付款时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款账号" prop="accountNo">
              <el-input v-model="form.accountNo" placeholder="请输入付款账号" />
            </el-form-item>
          </el-col><el-col :span="12">
          <el-form-item label="开户银行" prop="bankName">
            <el-input v-model="form.bankName" placeholder="请输入开户银行" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="发票编号" prop="invoiceNo">
            <el-input v-model="form.invoiceNo" placeholder="请输入发票编号" />
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
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"  v-if="edit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listFinPayment,
  getFinPayment,
  delFinPayment,
  addFinPayment,
  updateFinPayment
} from "@/api/finPayment/finPayment";
import {listBasisSupplier} from "@/api/basisSupplier/basisSupplier";
import {listContractInfoPurchase} from "@/api/contractInfoPurchase/contractInfoPurchase";
import {listWarehousing} from "@/api/warehousing/warehousing";
import fields from './fields';

export default {
  name: "FinPayment",
  dicts: ['pay_type'],
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
      // multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 供应商付款表格数据
      finPaymentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否编辑 true　修改true 查看详情false
      edit: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractId: undefined,
        supplierId: undefined,
        payAmount: undefined,
        payType: undefined,
        paymentDate: undefined,
        deptId: undefined,
        accountNo: undefined,
        bankName: undefined,
        invoiceNo: undefined
      },
      // 表单参数
      form: {
        paymentWarehousingRels: []
      },
      // 表单校验
      rules: {
        // payAmount: [
        //   {required: true, message: "本次付款金额不能为空", trigger: "blur"}
        // ],
        payType: [
          {required: true, message: "付款方式不能为空", trigger: "change"}
        ],
        paymentDate: [
          {required: true, message: "付款时间不能为空", trigger: "blur"}
        ],
        accountNo: [
          { required: true, message: "付款账号不能为空", trigger: "blur" }
        ],
        bankName: [
          { required: true, message: "开户银行不能为空", trigger: "blur" }
        ],
        invoiceNo: [
          { required: true, message: "发票编号不能为空", trigger: "blur" }
        ],
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
    /** 查询供应商付款列表 */
    getList() {
      this.loading = true;
      listFinPayment(this.queryParams).then(response => {
        this.finPaymentList = response.rows;
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
        supplierId: undefined,
        payAmount: undefined,
        payType: undefined,
        payed: undefined,
        paymentDate: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        deptId: undefined,
        accountNo: undefined,
        bankName: undefined,
        invoiceNo: undefined,
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
      this.edit = true;
      this.open = true;
      this.title = "添加供应商付款";
    },
    /** 修改按钮操作 */
    handleUpdate(row,isEdit) {
      this.loading = true;
      this.edit = isEdit;
      this.reset();
      const id = row.id || this.ids
      getFinPayment(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改供应商付款";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.paymentWarehousingRels = this.$refs.wtiForm.formData.paymentWarehousingRels;
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateFinPayment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addFinPayment(this.form).then(response => {
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
      this.$router.push("/finPayment?view=816077347061714944&id=" + row.id);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除供应商付款编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delFinPayment(ids);
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
      this.download('finPayment/finPayment/export', {
        ...this.queryParams
      }, `finPayment_${new Date().getTime()}.xlsx`)
    },

    querySearchAsync(queryString, cb) {
      const queryParams = {
        supplierName: queryString,
      };
      let flag = false;
      listBasisSupplier(queryParams).then(response => {
        flag = true;
        if (response.rows.length) {
          const d = response.rows.map(item => {
            return {
              value: item.supplierName,
              label: item.id,
              item: {
                supplierId: item.id,
                payed: item.payed,
                unpaid: item.unpaid,
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
      this.form.supplierId = item.item.supplierId;
      this.form.unpaid = item.item.unpaid;
      this.form.payed = item.item.payed;
      console.log(item);
      localStorage.setItem("finPayment_supplierId", item.item.supplierId)
      localStorage.setItem("finPayment_supplierName", item.value)
    },

    /*
    queryContractSearchAsync(queryString, cb) {
      const queryParams = {
        contractCode: queryString,
      };
      let flag = false;
      listContractInfoPurchase(queryParams).then(response => {
        flag = true;
        if (response.rows.length) {
          const d = response.rows.map(item => {
            return {
              value: item.contractCode,
              label: item.id,
              item: {
                id: item.id,
                contractCode: item.contractCode,
                contractName: item.contractName,
                supplierName: item.supplierName,
                supplierId: item.supplierId,
                mobilePhone: item.mobilePhone,
                contractId: item.id,
                purchaser: item.purchaser,
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
    handleContractSelect(item) {
      this.form.contractCode = item.item.contractCode;
      this.form.contractName = item.item.contractName;
      this.form.supplierName = item.item.supplierName;
      this.form.supplierId = item.item.supplierId;
      this.form.mobilePhone = item.item.mobilePhone;
      this.form.contractId = item.item.contractId;
      this.form.purchaser = item.item.purchaser;
      console.log(item);
    },
    */

    /*
   * 根据入库单编号进行关联
   * **/
    /*
    queryWarehousingSearchAsync(queryString, cb) {
      const queryParams = {
        warehousingCode: queryString,
      };
      let flag = false;
      listWarehousing(queryParams).then(response => {
        flag = true;
        if (response.rows.length) {
          const d = response.rows.map(item => {
            return {
              value: item.warehousingCode,
              label: item.id,
              item: {
                id: item.id,
                contractCode: item.contractCode,
                supplierName: item.supplierName,
                supplierId: item.supplierId,
                mobilePhone: item.mobilePhone,
                contractId: item.id,
                purchaser: item.purchaser,
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
    handleWarehousingSelect(item) {
      this.form.contractCode = item.item.contractCode;
      this.form.supplierName = item.item.supplierName;
      this.form.supplierId = item.item.supplierId;
      this.form.mobilePhone = item.item.mobilePhone;
      this.form.contractId = item.item.contractId;
      this.form.purchaser = item.item.purchaser;
      console.log(item);
    }
  */
  }
};
</script>
