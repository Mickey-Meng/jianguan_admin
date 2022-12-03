<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标段编号" prop="bdbh">
        <el-input
          v-model="queryParams.bdbh"
          placeholder="请输入标段编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变更编号" prop="bgbh">
        <el-input
          v-model="queryParams.bgbh"
          placeholder="请输入变更编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="子目名称" prop="zmmc">
        <el-input
          v-model="queryParams.zmmc"
          placeholder="请输入子目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工程部位" prop="gcbw">
        <el-input
          v-model="queryParams.gcbw"
          placeholder="请输入工程部位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位" prop="dw">
        <el-input
          v-model="queryParams.dw"
          placeholder="请输入单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同单价" prop="htdj">
        <el-input
          v-model="queryParams.htdj"
          placeholder="请输入合同单价"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="新增单价" prop="xzdj">
        <el-input
          v-model="queryParams.xzdj"
          placeholder="请输入新增单价"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同数量" prop="htsl">
        <el-input
          v-model="queryParams.htsl"
          placeholder="请输入合同数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同金额" prop="htje">
        <el-input
          v-model="queryParams.htje"
          placeholder="请输入合同金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核数量" prop="shsl">
        <el-input
          v-model="queryParams.shsl"
          placeholder="请输入审核数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核金额" prop="shje">
        <el-input
          v-model="queryParams.shje"
          placeholder="请输入审核金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修正数量" prop="xzsl">
        <el-input
          v-model="queryParams.xzsl"
          placeholder="请输入修正数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修正金额" prop="xzje">
        <el-input
          v-model="queryParams.xzje"
          placeholder="请输入修正金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="已计量数量" prop="yjlsl">
        <el-input
          v-model="queryParams.yjlsl"
          placeholder="请输入已计量数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.data_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['ledgerChangeDetail:ledgerChangeDetail:add']"
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
          v-hasPermi="['ledgerChangeDetail:ledgerChangeDetail:edit']"
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
          v-hasPermi="['ledgerChangeDetail:ledgerChangeDetail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ledgerChangeDetail:ledgerChangeDetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ledgerChangeDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标段编号" align="center" prop="bdbh" />
      <el-table-column label="变更编号" align="center" prop="bgbh" />
      <el-table-column label="子目号" align="center" prop="zmh" v-if="true"/>
      <el-table-column label="子目名称" align="center" prop="zmmc" />
      <el-table-column label="工程部位" align="center" prop="gcbw" />
      <el-table-column label="单位" align="center" prop="dw" />
      <el-table-column label="合同单价" align="center" prop="htdj" />
      <el-table-column label="新增单价" align="center" prop="xzdj" />
      <el-table-column label="合同数量" align="center" prop="htsl" />
      <el-table-column label="合同金额" align="center" prop="htje" />
      <el-table-column label="审核数量" align="center" prop="shsl" />
      <el-table-column label="审核金额" align="center" prop="shje" />
      <el-table-column label="修正数量" align="center" prop="xzsl" />
      <el-table-column label="修正金额" align="center" prop="xzje" />
      <el-table-column label="已计量数量" align="center" prop="yjlsl" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ledgerChangeDetail:ledgerChangeDetail:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ledgerChangeDetail:ledgerChangeDetail:remove']"
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

    <!-- 添加或修改台账变更/工程变更 明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="ID" prop="id">
          <el-input v-model="form.id" placeholder="请输入ID" />
        </el-form-item>
        <el-form-item label="标段编号" prop="bdbh">
          <el-input v-model="form.bdbh" placeholder="请输入标段编号" />
        </el-form-item>
        <el-form-item label="变更编号" prop="bgbh">
          <el-input v-model="form.bgbh" placeholder="请输入变更编号" />
        </el-form-item>
        <el-form-item label="子目名称" prop="zmmc">
          <el-input v-model="form.zmmc" placeholder="请输入子目名称" />
        </el-form-item>
        <el-form-item label="工程部位" prop="gcbw">
          <el-input v-model="form.gcbw" placeholder="请输入工程部位" />
        </el-form-item>
        <el-form-item label="单位" prop="dw">
          <el-input v-model="form.dw" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="合同单价" prop="htdj">
          <el-input v-model="form.htdj" placeholder="请输入合同单价" />
        </el-form-item>
        <el-form-item label="新增单价" prop="xzdj">
          <el-input v-model="form.xzdj" placeholder="请输入新增单价" />
        </el-form-item>
        <el-form-item label="合同数量" prop="htsl">
          <el-input v-model="form.htsl" placeholder="请输入合同数量" />
        </el-form-item>
        <el-form-item label="合同金额" prop="htje">
          <el-input v-model="form.htje" placeholder="请输入合同金额" />
        </el-form-item>
        <el-form-item label="审核数量" prop="shsl">
          <el-input v-model="form.shsl" placeholder="请输入审核数量" />
        </el-form-item>
        <el-form-item label="审核金额" prop="shje">
          <el-input v-model="form.shje" placeholder="请输入审核金额" />
        </el-form-item>
        <el-form-item label="修正数量" prop="xzsl">
          <el-input v-model="form.xzsl" placeholder="请输入修正数量" />
        </el-form-item>
        <el-form-item label="修正金额" prop="xzje">
          <el-input v-model="form.xzje" placeholder="请输入修正金额" />
        </el-form-item>
        <el-form-item label="已计量数量" prop="yjlsl">
          <el-input v-model="form.yjlsl" placeholder="请输入已计量数量" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.data_status"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLedgerChangeDetail, getLedgerChangeDetail, delLedgerChangeDetail, addLedgerChangeDetail, updateLedgerChangeDetail } from "@/api/ledgerChangeDetail/ledgerChangeDetail";

