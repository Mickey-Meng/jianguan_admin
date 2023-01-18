<template>

  <div id="app">
    <iframe
      style="border:none"
      :width="searchTableWidth"
      :height="searchTableHeight"
      v-bind:src="reportUrl"
    ></iframe>
  </div>

</template>

<script>

import Crontab from '@/components/Crontab'
import {getSsoToken} from '@/utils/auth'

export default {
  components: {Crontab},
  name: "Job",
  dicts: ['sys_job_group', 'sys_job_status'],
  data() {
    return {
      reportUrl: '',
      searchTableHeight: 0,
      searchTableWidth: 0
    };
  },
  created() {
// 从路由里动态获取 url地址   具体地址看libs下util.js里的 backendMenuToRoute  方法
   let getSsoToken_str= getSsoToken();

    console.log("created------getSsoToken_str", getSsoToken_str);
    let url1 = "http://localhost:8075/webroot/decision/directory?ssoToken=" + getSsoToken_str;
    let url="http://150.158.139.18:8080/webroot/decision/view/form?ssoToken="+getSsoToken_str+"&viewlet=demo%2Fhomepage%2Ffinereport.frm&width=908&height=543";
    this.reportUrl = url;
  },
  mounted() {
    window.onresize = () => {
      this.widthHeight(); // 自适应高宽度
    };
    this.$nextTick(function () {
      this.widthHeight();
    });
  },
  methods: {
    widthHeight() {
      this.searchTableHeight = window.innerHeight - 146;
      this.searchTableWidth = window.innerWidth - 280
    },
  },
  watch: {
    '$route': function () {
      let getSsoToken_str= getSsoToken();
      console.log("watch------getSsoToken_str", getSsoToken_str);
      // 监听路由变化
      this.reportUrl = "http://localhost:8075/webroot/decision/directory?ssoToken=" + getSsoToken_str;
    }
  }
};
</script>

