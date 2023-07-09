<template>
    <div class="app-container">

        <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" height="90%" append-to-body>

            <!-- 
                :fullscreen="fullscreen"
            :lock-scroll="lockScroll"
            :close-on-click-modal="closeOnClickModal"
            :close-on-press-escape="closeOnPressEscape"
            <luckysheet
                ref="luckysheetRef"
                v-on:getLuckySheetData="receive"
                v-bind:sheetParams="sheetParams"
            />
-->
            <div class="excel">
                <div id="luckysheet" class="luckyexcel" ></div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button :loading="buttonLoading" type="primary" @click="saveSheetData">确 定</el-button>
                <el-button @click="dialogVisible == false">取 消</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>
<script>
import Luckysheet from "@/components/Luckysheet/luckysheet";
//引用luckyexcel
import LuckyExcel from "luckyexcel"
export default {
    name: "OnlineForms",
    components: {
        Luckysheet
    },
    props: ['componentType'],
    data() {
        return {
            buttonLoading: false,

            dialogVisible: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            fullscreen: false,
            lockScroll: false,
            luckysheetName: "luckysheet数据编辑",

            sheetParams: {
                excelHeader: [],
                excelData: {}
            },
            luckySheetData: {
                excelHeader: [],
                excelData: {},
            },
        };
    },
    methods: {
        onLuckySheetReady() {
            this.dialogVisible = true;
            this.luckyexcelName = "在线填写-" + this.componentType.name
            this.onGetLuckySheetData();
        },
        onGetLuckySheetData(){
            console.log("加载数据...");
            this.sheetParams.excelHeader = ["姓名", "年龄", "性别"];
            this.sheetParams.excelData = {
                姓名: ["张三", "赵兰", "李四"],
                年龄: ["18", "17", "20"],
                性别: ["男", "女", "男"],
            };


            LuckyExcel.transformExcelToLuckyByUrl("http://112.30.143.209:9002/hefei/2023/07/07/32ecb5092de444b59f302f8c2d342e6a.xlsx", 
            '【请反馈 】驻场名单模板_流水到款.xlsx', function (exportJson, luckysheetfile) {
                if (exportJson.sheets == null || exportJson.sheets.length == 0) {
                    alert('Failed to read the content of the excel file, currently does not support xls files!')
                    return
                }
                //LuckyExcel.destroy();
                luckysheet.create({
                    container: 'luckysheet',
                    data: exportJson.sheets,
                    title: exportJson.info.name,
                    userInfo: exportJson.info.name.creator,
                    lang: 'zh',
                    showinfobar: false,
                    showtoolbar: false,
                    allowEdit: false,
                    allowCopy: false,
                    editMode: true
                })
            })
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
        receive: function (sheetTitle, commonData) {
            var _this = this;
            _this.luckySheetData.excelHeader = sheetTitle;
            _this.luckySheetData.excelData = commonData;
        },
        handleToClose() {
            this.centerDialogVisible = false;
        }
    },
};
</script>
 
<style scoped>
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