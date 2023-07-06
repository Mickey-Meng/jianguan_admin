<template>
    <div style="height:100%">
      <office-editor ref="officeEditor" :option="option" :document-url="documentUrl"></office-editor>
    </div>
  </template>

<script>
import editor from './editor'
import Vue from 'vue'
import officeEditor from "./officeEditor";

export default {
  name: 'OnlineCat',
  components: { officeEditor },
  data() {
    return {
      id: this.$route.params.id,
      option: {
        url: '',
        isEdit: true,
        fileType: '',
        title: '',
        //token: Vue.ls.get(ACCESS_TOKEN),
        user: {
          id: '',
          name: ''
        },
        mode: 'edit',
        editUrl: '',
        key: ''
      },
    }
  },
  created() {
    let userInfo = Vue.ls.get(USER_INFO)
    this.option.user.id = userInfo.id
    this.option.user.name = userInfo.realname
    this.getFile()
  },
  methods: {
    getFile() {
      getAction('/onlyfile/file/queryById', { id: this.id }).then(res => {
        this.option.url = window._CONFIG['officeUrl'] + '/' + res.result.fileUrl
        this.option.editUrl = window._CONFIG['callBackUrl'] + '?userId=' + this.option.user.id + '&fileId=' + this.id
        this.option.title = res.result.fileName
        this.option.fileType = res.result.fileExt
      })
    }
  },
  watch: {
    '$route'(to, from) {
      this.id = to.params.id
      this.getFile()
    }
  }
}
</script>

<style scoped>

</style>