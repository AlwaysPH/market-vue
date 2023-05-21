<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="85px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="业务划分" prop="businessType">
            <el-select v-model="queryParams.businessType" placeholder="请选择业务划分" clearable size="small">
              <el-option
                v-for="dict in dict.type.business_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优惠券名称" prop="couponAdd">
            <el-input
              v-model="queryParams.couponName"
              placeholder="请输入优惠券名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优惠券码" prop="couponCode">
            <el-input
              v-model="queryParams.couponCode"
              placeholder="请输入优惠券码"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="优惠类型" prop="couponType">
            <el-select v-model="queryParams.couponType" placeholder="请选择优惠类型" clearable size="small">
              <el-option
                v-for="dict in dict.type.coupon_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['coupon:coupon:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['coupon:coupon:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column label="优惠券名称" align="center" prop="couponName" />
      <el-table-column label="优惠券类型" align="center" prop="couponType">
        <template slot-scope="scope">
          <span v-if="scope.row.couponType === '0'">满减券</span>
          <span v-else-if="scope.row.couponType === '1'">折扣券</span>
          <span v-else-if="scope.row.couponType === '2'">代金券</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券码" align="center" prop="couponCode" />
      <el-table-column label="关联活动数量" align="center" prop="contactNum">
        <template slot-scope="scope">
          <router-link :to="'/template/contact/index/' + scope.row.id" class="link-type">
            <span>{{ scope.row.contactNum }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="券图片" align="center" prop="couponPhoto">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="review(form.couponPhoto)"
            v-if="scope.row.couponPhoto"
          >点击查看
          </el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.row)"
            v-hasPermi="['coupon:coupon:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['coupon:coupon:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['coupon:coupon:remove']"
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

    <!--优惠类型弹窗-->
    <el-dialog title="优惠类型" :visible.sync="couponTypeModel" width="600px" append-to-body :close-on-click-modal="false" :before-close="handleClose">
      <el-form ref="form" :model="typeInfo">
        <el-form-item label="业务划分" prop="businessType">
          <el-select v-model="typeInfo.businessType" placeholder="请选择业务划分" clearable size="small">
            <el-option
              v-for="dict in dict.type.business_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠类型" prop="couponType">
          <el-select v-model="typeInfo.couponType" placeholder="请选择优惠类型" clearable size="small">
            <el-option
              v-for="dict in dict.type.coupon_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nextUp">下一步</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改优惠券信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-form-item label="基本信息"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="优惠类型" prop="couponType">
              <el-select v-model="form.couponType" placeholder="请选择优惠类型" disabled size="small">
                <el-option
                  v-for="dict in dict.type.coupon_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠券系统内名称" prop="couponAdd">
              <el-input v-model="form.couponAdd" placeholder="请输入优惠券系统内名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="优惠券名称" prop="couponName">
              <el-input v-model="form.couponName" placeholder="请输入优惠券名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="优惠券图片" prop="couponPhoto">
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
            <el-form-item label="使用说明" prop="useDesc">
              <el-input type="textarea" :row="4" v-model="form.useDesc" placeholder="请输入使用说明" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="基本规则"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label=" 领取方式" prop="sendType">
              <el-radio v-model="form.sendType" label="1">自动发放</el-radio>
              <el-radio v-model="form.sendType" label="2">手动领取</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="领取条件说明" prop="conditionDesc">
              <el-input v-model="form.conditionDesc" placeholder="请输入领取条件说明" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每人限领" prop="personLimit">
              <el-input type="number" v-model="form.personLimit" placeholder="请输入每人限领" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="券每日限领" prop="dateLimit">
              <el-input type="number" v-model="form.dateLimit" placeholder="请输入券每日限领" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每台设备每日限领" prop="machineLimit">
              <el-input type="number" v-model="form.machineLimit" placeholder="请输入每台设备每日限领" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="使用门槛"></el-form-item>
        </el-row>
        <!--满减券-->
        <el-row v-if="form.couponType === '0'">
          <el-col :span="20 ">
            <el-form-item label="">
              <el-radio v-model="form.restrictionType" label="0">无限制</el-radio>
              <span style="line-height: 35px;">面额
                <el-input type="number" placeholder="限定数额0.01-5" v-model="form.disAmount" style="width: 180px;margin-left: 10px;"/>
                元</span>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <el-radio v-model="form.restrictionType" label="1">固定满减</el-radio>
              <span style="line-height: 35px;">
                满<el-input type="number" placeholder="仅支持2位小数" v-model="form.fullFixSubCondition" style="width: 150px;margin-left: 10px;"/>元使用，面额
                <el-input type="number" placeholder="限定数额0.01-100" v-model="form.disFixAmount" style="width: 180px;margin-left: 10px;"/>元
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <el-radio v-model="form.restrictionType" label="2">阶梯满减</el-radio>
              <div v-for="(item, index) in form.conditionList" :key="index" style="margin-left: 14%; margin-top: 1%;">
                <span style="line-height: 35px;">
                  满<el-input type="number" placeholder="仅支持2位小数" v-model="item.fullSubCondition"  style="width: 150px;margin-left: 10px;"/>元，减
                  <el-input type="number" placeholder="仅支持2位小数" v-model="item.fullSubAmount"  style="width: 150px;margin-left: 10px;"/>元
                  <el-button style="margin-left: 5%;" @click="deleteCondition(index)">
                    –
                  </el-button>
                </span>
              </div>
              <div  style="margin-left: 14%;margin-top: 2%;">
                <el-button @click="addCondition"> + </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!--折扣券-->
        <el-row v-else-if="form.couponType === '1'">
          <el-col :span="12 ">
            <el-form-item label="满额限制" prop="fullRestriction">
                <el-input type="number" style="width: 120px;" v-model="form.fullRestriction" /> 元
            </el-form-item>
          </el-col>
          <el-col :span="12 ">
            <el-form-item label="折扣比例" prop="saleNum">
              <el-input type="number" style="width: 100px;" v-model="form.saleNum" /> %
            </el-form-item>
          </el-col>
          <el-col :span="12 ">
            <el-form-item label="折扣上限" prop="upperLimitFlag">
              <el-radio v-model="form.upperLimitFlag" label="0">不限</el-radio>
              <el-radio v-model="form.upperLimitFlag" label="1">优惠上限</el-radio>
              <el-input style="width: 100px;" type="number" v-model="form.upperLimitAmount" /> 元
            </el-form-item>
          </el-col>
        </el-row>
        <!--代金券-->
        <el-row v-else-if="form.couponType === '2'">
          <el-col :span="12 ">
            <el-form-item label="">
              <span style="line-height: 35px;">面额
                <el-input v-model="form.faceMoney" style="width: 100px;margin-left: 10px;"/>
                元，订单须满<el-input v-model="form.orderAmount" style="width: 100px;margin-left: 10px;"/>元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label=" 券核销渠道" prop="verChannel">
              <el-select v-model="form.verChannel" placeholder="请选择券核销渠道" size="small">
                <el-option
                  v-for="dict in dict.type.ver_channel"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label=" 支付类型" prop="payType">
              <el-select v-model="form.payType" placeholder="请选择支付类型" size="small">
                <el-option
                  v-for="dict in dict.type.pay_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
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
import { listInfo, getInfo, delInfo, addInfo, updateInfo, exportInfo } from "@/api/template";
import uploadFile from "../components/uploadFile";
import detailsPop from './components/couponDetail'

