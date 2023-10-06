<template>
  <div class="change-form">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="变更编号" prop="bgbhName">
            <el-input v-model="form.bgbhName" placeholder="请输入变更编号"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="变更事项" prop="bgsx">
            <el-input v-model="form.bgsx" placeholder="请输入变更事项"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="变更等级" prop="bgdj">
            <el-select
              v-model="form.bgdj"
              placeholder="请选择变更等级"
              clearable
            >
              <el-option
                v-for="dict in dict.type.ledger_change_level"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="变更类型" prop="bglx">
             <el-select
              v-model="form.bglx"
              placeholder="请选择变更类型"
              clearable
            >
              <el-option
                v-for="dict in dict.type.ledger_change_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工程部位" prop="gcbw">
            <el-input v-model="form.gcbw" placeholder="请输入工程部位"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="桩号" prop="zh">
            <el-input v-model="form.zh" placeholder="请输入桩号"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="图号" prop="th">
            <el-input v-model="form.th" placeholder="请输入图号"/>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="申请日期" prop="sqrq">
            <el-date-picker clearable
              v-model="form.sqrq"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择申请日期">
            </el-date-picker>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="变更金额" prop="bgje">
            <el-input v-model="form.bgje" disabled placeholder="请输入变更金额"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="变更原因" prop="bgyy">
            <el-input v-model="form.bgyy" type="textarea" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计算式" prop="jss">
            <el-input v-model="form.jss" type="textarea" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注说明" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="相关附件" prop="fj">
            <upload @input="getFileList"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-col :span="1.5">
      <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ledgerChange:ledgerChange:add']"
          style="margin-bottom: 12px"
        >新增
      </el-button>
    </el-col>
    <el-table
      :data="getContractBillList"
      :height="'calc(100vh - 580px)'"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed="left" type="index" label="序号" width="55" align="left"/>
      <el-table-column fixed="left" label="标段编号" prop="bdbh" min-width="90" :show-overflow-tooltip="true"/>
      <el-table-column label="子目号" align="center" min-width="120" :show-overflow-tooltip="true" prop="zmh"/>
      <el-table-column label="子目名称" align="center" min-width="160" :show-overflow-tooltip="true" prop="zmmc"/>
      <el-table-column label="合同单价" align="center" min-width="110" prop="htdj"/>
      <el-table-column label="变更数量" align="center" min-width="110" prop="bgsl">
        <template slot-scope="scope">
          <div>
              <el-input type="number" v-model="scope.row.bgsl" placeholder="请输入"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="变更金额" align="center" min-width="110" prop="bgje"/>
      <el-table-column label="单位" align="center" min-width="80" prop="dw"/>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
    <!-- 添加或修改台账变更/工程变更对话框 -->
    <el-dialog title="添加清单" :visible.sync="open" width="1150px" append-to-body>
      <addContractBillList v-if="open" :list="contractBillList" :close="closeOpen" @getData="getChoseList"/>
    </el-dialog>
  </div>
</template>

<script>
import { getContractBill } from "@/api/bill/contractBill";

