<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="联系人" prop="contactPerson">
        <el-input
          v-model="queryParams.contactPerson"
          placeholder="请输入联系人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-input
          v-model="queryParams.telephone"
          placeholder="请输入电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="手机" prop="mobilePhone">
              <el-input
                v-model="queryParams.mobilePhone"
                placeholder="请输入手机"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="queryParams.email"
                placeholder="请输入邮箱"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="客户所属地区" prop="area">
              <el-input
                v-model="queryParams.area"
                placeholder="请输入客户所属地区"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="地址描述" prop="address">
              <el-input
                v-model="queryParams.address"
                placeholder="请输入地址描述"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="联系人1" prop="contactPersonOne">
              <el-input
                v-model="queryParams.contactPersonOne"
                placeholder="请输入联系人1"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="电话1" prop="telephoneOne">
              <el-input
                v-model="queryParams.telephoneOne"
                placeholder="请输入电话1"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="发票抬头" prop="invoiceLookedUp">
              <el-input
                v-model="queryParams.invoiceLookedUp"
                placeholder="请输入发票抬头"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="发票税率" prop="invoiceTax">
              <el-input
                v-model="queryParams.invoiceTax"
                placeholder="请输入发票税率"
                clearable
                @keyup.enter.native="handleQuery"
              />
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
          v-hasPermi="['basisCustomer:basisCustomer:add']"
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
          v-hasPermi="['basisCustomer:basisCustomer:edit']"
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
          v-hasPermi="['basisCustomer:basisCustomer:remove']"
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
          v-hasPermi="['basisCustomer:basisCustomer:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="basisCustomerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="客户id" align="center" prop="id" v-if="true"/>-->
      <el-table-column label="客户名称" align="center" prop="customerName"/>
      <el-table-column label="联系人" align="center" prop="contactPerson"/>
      <el-table-column label="手机" align="center" prop="mobilePhone"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row,false)"
            v-hasPermi="['basisCustomer:basisCustomer:query']"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,true)"
            v-hasPermi="['basisCustomer:basisCustomer:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basisCustomer:basisCustomer:remove']"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleContract(scope.row)"
          >查看合同
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

    <!-- 添加或修改客户资料对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <!--          <el-col :span="12">
                  <el-form-item label="客户编码" prop="customerCode">
                    <el-input v-model="form.customerCode" placeholder="请输入客户编码" />
                  </el-form-item>
                    </el-col>-->
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="form.customerName" placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照(税号)" prop="businessLicense">
              <el-input v-model="form.businessLicense" placeholder="请输入营业执照(税号)"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="请输入联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="telephone">
              <el-input v-model="form.telephone" placeholder="请输入电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" prop="mobilePhone">
              <el-input v-model="form.mobilePhone" placeholder="请输入手机"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户所属地区" prop="area">
              <el-cascader
                v-model="form.area_code"
                size="mini"
                :options="options"
                filterable
                clearable
                style="width: 100%;"
                @change="handleChange"
              />

<!--              <el-input v-model="form.area" placeholder="请输入客户所属地区"/>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公共户开户行" prop="publicBankName">
              <el-input v-model="form.publicBankName" placeholder="请输入公共户开户行" />
            </el-form-item>
          </el-col><el-col :span="12">
          <el-form-item label="私户开户行" prop="privateBankName">
            <el-input v-model="form.privateBankName" placeholder="请输入私户开户行" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="公户账号" prop="publicBankNo">
            <el-input v-model="form.publicBankNo" placeholder="请输入公户账号" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="私户账号" prop="privateBankNo">
            <el-input v-model="form.privateBankNo" placeholder="请输入私户账号" />
          </el-form-item>
        </el-col>
          <el-col :span="12">
            <el-form-item label="地址描述" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址描述"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急联系人" prop="contactPersonOne">
              <el-input v-model="form.contactPersonOne" placeholder="请输入联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急联系人电话" prop="telephoneOne">
              <el-input v-model="form.telephoneOne" placeholder="请输入紧急联系人电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票抬头" prop="invoiceLookedUp">
              <el-input v-model="form.invoiceLookedUp" placeholder="请输入发票抬头"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票税率(%)" prop="invoiceTax">
              <el-input v-model="form.invoiceTax" placeholder="请输入发票税率"/>
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
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"  v-if="edit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>



