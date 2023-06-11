<!-- 机构信息弹窗 -->
<template>
  <div id="container">
    <el-dialog
      width="1200px"
      title="机构信息"
      :before-close="handleClose"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form"  label-width="150px">
        <el-row>
          <el-form-item label="机构信息"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构名称" prop="orgName">
              <el-input v-model="form.orgName" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台角色" prop="roleType">
              <el-select v-model="form.roleType" disabled clearable size="small">
                <el-option
                  v-for="dict in dict.type.role_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构类型" prop="orgType">
              <el-select v-model="form.orgType" disabled clearable size="small">
                <el-option
                  v-for="dict in dict.type.org_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照号" prop="licenseNumber">
              <el-input v-model="form.licenseNumber" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="营业执照有效期限" prop="licenseTime">
              <el-date-picker
                v-model="form.licenseTime"
                type="date"
                format="yyyy-MM-dd"
                autocomplete="off" disabled>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="form.companyName" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司电话" prop="companyPhone">
              <el-input v-model="form.companyPhone" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司法人" prop="companyRePerson">
              <el-input v-model="form.companyRePerson" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="法人身份证号" prop="reIdcard">
              <el-input v-model="form.reIdcard" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="creditCode">
              <el-input v-model="form.creditCode" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="注册资金" prop="registerAmount">
              <el-input v-model="form.registerAmount" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册地址" prop="registerAddress">
              <el-input v-model="form.registerAddress" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="人员规模" prop="companyNum">
              <el-input v-model="form.companyNum" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮编" prop="postCode">
              <el-input v-model="form.postCode" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经营地址" prop="businessAddress">
              <el-input v-model="form.businessAddress" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户编号" prop="companyCode">
              <el-input v-model="form.companyCode" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label=" 营业执照照片:" prop="licensePhoto">
              <el-button
                type="primary"
                @click="review(form.licensePhoto)"
                v-if="form.licensePhoto"
              >点击查看
              </el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经营范围" prop="businessScope">
              <el-input v-model="form.businessScope" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司简介" prop="companyIntroduction">
              <el-input type="textarea" :row="4" v-model="form.companyIntroduction" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="发票信息"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发票名称" prop="invoiceName">
              <el-input v-model="form.invoiceName" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税号" prop="taxCode">
              <el-input v-model="form.taxCode" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位地址" prop="companyAddress">
              <el-input v-model="form.companyAddress" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话号码" prop="invoicePhone">
              <el-input v-model="form.invoicePhone" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开户银行" prop="bankName">
              <el-input v-model="form.bankName" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户账号" prop="bankNumber">
              <el-input v-model="form.bankNumber" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="联系人信息"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="contactName">
              <el-input v-model="form.contactName" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="contactPhone">
              <el-input v-model="form.contactPhone" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="contactEmail">
              <el-input v-model="form.contactEmail" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通讯地址" prop="contactAddress">
              <el-input v-model="form.contactAddress" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" id="accountInfo-business-check-cancel"
        >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "orgDetail",
    props: ["dialogFormVisible", "detailInfo"],
    dicts: ['org_type', 'audit_status', 'role_type'],
    data() {
      return {
        form:{
          orgCode: null,
          roleId: null,
          orgType: null,
          licenseNumber: null,
          licenseTime: null,
          licensePhoto: null,
          companyName: null,
          companyPhone: null,
          companyRePerson: null,
          reIdcard: null,
          creditCode: null,
          registerAmount: null,
          businessAddress: null,
          postCode: null,
          businessScope: null,
          companyIntroduction: null,
          invoiceName: null,
          bankName: null,
          bankNumber: null,
          taxCode: null,
          companyAddress: null,
          contactName: null,
          contactPhone: null,
          contactEmail: null,
          contactAddress: null,
          delFlag: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          roleType:null,
          registerAddress:null,
          companyNum:null,
          companyCode:null,
          invoicePhone:null,
        },
        formLabelWidth: "120px",
      };
    },
    created() {},
    watch: {
      detailInfo: {
        handler(newName, oldName) {
          if(this.detailInfo){
            this.form = newName
          }
        },
        immediate: true,
        deep: true
      },
    },
    mounted() {
    },
    methods: {
      handleClose(done) {
        this.close();
      },
      close(){
        this.$emit("cancel");
      },
      // 取消按钮
      cancel() {
        this.$emit("cancel");
      },
      review(file) {
        let url = 'http://106.14.63.214:8990/files' + file;
        window.open(url, "_blank");
      },
    },
  };
</script>

<style scoped="scoped" lang="scss">
  .dialog-footer {
    width: 40%;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
  }
</style>

