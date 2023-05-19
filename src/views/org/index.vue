<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="机构名称" prop="orgName">
        <el-input
          v-model="queryParams.orgName"
          placeholder="请输入机构名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构编号" prop="orgCode">
        <el-input
          v-model="queryParams.orgCode"
          placeholder="机构编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构类型" prop="orgType">
        <el-select v-model="queryParams.orgType" placeholder="请选择机构类型" clearable size="small">
          <el-option
            v-for="dict in dict.type.org_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系人" prop="contactName">
        <el-input
          v-model="queryParams.contactName"
          placeholder="请输入联系人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['org:org:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['org:org:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['org:org:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="orgList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column label="机构名称" align="center" prop="orgName" >
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="300"
            trigger="hover"
            :disabled="scope.row.orgName && scope.row.orgName.length <= 12"
          >
            <div>{{ scope.row.orgName }}</div>
            <span slot="reference" v-if="scope.row.orgName && scope.row.orgName.length <= 12">{{scope.row.orgName}}</span>
            <span slot="reference" v-if="scope.row.orgName && scope.row.orgName.length > 12">{{scope.row.orgName.substr(0, 12) + "."}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="机构编号" align="center" prop="orgCode" />
      <el-table-column label="机构类型" align="center" prop="orgType" >
        <template slot-scope="scope">
          <span v-if="scope.row.orgType === '0'">商户</span>
          <span v-else-if="scope.row.orgType === '1'">政府</span>
          <span v-else-if="scope.row.orgType === '2'">服务商</span>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" align="center" prop="companyName" >
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="300"
            trigger="hover"
            :disabled="scope.row.companyName && scope.row.companyName.length <= 8"
          >
            <div>{{ scope.row.companyName }}</div>
            <span slot="reference" v-if="scope.row.companyName && scope.row.companyName.length <= 8">{{scope.row.companyName}}</span>
            <span slot="reference" v-if="scope.row.companyName && scope.row.companyName.length > 8">{{scope.row.companyName.substr(0, 8) + "."}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="公司法人" align="center" prop="companyRePerson" />
      <el-table-column label="联系人姓名" align="center" prop="contactName" />
      <el-table-column label="联系人电话" align="center" prop="contactPhone" />
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.row)"
            v-hasPermi="['org:org:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['org:org:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['org:org:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改机构对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-form-item label="机构信息"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构名称" prop="orgName">
              <el-input v-model="form.orgName" placeholder="请输入机构名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台角色" prop="roleType">
              <el-select v-model="form.roleType" placeholder="请选择平台角色" clearable size="small">
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
                <el-select v-model="form.orgType" placeholder="请选择机构类型" clearable size="small">
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
              <el-input v-model="form.licenseNumber" placeholder="请输入营业执照号" />
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
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入企业名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="公司电话" prop="companyPhone">
                <el-input v-model="form.companyPhone" placeholder="请输入公司电话" />
              </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="公司法人" prop="companyRePerson">
              <el-input v-model="form.companyRePerson" placeholder="请输入公司法人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="法人身份证号" prop="reIdcard">
                <el-input v-model="form.reIdcard" placeholder="请输入法人身份证号" />
              </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="creditCode">
              <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="注册资金" prop="registerAmount">
                <el-input v-model="form.registerAmount" placeholder="万元" />
              </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="注册地址" prop="registerAddress">
              <el-input v-model="form.registerAddress" placeholder="请输入注册地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="人员规模" prop="companyNum">
              <el-input v-model="form.companyNum" placeholder="请输入人员规模" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮编" prop="postCode">
              <el-input v-model="form.postCode" placeholder="请输入邮编" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="经营地址" prop="businessAddress">
              <el-input v-model="form.businessAddress" placeholder="请输入经营地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户编号" prop="companyCode">
              <el-input v-model="form.companyCode" placeholder="请输入商户编号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label=" 营业执照照片:" prop="licensePhoto">
              <upload-file
                :limit="itemPics.limit"
                @getFile="getItemPic"
                :fileType="itemPics.fileTypeList"
                ref="licensePhoto"
              ></upload-file>
              <div style="height: 20px; color: #faad14; font-size: 14px">
                最多上传1张，尺寸在800*800以上
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
              <el-form-item label="经营范围" prop="businessScope">
                <el-input v-model="form.businessScope" placeholder="请输入经营范围" />
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司简介" prop="companyIntroduction">
              <el-input type="textarea" :row="4" v-model="form.companyIntroduction" placeholder="请输入公司简介" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="发票信息"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发票名称" prop="invoiceName">
              <el-input v-model="form.invoiceName" placeholder="请输入发票名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税号" prop="taxCode">
              <el-input v-model="form.taxCode" placeholder="请输入税号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位地址" prop="companyAddress">
              <el-input v-model="form.companyAddress" placeholder="请输入单位地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话号码" prop="invoicePhone">
              <el-input v-model="form.invoicePhone" placeholder="请输入电话号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开户银行" prop="bankName">
              <el-input v-model="form.bankName" placeholder="请输入开户银行" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户账号" prop="bankNumber">
              <el-input v-model="form.bankNumber" placeholder="请输入开户账号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="联系人信息"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="contactName">
              <el-input v-model="form.contactName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="contactEmail">
              <el-input v-model="form.contactEmail" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通讯地址" prop="contactAddress">
              <el-input v-model="form.contactAddress" placeholder="请输入通讯地址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 机构导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--详情-->
    <details-pop
      @cancel="detailCancel"
      :detailInfo="detailInfo"
      :dialogFormVisible="detailsModel"
    ></details-pop>
  </div>
</template>

<script>
import { listOrg, getOrg, delOrg, addOrg, updateOrg, exportOrg, orgApprove, submitAudit } from "@/api/org";
import uploadFile from "../components/uploadFile";
import detailsPop from "./components/orgDetail"
import { getToken } from "@/utils/auth";

export default {
  name: "org",
  dicts: ['org_type', 'audit_status', 'role_type'],
  components:{
    uploadFile,
    detailsPop
  },
  data() {
    return {
      // 导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/org/importData"
      },
      formLabelWidth: "150px",
      //详情弹窗状态
      detailsModel: false,
      detailInfo:null,
      //营业执照
      itemPics: {
        limit: 1,
        fileTypeList: "jpg,png,jpeg",
        fileList: [],
      },
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 机构表格数据
      orgList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orgName: null,
        orgCode: null,
        orgType: null,
        contactName: null,
        contactAddress: null,
        auditStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orgName: [
          { required: true, message: "机构名称不能为空", trigger: "blur" },
        ],
        orgCode: [
          { required: true, message: "机构编号不能为空", trigger: "blur" },
        ],
        roleType: [
          { required: true, message: "平台角色不能为空", trigger: "blur" },
        ],
        orgType: [
          { required: true, message: "机构类型不能为空", trigger: "blur" },
        ],
        licenseNumber: [
          { required: true, message: "营业执照号不能为空", trigger: "blur" },
        ],
        licenseTime: [
          { required: true, message: "营业执照有效期不能为空", trigger: "blur" },
        ],
        companyName: [
          { required: true, message: "企业名称不能为空", trigger: "blur" },
        ],
        companyPhone: [
          { required: true, message: "公司电话不能为空", trigger: "blur" },
          {
            pattern:  /0\d{2,3}-\d{7,8}|\(?0\d{2,3}[)-]?\d{7,8}|\(?0\d{2,3}[)-]*\d{7,8}/,
            message: "请输入正确的电话号码",
            trigger: "blur",
          },
        ],
        companyRePerson: [
          { required: true, message: "公司法人不能为空", trigger: "blur" },
        ],
        reIdcard: [
          { required: true, message: "法人身份证不能为空", trigger: "blur" },
          {
            pattern:
              /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "请输入正确的身份证号码",
            trigger: "blur",
          },
        ],
        creditCode: [
          { required: true, message: "统一社会信用代码不能为空", trigger: "blur" },
        ],
        registerAmount: [
          { required: true, message: "注册资金不能为空", trigger: "blur" },
          {pattern : /^[1-9]\d{0,10}/, message: "请输入数字", trigger: "blur"}
        ],
        businessAddress: [
          { required: true, message: "经营地址不能为空", trigger: "blur" },
        ],
        postCode: [
          { required: true, message: "邮编不能为空", trigger: "blur" },
        ],
        businessScope: [
          { required: true, message: "经营范围不能为空", trigger: "blur" },
        ],
        companyNum: [
          { required: true, message: "人员规模不能为空", trigger: "blur" },
          {pattern : /^[1-9]\d{0,10}/, message: "请输入数字", trigger: "blur"}
        ],
        companyIntroduction: [
          { required: true, message: "公司简介不能为空", trigger: "blur" },
        ],
        invoiceName: [
          { required: true, message: "发票名称不能为空", trigger: "blur" },
        ],
        bankName: [
          { required: true, message: "开户行不能为空", trigger: "blur" },
        ],
        bankNumber: [
          { required: true, message: "开户账号不能为空", trigger: "blur" },
          {
            pattern: /^[0-9]{9,18}$/,
            message: "请输入正确的开户账号",
            trigger: "blur",
          },
        ],
        companyAddress: [
          { required: true, message: "单位地址不能为空", trigger: "blur" },
        ],
        contactName: [
          { required: true, message: "联系人姓名不能为空", trigger: "blur" },
        ],
        contactPhone: [
          { required: true, message: "联系人手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        contactEmail: [
          { required: true, message: "联系人邮箱不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        companyCode: [
          { required: true, message: "商户编号不能为空", trigger: "blur" },
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询机构列表 */
    getList() {
      this.loading = true;
      listOrg(this.queryParams).then(response => {
        this.orgList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
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
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加机构";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOrg(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改机构";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrg(this.form).then(response => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.licensePhoto = this.itemPics.fileList.join(',')
            if(!this.form.licensePhoto){
              this.$message.warning("营业执照照片不能为空")
              return
            }
            addOrg(this.form).then(response => {
              this.$message.success("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除当前的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOrg(ids);
        }).then(() => {
          this.getList();
          this.$message.success("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('org/export', {
        ...this.queryParams
      }, `机构_${this.parseTime(new Date(),"{y}-{m}-{d}")}.xlsx`)
    },
    review(file) {
      // let url = process.env.VUE_APP_BASE_API + file;
      let url = 'http://120.79.140.167:8089/files' + file;
      window.open(url, "_blank");
    },
    getItemPic(e, type) {
      let arr = [];
      e.map((item) => {
        arr.push(item.url);
      });
      this.itemPics.fileList = arr;
    },
    //打开详情弹窗
    handleDetail(e){
      getOrg(e.id).then(res => {
        this.detailInfo = res.data;
        this.detailsModel = true;
        this.id = res.data.id;
      });
    },
    // 取消详情弹窗
    detailCancel() {
      this.detailsModel = false;
    },
    //获取字符串时间
    parseTime(time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'undefined' || time === null || time === 'null') {
        return ''
      } else if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
          time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
          return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
          value = '0' + value
        }
        return value || 0
      })
      return time_str
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "机构导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('org/importTemplate', {
      }, `机构模板.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto; width:600px;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
