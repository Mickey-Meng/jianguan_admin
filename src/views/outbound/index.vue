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
      <el-table-column label="出库单号" align="center" prop="outboundCode"/>
      <el-table-column label="出库日期" align="center" prop="outboundDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.outboundDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售员" align="center" prop="salesperson"/>
      <el-table-column label="销售合同编号" align="center" prop="saleContractCode" v-if="false"/>
      <el-table-column label="采购合同编号" align="center" prop="purchaseContractCode" v-if="false"/>
      <el-table-column label="客户名称" align="center" prop="customerName"/>
      <el-table-column label="电话" align="center" prop="telephone"/>
      <el-table-column label="地址描述" align="center" prop="address"/>
      <el-table-column label="产品id" align="center" prop="proudctId" v-if="false"/>
      <el-table-column label="产品名称" align="center" prop="proudctName"/>
      <el-table-column label="基准价" align="center" prop="basePrice"/>
      <el-table-column label="进货价" align="center" prop="incomePrice"/>
      <el-table-column label="附加价格" align="center" prop="extraPrice"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出库单号" prop="outboundCode">
              <el-input v-model="form.outboundCode" placeholder="请输入出库单号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库日期" prop="outboundDate">
              <el-date-picker clearable
                              v-model="form.outboundDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择出库日期">
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
              <el-input v-model="form.purchaseContractCode" placeholder="请输入采购合同编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="form.customerName" placeholder="请输入客户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="telephone">
              <el-input v-model="form.telephone" placeholder="请输入电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址描述" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址描述"/>
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="产品名称" prop="proudctName">
              <el-autocomplete
                style="width: 100%"
                v-model="form.proudctName"
                :fetch-suggestions="queryProductInfoSearchAsync"
                placeholder="请输入产品名称"
                @select="handleProductInfoSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品规格" prop="goodsSearchstandard">
              <el-input v-model="form.goodsSearchstandard" placeholder="请输入商品规格"/>
              <input v-model="form.proudctId" type="hidden"/>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品单位" prop="goodsUnit">
              <el-input v-model="form.goodsUnit" placeholder="请输入商品单位【关联字典管理】"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="基准价" prop="basePrice">
              <el-input v-model="form.basePrice" placeholder="请输入基准价"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进货价" prop="incomePrice">
              <el-input v-model="form.incomePrice" placeholder="请输入进货价"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附加价格" prop="extraPrice">
              <el-input v-model="form.extraPrice" placeholder="请输入附加价格"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附件--销售基准价截图" prop="fj">
              <el-input v-model="form.fj" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
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
            <el-form-item label="销售数量" prop="saleNumber">
              <el-input v-model="form.saleNumber" placeholder="请输入销售数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售金额" prop="saleAmount">
              <el-input v-model="form.saleAmount" placeholder="请输入销售金额"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库对接人" prop="outboundUsername">
              <el-input v-model="form.outboundUsername" placeholder="请输入出库对接人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库审核人" prop="outboundReleaseuser">
              <el-input v-model="form.outboundReleaseuser" placeholder="请输入出库审核人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出库数量" prop="outboundNumber">
              <el-input v-model="form.outboundNumber" placeholder="请输入出库数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门ID" prop="deptId">
              <el-input v-model="form.deptId" placeholder="请输入部门ID"/>
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
import {listOutbound, getOutbound, delOutbound, addOutbound, updateOutbound} from "@/api/outbound/outbound";
import {listShopGoods} from "@/api/shopGoods/shopGoods";
import {getBasisCustomer} from "@/api/basisCustomer/basisCustomer";
import {listContractInfoSale} from "@/api/contractInfoSale/contractInfoSale";

export default {
  name: "Outbound",
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
      // 出库管理表格数据
      outboundList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
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
      form: {},
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
          {required: true, message: "销售合同编号不能为空", trigger: "change"}
        ],
        purchaseContractCode: [
          {required: true, message: "采购合同编号不能为空", trigger: "blur"}
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
          {required: true, message: "基准价不能为空", trigger: "blur"}
        ],
        incomePrice: [
          {required: true, message: "进货价不能为空", trigger: "blur"}
        ],
        extraPrice: [
          {required: true, message: "附加价格不能为空", trigger: "blur"}
        ],
        fj: [
          {required: true, message: "附件--销售基准价截图不能为空", trigger: "blur"}
        ],
        saleDate: [
          {required: true, message: "销售日期不能为空", trigger: "blur"}
        ],
        saleNumber: [
          {required: true, message: "销售数量不能为空", trigger: "blur"}
        ],
        saleAmount: [
          {required: true, message: "销售金额不能为空", trigger: "blur"}
        ],
        outboundUsername: [
          {required: true, message: "出库对接人不能为空", trigger: "blur"}
        ],
        outboundReleaseuser: [
          {required: true, message: "出库审核人不能为空", trigger: "blur"}
        ],
        outboundNumber: [
          {required: true, message: "出库数量不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
      let customerId = item.item.customerId;
      this.form.customerName = item.item.customerName;
      const id = customerId ;
        getBasisCustomer(id).then(response => {
          console.log(response);
        if (response.code == 200) {
          this.form.address = response.data.address;
          this.form.telephone = response.data.telephone;

          };
      })
    }



  }
};
</script>
