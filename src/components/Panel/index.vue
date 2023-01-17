<template>
    <div class="panel">
        <div class="card-title">
            <svg-icon :icon-class="iconClass" class="el-input__icon input-icon" class-name="card-panel-icon" />
            <span class="bar">{{ title }}</span>
            <div class="action">
                <slot name="action"></slot>
            </div>
        </div>
        <div class="body">
            <slot name="body"></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Panel',
        props: {
            title: {
                type: String,
                default: ''
            },
            iconClass: {
                type: String,
                default: ''
            }
        }
    };
</script>
<style lang="scss" scoped>
.panel {
    width: 100%;
    height: 100%;
    background: #fff;

    .card-title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: rgb(92, 166, 222);
        font-weight: 600;
        padding: 0 10px;
        position: relative;
        border-bottom: 1px solid #E7E8EB;
        .bar {
            margin-left: 4px;
        }
        .action {
            position: absolute;
            top: 0;
            right: 14px;
        }
    }
    .body {
        height: calc("100% - 40px");
    }
}
</style>
