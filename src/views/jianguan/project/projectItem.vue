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
            <h4 class="form-header h4">项目详情</h4>
            <el-form ref="form" :model="form" :rules="rules" label-width="150px">
                <el-row :gutter="20">                    
                    <el-col :span="12">
                        <el-form-item label="管理单位" prop="manageDept">
                            <el-input v-model="form.manageDept" placeholder="请输入管理单位" />
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="建造单位" prop="buildDept">
                            <el-input v-model="form.buildDept" placeholder="请输入建造单位" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20"> 
                    <el-col :span="12">
                        <el-form-item label="设计单位" prop="desginDept">
                            <el-input v-model="form.desginDept" placeholder="请输入设计单位" />
                        </el-form-item>
                    </el-col>
            
                    <el-col :span="12">
                        <el-form-item label="施工单位" prop="constructDept">
                            <el-input v-model="form.constructDept" placeholder="请输入施工单位" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20"> 
                    <el-col :span="12">
                        <el-form-item label="监理单位" prop="supervisorDept">
                            <el-input v-model="form.supervisorDept" placeholder="请输入监理单位" />
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="工程规模" prop="projectScale">
                            <el-input v-model="form.projectScale" placeholder="请输入工程规模" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">                    
                    <el-col :span="12">
                        <el-form-item label="合同工期" prop="projectDuration">
                            <el-input v-model="form.projectDuration" placeholder="请输入合同工期" />
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="投资规模" prop="inputsCale">
                            <el-input v-model="form.inputsCale" placeholder="请输入投资规模" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">                
                    <el-col :span="12">
                        <el-form-item label="开工日期" prop="startTime">
                            <el-date-picker clearable
                            v-model="form.startTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择开工日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="审计单位" prop="auditUnit">
                            <el-input v-model="form.auditUnit" placeholder="请输入审计单位" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">              
                    <el-col :span="12">
                        <el-form-item label="投资项目概述" prop="investmentProjectOverview">
                            <el-input v-model="form.investmentProjectOverview" type="textarea" placeholder="请输入投资项目概述" />
                        </el-form-item>
                    </el-col>
    
                    <el-col :span="12">
                        <el-form-item label="压实责任" prop="compactionResponsibility">
                            <el-input v-model="form.compactionResponsibility" placeholder="请输入压实责任" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20"> 
                    <el-col :span="12">
                        <el-form-item label="落实保障" prop="implementGuarantee">
                            <el-input v-model="form.implementGuarantee" placeholder="请输入落实保障" />
                        </el-form-item>
                    </el-col>
    
                    <el-col :span="12">
                        <el-form-item label="抓实进度" prop="graspProgress">
                            <el-input v-model="form.graspProgress" placeholder="请输入抓实进度" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">            
                    <el-col :span="12">
                        <el-form-item label="第一季度" prop="firstQuarter">
                            <el-input v-model="form.firstQuarter" placeholder="请输入第一季度" />
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="第二季度" prop="secondQuarter">
                            <el-input v-model="form.secondQuarter" placeholder="请输入第二季度" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">           
                    <el-col :span="12">
                        <el-form-item label="第三季度" prop="thirdQuarter">
                            <el-input v-model="form.thirdQuarter" placeholder="请输入第三季度" />
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="第四季度" prop="fourthQuarter">
                            <el-input v-model="form.fourthQuarter" placeholder="请输入第四季度" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">               
                    <el-col :span="12">
                        <el-form-item label="第一季度实际进度" prop="firstQuarterActuality">
                            <el-input v-model="form.firstQuarterActuality" placeholder="请输入第一季度实际进度" />
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="第二季度实际进度" prop="secondQuarterActuality">
                            <el-input v-model="form.secondQuarterActuality" placeholder="请输入第二季度实际进度" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">            
                    <el-col :span="12">
                        <el-form-item label="第三季度实际进度" prop="thirdQuarterActuality">
                            <el-input v-model="form.thirdQuarterActuality" placeholder="请输入第三季度实际进度" />
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="第四季度实际进度" prop="fourthQuarterActuality">
                            <el-input v-model="form.fourthQuarterActuality" placeholder="请输入第四季度实际进度" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20"> 
                    <el-col :span="12">
                        <el-form-item label="工程布局图">
                            <image-upload v-model="form.engineeringLayoutImage"/>
                        </el-form-item>
                    </el-col>          
                </el-row>
            </el-form>
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

  
  export default {
    name: "jgProjectItem",
    props: ['project'],
    data() {
      return {
        // 按钮loading
        buttonLoading: false,
        // 遮罩层
        loading: true,        
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
            this.title = "项目详情";
            console.log("获取到的ID:" + this.project.id);
            getProjectItem(this.project.id).then(response => {
                this.loading = false;
                // 项目主键、项目名称、项目编码从项目表带过来
                const projectData = response.data;
                projectData.id = this.project.id;
                projectData.projectName = this.project.projectName;
                projectData.projectCode = this.project.projectCode;
                console.log("this.project");
                console.log(this.project);
                console.log("projectData");
                console.log(projectData);
                this.form = projectData;
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.buttonLoading = true;
                    console.log(this.form);
                    if (this.form.id != null) {
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
  