<template>
    <div class="app-container">
      <!-- 添加或修改项目详情对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="1100px" append-to-body>
        <h4 class="form-header h4">项目信息</h4>
        <el-row>
            <el-form :model="project" label-width="80px">
                <el-col :span="8" :offset="2">
                    <el-form-item label="项目名称" prop="projectName">
                    <el-input v-model="project.projectName" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="2">
                    <el-form-item label="项目编码" prop="projectCode">
                    <el-input  v-model="project.projectCode" disabled />
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>

        <el-row>
            <h4 class="form-header h4">设备信息</h4>

            <el-form ref="form" :model="form" :rules="rules" label-width="150px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="项目id" prop="projectId">
                            <el-input v-model="form.projectId" placeholder="请输入项目id" />
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="form.name" placeholder="请输入名称" />
                        </el-form-item>
                    </el-col>
                
                    <el-col :span="12">
                        <el-form-item label="设备编号" prop="deviceNo">
                            <el-input v-model="form.deviceNo" placeholder="请输入设备编号" />
                        </el-form-item>
                    </el-col>
                
                    <el-col :span="12">
                        <el-form-item label="通道编号" prop="channelNo">
                            <el-input v-model="form.channelNo" placeholder="请输入通道编号" />
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="监控url" prop="url">
                            <el-input v-model="form.url" placeholder="请输入监控url" />
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="坐标" prop="geom">
                            <el-input v-model="form.geom" placeholder="请输入坐标" />
                        </el-form-item>
                    </el-col>          
                </el-row>
            </el-form>

            <el-col :span="24">
                <wti-form ref="wtiForm" :fields="fields" :border-form="false" @updateValue="updateValue"
                        label-position="right" label-width="140px" child-label-width="120px" :data="form">
                </wti-form>
          </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="open = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>

  <script>
  import { getProjectItem, saveProjectItem } from "@/api/jianguan/project/project";
  import { listMonitor, getMonitor, delMonitor, addMonitor, updateMonitor } from "@/api/jianguan/project/monitor";
  import dayjs from "dayjs";
  import fields from './fields';
  import calc from '@/utils/calc.js'

  export default {
    name: "jgProjectItem",
    props: ['project'],
    data() {
      return {
        // 按钮loading
        buttonLoading: false,
        // 遮罩层
        loading: true,

        // 管理单位
        manageDeptOptions: [],
        // 建造单位
        buildDeptOptions: [],
        // 设计单位
        desginDeptOptions: [],
        // 施工单位
        constructDeptOptions: [],
        // 监理单位
        supervisorDeptOptions: [],
        // 审计单位
        auditUnitOptions: [],

        // 允许的文件类型
        allowFileTypes: [ "png", "jpg",  "jpeg"],
        // 运行上传文件大小，单位 M
        allowMaxFileSize: 10,
        // 附件数量限制
        fileLimit: 1,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          id: [
            { required: true, message: "项目主键不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      //this.getProjectItem();
    },
    methods: {
        // 显示弹框
        show() {
            this.loading = true;
            this.reset();
            this.open = true;
            this.title = "监控设备";
            console.log("获取到的ID:" + this.project.id);
            getProjectItem(this.project.id).then(response => {
                this.loading = false;
                // 项目主键、项目名称、项目编码从项目表带过来
                const responseData = response.data;
                let projectItemData = responseData.projectItem;
                projectItemData.id = this.project.id;
                projectItemData.projectName = this.project.projectName;
                projectItemData.projectCode = this.project.projectCode;
                console.log("this.project");
                console.log(this.project);
                console.log("projectData");
                console.log(projectItemData);
                this.form = projectItemData;
                this.auditUnitOptions = responseData.auditUnitOptions;
                console.log(this.auditUnitOptions);
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.buttonLoading = true;
                    console.log(11111111111111111);
                    console.log(this.form);
                    this.form.id = this.project.id;
                    this.form.projectName = this.project.projectName;
                    this.form.projectCode = this.project.projectCode;
                    console.log(22222222222222222);
                    console.log(this.form);
                    if (this.form.id > 0) {
                        saveProjectItem(this.form).then(response => {
                            this.$modal.msgSuccess("保存成功");
                            this.open = false;
                        }).finally(() => {
                            this.buttonLoading = false;
                        });
                    }
                }
            });
        },
        // 表单重置
        reset() {
            this.form = {
                id: undefined,
                projectId: undefined,
                manageDept: undefined,
                buildDept: undefined,
                desginDept: undefined,
                constructDept: undefined,
                supervisorDept: undefined,
                projectScale: undefined,
                projectDuration: undefined,
                inputsCale: undefined,
                startTime: undefined,
                projectCode: undefined,
                auditUnit: undefined,
                projectName: undefined,
                investmentProjectOverview: undefined,
                compactionResponsibility: undefined,
                implementGuarantee: undefined,
                graspProgress: undefined,
                firstQuarter: undefined,
                secondQuarter: undefined,
                thirdQuarter: undefined,
                fourthQuarter: undefined,
                firstQuarterActuality: undefined,
                secondQuarterActuality: undefined,
                thirdQuarterActuality: undefined,
                fourthQuarterActuality: undefined,
                engineeringLayoutImage: undefined
            };
            this.resetForm("form");
        }
    }
  };
  </script>
