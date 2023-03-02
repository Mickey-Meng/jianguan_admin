<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="标段编号" prop="bdbh">
        <el-input
          v-model="queryParams.bdbh"
          placeholder="请输入标段编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计量期数编号" prop="jlqsbh">
        <el-input
          v-model="queryParams.jlqsbh"
          placeholder="请输入计量期数编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="计量期数" prop="jlqs">
        <el-input
          v-model="queryParams.jlqs"
          placeholder="请输入计量期数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始日期" prop="ksrq">
        <el-date-picker clearable
          v-model="queryParams.ksrq"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="jsrq">
        <el-date-picker clearable
          v-model="queryParams.jsrq"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="默认日期" prop="mrrq">
        <el-date-picker clearable
          v-model="queryParams.mrrq"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择默认日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报表编号" prop="bbbh">
        <el-input
          v-model="queryParams.bbbh"
          placeholder="请输入报表编号"
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
          v-hasPermi="['measurementNo:measurementNo:add']"
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
          v-hasPermi="['measurementNo:measurementNo:edit']"
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
          v-hasPermi="['measurementNo:measurementNo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['measurementNo:measurementNo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :header-cell-style="headercellStyle"
      :cell-style="cellStyle" :data="measurementNoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" min-width="120" :show-overflow-tooltip="true" v-if="false"/>
      <el-table-column label="标段编号" align="center" prop="bdbh" />
      <el-table-column label="计量期数编号" align="center" prop="jlqsbh" />
      <el-table-column label="计量期数" align="center" min-width="150" prop="jlqs" />
      <el-table-column label="开始日期" align="center" prop="ksrq" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ksrq, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" prop="jsrq" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.jsrq, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认日期" align="center" prop="mrrq" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.mrrq, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报表编号" align="center" prop="bbbh" />
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
            v-hasPermi="['measurementNo:measurementNo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['measurementNo:measurementNo:remove']"
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

    <!-- 添加或修改中间计量期数管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" v-if="open" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标段编号" prop="bdbh">
          <el-input v-model="form.bdbh" placeholder="请输入标段编号" />
        </el-form-item>
        <el-form-item label="计量期数编号" prop="jlqsbh">
          <el-input v-model="form.jlqsbh" placeholder="请输入计量期数编号" />
        </el-form-item>
        <el-form-item label="计量期数" prop="jlqs">
          <el-input v-model="form.jlqs" placeholder="请输入计量期数" />
        </el-form-item>
        <el-form-item label="开始日期" prop="ksrq">
          <el-date-picker clearable
            v-model="form.ksrq"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="jsrq">
          <el-date-picker clearable
            v-model="form.jsrq"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="默认日期" prop="mrrq">
          <el-date-picker clearable
            v-model="form.mrrq"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择默认日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报表编号" prop="bbbh">
          <el-input v-model="form.bbbh" placeholder="请输入报表编号" />
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
import { listMeasurementNo, getMeasurementNo, delMeasurementNo, addMeasurementNo, updateMeasurementNo } from "@/api/measurementNo/measurementNo";

export default {
  name: "MeasurementNo",
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
      // 中间计量期数管理表格数据
      measurementNoList: [],
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
        jlqs: undefined,
        ksrq: undefined,
        jsrq: undefined,
        mrrq: undefined,
        bbbh: undefined,
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
          { required: true, message: "计量期数编号不能为空", trigger: "blur" }
        ],
        jlqs: [
          { required: true, message: "计量期数不能为空", trigger: "blur" }
        ],
        ksrq: [
          { required: true, message: "开始日期不能为空", trigger: "blur" }
        ],
        jsrq: [
          { required: true, message: "结束日期不能为空", trigger: "blur" }
        ],
        mrrq: [
          { required: true, message: "默认日期不能为空", trigger: "blur" }
        ],
        bbbh: [
          { required: true, message: "报表编号不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      },
      headercellStyle: {
          fontFamily: 'PingFangSC-Regular',
          background: '#F7F8FB',
          color: '#12182A',
          fontWeight: 600,
          height: '44px',
          fontSize: '14px',
      },
      cellStyle: {
          fontFamily: 'PingFangSC-Regular',
          color: '#3A4566',
          height: '44px',
          fontSize: '14px',
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询中间计量期数管理列表 */
    getList() {
      this.loading = true;
      listMeasurementNo(this.queryParams).then(response => {
        this.measurementNoList = response.rows;
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
        jlqs: undefined,
        ksrq: undefined,
        jsrq: undefined,
        mrrq: undefined,
        bbbh: undefined,
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
      this.title = "添加中间计量期数管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getMeasurementNo(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改中间计量期数管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateMeasurementNo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addMeasurementNo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除中间计量期数管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delMeasurementNo(ids);
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
      this.download('measurementNo/measurementNo/export', {
        ...this.queryParams
      }, `measurementNo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
