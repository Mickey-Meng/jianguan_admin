<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="名称" prop="goodsTypeName">
        <el-input
          v-model="queryParams.goodsTypeName"
          placeholder="请输入商品类别名称"
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
          v-hasPermi="['shopGoodsType:shopGoodsType:add']"
        >新增</el-button>
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="shopGoodsTypeList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="父商品类别id" prop="parentId"  v-if="false"/>
      <el-table-column label="祖级列表" align="center" prop="ancestors"  v-if="true"/>
      <el-table-column label="商品类别编码" align="center" prop="goodsTypeCode"  v-if="false"/>
      <el-table-column label="商品类别名称" align="center" prop="goodsTypeName" />
      <el-table-column label="显示顺序" align="center" prop="orderNum"  v-if="false"/>
      <el-table-column label="备注" align="center" prop="remark"  v-if="false"/>
      <el-table-column label="部门ID" align="center" prop="deptId"  v-if="false"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['shopGoodsType:shopGoodsType:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['shopGoodsType:shopGoodsType:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['shopGoodsType:shopGoodsType:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改商品类别对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="父商品类别id" prop="parentId">
          <treeselect v-model="form.parentId" :options="shopGoodsTypeOptions" :normalizer="normalizer" placeholder="请选择父商品类别id" />
        </el-form-item>
<!--        <el-form-item label="祖级列表" prop="ancestors">-->
<!--          <el-input v-model="form.ancestors" placeholder="请输入祖级列表" />-->
<!--        </el-form-item>
        <el-form-item label="商品类别编码" prop="goodsTypeCode">
          <el-input v-model="form.goodsTypeCode" placeholder="请输入商品类别编码" />
        </el-form-item>-->
        <el-form-item label="商品类别名称" prop="goodsTypeName">
          <el-input v-model="form.goodsTypeName" placeholder="请输入商品类别名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
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
import { listShopGoodsType, getShopGoodsType, delShopGoodsType, addShopGoodsType, updateShopGoodsType } from "@/api/shopGoodsType/shopGoodsType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ShopGoodsType",
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
      // 商品类别表格数据
      shopGoodsTypeList: [],
      // 商品类别树选项
      shopGoodsTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        parentId: undefined,
        ancestors: undefined,
        goodsTypeCode: undefined,
        goodsTypeName: undefined,
        orderNum: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "id不能为空", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "父商品类别id不能为空", trigger: "blur" }
        ],
        ancestors: [
          { required: true, message: "祖级列表不能为空", trigger: "blur" }
        ],
        goodsTypeCode: [
          { required: true, message: "商品类别编码不能为空", trigger: "blur" }
        ],
        goodsTypeName: [
          { required: true, message: "商品类别名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "部门ID不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品类别列表 */
    getList() {
      this.loading = true;
      listShopGoodsType(this.queryParams).then(response => {
        this.shopGoodsTypeList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    /** 转换商品类别数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.goodsTypeName,
        children: node.children
      };
    },
	/** 查询商品类别下拉树结构 */
    getTreeselect() {
      listShopGoodsType().then(response => {
        this.shopGoodsTypeOptions = [];
        const data = { id: 0, goodsTypeName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.shopGoodsTypeOptions.push(data);
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
        parentId: null,
        ancestors: null,
        goodsTypeCode: null,
        goodsTypeName: null,
        orderNum: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        deptId: null
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
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加商品类别";
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
        this.form.parentId = row.id;
      }
      getShopGoodsType(row.id).then(response => {
	    this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改商品类别";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
		  this.buttonLoading = true;
          if (this.form.id != null) {
            updateShopGoodsType(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addShopGoodsType(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除商品类别编号为"' + row.id + '"的数据项？').then(() => {
        this.loading = true;
        return delShopGoodsType(row.id);
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
