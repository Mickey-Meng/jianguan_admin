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
                    <el-col :span="24">
                            <wti-form ref="wtiForm" :fields="monitorFields" :border-form="false" 
                                label-position="right" label-width="140px" child-label-width="120px" :data="form">
                            </wti-form>
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
  import { getMonitors, saveMonitors } from "@/api/jianguan/project/monitor";

  export default {
    name: "jgMonitorDevices",
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
        form: {
            monitorDevices: []
        },
        monitorFields: [
            {
                'label': '',
                'children': [
                    {
                        'key': 'monitorDevices',
                        'type': 'child-form', // 小型表单
                        'headerLabel': '监控设备',
                        'childrenForm': [
                            {
                                'type': 'input',
                                'key': 'name', // 1
                                'label': '设备名称',
                                'required': true,
                                'disableDefault': false,
                            },
                            {
                                'type': 'input',
                                'key': 'deviceNo', // 1
                                'label': '设备编号',
                                'required': true,
                                'disableDefault': false,
                            },
                            {
                                'type': 'input',
                                'key': 'type', // 1
                                'label': '设备类型',
                                'required': true,
                                'disableDefault': false,
                            },
                            {
                                'type': 'input',
                                'key': 'channelNo', // 1
                                'label': '通道编号',
                                'required': true,
                                'disableDefault': false,
                            },
                            {
                                'type': 'input',
                                'key': 'url', // 1
                                'label': '监控URL',
                                'required': true,
                                'disableDefault': false,
                            },
                            {
                                'type': 'input',
                                'key': 'geom', // 1
                                'label': '设备坐标',
                                'required': true,
                                'disableDefault': false,
                            }
                        ]
                    }
                ]
            
            }
        ],
        
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
            this.open = true;
            this.title = "监控设备";
            console.log("获取到的ID:" + this.project.id);
            getMonitors(this.project.id)
                .then(response => {
                    this.loading = false;
                    this.form = response.data;
                });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.buttonLoading = true;
                    this.form.monitorDevices = this.$refs.wtiForm.formData.monitorDevices;
                    saveMonitors(this.project.id, this.form.monitorDevices)
                        .then(response => {
                            this.$modal.msgSuccess("保存成功");
                            this.open = false;
                        }).finally(() => {
                            this.buttonLoading = false;
                        });
                }
            });
        }
    }
  };
  </script>
