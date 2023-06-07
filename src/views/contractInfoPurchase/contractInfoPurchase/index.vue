<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同编码" prop="contractCode">
        <el-input
          v-model="queryParams.contractCode"
          placeholder="请输入合同编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同名称" prop="contractName">
        <el-input
          v-model="queryParams.contractName"
          placeholder="请输入合同名称"
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
      <!--      <el-form-item label="总金额" prop="amount">
              <el-input
                v-model="queryParams.amount"
                placeholder="请输入总金额"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="合同签订时间" prop="contactDate">
              <el-date-picker clearable
                v-model="queryParams.contactDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择合同签订时间">
              </el-date-picker>
            </el-form-item>-->
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
          v-hasPermi="['contractInfoPurchase:contractInfoPurchase:add']"
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
          v-hasPermi="['contractInfoPurchase:contractInfoPurchase:edit']"
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
          v-hasPermi="['contractInfoPurchase:contractInfoPurchase:remove']"
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
          v-hasPermi="['contractInfoPurchase:contractInfoPurchase:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contractInfoPurchaseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="合同id" align="center" prop="id" v-if="false"/>
      <el-table-column label="合同编码" align="center" prop="contractCode"/>
      <el-table-column label="合同名称" align="center" prop="contractName"/>
      <el-table-column label="供应商名称" align="center" prop="supplierName"/>
      <el-table-column label="总金额(元)" align="center" prop="amount"/>
      <el-table-column label="合同签订时间" align="center" prop="contactDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.contactDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,false)"
            v-hasPermi="['contractInfoPurchase:contractInfoPurchase:query']"
          >详情
          </el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,true)"
            v-hasPermi="['contractInfoPurchase:contractInfoPurchase:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['contractInfoPurchase:contractInfoPurchase:remove']"
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

    <!-- 添加或修改采购合同 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1150px" append-to-body>
      <el-form v-if="open" ref="form" :model="form" :rules="rules" label-width="130px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同编码" prop="contractCode">
              <el-input v-model="form.contractCode" placeholder="请输入合同编码"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="form.contractName" placeholder="请输入合同名称"/>
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
              <input v-model="form.supplierId" type="hidden"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账期（天）" prop="accountPeriod" :required="true">
              <el-input v-model="form.accountPeriod" placeholder="请输入账期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总金额（元）" prop="amount">
              <el-input v-model="form.amount" :disabled="true" placeholder="请输入总金额（元）"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="供应商联系人" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="请输入供应商联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商联系方式" prop="mobilePhone">
              <el-input v-model="form.mobilePhone" placeholder="请输入供应商联系方式"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购人员" prop="purchaser">
              <el-input v-model="form.purchaser" placeholder="请输入采购人员"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startDate">
              <el-date-picker clearable
                              v-model="form.startDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endDate">
              <el-date-picker clearable
                              v-model="form.endDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="合同是否已签订" prop="contractStatus">
              <el-select style="width: 100%" v-model="form.contractStatus" placeholder="请选择合同是否已签订">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="合同签订时间" prop="contactDate">
              <el-date-picker clearable
                              v-model="form.contactDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择合同签订时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税率（%）" prop="rate">
              <el-input v-model="form.rate" placeholder="请输入数字"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附件">
              <upload @input="getFileList" :value="reviewFileList"/>
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
        <el-button :loading="buttonLoading" type="primary" @click="submitForm" v-if="edit" >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listContractInfoPurchase,
  getContractInfoPurchase,
  delContractInfoPurchase,
  addContractInfoPurchase,
  updateContractInfoPurchase
} from "@/api/contractInfoPurchase/contractInfoPurchase";
import {getToken} from "@/utils/auth";
import {listByIds} from "@/api/system/oss";

import {listBasisSupplier} from "@/api/basisSupplier/basisSupplier";
import {delOss} from "@/api/system/oss";
import fields from './fields';
import upload from '@/components/FileUpload';
import calc from '@/utils/calc.js'
import formValidate from "@/plugins/formValidate/formValidate";


