<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="名称" prop="supplierName">
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="contactPerson">
        <el-input
          v-model="queryParams.contactPerson"
          placeholder="请输入联系人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobilePhone">
        <el-input
          v-model="queryParams.mobilePhone"
          placeholder="请输入手机"
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
          v-hasPermi="['basisSupplier:basisSupplier:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-view"
          size="mini"
          :disabled="single"
          @click="handleDetail"
        >详情
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basisSupplier:basisSupplier:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basisSupplier:basisSupplier:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basisSupplier:basisSupplier:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="basisSupplierList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="供应商管理id" align="center" prop="id" v-if="false"/>
      <el-table-column label="供应商名称" align="center" prop="supplierName" width="300"/>
      <el-table-column label="联系人" align="center" prop="contactPerson"/>
      <el-table-column label="手机" align="center" prop="mobilePhone"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basisSupplier:basisSupplier:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basisSupplier:basisSupplier:remove']"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleContract(scope.row)"
          >查看合同
          </el-button>
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

    <!-- 添加或修改供应商管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <!--          <el-col :span="12">
                  <el-form-item label="单位关联主键" prop="warehouseId">
                    <el-input v-model="form.warehouseId" placeholder="请输入单位关联主键" />
                  </el-form-item>
                    </el-col>-->
<!--          <el-col :span="12">
            <el-form-item label="供应商编码" prop="supplierCode">
              <el-input v-model="form.supplierCode" placeholder="请输入供应商编码"/>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="form.supplierName" placeholder="请输入供应商名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="请输入联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="telephone">
              <el-input v-model="form.telephone" placeholder="请输入电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" prop="mobilePhone">
              <el-input v-model="form.mobilePhone" placeholder="请输入手机"/>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱"/>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照" prop="fj">
              <image-upload v-model="form.fj" ></image-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm" v-if="edit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listBasisSupplier,
  getBasisSupplier,
  delBasisSupplier,
  addBasisSupplier,
  updateBasisSupplier
} from "@/api/basisSupplier/basisSupplier";
import {checkFileSize, checkFileType, listOssIdToString} from "@/utils/upload";
import {delOss} from "@/api/system/oss";

export default {
  name: "BasisSupplier",
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
      // 供应商管理表格数据
      basisSupplierList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否编辑 true　修改true 查看详情false  add for detail 20230516
      edit: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        supplierName: undefined,
        contactPerson: undefined,
        mobilePhone: undefined,
        payed: undefined,
        unpaid: undefined,
        invoiceAmount: undefined,
        uninvoiceAmount: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {


        supplierName: [
          {required: true, message: "供应商名称不能为空", trigger: "blur"}
        ],
        contactPerson: [
          {required: true, message: "联系人不能为空", trigger: "blur"}
        ],
        mobilePhone: [
          {required: true, message: "手机不能为空", trigger: "blur"}
        ],

      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询供应商管理列表 */
    getList() {
      this.loading = true;
      listBasisSupplier(this.queryParams).then(response => {
        this.basisSupplierList = response.rows;
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
        warehouseId: undefined,
        supplierName: undefined,
        contactPerson: undefined,
        telephone: undefined,
        mobilePhone: undefined,
        email: undefined,
        address: undefined,
        supplierLevel: undefined,
        invoiceLookedUp: undefined,
        invoiceTax: undefined,
        invoiceType: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        deptId: undefined,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.edit = true;
      this.title = "添加供应商管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.edit = true;
      this.reset();
      const id = row.id || this.ids
      getBasisSupplier(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改供应商管理";
      });
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.edit = false;
      this.reset();
      const id = row.id || this.ids
      getBasisSupplier(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "查看供应商管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateBasisSupplier(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addBasisSupplier(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除供应商管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delBasisSupplier(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 查看合同按钮操作 */
    handleContract(row) {
      // 跳转到报表页面
      // this.$router.push("/contractInfoPurchase?pageNum=1&pageSize=10&supplierName=" + row.supplierName);
      this.$router.push({
        path:'/glycontract/contractInfoPurchase',
        query: {
          supplierName: row.supplierName
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basisSupplier/basisSupplier/export', {
        ...this.queryParams
      }, `basisSupplier_${new Date().getTime()}.xlsx`)
    },
    /************************* 上传相关 **************************** */
    checkFileSuffix(projectPicUrl) {
      if (projectPicUrl !== undefined) {
        let fileSuffix = projectPicUrl.substring(projectPicUrl.lastIndexOf('.') + 1 );
        return this.allowFileTypes.some(type => {
          return fileSuffix.indexOf(type) > -1;
        });
      }
      return false;
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      let isTypePass = checkFileType(file, this.allowFileTypes);
      // 校检文件大小
      let isSizePass = checkFileSize(file, this.allowMaxFileSize);
      console.log("isTypePass:" + isTypePass + " | isSizePass:" + isSizePass);
      if (isTypePass && isSizePass) {
        this.fileNumber++;
        this.$modal.loading("正在上传文件，请稍候...");
      }
      return isTypePass && isSizePass;
    },

    // 上传失败
    handleUploadError(err) {
      this.$modal.msgError("上传图片失败，请重试");
      this.$modal.closeLoading();
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      console.log("upload->handleUploadSuccess...");
      console.log(res);
      if (res.code === 200) {
        this.uploadList.push({name: res.data.fileName, url: res.data.url, ossId: res.data.ossId});
        this.uploadedSuccessfully();
      } else {
        this.fileNumber--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除文件
    handleDeleteFile(data) {
      console.log("upload->handleDeleteFile...");
      console.log(data);
      delOss(data.ossId);
      this.fileList = this.fileList.filter(t => t.uid !== data.uid);
      let ossIds = listOssIdToString(this.fileList);
      this.$emit("input", ossIds);
      this.from.projectPic = ossIds;
      this.fileNumber--;
      if (this.fileNumber === 0) {
        this.isDisabled = false;
      }
    },
    // 上传结束处理
    uploadedSuccessfully() {
      console.log("upload->uploadedSuccessfully...");
      console.log("fileNumber:" + this.fileNumber + " | uploadList.length:" + this.uploadList.length);
      if (this.fileNumber > 0 && this.uploadList.length === this.fileNumber) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.fileNumber = 0;
        let ossIds = listOssIdToString(this.fileList);
        this.$emit("input", ossIds);
        this.form.projectPic = ossIds;
        this.isDisabled = true;
        this.$modal.closeLoading();
      } else {
        $modal.msgError(`最多上传${this.fileLimit}个文件!`);
      }
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      this.$download.oss(file.ossId)
    },
    handleExceed(files, fileList) {
      console.log(files);
      console.log(fileList);
      this.$message.warning(`当前限制可上传 ${this.fileLimit}个文件，当前已上传 ${files.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>