import {
  addLedgerChange,
  updateLedgerChange
} from "@/api/ledgerChange/ledgerChange";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import upload from '@/components/FileUpload';
import addContractBillList from './addContractBillList';
import calc from '@/utils/calc.js'
export default {
  name: "ContractBill",
  dicts: ['data_status', 'ledger_change_type', 'ledger_change_level'],
  components: {
    Treeselect, upload, addContractBillList
  },
  props: {
    close: {
      type: Function,
      default: () => {
      }
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 工程量清单表格数据
      contractBillList: [],
      // 弹出层标题
      title: "",
      // 是否展开，默认全部展开
      isExpandAll: true,
      // total: 0,
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        bdbh: undefined,
        zmh: undefined,
        zmmc: undefined,
        zmhParent: undefined,
        zmhAncestors: undefined,
        dw: undefined,
        htdj: undefined,
        xzdj: undefined,
        htsl: undefined,
        htje: undefined,
        shsl: undefined,
        shje: undefined,
        bgsl: undefined,
        bgje: undefined,
        zsl: undefined,
        zje: undefined,
        status: undefined,
        parentId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        bgbh: [
          {required: true, message: "变更编号不能为空", trigger: "blur"}
        ],
        // bgsx: [
        //   { required: true, message: "变更事项不能为空", trigger: "blur" }
        // ],
        bgdj: [
          {required: true, message: "变更等级不能为空", trigger: "blur"}
        ],
        bglx: [
          {required: true, message: "变更类型不能为空", trigger: "blur"}
        ],
        // zh: [
        //   { required: true, message: "桩号不能为空", trigger: "blur" }
        // ],
        // gcbw: [
        //   { required: true, message: "工程部位不能为空", trigger: "blur" }
        // ],
        // th: [
        //   { required: true, message: "图号不能为空", trigger: "blur" }
        // ],
        // sqrq: [
        //   { required: true, message: "申请日期不能为空", trigger: "blur" }
        // ],
        // bgje: [
        //   { required: true, message: "变更金额不能为空", trigger: "blur" }
        // ],
        // bgyy: [
        //   { required: true, message: "变更原因不能为空", trigger: "blur" }
        // ],
        // jss: [
        //   { required: true, message: "计算式不能为空", trigger: "blur" }
        // ],
        // dataStatus: [
        //   { required: true, message: "数据状态不能为空", trigger: "blur" }
        // ],
        // status: [
        //   { required: true, message: "状态不能为空", trigger: "blur" }
        // ],
      },
      // 选中的数据集合
      selectionList: [],
      fileList: [],
      open: false
    };
  },
  created() {
    // this.getList();
  },
  // watch: {
  //   contractBillList: {
  //     handler (val) {
  //       const amount = [];
  //       this.contractBillList = val.map(item => {
  //         if (item.bgsl) {
  //           item.bgje = calc.mul(Number(item.bgsl) * Number(dw));
  //           amount.push(item.bgje)
  //         }
  //         return item;
  //       })
  //       this.form.bgje = calc.add(...amount);
  //     },
  //     deep: true
  //   }
  // },
  computed: {
    getContractBillList () {
      const amount = [];
      if (this.contractBillList.length) {
        this.contractBillList.forEach(item => {
          item.bgje = calc.mul(Number(item.bgsl || 0), Number(item.htdj));
          amount.push(item.bgje)
        })
      }
      this.form.bgje = calc.add(...amount);
      return this.contractBillList;
    }
  },
  methods: {
    /** 查询工程量清单列表 */
    // getList() {
    //   this.loading = true;
    //   listContractBillPage(this.queryParams).then(response => {
    //     this.contractBillList = response.rows;
    //     // this.total = response.total;
    //     this.loading = false;
    //   });
    // },
    // 取消按钮
    cancel() {
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        bdbh: null,
        zmh: null,
        zmmc: null,
        zmhParent: null,
        zmhAncestors: null,
        dw: null,
        htdj: null,
        xzdj: null,
        htsl: null,
        htje: null,
        shsl: null,
        shje: null,
        bgsl: null,
        bgje: null,
        zsl: null,
        zje: null,
        status: "0",

        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        parentId: null
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
      this.selectionList = selection;
      // selection.forEach(row => {
      //   let list = [];
      //   if (this.selectionList.length) {
      //     list = this.selectionList.filters(v => v.id === row.id);
      //   }
      //   if (list.length === 1) {
      //     this.selectionList = this.selectionList.filters(v => v.id !== row.id);
      //   } else {
      //     row.action = 'add';
      //     this.selectionList = [...this.selectionList, row];
      //   }
      // })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        console.log("qwe")
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateLedgerChange(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.close();
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            // this.form.sqrq = this.form.sqrq ? this.form.sqrq + '00:00:00' : '';
            this.form.fj = JSON.stringify(this.fileList);
            if (!this.contractBillList.length) {
              this.$message.warning('工程清单不能为空！');
              return
            }
            let flag = false;
            this.contractBillList.forEach(item => {
              if (!(Number(item.bgsl) > 0)) {
                flag = true;
              }
            })
            if (flag) {
              this.$message.warning('工程清单修正金额必须大于0！');
              return
            }
            this.form.detailBos = this.contractBillList;
            addLedgerChange(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.close();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    // 添加清单
    handleAdd() {
      // TODO
      // 再打开一个弹窗
      this.open = true;
    },
    getFileList (val) {
      this.fileList = [];
      this.fileList = val;
    },
    closeOpen () {
      this.open = false;
    },
    // 获取添加的清单
    getChoseList (val) {
      this.contractBillList = []
      this.contractBillList = val.map(item => {
        item.id = null;
        return item;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.change-form {
  height: 100%;

  .dialog-footer {
    text-align: right;
    margin-top: 16px;
  }
}
</style>
