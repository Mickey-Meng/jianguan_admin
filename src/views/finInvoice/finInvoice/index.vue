<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="含税金额" prop="invoiceAmount">
        <el-input
          v-model="queryParams.invoiceAmount"
          placeholder="请输入本次开票金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierName">
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商名称"
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
          v-hasPermi="['finInvoice:finInvoice:add']"
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
          v-hasPermi="['finInvoice:finInvoice:edit']"
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
          v-hasPermi="['finInvoice:finInvoice:remove']"
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
          v-hasPermi="['finInvoice:finInvoice:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="finInvoiceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="id" v-if="false"/>
      <el-table-column label="含税金额" align="center" prop="invoiceAmount"/>
      <el-table-column label="欠开票金额" align="center" prop="uninvoice"  v-if="false"/>
      <el-table-column label="开票时间" align="center" prop="invoiceDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.invoiceDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" align="center" prop="supplierName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,false)"
            v-hasPermi="['finInvoice:finInvoice:query']"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,true)"
            v-hasPermi="['finInvoice:finInvoice:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['finInvoice:finInvoice:remove']"
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

    <!-- 添加或修改供应商开票对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">


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
          <el-col :span="12">
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="form.contractName" placeholder="请输入合同名称"/>
              <input v-model="form.contractId"  type="hidden"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票编号" prop="invoiceNo">
              <el-input v-model="form.invoiceNo" placeholder="请输入发票编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="supplierName">
              <input v-model="form.supplierId" type="hidden"/>
              <el-input v-model="form.supplierName"/>
            </el-form-item>
          </el-col>

          <!--
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
                    </el-col>-->
          <el-col :span="12">
            <el-form-item label="含税金额" prop="invoiceAmount">
              <el-input v-model="form.invoiceAmount" placeholder="请输入含税金额"/>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">
            <el-form-item label="欠开票金额" prop="uninvoice">
              <el-input v-model="form.uninvoice" placeholder="请输入欠开票金额"/>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="开票时间" prop="invoiceDate">
              <el-date-picker clearable
                              v-model="form.invoiceDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择开票时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附件" prop="fj">
              <image-upload v-model="form.fj" ></image-upload>
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
        <el-button :loading="buttonLoading" type="primary" @click="submitForm" v-if="edit" >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listFinInvoice,
  getFinInvoice,
  delFinInvoice,
  addFinInvoice,
  updateFinInvoice
} from "@/api/finInvoice/finInvoice";
import {listBasisSupplier} from "@/api/basisSupplier/basisSupplier";
import {listContractInfoPurchase} from "@/api/contractInfoPurchase/contractInfoPurchase";
import formValidate from "@/plugins/formValidate/formValidate";
export default {
  name: "FinInvoice",
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
      // 供应商开票表格数据
      finInvoiceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      edit: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        invoiceAmount: undefined,
        supplierName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          {required: true, message: "id不能为空", trigger: "blur"}
        ],
        supplierId: [
          {required: true, message: "供应商id不能为空", trigger: "blur"}
        ],
        invoiceAmount: [
          {required: true, message: "本次开票金额不能为空", trigger: "blur"},
          {
            'validator': formValidate.checkNumberAmount(),
            'trigger': ['change', 'blur'],
          }
        ],
        invoiceDate: [
          {required: true, message: "开票时间不能为空", trigger: "blur"}
        ],
        supplierName: [
          {required: true, message: "供应商名称不能为空", trigger: "blur,change"}
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询供应商开票列表 */
    getList() {
      this.loading = true;
      listFinInvoice(this.queryParams).then(response => {
        this.finInvoiceList = response.rows;
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
        contractName: undefined,
        supplierId: undefined,
        invoiceAmount: undefined,
        uninvoice: undefined,
        invoiceDate: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        deptId: undefined,
        supplierName: undefined
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
      this.title = "添加供应商开票";
    },
    /** 修改按钮操作 */
    handleUpdate(row,isEdit) {
      this.loading = true;
      this.edit= isEdit;
      this.reset();
      const id = row.id || this.ids
      getFinInvoice(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改供应商开票";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateFinInvoice(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addFinInvoice(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除供应商开票编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delFinInvoice(ids);
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
      this.download('finInvoice/finInvoice/export', {
        ...this.queryParams
      }, `finInvoice_${new Date().getTime()}.xlsx`)
    },
    /* yangaogao  合肥项目开发票以合同为标的，因此先注释掉以供应商为标的相关代码
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
      console.log(item);
    },
*/

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
    }
  }
};
</script>
