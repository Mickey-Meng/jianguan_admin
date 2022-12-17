<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="16">
         <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="变更编号" prop="bgbh">
            <el-input
              v-model="queryParams.bgbh"
              placeholder="请输入变更编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!--      <el-form-item label="变更事项" prop="bgsx">
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
                </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['ledgerChange:ledgerChange:add']"
            >新增
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- <el-col :span="1.5">
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
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <div class="table-area">
      <el-table v-loading="loading" :height="'calc(100vh - 510px)'" :data="ledgerChangeList"
                @selection-change="handleSelectionChange" @row-click="row_click">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="ID" align="center" prop="id" v-if="false"/>
        <el-table-column label="变更编号" align="center" prop="bgbh" min-width="140" :show-overflow-tooltip="true"/>
        <el-table-column label="变更事项" align="center" prop="bgsx" min-width="140" :show-overflow-tooltip="true"/>
        <el-table-column label="工程部位" align="center" prop="gcbw" min-width="150" :show-overflow-tooltip="true"/>
        <!-- <el-table-column label="桩号" align="center" prop="zh" />
        <el-table-column label="子目号" align="center" prop="zmh" /> -->
        <!-- <el-table-column label="图号" align="center" prop="th" v-if="false"/> -->
        <el-table-column label="申请日期" align="center" prop="sqrq" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.sqrq, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批日期" align="center" prop="sprq" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.sprq, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更等级" align="center" prop="bgdj" min-width="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.ledger_change_level" :value="scope.row.bgdj"/>
          </template>
        </el-table-column>
        <el-table-column label="变更类型" align="center" prop="bglx" min-width="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.ledger_change_type" :value="scope.row.bglx"/>
          </template>
        </el-table-column>
        <el-table-column label="变更金额" align="center" prop="bgje" min-width="140">
          <template slot-scope="scope">
            {{ dealNumberFormat(scope.row.bgje) }}
          </template>
        </el-table-column>
        <el-table-column label="变更原因" align="center" prop="bgyy" v-if="false"/>
        <el-table-column label="计算式" align="center" prop="jss" v-if="false"/>
        <el-table-column label="数据状态" align="center" prop="dataStatus" v-if="false"/>
        <el-table-column label="状态" align="center" prop="status" min-width="100">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
          </template>
        </el-table-column>

      </el-table>
      <el-table v-loading="loading" :height="'calc(100vh - 555px)'" style="margin-top: 24px;" :data="ledgerChangeDetailList">
        <el-table-column label="标段编号" align="center" prop="bdbh" min-width="140" :show-overflow-tooltip="true"/>
        <el-table-column label="变更编号" align="center" prop="bgbh" min-width="100" :show-overflow-tooltip="true"/>
        <el-table-column label="子目号" align="center" prop="zmh" v-if="true"/>
        <el-table-column label="子目名称" align="center" prop="zmmc" min-width="120" :show-overflow-tooltip="true"/>
        <el-table-column label="工程部位" align="center" prop="gcbw" min-width="120" :show-overflow-tooltip="true"/>
        <el-table-column label="单位" align="center" prop="dw" />
        <el-table-column label="合同单价" align="center" prop="htdj" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ dealNumberFormat(scope.row.htdj) }}
          </template>
        </el-table-column>
        <el-table-column label="新增单价" align="center" prop="xzdj" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ dealNumberFormat(scope.row.xzdj) }}
          </template>
        </el-table-column>
        <el-table-column label="合同数量" align="center" prop="htsl" min-width="120" :show-overflow-tooltip="true"/>
        <el-table-column label="合同金额" align="center" prop="htje" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ dealNumberFormat(scope.row.htje) }}
          </template>
        </el-table-column>
        <el-table-column label="审核数量" align="center" prop="shsl" min-width="120" :show-overflow-tooltip="true"/>
        <el-table-column label="审核金额" align="center" prop="shje" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ dealNumberFormat(scope.row.shje) }}
          </template>
        </el-table-column>
        <el-table-column label="修正数量" align="center" prop="xzsl" min-width="100" :show-overflow-tooltip="true"/>
        <el-table-column label="修正金额" align="center" prop="xzje" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ dealNumberFormat(scope.row.xzje) }}
          </template>
        </el-table-column>
        <el-table-column label="已计量数量" align="center" prop="yjlsl"  min-width="120" :show-overflow-tooltip="true"/>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['ledgerChange:ledgerChange:edit']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['ledgerChange:ledgerChange:remove']"
            >删除
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-promotion"
              @click="submitData(scope.row)"
              v-hasPermi="['ledgerChange:ledgerChange:edit']"
            >上报
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加或修改台账变更/工程变更对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1150px" append-to-body>
      <LedgerChangeForm v-if="open" :close="closeOpen"/>
    </el-dialog>
  </div>
