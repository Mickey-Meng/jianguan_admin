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


export default {

  name: "Job",
  data() {
    return {
      reportUrl: '',
      searchTableHeight: 0,
      searchTableWidth: 0
    };
  },
  created() {
// 从路由里动态获取 url地址   具体地址看libs下util.js里的 backendMenuToRoute  方法
    var queryString =this. getQueryString("view");

    console.log("=========", queryString)
    console.log("=========", this.$route.fullPath)
    this.reportUrl = "http://150.158.139.18:8085/jmreport/view/"+queryString;

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
    getQueryString(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
  },

  watch: {
    '$route': function () {
      // 监听路由变化
      console.log(this.reportUrl);
      // this.reportUrl = "http://150.158.139.18:8085/jmreport/view/1331503965770223616";
    }
  }
};
</script>

