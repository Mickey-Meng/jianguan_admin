<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="标段编号" prop="bdbh">
        <el-input
          v-model="queryParams.bdbh"
          placeholder="请输入标段编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同编号" prop="htbh">
        <el-input
          v-model="queryParams.htbh"
          placeholder="请输入合同编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="开工日期" prop="kgrq">
        <el-date-picker clearable
          v-model="queryParams.kgrq"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开工日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="竣工日期" prop="jgrq">
        <el-date-picker clearable
          v-model="queryParams.jgrq"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择竣工日期">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="项目名称" prop="xmmc">
        <el-input
          v-model="queryParams.xmmc"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同总金额" prop="htzje">
        <el-input
          v-model="queryParams.htzje"
          placeholder="请输入合同总金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="合同段" prop="htd">
        <el-input
          v-model="queryParams.htd"
          placeholder="请输入合同段"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工程量清单金额" prop="gclqdje">
        <el-input
          v-model="queryParams.gclqdje"
          placeholder="请输入工程量清单金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开工预付款金额" prop="kgyfkje">
        <el-input
          v-model="queryParams.kgyfkje"
          placeholder="请输入开工预付款金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="暂列金金额" prop="zljje">
        <el-input
          v-model="queryParams.zljje"
          placeholder="请输入暂列金金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同工期)" prop="htgq">
        <el-input
          v-model="queryParams.htgq"
          placeholder="请输入合同工期)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开工预付款起扣比例" prop="kgyfkqkbl">
        <el-input
          v-model="queryParams.kgyfkqkbl"
          placeholder="请输入开工预付款起扣比例"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开工预付款截止比例" prop="kgyfkjzbl">
        <el-input
          v-model="queryParams.kgyfkjzbl"
          placeholder="请输入开工预付款截止比例"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="质保金扣款比例" prop="zbjkkbl">
        <el-input
          v-model="queryParams.zbjkkbl"
          placeholder="请输入质保金扣款比例"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="农民工工资保证金扣款比例" prop="nmggzbzjkkbl">
        <el-input
          v-model="queryParams.nmggzbzjkkbl"
          placeholder="请输入农民工工资保证金扣款比例"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="质保金总额" prop="zbjze">
        <el-input
          v-model="queryParams.zbjze"
          placeholder="请输入质保金总额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计日工金额" prop="jrgje">
        <el-input
          v-model="queryParams.jrgje"
          placeholder="请输入计日工金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标段长度(km)" prop="bdcd">
        <el-input
          v-model="queryParams.bdcd"
          placeholder="请输入标段长度(km)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="起讫桩号" prop="qqzh">
        <el-input
          v-model="queryParams.qqzh"
          placeholder="请输入起讫桩号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开工预付款支付情况" prop="kgyjkzfqk">
        <el-input
          v-model="queryParams.kgyjkzfqk"
          placeholder="请输入开工预付款支付情况"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开工预付款扣回规定" prop="kgyfkkhgd">
        <el-input
          v-model="queryParams.kgyfkkhgd"
          placeholder="请输入开工预付款扣回规定"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="材料预付款支付情况" prop="clykfzfqk">
        <el-input
          v-model="queryParams.clykfzfqk"
          placeholder="请输入材料预付款支付情况"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="材料预付款扣回规定" prop="clyfkkhgd">
        <el-input
          v-model="queryParams.clyfkkhgd"
          placeholder="请输入材料预付款扣回规定"
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
      </el-form-item> -->
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
          v-hasPermi="['contractInfo:contractInfo:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['contractInfo:contractInfo:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['contractInfo:contractInfo:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['contractInfo:contractInfo:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :header-cell-style="headercellStyle"
            :cell-style="cellStyle" :data="contractInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="left"/>
      <el-table-column label="ID" align="center" prop="id" v-if="false"/>
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="scope">
          <div>
            {{ (scope.$index)/queryParams.pageSize + 1  }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标段编号" align="center" min-width="100" prop="bdbh" />
      <el-table-column label="合同编号" align="center" min-width="100" prop="htbh" />
      <el-table-column label="项目名称" align="center" min-width="120" prop="xmmc" />
      <el-table-column label="合同总金额" align="center" min-width="100" prop="htzje">
        <template slot-scope="scope">
          <div>
            {{ dealNumberFormat(scope.row.htzje) }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="合同段" align="center" prop="htd" />
      <el-table-column label="工程量清单金额" align="center" prop="gclqdje" />
      <el-table-column label="开工预付款金额" align="center" prop="kgyfkje" />
      <el-table-column label="暂列金金额" align="center" prop="zljje" />
      <el-table-column label="合同工期)" align="center" prop="htgq" />
      <el-table-column label="开工预付款起扣比例" align="center" prop="kgyfkqkbl" />
      <el-table-column label="开工预付款截止比例" align="center" prop="kgyfkjzbl" />
      <el-table-column label="质保金扣款比例" align="center" prop="zbjkkbl" />
      <el-table-column label="农民工工资保证金扣款比例" align="center" prop="nmggzbzjkkbl" />
      <el-table-column label="质保金总额" align="center" prop="zbjze" />
      <el-table-column label="计日工金额" align="center" prop="jrgje" />
      <el-table-column label="标段长度(km)" align="center" prop="bdcd" />
      <el-table-column label="起讫桩号" align="center" prop="qqzh" />
      <el-table-column label="开工预付款支付情况" align="center" prop="kgyjkzfqk" />
      <el-table-column label="开工预付款扣回规定" align="center" prop="kgyfkkhgd" />
      <el-table-column label="材料预付款支付情况" align="center" prop="clykfzfqk" />
      <el-table-column label="材料预付款扣回规定" align="center" prop="clyfkkhgd" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['contractInfo:contractInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['contractInfo:contractInfo:remove']"
          >删除</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-lock"
            @click="handleDelete(scope.row)"
            v-hasPermi="['contractInfo:contractInfo:remove']"
          >锁定</el-button> -->
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
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标段编号" prop="bdbh">
              <el-input v-model="form.bdbh" placeholder="请输入标段编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号" prop="htbh">
              <el-input v-model="form.htbh" placeholder="请输入合同编号" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="开工日期" prop="kgrq">
              <el-date-picker clearable
                v-model="form.kgrq"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择开工日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="竣工日期" prop="jgrq">
              <el-date-picker clearable
                v-model="form.jgrq"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择竣工日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="xmmc">
              <el-input v-model="form.xmmc" placeholder="请输入项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同总金额" prop="htzje">
              <el-input v-model="form.htzje" placeholder="请输入合同总金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同段" prop="htd">
              <el-input v-model="form.htd" placeholder="请输入合同段" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程量清单金额" prop="gclqdje">
              <el-input v-model="form.gclqdje" placeholder="请输入工程量清单金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开工预付款金额" prop="kgyfkje">
              <el-input v-model="form.kgyfkje" placeholder="请输入开工预付款金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="暂列金金额" prop="zljje">
              <el-input v-model="form.zljje" placeholder="请输入暂列金金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同工期" prop="htgq">
              <el-input v-model="form.htgq" placeholder="请输入合同工期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开工预付款起扣比例" prop="kgyfkqkbl">
              <el-input v-model="form.kgyfkqkbl" placeholder="请输入开工预付款起扣比例" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开工预付款截止比例" prop="kgyfkjzbl">
              <el-input v-model="form.kgyfkjzbl" placeholder="请输入开工预付款截止比例" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质保金扣款比例" prop="zbjkkbl">
              <el-input v-model="form.zbjkkbl" placeholder="请输入质保金扣款比例" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="农民工工资保证金扣款比例" prop="nmggzbzjkkbl">
              <el-input v-model="form.nmggzbzjkkbl" placeholder="请输入农民工工资保证金扣款比例" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质保金总额" prop="zbjze">
              <el-input v-model="form.zbjze" placeholder="请输入质保金总额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计日工金额" prop="jrgje">
              <el-input v-model="form.jrgje" placeholder="请输入计日工金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标段长度(km)" prop="bdcd">
              <el-input v-model="form.bdcd" placeholder="请输入标段长度(km)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起讫桩号" prop="qqzh">
              <el-input v-model="form.qqzh" placeholder="请输入起讫桩号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开工预付款支付情况" prop="kgyjkzfqk">
              <el-input v-model="form.kgyjkzfqk" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开工预付款扣回规定" prop="kgyfkkhgd">
              <el-input v-model="form.kgyfkkhgd" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材料预付款支付情况" prop="clykfzfqk">
              <el-input v-model="form.clykfzfqk" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材料预付款扣回规定" prop="clyfkkhgd">
              <el-input v-model="form.clyfkkhgd" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.data_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
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
import { listContractInfo, getContractInfo, delContractInfo, addContractInfo, updateContractInfo } from "@/api/contractInfo/contractInfo";
import { dealNumberFormat } from "@/utils/utils.js";
import formValidate from '@/plugins/formValidate/formValidate'

export default {
  name: "ContractInfo",
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
      contractInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bdbh: undefined,
        htbh: undefined,
        kgrq: undefined,
        jgrq: undefined,
        xmmc: undefined,
        htzje: undefined,
        htd: undefined,
        gclqdje: undefined,
        kgyfkje: undefined,
        zljje: undefined,
        htgq: undefined,
        kgyfkqkbl: undefined,
        kgyfkjzbl: undefined,
        zbjkkbl: undefined,
        nmggzbzjkkbl: undefined,
        zbjze: undefined,
        jrgje: undefined,
        bdcd: undefined,
        qqzh: undefined,
        kgyjkzfqk: undefined,
        kgyfkkhgd: undefined,
        clykfzfqk: undefined,
        clyfkkhgd: undefined,
        status: undefined,
      },
      dealNumberFormat,
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
        htbh: [
          { required: true, message: "合同编号不能为空", trigger: "blur" }
        ],
        kgrq: [
          { required: true, message: "开工日期不能为空", trigger: "blur" }
        ],
        jgrq: [
          { required: true, message: "竣工日期不能为空", trigger: "blur" }
        ],
        xmmc: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        htzje: [
          { required: true, message: "合同总金额不能为空", trigger: "blur" },
          {
            'validator': formValidate.numberValidator('15/2', true),
            'trigger': ['change', 'blur'],
          },
        ],
        htd: [
          { required: true, message: "合同段不能为空", trigger: "blur" }
        ],
        gclqdje: [
          { required: true, message: "工程量清单金额不能为空", trigger: "blur" },
          {
            'validator': formValidate.numberValidator('15/2', true),
            'trigger': ['change', 'blur'],
          },
        ],
        kgyfkje: [
          { required: true, message: "开工预付款金额不能为空", trigger: "blur" },
          {
            'validator': formValidate.numberValidator('15/2', true),
            'trigger': ['change', 'blur'],
          },
        ],
        zljje: [
          { required: true, message: "暂列金金额不能为空", trigger: "blur" },
          {
            'validator': formValidate.numberValidator('15/2', true),
            'trigger': ['change', 'blur'],
          },
        ],
        htgq: [
          { required: true, message: "合同工期)不能为空", trigger: "blur" }
        ],
        kgyfkqkbl: [
          { required: true, message: "开工预付款起扣比例不能为空", trigger: "blur" }
        ],
        kgyfkjzbl: [
          { required: true, message: "开工预付款截止比例不能为空", trigger: "blur" }
        ],
        zbjkkbl: [
          { required: true, message: "质保金扣款比例不能为空", trigger: "blur" }
        ],
        nmggzbzjkkbl: [
          { required: true, message: "农民工工资保证金扣款比例不能为空", trigger: "blur" }
        ],
        zbjze: [
          { required: true, message: "质保金总额不能为空", trigger: "blur" },
          {
            'validator': formValidate.numberValidator('15/2', true),
            'trigger': ['change', 'blur'],
          },
        ],
        jrgje: [
          { required: true, message: "计日工金额不能为空", trigger: "blur" },
          {
            'validator': formValidate.numberValidator('15/2', true),
            'trigger': ['change', 'blur'],
          },
        ],
        bdcd: [
          { required: true, message: "标段长度(km)不能为空", trigger: "blur" },
          {
            'validator': formValidate.checkNumberFour(),
            'trigger': ['change', 'blur'],
          },
        ],
        qqzh: [
          { required: true, message: "起讫桩号不能为空", trigger: "blur" }
        ],
        kgyjkzfqk: [
          { required: true, message: "开工预付款支付情况不能为空", trigger: "blur" }
        ],
        kgyfkkhgd: [
          { required: true, message: "开工预付款扣回规定不能为空", trigger: "blur" }
        ],
        clykfzfqk: [
          { required: true, message: "材料预付款支付情况不能为空", trigger: "blur" }
        ],
        clyfkkhgd: [
          { required: true, message: "材料预付款扣回规定不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ]
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
    /** 查询合同条款列表 */
    getList() {
      this.loading = true;
      listContractInfo(this.queryParams).then(response => {
        this.contractInfoList = response.rows;
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
        htbh: undefined,
        kgrq: undefined,
        jgrq: undefined,
        xmmc: undefined,
        htzje: undefined,
        htd: undefined,
        gclqdje: undefined,
        kgyfkje: undefined,
        zljje: undefined,
        htgq: undefined,
        kgyfkqkbl: undefined,
        kgyfkjzbl: undefined,
        zbjkkbl: undefined,
        nmggzbzjkkbl: undefined,
        zbjze: undefined,
        jrgje: undefined,
        bdcd: undefined,
        qqzh: undefined,
        kgyjkzfqk: undefined,
        kgyfkkhgd: undefined,
        clykfzfqk: undefined,
        clyfkkhgd: undefined,
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
      this.title = "添加合同条款";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getContractInfo(id).then(response => {
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
          if (this.form.id != null) {
            updateContractInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addContractInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除合同条款编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delContractInfo(ids);
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
      this.download('contractInfo/contractInfo/export', {
        ...this.queryParams
      }, `contractInfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
