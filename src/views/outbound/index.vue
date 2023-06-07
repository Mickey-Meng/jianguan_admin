<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="出库单号" prop="outboundCode">
        <el-input
          v-model="queryParams.outboundCode"
          placeholder="请输入出库单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="销售员" prop="salesperson">
        <el-input
          v-model="queryParams.salesperson"
          placeholder="请输入销售员"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="产品名称" prop="proudctName">
        <el-input
          v-model="queryParams.proudctName"
          placeholder="请输入产品名称"
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
          v-hasPermi="['ql:outbound:add']"
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
          v-hasPermi="['ql:outbound:edit']"
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
          v-hasPermi="['ql:outbound:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-upload
          :action="uploadUrl"
        >
          <el-button size="small" type="primary">导入</el-button>
        </el-upload>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ql:outbound:export']"
        >导出
        </el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="outboundList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="id" v-if="false"/>
<!--      2、【出库单明细】页面信息显示改为【出库单号】【销售合同号】【客户名称】【销售员】【出库对接人】【操作】-->
      <el-table-column label="出库单号" align="center" prop="outboundCode"/>
      <el-table-column label="销售合同编号" align="center" prop="saleContractCode"/>
      <el-table-column label="客户名称" align="center" prop="customerName"/>
      <el-table-column label="销售员" align="center" prop="salesperson"/>
      <el-table-column label="出库对接人" align="center" prop="outboundUsername"/>
      <el-table-column label="出库日期" align="center" prop="outboundDate" width="180" v-if="false">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.outboundDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" align="center" prop="customerName" v-if="false"/>
      <el-table-column label="采购合同编号" align="center" prop="purchaseContractCode" v-if="false"/>
      <el-table-column label="电话" align="center" prop="telephone" v-if="false"/>
      <el-table-column label="产品id" align="center" prop="proudctId" v-if="false"/>
      <el-table-column label="产品名称" align="center" prop="proudctName" v-if="false"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,false)"
            v-hasPermi="['ql:outbound:query']"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,true)"
            v-hasPermi="['ql:outbound:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ql:outbound:remove']"
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

    <!-- 添加或修改出库管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px" v-if="open">
        <el-row :gutter="20">

          <el-col :span="12">
            <el-form-item label="单据编号" prop="outboundCode">
              <el-input v-model="form.outboundCode" placeholder="请输入出库单号"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-autocomplete
                style="width: 100%"
                v-model="form.projectName"
                :fetch-suggestions="queryProjectInfoSearchAsync"
                placeholder="请输入项目名称"
                @select="handleProjectInfoSelect"
              ></el-autocomplete>
            </el-form-item>
            <input v-model="form.projectId" type="hidden"/>
          </el-col>


          <el-col :span="12">
            <el-form-item label="出货日期" prop="outboundDate">
              <el-date-picker clearable
                              v-model="form.outboundDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择出库日期"  @blur="calLastReceivableDateDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售员" prop="salesperson">
              <el-input v-model="form.salesperson" placeholder="请输入销售员"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="销售合同编号" prop="saleContractCode">
              <el-autocomplete
                style="width: 100%"
                v-model="form.saleContractCode"
                :fetch-suggestions="queryContractSaleSearchAsync"
                placeholder="请输入销售合同编号"
                @select="handleContractSaleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="采购合同编号" prop="purchaseContractCode">
              <el-autocomplete
                style="width: 100%"
                v-model="form.purchaseContractCode"
                :fetch-suggestions="queryContractPurchaseSearchAsync"
                placeholder="请输入采购合同编号"
                @select="handleContractPurchaseSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="form.customerName" placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户电话" prop="telephone">
              <el-input v-model="form.telephone" placeholder="请输入电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址描述"/>
            </el-form-item>
          </el-col>


          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="产品名称" prop="proudctName">-->
          <!--              <el-autocomplete-->
          <!--                style="width: 100%"-->
          <!--                v-model="form.proudctName"-->
          <!--                :fetch-suggestions="queryProductInfoSearchAsync"-->
          <!--                placeholder="请输入产品名称"-->
          <!--                @select="handleProductInfoSelect"-->
          <!--              ></el-autocomplete>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="商品规格" prop="goodsSearchstandard">-->
          <!--              <el-input v-model="form.goodsSearchstandard" placeholder="请输入商品规格"/>-->
          <!--              <input v-model="form.proudctId" type="hidden"/>-->

          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="商品单位" prop="goodsUnit">-->
          <!--              <el-input v-model="form.goodsUnit" placeholder="请输入商品单位【关联字典管理】"/>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="基准价" prop="basePrice">-->
          <!--              <el-input v-model="form.basePrice" placeholder="请输入基准价"/>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="销售价" prop="salePrice">-->
          <!--              <el-input v-model="form.salePrice" placeholder="请输入销售价"/>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="附加价格" prop="extraPrice">-->
          <!--              <el-input v-model="form.extraPrice" placeholder="请输入附加价格"/>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->

          <el-col :span="12">
            <el-form-item label="销售日期" prop="saleDate">
              <el-date-picker clearable
                              v-model="form.saleDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择销售日期">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="最后收款日期" prop="lastReceivableDate">
              <el-date-picker clearable
                              disabled
                              ref="lastReceivableDate"
                              v-model="form.lastReceivableDate"
                              type="datetime"
                              value-format="yyyy-MM-dd"
                              placeholder="请选择最后收款日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="销售数量" prop="saleNumber">-->
          <!--              <el-input v-model="form.saleNumber" placeholder="请输入销售数量"/>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="销售金额" prop="saleAmount">
              <el-input v-model="form.saleAmount" ref="saleAmount" placeholder="请输入销售金额" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库对接人" prop="outboundUsername">
              <el-input v-model="form.outboundUsername" placeholder="请输入出库对接人"/>
              <input v-model="form.accountPeriod" type="hidden"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库审核人" prop="outboundReleaseuser">
              <el-input v-model="form.outboundReleaseuser" placeholder="请输入出库审核人"/>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="出库数量" prop="outboundNumber">-->
          <!--              <el-input v-model="form.outboundNumber" placeholder="请输入出库数量"/>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->

          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售基准价截图" prop="fj">
              <image-upload v-model="form.fj"></image-upload>
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
        <el-button :loading="buttonLoading" type="primary" @click="submitForm" v-if="edit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addOutbound, delOutbound, getOutbound, listOutbound, updateOutbound} from "@/api/outbound/outbound";