export default {
  name: "temp",
  dicts: ['business_type', 'coupon_type', 'ver_channel', 'pay_type'],
  components:{
    uploadFile,
    detailsPop,
  },
  data() {
    return {
      // 日期范围
      dateRange: [],
      //详情弹窗状态
      detailsModel: false,
      detailInfo:null,
      //优惠券图
      itemPics: {
        limit: 1,
        fileTypeList: "jpg,png,jpeg",
        fileList: [],
      },
      //优惠类型弹窗
      couponTypeModel:false,
      typeInfo: {
        businessType: null,
        couponType: null,
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
      // 优惠券信息表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        businessType: null,
        couponType: null,
        couponAdd: null,
        couponName: null,
        couponCode: null,
        couponPhoto: null,
        useDesc: null,
        verChannel: null,
        payType: null,
        sendType: null,
        restrictionType: null,
        fullSubCondition: null,
        fullFixSubCondition: null,
        fullSubAmount: null,
        disFixAmount: null,
        disAmount: null,
        fullRestriction: null,
        saleNum: null,
        upperLimitFlag: null,
        upperLimitAmount: null,
        faceMoney: null,
        orderAmount: null,
      },
      // 表单参数
      form: {
        //阶梯满减
        conditionList:[{ fullSubCondition: '',  fullSubAmount: ''}],
      },
      // 表单校验
      rules: {
        couponAdd: [
          { required: true, message: "优惠券系统内名称不能为空", trigger: "blur" }
        ],
        couponName:[
          { required: true, message: "优惠券名称不能为空", trigger: "blur" }
        ],
        useDesc: [
          { required: true, message: "使用说明不能为空", trigger: "blur" }
        ],
        verChannel: [
          { required: true, message: "核销渠道不能为空", trigger: "blur" }
        ],
        payType: [
          { required: true, message: "支付类型不能为空", trigger: "blur" }
        ],
        sendType:[
          { required: true, message: "领取方式不能为空", trigger: "blur" }
        ],
        conditionDesc:[
          { required: true, message: "条件说明不能为空", trigger: "blur" }
        ],
        personLimit:[
          { required: true, message: "每人限领不能为空", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入正确的数字",
            trigger: "blur"
          }
        ],
        dateLimit:[
          { required: true, message: "每日限领不能为空", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入正确的数字",
            trigger: "blur"
          }
        ],
        machineLimit:[
          { required: true, message: "每台限领不能为空", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入正确的数字",
            trigger: "blur"
          }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询优惠券信息列表 */
    getList() {
      this.loading = true;
      listInfo(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.couponTypeModel = false
      this.typeInfo.businessType = ''
      this.typeInfo.couponType = ''
      this.reset();
    },
    handleClose(){
      this.typeInfo.couponType = null
      this.typeInfo.businessType = null
      this.couponTypeModel = false
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        businessType: null,
        couponType: null,
        couponAdd: null,
        couponName: null,
        couponCode: null,
        couponPhoto: null,
        useDesc: null,
        verChannel: null,
        payType: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        conditionDesc: null,
        personLimit: null,
        dateLimit: null,
        machineLimit: null,
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
      this.couponTypeModel = true
    },
    //下一步
    nextUp(){
      if(!this.typeInfo.businessType){
        this.$message.warning("请选择业务划分")
        return
      }
      if(!this.typeInfo.couponType){
        this.$message.warning("请选择优惠类型")
        return
      }
      this.open = true;
      this.title = "添加优惠券信息";
      this.form.businessType = this.typeInfo.businessType
      this.form.couponType = this.typeInfo.couponType
        this.form.conditionList = [{ fullSubCondition: '',  fullSubAmount: ''}]
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改优惠券信息";
        if(response.data.restrictionType === '0' || response.data.restrictionType === '1' ){
          this.form.conditionList = [{ fullSubCondition: '',  fullSubAmount: ''}]
        }else if(response.data.restrictionType === '2'){
          this.form.conditionList = response.data.conditionList
        }

      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.judgeCouponType(this.form)){
            if (this.form.id != null) {
              updateInfo(this.form).then(response => {
                this.$message.success("修改成功");
                this.open = false;
                this.couponTypeModel = false
                this.typeInfo.businessType = ''
                this.typeInfo.couponType = ''
                this.itemPics.fileList = []
                this.$refs.licensePhoto.fileList = []
                this.getList();
              });
            } else {
              this.form.couponPhoto = this.itemPics.fileList.join(',')
              if(!this.form.couponPhoto){
                this.$message.warning("优惠券图不能为空")
                return
              }
              addInfo(this.form).then(response => {
                this.$message.success("新增成功");
                this.open = false;
                this.couponTypeModel = false
                this.typeInfo.businessType = ''
                this.typeInfo.couponType = ''
                this.itemPics.fileList = []
                this.$refs.licensePhoto.fileList = []
                this.getList();
              });
            }
          }
        }
      });
    },
    //各项输入判断
    judgeCouponType(e){
      let form = e
      let regex = /^([0-9]|[1-9]\d+)(\.\d{1,2})?$/
      let numRe = new RegExp(regex)
      if(form.couponType === '0'){
        //满减券
        if(form.restrictionType === '0'){
          //无限制
          if(!form.disAmount){
            this.$message.warning("请输入面额")
            return
          }
          if(!numRe.test(form.disAmount) || form.disAmount < 0.01 || form.disAmount > 5){
            this.$message.warning("请输入正确的面额")
            return
          }
          this.form.fullFixSubCondition = null
          this.form.disFixAmount = null
          this.form.conditionList = [{fullSubCondition: '',  fullSubAmount: ''}]
        }else if(form.restrictionType === '1'){
          //固定满减
          if(!form.fullFixSubCondition){
            this.$message.warning("请输入满减条件金额")
            return
          }
          if(!numRe.test(form.fullFixSubCondition)){
            this.$message.warning("请输入正确的满减条件金额")
            return
          }
          if(!form.disFixAmount){
            this.$message.warning("请输入满减金额")
            return
          }
          if(!numRe.test(form.disFixAmount) || form.disFixAmount < 0.01 || form.disFixAmount > 100){
            this.$message.warning("请输入正确的满减金额")
            return
          }
          this.form.disAmount = null
          this.form.conditionList = [{fullSubCondition: '',  fullSubAmount: ''}]
        }else  if(form.restrictionType === '2'){
          //阶梯满减
          let list = form.conditionList
          list.forEach(item => {
            if(!item.fullSubCondition){
              this.$message.warning("请输入满减条件金额")
              return
            }
            if(!numRe.test(item.fullSubCondition)){
              this.$message.warning("请输入正确的满减条件金额")
              return
            }
            if(!item.fullSubAmount){
              this.$message.warning("请输入满减金额")
              return
            }
            if(!numRe.test(item.fullSubAmount)){
              this.$message.warning("请输入正确的满减金额")
              return
            }
          })
          this.form.fullFixSubCondition = null
          this.form.disFixAmount = null
          this.form.disAmount = null
        }
      }else if(form.couponType === '1'){
        //折扣券
        if(!form.fullRestriction){
          this.$message.warning("请输入满额限制金额")
          return
        }
        if(!numRe.test(form.fullRestriction)){
          this.$message.warning("请输入正确的满额限制金额")
          return
        }
        if(!form.saleNum){
          this.$message.warning("请输入满折扣比例")
          return
        }
        if(!numRe.test(form.saleNum) || form.saleNum < 0 || form.saleNum > 100){
          this.$message.warning("请输入正确的折扣比例")
          return
        }
        if(form.upperLimitFlag === '1'){
          if(!form.upperLimitAmount){
            this.$message.warning("请输入上限满额金额")
            return
          }
          if(!numRe.test(form.upperLimitAmount)){
            this.$message.warning("请输入正确的上限满额金额")
            return
          }
        }
      }else if(form.couponType === '2'){
        //代金券
        if(!form.faceMoney){
          this.$message.warning("请输入面额")
          return
        }
        if(!numRe.test(form.faceMoney)){
          this.$message.warning("请输入正确的面额")
          return
        }
        if(!form.orderAmount){
          this.$message.warning("请输入订单金额")
          return
        }
        if(!numRe.test(form.orderAmount)){
          this.$message.warning("请输入正确的订单金额")
          return
        }
      }
      return true
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除当前优惠券数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInfo(ids);
        }).then(() => {
          this.getList();
        this.$message.success("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('coupon/export', {
        ...this.queryParams
      }, `优惠券_${this.parseTime(new Date(),"{y}-{m}-{d}")}.xlsx`)
    },
    getItemPic(e, type) {
      let arr = [];
      e.map((item) => {
        arr.push(item.url);
      });
      this.itemPics.fileList = arr;
    },
    review(file) {
      let url = 'http://120.79.140.167:8089/files' + file;
      window.open(url, "_blank");
    },
    //阶梯满减薪资新增输入框
    addCondition(){
      if (this.form.conditionList.length > 0) {
        this.form.conditionList.push({ fullSubCondition: '',  fullSubAmount: ''});
      }
    },
    //阶梯满减薪资删除输入框
    deleteCondition(item, index) {
      if (this.form.conditionList.length > 1) {
        this.form.conditionList.splice(index, 1);
      } else {
        this.$message.warning('至少选择一项');
      }
    },
    //打开详情弹窗
    handleDetail(e){
      getInfo(e.id).then(res => {
        this.detailInfo = res.data;
        this.detailsModel = true;
        this.id = res.data.id;
      });
    },
    // 取消详情弹窗
    detailCancel() {
      this.detailsModel = false;
    },
  }
};
</script>
