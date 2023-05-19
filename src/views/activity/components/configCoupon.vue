<template>
  <div class="app-container">
    <el-dialog
      width="1200px"
      title="配置优惠券"
      :before-close="handleClose"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
    <el-form :model="form" :rules="rules" :inline="true" label-width="250px">
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary"  size="mini" @click="addCoupon">关联优惠券</el-button>
<!--            <el-button size="mini" @click="deleteCoupon">删除券</el-button>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="已选优惠券信息" name="1">
              <el-table :data="infoList">
                <el-table-column label="id" v-if="false" align="center" prop="id" />
                <el-table-column label="优惠券名称" align="center" prop="couponName" />
                <el-table-column label="优惠券类型" align="center" prop="couponType">
                  <template slot-scope="scope">
                    <span v-if="scope.row.couponType === '0'">满减券</span>
                    <span v-else-if="scope.row.couponType === '1'">折扣券</span>
                    <span v-else-if="scope.row.couponType === '2'">代金券</span>
                  </template>
                </el-table-column>
                <el-table-column label="优惠券码" align="center" prop="couponCode" />
                <el-table-column label="优惠金额" align="center" prop="couponAmount" />
                <el-table-column label="库存数量" align="center" prop="inventoryNum" />
                <el-table-column label="已发放数量" align="center" prop="grantNum" />
                <el-table-column label="原剩余库存" align="center" prop="surplus" />
                <el-table-column label="本次发放数量" align="center" prop="nowGrantNum" />
                <el-table-column label="本次发放后剩余库存" align="center" prop="nowSurplus" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
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
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="领取门槛" prop="receiveType">
            <el-radio v-model="form.receiveType" label="0">全部用户</el-radio>
            <el-radio v-model="form.receiveType" label="1">新用户</el-radio>
            <el-radio v-model="form.receiveType" label="2">首单</el-radio>
            <el-radio v-model="form.receiveType" label="3">指定用户</el-radio>
