<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="变更编号" prop="bgbh">
        <el-input
          v-model="queryParams.bgbh"
          placeholder="请输入变更编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变更事项" prop="bgsx">
        <el-input
          v-model="queryParams.bgsx"
          placeholder="请输入变更事项"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变更等级" prop="bgdj">
        <el-input
          v-model="queryParams.bgdj"
          placeholder="请输入变更等级"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变更类型" prop="bglx">
        <el-input
          v-model="queryParams.bglx"
          placeholder="请输入变更类型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="桩号" prop="zh">
        <el-input
          v-model="queryParams.zh"
          placeholder="请输入桩号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="子目号" prop="zmh">
        <el-input
          v-model="queryParams.zmh"
          placeholder="请输入子目号"
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
      <el-form-item label="图号" prop="th">
        <el-input
          v-model="queryParams.th"
          placeholder="请输入图号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请日期" prop="sqrq">
        <el-date-picker clearable
          v-model="queryParams.sqrq"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择申请日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="变更金额" prop="bgje">
        <el-input
          v-model="queryParams.bgje"
          placeholder="请输入变更金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变更原因" prop="bgyy">
        <el-input
          v-model="queryParams.bgyy"
          placeholder="请输入变更原因"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计算式" prop="jss">
        <el-input
          v-model="queryParams.jss"
          placeholder="请输入计算式"
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
          v-hasPermi="['ledgerChange:ledgerChange:add']"
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
          v-hasPermi="['ledgerChange:ledgerChange:edit']"
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
          v-hasPermi="['ledgerChange:ledgerChange:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ledgerChange:ledgerChange:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ledgerChangeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="false"/>
      <el-table-column label="变更编号" align="center" prop="bgbh" />
      <el-table-column label="变更事项" align="center" prop="bgsx" />
      <el-table-column label="变更等级" align="center" prop="bgdj" />
      <el-table-column label="变更类型" align="center" prop="bglx" />
      <el-table-column label="桩号" align="center" prop="zh" />
      <el-table-column label="子目号" align="center" prop="zmh" />
      <el-table-column label="工程部位" align="center" prop="gcbw" />
      <el-table-column label="图号" align="center" prop="th" />
      <el-table-column label="申请日期" align="center" prop="sqrq" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sqrq, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变更金额" align="center" prop="bgje" />
      <el-table-column label="变更原因" align="center" prop="bgyy" />
      <el-table-column label="计算式" align="center" prop="jss" />
      <el-table-column label="数据状态" align="center" prop="dataStatus" />
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
            v-hasPermi="['ledgerChange:ledgerChange:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ledgerChange:ledgerChange:remove']"
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

    <!-- 添加或修改台账变更/工程变更对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="变更编号" prop="bgbh">
          <el-input v-model="form.bgbh" placeholder="请输入变更编号" />
        </el-form-item>
        <el-form-item label="变更事项" prop="bgsx">
          <el-input v-model="form.bgsx" placeholder="请输入变更事项" />
        </el-form-item>
        <el-form-item label="变更等级" prop="bgdj">
          <el-input v-model="form.bgdj" placeholder="请输入变更等级" />
        </el-form-item>
        <el-form-item label="变更类型" prop="bglx">
          <el-input v-model="form.bglx" placeholder="请输入变更类型" />
        </el-form-item>
        <el-form-item label="桩号" prop="zh">
          <el-input v-model="form.zh" placeholder="请输入桩号" />
        </el-form-item>
        <el-form-item label="子目号" prop="zmh">
          <el-input v-model="form.zmh" placeholder="请输入子目号" />
        </el-form-item>
        <el-form-item label="工程部位" prop="gcbw">
          <el-input v-model="form.gcbw" placeholder="请输入工程部位" />
        </el-form-item>
        <el-form-item label="图号" prop="th">
          <el-input v-model="form.th" placeholder="请输入图号" />
        </el-form-item>
        <el-form-item label="申请日期" prop="sqrq">
          <el-date-picker clearable
            v-model="form.sqrq"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="变更金额" prop="bgje">
          <el-input v-model="form.bgje" placeholder="请输入变更金额" />
        </el-form-item>
        <el-form-item label="变更原因" prop="bgyy">
          <el-input v-model="form.bgyy" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="计算式" prop="jss">
          <el-input v-model="form.jss" type="textarea" placeholder="请输入内容" />
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
import { listLedgerChange, getLedgerChange, delLedgerChange, addLedgerChange, updateLedgerChange } from "@/api/ledgerChange/ledgerChange";

export default {
  name: "LedgerChange",
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
      // 台账变更/工程变更表格数据
      ledgerChangeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bgbh: undefined,
        bgsx: undefined,
        bgdj: undefined,
        bglx: undefined,
        zh: undefined,
        zmh: undefined,
        gcbw: undefined,
        th: undefined,
        sqrq: undefined,
        bgje: undefined,
        bgyy: undefined,
        jss: undefined,
        dataStatus: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "ID不能为空", trigger: "blur" }
        ],
        bgbh: [
          { required: true, message: "变更编号不能为空", trigger: "blur" }
        ],
        bgsx: [
          { required: true, message: "变更事项不能为空", trigger: "blur" }
        ],
        bgdj: [
          { required: true, message: "变更等级不能为空", trigger: "blur" }
        ],
        bglx: [
          { required: true, message: "变更类型不能为空", trigger: "blur" }
        ],
        zh: [
          { required: true, message: "桩号不能为空", trigger: "blur" }
        ],
        zmh: [
          { required: true, message: "子目号不能为空", trigger: "blur" }
        ],
        gcbw: [
          { required: true, message: "工程部位不能为空", trigger: "blur" }
        ],
        th: [
          { required: true, message: "图号不能为空", trigger: "blur" }
        ],
        sqrq: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        bgje: [
          { required: true, message: "变更金额不能为空", trigger: "blur" }
        ],
        bgyy: [
          { required: true, message: "变更原因不能为空", trigger: "blur" }
        ],
        jss: [
          { required: true, message: "计算式不能为空", trigger: "blur" }
        ],
        dataStatus: [
          { required: true, message: "数据状态不能为空", trigger: "blur" }
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
    /** 查询台账变更/工程变更列表 */
    getList() {
      this.loading = true;
      listLedgerChange(this.queryParams).then(response => {
        this.ledgerChangeList = response.rows;
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
        bgbh: undefined,
        bgsx: undefined,
        bgdj: undefined,
        bglx: undefined,
        zh: undefined,
        zmh: undefined,
        gcbw: undefined,
        th: undefined,
        sqrq: undefined,
        bgje: undefined,
        bgyy: undefined,
        jss: undefined,
        dataStatus: "0",
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加台账变更/工程变更";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getLedgerChange(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改台账变更/工程变更";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateLedgerChange(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addLedgerChange(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除台账变更/工程变更编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delLedgerChange(ids);
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
      this.download('ledgerChange/ledgerChange/export', {
        ...this.queryParams
      }, `ledgerChange_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
