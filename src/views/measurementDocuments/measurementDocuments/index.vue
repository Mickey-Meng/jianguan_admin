<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6" :xs="24">
        <div class="left-tree">
          <el-table ref="table" :header-cell-style="headercellStyle"
            :cell-style="cellStyle" highlight-current-row v-loading="qsloading" :data="measurementNoList" @row-click="rowQsClick">
            <el-table-column label="ID" align="center" prop="id" v-if="false"/>
            <el-table-column label="期数" align="center" prop="name" min-width="120" :show-overflow-tooltip="true" />
            <el-table-column label="状态" align="center" prop="status" min-width="30">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="凭证编号" prop="pzbh">
            <el-input
              v-model="queryParams.pzbh"
              placeholder="请输入凭证编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="标段编号" prop="bdbh">
            <el-input
              v-model="queryParams.bdbh"
              placeholder="请输入标段编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="期次编号" prop="jlqsbh">
            <el-input
              v-model="queryParams.jlqsbh"
              placeholder="请输入计量期次编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item> -->
    <!--      <el-form-item label="台账分解编号" prop="tzfjbh">
            <el-input
              v-model="queryParams.tzfjbh"
              placeholder="请输入台账分解编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="凭证编号" prop="pzbh">
            <el-input
              v-model="queryParams.pzbh"
              placeholder="请输入凭证编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="计量类型" prop="jllx">
            <el-input
              v-model="queryParams.jllx"
              placeholder="请输入计量类型"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="计量日期" prop="jlrq">
            <el-date-picker clearable
              v-model="queryParams.jlrq"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择计量日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交工证书/变更令编号" prop="jgzs">
            <el-input
              v-model="queryParams.jgzs"
              placeholder="请输入交工证书/变更令编号"
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
          <el-form-item label="计算式" prop="jss">
            <el-input
              v-model="queryParams.jss"
              placeholder="请输入计算式"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="计量比例" prop="jlbl">
            <el-input
              v-model="queryParams.jlbl"
              placeholder="请输入计量比例"
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
          <!-- <el-form-item label="状态" prop="status">
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
              @click="handleAdd('0')"
              :disabled="lockStatus === '1'"
              v-hasPermi="['measurementDocuments:measurementDocuments:add']"
            >设计计量</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd('1')"
              :disabled="lockStatus === '1'"
              v-hasPermi="['measurementDocuments:measurementDocuments:add']"
            >变更计量</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-lock"
              size="mini"
              @click="handleLock"
              :disabled="lockStatus === '1'"
              v-hasPermi="['measurementDocuments:measurementDocuments:add']"
            >锁定</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['measurementDocuments:measurementDocuments:edit']"
            >修改</el-button>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['measurementDocuments:measurementDocuments:remove']"
            >删除</el-button>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['measurementDocuments:measurementDocuments:export']"
            >导出</el-button>
          </el-col> -->
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <div class="table-list">
          <div class="table1">
            <el-table :height="'calc(100vh - 570px)'" v-loading="loading" :header-cell-style="headercellStyle"
              :cell-style="cellStyle" highlight-current-row :data="measurementDocumentsList" @selection-change="handleSelectionChange" @row-click="queryMeasureAbout">
              <!-- <el-table-column type="selection" width="55" align="center" /> -->
              <el-table-column label="ID" align="center" prop="id" v-if="false"/>
              <!-- <el-table-column label="标段编号" align="center" prop="bdbh" /> -->
              <!-- <el-table-column label="计量期次编号" align="center" prop="jlqsbh" /> -->
              <el-table-column label="台账分解编号" align="center" min-width="110" prop="tzfjbh" v-if="false"/>
              <el-table-column label="凭证编号" align="center" min-width="100" prop="pzbh" />
              <el-table-column label="计量类型" align="center" min-width="100" prop="jllx" />
              <el-table-column label="计量日期" align="center" min-width="140" prop="jlrq" width="180" v-if="false">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.jlrq, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="交工证书" align="center" min-width="100" prop="jgzs" v-if="false" />
              <el-table-column label="工程部位" align="center" min-width="100" prop="gcbw" />
              <el-table-column label="计算式" align="center" min-width="140" prop="jss" v-if="false"/>
              <el-table-column label="计量比例" align="center" min-width="140" prop="jlbl" v-if="false"/>
              <el-table-column label="附件地址" align="center" min-width="140" prop="fj" v-if="false"/>
              <el-table-column label="审批状态" align="center" min-width="100" prop="reviewCode">
                <template slot-scope="scope">
                  <dict-tag :options="dict.type.review_code" :value="scope.row.reviewCode"/>
                </template>
              </el-table-column>
              <el-table-column label="计量前置条件" align="center">
                <el-table-column label="资料" align="center" width="60">
                  <template>
                    <span class="circle"></span>
                  </template>
                </el-table-column>
                <el-table-column label="质量" align="center" width="60">
                  <template>
                    <span class="circle"></span>
                  </template>
                </el-table-column>
                <el-table-column label="进度" align="center" width="60">
                  <template>
                    <span class="circle"></span>
                  </template>
                </el-table-column>
                <el-table-column label="安全" align="center" width="60">
                  <template>
                    <span class="circle"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['measurementDocuments:measurementDocuments:edit']"
                  >修改</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['measurementDocuments:measurementDocuments:remove']"
                  >删除</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </div>
          <div class="table2">
            <el-tabs type="card" v-model="activeName">
              <el-tab-pane label="计量相关" name="first">
                <measure-about ref="measureAbout"/>
              </el-tab-pane>
              <el-tab-pane label="附件相关" name="second">
              </el-tab-pane>
              <el-tab-pane label="资料相关" name="third">
              </el-tab-pane>
              <el-tab-pane label="进度相关" name="fouth">
              </el-tab-pane>
              <el-tab-pane label="质量相关" name="fifth">
              </el-tab-pane>
              <el-tab-pane label="安全相关" name="six">
              </el-tab-pane>
            </el-tabs>

          </div>
        </div>

      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="open" width="1500px" append-to-body>
      <el-row class="rows" v-if="open" :gutter="24">
          <el-col :span="6">
          <el-tree
            :data="ledgerBreakdownList"
            :props="treeProps"
            accordion
            @node-click="handleNodeClick">
          </el-tree>
          </el-col>
          <el-col :span="18">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                  <el-col :span="12">
                  <el-form-item label="凭证编号" prop="pzbh">
                    <el-input v-model="form.pzbh" placeholder="请输入凭证编号" />
                    </el-form-item>
                  </el-col>
                <el-col :span="12">
                  <el-form-item label="交工证书" prop="jgzs">
                    <el-input v-model="form.jgzs" placeholder="请输入交工证书/变更令编号" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="工程部位" prop="gcbw">
                    <el-input v-model="form.gcbw" :disabled="true" placeholder="请输入工程部位" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="计算式" prop="jss">
                    <el-input v-model="form.jss" type="textarea" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="附件地址">
                      <upload @input="getFileList"/>
                   </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="凭证时间 " prop="pzsj"> {{nowDate}}
                  </el-form-item>
                </el-col>
                </el-form>
                <el-col :span="24">
                  <el-table
                      :data="ledgerBreakdownDetailList"
                      height="250"
                      border
                      style="width: 100%">
                      <el-table-column
                        prop="zmh"
                        label="子目号"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="zmmc"
                        label="子目名称"
                        min-width="160"
                        :show-overflow-tooltip="true"
                        >
                      </el-table-column>
                      <el-table-column
                        prop="fhsl"
                        label="复核数量">
                      </el-table-column>
                      <el-table-column
                        prop="yjlsl"
                        label="已计量数量">
                      </el-table-column>
                      <el-table-column
                        prop="bqjlsl"
                        label="本期计量数量">
                        <template slot-scope="scope">
                          <div>
                            <el-input type="number" v-model="scope.row.bqjlsl" placeholder="请输入"></el-input>
                          </div>
                        </template>
                      </el-table-column>
                  </el-table>
                </el-col>
              <el-col :span="24">
                <div style="margin-top: 10px;margin-left: 30px;">
                  <el-button :loading="buttonLoading" type="primary" @click="submitForm">保 存</el-button>
                  <el-button @click="cancel">取 消</el-button>
                </div>
              </el-col>
              </el-col>
            </el-row>
          </el-col>
      </el-row>
      <!-- <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标段编号" prop="bdbh">
          <el-input v-model="form.bdbh" placeholder="请输入标段编号" />
        </el-form-item>
        <el-form-item label="计量期次编号" prop="jlqsbh">
          <el-input v-model="form.jlqsbh" placeholder="请输入计量期次编号" />
        </el-form-item>
        <el-form-item label="台账分解编号" prop="tzfjbh">
          <el-input v-model="form.tzfjbh" placeholder="请输入台账分解编号" />
        </el-form-item>
        <el-form-item label="凭证编号" prop="pzbh">
          <el-input v-model="form.pzbh" placeholder="请输入凭证编号" />
        </el-form-item>
        <el-form-item label="计量类型" prop="jllx">
          <el-input v-model="form.jllx" placeholder="请输入计量类型" />
        </el-form-item>
        <el-form-item label="计量日期" prop="jlrq">
          <el-date-picker clearable
            v-model="form.jlrq"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择计量日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交工证书/变更令编号" prop="jgzs">
          <el-input v-model="form.jgzs" placeholder="请输入交工证书/变更令编号" />
        </el-form-item>
        <el-form-item label="工程部位" prop="gcbw">
          <el-input v-model="form.gcbw" placeholder="请输入工程部位" />
        </el-form-item>

        <el-form-item label="计量比例" prop="jlbl">
          <el-input v-model="form.jlbl" placeholder="请输入计量比例" />
        </el-form-item>
        <el-form-item label="附件地址" prop="fj">
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
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
import { listMeasurementDocuments, getMeasurementDocuments, delMeasurementDocuments, addMeasurementDocuments, updateMeasurementDocuments } from "@/api/measurementDocuments/measurementDocuments";
import { listLedgerBreakdownDetail } from "@/api/ledgerDetail/ledgerBreakdownDetail";
import { listMeasurementListNo, lockingMeaMeasurementNo } from "@/api/measurementNo/measurementNo";
import { listLedgerBreakdown } from "@/api/ledger/ledgerBreakdown";
import upload from '@/components/FileUpload';
import measureAbout from '@/views/measurementDocuments/measurementDocuments/components/measureAbout';

