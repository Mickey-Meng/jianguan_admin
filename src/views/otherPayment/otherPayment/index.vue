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
      <el-form-item label="计量期次" prop="jlqsbh">
        <el-input
          v-model="queryParams.jlqsbh"
          placeholder="请输入计量期次"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请编号" prop="sqbh">
        <el-input
          v-model="queryParams.sqbh"
          placeholder="请输入申请编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="申请日期" prop="sqsj">
        <el-date-picker clearable
          v-model="queryParams.sqsj"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择申请日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="所属单位" prop="ssdw">
        <el-input
          v-model="queryParams.ssdw"
          placeholder="请输入所属单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="款项类型" prop="kxlx">
        <el-input
          v-model="queryParams.kxlx"
          placeholder="请输入款项类型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="款项金额" prop="kxje">
        <el-input
          v-model="queryParams.kxje"
          placeholder="请输入款项金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="附件" prop="fj">
        <el-input
          v-model="queryParams.fj"
          placeholder="请输入附件"
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
          v-hasPermi="['otherPayment:otherPayment:add']"
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
          v-hasPermi="['otherPayment:otherPayment:edit']"
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
          v-hasPermi="['otherPayment:otherPayment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['otherPayment:otherPayment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="otherPaymentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="false"/>
      <el-table-column label="标段编号" align="center" prop="bdbh" />
      <el-table-column label="计量期次" align="center" prop="jlqsbh" />
      <el-table-column label="申请编号" align="center" prop="sqbh" />
      <el-table-column label="申请日期" align="center" prop="sqsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sqsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属单位" align="center" prop="ssdw" v-if="false" />
      <el-table-column label="款项类型" align="center" prop="kxlx"  v-if="false"/>
      <el-table-column label="款项金额" align="center" prop="kxje" />
      <el-table-column label="附件" align="center" prop="fj"  v-if="false"/>
      <el-table-column label="状态" align="center" prop="status"  v-if="false">
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
            v-hasPermi="['otherPayment:otherPayment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['otherPayment:otherPayment:remove']"
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

    <!-- 添加或修改其他款项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标段编号" prop="bdbh">
          <el-input v-model="form.bdbh" placeholder="请输入标段编号" />
        </el-form-item>
        <el-form-item label="计量期次" prop="jlqsbh">
          <el-input v-model="form.jlqsbh" placeholder="请输入计量期次" />
        </el-form-item>
        <el-form-item label="申请编号" prop="sqbh">
          <el-input v-model="form.sqbh" placeholder="请输入申请编号" />
        </el-form-item>
        <el-form-item label="申请日期" prop="sqsj">
          <el-date-picker clearable
            v-model="form.sqsj"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属单位" prop="ssdw">
          <el-input v-model="form.ssdw" placeholder="请输入所属单位" />
        </el-form-item>
        <el-form-item label="款项类型" prop="kxlx">
          <el-input v-model="form.kxlx" placeholder="请输入款项类型" />
        </el-form-item>
        <el-form-item label="款项金额" prop="kxje">
          <el-input v-model="form.kxje" placeholder="请输入款项金额" />
        </el-form-item>
        <el-form-item label="附件" prop="fj">
          <el-input v-model="form.fj" type="textarea" placeholder="请输入内容" />
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
import { listOtherPayment, getOtherPayment, delOtherPayment, addOtherPayment, updateOtherPayment } from "@/api/otherPayment/otherPayment";

export default {
  name: "OtherPayment",
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
      // 其他款项表格数据
      otherPaymentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bdbh: undefined,
        jlqsbh: undefined,
        sqbh: undefined,
        sqsj: undefined,
        ssdw: undefined,
        kxlx: undefined,
        kxje: undefined,
        fj: undefined,
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
        jlqsbh: [
          { required: true, message: "计量期次不能为空", trigger: "blur" }
        ],
        sqbh: [
          { required: true, message: "申请编号不能为空", trigger: "blur" }
        ],
        sqsj: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        ssdw: [
          { required: true, message: "所属单位不能为空", trigger: "blur" }
        ],
        kxlx: [
          { required: true, message: "款项类型不能为空", trigger: "blur" }
        ],
        kxje: [
          { required: true, message: "款项金额不能为空", trigger: "blur" }
        ],
        fj: [
          { required: true, message: "附件不能为空", trigger: "blur" }
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
    /** 查询其他款项列表 */
    getList() {
      this.loading = true;
      listOtherPayment(this.queryParams).then(response => {
        this.otherPaymentList = response.rows;
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
        jlqsbh: undefined,
        sqbh: undefined,
        sqsj: undefined,
        ssdw: undefined,
        kxlx: undefined,
        kxje: undefined,
        fj: undefined,
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
      this.title = "添加其他款项";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getOtherPayment(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改其他款项";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateOtherPayment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addOtherPayment(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除其他款项编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delOtherPayment(ids);
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
      this.download('otherPayment/otherPayment/export', {
        ...this.queryParams
      }, `otherPayment_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