export default {
  name: "LedgerChangeDetail",
  dicts: ['data_status'],
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
      // 台账变更/工程变更 明细表格数据
      ledgerChangeDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bdbh: undefined,
        bgbh: undefined,
        zmmc: undefined,
        gcbw: undefined,
        dw: undefined,
        htdj: undefined,
        xzdj: undefined,
        htsl: undefined,
        htje: undefined,
        shsl: undefined,
        shje: undefined,
        xzsl: undefined,
        xzje: undefined,
        yjlsl: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "ID不能为空", trigger: "blur" }
        ],
        bdbh: [
          { required: true, message: "标段编号不能为空", trigger: "blur" }
        ],
        bgbh: [
          { required: true, message: "变更编号不能为空", trigger: "blur" }
        ],
        zmh: [
          { required: true, message: "子目号不能为空", trigger: "blur" }
        ],
        zmmc: [
          { required: true, message: "子目名称不能为空", trigger: "blur" }
        ],
        gcbw: [
          { required: true, message: "工程部位不能为空", trigger: "blur" }
        ],
        dw: [
          { required: true, message: "单位不能为空", trigger: "blur" }
        ],
        htdj: [
          { required: true, message: "合同单价不能为空", trigger: "blur" }
        ],
        xzdj: [
          { required: true, message: "新增单价不能为空", trigger: "blur" }
        ],
        htsl: [
          { required: true, message: "合同数量不能为空", trigger: "blur" }
        ],
        htje: [
          { required: true, message: "合同金额不能为空", trigger: "blur" }
        ],
        shsl: [
          { required: true, message: "审核数量不能为空", trigger: "blur" }
        ],
        shje: [
          { required: true, message: "审核金额不能为空", trigger: "blur" }
        ],
        xzsl: [
          { required: true, message: "修正数量不能为空", trigger: "blur" }
        ],
        xzje: [
          { required: true, message: "修正金额不能为空", trigger: "blur" }
        ],
        yjlsl: [
          { required: true, message: "已计量数量不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询台账变更/工程变更 明细列表 */
    getList() {
      this.loading = true;
      listLedgerChangeDetail(this.queryParams).then(response => {
        this.ledgerChangeDetailList = response.rows;
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
        bdbh: undefined,
        bgbh: undefined,
        zmh: undefined,
        zmmc: undefined,
        gcbw: undefined,
        dw: undefined,
        htdj: undefined,
        xzdj: undefined,
        htsl: undefined,
        htje: undefined,
        shsl: undefined,
        shje: undefined,
        xzsl: undefined,
        xzje: undefined,
        yjlsl: undefined,
        status: "0",
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
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
      this.ids = selection.map(item => item.zmh)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加台账变更/工程变更 明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const zmh = row.zmh || this.ids
      getLedgerChangeDetail(zmh).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改台账变更/工程变更 明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.zmh != null) {
            updateLedgerChangeDetail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addLedgerChangeDetail(this.form).then(response => {
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
      const zmhs = row.zmh || this.ids;
      this.$modal.confirm('是否确认删除台账变更/工程变更 明细编号为"' + zmhs + '"的数据项？').then(() => {
        this.loading = true;
        return delLedgerChangeDetail(zmhs);
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
      this.download('ledgerChangeDetail/ledgerChangeDetail/export', {
        ...this.queryParams
      }, `ledgerChangeDetail_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
