<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="110px">
      <!-- <el-form-item label="标段编号" prop="bdbh">
        <el-input
          v-model="queryParams.bdbh"
          placeholder="请输入标段编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="台账分解编号" prop="tzfjbh">
        <el-input
          v-model="queryParams.tzfjbh"
          placeholder="请输入台账分解编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="台账分解名称" prop="tzfjmc">
        <el-input
          v-model="queryParams.tzfjmc"
          placeholder="请输入台账分解名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="状态" prop="status">
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
          v-hasPermi="['ledger:ledgerBreakdown:add']"
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
      :data="ledgerBreakdownList"
      row-key="tzfjbh"
      lazy
      :header-cell-style="headercellStyle"
      :cell-style="cellStyle"
      :load="load"
      ref="table"
    >
      <el-table-column label="台账分解编号" align="left" prop="tzfjbh" />
      <el-table-column label="台账分解名称" align="center" prop="tzfjmc" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ledger:ledgerBreakdown:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['ledger:ledgerBreakdown:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ledger:ledgerBreakdown:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改台账分解对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <!-- <el-form-item label="标段编号" prop="bdbh">
          <el-input v-model="form.bdbh" placeholder="请输入标段编号" />
        </el-form-item> -->
<!--        <el-form-item label="台账分解编号" prop="tzfjbh">
          <el-input v-model="form.tzfjbh" placeholder="请输入台账分解编号" />
        </el-form-item>-->
        <el-form-item label="父节点" prop="tzfjbhParent">
          <treeselect v-model="form.tzfjbhParent" :options="ledgerBreakdownOptions" :normalizer="normalizer" placeholder="请选择台账分解编号父节点" />
        </el-form-item>
        <!-- <el-form-item label="台账分解编号祖级列表" prop="tzfjbhAncestors">
          <el-input v-model="form.tzfjbhAncestors" placeholder="请输入台账分解编号祖级列表" />
        </el-form-item> -->
        <el-form-item label="名称" prop="tzfjmc">
          <el-input v-model="form.tzfjmc" placeholder="请输入台账分解名称" />
        </el-form-item>
        <!-- <el-form-item label="分解类型" prop="fjlx">
          <el-input v-model="form.fjlx" placeholder="请输入分解类型" />
        </el-form-item> -->
<!--        <el-form-item label="状态">
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
        </el-form-item>-->
        <!-- <el-form-item label="树id" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入树id" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLedgerBreakdown, getLedgerBreakdown, delLedgerBreakdown, addLedgerBreakdown, updateLedgerBreakdown } from "@/api/ledger/ledgerBreakdown";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "LedgerBreakdown",
  dicts: ['data_status'],
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
      ledgerBreakdownListCopy: [],
      // 台账分解表格数据
      ledgerBreakdownList: [],
      // 台账分解树选项
      ledgerBreakdownOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: false,
      // 查询参数
      queryParams: {
        bdbh: undefined,
        tzfjbh: undefined,
        tzfjbhParent: undefined,
        tzfjbhAncestors: undefined,
        tzfjmc: undefined,
        fjlx: undefined,
        status: undefined,
        parentId: undefined
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
        tzfjbh: [
          { required: true, message: "台账分解编号不能为空", trigger: "blur" }
        ],
        tzfjbhParent: [
          { required: true, message: "台账分解编号父节点不能为空", trigger: "blur" }
        ],
        tzfjmc: [
          { required: true, message: "台账分解名称不能为空", trigger: "blur" }
        ],
        fjlx: [
          { required: true, message: "分解类型不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ]
        // ,
        // parentId: [
        //   { required: true, message: "树id不能为空", trigger: "blur" }
        // ]
      },
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
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询台账分解列表 */
    getList() {
      this.loading = true;
      this.refreshTable = false;
      listLedgerBreakdown(this.queryParams).then(response => {
        this.ledgerBreakdownListCopy = this.handleTree(response.data, "tzfjbh", "tzfjbhParent");
        const ledgerBreakdownList = this.handleTree(response.data, "tzfjbh", "tzfjbhParent");
        this.ledgerBreakdownList = JSON.parse(JSON.stringify(ledgerBreakdownList)).map(item => {
          item.hasChildren = item.children && item.children.length > 0;
          item.children = null;
          item.idList = [ item.id ];
          return item;
        })
        console.error('ledgerBreakdownList', this.ledgerBreakdownList);
        this.loading = false;
        this.refreshTable = true;
      });
    },
    load (tree, treeNode, resolve) {
      const idCopy = JSON.parse(JSON.stringify(tree.idList));
      // 查找下一层数据
      let resolveArr = this.ledgerBreakdownListCopy;
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
      this.ledgerBreakdownList = JSON.parse(JSON.stringify(this.ledgerBreakdownListCopy)).map(item => {
        // hasChildren 表示需要展示一个箭头图标
        item.hasChildren = item.children && item.children.length > 0
        // 只展示一层
        item.children = null
        // 记住层级关系
        item.idList = [item.id]
        return item
      })
    },
    /** 转换台账分解数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.tzfjbh,
        label: node.tzfjmc,
        children: node.children
      };
    },
	/** 查询台账分解下拉树结构 */
    getTreeselect() {
      listLedgerBreakdown().then(response => {
        this.ledgerBreakdownOptions = [];
        const data = { tzfjbh: 0, tzfjbhParent: null, tzfjmc: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "tzfjbh", "tzfjbhParent");
        this.ledgerBreakdownOptions.push(data);
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
        bdbh: null,
        tzfjbh: null,
        tzfjbhParent: null,
        tzfjbhAncestors: null,
        tzfjmc: null,
        fjlx: null,
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
      if (row != null && row.tzfjbh) {
        this.form.tzfjbhParent = row.tzfjbh;
      } else {
        this.form.tzfjbhParent = 0;
      }
      this.open = true;
      this.title = "添加台账分解";
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
	  this.loading = true;
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.tzfjbhParent = row.tzfjbh;
      }
      getLedgerBreakdown(row.id).then(response => {
	    this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改台账分解";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
		  this.buttonLoading = true;
      this.form.parentId=this.form.tzfjbhParent;
          if (this.form.id != null) {
            updateLedgerBreakdown(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addLedgerBreakdown(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除台账分解编号为"' + row.id + '"的数据项？').then(() => {
        this.loading = true;
        return delLedgerBreakdown(row.id);
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
