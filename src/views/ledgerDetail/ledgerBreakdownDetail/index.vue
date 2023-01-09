<template>
  <div class="app-container">
    <div>
      <el-row :gutter="10">
        <el-col :span="4">
          <div class="left-tree">
            <multilevel-tree ref="mulTree" :list="ledgerBreakdownList" :default-props="treeProps"
                             @selectRow="selectTree"/>
          </div>
        </el-col>
        <el-col :span="20">
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                   label-width="68px">
            <!-- <el-form-item label="标段编号" prop="bdbh">
              <el-input
                v-model="queryParams.bdbh"
                placeholder="请输入标段编号"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="台账分解编号" prop="tzfjbh">
              <el-input
                v-model="queryParams.tzfjbh"
                placeholder="请输入台账分解编号"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item> -->
            <el-form-item label="子目号" prop="zmh">
              <el-input
                v-model="queryParams.zmh"
                placeholder="请输入子目号"
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
            <!-- <el-form-item label="单位" prop="dw">
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
            <el-form-item label="设计数量" prop="sjsl">
              <el-input
                v-model="queryParams.sjsl"
                placeholder="请输入设计数量"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="分解数量" prop="fjsl">
              <el-input
                v-model="queryParams.fjsl"
                placeholder="请输入分解数量"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="变更数量" prop="bgsl">
              <el-input
                v-model="queryParams.bgsl"
                placeholder="请输入变更数量"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="复核数量" prop="fhsl">
              <el-input
                v-model="queryParams.fhsl"
                placeholder="请输入复核数量"
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
            <el-form-item label="复核金额" prop="fhje">
              <el-input
                v-model="queryParams.fhje"
                placeholder="请输入复核金额"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="fjlx">
              <el-input
                v-model="queryParams.fjlx"
                placeholder="请输入状态"
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
                :disabled="disabled"
                v-hasPermi="['ledgerDetail:ledgerBreakdownDetail:add']"
              >新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="info"
                plain
                icon="el-icon-sort"
                size="mini"
                @click="toggleExpandAll"
              >展开/折叠</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
              <el-button
                type="success"
                plain
                icon="el-icon-edit"
                size="mini"
                :disabled="single"
                @click="handleUpdate"
                v-hasPermi="['ledgerDetail:ledgerBreakdownDetail:edit']"
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
                v-hasPermi="['ledgerDetail:ledgerBreakdownDetail:remove']"
              >删除</el-button>
            </el-col> -->
            <!-- <el-col :span="1.5">
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['ledgerDetail:ledgerBreakdownDetail:export']"
              >导出</el-button>
            </el-col> -->
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>
       
          <el-table
            v-if="refreshTable"
            v-loading="loading"
            :data="ledgerBreakdownDetailList"
            row-key="id"
            :height="'calc(100vh - 205px)'"
            :default-expand-all="isExpandAll"
            :header-cell-style="headercellStyle"
            :cell-style="cellStyle"
            :tree-props="{children: 'children'}"
          >
            <el-table-column label="子目号" fixed="left" align="left" prop="zmh" min-width="160"
                             :show-overflow-tooltip="true"/>
            <el-table-column label="子目名称" align="center" prop="zmmc" min-width="140" :show-overflow-tooltip="true"/>
            <el-table-column label="单位" align="center" prop="dw" min-width="100"/>
            <el-table-column label="合同单价" align="center" prop="htdj" min-width="160">
              <template slot-scope="scope">
                {{ dealNumberFormat(scope.row.htdj) }}
              </template>
            </el-table-column>
            <el-table-column label="设计数量" align="center" prop="sjsl" min-width="140"/>
            <el-table-column label="分解数量" align="center" prop="fjsl" min-width="140"/>
            <el-table-column label="变更数量" align="center" prop="bgsl" min-width="140"/>
            <el-table-column label="复核数量" align="center" prop="fhsl" min-width="140"/>
            <el-table-column label="已计量数量" align="center" prop="yjlsl" min-width="120"/>
            <el-table-column label="复核金额" align="center" prop="fhje" min-width="140">
              <template slot-scope="scope">
                {{ dealNumberFormat(scope.row.fhje) }}
              </template>
            </el-table-column>
            <el-table-column label="分解类型" align="center" prop="fjlx" min-width="120">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.change_status" :value="scope.row.fjlx"/>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="status" min-width="80">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="left" fixed="right" class-name="small-padding fixed-width"
                             min-width="200">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  v-show="scope.row.action !== 'add'"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['ledgerDetail:ledgerBreakdownDetail:edit']"
                >设计数量
                </el-button>
                <!-- <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  v-show="scope.row.action === 'add'"
                  @click="save(scope.row)"
                  v-hasPermi="['ledgerDetail:ledgerBreakdownDetail:edit']"
                >保存
                </el-button> -->
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['ledgerDetail:ledgerBreakdownDetail:remove']"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>


    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加台账分解明细 -->
    <el-dialog :title="'添加清单'" :visible.sync="openAdd" width="1050px" append-to-body>
      <ledger-list v-if="openAdd" :tzfjbh="queryParams.tzfjbh" :close="closeOpenAdd" @getSelectionData="getSelectionData"/>
    </el-dialog>
    <!-- 修改台账分解明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="850px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ID" prop="id">
              <el-input :disabled="true" v-model="form.id" placeholder="请输入ID"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标段编号" prop="bdbh">
              <el-input :disabled="true" v-model="form.bdbh" placeholder="请输入标段编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子目号" prop="zmh">
              <el-input :disabled="true" v-model="form.zmh" placeholder="请输入子目号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子目名称" prop="zmmc">
              <el-input :disabled="true" v-model="form.zmmc" placeholder="请输入子目名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="dw">
              <el-input :disabled="true" v-model="form.dw" placeholder="请输入单位"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同单价" prop="htdj">
              <el-input :disabled="true" v-model="form.htdj" placeholder="请输入合同单价"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设计数量" prop="sjsl">
              <el-input v-model="form.sjsl" placeholder="请输入设计数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分解数量" prop="fjsl">
              <el-input v-model="form.fjsl" placeholder="请输入分解数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更数量" prop="bgsl">
              <el-input :disabled="true" v-model="form.bgsl" placeholder="请输入变更数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="复核数量" prop="fhsl">
              <el-input :disabled="true" v-model="form.fhsl" placeholder="请输入复核数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="已计量数量" prop="yjlsl">
              <el-input :disabled="true" v-model="form.yjlsl" placeholder="请输入已计量数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="复核金额" prop="fhje">
              <el-input :disabled="true" v-model="form.fhje" placeholder="请输入复核金额"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分解类型" prop="fjlx">
              <el-input :disabled="true" v-model="form.fjlx" placeholder="请输入状态"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group :disabled="true" v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.data_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
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
import {
  listLedgerBreakdownTree,
  getLedgerBreakdownDetail,
  delLedgerBreakdownDetail,
  addLedgerBreakdownDetail,
  updateLedgerBreakdownDetail
} from "@/api/ledgerDetail/ledgerBreakdownDetail";
import {listLedgerBreakdown} from "@/api/ledger/ledgerBreakdown";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import MultilevelTree from "@/components/MultilevelTree";
import LedgerList from './components/LedgerList';
import { dealNumberFormat } from "@/utils/utils.js";
export default {
  name: "LedgerBreakdownDetail",
  dicts: ['data_status'],
  components: {
    MultilevelTree,
    LedgerList
  },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,

      currentLevel: '101',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 显示搜索条件
      showSearch: true,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 总条数
      // total: 0,
      // 台账分解明细表格数据
      ledgerBreakdownDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openAdd: false,
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        bdbh: undefined,
        tzfjbh: undefined,
        zmh: undefined,
        zmmc: undefined,
        dw: undefined,
        htdj: undefined,
        sjsl: undefined,
        fjsl: undefined,
        bgsl: undefined,
        fhsl: undefined,
        yjlsl: undefined,
        fhje: undefined,
        fjlx: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        bdbh: [
          {required: true, message: "标段编号不能为空", trigger: "blur"}
        ],
        tzfjbh: [
          {required: true, message: "台账分解编号不能为空", trigger: "blur"}
        ],
        zmh: [
          {required: true, message: "子目号不能为空", trigger: "blur"}
        ],
        zmmc: [
          {required: true, message: "子目名称不能为空", trigger: "blur"}
        ],
        dw: [
          {required: true, message: "单位不能为空", trigger: "blur"}
        ],
        htdj: [
          {required: true, message: "合同单价不能为空", trigger: "blur"}
        ],
        sjsl: [
          {required: true, message: "设计数量不能为空", trigger: "blur"}
        ],
        fjsl: [
          {required: true, message: "分解数量不能为空", trigger: "blur"}
        ],
        // bgsl: [
        //   {required: true, message: "变更数量不能为空", trigger: "blur"}
        // ],
        // fhsl: [
        //   {required: true, message: "复核数量不能为空", trigger: "blur"}
        // ],
        // yjlsl: [
        //   {required: true, message: "已计量数量不能为空", trigger: "blur"}
        // ],
        // fhje: [
        //   {required: true, message: "复核金额不能为空", trigger: "blur"}
        // ],
        // fjlx: [
        //   {required: true, message: "状态不能为空", trigger: "blur"}
        // ],
        // status: [
        //   {required: true, message: "状态不能为空", trigger: "blur"}
        // ],
      },
      treeProps: {
        id: 'id',
        label: 'tzfjmc',
        children: 'children'
      },
      ledgerBreakdownList: [],
      headercellStyle: {
        fontFamily: 'PingFangSC-Regular',
        background: '#F7F8FB',
        color: '#12182A',
        fontWeight: 600,
        height: '44px',
        padding: '0 14px',
        fontSize: '14px',
      },
      cellStyle: {
        fontFamily: 'PingFangSC-Regular',
        color: '#3A4566',
        height: '44px',
        padding: '0 14px',
        fontSize: '14px',
      },
      dealNumberFormat,
      disabled: true // 新增按钮 默认禁止编辑
    };
  },
  created() {
    this.getLeftTree();
  },
  methods: {
    /** 查询台账分解列表 */
    getLeftTree() {
      this.loading = true;
      listLedgerBreakdown().then(response => {
        this.ledgerBreakdownList = this.handleTree(response.data, "tzfjbh", "tzfjbhParent");
      }).finally(() => {
        // TODO
        // if (this.ledgerBreakdownList.length) {
        //   this.queryParams.tzfjbh = this.ledgerBreakdownList[0].tzfjbh;
        // }
        this.getList();
      });
    },
    /** 查询台账分解明细列表 */
    getList() {
      this.loading = true;
      listLedgerBreakdownTree(this.queryParams).then(response => {
        this.ledgerBreakdownDetailList = response.rows;
        // this.total = response.total;
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
        tzfjbh: undefined,
        zmh: undefined,
        zmmc: undefined,
        dw: undefined,
        htdj: undefined,
        sjsl: undefined,
        fjsl: undefined,
        bgsl: undefined,
        fhsl: undefined,
        yjlsl: undefined,
        fhje: undefined,
        fjlx: undefined,
        status: "0",
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
      };
      this.resetForm("form");
    },
     /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    rowKey (row) {
      console.error('row', row);
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
      this.ids = selection.map(item => item.tzfjbh)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.openAdd = true;
      this.title = "添加台账分解明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row)
      // this.open = true;
      // this.title = "修改台账分解明细";
      this.loading = true;
      this.reset();


      getLedgerBreakdownDetail(row.id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改台账分解明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          // if (this.form.tzfjbh != null) {
          updateLedgerBreakdownDetail(this.form).then(response => {
            // this.$modal.msgSuccess("修改成功");
            this.listLedgerUpBreakdownDetail();
          }).finally(() => {
            this.buttonLoading = false;
          });
          // } else {
          //   addLedgerBreakdownDetail(this.form).then(response => {
          //     this.$modal.msgSuccess("新增成功");
          //     this.open = false;
          //     this.getList();
          //   }).finally(() => {
          //     this.buttonLoading = false;
          //   });
          // }
        }
      });
    },
    listLedgerUpBreakdownDetail () {
      listLedgerUpBreakdownDetail(this.form).then(response => {
        this.open = false;
        this.getList();
        this.$modal.msgSuccess("修改成功");
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const tzfjbhs = row.tzfjbh || this.ids;
      this.$modal.confirm('是否确认删除台账分解明细编号为"' + tzfjbhs + '"的数据项？').then(() => {
        this.loading = true;
        return delLedgerBreakdownDetail(tzfjbhs);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {

      }).finally(() => {
        this.loading = false;
      });
    },
    // // 保存逻辑
    // save(row) {
    //   row.tzfjbh = this.queryParams.tzfjbh;
    //   console.log(row);
    //   addLedgerBreakdownDetail(row).then(response => {
    //     this.$modal.msgSuccess("保存成功");
    //     this.open = false;
    //     this.getList();
    //   }).finally(() => {
    //     this.buttonLoading = false;
    //   });
    //   // 保存成功后刷新表格数据
    //   // TODO
    // },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ledgerDetail/ledgerBreakdownDetail/export', {
        ...this.queryParams
      }, `ledgerBreakdownDetail_${new Date().getTime()}.xlsx`)
    },
    selectTree(row) {
      if(!row.children) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
      // console.error('选中的数据', row);
      this.queryParams.tzfjbh = row.tzfjbh;
      this.getList();
    },
    getSelectionData(val) {
      this.getList();
    },
    closeOpenAdd() {
      this.openAdd = false;
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
}
</style>
