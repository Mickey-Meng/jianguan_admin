<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="库位编码" prop="storageCode">
        <el-input
          v-model="queryParams.storageCode"
          placeholder="请输入库位编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库位名称" prop="storageName">
        <el-input
          v-model="queryParams.storageName"
          placeholder="请输入库位名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库位条码" prop="storageBarcode">
        <el-input
          v-model="queryParams.storageBarcode"
          placeholder="请输入库位条码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属库区" prop="reservoirId">
        <el-input
          v-model="queryParams.reservoirId"
          placeholder="请输入所属库区"
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
          v-hasPermi="['whStorage:whStorage:add']"
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
          v-hasPermi="['whStorage:whStorage:edit']"
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
          v-hasPermi="['whStorage:whStorage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['whStorage:whStorage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="whStorageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="库位(储位)设置id" align="center" prop="id" v-if="true"/>
      <el-table-column label="库位编码" align="center" prop="storageCode" />
      <el-table-column label="库位名称" align="center" prop="storageName" />
      <el-table-column label="库位条码" align="center" prop="storageBarcode" />
      <el-table-column label="所属库区" align="center" prop="reservoirId" />
      <el-table-column label="空库位标识(Y是 N否)" align="center" prop="isEmpty" />
      <el-table-column label="是否停用(0:正常 1:停用)" align="center" prop="isDisable" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['whStorage:whStorage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['whStorage:whStorage:remove']"
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

    <!-- 添加或修改库位(储位)设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="库位编码" prop="storageCode">
          <el-input v-model="form.storageCode" placeholder="请输入库位编码" />
        </el-form-item>
        <el-form-item label="库位名称" prop="storageName">
          <el-input v-model="form.storageName" placeholder="请输入库位名称" />
        </el-form-item>
        <el-form-item label="库位条码" prop="storageBarcode">
          <el-input v-model="form.storageBarcode" placeholder="请输入库位条码" />
        </el-form-item>
        <el-form-item label="所属库区" prop="reservoirId">
          <el-input v-model="form.reservoirId" placeholder="请输入所属库区" />
        </el-form-item>
        <el-form-item label="空库位" prop="isEmpty">
          <el-input v-model="form.isEmpty" placeholder="是否空库位" />
        </el-form-item>
        <el-form-item label="启用状态" prop="isDisable">
          <el-input v-model="form.isDisable" placeholder="启用状态" />
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
import { listWhStorage, getWhStorage, delWhStorage, addWhStorage, updateWhStorage } from "@/api/whStorage/whStorage";

export default {
  name: "WhStorage",
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
      // 库位(储位)设置表格数据
      whStorageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storageCode: undefined,
        storageName: undefined,
        storageBarcode: undefined,
        reservoirId: undefined,
        isEmpty: undefined,
        isDisable: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "库位(储位)设置id不能为空", trigger: "blur" }
        ],
        storageCode: [
          { required: true, message: "库位编码不能为空", trigger: "blur" }
        ],
        storageName: [
          { required: true, message: "库位名称不能为空", trigger: "blur" }
        ],
        reservoirId: [
          { required: true, message: "所属库区不能为空", trigger: "blur" }
        ],
        isEmpty: [
          { required: true, message: "空库位标识(Y是 N否)不能为空", trigger: "blur" }
        ],
        isDisable: [
          { required: true, message: "是否停用(0:正常 1:停用)不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询库位(储位)设置列表 */
    getList() {
      this.loading = true;
      listWhStorage(this.queryParams).then(response => {
        this.whStorageList = response.rows;
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
        storageCode: undefined,
        storageName: undefined,
        storageBarcode: undefined,
        reservoirId: undefined,
        isEmpty: "0",
        isDisable: "0",
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
      this.title = "添加库位(储位)设置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getWhStorage(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改库位(储位)设置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateWhStorage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addWhStorage(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除库位(储位)设置编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delWhStorage(ids);
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
      this.download('whStorage/whStorage/export', {
        ...this.queryParams
      }, `whStorage_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
