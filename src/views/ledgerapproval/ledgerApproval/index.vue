<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
          <div class="left-tree">
            <!-- 新增台账树 -->
            <div style="height: 50%">
              <el-table ref="table" :header-cell-style="headercellStyle"
                        :cell-style="cellStyle" v-loading="qsloading" highlight-current-row :data="measurementNoList" @row-click="rowQsClick">
                <el-table-column label="ID" align="center" prop="id" v-if="false"/>
                <el-table-column label="申报期数" align="center" prop="sqqc" min-width="80" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    {{ scope.row.sqqc }}
                  </template>
                </el-table-column>
                <!-- <el-table-column label="申报日期" align="center" prop="date"/> -->
                <el-table-column label="审批状态" align="center" prop="reviewCode" min-width="40">
                  <template slot-scope="scope">
                    <dict-tag :options="dict.type.review_code" :value="scope.row.reviewCode"/>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="down-tree" style="height: 50%">
              <el-tree
                :data="ledgerBreakdownList"
                :props="treeProps"
                accordion
                @node-click="handleNodeClick">
              </el-tree>
            </div>
          </div>
      </el-col>
      <el-col :span="18">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="标段编号" prop="bdbh">
            <el-input
              v-model="queryParams.bdbh"
              placeholder="请输入标段编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="申请期次" prop="sqqc">
            <el-input
              v-model="queryParams.sqqc"
              placeholder="请输入申请期次"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item> -->
<!--        <el-form-item label="台账分解编号" prop="tzfjbh">
          <el-input
            v-model="queryParams.tzfjbh"
            placeholder="请输入台账分解编号"
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
        <el-form-item label="数据状态" prop="dataStatus">
          <el-select v-model="queryParams.dataStatus" placeholder="请选择数据状态" clearable>
            <el-option
              v-for="dict in dict.type.data_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申报状态" prop="spzt">
          <el-input
            v-model="queryParams.spzt"
            placeholder="请输入申报状态"
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
              v-hasPermi="['ledgerapproval:ledgerApproval:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="submitData"
              v-hasPermi="['ledgerapproval:ledgerApproval:add']"
            >上报</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['ledgerapproval:ledgerApproval:edit']"
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
              v-hasPermi="['ledgerapproval:ledgerApproval:remove']"
            >删除</el-button>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['ledgerapproval:ledgerApproval:export']"
            >导出</el-button>
          </el-col> -->
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table :height="'calc(100vh - 205px)'" v-loading="loading" :header-cell-style="headercellStyle"
          :cell-style="cellStyle" :data="ledgerApprovalList" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <!-- <el-table-column label="主键id" align="center" prop="id" v-if="true"/> -->
          <!-- <el-table-column label="标段编号" align="center" prop="bdbh" /> -->
          <el-table-column label="工程部位" align="center" min-width="180" prop="fjmulu" :show-overflow-tooltip="true"/>


          <el-table-column label="子目号" align="center" min-width="100" prop="zmh"  :show-overflow-tooltip="true"/>
          <el-table-column label="子目名称" align="center" min-width="120" prop="zmmc" :show-overflow-tooltip="true"/>


          <el-table-column label="申请期次" align="center" min-width="80" prop="sqqc" :show-overflow-tooltip="true" />
          <!-- <el-table-column label="台账分解编号" align="center" min-width="120" prop="tzfjbh" /> -->

          <el-table-column label="单位" align="center" min-width="80" prop="dw"  :show-overflow-tooltip="true"/>
          <el-table-column label="设计数量" align="center" min-width="100" prop="sjsl" :show-overflow-tooltip="true" />
          <el-table-column label="分解数量" align="center" min-width="100" prop="fjsl"  :show-overflow-tooltip="true"/>
          <el-table-column label="已计量数量" align="center" min-width="120" prop="yjlsl" :show-overflow-tooltip="true"/>

          <!-- <el-table-column label="上报状态" align="center" min-width="80" prop="reviewCode">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.review_code" :value="scope.row.reviewCode"/>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="申报状态" align="center" prop="spzt" /> -->
          <!-- <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['ledgerapproval:ledgerApproval:edit']"
              >修改</el-button> -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                :disabled="['1', '2'].includes(scope.row.reviewCode)"
                @click="handleDelete(scope.row, scope.$index)"
                v-hasPermi="['ledgerapproval:ledgerApproval:remove']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加或修改台账报审对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1050px" append-to-body>
      <ledger-list v-if="open" :close="closeOpenAdd" @getSelectionData="getSelectionData"/>
    </el-dialog>
  </div>
</template>

