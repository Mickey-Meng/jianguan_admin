<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="入库单号" prop="warehousingCode">
        <el-input
          v-model="queryParams.warehousingCode"
          placeholder="请输入入库单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对接人" prop="warehousingUsername">
        <el-input
          v-model="queryParams.warehousingUsername"
          placeholder="请输入入库对接人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入库时间" prop="warehousingDate">
        <el-date-picker clearable
          v-model="queryParams.warehousingDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择入库时间">
        </el-date-picker>
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
          v-hasPermi="['warehousing:warehousing:add']"
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
          v-hasPermi="['warehousing:warehousing:edit']"
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
          v-hasPermi="['warehousing:warehousing:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['warehousing:warehousing:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehousingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="false"/>
      <el-table-column label="入库单号" align="center" prop="warehousingCode" />
      <el-table-column label="采购合同号" align="center" prop="purchaseOrderId" />
      <el-table-column label="入库对接人" align="center" prop="warehousingUsername" />
      <el-table-column label="入库时间" align="center" prop="warehousingDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.warehousingDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehousingStatus" label="入库状态" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.warehousing_status" :value="scope.row.warehousingStatus"/>
        </template>
      </el-table-column>

      <el-table-column label="采购数量" align="center" prop="orderNumber" />
      <el-table-column label="产品名称" align="center" prop="proudctName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['warehousing:warehousing:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['warehousing:warehousing:remove']"
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


    <!-- 添加或修改入库管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入库单号" prop="warehousingCode">
              <el-input v-model="form.warehousingCode" placeholder="请输入入库单号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库对接人" prop="warehousingUsername">
              <el-input v-model="form.warehousingUsername" placeholder="请输入入库对接人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库复核人" prop="warehousingReleaseuser">
              <el-input v-model="form.warehousingReleaseuser" placeholder="请输入入库复核人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购订单id" prop="purchaseOrderId">
              <el-input v-model="form.purchaseOrderId" placeholder="请输入采购订单id" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品id" prop="proudctId">
              <el-input v-model="form.proudctId" placeholder="请输入产品id" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品名称" prop="proudctName">
              <el-autocomplete
                style="width: 100%"
                v-model="form.proudctName"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入产品名称"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="入库数量" prop="warehousingNumber">
              <el-input v-model="form.warehousingNumber" placeholder="请输入入库数量" />
            </el-form-item>
          </el-col>  <el-col :span="12">
            <el-form-item label="采购数量" prop="orderNumber">
              <el-input v-model="form.orderNumber" placeholder="请输入采购数量" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="入库状态" prop="warehousingStatus">
              <el-select style="width: 100%" v-model="form.warehousingStatus" placeholder="请输入入库状态">
                <el-option
                  v-for="dict in dict.type.warehousing_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="入库时间" prop="warehousingDate">
              <el-date-picker clearable
                              v-model="form.warehousingDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择入库时间">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="到货日期" prop="arrivalDate">
              <el-date-picker clearable
                              v-model="form.arrivalDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择到货日期">
              </el-date-picker>
            </el-form-item>
          </el-col><el-col :span="12">
          <el-form-item label="采购员" prop="purchaser">
            <el-input v-model="form.purchaser" placeholder="请输入采购员" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="合同id(后期隐藏)" prop="contractId">
            <el-input v-model="form.contractId" placeholder="请输入采购合同id" />
          </el-form-item>
        </el-col>
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
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="form.supplierName" placeholder="请输入供应商名称" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="供应商电话" prop="mobilePhone">
            <el-input v-model="form.mobilePhone" placeholder="请输入供应商电话" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="供应商地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入供应商地址" />
          </el-form-item>
        </el-col>
          <el-col :span="12">
            <el-form-item label="基准价" prop="basePrice">
              <el-input v-model="form.basePrice" placeholder="请输入基准价" />
            </el-form-item>
          </el-col><el-col :span="12">
          <el-form-item label="进货价" prop="incomePrice">
            <el-input v-model="form.incomePrice" placeholder="请输入进货价" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="附加价格" prop="extraPrice">
            <el-input v-model="form.extraPrice" placeholder="请输入附加价格" />
          </el-form-item>
        </el-col><el-col :span="12">
          <el-form-item label="进货基准价截图" prop="fj">
            <upload @input="getFileList"/>
          </el-form-item>
        </el-col>
          <el-col :span="12">
          <el-form-item label="进货日期，默认系统当天日期" prop="incomeDate">
            <el-date-picker clearable
                            v-model="form.incomeDate"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择进货日期，默认系统当天日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
          <el-col :span="12">
            <el-form-item label="最后付款日期" prop="lastPaymentDate">
              <el-date-picker clearable
                              v-model="form.lastPaymentDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择最后付款日期">
              </el-date-picker>
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
import { listWarehousing, getWarehousing, delWarehousing, addWarehousing, updateWarehousing } from "@/api/warehousing/warehousing";
import {listShopGoods} from "@/api/shopGoods/shopGoods";
import {listBasisSupplier} from "@/api/basisSupplier/basisSupplier";
import {listContractInfoPurchase} from "@/api/contractInfoPurchase/contractInfoPurchase"

