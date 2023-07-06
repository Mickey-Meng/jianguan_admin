<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6" :xs="24">
        <el-table :header-cell-style="headercellStyle"
                  :cell-style="cellStyle" v-loading="qsloading" :data="measurementNoList" @row-click="rowQsClick">
          <el-table-column label="ID" align="center" prop="id" v-if="false"/>
          <el-table-column label="期数" align="center" prop="name" min-width="120" :show-overflow-tooltip="true"/>
          <el-table-column label="状态" align="center" prop="status" min-width="30">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.data_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item label="标段编号" prop="bdbh">
            <el-input
              v-model="queryParams.bdbh"
              placeholder="请输入标段编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="计量期次" prop="jlqsbh">
            <el-input
              v-model="queryParams.jlqsbh"
              placeholder="请输入计量期次"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item> -->
          <el-form-item label="申请编号" prop="sqbh">
            <el-input
              v-model="queryParams.sqbh"
              placeholder="请输入申请编号"
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
              v-hasPermi="['otherPayment:otherPayment:add']"
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
              v-hasPermi="['otherPayment:otherPayment:edit']"
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
              v-hasPermi="['otherPayment:otherPayment:remove']"
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
              v-hasPermi="['otherPayment:otherPayment:export']"
            >导出
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :header-cell-style="headercellStyle"
                  :cell-style="cellStyle" :data="otherPaymentList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="ID" align="center" prop="id" v-if="false"/>
          <!-- <el-table-column label="标段编号" align="center" prop="bdbh" /> -->
          <!-- <el-table-column label="计量期次" align="center" prop="jlqsbh" /> -->
          <el-table-column label="申请编号" align="center" prop="sqbh"/>
          <el-table-column label="申请日期" align="center" prop="sqsj" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.sqsj, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属单位" align="center" prop="ssdw" v-if="false"/>

          <el-table-column prop="kxlx" label="款项类型" width="80">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.mea_kxlx" :value="scope.row.kxlx"/>
            </template>
          </el-table-column>

          <el-table-column label="款项金额" align="center" prop="kxje"/>
          <el-table-column label="备注" align="center" prop="remark"/>


          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['otherPayment:otherPayment:edit']"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['otherPayment:otherPayment:remove']"
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
      </el-col>
    </el-row>


    <!-- 添加或修改其他款项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标段编号" prop="bdbh">
              <el-input v-model="form.bdbh" placeholder="请输入标段编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期次编号" prop="jlqsbh">
              <el-select v-model="form.jlqsbh" placeholder="请选择期次">
                <el-option
                  v-for="item in jlqsbhOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请编号" prop="sqbh">
              <el-input v-model="form.sqbh" placeholder="请输入申请编号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请日期" prop="sqsj">
              <el-date-picker clearable
                              v-model="form.sqsj"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择申请日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属单位" prop="ssdw">
              <el-input v-model="form.ssdw" placeholder="请输入所属单位"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="款项类型" prop="kxlx">
              <el-select v-model="form.kxlx" placeholder="请选择款项类型">
                <el-option
                  v-for="dict in dict.type.mea_kxlx"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="款项金额" prop="kxje">
              <el-input v-model="form.kxje" placeholder="请输入款项金额"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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

                ref="fileUpload">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png/excel/word文件，且不超过500kb</div>
              </el-upload>
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
  listOtherPayment,
  getOtherPayment,
  delOtherPayment,
  addOtherPayment,
  updateOtherPayment
} from "@/api/otherPayment/otherPayment";
import {getToken} from "@/utils/auth";
import {delOss} from "@/api/system/oss";
import {listMeasurementListNo} from "@/api/measurementNo/measurementNo";
import {dealNumberFormat} from "@/utils/utils.js";

export default {
  name: "OtherPayment",
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
      default: () => ["doc", "docx", "xls", "ppt", "txt", "pdf", "png", "jpg", "jpeg", "xlsx"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  dicts: ['data_status', 'mea_kxlx'],
  data() {
    return {
      // 中间计量期数管理表格数据
      measurementNoList: [],
      number: 0,
      uploadList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/system/oss/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
      // 遮罩层
      qsloading: true,
      jlqsbhOptions: [],
      //选中期数
      xzQsId: "",
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
      // 其他款项表格数据
      otherPaymentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bdbh: undefined,
        jlqsbh: undefined,
        sqbh: undefined,
        sqsj: undefined,
        ssdw: undefined,
        kxlx: undefined,
        kxje: undefined,
        fj: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          {required: true, message: "ID不能为空", trigger: "blur"}
        ],
        bdbh: [
          {required: true, message: "标段编号不能为空", trigger: "blur"}
        ],
        jlqsbh: [
          {required: true, message: "计量期次不能为空", trigger: "blur"}
        ],
        sqbh: [
          {required: true, message: "申请编号不能为空", trigger: "blur"}
        ],
        sqsj: [
          {required: true, message: "申请日期不能为空", trigger: "blur"}
        ],
        ssdw: [
          {required: true, message: "所属单位不能为空", trigger: "blur"}
        ],
        kxlx: [
          {required: true, message: "款项类型不能为空", trigger: "blur"}
        ],
        kxje: [
          {required: true, message: "款项金额不能为空", trigger: "blur"}
        ],
        fj: [
          {required: true, message: "附件不能为空", trigger: "blur"}
        ],
        status: [
          {required: true, message: "状态不能为空", trigger: "blur"}
        ],
      },
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
      dealNumberFormat
    };
  },
  created() {
    this.getList();
    this.getPeriodsList();
  },
  methods: {
    /** 查询其他款项列表 */
    getList() {
      this.loading = true;
      listOtherPayment(this.queryParams).then(response => {
        this.otherPaymentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询中间计量期数管理列表 */
    getPeriodsList() {
      this.qsloading = true;
      listMeasurementListNo().then(response => {
        this.measurementNoList = response.data;
        this.qsloading = false;
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
        bdbh: undefined,
        jlqsbh: undefined,
        sqbh: undefined,
        sqsj: undefined,
        ssdw: undefined,
        kxlx: undefined,
        kxje: undefined,
        fj: undefined,
        status: "0",
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    rowQsClick(record, index) {
      this.xzQsId = record.id;
      this.queryParams.jlqsbh = record.id;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
      this.$download.oss(file.ossId)
      // location.href = file.url;
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
      this.fileList = [];
      listMeasurementListNo().then(response => {
        this.jlqsbhOptions = response.data;
      });
      this.reset();
      this.open = true;
      this.title = "添加其他款项";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.fileList = [];
      listMeasurementListNo().then(response => {
        this.jlqsbhOptions = response.data;
      });
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getOtherPayment(id).then(response => {
        this.loading = false;
        this.form = response.data;

        if (response.data.fj != "") {
          this.fileList = JSON.parse(response.data.fj);
        }

        this.open = true;
        this.title = "修改其他款项";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {

        this.form.fj = JSON.stringify(this.fileList);
        if (valid) {

          if (this.xzQsId == "") {
            this.$modal.confirm("请选择期数");
          }
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateOtherPayment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            if (this.xzQsId == "") {
              this.$modal.confirm("请选择期数");
            }
            addOtherPayment(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
          this.fileList = [];
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除其他款项编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delOtherPayment(ids);
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
      this.download('otherPayment/otherPayment/export', {
        ...this.queryParams
      }, `otherPayment_${new Date().getTime()}.xlsx`)
    }, handleBeforeUpload(file) {
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
      console.log(index);
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
  }
};
</script>