</template>

<script>
import {
  listLedgerChange,
  getLedgerChange,
  delLedgerChange,
  addLedgerChange,
  updateLedgerChange
} from "@/api/ledgerChange/ledgerChange";
import {listLedgerChangeDetail} from "@/api/ledgerChangeDetail/ledgerChangeDetail";

import LedgerChangeForm from './components/LedgerChangeForm';
import { dealNumberFormat } from "@/utils/utils.js";
export default {
  name: "LedgerChange",
  dicts: ['data_status', 'ledger_change_type', 'ledger_change_level'],
  components: {
    LedgerChangeForm
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
      // 台账变更/工程变更表格数据
      ledgerChangeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      ledgerChangeDetailList: [],
      listLedgerChangeDetailQueryParams: {
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
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
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
          {required: true, message: "ID不能为空", trigger: "blur"}
        ],
        bgbh: [
          {required: true, message: "变更编号不能为空", trigger: "blur"}
        ],
        bgsx: [
          {required: true, message: "变更事项不能为空", trigger: "blur"}
        ],
        bgdj: [
          {required: true, message: "变更等级不能为空", trigger: "blur"}
        ],
        bglx: [
          {required: true, message: "变更类型不能为空", trigger: "blur"}
        ],
        zh: [
          {required: true, message: "桩号不能为空", trigger: "blur"}
        ],
        zmh: [
          {required: true, message: "子目号不能为空", trigger: "blur"}
        ],
        gcbw: [
          {required: true, message: "工程部位不能为空", trigger: "blur"}
        ],
        th: [
          {required: true, message: "图号不能为空", trigger: "blur"}
        ],
        sqrq: [
          {required: true, message: "申请日期不能为空", trigger: "blur"}
        ],
        bgje: [
          {required: true, message: "变更金额不能为空", trigger: "blur"}
        ],
        bgyy: [
          {required: true, message: "变更原因不能为空", trigger: "blur"}
        ],
        jss: [
          {required: true, message: "计算式不能为空", trigger: "blur"}
        ],
        // dataStatus: [
        //   {required: true, message: "数据状态不能为空", trigger: "blur"}
        // ],
        status: [
          {required: true, message: "状态不能为空", trigger: "blur"}
        ],
      },
      // 变更子目数据
      dealNumberFormat
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
        // this.total = response.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    row_click(row, column, event) {

      this.listLedgerChangeDetailQueryParams.bgbh = row.bgbh;
      this.getlistLedgerChangeDetail()


    },
    getlistLedgerChangeDetail() {
      listLedgerChangeDetail(this.listLedgerChangeDetailQueryParams).then(response => {
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
      // this.queryParams.pageNum = 1;
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
      this.single = selection.length !== 1
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
    // 上报
    submitData() {
      // TODO 对接上报接口
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ledgerChange/ledgerChange/export', {
        ...this.queryParams
      }, `ledgerChange_${new Date().getTime()}.xlsx`)
    },
    closeOpen() {
      this.open = false;
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;

  .table-area {
    height: calc(100vh - 180px);
    overflow: auto;
  }
}
</style>
