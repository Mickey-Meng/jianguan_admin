<template>
  <div>
    <panel :title="'我的待办'" iconClass="funnel">
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
          iconClass: 'funnelGreen',
          label: '待办数 - ',
          value: '10'
        },
        {
          iconClass: 'hammer',
          label: '已办数 - ',
          value: '10'
        },
        {
          iconClass: 'precess',
          label: '流程数 - ',
          value: '96'
        },
        {
          iconClass: 'plane',
          label: '超时数 - ',
          value: '11'
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
      }
    }
  }
</style>