<template>
    <div class="wti-tree-node">
        <!-- <el-tooltip class="item" effect="dark" :content="nodeData[defaultProps.label]" placement="left-start"> -->
            <div class="tree-label-row">
                <span v-if="nodeData[defaultProps.children] && nodeData[defaultProps.children].length > 0"
                    class="collapse"
                    @click="collapseNode(nodeData[defaultProps.id])">
                    <!-- 向下（表示展开） -->
                    <svg v-if="collapseNodeList.indexOf(nodeData[defaultProps.id]) === -1"
                        class="collapse-icon"
                        viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" width="12" height="10">
                        <path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z" p-id="2347" fill="#AEB3BF"/>
                    </svg>
                    <!-- 向右（表示收起） -->
                    <svg v-else
                        class="collapse-icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" width="12" height="10">
                        <path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z" p-id="2490" fill="#AEB3BF"/>
                    </svg>
                </span>
                <span v-else class="collapse-empty"></span>
                <span :class="['wti-tree-node-label', selectedId === nodeData[defaultProps.id] ? 'active-label' : '']" @click="selectRow(nodeData)">{{ nodeData[defaultProps.label] }}</span>
            </div>
        <!-- </el-tooltip> -->


        <div class="tree-child"
             v-if="nodeData.children && nodeData.children.length>0 && collapseNodeList.indexOf(nodeData[defaultProps.id]) === -1">
            <WtiTreeNode v-for="item in nodeData.children"
                         :key="item[defaultProps.id]"
                         :default-props="defaultProps"
                         :selected-id="selectedId"
                         :select-row="selectRow"
                         :collapse-node-list="collapseNodeList"
                         :collapse-node="collapseNode"
                         :node-data="item"></WtiTreeNode>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'WtiTreeNode',
        props: {
            // 该节点的数据，是一个对象
            nodeData: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            defaultProps: {
                type: Object,
                default: () => {
                    return {
                        children: 'children',
                        label: 'label',
                        id: 'id'
                    }
                }
            },
            collapseNodeList: {
                type: Array,
                default: () => []
            },
            selectRow: {
                type: Function,
                default: () => {
                }
            },
            collapseNode: {
                type: Function,
                default: () => {
                }
            },
            selectedId: {
                type: String,
                default: ''
            }
        },
    }
</script>

<style scoped lang="scss">
    .wti-tree-node {
        width: 100%;
        line-height: 32px;

        .tree-label-row {
            height: 32px;
            line-height: 32px;
            vertical-align: top;
            user-select: none;
            overflow: hidden;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            -webkit-text-overflow: ellipsis;
            -moz-text-overflow: ellipsis;
            white-space: nowrap;
            
            .collapse {
                cursor: pointer;
            }

            .collapse-empty {
                display: inline-block;
                width: 10px;
                vertical-align: top;
            }

            .check-box {
                height: 32px;
                line-height: 40px;
                vertical-align: top;
                cursor: pointer;
                display: inline-block;
            }

            .wti-tree-node-label {
                user-select: text;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #3A4566;
                line-height: 20px;
                font-weight: 400;
                cursor: pointer;
            }
            .active-label {
                color: skyblue;
            }
        }

        .tree-child {
            width: 100%;
            line-height: 24px;
            padding-left: 16px;
        }
    }

</style>
