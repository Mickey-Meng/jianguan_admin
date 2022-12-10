<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="变更编号" prop="bgbh">
            <el-input v-model="form.bgbh" placeholder="请输入变更编号"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="变更事项" prop="bgsx">
            <el-input v-model="form.bgsx" placeholder="请输入变更事项"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="变更等级" prop="bgdj">
            <el-input v-model="form.bgdj" placeholder="请输入变更等级"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="变更类型" prop="bglx">
            <el-input v-model="form.bglx" placeholder="请输入变更类型"/>
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
        <el-col :span="6">
          <el-form-item label="申请日期" prop="sqrq">
            <el-date-picker clearable
                            v-model="form.sqrq"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择申请日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="变更金额" prop="bgje">
            <el-input v-model="form.bgje" placeholder="请输入变更金额"/>
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
          <el-form-item label="备注明说" prop="jss">
            <el-input v-model="form.jss" type="textarea" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="相关附件" prop="fj">
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
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="contractBillList"
      :height="'calc(100vh - 600px)'"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="left"/>
      <el-table-column fixed="left" label="标段编号" prop="bdbh" min-width="90" :show-overflow-tooltip="true"/>
      <el-table-column label="子目号" align="center" min-width="120" :show-overflow-tooltip="true" prop="zmh"/>
      <el-table-column label="子目名称" align="center" min-width="180" :show-overflow-tooltip="true" prop="zmmc"/>
      <el-table-column label="工程部位" align="center" prop="gcbw" min-width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="单位" align="center" min-width="80" prop="dw"/>
      <el-table-column label="合同单价" align="center" min-width="110" prop="htdj"/>
      <el-table-column label="审核数量" align="center" min-width="110" prop="shsl"/>
      <el-table-column label="变更数量" align="center" min-width="110" prop="bgsl"/>
      <el-table-column label="变更金额" align="center" min-width="110" prop="bgje"/>
      <el-table-column label="审核金额" align="center" min-width="110" prop="shje"/>

    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  listContractBillPage,
  getContractBill,
  delContractBill,
  addContractBill,
  updateContractBill
} from "@/api/bill/contractBill";
import {insertList} from "@/api/ledgerChangeDetail/ledgerChangeDetail";

import {
  addLedgerChange,
  updateLedgerChange
} from "@/api/ledgerChange/ledgerChange";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ContractBill",
  dicts: ['data_status'],
  components: {
    Treeselect
  },
  props: {
    close: {
      type: Function,
      default: () => {
      }
    }
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
      // 重新渲染表格状态
      refreshTable: true,
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
        xzsl: undefined,
        xzje: undefined,
        zsl: undefined,
        zje: undefined,
        status: undefined,
        parentId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // id: [
        //   { required: true, message: "ID不能为空", trigger: "blur" }
        // ],
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
      fileList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工程量清单列表 */
    getList() {
      this.loading = true;
      listContractBillPage(this.queryParams).then(response => {
        this.contractBillList = response.rows;
        // this.total = response.total;
        this.loading = false;
      });
    },
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
        xzsl: null,
        xzje: null,
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
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    addLedgerChangeDetailqwe(bgbh) {
      var selectionList = this.selectionList;
      for (let i in selectionList) {
        selectionList[i].bgbh = bgbh;
      }

      insertList(selectionList).then(response => {
        this.$modal.msgSuccess("新增成功");
        this.open = false;
        this.getList();
      }).finally(() => {

        this.buttonLoading = false;
      });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {

      selection.forEach(row => {
        let list = [];
        if (this.selectionList.length) {
          list = this.selectionList.filters(v => v.id === row.id);
        }
        if (list.length === 1) {
          this.selectionList = this.selectionList.filters(v => v.id !== row.id);
        } else {
          row.action = 'add';
          this.selectionList = [...this.selectionList, row];
        }
      })
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
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addLedgerChange(this.form).then(response => {

              console.log()
              this.addLedgerChangeDetailqwe(this.form.bgbh);
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


    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 添加清单
    handleAdd() {
      // TODO
      // 再打开一个弹窗
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;

  .dialog-footer {
    text-align: right;
    margin-top: 36px;
  }
}
</style>
