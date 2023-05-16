<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="公司名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入公司名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司编码" prop="companyCode">
        <el-input
          v-model="queryParams.companyCode"
          placeholder="请输入公司编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位类型" prop="typeName">
        <el-input
          v-model="queryParams.typeName"
          placeholder="请输入单位类型"
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
          v-hasPermi="['jg:company:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-view"
          size="mini"
          :disabled="single"
          @click="handleDetail"
        >详情</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['jg:company:edit']"
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
          v-hasPermi="['jg:company:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['jg:company:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="companyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="" align="center" prop="id" v-if="true"/>
      <el-table-column label="公司名称" align="center" prop="companyName" />
      <el-table-column label="公司编码" align="center" prop="companyCode" />
      <el-table-column label="单位类型" align="center" prop="typeName" />
      <el-table-column label="类型编码" align="center" prop="typeCode" />
      <el-table-column label="法人" align="center" prop="legalPerson" />
      <el-table-column label="联系方式" align="center" prop="legalPhone" />
      <el-table-column label="基础信息" align="center" prop="baseData" />
      <el-table-column label="税号" align="center" prop="dutyNum" />
      <el-table-column label="附件" align="center" prop="enclosure" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jg:company:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['jg:company:remove']"
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

    <!-- 添加或修改公司信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-row :gutter="20">
<el-col :span="12">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="公司编码" prop="companyCode">
          <el-input v-model="form.companyCode" placeholder="请输入公司编码" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="单位类型" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入单位类型" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="单位类型编码" prop="typeCode">
          <el-input v-model="form.typeCode" placeholder="请输入单位类型编码" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="法人" prop="legalPerson">
          <el-input v-model="form.legalPerson" placeholder="请输入法人" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="法人联系方式" prop="legalPhone">
          <el-input v-model="form.legalPhone" placeholder="请输入法人联系方式" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="公司基础信息" prop="baseData">
          <el-input v-model="form.baseData" placeholder="请输入公司基础信息" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="税号" prop="dutyNum">
          <el-input v-model="form.dutyNum" placeholder="请输入税号" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="附件" prop="enclosure">
          <el-input v-model="form.enclosure" placeholder="请输入附件" />
        </el-form-item>
</el-col><el-col :span="12">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
</el-col>          </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm" v-if="edit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCompany, getCompany, delCompany, addCompany, updateCompany } from "@/api/jianguan/company/company";

export default {
  name: "Company",
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
      // 公司信息表格数据
      companyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否编辑 true　修改true 查看详情false
      edit: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: undefined,
        companyCode: undefined,
        typeName: undefined,
        typeCode: undefined,
        legalPerson: undefined,
        legalPhone: undefined,
        baseData: undefined,
        dutyNum: undefined,
        enclosure: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        companyCode: [
          { required: true, message: "公司编码不能为空", trigger: "blur" }
        ],
        typeName: [
          { required: true, message: "单位类型不能为空", trigger: "blur" }
        ],
        typeCode: [
          { required: true, message: "单位类型编码不能为空", trigger: "blur" }
        ],
        legalPerson: [
          { required: true, message: "法人不能为空", trigger: "blur" }
        ],
        legalPhone: [
          { required: true, message: "法人联系方式不能为空", trigger: "blur" }
        ],
        baseData: [
          { required: true, message: "公司基础信息不能为空", trigger: "blur" }
        ],
        dutyNum: [
          { required: true, message: "税号不能为空", trigger: "blur" }
        ],
        enclosure: [
          { required: true, message: "附件不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公司信息列表 */
    getList() {
      this.loading = true;
      listCompany(this.queryParams).then(response => {
        this.companyList = response.rows;
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
        companyName: undefined,
        companyCode: undefined,
        typeName: undefined,
        typeCode: undefined,
        legalPerson: undefined,
        legalPhone: undefined,
        baseData: undefined,
        dutyNum: undefined,
        enclosure: undefined,
        remark: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
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
      this.edit = true;
      this.title = "添加公司信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.edit = true;
      this.reset();
      const id = row.id || this.ids
      getCompany(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改公司信息";
      });
    },
    
    /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.edit = false;
      this.reset();
      const id = row.id || this.ids
      getCompany(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "查看公司信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateCompany(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addCompany(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除公司信息编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delCompany(ids);
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
      this.download('system/company/export', {
        ...this.queryParams
      }, `company_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
