<template>
  <div>
    <panel :title="'常用功能'" iconClass="more">
      <div slot="body">
        <div class="content">
          <div class="block" v-for="(item, index) in data" :key="index">
            <span class="icon-custom"><svg-icon :icon-class="item.iconClass" class="el-input__icon input-icon" class-name="card-panel-icon" /></span>
            <span class="text">{{item.label }}{{ item.value }}</span>
          </div>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import panel from '@/components/Panel';
export default {
  components: {
    panel
  },
  data () {
    return {
      data: [
        {
          iconClass: 'formmanage',
          label: '表单管理',
        },
        {
          iconClass: 'listOrder',
          label: '部门管理',
        },
        {
          iconClass: 'usermanager',
          label: '用户管理',
        },
        {
          iconClass: 'design',
          label: '流程设计',
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    width: 100%;
    .block {
      display: inline-block;
      width: 25%;
      padding: 20px 10px;
      >span {
        display: block;
        text-align: center;
      }
      .icon-custom {
        color: rgb(90, 184, 91);
        margin-bottom: 12px;
        .svg-icon {
          font-size: 48px;
        }
      }
      .text {
        font-size: 14px;
        color: rgb(113, 112, 121);
      }
    }
  }
</style>