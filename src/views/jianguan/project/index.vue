<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--项目树列表-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="projectName"
            placeholder="请输入项目名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="info"
                plain
                icon="el-icon-sort"
                size="mini"
                @click="toggleExpandAll"
              >展开/折叠</el-button>
            </el-col>
          </el-row>

          <el-tree
            v-if="refreshTable"
            :data="projectTreeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            :default-expand-all="isExpandAll"
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>

      <!--关联的子项目数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="queryParams.projectName"
              placeholder="请输入项目名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="项目类型" prop="projectType">
            <el-select
              v-model="queryParams.projectType"
              placeholder="项目类型"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="dict in dict.type.jg_project_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="项目状态"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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
              @click="handleAdd()"
              v-hasPermi="['jg:project:add']"
            >新增</el-button>
          </el-col>
          
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['jg:project:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['jg:project:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="projectInfoList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="项目名称" align="center" prop="projectName" :show-overflow-tooltip="true" width="100"/>
          <el-table-column label="项目编码" align="center" prop="projectCode" />
          <el-table-column label="项目区域" align="center" prop="projectArea" >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.jg_project_area" :value="scope.row.projectArea"/>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status" >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="是否显示" align="center" prop="visible" >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_show_hide" :value="scope.row.visible"/>
            </template>
          </el-table-column>
          <el-table-column label="组织机构" align="center" prop="groupId" :show-overflow-tooltip="true"/>
          <el-table-column label="是否自管" align="center" prop="isAuto" >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.jg_yes_no" :value="scope.row.isAuto"/>
            </template>
          </el-table-column>
          <el-table-column label="项目照片" align="center" prop="projectPic" >
            <template slot-scope="scope">
              <el-image
                v-if="checkFileSuffix(scope.row.projectPic)"
                style="width: 100px; height: 100px;"
                :src="scope.row.url"
                :preview-src-list="[scope.row.projectPic]"/>
              <span v-text="scope.row.projectPic"
                    v-if="!checkFileSuffix(scope.row.projectPic)"/>
            </template>
          </el-table-column>

          <el-table-column label="合同号" align="center" prop="contractNum" />
          <el-table-column label="坐标" align="center" prop="coordinate" />
          <el-table-column label="投资金额" align="center" prop="investment" />
          <el-table-column label="项目类型" align="center" prop="projectType" >
            <template slot-scope="scope">
              <dict-tag :options="dict.type.jg_project_type" :value="scope.row.projectType"/>
            </template>
          </el-table-column>
          <el-table-column label="项目点" align="center" prop="projectPoint" :show-overflow-tooltip="true"/>
          <el-table-column label="项目线" align="center" prop="projectLine" />
          <el-table-column label="项目面" align="center" prop="projectSurface" />
          <el-table-column label="项目简介" align="center" prop="introduction" :show-overflow-tooltip="true" />
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column label="操作" align="center" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['jg:project:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['jg:project:remove']"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleRelatedDept(scope.row)"
                v-hasPermi="['jg:project:related']"
              >关联部门</el-button>
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

    <!-- 添加或修改项目信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="form.projectName" placeholder="请输入项目名称" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="项目编码" prop="projectCode">
                <el-input v-model="form.projectCode" placeholder="请输入项目编码" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目上级" prop="parentId">
                <treeselect
                  :multiple="false"
                  :searchable="true"
                  v-model="form.parentId"
                  :options="projectTreeOptions"
                  :normalizer="normalizer"
                  :show-count="true"
                  placeholder="选择项目上级"
                />
              </el-form-item>
            </el-col>
            
            <el-col :span="12">
              <el-form-item label="项目区域">
                <el-select v-model="form.projectArea" placeholder="请选项目区域">
                  <el-option
                    v-for="dict in dict.type.jg_project_area"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目类型">
                <el-select v-model="form.projectType" placeholder="请选择项目类型">
                  <el-option
                    v-for="dict in dict.type.jg_project_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="显示状态" prop="visible">
                <el-radio-group v-model="form.visible">
                  <el-radio
                    v-for="dict in dict.type.sys_show_hide"
                    :key="dict.value"
                    :label="dict.value"
                  >
                    {{dict.label}}
                  </el-radio>
              </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="是否自管" prop="isAuto">
                <el-radio-group v-model="form.isAuto">
                  <el-radio
                    v-for="dict in dict.type.jg_yes_no"
                    :key="dict.value"
                    :label="dict.value"
                  >
                    {{dict.label}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="合同号" prop="contractNum">
                <el-input v-model="form.contractNum" placeholder="请输入合同号" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="坐标" prop="coordinate">
                <el-input v-model="form.coordinate" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="投资金额(元)" prop="investment">
                <el-input-number v-model="form.investment" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="项目点" prop="projectPoint">
                <el-input v-model="form.projectPoint" placeholder="请输入项目点" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目线" prop="projectLine">
                <el-input v-model="form.projectLine" placeholder="请输入项目线" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="项目面" prop="projectSurface">
                <el-input v-model="form.projectSurface" placeholder="请输入项目面" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="项目简介" prop="introduction">
                  <el-input v-model="form.introduction" type="textarea" placeholder="请输入内容" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="组织机构" prop="groupId">
                  <treeselect
                    :multiple="false"
                    :searchable="true"
                    v-model="form.groupId"
                    :options="deptTreeOptions"
                    :normalizer="deptNormalizer"
                    :show-count="true"
                    placeholder="选择组织机构"
                  />
                </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="项目照片">
                <el-upload
                  multiple
                  class="upload-demo"
                  :action="uploadFileUrl"
                  :before-upload="handleBeforeUpload"
                  :file-list="fileList"
                  :limit="fileLimit"
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
                  <el-button size="small" type="primary"  :disabled ="isDisabled">点击上传</el-button>
                   <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
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
    <!-- 关联部门列表-->
    <related-project-dept :project="currentProject" ref="relatedProjectDept" @ok="doRelatedDept" />
  </div>
</template>

<script>
import { getProjectTree, listPageProjectInfo, listProjectInfo, getProjectInfo, delProjectInfo, addProjectInfo, updateProjectInfo } from "@/api/jianguan/project/project";
import { listDept } from "@/api/system/dept";
import { delOss } from "@/api/system/oss";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";
import { checkFileType, checkFileSize, getFileName, listOssIdToString } from "@/utils/upload";
import relatedProjectDept from "./relatedProjectDept";

export default {
  name: "jgProject",
  components: { Treeselect, relatedProjectDept },
  dicts: ['sys_show_hide', 'sys_normal_disable','jg_project_area','jg_project_type', 'jg_yes_no'],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: false,

      // 项目树选项
      projectTreeData: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      },
      //项目下拉树
      projectTreeOptions: [],
      // 部门下拉树
      deptTreeOptions: [],
      // 当前操作的项目ID
      currentProject: undefined,
      /**************************** */
      //上传后的文件列表
      fileList: [],
      // 允许的文件类型
      allowFileTypes: [ "png", "jpg",  "jpeg"],
      // 运行上传文件大小，单位 M
      allowMaxFileSize: 1,
      // 附件数量限制
      fileLimit: 1,
      // 已上传的文件大小
      fileNumber: 0,
      // 已上传的文件列表
      uploadList:[],
      // 文件列表
      fileList:[],
      // 文件上传地址
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/system/oss/upload", // 上传的图片服务器地址
      headers: { 
        Authorization: "Bearer " + getToken() 
      },
      isDisabled: false,
      /**************************** */

      // 项目名称
      projectName: undefined,
      // 项目列表
      projectInfoList: undefined,
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
      // 地图项目管理表格数据
      planList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serverName: undefined,
        serverType: undefined,
        parentId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        projectCode: [
          { required: true, message: "项目编码不能为空", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "项目父级不能为空", trigger: "blur" }
        ],
        projectArea: [
          { required: true, message: "项目区域不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        visible: [
          { required: true, message: "是否显示不能为空", trigger: "blur" }
        ],
        isAuto: [
          { required: true, message: "是否自管不能为空", trigger: "blur" }
        ],
        projectPic: [
          { required: false, message: "项目照片不能为空", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    projectName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getProjectTree();
  },
  methods: {
    /** 查询项目树结构 */
    getProjectTree() {
      getProjectTree().then(response => {
        this.projectTreeData = response.data;
      });
    },
    
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.parentId = data.id;
      this.handleQuery();
    },
    /** 查询地图项目对应的地图项目列表 */
    getList() {
      if(this.queryParams.parentId === undefined) {
        this.$modal.msgError("请先左侧选择所要操作的项目.");
      } else {
        this.loading = true;
        listPageProjectInfo(this.queryParams).then(response => {
          this.projectInfoList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }
    },
    /** 转换项目数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.projectName,
        children: node.children
      };
    },

    deptNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
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
        projectName: undefined,
        projectCode: undefined,
        parentId: undefined,
        projectArea: undefined,
        groupLevel: undefined,
        status: 0,
        visible: undefined,
        orderNum: undefined,
        groupId: undefined,
        isAuto: undefined,
        projectPic: undefined,
        contractNum: undefined,
        coordinate: undefined,
        investment: undefined,
        projectType: undefined,
        projectPoint: undefined,
        projectLine: undefined,
        projectSurface: undefined,
        introduction: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
      };
      this.resetForm("form");
      this.uploadList = [],
      // 文件列表
      this.fileList = [],
      listProjectInfo().then(response => {
        this.projectTreeOptions = this.handleTree(response.data, "id");
      });
      listDept().then(response => {
        this.deptTreeOptions = this.handleTree(response.data, "id");
      });
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

    // 用户是否可见修改
    handleVisiableChange(row) {
      let text = row.visiable === "0" ? "可见" : "隐藏";
      this.$modal.confirm('确认要设置' + row.serverName + '项目为'+ text + '吗？').then(function() {
        return changeStatusOrVisiable({ id: row.serverId, visiable: row.visiable });
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.visiable = row.visiable === "0" ? "1" : "0";
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 刷新列表和项目树 */
    refreshTreeAndTable(){
      this.getProjectTree();
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加项目信息";      
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getProjectInfo(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改项目信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateProjectInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.refreshTreeAndTable();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addProjectInfo(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.refreshTreeAndTable();
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
        this.$modal.msgSuccess("删除成功");
        this.refreshTreeAndTable();
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/jg/project/export', {
        ...this.queryParams
      }, `projectInfo_${new Date().getTime()}.xlsx`)
    },

    /**
     * 关联部门
     * @param {*} row 
     */     
    handleRelatedDept(row) {
      this.currentProject = row;
      this.$refs.relatedProjectDept.show();
    },

    doRelatedDept() {
      console.log("关联部门doRelatedDept...");
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