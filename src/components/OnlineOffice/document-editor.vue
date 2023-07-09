<template>
  <el-dialog :title="title" :visible.sync="officeOpen" width="1100px" append-to-body>
    <onlyoffice-editor :loading="loading.editor" :config="editorConfig">
      <span slot="actions">
        <a-button type="primary" @click="onSave" :loading="loading.save">保存</a-button>
      </span>
    </onlyoffice-editor>
  </el-dialog>
</template>

<script>
import OnlyofficeEditor from './onlyoffice-editor'
import { queryDocumentInfo, forceSaveDocumentInfo } from '@/api/onlyoffice/onlyoffice'

export default {
  props: ['documentInfo'],
  data () {
    return {
      officeOpen: false,
      loading: {
        editor: false,
        save: false
      },
      detail: {},
      editorConfig: {}
    }
  },
  components: {
    OnlyofficeEditor
  },
  created () {
    this.queryDocumentInfo()
  },
  methods: {
    // 显示弹框
    openOnlineOffice() {
      this.officeOpen = true;
      this.title = "在线编辑" + this.documentInfo.originalName;
      this.queryDocumentInfo();
    },
    // 获取文档配置信息
    queryDocumentInfo () {
      this.loading.editor = true;

      this.editorConfig = {
        // 文档配置
        document: {
          // 文件类型
          fileType: this.documentInfo.fileSuffix.substring(this.documentInfo.fileSuffix.lastIndexOf(".") +1 ),
          // 文档标识符
          key: this.documentInfo.ossId,
          // 文档地址，绝对路径
          url: this.documentInfo.url,
          // 文档标题
          title: this.documentInfo.originalName
        }
      };
      console.log(this.editorConfig);
      /**
       queryDocumentInfo({ key: 'test3.docx' })
        .then(res => {
          const data = res.data || {}
          const { id, remarks } = data
          this.detail = { id, remarks }
          this.editorConfig = data.editorConfig
        })
        .finally(() => {
          this.loading.editor = false
        })
       */
        
    },
    // 保存
    onSave () {
      this.loading.save = true
      const { key } = this.editorConfig.document
      const { id } = this.detail
      forceSaveDocumentInfo({ key, id })
        .then(res => {
          if (res.code === 0) {
            this.$message.success('保存成功')
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loading.save = false
        })
    }
  }
}
</script>
