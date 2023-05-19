<template>
  <div>
    <el-upload
      class="upload"
      ref="upload"
      :action="uploadUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :headers="headers"
      :accept="fileType"
      :on-remove="handleRemove"
    >
      <div style="position:relative;">
        <span v-if="xing" style="color:red;position:absolute;left:-84px;top:2px">*</span>
        <el-button size="small" type="primary">选择文件</el-button>
      </div>
    </el-upload>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth"
export default {
  props: {
    linkfileList: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 5
    },
    fileType: {
      type: String,
      default: ""
    },
    xing: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      type: this.fileType || '',
      xingxing: this.xing,
      uploadUrl: process.env.VUE_APP_BASE_API + "/common/upload",
      headers: {
        // Authorization: "Bearer " + getToken()
      },
      fileList: []
      // fileType: "DOC,DOCX,XLS,XLSX,PPT,PDF,TXT,JPG,JPEG,PNG,BMP,GIF"
    }
  },
  watch: {
    linkfileList: {
      immediate: true,
      handler () {
        this.fileList = this.linkfileList
      },
    }
  },
  mounted(){
    // this.$refs.upload.clearFiles()
    // this.cleanFile()
    // this.handleChange()
    // this.$refs.upload.clearFiles()
    // console.log();
    let files = this.$refs.upload
    if(files && files.length){
      files.forEach(item => {
        item.clearFiles()
      })
    }
  },
  methods: {
    // 上传前校检格式和大小
    handleBeforeUpload (file) {
      this.type = 'doc,docx,xls,xlsx,ppt,pdf,jpg,png,jpeg'
      if (this.fileType) {
        this.type = this.fileType
      }
      // 校检文件类型
      if (this.type) {
        let fileExtension = ""
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1)
        }
        this.type = this.type.split(',')
        const isTypeOk = this.type.some(type => {
          if (file.type.indexOf(type) > -1) return true
          if (fileExtension && fileExtension.indexOf(type) > -1) return true
          return false
        })
        if (!isTypeOk) {
          this.$message.error(
            `文件格式不正确, 请上传${this.type.join("/")}格式文件!`
          )
          return false
        }
      }
      if (file.name.length > 50) {
        this.$message.error("文件名长度不能超过50个字")
        return false
      }
      return true
    },
    // 文件个数超出
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制只能上传 ${this.limit} 个文件`)
    },
    getFile (type) {
      this.$emit("getFile", this.fileList, type)
    },
    // 上传失败
    handleUploadError (err) {
      this.$message.error("上传失败, 请重试")
    },
    // 上传成功回调
    handleUploadSuccess (res, file, fileList) {
      this.$message.success("上传成功")
     if(res.fileName){
          let name = res.fileName.split('/')
          let index = name.length-1
          let fileName = name[index]
          this.fileList.push({ name: fileName, url: res.fileName })
     }else{
          this.fileList.push({ name: res.fileName, url: res.fileName })
     }
     this.getFile()
    },
    handleRemove (file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      this.getFile()
    }
  }
};
</script>
