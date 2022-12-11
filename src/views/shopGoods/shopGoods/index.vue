<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="供应商" prop="supplierName">
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="商品类别ID" prop="goodsTypeId">
        <el-input
          v-model="queryParams.goodsTypeId"
          placeholder="请输入商品类别ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="商品编码" prop="goodsCode">
        <el-input
          v-model="queryParams.goodsCode"
          placeholder="请输入商品编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName">
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品规格" prop="goodsSearchstandard">
        <el-input
          v-model="queryParams.goodsSearchstandard"
          placeholder="请输入商品规格"
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
          v-hasPermi="['shopGoods:shopGoods:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['shopGoods:shopGoods:edit']"
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
          v-hasPermi="['shopGoods:shopGoods:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['shopGoods:shopGoods:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shopGoodsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="false"/>
      <el-table-column label="供应商名称" align="center" prop="supplierName" />
      <el-table-column label="商品类别" align="center" prop="goodsTypeId" />
      <el-table-column label="商品编码" align="center" prop="goodsCode" />
      <el-table-column label="商品名称" align="center" prop="goodsName" />
      <el-table-column label="商品单位" align="center" prop="goodsUnit" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['shopGoods:shopGoods:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['shopGoods:shopGoods:remove']"
          >删除</el-button>
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
    <!-- 添加或修改商品信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商ID" prop="supplierId">
              <el-input v-model="form.supplierId" placeholder="请输入供应商ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="form.supplierName" placeholder="请输入供应商名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品类别ID" prop="goodsTypeId">
              <el-input v-model="form.goodsTypeId" placeholder="请输入商品类别ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品编码" prop="goodsCode">
              <el-input v-model="form.goodsCode" placeholder="请输入商品编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="form.goodsName" placeholder="请输入商品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品条码" prop="goodsBarcode">
              <el-input v-model="form.goodsBarcode" placeholder="请输入商品条码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品规格" prop="goodsSearchstandard">
              <el-input v-model="form.goodsSearchstandard" placeholder="请输入商品规格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品颜色" prop="goodsColor">
              <el-input v-model="form.goodsColor" placeholder="请输入商品颜色" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属库位主键" prop="storageId">
              <el-input v-model="form.storageId" placeholder="请输入所属库位主键" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品重量(单位:千克)" prop="goodsWeight">
              <el-input v-model="form.goodsWeight" placeholder="请输入商品重量(单位:千克)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本价" prop="costPrice">
              <el-input v-model="form.costPrice" placeholder="请输入成本价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="零售价" prop="retailPrice">
              <el-input v-model="form.retailPrice" placeholder="请输入零售价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售价" prop="sellingPrice">
              <el-input v-model="form.sellingPrice" placeholder="请输入销售价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批发价" prop="wholesalePrice">
              <el-input v-model="form.wholesalePrice" placeholder="请输入批发价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本价锁定" prop="isCost">
              <el-input v-model="form.isCost" placeholder="请输入成本价锁定" />
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
import { listShopGoods, getShopGoods, delShopGoods, addShopGoods, updateShopGoods } from "@/api/shopGoods/shopGoods";

export default {
  name: "ShopGoods",
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
      // 商品信息表格数据
      shopGoodsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        supplierName: undefined,
        goodsTypeId: undefined,
        goodsCode: undefined,
        goodsName: undefined,
        goodsSearchstandard: undefined,
        goodsUnit: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "id不能为空", trigger: "blur" }
        ],
        supplierId: [
          { required: true, message: "供应商ID不能为空", trigger: "blur" }
        ],
        supplierName: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        goodsTypeId: [
          { required: true, message: "商品类别ID不能为空", trigger: "blur" }
        ],
        goodsCode: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        goodsName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        goodsSearchstandard: [
          { required: true, message: "商品规格不能为空", trigger: "blur" }
        ],
        goodsUnit: [
          { required: true, message: "商品单位【关联字典管理】不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品信息列表 */
    getList() {
      this.loading = true;
      listShopGoods(this.queryParams).then(response => {
        this.shopGoodsList = response.rows;
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
        supplierId: undefined,
        supplierName: undefined,
        goodsTypeId: undefined,
        goodsCode: undefined,
        goodsName: undefined,
        goodsBarcode: undefined,
        goodsSearchstandard: undefined,
        goodsColor: undefined,
        storageId: undefined,
        goodsUnit: undefined,
        goodsWeight: undefined,
        costPrice: undefined,
        retailPrice: undefined,
        sellingPrice: undefined,
        wholesalePrice: undefined,
        isCost: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        deptId: undefined
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
      this.title = "添加商品信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getShopGoods(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改商品信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateShopGoods(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addShopGoods(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除商品信息编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delShopGoods(ids);
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
      this.download('shopGoods/shopGoods/export', {
        ...this.queryParams
      }, `shopGoods_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
