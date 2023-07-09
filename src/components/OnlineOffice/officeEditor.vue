<!--onlyoffice 编辑器-->
<template>
    <div id="editorOffice"></div>
</template>
<script>
import {handleDocType} from "@/utils/documentType"
export default {
    name: 'OfficeEditor',
    props: {
        option: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            doctype: ''
        }
    },
    mounted() {
        if (this.option.url) {
           // this.initEditor();
            this.setEditor(this.option)
        }
    },
    methods: {
        initEditor() {
            // 加入 onlyoffice api.js 脚本
            const apiScriptDom = document.getElementById("onlyoffice-document-api");
            
            const script = document.createElement("script");
            const {protocol} = window.location;

            const ONLYOFFICE_DOCUMENT_HOST = process.env.ONLYOFFICE_DOCUMENT_HOST;
            const ONLYOFFICE_DOCUMENT_PORT=process.env.ONLYOFFICE_DOCUMENT_PORT;
            
            const ONLYOFFICE_DOCUMENT_URL=process.env.ONLYOFFICE_DOCUMENT_URL;
            
            script.setAttribute("id", "onlyoffice-document-api");
            script.setAttribute(
                "src",
                `${ONLYOFFICE_DOCUMENT_HOST +
                ":" +
                ONLYOFFICE_DOCUMENT_PORT +
                ONLYOFFICE_DOCUMENT_URL}`
            );
            document.body.appendChild(script);
            const _self = this;
            script.onload = () => {
                _self.scriptReady = true;
                console.log("initEditor 初始化组件完成！");
                if (_self.option.url) {
                _self.setEditor(_self.option);
                }
            };
        },
        setEditor(option) {
            this.doctype = handleDocType(option.fileType);
            // office配置参数
            let config = {
                document: {
                    fileType: option.fileType,
                    key: "",
                    title: option.title,
                    permissions: {
                        comment: false,
                        download: false,
                        modifyContentControl: true,
                        modifyFilter: true,
                        print: false,
                        edit: option.isEdit,//是否可以编辑: 只能查看，传false
                        // "fillForms": true,//是否可以填写表格，如果将mode参数设置为edit，则填写表单仅对文档编辑器可用。 默认值与edit或review参数的值一致。
                        // "review": true //跟踪变化
                    },
                    url: option.url
                },
                documentType: this.doctype,
                editorConfig: {
                    callbackUrl: option.editUrl,//"编辑word后保存时回调的地址，这个api需要自己写了，将编辑后的文件通过这个api保存到自己想要的位置
                    lang: "zh",//语言设置
                    customization: {
                        commentAuthorOnly: false,
                        comments: true,
                        compactHeader:false,
                        compactToolbar:true,
                        feedback:false,
                        plugins:true,
                        autosave: false,//是否自动保存
                        chat: false,
                        help: false,
                        // "hideRightMenu": false,//定义在第一次加载时是显示还是隐藏右侧菜单。 默认值为false
                        logo: {
                            image: "https://file.iviewui.com/icon/viewlogo.png",
                            imageEmbedded: "https://file.iviewui.com/icon/viewlogo.png",
                        },
                        spellcheck: true,//拼写检查
                        user:{
                            id:option.user.id,
                            name:option.user.name
                        },
                        mode:option.model?option.model:'edit',
                    },
                },
                width: "100%",
                height: "100%",
                token:option.token
            };
            let docEditor = new DocsAPI.DocEditor("editorOffice", config);
        },
    },
    watch: {
        option: {
            handler: function (n, o) {
                this.doctype = handleDocType(n.fileType);
                if (this.scriptReady) {
                    this.setEditor(n);
                }
            },
            deep: true,
        }
    }
}
</script>