<style>
.el-input--mini .el-input__inner {
  height: 36px;
  line-height: 28px;
}
</style>

<script>
import {
  listBasisCustomer,
  getBasisCustomer,
  delBasisCustomer,
  addBasisCustomer,
  updateBasisCustomer
} from "@/api/basisCustomer/basisCustomer";

import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import formValidate from "@/plugins/formValidate/formValidate";

export default {
  name: "BasisCustomer",
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
      options: regionData,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户资料表格数据
      basisCustomerList: [],
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
        customerCode: undefined,
        customerName: undefined,
        businessLicense: undefined,
        contactPerson: undefined,
        telephone: undefined,
        mobilePhone: undefined,
        email: undefined,
        area: undefined,
        address: undefined,
        publicBankName: undefined,
        privateBankName: undefined,
        publicBankNo: undefined,
        privateBankNo: undefined,
        contactPersonOne: undefined,
        telephoneOne: undefined,
        invoiceLookedUp: undefined,
        invoiceTax: undefined,
        invoiceType: undefined,
        deptId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          {required: true, message: "客户资料id不能为空", trigger: "blur"}
        ],
        customerName: [
          {required: true, message: "客户名称不能为空", trigger: "blur"}
        ],
        contactPerson: [
          {required: true, message: "联系人不能为空", trigger: "blur"}
        ],
        mobilePhone: [
          {required: true, message: "手机不能为空", trigger: "blur"}
        ],
        area: [
          {required: true, message: "客户所属地区不能为空", trigger: "blur"}
        ],
        publicBankName: [
          { required: true, message: "公共户开户行不能为空", trigger: "blur" }
        ],

        publicBankNo: [
          { required: true, message: "公户账号不能为空", trigger: "blur" }
        ],
        invoiceTax: [
          {
            'validator': formValidate.validateRate(),
            'trigger': ['change', 'blur'],
          }

        ],

      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询客户资料列表 */
    getList() {

      console.log(this.options)
      this.loading = true;
      listBasisCustomer(this.queryParams).then(response => {
        this.basisCustomerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    handleChange(value) {
      console.log(value);
      if (value == undefined) {
        return;
      }
      this.form.area = value.toString();

    },

    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        customerCode: undefined,
        customerName: undefined,
        businessLicense: undefined,
        contactPerson: undefined,
        telephone: undefined,
        mobilePhone: undefined,
        email: undefined,
        area: undefined,
        area_code: [],
        address: undefined,
        contactPersonOne: undefined,
        telephoneOne: undefined,
        publicBankName: undefined,
        privateBankName: undefined,
        publicBankNo: undefined,
        privateBankNo: undefined,
        invoiceLookedUp: undefined,
        invoiceTax: undefined,
        invoiceType: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
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
      this.edit = true;
      this.title = "添加客户资料";
    },
    /** 修改按钮操作 */
    handleUpdate(row,isEdit) {
      this.loading = true;
      this.edit = isEdit;
      this.reset();
      const id = row.id || this.ids
      getBasisCustomer(id).then(response => {
        this.loading = false;
        this.form = response.data;
        console.log(response.data)
        if (response.data.area != undefined) {
          console.log(response.data.area)
          this.form.area_code = response.data.area.split(",");
          console.log(this.form.area_code)
        }

        this.open = true;
        this.title = "修改客户资料";
      });
    },
    /** 查看合同按钮操作 */
    handleContract(row) {
      // 跳转到报表页面
      this.$router.push({
        path:'/glycontract/contractInfoSale',
        query: {
          customerName: row.customerName
        }
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateBasisCustomer(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addBasisCustomer(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除客户资料编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delBasisCustomer(ids);
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
      this.download('basisCustomer/basisCustomer/export', {
        ...this.queryParams
      }, `basisCustomer_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
