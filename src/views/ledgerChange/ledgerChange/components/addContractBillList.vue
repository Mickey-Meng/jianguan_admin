<template>
  <div class="contract-bill-content">
    <div>
        <el-row :gutter="10">
            <el-col :span="7">
                <div class="left-tree">
                    <multilevel-tree ref="mulTree" :list="treeList" :default-props="treeProps"
                             @selectRow="selectTree"/>
                </div>
            </el-col>
            <el-col :span="17">
                <el-table
                    :data="contractBillList"
                    height="calc(100vh - 540px)"
                    :header-cell-style="headercellStyle"
                    :cell-style="cellStyle"
                    border
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="left"/>
                    <el-table-column
                        v-for="(col, i) in columnContractBillData"
                        :key="i"
                        :prop="col.key"
                        :label="col.label"
                        :width="col.width"
                        :min-width="col.minWidth"
                        :show-overflow-tooltip="col.tooltip || false">
                        <template slot-scope="scope">
                            {{ scope.row[col.key] || '-' }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="24">
                <el-col :span="22">
                    <span class="text">已添加清单：</span>
                </el-col>
                <el-col :span="2">
                    <el-button
                        style="margin-top: 8px;"
                        type="primary"
                        plain
                        icon="el-icon-plus"
                        size="mini"
                        @click="handleAdd"
                        v-hasPermi="['ledgerDetail:ledgerBreakdownDetail:add']"
                    >添加
                    </el-button>
                </el-col>
                <el-table
                    :data="choseContractList"
                    height="280"
                    :header-cell-style="headercellStyle"
                    :cell-style="cellStyle"
                    border
                    style="width: 100%;">
                    <el-table-column fixed="left" type="index" label="序号" width="55" align="left"/>
                    <el-table-column
                        v-for="(col, i) in columnData"
                        :key="i"
                        :prop="col.key"
                        :label="col.label"
                        :width="col.width"
                        :min-width="col.minWidth"
                        :show-overflow-tooltip="col.tooltip || false">
                        <template slot-scope="scope">
                            {{ scope.row[col.key] || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="60" align="center">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.$index)"
                                v-hasPermi="['bill:contractBill:remove']"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled="choseContractList.length === 0" @click="submitForm">确 定</el-button>
            <el-button @click="close">取 消</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import MultilevelTree from "@/components/MultilevelTree";
import { listContractBill, listContractBillTree } from "@/api/bill/contractBill";
export default {
    props: {
        close: {
            type: Function,
            default: () => {}
        },
        list: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
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
            treeList: [],
            treeProps: {
                id: 'id',
                label: 'zmmc',
                children: 'children'
            },
            contractBillList: [],
            columnContractBillData: [
                {
                    key: 'zmh',
                    label: '子目号',
                    align: 'center',
                    minWidth: '100',
                    tooltip: true
                },
                {
                    key: 'zmmc',
                    label: '子目名称',
                    align: 'left',
                    minWidth: '120',
                    tooltip: true
                },
                {
                    key: 'dw',
                    label: '单位',
                    align: 'center',
                    minWidth: '80',
                    tooltip: false
                },
                {
                    key: 'htdj',
                    label: '单价',
                    align: 'center',
                    minWidth: '80',
                    tooltip: false
                },
                {
                    key: 'xzsl',
                    label: '已变更数量',
                    format: 'money',
                    align: 'right',
                    minWidth: '80',
                    tooltip: false
                },
                {
                    key: 'shje',
                    label: '复核数量',
                    format: 'money',
                    align: 'right',
                    minWidth: '80',
                    tooltip: false
                },
            ],
            choseContractList: [],
            columnData: [
                {
                    key: 'zmh',
                    label: '子目号',
                    align: 'center',
                    minWidth: '100',
                    tooltip: true
                },
                {
                    key: 'zmmc',
                    label: '子目名称',
                    align: 'center',
                    minWidth: '120',
                    tooltip: true
                },
                {
                    key: 'gcbw',
                    label: '工程部位',
                    align: 'left',
                    minWidth: '80',
                    tooltip: true
                },
                {
                    key: 'dw',
                    label: '单位',
                    align: 'center',
                    minWidth: '80',
                    tooltip: false
                },
                {
                    key: 'htdj',
                    label: '单价',
                    align: 'center',
                    minWidth: '80',
                    tooltip: false
                },
                {
                    key: 'shje',
                    label: '复核数量',
                    format: 'money',
                    align: 'right',
                    minWidth: '80',
                    tooltip: false
                },
                {
                    key: 'xzsl',
                    label: '变更数量',
                    format: 'money',
                    align: 'right',
                    minWidth: '80',
                    tooltip: false
                },
                {
                    key: 'xzje',
                    label: '变更金额',
                    format: 'money',
                    align: 'right',
                    minWidth: '80',
                    tooltip: false
                },
            ],
            // 查询参数
            queryParams: {
                bdbh: undefined,
                zmh: undefined,
                zmmc: undefined,
                zmhParent: undefined,
                zmhAncestors: undefined,
                dw: undefined,
                htdj: undefined,
                xzdj: undefined,
                htsl: undefined,
                htje: undefined,
                shsl: undefined,
                shje: undefined,
                xzsl: undefined,
                xzje: undefined,
                zsl: undefined,
                zje: undefined,
                status: undefined,
                parentId: undefined
            },
            stashList: []
        }
    },
    components: {
        MultilevelTree
    },
    mounted () {
        this.choseContractList = JSON.parse(JSON.stringify(this.list));
        this.getTreeList();
    },
    methods: {
        getTreeList () {
            this.loading = true;
            listContractBillTree(this.queryParams).then(response => {
                this.treeList = this.handleTree(response.data, "zmh", "zmhParent");
                this.loading = false;
            });  
        },
        selectTree(row) {
            // console.error('选中的数据', row);
            this.getList(row.zmh);
        },
        getList (val) {
            const params = {
                zmhParent: val
            };
            this.loading = true;
            listContractBill(params).then(response => {
                this.contractBillList = response.data;
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSelectionChange (row) {
            this.stashList = JSON.parse(JSON.stringify(row));
        },
        handleDelete (index) {
            this.choseContractList.splice(index, 1);
        },
        handleAdd () {
            if (this.choseContractList.length === 0) {
                this.$message.warning('请先在上方表格中选择数据后在添加！');
                return;
            }
            if (this.choseContractList.length) {
                const list = JSON.parse(JSON.stringify(this.choseContractList));
                const repeatData = []
                this.stashList.forEach(item => {
                    const data = list.filter(v => v.id === item.id);
                    if (!data.length) {
                        this.choseContractList.push(item);
                    } else {
                        data.forEach(val => {
                            repeatData.push(`【${val.zmmc}】`);
                        })
                    }
                })
                if (repeatData.length) {
                    this.$message.warning(`子目名称为${repeatData.join(' ')}的清单已存在，不可重复添加`);
                }
            } else {
                this.choseContractList = JSON.parse(JSON.stringify(this.stashList));
            }
        },
        submitForm () {
            this.$emit('getData', this.choseContractList);
            this.close();
        }
    }
}
</script>

<style lang="scss" scoped>
.contract-bill-content {
    height: 100%;

//   .el-table {
//     height: 350px;
//     overflow: auto;
//   }
    .text {
        display: inline-block;
        padding-top: 10px;
        font-family: 'PingFangSC-Regular';
        color: '#12182A';
        font-size: '14px';
        line-height: 32px;
    }
    .left-tree {
        width: 100%;
        height: calc(100vh - 540px);
        overflow: auto;
        background: rgb(247, 248, 251);
        padding: 0 10px;
    }
    .dialog-footer {
        text-align: right;
        margin-top: 12px;
    } 
}


</style>