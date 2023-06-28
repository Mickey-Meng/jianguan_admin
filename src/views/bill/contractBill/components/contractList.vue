<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标段编号" prop="bdbh">
        <el-input
          v-model="queryParams.bdbh"
          placeholder="请输入标段编号"
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
      <el-form-item label="子目名称" prop="zmmc">
        <el-input
          v-model="queryParams.zmmc"
          placeholder="请输入子目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['bill:contractBill:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="unload"
        >折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="contractBillList"
      row-key="zmh"
      lazy
      :height="'cacl(100vh - 205px)'"
      :header-cell-style="headercellStyle"
      :cell-style="cellStyle"
      :load="load"
      ref="table"
    >
      <el-table-column fixed="left" label="标段编号" prop="bdbh" min-width="160" :show-overflow-tooltip="true"/>
      <el-table-column label="子目号" align="center" min-width="120" prop="zmh" :show-overflow-tooltip="true"/>
      <el-table-column label="子目名称" align="center" min-width="180" prop="zmmc" :show-overflow-tooltip="true"/>
      <el-table-column label="单位" align="center" min-width="80" prop="dw" />
      <el-table-column label="合同单价" align="center" min-width="120" prop="htdj">
        <template slot-scope="scope">
          {{ dealNumberFormat(scope.row.htdj) }}
        </template>
      </el-table-column>
      <el-table-column label="变更单价" align="center" min-width="120" prop="xzdj">
        <template slot-scope="scope">
          {{ dealNumberFormat(scope.row.xzdj) }}
        </template>
      </el-table-column>
      <el-table-column label="合同数量" align="center" min-width="120" prop="htsl" />
      <el-table-column label="变更数量" align="center" min-width="120" prop="xzsl" />
      <el-table-column label="计量数量" align="center" min-width="120" prop="shsl" />
      <el-table-column label="合同金额" align="center" min-width="120" prop="htje">
        <template slot-scope="scope">
          {{ dealNumberFormat(scope.row.htje) }}
        </template>
      </el-table-column>
      <el-table-column label="变更金额" align="center" min-width="120" prop="xzje">
        <template slot-scope="scope">
          {{ dealNumberFormat(scope.row.xzje) }}
        </template>
      </el-table-column>
      <el-table-column label="计量金额" align="center" min-width="120" prop="shje">
        <template slot-scope="scope">
          {{ dealNumberFormat(scope.row.shje) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="总数量" align="center" prop="zsl" />
      <el-table-column label="总金额" align="center" prop="zje" /> -->
      <el-table-column label="状态" align="center" v-if="false" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.bil_source" :value="scope.row.isChange"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="树id" align="center" prop="parentId" /> -->
      <el-table-column fixed="right" label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bill:contractBill:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['bill:contractBill:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bill:contractBill:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改工程量清单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="850px" append-to-body>
      <el-form ref="form" v-if="open" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标段编号" prop="bdbh">
              <el-input v-model="form.bdbh" placeholder="请输入标段编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子目号" prop="zmh">
              <el-input v-model="form.zmh" placeholder="请输入子目号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子目名称" prop="zmmc">
              <el-input v-model="form.zmmc" placeholder="请输入子目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子目号父节点" prop="zmhParent">
              <treeselect v-model="form.zmhParent" :disabled="action === 'edit'" :options="contractBillOptions" :normalizer="normalizer" placeholder="请选择子目号父节点" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="子目号祖级列表" prop="zmhAncestors">-->
<!--              <el-input v-model="form.zmhAncestors" placeholder="请输入子目号祖级列表" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="单位" prop="dw">
              <el-input v-model="form.dw" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同单价" prop="htdj">
              <el-input v-model="form.htdj" :disabled="action === 'edit' && !isLeaf" placeholder="请输入合同单价" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="变更单价" prop="xzdj">
              <el-input v-model="form.xzdj" :disabled="action === 'edit'" placeholder="请输入变更单价" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="合同数量" prop="htsl">
              <el-input v-model="form.htsl" :disabled="action === 'edit' && !isLeaf" placeholder="请输入合同数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同金额" prop="htje">
              <el-input v-model="form.htje" :disabled="action === 'edit' && !isLeaf" placeholder="请输入合同金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.bil_source"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="计量数量" prop="shsl">-->
<!--              <el-input v-model="form.shsl" placeholder="请输入计量数量" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="计量金额" prop="shje">-->
<!--              <el-input v-model="form.shje" placeholder="请输入计量金额" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="变更数量" prop="xzsl">-->
<!--              <el-input v-model="form.xzsl" placeholder="请输入变更数量" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="变更金额" prop="xzje">-->
<!--              <el-input v-model="form.xzje" placeholder="请输入变更金额" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
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
import { listContractBill, getContractBill, delContractBill, addContractBill, updateContractBill } from "@/api/bill/contractBill";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { dealNumberFormat } from "@/utils/utils.js";
import formValidate from '@/plugins/formValidate/formValidate'
export default {
  name: "ContractBill",
  dicts: ['bil_source'],
  components: {
    Treeselect
  },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 工程量清单表格数据
      contractBillList: [],
      // 工程量清单表格数据
      contractBillListCopy: [],
      // 工程量清单树选项
      contractBillOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: false,
      // 查询参数
      queryParams: {
        bdbh: '',
        zmh: '',
        zmmc: '',
        zmhParent: '',
        zmhAncestors: '',
        dw: '',
        htdj: '',
        xzdj: '',
        htsl: '',
        htje: '',
        shsl: '',
        shje: '',
        xzsl: '',
        xzje: '',
        zsl: '',
        zje: '',
        status: '',
        parentId: ''
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
        zmh: [
          { required: true, message: "子目号不能为空", trigger: "blur" }
        ],
        zmmc: [
          { required: true, message: "子目名称不能为空", trigger: "blur" }
        ],
        zmhParent: [
          { required: true, message: "子目号父节点不能为空", trigger: "blur" }
        ],
        // zmhAncestors: [
        //   { required: true, message: "子目号祖级列表不能为空", trigger: "blur" }
        // ],
        // dw: [
        //   { required: true, message: "单位不能为空", trigger: "blur" }
        // ],
        htdj: [
          {
            'validator': formValidate.numberValidator('14/2', true),
            'trigger': ['change', 'blur'],
          },
        ],
        xzdj: [
          // { required: true, message: "变更单价不能为空", trigger: "blur" }
          {
            'validator': formValidate.numberValidator('14/2', true),
            'trigger': ['change', 'blur'],
          },
        ],
        htsl: [
          // { required: true, message: "合同数量不能为空", trigger: "blur" }
          {
            'validator': formValidate.checkNumber(),
            'trigger': ['change', 'blur'],
          },
        ],
        htje: [
          // { required: true, message: "合同金额不能为空", trigger: "blur" }
          {
            'validator': formValidate.numberValidator('15/2', true),
            'trigger': ['change', 'blur'],
          },
        ],
        // shsl: [
        //   { required: true, message: "计量数量不能为空", trigger: "blur" }
        // ],
        // shje: [
        //   { required: true, message: "计量金额不能为空", trigger: "blur" }
        // ],
        // xzsl: [
        //   { required: true, message: "变更数量不能为空", trigger: "blur" }
        // ],
        // xzje: [
        //   { required: true, message: "变更金额不能为空", trigger: "blur" }
        // ],
        // zsl: [
        //   { required: true, message: "总数量不能为空", trigger: "blur" }
        // ],
        // zje: [
        //   { required: true, message: "总金额不能为空", trigger: "blur" }
        // ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        // remark: [
        //   { required: true, message: "备注不能为空", trigger: "blur" }
        // ],
        parentId: [
          { required: true, message: "树id不能为空", trigger: "blur" }
        ]
      },
      dealNumberFormat,
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
      action: '',
      isLeaf: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工程量清单列表 */
    getList() {
      this.refreshTable = false;
      this.loading = true;
      listContractBill(this.queryParams).then(response => {
        this.contractBillListCopy = this.handleTree(response.data, "zmh", "zmhParent");
        const contractBillList = this.handleTree(response.data, "zmh", "zmhParent");
        this.contractBillList = JSON.parse(JSON.stringify(contractBillList)).map(item => {
          item.hasChildren = item.children && item.children.length > 0;
          item.children = null;
          item.idList = [ item.id ];
          return item;
        })
        this.loading = false;
        this.refreshTable = true;
      });
    },
    load (tree, treeNode, resolve) {
      const idCopy = JSON.parse(JSON.stringify(tree.idList));
      // 查找下一层数据
      let resolveArr = this.contractBillListCopy;
      let id;
      while(id = tree.idList.shift()) {
        const tarItem = resolveArr.find(item => item.id === id);
        tarItem.loadedChildren = true;
        resolveArr = tarItem.children
      }
      // 处理下一层数据的属性
      resolveArr = JSON.parse(JSON.stringify(resolveArr))
      resolveArr.forEach(item => {
        item.hasChildren = item.children && item.children.length > 0
        item.children = null
        // 此处需要深拷贝，以防各个item的idList混乱
        item.idList = JSON.parse(JSON.stringify(idCopy))
        item.idList.push(item.id)
      })

      // 标识已经加载子节点
      tree.loadedChildren = true

      // 渲染子节点
      resolve(resolveArr)
    },
    unload () {
      this.refreshTable = false
      // eslint-disable-next-line
      this.$nextTick(() => this.refreshTable = true)
      this.contractBillList = JSON.parse(JSON.stringify(this.contractBillListCopy)).map(item => {
        // hasChildren 表示需要展示一个箭头图标
        item.hasChildren = item.children && item.children.length > 0
        // 只展示一层
        item.children = null
        // 记住层级关系
        item.idList = [item.id]
        return item
      })
    },
    /** 转换工程量清单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.zmh,
        label: node.zmmc,
        children: node.children
      };
    },
	/** 查询工程量清单下拉树结构 */
    getTreeselect() {
      listContractBill().then(response => {
        this.contractBillOptions = [];
        const data = { zmh: 0, zmmc: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "zmh", "zmhParent");
        this.contractBillOptions.push(data);
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
        id: null,
        bdbh: '',
        zmh: '',
        zmmc: '',
        zmhParent: '',
        zmhAncestors: '',
        dw: '',
        htdj: '',
        xzdj: '',
        htsl: '',
        htje: '',
        shsl: '',
        shje: '',
        xzsl: '',
        xzje: '',
        zsl: '',
        zje: '',
        status: "0",

        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: '',
        remark: '',
        parentId: ''
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.zmh) {
        this.form.zmhParent = row.zmh;
      } else {
        this.form.zmhParent = 0;
      }
      this.action = 'add';
      this.open = true;
      this.title = "添加工程量清单";
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.error('row', row);
      this.isLeaf = row.children === undefined;
	    this.loading = true;
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.zmhParent = row.zmh;
      }
      getContractBill(row.id).then(response => {
	    this.loading = false;
        // this.form = response.data;
        Object.keys(this.form).forEach(key => {
          this.form[key] = response.data[key] || ''
        })
        this.action = 'edit';
        this.open = true;
        this.title = "修改工程量清单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
		  this.buttonLoading = true;
          if (this.form.id != null) {
            updateContractBill(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addContractBill(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除工程量清单编号为"' + row.id + '"的数据项？').then(() => {
        this.loading = true;
        return delContractBill(row.id);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
  .app-container {
    height: 100%;
    .el-table {
      height: calc(100% - 70px);
      overflow: auto;
    }
  }
</style>