<!--            <el-button type="primary" v-if="form.receiveType === '3'" size="mini" @click="addUser">去添加</el-button>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="券使用有效期" prop="effectType"></el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12" style="margin-left: 20%">
          <el-form-item>
            <el-radio v-model="form.effectType" label="0">固定日期</el-radio>
            <el-date-picker
              v-model="form.effectStartTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>至
            <el-date-picker
              v-model="form.effectEndTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" style="margin-left: 20%">
          <el-form-item>
            <el-radio v-model="form.effectType" label="1">领取后</el-radio>
            <span style="line-height: 35px;"><el-input style="width: 150px;margin-left: 10px;" type="number" v-model="form.takeDateNum"/>天生效，有效期
            <el-input style="width: 150px;margin-left: 10px;" type="number" v-model="form.effectDateNum"/></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label=" 剩余库存预警条件"></el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="剩余库存预警（张）" prop="alarmNum">
            <el-input type="number" v-model="form.alarmNum" placeholder="请输入剩余库存预警" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预警内容" prop="alarmContent">
            <el-input type="textarea" :row="4" v-model="form.alarmContent" placeholder="请输入预警内容" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="预警手机号" prop="alarmPhone">
            <el-input v-model="form.alarmPhone" placeholder="请输入预警手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预警邮箱" prop="alarmEmail">
            <el-input v-model="form.alarmEmail" placeholder="请输入预警邮箱" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label=" 配置叠加规则"></el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动内同类型卡券是否允许叠加使用" prop="sameActivityFlag">
            <el-radio v-model="form.sameActivityFlag" label="0">否(默认)</el-radio>
            <el-radio v-model="form.sameActivityFlag" label="1">是</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动内不同类型卡券是否允许叠加使用" prop="diffActivityFlag">
            <el-radio v-model="form.diffActivityFlag" label="0">否(默认)</el-radio>
            <el-radio v-model="form.diffActivityFlag" label="1">是</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否允许与其他活动的卡券叠加使用" prop="outActivityFlag">
            <el-radio v-model="form.outActivityFlag" label="0">否(默认)</el-radio>
            <el-radio v-model="form.outActivityFlag" label="1">是</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="confirm"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!--新增关联优惠券弹窗-->
    <el-dialog
      width="1200px"
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="couponForm" :rules="couponRules">
        <el-row>
          <el-col :span="10">
            <el-form-item label="业务划分" prop="businessType" label-width="180px">
              <el-select v-model="couponForm.businessType" :disabled="editFlag" placeholder="请选择业务划分" clearable size="small">
                <el-option
                  v-for="dict in dict.type.business_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
            <el-col :span="10">
              <el-form-item label="优惠类型" prop="couponType" label-width="180px">
                <el-select v-model="couponForm.couponType" :disabled="editFlag" placeholder="请选择优惠类型" @change="firstChange" clearable size="small">
                  <el-option
                    v-for="dict in dict.type.coupon_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="优惠券名称" prop="couponName" label-width="180px">
              <el-select v-model="couponForm.couponName" :disabled="editFlag" placeholder="请选择优惠券名称" @change="couponNameChange" clearable size="small">
                <el-option
                  v-for="dict in couponNameList"
                  :key="dict.id"
                  :label="dict.couponName"
                  :value="dict.couponName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="优惠券码" prop="couponCode" label-width="180px">
              <el-input  v-model="couponForm.couponCode" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="优惠金额" prop="couponAmount" label-width="180px">
              <el-input v-model="couponForm.couponAmount" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="库存数量" prop="inventoryNum" label-width="180px">
              <el-input type="number" v-model="couponForm.inventoryNum" placeholder="请输入库存数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="已发放数量" prop="grantNum" label-width="180px">
              <el-input type="number" v-model="couponForm.grantNum" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="原剩余库存" prop="surplus" label-width="180px">
              <el-input type="number" v-model="couponForm.surplus" disabled />
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-row>-->
<!--          <el-col :span="10">-->
<!--            <el-form-item label="本次发放数量" prop="nowGrantNum" label-width="180px">-->
<!--              <el-input type="number" v-model="couponForm.nowGrantNum" @input="calculation()" placeholder="请输入本次发放数量" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="10">-->
<!--            <el-form-item label="本次发放后剩余库存" prop="nowSurplus" label-width="180px">-->
<!--              <el-input type="number" v-model="couponForm.nowSurplus" disabled />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
        <el-input v-model="couponForm.couponId" style="display: none" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="couponCancel"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="couponConfirm"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getCouponDetailList } from "@/api/template";
  export default {
    name: "configCoupon",
    props: ["dialogFormVisible", "couponInfo"],
    dicts: ['business_type', 'coupon_type'],
    data() {
      return {
        activeName: "1",
        dialogVisible:false,
        activityId: null,
        form:{
          activityId : null,
          takeDateNum:null,
          effectDateNum:null,
          sameActivityFlag:null,
          diffActivityFlag:null,
          outActivityFlag: null,
          effectStartTime: null,
          effectEndTime: null,
          effectType: null,
          alarmNum: null,
          alarmContent: null,
          alarmPhone: null,
          alarmEmail: null,
          receiveType: null,
          infoList: [],
          userList: [],
        },
        //已选优惠券列表
        infoList:[],
        //是否显示添加用户按钮
        showUserAdd: false,
        userList: [],
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 表单校验
        rules: {
          receiveType: [
            { required: true, message: "领取门槛不能为空", trigger: "blur" }
          ],
          effectType: [
            { required: true, message: "券使用有效期不能为空", trigger: "blur" }
          ],
          alarmNum: [
            { required: true, message: "剩余库存预警不能为空", trigger: "blur" }
          ],
          alarmContent: [
            { required: true, message: "预警内容不能为空", trigger: "blur" }
          ],
          alarmPhone: [
            { required: true, message: "预警手机号不能为空", trigger: "blur" },
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur",
            },
          ],
          alarmEmail: [
            { required: true, message: "预警邮箱不能为空", trigger: "blur" },
            {
              type: "email",
              message: "请输入正确的邮箱地址",
              trigger: ["blur", "change"]
            }
          ],
        },
        //关联优惠券
        couponForm:{
          businessType: null,
          couponType: null,
          couponName: null,
          couponCode: null,
          couponAmount: null,
          inventoryNum: 0,
          grantNum: 0,
          surplus: 0,
          couponId: null,
        },
        //优惠券列表
        couponNameList : [],
        //新增关联优惠券弹窗
        open: false,
        title: null,
        editFlag: false,
        couponRules:{
          inventoryNum: [
            { required: true, message: "库存数量不能为空", trigger: "blur" }
          ]
        }
      }
    },
    watch: {
      couponInfo: {
        handler(newName, oldName) {
          if(this.couponInfo){
            this.form = newName
            this.activityId =this.couponInfo.id
            this.infoList = this.couponInfo.contactList
          }
        },
        immediate: true,
        deep: true
      },
    },
    methods : {
      reset() {
        this.form = {
          takeDateNum:null,
          effectDateNum:null,
          sameActivityFlag:'0',
          diffActivityFlag:'0',
          outActivityFlag: '0',
          effectStartTime: null,
          effectEndTime: null,
          effectType: null,
          alarmNum: null,
          alarmContent: null,
          alarmPhone: null,
          alarmEmail: null,
          receiveType: null,
        };
        this.infoList = []
        this.resetForm("form");
      },
      handleClose(){
        this.reset()
        this.$emit("cancel");
      },
      //新增券
      addCoupon(){
        this.open = true
        this.editFlag = false
        this.title = '新增关联优惠券'
      },
      // 取消按钮
      cancel() {
        this.reset()
        this.$emit("cancel")
      },
      //提交
      confirm(){
        if(this.infoList.length <= 0){
          this.$message.warning("请选择需要关联的优惠券")
          return
        }
        // if(this.form.receiveType === '3'){
        //   if(this.userList.length <= 0){
        //     this.$message.warning("请选择指定用户")
        //     return
        //   }
        // }
        if(this.form.effectType === '0'){
          if(!this.form.effectStartTime || !this.form.effectEndTime){
            this.$message.warning("请选择固定失效日期")
            return
          }
        }else if(this.form.effectType === '1'){
          if(!this.form.effectDateNum || !this.form.takeDateNum){
            this.$message.warning("请填写失效日期")
            return
          }
        }
        this.form.infoList = this.infoList
        // this.form.userList = this.userList
        this.form.activityId = this.activityId
        this.$emit("check",this.form)
        this.reset()
      },
      //选择优惠券类型加载优惠券列表
      firstChange(){
        let couponType = this.couponForm.couponType
        if(couponType){
          getCouponDetailList({couponType: couponType}).then(res => {
            this.couponNameList = res.data
          })
        }
      },
      //优惠券名称下拉框修改，同步修改其他数据
      couponNameChange(e){
        this.couponNameList.forEach(d => {
          if(d.couponName === e){
            this.couponForm.couponCode = d.couponCode
            this.couponForm.couponAmount = d.couponAmount
            this.couponForm.grantNum = d.grantNum
            this.couponForm.surplus = d.surplus
            this.couponForm.couponId = d.id
          }
        })
      },
      //输入本次发放数量，计算剩余库存
      calculation(){
        let nowGrantNum = Number(this.couponForm.nowGrantNum)
        let inventoryNum = Number(this.couponForm.inventoryNum)
        if(nowGrantNum > inventoryNum){
          this.$message.warning("库存不足")
          return
        }
        this.couponForm.nowSurplus = inventoryNum - nowGrantNum
      },
      //新增优惠券确认
      couponConfirm(e){
        let data = {}
        let flag = false
        if(this.infoList.length > 0){
          this.infoList.forEach(data => {
            if(data.id === this.couponForm.couponId){
              data.couponAmount = this.couponForm.couponAmount
              data.inventoryNum = this.couponForm.inventoryNum
              data.grantNum = this.couponForm.grantNum
              data.surplus = this.couponForm.surplus
              // data.nowGrantNum = this.couponForm.nowGrantNum
              data.nowSurplus = this.couponForm.nowSurplus
              flag = true
            }
          })
        }
        if(!flag){
          data['id'] = this.couponForm.couponId
          data['businessType'] = this.couponForm.businessType
          data['couponType'] = this.couponForm.couponType
          data['couponName'] = this.couponForm.couponName
          data['couponCode'] = this.couponForm.couponCode
          data['couponAmount'] = this.couponForm.couponAmount
          data['inventoryNum'] = this.couponForm.inventoryNum
          data['grantNum'] = this.couponForm.grantNum
          data['surplus'] = this.couponForm.surplus
          // data['nowGrantNum'] = this.couponForm.nowGrantNum
          // data['nowSurplus'] = this.couponForm.nowSurplus
          this.infoList.push(data)
        }
        this.couponCancel()
      },
      //取消新增关联优惠券弹窗
      couponCancel(){
        this.resetCouponForm()
        this.open = false
      },
      resetCouponForm(){
        this.couponForm.id = null
        this.couponForm.businessType = null
        this.couponForm.couponType = null
        this.couponForm.couponName = null
        this.couponForm.couponCode = null
        this.couponForm.couponAmount = null
        this.couponForm.inventoryNum = null
        this.couponForm.grantNum = null
        this.couponForm.surplus = null
        // this.couponForm.nowGrantNum = null
        // this.couponForm.nowSurplus = null
      },
      //已关联优惠券编辑
      handleUpdate(e){
        this.open = true
        this.editFlag = true
        this.title = '修改关联优惠券'
        this.couponForm.id = e.id
        this.couponForm.businessType = e.businessType
        this.couponForm.couponType = e.couponType
        this.couponForm.couponName = e.couponName
        this.couponForm.couponCode = e.couponCode
        this.couponForm.couponAmount = e.couponAmount
        this.couponForm.inventoryNum = e.inventoryNum
        this.couponForm.grantNum = e.grantNum
        this.couponForm.surplus = e.surplus
        // this.couponForm.nowGrantNum = e.nowGrantNum
        // this.couponForm.nowSurplus = e.nowSurplus
      },
      //删除已关联优惠券
      handleDelete(e){
        let index = this.infoList.indexOf(e)
        if(index !== -1){
          this.infoList.splice(index, 1)
        }
      }
    }
  }
</script>