export default {
  name: "ContractInfoPurchase",
  dicts: ['sys_yes_no'],
  components: {
    upload
  },
  props: {
    // 值
    value: [String, Object, Array],
    // 数量限制
    limit: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 10,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["doc", "docx", "xls", "ppt", "txt", "pdf", "png", "jpg", "jpeg", "xlsx"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      reviewFileList: [],
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      number: 0,
      uploadList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/system/oss/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
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
      // 采购合同 表格数据
      contractInfoPurchaseList: [],
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
        contractCode: undefined,
        contractName: undefined,
        supplierName: undefined,
        amount: undefined,
        contactDate: undefined,
      },
      // 表单参数
      form: {
        contractGoodsRels: []
      },
      // 表单校验
      rules: {
        id: [
          {required: true, message: "合同id不能为空", trigger: "blur"}
        ],
        contractCode: [
          {required: true, message: "合同编码不能为空", trigger: "blur"}
        ],
        contractName: [
          {required: true, message: "合同名称不能为空", trigger: "blur"}
        ],
        supplierName: [
          {required: true, message: "供应商名称不能为空", trigger: "blur,change"}
        ],
        amount: [
          {required: true, message: "总金额不能为空", trigger: "blur"}
        ],
        accountPeriod: [
          {
            'validator': formValidate.checkNumberIsNotZero(),
            'trigger': ['change', 'blur'],
          }
        ],
        rate: [
          {
            'validator': formValidate.validateRate(),
            'trigger': ['change', 'blur'],
          }
        ],
      },
      fields
    };
  },
  created() {
    this.queryParams.supplierName = this.$route.query.supplierName || undefined;
    this.getList();
  },
  methods: {
    /** 查询采购合同 列表 */
    getList() {
      this.loading = true;
      listContractInfoPurchase(this.queryParams).then(response => {
        this.contractInfoPurchaseList = response.rows;
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
      this.reviewFileList =[]
      this.form = {
        contractCode: undefined,
        contractName: undefined,
        supplierName: undefined,
        supplierId: undefined,
        amount: undefined,
        contactDate: undefined,
        rate: undefined,
        fj: undefined,
        remark: undefined,
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
      this.title = "添加采购合同 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row,isEdit) {
      this.fileList = [];
      this.loading = true;
      this.edit = isEdit;
      this.reset();
      const id = row.id || this.ids
      getContractInfoPurchase(id).then(response => {


        this.loading = false;
        this.form = response.data;
        console.log(response.data)
        if (response.data.fj != "" && response.data.fj != undefined) {
          listByIds(response.data.fj).then(res => {
            this.reviewFileList = res.data.map(item => {
              return {
                name:item.originalName,
                ...item
              }
            })
          })
        }
        this.open = true;
        this.title = "修改采购合同 ";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.contractGoodsRels = this.$refs.wtiForm.formData.contractGoodsRels;
          const ossIds = this.fileList.map(item => item.ossId).join(',');
          this.form.fj = ossIds;
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateContractInfoPurchase(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addContractInfoPurchase(this.form).then(response => {
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
      /*
        yangaogao 20230506  当时给麒麟做的时候，加了暂不支持，应该是为了避免应付款不好计算的问题。
        合肥供应链需要支持删除。先注释掉控制
      this.$modal.msgSuccess("暂不支持删除操作");
      return ;*/
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除采购合同 编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delContractInfoPurchase(ids);
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
      this.download('contractInfoPurchase/contractInfoPurchase/export', {
        ...this.queryParams
      }, `contractInfoPurchase_${new Date().getTime()}.xlsx`)
    },
    /*
    *    **/
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
                contactPerson: item.contactPerson,
                mobilePhone: item.mobilePhone,
                address: item.address,
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
      this.form.contactPerson = item.item.contactPerson;
      this.form.mobilePhone = item.item.mobilePhone;
      this.form.address = item.item.address;
      console.log(item);
      localStorage.setItem("contractInfoPurchase_supplierId", item.item.supplierId)
      localStorage.setItem("contractInfoPurchase_supplierName", item.value)
    },
    updateValue(params) {
      if (params) {
        const key = Object.keys(params)[0];
        if (key === 'contractGoodsRels') {
          let num = []
          params[key].forEach((item, index) => {
            item.amount = calc.mul(item.goodsNum, item.price)
            num.push(Number(item.amount))
          })
          let sum = num[0];
          if (num.length > 1) {
            sum = calc.add(...num)
          }
          this.form.amount = sum
        }
      }
    },
    getFileList(val) {
      this.fileList = [];
      this.fileList = val;
    },
  }
};
</script>
