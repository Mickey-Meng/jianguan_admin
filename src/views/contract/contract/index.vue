<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标段编号" prop="BDBH">
        <el-input
          v-model="queryParams.BDBH"
          placeholder="请输入标段编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开工日期" prop="KGRQ">
        <el-date-picker clearable
          v-model="queryParams.KGRQ"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开工日期,YYYY-MM-DD">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="竣工日期" prop="JGRQ">
        <el-date-picker clearable
          v-model="queryParams.JGRQ"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择竣工日期,YYYY-MM-DD">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目名称" prop="XMMC">
        <el-input
          v-model="queryParams.XMMC"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="合同总金额" prop="HTZJE">
        <el-input
          v-model="queryParams.HTZJE"
          placeholder="请输入合同总金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同段" prop="HTD">
        <el-input
          v-model="queryParams.HTD"
          placeholder="请输入合同段"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工程量清单金额" prop="GCLQDJE">
        <el-input
          v-model="queryParams.GCLQDJE"
          placeholder="请输入工程量清单金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开工预付款金额" prop="KGYFKJE">
        <el-input
          v-model="queryParams.KGYFKJE"
          placeholder="请输入开工预付款金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="暂列金金额" prop="ZLJJE">
        <el-input
          v-model="queryParams.ZLJJE"
          placeholder="请输入暂列金金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同工期 (月/天  24/730)" prop="HTGQ">
        <el-input
          v-model="queryParams.HTGQ"
          placeholder="请输入合同工期 (月/天  24/730)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开工预付款起扣比例" prop="KGYFKQKBL">
        <el-input
          v-model="queryParams.KGYFKQKBL"
          placeholder="请输入开工预付款起扣比例"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开工预付款截止比例" prop="KGYFKJZBL">
        <el-input
          v-model="queryParams.KGYFKJZBL"
          placeholder="请输入开工预付款截止比例"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="质保金扣款比例" prop="ZBJKKBL">
        <el-input
          v-model="queryParams.ZBJKKBL"
          placeholder="请输入质保金扣款比例"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="农民工工资保证金扣款比例" prop="NMGGZBZJKKBL">
        <el-input
          v-model="queryParams.NMGGZBZJKKBL"
          placeholder="请输入农民工工资保证金扣款比例"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="质保金总额" prop="ZBJZE">
        <el-input
          v-model="queryParams.ZBJZE"
          placeholder="请输入质保金总额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计日工金额" prop="JRGJE">
        <el-input
          v-model="queryParams.JRGJE"
          placeholder="请输入计日工金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标段长度" prop="BDCD">
        <el-input
          v-model="queryParams.BDCD"
          placeholder="请输入标段长度"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="起讫桩号" prop="QQZH">
        <el-input
          v-model="queryParams.QQZH"
          placeholder="请输入起讫桩号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开工预付款支付情况" prop="KGYJKZFQK">
        <el-input
          v-model="queryParams.KGYJKZFQK"
          placeholder="请输入开工预付款支付情况"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开工预付款扣回规定" prop="KGYFKKHGD">
        <el-input
          v-model="queryParams.KGYFKKHGD"
          placeholder="请输入开工预付款扣回规定"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="材料预付款支付情况" prop="CLYKFZFQK">
        <el-input
          v-model="queryParams.CLYKFZFQK"
          placeholder="请输入材料预付款支付情况"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="材料预付款扣回规定" prop="CLYFKKHGD">
        <el-input
          v-model="queryParams.CLYFKKHGD"
          placeholder="请输入材料预付款扣回规定"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
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
          v-hasPermi="['contract:contract:add']"
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
          v-hasPermi="['contract:contract:edit']"
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
          v-hasPermi="['contract:contract:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['contract:contract:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标段编号" align="center" prop="BDBH" />
      <el-table-column label="开工日期,YYYY-MM-DD" align="center" prop="KGRQ" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.KGRQ, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竣工日期,YYYY-MM-DD" align="center" prop="JGRQ" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.JGRQ, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" prop="XMMC" />
      <el-table-column label="合同编号" align="center" prop="HTBH" v-if="true"/>
      <el-table-column label="合同总金额" align="center" prop="HTZJE" />
      <el-table-column label="合同段" align="center" prop="HTD" />
      <el-table-column label="工程量清单金额" align="center" prop="GCLQDJE" />
      <el-table-column label="开工预付款金额" align="center" prop="KGYFKJE" />
      <el-table-column label="暂列金金额" align="center" prop="ZLJJE" />
      <el-table-column label="合同工期 (月/天  24/730)" align="center" prop="HTGQ" />
      <el-table-column label="开工预付款起扣比例" align="center" prop="KGYFKQKBL" />
      <el-table-column label="开工预付款截止比例" align="center" prop="KGYFKJZBL" />
      <el-table-column label="质保金扣款比例" align="center" prop="ZBJKKBL" />
      <el-table-column label="农民工工资保证金扣款比例" align="center" prop="NMGGZBZJKKBL" />
      <el-table-column label="质保金总额" align="center" prop="ZBJZE" />
      <el-table-column label="计日工金额" align="center" prop="JRGJE" />
      <el-table-column label="标段长度" align="center" prop="BDCD" />
      <el-table-column label="起讫桩号" align="center" prop="QQZH" />
      <el-table-column label="开工预付款支付情况" align="center" prop="KGYJKZFQK" />
      <el-table-column label="开工预付款扣回规定" align="center" prop="KGYFKKHGD" />
      <el-table-column label="材料预付款支付情况" align="center" prop="CLYKFZFQK" />
      <el-table-column label="材料预付款扣回规定" align="center" prop="CLYFKKHGD" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['contract:contract:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['contract:contract:remove']"
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

    <!-- 添加或修改合同条款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标段编号" prop="BDBH">
          <el-input v-model="form.BDBH" placeholder="请输入标段编号" />
        </el-form-item>
        <el-form-item label="开工日期,YYYY-MM-DD" prop="KGRQ">
          <el-date-picker clearable
            v-model="form.KGRQ"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开工日期,YYYY-MM-DD">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="竣工日期,YYYY-MM-DD" prop="JGRQ">
          <el-date-picker clearable
            v-model="form.JGRQ"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择竣工日期,YYYY-MM-DD">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目名称" prop="XMMC">
          <el-input v-model="form.XMMC" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="合同总金额" prop="HTZJE">
          <el-input v-model="form.HTZJE" placeholder="请输入合同总金额" />
        </el-form-item>
        <el-form-item label="合同段" prop="HTD">
          <el-input v-model="form.HTD" placeholder="请输入合同段" />
        </el-form-item>
        <el-form-item label="工程量清单金额" prop="GCLQDJE">
          <el-input v-model="form.GCLQDJE" placeholder="请输入工程量清单金额" />
        </el-form-item>
        <el-form-item label="开工预付款金额" prop="KGYFKJE">
          <el-input v-model="form.KGYFKJE" placeholder="请输入开工预付款金额" />
        </el-form-item>
        <el-form-item label="暂列金金额" prop="ZLJJE">
          <el-input v-model="form.ZLJJE" placeholder="请输入暂列金金额" />
        </el-form-item>
        <el-form-item label="合同工期 (月/天  24/730)" prop="HTGQ">
          <el-input v-model="form.HTGQ" placeholder="请输入合同工期 (月/天  24/730)" />
        </el-form-item>
        <el-form-item label="开工预付款起扣比例" prop="KGYFKQKBL">
          <el-input v-model="form.KGYFKQKBL" placeholder="请输入开工预付款起扣比例" />
        </el-form-item>
        <el-form-item label="开工预付款截止比例" prop="KGYFKJZBL">
          <el-input v-model="form.KGYFKJZBL" placeholder="请输入开工预付款截止比例" />
        </el-form-item>
        <el-form-item label="质保金扣款比例" prop="ZBJKKBL">
          <el-input v-model="form.ZBJKKBL" placeholder="请输入质保金扣款比例" />
        </el-form-item>
        <el-form-item label="农民工工资保证金扣款比例" prop="NMGGZBZJKKBL">
          <el-input v-model="form.NMGGZBZJKKBL" placeholder="请输入农民工工资保证金扣款比例" />
        </el-form-item>
        <el-form-item label="质保金总额" prop="ZBJZE">
          <el-input v-model="form.ZBJZE" placeholder="请输入质保金总额" />
        </el-form-item>
        <el-form-item label="计日工金额" prop="JRGJE">
          <el-input v-model="form.JRGJE" placeholder="请输入计日工金额" />
        </el-form-item>
        <el-form-item label="标段长度" prop="BDCD">
          <el-input v-model="form.BDCD" placeholder="请输入标段长度" />
        </el-form-item>
        <el-form-item label="起讫桩号" prop="QQZH">
          <el-input v-model="form.QQZH" placeholder="请输入起讫桩号" />
        </el-form-item>
        <el-form-item label="开工预付款支付情况" prop="KGYJKZFQK">
          <el-input v-model="form.KGYJKZFQK" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="开工预付款扣回规定" prop="KGYFKKHGD">
          <el-input v-model="form.KGYFKKHGD" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="材料预付款支付情况" prop="CLYKFZFQK">
          <el-input v-model="form.CLYKFZFQK" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="材料预付款扣回规定" prop="CLYFKKHGD">
          <el-input v-model="form.CLYFKKHGD" type="textarea" placeholder="请输入内容" />
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
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listContract, getContract, delContract, addContract, updateContract } from "@/api/contract/contract";

