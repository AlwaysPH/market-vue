<!-- 活动详情弹窗 -->
<template>
  <div id="container">
    <el-dialog
      width="1200px"
      title="活动详情"
      :before-close="handleClose"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="150px">
        <el-collapse v-model="baseCollapse" accordion>
          <el-collapse-item title="基本信息" name="0">
            <el-row>
              <el-col :span="12">
                <el-form-item label="活动系统内名称" prop="activityAbb">
                  <el-input v-model="form.activityAbb" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动名称" prop="activityName">
                  <el-input v-model="form.activityName" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="活动开始时间" prop="startTime">
                  <el-date-picker
                    v-model="form.startTime"
                    type="datetime"
                    disabled>
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动结束时间" prop="endTime">
                  <el-date-picker
                    v-model="form.endTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    disabled>
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="活动区域范围" prop="regionName">
                  <el-input
                    v-model="form.regionName"
                    autocomplete="off"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="budgetCollapse" accordion>
          <el-collapse-item title="活动预算" name="0">
            <el-row>
              <el-col :span="12">
                <el-form-item label="活动总预算（元）" prop="budget">
                  <el-input v-model="form.budget" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="潇湘支付出资比例（%）" prop="xiaoxiangPayNum">
                  <el-input v-model="form.xiaoxiangPayNum" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="机构出资比例（%）" prop="orgPayNum">
                  <el-input v-model="form.orgPayNum" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出资机构名称" prop="orgName">
                  <el-select v-model="form.orgName" autocomplete="off" disabled clearable size="small">
                    <el-option
                      v-for="dict in dict.type.org_name"
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
                <el-form-item label="商户出资比例（%）" prop="merchantPayNum">
                  <el-input v-model="form.merchantPayNum" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="detailCollapse" accordion>
          <el-collapse-item title="活动展示信息" name="0">
            <el-row>
              <el-col :span="12">
                <el-form-item label="支付方式" prop="payMethod">
                  <el-input type="textarea" :row="4" v-model="form.payMethod" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="有效时间" prop="effectTime">
                  <el-input type="textarea" :row="4" v-model="form.effectTime" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="限次限量" prop="limitNum">
                  <el-input type="textarea" :row="4" v-model="form.limitNum" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="使用规则" prop="useRule">
                  <el-input type="textarea" :row="4" v-model="form.useRule" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="活动缩略图" prop="contractPhoto">
                  <el-button
                    type="primary"
                    @click="review(form.contractPhoto)"
                    v-if="form.contractPhoto"
                  >点击查看
                  </el-button
                  >
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动详情图" prop="detailPhoto">
                  <el-button
                    type="primary"
                    @click="review(form.detailPhoto)"
                    v-if="form.detailPhoto"
                  >点击查看
                  </el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="shareCollapse" accordion>
          <el-collapse-item title="分享设置" name="0">
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否允许用户分享" prop="shareFlag">
                  <el-select v-model="form.shareFlag" autocomplete="off" disabled clearable size="small">
                    <el-option
                      v-for="dict in dict.type.share_flag"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分享标题" prop="shareTitle">
                  <el-input v-model="form.shareTitle" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="分享文案" prop="shareContent">
                  <el-input type="textarea" :row="4" v-model="form.shareContent" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="分享图片" prop="sharePhoto">
                  <el-button
                    type="primary"
                    @click="review(form.sharePhoto)"
                    v-if="form.sharePhoto"
                  >点击查看
                  </el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="couponCollapse" accordion>
          <el-collapse-item title="关联优惠券" name="0">
            <el-table :data="form.contactList">
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
              <el-table-column label="券可用状态" align="center" prop="availableStatus" >
                <template slot-scope="scope">
                  <span v-if="scope.row.availableStatus === '0'">可用</span>
                  <span v-else-if="scope.row.availableStatus === '1'">不可用</span>
                </template>
              </el-table-column>
              <el-table-column label="失效时间" align="center" prop="effectEndTime">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.effectEndTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="券领取数量" align="center" prop="receiveNum" />
            </el-table>
            <el-row>
              <el-col>
                <el-form-item label="领取门槛" prop="receiveType">
                  <el-radio v-model="form.receiveType" disabled label="0">全部用户</el-radio>
                  <el-radio v-model="form.receiveType" disabled label="1">新用户</el-radio>
                  <el-radio v-model="form.receiveType" disabled label="2">首单</el-radio>
                  <el-radio v-model="form.receiveType" disabled label="3">指定用户</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="券使用有效期" prop="effectType"></el-form-item>
            </el-row>
            <el-row>
              <el-col :span="15">
                <el-form-item>
                  <el-radio v-model="form.effectType" label="0"  disabled>固定日期</el-radio>
                  <el-date-picker
                    v-model="form.effectStartTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"  disabled>
                  </el-date-picker>至
                  <el-date-picker
                    v-model="form.effectEndTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"  disabled>
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="15">
                <el-form-item>
                  <el-radio v-model="form.effectType" label="1"  disabled>领取后</el-radio>
                  <span style="line-height: 35px;"><el-input style="width: 150px;margin-left: 10px;" type="number" v-model="form.takeDateNum"  disabled/>天生效，有效期
                  <el-input style="width: 150px;margin-left: 10px;" type="number" v-model="form.effectDateNum"  disabled/></span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="couponTotalCollapse" accordion>
          <el-collapse-item title="券统计" name="0">
            <el-table :data="form.totalList">
              <el-table-column label="优惠券类型" align="center" prop="couponTypeName"/>
              <el-table-column label="本活动累计发放张数" align="center" prop="grantNum" />
              <el-table-column label="发放总优惠" align="center" prop="grantAmount" />
              <el-table-column label="本活动累计领取张数" align="center" prop="receiveNum" />
              <el-table-column label="领取总优惠" align="center" prop="receiveAmount" />
              <el-table-column label="本活动累计使用总张数" align="center" prop="useNum" />
              <el-table-column label="使用总优惠" align="center" prop="useAmount"/>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="alarmCollapse" accordion>
          <el-collapse-item title="剩余库存预警条件" name="0">
            <el-row>
              <el-col :span="12">
                <el-form-item label="剩余库存预警（张）" prop="alarmNum">
                  <el-input type="number" disabled v-model="form.alarmNum" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预警内容" prop="alarmContent">
                  <el-input type="textarea" disabled :row="4" v-model="form.alarmContent" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="预警手机号" prop="alarmPhone">
                  <el-input v-model="form.alarmPhone" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预警邮箱" prop="alarmEmail">
                  <el-input v-model="form.alarmEmail" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="ruleCollapse" accordion>
          <el-collapse-item title="配置叠加规则" name="0">
            <el-row>
              <el-col :span="12">
                <el-form-item label="活动内同类型卡券是否允许叠加使用" prop="sameActivityFlag">
                  <el-radio v-model="form.sameActivityFlag" disabled label="0">否(默认)</el-radio>
                  <el-radio v-model="form.sameActivityFlag" disabled label="1">是</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动内不同类型卡券是否允许叠加使用" prop="diffActivityFlag">
                  <el-radio v-model="form.diffActivityFlag" disabled label="0">否(默认)</el-radio>
                  <el-radio v-model="form.diffActivityFlag" disabled label="1">是</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否允许与其他活动的卡券叠加使用" prop="outActivityFlag">
                  <el-radio v-model="form.outActivityFlag" disabled label="0">否(默认)</el-radio>
                  <el-radio v-model="form.outActivityFlag" disabled label="1">是</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="merchantCollapse" accordion>
          <el-collapse-item title="适用商户/门店信息" name="0">
            <el-table :data="form.merchantList">
              <el-table-column label="商户名称" align="center" prop="merchantName"/>
              <el-table-column label="商户编号" align="center" prop="merchantNo" />
              <el-table-column label="商户审核状态" align="center" prop="status">
                <template slot-scope="scope">
                  <span>正常</span>
                </template>
              </el-table-column>
              <el-table-column label="行业类型" align="center" prop="industryType" >
                <template slot-scope="scope">
                  <span v-if="scope.row.industryType === '0'">大型商场</span>
                  <span v-else-if="scope.row.industryType === '1'">大型超市</span>
                  <span v-else-if="scope.row.industryType === '2'">娱乐</span>
                  <span v-else-if="scope.row.industryType === '3'">影院</span>
                  <span v-else-if="scope.row.industryType === '4'">连锁便利店</span>
                </template>
              </el-table-column>
              <el-table-column label="已参与活动数量" align="center" prop="activityNum" />
              <el-table-column label="本次活动营销资金结算方式" align="center" prop="settleType" >
                <template slot-scope="scope">
                  <span v-if="scope.row.settleType === '0'">足额结算</span>
                  <span v-else-if="scope.row.settleType === '1'">差额预存</span>
                </template>
              </el-table-column>
              <el-table-column label="商户原消费费率" align="center" prop="consumRate"/>
              <el-table-column label="活动期间商户消费费率" align="center" prop="activityConsumRate"/>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  export default {
    name: "activityDetail",
    props: ["dialogFormVisible", "detailInfo"],
    dicts: ['activity_status', 'audit_status', 'share_flag', 'org_name'],
    data() {
      return {
        baseCollapse: '0',
        budgetCollapse: '0',
        detailCollapse: '0',
        shareCollapse: '0',
        couponCollapse: '0',
        couponTotalCollapse: '0',
        alarmCollapse: '0',
        ruleCollapse: '0',
        merchantCollapse: '0',
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