export default {
  name: "Warehousing",
  dicts: ['warehousing_status'],
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
      // 入库管理表格数据
      warehousingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehousingCode: undefined,
        warehousingUsername: undefined,
        warehousingDate: undefined,
        orderNumber: undefined,
        proudctName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "id不能为空", trigger: "blur" }
        ],
        warehousingCode: [
          { required: true, message: "入库单号不能为空", trigger: "blur" }
        ],
        warehousingUsername: [
          { required: true, message: "入库对接人不能为空", trigger: "blur" }
        ],
        proudctId: [
          { required: true, message: "产品id不能为空", trigger: "blur" }
        ],
        warehousingNumber: [
          { required: true, message: "入库数量不能为空", trigger: "blur" }
        ],
        orderNumber: [
          { required: true, message: "入库数量不能为空", trigger: "blur" }
        ],
        warehousingDate: [
          { required: true, message: "入库时间不能为空", trigger: "blur" }
        ],
        proudctName: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        arrivalDate: [
          { required: true, message: "到货日期不能为空", trigger: "blur" }
        ],
        purchaser: [
          { required: true, message: "采购员不能为空", trigger: "blur" }
        ],
        contractId: [
          { required: true, message: "采购合同id不能为空", trigger: "blur" }
        ],
        contractCode: [
          { required: true, message: "采购合同编码不能为空", trigger: "blur" }
        ],
        supplierName: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询入库管理列表 */
    getList() {
      this.loading = true;
      listWarehousing(this.queryParams).then(response => {
        this.warehousingList = response.rows;
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
        warehousingCode: undefined,
        warehousingUsername: undefined,
        purchaseOrderId: undefined,
        proudctId: undefined,
        warehousingNumber: undefined,
        warehousingStatus: undefined,
        warehousingDate: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        orderNumber: undefined,
        updateTime: undefined,
        remark: undefined,
        deptId: undefined,
        proudctName: undefined,
        arrivalDate: undefined,
        purchaser: undefined,
        contractId: undefined,
        contractCode: undefined,
        supplierName: undefined,
        mobilePhone: undefined,
        address: undefined
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
      this.title = "添加入库管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getWarehousing(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改入库管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateWarehousing(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addWarehousing(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除入库管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delWarehousing(ids);
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
      this.download('warehousing/warehousing/export', {
        ...this.queryParams
      }, `warehousing_${new Date().getTime()}.xlsx`)
    },
    /*
  *    **/
    querySearchAsync(queryString, cb) {
      const queryParams = {
        productName: queryString,
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
      this.form.proudctId = item.item.id;
      console.log(item);
    },

    /*
    *    **/
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
                supplierName: item.supplierName,
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
      this.form.supplierName = item.item.supplierName;
      this.form.mobilePhone = item.item.mobilePhone;
      this.form.contractId = item.item.contractId;
      this.form.purchaser = item.item.purchaser;
      console.log(item);
    },
    getFileList (val) {
      this.fileList = [];
      this.fileList = val;
    },
  }
};
</script>