export default {
  name: "Contract",
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
      // 合同条款表格数据
      contractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        BDBH: undefined,
        KGRQ: undefined,
        JGRQ: undefined,
        XMMC: undefined,
        HTZJE: undefined,
        HTD: undefined,
        GCLQDJE: undefined,
        KGYFKJE: undefined,
        ZLJJE: undefined,
        HTGQ: undefined,
        KGYFKQKBL: undefined,
        KGYFKJZBL: undefined,
        ZBJKKBL: undefined,
        NMGGZBZJKKBL: undefined,
        ZBJZE: undefined,
        JRGJE: undefined,
        BDCD: undefined,
        QQZH: undefined,
        KGYJKZFQK: undefined,
        KGYFKKHGD: undefined,
        CLYKFZFQK: undefined,
        CLYFKKHGD: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        BDBH: [
          { required: true, message: "标段编号不能为空", trigger: "blur" }
        ],
        KGRQ: [
          { required: true, message: "开工日期,YYYY-MM-DD不能为空", trigger: "blur" }
        ],
        JGRQ: [
          { required: true, message: "竣工日期,YYYY-MM-DD不能为空", trigger: "blur" }
        ],
        XMMC: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        HTBH: [
          { required: true, message: "合同编号不能为空", trigger: "blur" }
        ],
        HTZJE: [
          { required: true, message: "合同总金额不能为空", trigger: "blur" }
        ],
        HTD: [
          { required: true, message: "合同段不能为空", trigger: "blur" }
        ],
        GCLQDJE: [
          { required: true, message: "工程量清单金额不能为空", trigger: "blur" }
        ],
        KGYFKJE: [
          { required: true, message: "开工预付款金额不能为空", trigger: "blur" }
        ],
        ZLJJE: [
          { required: true, message: "暂列金金额不能为空", trigger: "blur" }
        ],
        HTGQ: [
          { required: true, message: "合同工期 (月/天  24/730)不能为空", trigger: "blur" }
        ],
        KGYFKQKBL: [
          { required: true, message: "开工预付款起扣比例不能为空", trigger: "blur" }
        ],
        KGYFKJZBL: [
          { required: true, message: "开工预付款截止比例不能为空", trigger: "blur" }
        ],
        ZBJKKBL: [
          { required: true, message: "质保金扣款比例不能为空", trigger: "blur" }
        ],
        NMGGZBZJKKBL: [
          { required: true, message: "农民工工资保证金扣款比例不能为空", trigger: "blur" }
        ],
        ZBJZE: [
          { required: true, message: "质保金总额不能为空", trigger: "blur" }
        ],
        JRGJE: [
          { required: true, message: "计日工金额不能为空", trigger: "blur" }
        ],
        BDCD: [
          { required: true, message: "标段长度不能为空", trigger: "blur" }
        ],
        QQZH: [
          { required: true, message: "起讫桩号不能为空", trigger: "blur" }
        ],
        KGYJKZFQK: [
          { required: true, message: "开工预付款支付情况不能为空", trigger: "blur" }
        ],
        KGYFKKHGD: [
          { required: true, message: "开工预付款扣回规定不能为空", trigger: "blur" }
        ],
        CLYKFZFQK: [
          { required: true, message: "材料预付款支付情况不能为空", trigger: "blur" }
        ],
        CLYFKKHGD: [
          { required: true, message: "材料预付款扣回规定不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询合同条款列表 */
    getList() {
      this.loading = true;
      listContract(this.queryParams).then(response => {
        this.contractList = response.rows;
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
        BDBH: undefined,
        KGRQ: undefined,
        JGRQ: undefined,
        XMMC: undefined,
        HTBH: undefined,
        HTZJE: undefined,
        HTD: undefined,
        GCLQDJE: undefined,
        KGYFKJE: undefined,
        ZLJJE: undefined,
        HTGQ: undefined,
        KGYFKQKBL: undefined,
        KGYFKJZBL: undefined,
        ZBJKKBL: undefined,
        NMGGZBZJKKBL: undefined,
        ZBJZE: undefined,
        JRGJE: undefined,
        BDCD: undefined,
        QQZH: undefined,
        KGYJKZFQK: undefined,
        KGYFKKHGD: undefined,
        CLYKFZFQK: undefined,
        CLYFKKHGD: undefined,
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
      this.ids = selection.map(item => item.HTBH)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加合同条款";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const HTBH = row.HTBH || this.ids
      getContract(HTBH).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改合同条款";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.HTBH != null) {
            updateContract(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addContract(this.form).then(response => {
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
      const HTBHs = row.HTBH || this.ids;
      this.$modal.confirm('是否确认删除合同条款编号为"' + HTBHs + '"的数据项？').then(() => {
        this.loading = true;
        return delContract(HTBHs);
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
      this.download('contract/contract/export', {
        ...this.queryParams
      }, `contract_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