import {listShopGoods} from "@/api/shopGoods/shopGoods";
import {listProjectInfo} from "@/api/projectInfo/projectInfo";
import {getBasisCustomer} from "@/api/basisCustomer/basisCustomer";
import {listContractInfoSale} from "@/api/contractInfoSale/contractInfoSale";
import {listContractInfoPurchase} from "@/api/contractInfoPurchase/contractInfoPurchase";
import formValidate from "@/plugins/formValidate/formValidate";
import dayjs from "dayjs";
import fields from './fields';
import calc from '@/utils/calc.js'


export default {
  name: "Outbound",
  data() {
    return {
      fields,
      uploadUrl: process.env.VUE_APP_BASE_API + '/ql/outbound/import',
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
      // 出库管理表格数据
      outboundList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      edit: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        outboundCode: undefined,
        outboundDate: undefined,
        salesperson: undefined,
        saleContractCode: undefined,
        purchaseContractCode: undefined,
        customerName: undefined,
        telephone: undefined,
        address: undefined,
        proudctId: undefined,
        proudctName: undefined,
        goodsSearchstandard: undefined,
        goodsUnit: undefined,
        basePrice: undefined,
        incomePrice: undefined,
        extraPrice: undefined,
        fj: undefined,
        saleDate: undefined,
        saleNumber: undefined,
        saleAmount: undefined,
        outboundUsername: undefined,
        outboundReleaseuser: undefined,
        outboundNumber: undefined,
      },
      // 表单参数
      form: {
        warehousingDetails: []
      },
      // 表单校验
      rules: {
        id: [
          {required: true, message: "id不能为空", trigger: "blur"}
        ],
        outboundCode: [
          {required: true, message: "出库单号不能为空", trigger: "blur"}
        ],
        outboundDate: [
          {required: true, message: "出库日期不能为空", trigger: "blur"}
        ],
        salesperson: [
          {required: true, message: "销售员不能为空", trigger: "blur"}
        ],
        saleContractCode: [
          {required: true, message: "销售合同编号不能为空", trigger: "change,onchange"}
        ],
        purchaseContractCode: [
          {required: true, message: "采购合同编号不能为空", trigger: "blur,onchange"}
        ],
        customerName: [
          {required: true, message: "客户名称不能为空", trigger: "blur"}
        ],
        telephone: [
          {required: true, message: "电话不能为空", trigger: "blur"}
        ],
        address: [
          {required: true, message: "地址描述不能为空", trigger: "blur"}
        ],
        proudctId: [
          {required: true, message: "产品id不能为空", trigger: "blur"}
        ],
        proudctName: [
          {required: true, message: "产品名称不能为空", trigger: "change"}
        ],
        goodsSearchstandard: [
          {required: true, message: "商品规格不能为空", trigger: "blur"}
        ],
        goodsUnit: [
          {required: true, message: "商品单位不能为空", trigger: "blur"}
        ],
        basePrice: [
          {required: true, message: "基准价不能为空", trigger: "blur"},
          {
            'validator': formValidate.checkNumberAmount(),
            'trigger': ['change', 'blur'],
          }
        ],
        incomePrice: [
          {required: true, message: "进货价不能为空", trigger: "blur"},
          {
            'validator': formValidate.checkNumberAmount(),
            'trigger': ['change', 'blur'],
          }
        ],
        extraPrice: [
          {required: true, message: "附加价格不能为空", trigger: "blur"},
          {
            'validator': formValidate.checkNumberAmount(),
            'trigger': ['change', 'blur'],
          }
        ],
        fj: [
          {required: true, message: "附件--销售基准价截图不能为空", trigger: "blur"}
        ],
        saleDate: [
          {required: true, message: "销售日期不能为空", trigger: "blur"}
        ],
        saleNumber: [
          {required: true, message: "销售数量不能为空", trigger: "blur"},
          {
            'validator': formValidate.checkOnlyNumber(),
            'trigger': ['change', 'blur'],
          }
        ],
        saleAmount: [
          {required: true, message: "销售金额不能为空", trigger: "blur"},
          {
            'validator': formValidate.checkNumberAmount(),
            'trigger': ['change', 'blur'],
          }
        ],
        outboundUsername: [
          {required: true, message: "出库对接人不能为空", trigger: "blur"}
        ],
        outboundReleaseuser: [
          {required: true, message: "出库审核人不能为空", trigger: "blur"}
        ],
        outboundNumber: [
          {required: true, message: "出库数量不能为空", trigger: "blur"},
          {
            'validator': formValidate.checkOnlyNumber(),
            'trigger': ['change', 'blur'],
          }
        ],
      }
    };
  },
  created() {
    this.getList();
    localStorage.setItem("warehousing_contractId", '');
  },
  methods: {
    // 计算最后到账日期  yangaogao 20230601
    calLastReceivableDateDate() {
      alert(this.form.outboundDate)
      alert(this.form.accountPeriod)
      let lastReceivableDate = dayjs(this.form.outboundDate).add(this.form.accountPeriod, "day").format("YYYY-MM-DD HH:mm:ss");
      if (lastReceivableDate) {
        this.form.lastReceivableDate = lastReceivableDate;
        this.$refs.lastReceivableDate.value = lastReceivableDate;
      }
    },
    /** 查询出库管理列表 */
    getList() {
      this.loading = true;
      listOutbound(this.queryParams).then(response => {
        this.outboundList = response.rows;
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
        outboundCode: undefined,
        outboundDate: undefined,
        salesperson: undefined,
        saleContractCode: undefined,
        purchaseContractCode: undefined,
        customerName: undefined,
        telephone: undefined,
        address: undefined,
        proudctId: undefined,
        proudctName: undefined,
        goodsSearchstandard: undefined,
        goodsUnit: undefined,
        basePrice: undefined,
        incomePrice: undefined,
        extraPrice: undefined,
        fj: undefined,
        saleDate: undefined,
        saleNumber: undefined,
        saleAmount: undefined,
        outboundUsername: undefined,
        outboundReleaseuser: undefined,
        outboundNumber: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        deptId: undefined,
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
      this.title = "添加出库管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getOutbound(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改出库管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.warehousingDetails = this.$refs.wtiForm.formData.warehousingDetails;
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateOutbound(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addOutbound(this.form).then(response => {
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
      this.$router.push("/outbound?view=815906967617490944&inventory_id=" + row.id);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除出库管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delOutbound(ids);
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
      this.download('ql/outbound/export', {
        ...this.queryParams
      }, `outbound_${new Date().getTime()}.xlsx`)
    },


    queryProductInfoSearchAsync(queryString, cb) {
      const queryParams = {
        goodsName: queryString,
      };
      let flag = false;
      listShopGoods(queryParams).then(response => {
        flag = true;
        if (response.rows.length) {
          const d = response.rows.map(item => {
            return {
              value: item.goodsName,
              label: item.id,
              item: {
                id: item.id,
                goodsUnit: item.goodsUnit,
                goodsSearchstandard: item.goodsSearchstandard,
                customerId: item.customerId,
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

    handleProductInfoSelect(item) {
      this.form.proudctId = item.item.id;
      this.form.goodsUnit = item.item.goodsUnit;
      this.form.goodsSearchstandard = item.item.goodsSearchstandard;
    },

    // 关联销售合同
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
                saleContractCode: item.contractCode,
                customerName: item.customerName,
                customerId: item.customerId,
                accountPeriod: item.accountPeriod,
                salesperson: item.purchaser,
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
      this.form.customerId = item.item.customerId;
      this.form.accountPeriod = item.item.accountPeriod;
      this.form.salesperson = item.item.salesperson;
      let customerId = item.item.customerId;
      this.form.customerName = item.item.customerName;
      localStorage.setItem("outbound_contractId", item.item.id);
      const id = customerId;
      getBasisCustomer(id).then(response => {
        console.log(response);
        if (response.code == 200) {
          this.form.address = response.data.address;
          this.form.telephone = response.data.telephone;
        }
      })
    },
    // 关联采购合同
    queryContractPurchaseSearchAsync(queryString, cb) {
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
                purchaseContractCode: item.contractCode,
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

    handleContractPurchaseSelect(item) {
      this.form.purchaseContractCode = item.item.purchaseContractCode;
    },


    //  关联项目信息
    queryProjectInfoSearchAsync(queryString, cb) {
      const queryParams = {
        projectName: queryString,
      };
      let flag = false;
      listProjectInfo(queryParams).then(response => {
        flag = true;
        if (response.rows.length) {
          const d = response.rows.map(item => {
            return {
              value: item.projectName,
              label: item.id,
              item: {
                id: item.id,
                projectName: item.projectName,
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

    handleProjectInfoSelect(item) {
      this.form.projectId = item.item.id;
      this.form.projectName = item.item.projectName;
    },
    /************************* 上传相关 **************************** */
    checkFileSuffix(fileName) {
      if (fileName !== undefined) {
        let fileSuffix = fileName.substring(fileName.lastIndexOf('.') + 1);
        return this.allowFileTypes.some(type => {
          return fileSuffix.indexOf(type) > -1;
        });
      }
      return false;
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      let isTypePass = checkFileType(file, this.allowFileTypes);
      // 校检文件大小
      let isSizePass = checkFileSize(file, this.allowMaxFileSize);
      console.log("isTypePass:" + isTypePass + " | isSizePass:" + isSizePass);
      if (isTypePass && isSizePass) {
        this.fileNumber++;
        this.$modal.loading("正在上传文件，请稍候...");
      }
      return isTypePass && isSizePass;
    },

    // 上传失败
    handleUploadError(err) {
      this.$modal.msgError("上传文件失败，请重试");
      this.$modal.closeLoading();
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      console.log("upload->handleUploadSuccess...");
      console.log(res);
      if (res.code === 200) {
        this.uploadList.push({name: res.data.fileName, url: res.data.url, ossId: res.data.ossId});
        this.uploadedSuccessfully();
      } else {
        this.fileNumber--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除文件
    handleDeleteFile(data) {
      console.log("upload->handleDeleteFile...");
      console.log(data);
      delOss(data.ossId);
      this.fileList = this.fileList.filter(t => t.uid !== data.uid);
      let ossIds = listOssIdToString(this.fileList);
      this.$emit("input", ossIds);
      this.from.fj = ossIds;
      this.fileNumber--;
      if (this.fileNumber === 0) {
        this.isDisabled = false;
      }
    },
    // 上传结束处理
    uploadedSuccessfully() {
      console.log("upload->uploadedSuccessfully...");
      console.log("fileNumber:" + this.fileNumber + " | uploadList.length:" + this.uploadList.length);
      if (this.fileNumber > 0 && this.uploadList.length === this.fileNumber) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.fileNumber = 0;
        let ossIds = listOssIdToString(this.fileList);
        this.$emit("input", ossIds);
        this.form.fj = ossIds;
        this.isDisabled = true;
        this.$modal.closeLoading();
      } else {
        $modal.msgError(`最多上传${this.fileLimit}个文件!`);
      }
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      this.$download.oss(file.ossId)
    },
    handleExceed(files, fileList) {
      console.log(files);
      console.log(fileList);
      this.$message.warning(`当前限制可上传 ${this.fileLimit}个文件，当前已上传 ${files.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    updateValue(params) {
      localStorage.setItem("outbound_contractId", this.form.contractId);
      if (params) {
        const key = Object.keys(params)[0];
        if (key === 'warehousingDetails') {
          let num = []
          params[key].forEach((item, index) => {
            item.amount = calc.mul(item.inventoryNumber, item.salePrice)
            num.push(Number(item.amount))
          })
          let sum = num[0];
          if (num.length > 1) {
            sum = calc.add(...num)
          }
          this.form.saleAmount = sum;
          this.$refs.saleAmount.value = sum;

        }
      }
    }
  }
};
</script>