<script>
import { listLedgerApproval, getLedgerApproval, delLedgerApproval, addLedgerApproval, updateLedgerApproval, ledgerApprovalUp } from "@/api/ledgerapproval/ledgerApproval";
import { listLedgerApprovalNo } from "@/api/approval/ledgerApprovalNo";
import { listMeasurementListNo} from "@/api/measurementNo/measurementNo";
// 引入台账树
import { listLedgerBreakdown } from "@/api/ledger/ledgerBreakdown";
import LedgerList from './components/LedgerList';
export default {
  name: "LedgerApproval",
  dicts: ['data_status', 'review_code'],
  components: {
    LedgerList
  },
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
      // total: 0,
      // 台账报审表格数据
      ledgerApprovalList: [],
      // 中间计量期数管理表格数据
      measurementNoList: [],
      // 左侧表格loading
      qsloading: false,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        bdbh: undefined,
        sqqc: undefined,
        tzfjbh: undefined,
        gcbw: undefined,
        dataStatus: undefined,
        spzt: undefined,
        status: undefined,
      },
      // 引入台账树
      treeProps: {
        id: 'id',
        label: 'tzfjmc',
        children: 'children'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键id不能为空", trigger: "blur" }
        ],
        bdbh: [
          { required: true, message: "标段编号不能为空", trigger: "blur" }
        ],
        sqqc: [
          { required: true, message: "申请期次不能为空", trigger: "blur" }
        ],
        tzfjbh: [
          { required: true, message: "台账分解编号不能为空", trigger: "blur" }
        ],
        gcbw: [
          { required: true, message: "工程部位不能为空", trigger: "blur" }
        ],
        dataStatus: [
          { required: true, message: "上报状态不能为空", trigger: "blur" }
        ],
        spzt: [
          { required: true, message: "申报状态不能为空", trigger: "blur" }
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
      selection: []
    };
  },
  created() {
    this.getPeriodsList();
    // 创建台账树
    this.getLeftTree();
    // this.getList();
  },
  methods: {
    /** 查询台账报审列表 */
    getList() {
      this.loading = true;
      listLedgerApproval(this.queryParams).then(response => {
        this.ledgerApprovalList = response.rows;
        // this.total = response.total;
      }).finally(() => {
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
        sqqc: undefined,
        tzfjbh: undefined,
        gcbw: undefined,
        dataStatus: "0",
        spzt: undefined,
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
      // this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      // 重置时，清楚台账树的查询条件
      this.queryParams.tzfjbh = undefined;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // this.ids = selection.map(item => item.id)
      this.selection = selection.map(item => {
        item.sqqc = this.queryParams.sqqc;
        return item;
      });
      // this.single = selection.length!==1
      // this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加台账报审";
    },
    /** 修改按钮操作 */
    // handleUpdate(row) {
    //   this.loading = true;
    //   this.reset();
    //   const id = row.id || this.ids
    //   getLedgerApproval(id).then(response => {
    //     this.loading = false;
    //     this.form = response.data;
    //     this.open = true;
    //     this.title = "修改台账报审";
    //   });
    // },
    /** 删除按钮操作 */
    handleDelete(row, index) {
      this.ledgerApprovalList.splice(index, 1);
      // const ids = row.id || this.ids;
      // this.$modal.confirm('是否确认删除台账报审编号为"' + ids + '"的数据项？').then(() => {
      //   this.loading = true;
      //   return delLedgerApproval(ids);
      // }).then(() => {
      //   this.loading = false;
      //   this.getList();
      //   this.$modal.msgSuccess("删除成功");
      // }).catch(() => {
      // }).finally(() => {
      //   this.loading = false;
      // });
    },
    submitData () {
      // if (!this.selection.length) {
      //   this.$message.warning('请选择要上报的数据！');
      //   return;
      // }
      if (['1', '2'].includes(this.queryParams.reviewCode)) {
        const msg = {
          '1': '正在上报中',
          '2': '已上报完成'
        };
        this.$message.warning(`选中的当前期次${msg[this.queryParams.reviewCode]}，不可重复上报!`);
        return;
      }
      this.handleSelectionChange(this.ledgerApprovalList);
      this.selection = this.selection.map(item => {
        item.breakdownId = item.id;
        item.id = null;
        return item;
      })
      this.loading = true;
      // 对接上报接口
      ledgerApprovalUp(this.selection).then(response => {
        this.selection = [];
        this.getList();
        // 上报成功后，刷新左侧申报期次列表
        this.getPeriodsList();
        this.$message.success('上报成功');
      }).catch(() => {
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ledgerapproval/ledgerApproval/export', {
        ...this.queryParams
      }, `ledgerApproval_${new Date().getTime()}.xlsx`)
    },
    rowQsClick(record,index){
      this.queryParams.sqqc = record.sqqc;
      this.queryParams.reviewCode = record.reviewCode;
      // this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 查询台账分解列表 */
    getLeftTree() {
      debugger;
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
    // 点击台账树，刷新右侧列表
    handleNodeClick(data) {
      console.log(data);
      this.queryParams.tzfjbh = data.tzfjbh;
      this.getList();
    },
     /** 查询中间计量期数管理列表 */
    getPeriodsList() {
      this.qsloading = true;
      listLedgerApprovalNo().then(response => {
        this.measurementNoList = response.rows;
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
    getSelectionData (val) {
      this.ledgerApprovalList = [...this.ledgerApprovalList, ...val];
    },
    closeOpenAdd () {
      this.open = false;
    }
  }
};
</script>
<style lang="scss" scoped>
  .app-container {
    height: 100%;
    .el-table {
      height: calc(100vh - 205px);
      overflow: auto;
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
  // 台账树央视
  .down-tree {
    display: block;
    overflow-y: scroll;
  }
</style>