export default {
  name: "MeasurementDocuments",
  dicts: ['review_code'],
  components: {
    upload, measureAbout
  },
  data() {
    return {
      nowDate: "123",
      treeloading: false,
      fileList: [],
      ledgerBreakdownDetailList:[],
      // 中间计量期数管理表格数据
      measurementNoList: [],
      // 遮罩层
      qsloading: true,
      jlqsbhOptions:[],
      //选中期数
      xzQsId: "",
      ledgerBreakdownList: [],
      InfoTableData:[],
      treeProps: {
        id: 'id',
        label: 'tzfjmc',
        children: 'children'
      },
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
      // 计量凭证，设计计量、变更计量共用一张凭证，明细分开。表格数据
      measurementDocumentsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        reviewCode: 2,
        pageNum: 1,
        pageSize: 10,
        bdbh: undefined,
        jlqsbh: undefined,
        tzfjbh: undefined,
        pzbh: undefined,
        jllx: undefined,
        jlrq: undefined,
        jgzs: undefined,
        gcbw: undefined,
        jss: undefined,
        jlbl: undefined,
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
          { required: true, message: "计量期次编号不能为空", trigger: "blur" }
        ],
        tzfjbh: [
          { required: true, message: "台账分解编号不能为空", trigger: "blur" }
        ],
        pzbh: [
          { required: true, message: "凭证编号不能为空", trigger: "blur" }
        ],
        jllx: [
          { required: true, message: "计量类型不能为空", trigger: "blur" }
        ],
        jlrq: [
          { required: true, message: "计量日期不能为空", trigger: "blur" }
        ],
        jgzs: [
          { required: true, message: "交工证书/变更令编号不能为空", trigger: "blur" }
        ],
        gcbw: [
          { required: true, message: "工程部位不能为空", trigger: "blur" }
        ],

        jlbl: [
          { required: true, message: "计量比例不能为空", trigger: "blur" }
        ],
        fj: [
          { required: true, message: "附件地址不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      },
      currentRow: null,
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
      activeName: 'first',
      isChange: '',
      lockStatus: ''
    };
  },
  created() {
    // this.getList();
    this.getPeriodsList();
  },
  methods: {
    getNowDate() {
      const timeOne = new Date()
      const year = timeOne.getFullYear()
      let month = timeOne.getMonth() + 1
      let day = timeOne.getDate()
      let hour=timeOne.getHours()
      let min=timeOne.getMinutes()
      let se=timeOne.getSeconds()
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      const NOW_MONTHS_AGO = `${year}-${month}-${day} ${hour}:${min}:${se}`
      console.log(NOW_MONTHS_AGO);
      this.nowDate=NOW_MONTHS_AGO
    },
    /** 查询计量凭证，设计计量、变更计量共用一张凭证，明细分开。列表 */
    getList() {
      this.loading = true;
      listMeasurementDocuments(this.queryParams).then(response => {
        this.measurementDocumentsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getTreeInfoList(tzfjbh){
      const params = {
        tzfjbh,
        queryType: 'e',
        reviewCode: 2,
        isChange: this.isChange
      }
      listLedgerBreakdownDetail(params).then(response => {
        if (response.rows.length) {
          this.ledgerBreakdownDetailList = response.rows.map(item => {
            item.meaLedgerBreakdownDetailId = item.id;// add by yangaogao  将查询出来的台账分解明细数据的编号，赋值给中间计量明细表中的外键
            item.id = '';
            item.bqjlsl = '';
            return item;
          });
          this.form.gcbw = this.ledgerBreakdownDetailList[0].fjmulu
        }
        // this.total = response.total;
        this.treeloading = false;
      });
    },
    handleNodeClick(data) {
      console.log(data);
      this.queryParams.tzfjbh = data.tzfjbh;
      this.getTreeInfoList(data.tzfjbh);
    },
    selectTree (row) {
      console.error('选中的数据', row);
      this.queryParams.tzfjbh = row.tzfjbh;
    },
     /** 查询台账分解列表 */
     getLeftTree() {
      this.loading = true;
      const params = {
        // fjlx: this.fjlx
        // modify by yangaogao   查询左侧树节点的时候，暂时不区分是否是变更清单，在查询明细的时候加筛选。
        // 后期需要优化，优化为，先查询有哪些明细是变更的，然后反推获取对应的树
      }
      listLedgerBreakdown(params).then(response => {
        this.ledgerBreakdownList = this.handleTree(response.data, "tzfjbh", "tzfjbhParent");
        console.log("tree",this.ledgerBreakdownList);
      }).finally(() => {
        // TODO
        // if (this.ledgerBreakdownList.length) {
        //   this.queryParams.tzfjbh = this.ledgerBreakdownList[0].tzfjbh;
        // }
      });
    },
    /** 查询中间计量期数管理列表 */
    getPeriodsList() {
      this.qsloading = true;
      listMeasurementListNo().then(response => {
        this.measurementNoList = response.data;
        this.qsloading = false;
      }).finally(() => {
        if (this.measurementNoList.length) {
          this.rowQsClick(this.measurementNoList[this.measurementNoList.length - 1], 0)
          this.currentRow = this.measurementNoList[this.measurementNoList.length - 1]
          this.$nextTick(() => {
            this.$refs.table.setCurrentRow(this.currentRow)
          })
        } else {
          this.getList()
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        bdbh: undefined,
        jlqsbh: undefined,
        tzfjbh: undefined,
        pzbh: undefined,
        jllx: undefined,
        jlrq: undefined,
        jgzs: undefined,
        gcbw: undefined,
        jss: undefined,
        jlbl: undefined,
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
    rowQsClick(record,index){
      this.currentRow = record;
      this.queryParams.jlqsbh = record.jlqsbh;
      this.lockStatus = record.status;
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
    handleAdd(isChange) {
      this.reset();
      this.open = true;
      this.ledgerBreakdownDetailList = [];
      this.title = "变更计量";
      if (isChange === '0') {
        this.title = "设计计量";
      }
      this.isChange = isChange;
      this.getLeftTree()
      this.getNowDate()
    },
    handleLock () {
      const params = {
        meaMeasurementNo: this.queryParams.jlqsbh
      }
      lockingMeaMeasurementNo(params).then(res => {
        console.error('res', res);
        if (res.msg ==='1') {
          this.$message.success('锁定成功！')
          this.$tab.refreshPage()
        } else {
          this.$message.error(res.msg)
        }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      this.getNowDate()
      getMeasurementDocuments(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改计量";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (!this.ledgerBreakdownDetailList.length) {
            this.$message.warning('计量数据不能为空');
            return;
          }
          let flag = false;
          this.ledgerBreakdownDetailList.forEach(item => {
            if (!item.bqjlsl) {
              flag = true;
            }
          })
          if (flag) {
            this.$message.error('本期计量数据不能为空！')
            return;
          }
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateMeasurementDocuments(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            this.form.jlqsbh = this.currentRow.jlqsbh;
            this.form.detailBos = this.ledgerBreakdownDetailList;
            this.form.fj = JSON.stringify(this.fileList);
            this.form.tzfjbh = this.queryParams.tzfjbh;
            // add by yangaogao 20230217
            this.form.meaLedgerBreakdownDetailId = this.queryParams.id;
            addMeasurementDocuments(this.form).then(response => {
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
    getFileList (val) {
      console.error('val', val);
      this.fileList = [];
      this.fileList = val;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除计量凭证编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delMeasurementDocuments(ids);
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
      this.download('measurementDocuments/measurementDocuments/export', {
        ...this.queryParams
      }, `measurementDocuments_${new Date().getTime()}.xlsx`)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      this.$download.oss(file.ossId)
    },
    handleExceed(files, fileList) {
      console.log(files);
      console.log(fileList);
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    queryMeasureAbout (row) {
      this.$refs.measureAbout.measurementAboutList(row.id);
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  .table-list {
    .table1 {
      height: calc(100vh - 510px);
      min-height: 150px;
      > .el-table {
        min-height: 100px;
      }
      .circle {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: red;
        box-shadow: 0 0 3px 0 #ccc;
      }
    }
    .table2 {
      height: 310px;
    }
  }
}
.left-tree {
  width: 100%;
  height: calc(100vh - 115px);
  background: rgb(247, 248, 251);
  padding: 0 10px;
  .el-table {
    height: 100%;
  }
}
.rows {
  .el-tree {
    overflow: auto;
    height: calc(100vh - 230px);
  }
}
</style>
