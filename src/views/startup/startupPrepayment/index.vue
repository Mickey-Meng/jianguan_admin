<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
    <el-col :span="6" :xs="24">
    <el-table v-loading="qsloading" :data="measurementNoList" @row-click="rowQsClick">
      <el-table-column label="ID" align="center" prop="id" v-if="false"/>
      <el-table-column label="期数" align="center" prop="name" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
    </el-table>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form-item label="标段编号" prop="bdbh">
        <el-input
          v-model="queryParams.bdbh"
          placeholder="请输入标段编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
   <!-- <el-form-item label="计量期次编号" prop="jlqsbh">
        <el-input
          v-model="queryParams.jlqsbh"
          placeholder="请输入计量期次编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="申请编号" prop="sqbh">
        <el-input
          v-model="queryParams.sqbh"
          placeholder="请输入申请编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
     <!--    <el-form-item label="申请日期" prop="sqsj">
        <el-date-picker clearable
          v-model="queryParams.sqsj"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择申请日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请类型" prop="sqlx">
        <el-input
          v-model="queryParams.sqlx"
          placeholder="请输入申请类型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请次数" prop="sqcs">
        <el-input
          v-model="queryParams.sqcs"
          placeholder="请输入申请次数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预付款金额" prop="yukje">
        <el-input
          v-model="queryParams.yukje"
          placeholder="请输入预付款金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请依据" prop="sqyj">
        <el-input
          v-model="queryParams.sqyj"
          placeholder="请输入申请依据"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="附件地址" prop="fj">
        <el-input
          v-model="queryParams.fj"
          placeholder="请输入附件地址"
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
          v-hasPermi="['startup:startupPrepayment:add']"
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
          v-hasPermi="['startup:startupPrepayment:edit']"
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
          v-hasPermi="['startup:startupPrepayment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['startup:startupPrepayment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="startupPrepaymentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="false"/>
      <!-- <el-table-column label="标段编号" align="center" prop="bdbh" /> -->
      <!-- <el-table-column label="计量期次编号" align="center" prop="jlqsbh" /> -->
      <el-table-column label="申请编号" align="center" prop="sqbh" />
      <el-table-column label="申请日期" align="center" prop="sqsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sqsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请类型" align="center" prop="sqlx" />
      <el-table-column label="申请次数" align="center" prop="sqcs" v-if="false" />
      <el-table-column label="预付款金额" align="center" prop="yukje" />
      <el-table-column label="申请依据" align="center" prop="sqyj" v-if="false"/>
      <el-table-column label="附件地址" align="center" prop="fj" v-if="false"/>
      <el-table-column label="状态" align="center" prop="status" v-if="false"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['startup:startupPrepayment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['startup:startupPrepayment:remove']"
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

      </el-col>
      </el-row>
  
    <!-- 添加或修改开工预付款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标段编号" prop="bdbh">
          <el-input v-model="form.bdbh" placeholder="请输入标段编号" />
        </el-form-item>
        <el-form-item label="期次编号" prop="jlqsbh">
          <el-select v-model="form.jlqsbh" placeholder="请选择期次">
            <el-option
              v-for="item in jlqsbhOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
         </el-select>
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
        <el-form-item label="申请类型" prop="sqlx">
          <el-input v-model="form.sqlx" placeholder="请输入申请类型" />
        </el-form-item>
        <el-form-item label="申请次数" prop="sqcs">
          <el-input v-model="form.sqcs" placeholder="请输入申请次数" />
        </el-form-item>
        <el-form-item label="预付款金额" prop="yukje">
          <el-input v-model="form.yukje" placeholder="请输入预付款金额" />
        </el-form-item>
        <el-form-item label="申请依据" prop="sqyj">
          <el-input v-model="form.sqyj" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="附件地址">
        <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png/excel/word文件，且不超过500kb</div>
        </el-upload>
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
import { listStartupPrepayment, getStartupPrepayment, delStartupPrepayment, addStartupPrepayment, updateStartupPrepayment } from "@/api/startup/startupPrepayment";
import { listMeasurementListNo} from "@/api/measurementNo/measurementNo";
export default {
  name: "StartupPrepayment",
  dicts: ['data_status'],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 遮罩层
      qsloading: true,
      //选中期数
      xzQsId: "",
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
      // 开工预付款表格数据
      startupPrepaymentList: [],
      // 中间计量期数管理表格数据
      measurementNoList: [],
      jlqsbhOptions:[],
      fileList: [],
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
        sqlx: undefined,
        sqcs: undefined,
        yukje: undefined,
        sqyj: undefined,
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
        // jlqsbh: [
        //   { required: true, message: "计量期次编号不能为空", trigger: "blur" }
        // ],
        sqbh: [
          { required: true, message: "开工预付款申请编号不能为空", trigger: "blur" }
        ],
        sqsj: [
          { required: true, message: "申请日期不能为空", trigger: "blur" }
        ],
        sqlx: [
          { required: true, message: "申请类型不能为空", trigger: "blur" }
        ],
        sqcs: [
          { required: true, message: "申请次数不能为空", trigger: "blur" }
        ],
        yukje: [
          { required: true, message: "预付款金额不能为空", trigger: "blur" }
        ],
        sqyj: [
          { required: true, message: "申请依据不能为空", trigger: "blur" }
        ],
        // fj: [
        //   { required: true, message: "附件地址不能为空", trigger: "blur" }
        // ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getPeriodsList();
  },
  methods: {
    /** 查询开工预付款列表 */
    getList() {
      this.loading = true;
      listStartupPrepayment(this.queryParams).then(response => {
        this.startupPrepaymentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
     /** 查询中间计量期数管理列表 */
     getPeriodsList() {
      this.qsloading = true;
      listMeasurementListNo().then(response => {
        this.measurementNoList = response.data;
        this.qsloading = false;
      });
    },
    rowQsClick(record,index){ 
      this.xzQsId=record.id;
      this.queryParams.jlqsbh = record.id;
      this.queryParams.pageNum = 1;
      this.getList();
    }, 
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        console.log(files);
        console.log(fileList);
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
      , 
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
        sqlx: undefined,
        sqcs: undefined,
        yukje: undefined,
        sqyj: undefined,
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
      listMeasurementListNo().then(response => {
        this.jlqsbhOptions = response.data;
      });
      this.reset();
      this.open = true;
      this.title = "添加开工预付款";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      listMeasurementListNo().then(response => {
        this.jlqsbhOptions = response.data;
      });
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getStartupPrepayment(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改开工预付款";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            if(this.xzQsId==""){
              this.$modal.confirm("请选择期数");
            }
            this.form.fj="http://www.baidu.com";
            this.form.fj=this.fileList;
            updateStartupPrepayment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            this.form.fj="http://www.baidu.com";
            addStartupPrepayment(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除开工预付款编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delStartupPrepayment(ids);
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
      this.download('startup/startupPrepayment/export', {
        ...this.queryParams
      }, `startupPrepayment_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
