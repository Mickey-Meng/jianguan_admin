<template>
    <div class="app-container">
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%" height="90%" append-to-body>
            <!-- 
                :fullscreen="fullscreen"
                :lock-scroll="lockScroll"
                :close-on-click-modal="closeOnClickModal"
                :close-on-press-escape="closeOnPressEscape"
            <div class="luckysheet-content">
                <div id="luckysheet" style="margin: 0px; padding: 0px; position: absolute; width: 100%; height:100%; left: 0px;top: 0px; bottom: 20px;"></div>
            </div>
             -->
             <lucky-sheet ref="luckysheetRef" v-on:getLuckySheetData = "receiveSheetData" v-bind:luckysheetParams = "luckysheetParams" />
 
            <div slot="footer" class="dialog-footer">
                <el-button :loading="buttonLoading" type="primary" @click="saveSheetData">确 定</el-button>
                <el-button @click="handleToClose">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import LuckySheet from "@/components/Luckysheet/lucky-sheet";
import { getFillDataTemplate } from "@/api/jianguan/produce/produce";

export default {
    name: "OnlineForms",
    components: {
        LuckySheet
    },
    props: ['produceItem'],
    data() {
        return {
            buttonLoading: false,

            dialogVisible: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            fullscreen: false,
            lockScroll: false,
            dialogTitle: "luckysheet数据编辑",
            // lucksheet组件参数数据
            luckysheetParams: {
                luckySheetData: {
                    excelHeader: [],
                    excelData: {},
                },
                templateUrl : "http://112.30.143.209:9002/hefei/2023/07/11/3fa3f6d2806340f399436c1fc273760e.xlsx",
                templateName: "1"
                //templatePath: "D:\\TemporaryFile\\template\\8ef0033366ad42778d7a3f21ba5d912d_混凝土排水管安装浙路(JS)101施工放样现场记录(监抽).zip"
            }
            
        }
    },
    methods: {
        onLuckySheetReady() {
            this.dialogVisible = true;
            this.dialogTitle = "在线填写-" + this.produceItem.name
            //this.onGetLuckySheetData();
        },
        onGetLuckySheetData(){
            this.luckysheetParams.luckySheetData = {
                excelHeader : ["姓名", "年龄", "性别"],
                excelData : {
                    姓名: ["张三", "赵兰", "李四"],
                    年龄: ["18", "17", "20"],
                    性别: ["男", "女", "男"]
                }
            };
            this.luckysheetParams.templateUrl = "http://112.30.143.209:9002/hefei/2023/07/11/3fa3f6d2806340f399436c1fc273760e.xlsx";
            //this.luckysheetParams.templateUrl = "http://112.30.143.209:9002/hefei/2023/07/10/b09c3e514fa04d4e812d6baf8941c118.xlsx";
            // this.luckysheetParams.templateName = '【表单填写】请填写相关内容';
            
            // 获取待填写的模板
            getFillDataTemplate(this.componentType.id).then(response => {
                this.luckysheetParams.templatePath = response.data.templatePath;
                this.luckysheetParams.templateName = response.data.templateName;
            });
            /**
             * 
            // 根据文件地址生成对用的sheet数据进行渲染
            LuckyExcel.transformExcelToLuckyByUrl(this.luckysheetParams.templateUrl, this.luckysheetParams.templateName, 
              function (exportJson, luckysheetfile) {
                if (exportJson.sheets == null || exportJson.sheets.length == 0) {
                    alert('Failed to read the content of the excel file, currently does not support xls files!')
                    return;
                }
                console.log(exportJson);
                // 生成sheet对象
                window.luckysheet.destroy();
                window.luckysheet.create({
                    container: "luckysheet", // 设定DOM容器的id
                    title: "Luckysheet Demo", // 设定表格名称
                    lang: "zh", // 设定表格语言
                    data:  exportJson.sheets,
                    title: exportJson.info.name
                });
            })
            * 
             */
        },
        saveSheetData() {
            this.buttonLoading = true;
            var _this = this;
            _this.$refs.luckyexcelRef.getSheetData(); //调用子组件获取sheet数据
            console.log(JSON.stringify(_this.luckySheetData));
            // document.getElementById("luckysheet-input-box").style.zIndex = "-1";
            // document.getElementsByClassName("luckysheet-cell-input").innerHTML = "";
            // _this.dialogFormVisible = false; //关闭对话框
        },
        //luckySheet数据接收
        receiveSheetData: function (sheetTitle, commonData) {
            var _this = this;
            _this.luckySheetData.excelHeader = sheetTitle;
            _this.luckySheetData.excelData = commonData;
        },
        handleToClose() {
            this.dialogVisible = false;
        }
    },
}
</script>
 
<style scoped>

.luckysheet-content {
    margin: 0px;
    padding: 0px;
    position: relative;
    width: 100%;
    height: 500px;
    left: 0px;
    top: 0px;
    bottom: 10px;
  }
    .excel {
        width: 100%;
        height: 60vh;
            .luckyexcel {
                margin:0px;
                padding:0px;
                position:absolute;
                width:100%;
                left: 0px;
                top: 95px;
                bottom:0px;
            }
    }
    .centers {
        color: #ccc;
        font-size: 12px;
        text-align: center;
    }
    .luckyexcel-zoom-content{
        display: none!important;
        height: 0px!important;
    }
    .luckyexcel-print-viewList {
        display: none!important;
    height: 0px!important;
    }
    #luckysheet-bottom-add-row{
        display: none;
    }
    #luckysheet-bottom-add-row-input{
        display: none;
    }
    #luckysheet-bottom-controll-row{
        span{
            display: none;
        }
    }
    .luckyexcel-sheet-area .luckyexcel-sheets-item, .luckyexcel-sheet-area>div{
        display: none!important;
    }
    .lucky-button-custom{
        display: none!important;
    }
    .luckyexcel-wa-calculate{
        display: none!important;
    }
</style>