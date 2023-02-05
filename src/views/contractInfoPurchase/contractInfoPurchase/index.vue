<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同编码" prop="contractCode">
        <el-input
          v-model="queryParams.contractCode"
          placeholder="请输入合同编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同名称" prop="contractName">
        <el-input
          v-model="queryParams.contractName"
          placeholder="请输入合同名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierName">
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="总金额" prop="amount">
              <el-input
                v-model="queryParams.amount"
                placeholder="请输入总金额"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="合同签订时间" prop="contactDate">
              <el-date-picker clearable
                v-model="queryParams.contactDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择合同签订时间">
              </el-date-picker>
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
          v-hasPermi="['contractInfoPurchase:contractInfoPurchase:add']"
        >新增
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
          v-hasPermi="['contractInfoPurchase:contractInfoPurchase:edit']"
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
          v-hasPermi="['contractInfoPurchase:contractInfoPurchase:remove']"
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
          v-hasPermi="['contractInfoPurchase:contractInfoPurchase:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contractInfoPurchaseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="合同id" align="center" prop="id" v-if="false"/>
      <el-table-column label="合同编码" align="center" prop="contractCode"/>
      <el-table-column label="合同名称" align="center" prop="contractName"/>
      <el-table-column label="供应商名称" align="center" prop="supplierName"/>
      <el-table-column label="总金额" align="center" prop="amount"/>
      <el-table-column label="合同签订时间" align="center" prop="contactDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.contactDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['contractInfoPurchase:contractInfoPurchase:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['contractInfoPurchase:contractInfoPurchase:remove']"
          >删除
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

    <!-- 添加或修改采购合同 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同编码" prop="contractCode">
              <el-input v-model="form.contractCode" placeholder="请输入合同编码"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="contractName">
              <el-input v-model="form.contractName" placeholder="请输入合同名称"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-autocomplete
                style="width: 100%"
                v-model="form.supplierName"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入供应商名称"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="供应商id" prop="supplierId">
              <el-input v-model="form.supplierId" placeholder="请输入供应商id"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总金额" prop="amount">
              <el-input v-model="form.amount" placeholder="请输入总金额"/>
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="合同是否已签订" prop="contractStatus">
              <el-select v-model="form.contractStatus" placeholder="请选择合同是否已签订">
                <el-option
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="合同签订时间" prop="contactDate">
              <el-date-picker clearable
                              v-model="form.contactDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择合同签订时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税率" prop="rate">
              <el-input v-model="form.rate" placeholder="请输入税率"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附件地址">
              <el-upload

                multiple
                class="upload-demo"
                :action="uploadFileUrl"
                :before-upload="handleBeforeUpload"
                :file-list="fileList"
                :limit="limit"
                :on-error="handleUploadError"
                :on-exceed="handleExceed"
                :on-success="handleUploadSuccess"
                :on-preview="handlePreview"
                :show-file-list="true"
                :on-remove="handleDeleteFile"
                :before-remove="beforeRemove"
                :headers="headers"
                ref="fileUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png/excel/word文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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
  listContractInfoPurchase,
  getContractInfoPurchase,
  delContractInfoPurchase,
  addContractInfoPurchase,
  updateContractInfoPurchase
} from "@/api/contractInfoPurchase/contractInfoPurchase";
import {getToken} from "@/utils/auth";

import {listBasisSupplier} from "@/api/basisSupplier/basisSupplier";
import { delOss } from "@/api/system/oss";

export default {
  name: "ContractInfoPurchase",
  dicts: ['sys_yes_no'],
  props: {
    // 值
    value: [String, Object, Array],
    // 数量限制
    limit: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 10,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["doc","docx", "xls", "ppt", "txt", "pdf","png","jpg","jpeg","xlsx"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      number: 0,
      uploadList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/system/oss/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
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
      // 采购合同 表格数据
      contractInfoPurchaseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractCode: undefined,
        contractName: undefined,
        supplierName: undefined,
        amount: undefined,
        contactDate: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          {required: true, message: "合同id不能为空", trigger: "blur"}
        ],
        contractCode: [
          {required: true, message: "合同编码不能为空", trigger: "blur"}
        ],
        contractName: [
          {required: true, message: "合同名称不能为空", trigger: "blur"}
        ],
        supplierName: [
          {required: true, message: "供应商名称不能为空", trigger: "blur,change"}
        ],
        amount: [
          {required: true, message: "总金额不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询采购合同 列表 */
    getList() {
      this.loading = true;
      listContractInfoPurchase(this.queryParams).then(response => {
        this.contractInfoPurchaseList = response.rows;
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
        contractCode: undefined,
        contractName: undefined,
        contractStatus: undefined,
        supplierName: undefined,
        supplierId: undefined,
        amount: undefined,
        contactDate: undefined,
        rate: undefined,
        fj: undefined,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加采购合同 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.fileList = [];
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getContractInfoPurchase(id).then(response => {


        this.loading = false;
        this.form = response.data;
        console.log(response.data)
        if (response.data.fj != ""&&response.data.fj != undefined) {
          this.fileList = JSON.parse(response.data.fj);
        }
        this.open = true;
        this.title = "修改采购合同 ";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.fj = JSON.stringify(this.fileList);
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateContractInfoPurchase(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addContractInfoPurchase(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除采购合同 编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delContractInfoPurchase(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
          return false;
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      this.$modal.loading("正在上传文件，请稍候...");
      this.number++;
      return true;
    },

    // 上传失败
    handleUploadError(err) {
      this.$modal.msgError("上传图片失败，请重试");
      this.$modal.closeLoading();
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.uploadList.push({name: res.data.fileName, url: res.data.url, ossId: res.data.ossId});
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除文件
    handleDeleteFile(index) {

      delOss(index.ossId);
      this.fileList = this.fileList.filter(t => t.uid !== index.uid);
      this.$emit("input", this.listToString(this.fileList));
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.number = 0;
        this.$emit("input", this.listToString(this.fileList));
        this.$modal.closeLoading();
      }
    },
    // 获取文件名称
    getFileName(name) {
      // 如果是url那么取最后的名字 如果不是直接返回
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1);
      } else {
        return name;
      }
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        strs += list[i].ossId + separator;
      }
      return strs != "" ? strs.substr(0, strs.length - 1) : "";
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('contractInfoPurchase/contractInfoPurchase/export', {
        ...this.queryParams
      }, `contractInfoPurchase_${new Date().getTime()}.xlsx`)
    },


    /*
    *    **/
    querySearchAsync(queryString, cb) {
      const queryParams = {
        supplierName: queryString,
      };
      let flag = false;
      listBasisSupplier(queryParams).then(response => {
        flag = true;
        if (response.rows.length) {
          const d = response.rows.map(item => {
            return {
              value: item.supplierName,
              label: item.id,
              item: {
                supplierId: item.id,
              }
            };
          });
          cb(d);
        } else {
          cb([]);
        }
      }).finally(() => {
        if (!flag) {
          cb([]);
        }
      });

    },

    handleSelect(item) {
      this.form.supplierId = item.item.supplierId;
      console.log(item);
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
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
    ,

  }
};
</script>
