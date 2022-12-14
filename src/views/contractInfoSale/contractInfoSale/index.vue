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
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
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
      </el-form-item>
      <el-form-item label="质保金到期时间" prop="retentionDate">
        <el-date-picker clearable
          v-model="queryParams.retentionDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择质保金到期时间">
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
          v-hasPermi="['contractInfoSale:contractInfoSale:add']"
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
          v-hasPermi="['contractInfoSale:contractInfoSale:edit']"
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
          v-hasPermi="['contractInfoSale:contractInfoSale:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['contractInfoSale:contractInfoSale:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contractInfoSaleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="合同id" align="center" prop="id" v-if="false"/>
      <el-table-column label="合同编码" align="center" prop="contractCode" />
      <el-table-column label="合同名称" align="center" prop="contractName" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
      <el-table-column label="总金额" align="center" prop="amount" />
      <el-table-column label="合同签订时间" align="center" prop="contactDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.contactDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否已签合同" align="center" prop="contractStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.contractStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['contractInfoSale:contractInfoSale:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['contractInfoSale:contractInfoSale:remove']"
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

    <!-- 添加或修改合同管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
        <el-form-item label="合同编码" prop="contractCode">
          <el-input v-model="form.contractCode" placeholder="请输入合同编码" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="form.contractName" placeholder="请输入合同名称" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="客户id" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户id" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="总金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入总金额" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="质保金" prop="retentionAmount">
          <el-input v-model="form.retentionAmount" placeholder="请输入质保金" />
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
        <el-form-item label="质保金到期时间" prop="retentionDate">
          <el-date-picker clearable
            v-model="form.retentionDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择质保金到期时间">
          </el-date-picker>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="税率" prop="rate">
          <el-input v-model="form.rate" placeholder="请输入税率" />
        </el-form-item>
          </el-col>

          <el-col :span="12">
        <el-form-item label="发货地" prop="area">
          <el-input v-model="form.area" placeholder="请输入发货地" />
        </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="合同是否已签订" prop="contractStatus">
              <el-select v-model="form.contractStatus" placeholder="请选择合同是否已签订">
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
        <el-form-item label="附件" prop="fj">
          <el-input v-model="form.fj" type="textarea" placeholder="请输入内容" />
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
import { listContractInfoSale, getContractInfoSale, delContractInfoSale, addContractInfoSale, updateContractInfoSale } from "@/api/contractInfoSale/contractInfoSale";

export default {
  name: "ContractInfoSale",
  dicts: ['sys_yes_no'],
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
      // 合同管理表格数据
      contractInfoSaleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractCode: undefined,
        contractName: undefined,
        customerName: undefined,
        amount: undefined,
        contactDate: undefined,
        retentionDate: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "合同id不能为空", trigger: "blur" }
        ],
        contractCode: [
          { required: true, message: "合同编码不能为空", trigger: "blur" }
        ],
        contractName: [
          { required: true, message: "合同名称不能为空", trigger: "blur" }
        ],
        customerName: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        customerId: [
          { required: true, message: "客户id不能为空", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "总金额不能为空", trigger: "blur" }
        ],
        retentionAmount: [
          { required: true, message: "质保金不能为空", trigger: "blur" }
        ],
        contactDate: [
          { required: true, message: "合同签订时间不能为空", trigger: "blur" }
        ],
        retentionDate: [
          { required: true, message: "质保金到期时间不能为空", trigger: "blur" }
        ],
        rate: [
          { required: true, message: "税率不能为空", trigger: "blur" }
        ],
        area: [
          { required: true, message: "发货地不能为空", trigger: "blur" }
        ],
        contractStatus: [
          { required: true, message: "1已签订 0未签订不能为空", trigger: "blur" }
        ]

      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询合同管理列表 */
    getList() {
      this.loading = true;
      listContractInfoSale(this.queryParams).then(response => {
        this.contractInfoSaleList = response.rows;
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
        contractCode: undefined,
        contractName: undefined,
        customerName: undefined,
        customerId: undefined,
        amount: undefined,
        retentionAmount: undefined,
        contactDate: undefined,
        retentionDate: undefined,
        rate: undefined,
        area: undefined,
        contractStatus: undefined,
        fj: undefined,
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加销售合同管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getContractInfoSale(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改销售合同管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateContractInfoSale(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addContractInfoSale(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除合同管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delContractInfoSale(ids);
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
      this.download('contractInfoSale/contractInfoSale/export', {
        ...this.queryParams
      }, `contractInfoSale_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
