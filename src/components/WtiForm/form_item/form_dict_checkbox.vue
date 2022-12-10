<template>
    <!--  字典下拉框（指通过数据字典获取选项）  -->
    <div :style="item.style||{}"
         :class="`form-unqiue-${item.key} ${getTextModel ? '' : 'wti-untext-box'} ${item.checkAll ? 'checkbox-height' : ''}`"
         class="form-item-box">
        <el-checkbox v-if="item.checkAll && !getTextModel" :indeterminate="checkAllData.indeterminate"
                     v-model="checkAllData.checkAll"
                     @change="handleCheckAllChange">
            全选
        </el-checkbox>
        <el-checkbox-group v-model="val" :disabled="getDisabled"
                           v-bind="bindOptions" v-if="!getTextModel">
            <el-checkbox v-for="option in dynamicDict[item.parentKey]"
                         :key="option[dynamicSelectOption.value]"
                         :label="option[dynamicSelectOption.value]">
                {{ option[dynamicSelectOption.label] }}
            </el-checkbox>
        </el-checkbox-group>
        <div v-else :style="item.textStyle || {}" class="form-input-text">{{ textModelValue || '-' }}</div>
    </div>
</template>

<script>
    import FormMixin from './mixin';

    export default {
        name: 'FormDynamicSelect',
        mixins: [ FormMixin ],
        data () {
            return {
                prependMsg: '',
                appendMsg: ''
            };
        },
        computed: {
            checkAllData () {
                if (this.dynamicDict[this.item.parentKey].length > 0) {
                    const valueList = this.dynamicDict[this.item.parentKey].map(item => {
                        return item[this.dynamicSelectOption.value];
                    });
                    const arr = this.val.filter(item => {
                        return valueList.indexOf(item) !== -1;
                    });
                    const checkedCount = arr.length;
                    return {
                        checkAll: checkedCount === this.dynamicDict[this.item.parentKey].length,
                        indeterminate: checkedCount > 0 && checkedCount < this.dynamicDict[this.item.parentKey].length
                    };
                } else {
                    return {
                        checkAll: false,
                        indeterminate: false
                    };
                }
            },
            textModelValue () {
                const content = [];
                if (this.dynamicDict[this.item.parentKey]) {
                    this.dynamicDict[this.item.parentKey].forEach((item) => {
                        if (this.val.indexOf(item[this.dynamicSelectOption.value]) >= 0) {
                            content.push(item[this.dynamicSelectOption.label]);
                        }
                    });
                }
                return content.join('、') || '';
            },

            val: {
                get () {
                    return this.value;
                },
                set (v) {
                    this.$emit('input', v);
                    this._valueLink(v);
                    // 只有非子表单的情况下，才会冒泡上去数据变更
                    if (this.formItemType !== 'childForm') {
                        this.statusChangeFn.valueUpdateEvent({
                            [this.item.key]: v
                        });
                    } else {
                        // 如果是子表单的话，执行内置的变更
                        this.childChangeData.valueUpdateEvent();
                    }
                }
            }
        },
        mounted () {
        },
        methods: {
            handleCheckAllChange (val) {
                if (val) {
                    const selectVals = this.dynamicDict[this.item.parentKey].map(item => {
                        return item[this.dynamicSelectOption.value];
                    });
                    this.val = selectVals;
                } else {
                    this.val = [];
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .form-item-box {
        ::v-deep .el-input {
            position: relative;
            width: 100%;
            height: 36px;

            .el-input__inner {
                position: absolute;
                width: 100%;
                height: 36px;
                line-height: 36px;
                padding-right: 10px;
                padding-left: 12px;
            }
        }
    }
</style>
