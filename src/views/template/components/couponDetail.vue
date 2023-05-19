<!-- 优惠券详情弹窗 -->
<template>
  <div id="container">
    <el-dialog
      width="1200px"
      title="机构信息"
      :before-close="handleClose"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="150px">
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
              <el-input v-model="form.couponAdd" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="优惠券名称" prop="couponName">
              <el-input v-model="form.couponName" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="优惠券图片" prop="couponPhoto">
              <el-button
                type="primary"
                @click="review(form.couponPhoto)"
                v-if="form.couponPhoto"
              >点击查看
              </el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="使用说明" prop="useDesc">
              <el-input type="textarea" :row="4" v-model="form.useDesc" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="基本规则"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label=" 领取方式" prop="sendType">
              <el-radio v-model="form.sendType" label="1" autocomplete="off" disabled>自动发放</el-radio>
              <el-radio v-model="form.sendType" label="2" autocomplete="off" disabled>手动领取</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="领取条件说明" prop="conditionDesc">
              <el-input v-model="form.conditionDesc" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每人限领" prop="personLimit">
              <el-input type="number" v-model="form.personLimit" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="券每日限领" prop="dateLimit">
              <el-input type="number" v-model="form.dateLimit" autocomplete="off" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每台设备每日限领" prop="machineLimit">
              <el-input type="number" v-model="form.machineLimit" autocomplete="off" disabled />
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
              <el-radio v-model="form.restrictionType" label="0" autocomplete="off" disabled>无限制</el-radio>
              <span style="line-height: 35px;">面额
                <el-input type="number" autocomplete="off" disabled v-model="form.disAmount" style="width: 180px;margin-left: 10px;"/>
                元</span>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <el-radio v-model="form.restrictionType" label="1" autocomplete="off" disabled>固定满减</el-radio>
              <span style="line-height: 35px;">
                满<el-input type="number" autocomplete="off" disabled v-model="form.fullFixSubCondition" style="width: 150px;margin-left: 10px;"/>元使用，面额
                <el-input type="number" autocomplete="off" disabled v-model="form.disFixAmount" style="width: 180px;margin-left: 10px;"/>元
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <el-radio v-model="form.restrictionType" label="2" autocomplete="off" disabled>阶梯满减</el-radio>
              <div v-for="(item, index) in form.conditionList" :key="index" style="margin-left: 14%; margin-top: 1%;">
                <span style="line-height: 35px;">
                  满<el-input type="number" autocomplete="off" disabled v-model="item.fullSubCondition"  style="width: 150px;margin-left: 10px;"/>元，减
                  <el-input type="number" autocomplete="off" disabled v-model="item.fullSubAmount"  style="width: 150px;margin-left: 10px;"/>元
                </span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!--折扣券-->
        <el-row v-else-if="form.couponType === '1'">
          <el-col :span="12 ">
            <el-form-item label="满额限制" prop="fullRestriction">
              <el-input type="number" autocomplete="off" disabled style="width: 120px;" v-model="form.fullRestriction" /> 元
            </el-form-item>
          </el-col>
          <el-col :span="12 ">
            <el-form-item label="折扣比例" prop="saleNum">
              <el-input type="number" autocomplete="off" disabled style="width: 100px;" v-model="form.saleNum" /> %
            </el-form-item>
          </el-col>
          <el-col :span="12 ">
            <el-form-item label="折扣上限" prop="upperLimitFlag">
              <el-radio v-model="form.upperLimitFlag" label="0" autocomplete="off" disabled>不限</el-radio>
              <el-radio v-model="form.upperLimitFlag" label="1" autocomplete="off" disabled>优惠上限</el-radio>
              <el-input style="width: 100px;" autocomplete="off" disabled type="number" v-model="form.upperLimitAmount" /> 元
            </el-form-item>
          </el-col>
        </el-row>
        <!--代金券-->
        <el-row v-else-if="form.couponType === '2'">
          <el-col :span="12 ">
            <el-form-item label="">
              <span style="line-height: 35px;">面额
                <el-input v-model="form.faceMoney" autocomplete="off" disabled style="width: 100px;margin-left: 10px;"/>
                元，订单须满<el-input autocomplete="off" disabled v-model="form.orderAmount" style="width: 100px;margin-left: 10px;"/>元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label=" 券核销渠道" prop="verChannel">
              <el-select v-model="form.verChannel" autocomplete="off" disabled size="small">
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
              <el-select v-model="form.payType" autocomplete="off" disabled size="small">
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
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  export default {
    name: "couponDetail",
    props: ["dialogFormVisible", "detailInfo"],
    dicts: ['business_type', 'coupon_type', 'ver_channel', 'pay_type'],
    data() {
      return {
        form:{},
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
        let url = 'http://120.79.140.167:8089/files' + file;
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
