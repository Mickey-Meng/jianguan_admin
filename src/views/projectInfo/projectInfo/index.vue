<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
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
          v-hasPermi="['projectInfo:projectInfo:add']"
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
          v-hasPermi="['projectInfo:projectInfo:edit']"
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
          v-hasPermi="['projectInfo:projectInfo:remove']"
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
          v-hasPermi="['projectInfo:projectInfo:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="projectInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="id" v-if="false"/>
      <el-table-column label="项目名称" align="center" prop="projectName"/>

      <el-table-column label="项目类型" align="center" prop="projectType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.project_type" :value="scope.row.projectType"/>
        </template>
      </el-table-column>

      <el-table-column label="项目工期(天)" align="center" prop="projectDays"/>
      <el-table-column label="开工日期" align="center" prop="projectStartDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.projectStartDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,false)"
            v-hasPermi="['projectInfo:projectInfo:query']"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,true)"
            v-hasPermi="['projectInfo:projectInfo:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['projectInfo:projectInfo:remove']"
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

    <!-- 添加或修改项目信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">

<!--          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-autocomplete
                style="width: 100%"
                v-model="form.customerName"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入客户名称"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="form.projectName" placeholder="请输入项目名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目类型" prop="projectType">
              <el-select v-model="form.projectType" placeholder="请选择项目类型">
                <el-option
                  v-for="dict in dict.type.project_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

<!--          <el-col :span="12">
            <el-form-item label="项目金额" prop="projectAmount">
              <el-input v-model="form.projectAmount" placeholder="请输入项目金额"/>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="项目简述" prop="projectResume">
              <el-input v-model="form.projectResume" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目描述" prop="projectDistribute">
              <el-input v-model="form.projectDistribute" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="项目开工日期" prop="projectStartDate">
              <el-date-picker clearable
                              v-model="form.projectStartDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="请选择项目开工日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目工期(天)" prop="projectDays">
              <el-input v-model="form.projectDays" placeholder="请输入项目工期(天)"/>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">
            <el-form-item label="宣传图" prop="photo">
              <el-input v-model="form.photo" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>-->
<!--          <el-col :span="12">
            <el-form-item label="项目所属地区" prop="area">
              <el-cascader
                v-model="form.area_code"
                size="mini"
                :options="options"
                filterable
                clearable
                style="width: 100%;"
                @change="handleChange"
              />
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

            &lt;!&ndash;            <el-form-item label="附件" prop="fj">&ndash;&gt;
            &lt;!&ndash;              <el-input v-model="form.fj" type="textarea" placeholder="请输入内容"/>&ndash;&gt;
            &lt;!&ndash;            </el-form-item>&ndash;&gt;
            &lt;!&ndash;            &ndash;&gt;


          </el-col>-->
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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
<style lang="scss">
.el-input--mini .el-input__inner {
  height: 36px;
  line-height: 28px;
}
</style>


<script>
import {
  listProjectInfo,
  getProjectInfo,
  delProjectInfo,
  addProjectInfo,
  updateProjectInfo
} from "@/api/projectInfo/projectInfo";
import {listBasisCustomer} from "@/api/basisCustomer/basisCustomer";
import formValidate from "@/plugins/formValidate/formValidate";
import {getToken} from "@/utils/auth";
import {regionData, CodeToText, TextToCode} from 'element-china-area-data'
import {delOss} from "@/api/system/oss";

export default {
  name: "ProjectInfo",
  dicts: ['sys_user_sex', 'project_type'],
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
  data() {
    return {
      // 按钮loading
      uploadList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/system/oss/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },

      buttonLoading: false,

      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      fileList: [],
      // 非多个禁用
      options: regionData,
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      number: 0,
      // 项目信息表格数据
      projectInfoList: [],
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
        customerName: undefined,
        projectName: undefined,
        deptId: undefined,
        area: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          {required: true, message: "id不能为空", trigger: "blur"}
        ],
        projectName: [
          {required: true, message: "项目名称不能为空", trigger: "blur"}
        ],
        projectDays: [
          {
            'validator': formValidate.checkNumberIsNotZero(),
            'trigger': ['change', 'blur'],
          }
        ],

        area: [
          {required: true, message: "项目所属地区不能为空", trigger: "change"}
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询项目信息列表 */
    getList() {
      this.loading = true;
      listProjectInfo(this.queryParams).then(response => {
        this.projectInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
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
        customerId: undefined,
        customerName: undefined,
        projectName: undefined,
        projectAmount: undefined,
        projectResume: undefined,
        projectDistribute: undefined,
        photo: undefined,
        fj: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        deptId: undefined,
        area_code: [],
        area: undefined
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      this.$download.oss(file.ossId)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.edit = true;
      this.open = true;
      this.title = "添加项目信息";
    },
    handleExceed(files, fileList) {
      console.log(files);
      console.log(fileList);
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    /** 修改按钮操作 */
    handleUpdate(row,isEdit) {
      this.loading = true;
      this.edit = isEdit;
      this.reset();
      const id = row.id || this.ids
      getProjectInfo(id).then(response => {

        this.loading = false;
        this.form = response.data;
        if (response.data.area != undefined) {
          console.log(response.data.area)
          this.form.area_code = response.data.area.split(",");
          console.log(this.form.area_code)
        }
        if (response.data.fj != "" && response.data.fj != null && response.data.fj != undefined) {
          this.fileList = JSON.parse(response.data.fj);
        }
        this.open = true;
        this.title = "修改项目信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        this.form.fj = JSON.stringify(this.fileList);
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateProjectInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addProjectInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除项目信息编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delProjectInfo(ids);
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
      this.download('projectInfo/projectInfo/export', {
        ...this.queryParams
      }, `projectInfo_${new Date().getTime()}.xlsx`)
    }

    ,


    /*
  *    **/
    querySearchAsync(queryString, cb) {
      const queryParams = {
        customerName: queryString,
      };
      let flag = false;
      listBasisCustomer(queryParams).then(response => {
        flag = true;
        if (response.rows.length) {
          const d = response.rows.map(item => {
            return {
              value: item.customerName,
              label: item.id,
              item: {
                id: item.id,
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
    handleChange(value) {
      console.log(value);
      if (value == undefined) {
        return;
      }
      this.form.area = value.toString();
    },

    handleSelect(item) {
      this.form.customerId = item.item.id;
      console.log(item);
    },
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
      console.log(res);
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


  }
};
</script>
