<template>
    <!-- 普通输入框 -->
    <div :style="item.style||{}"
         :class="`form-unqiue-${item.key} ${getTextModel ? '' : 'wti-untext-box'}`"
         class="form-input-box form-item-box">
        <el-checkbox v-if="item.checkAll && !getTextModel" :indeterminate="checkAllData.indeterminate"
                     v-model="checkAllData.checkAll"
                     @change="handleCheckAllChange"/>
        <el-checkbox-group v-model="val" :disabled="getDisabled"
                           v-bind="bindOptions" v-if="!getTextModel">
            <el-checkbox v-for="opt in item.options" :key="opt.value" :disabled="opt.disabled"
                         :label="opt.value">
                {{ opt.label }}
            </el-checkbox>
        </el-checkbox-group>
        <div v-else :style="item.textStyle||{}" class="form-input-text">{{ textModelValue || '-' }}</div>
    </div>
</template>

<script>
    import FormMixin from './mixin';

    export default {
        name: 'FormRadio',
        mixins: [ FormMixin ],
        data () {
            return {
                prependMsg: '',
                appendMsg: '',
            };
        },
        computed: {
            checkAllData () {
                if (this.item.options.length > 0) {
                    const valueList = this.item.options.map(item => {
                        return item.value;
                    });
                    const arr = this.val.filter(item => {
                        return valueList.indexOf(item) !== -1;
                    });
                    const checkedCount = arr.length;
                    return {
                        checkAll: checkedCount === this.item.options.length,
                        indeterminate: checkedCount > 0 && checkedCount < this.item.options.length
                    };
                } else {
                    return {
                        checkAll: false,
                        indeterminate: false
                    };
                }
            },
            textModelValue () {
                // const content = this.item.options &&
                const content = [];
                this.item.options.forEach((item) => {
                    if (this.val.indexOf(item.value) >= 0) {
                        content.push(item.label);
                    }
                });
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
                    const selectVals = this.item.options.map(item => {
                        return item.value;
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


.form-input-box ::v-deep .el-input-group__prepend, .single-input .form-input-box ::v-deep .el-input-group__append {
    padding: 0 10px;
}
</style>
