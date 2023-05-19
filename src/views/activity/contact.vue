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
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table v-loading="loading" :data="infoList" >
      <el-table-column label="优惠券名称" align="center" prop="couponName" />
      <el-table-column label="优惠券类型" align="center" prop="couponType">
        <template slot-scope="scope">
          <span v-if="scope.row.couponType === '0'">满减券</span>
          <span v-else-if="scope.row.couponType === '1'">折扣券</span>
          <span v-else-if="scope.row.couponType === '2'">代金券</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券码" align="center" prop="couponCode" />
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
    <!--详情-->
    <details-pop
      @cancel="detailCancel"
      :detailInfo="detailInfo"
      :dialogFormVisible="detailsModel"
    ></details-pop>
  </div>
</template>

<script>
  import { getActivityCouponList, getInfo } from "@/api/template";
  import detailsPop from '../template/components/couponDetail'

  export default {
    name: "contactCoupon",
    dicts: ['business_type', 'coupon_type', 'ver_channel', 'pay_type'],
    components:{
      detailsPop
    },
    data() {
      return {
        //详情弹窗状态
        detailsModel: false,
        detailInfo:null,
        activityId: null,
        // 遮罩层
        loading: true,
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
          couponName: null,
          couponCode: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
      };
    },
    created() {
      const activityId = this.$route.params && this.$route.params.id
      this.queryParams.activityId = activityId;
      this.getList(activityId);
    },
    methods: {
      /** 查询优惠券信息列表 */
      getList() {
        this.loading = true;
        if(this.activityId){
          this.queryParams.activityId = this.activityId
        }
        getActivityCouponList(this.queryParams).then(response => {
          this.infoList = response.rows;
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
          activityAbb: null,
          activityName: null,
          startTime: null,
          endTime: null,
          approveStatus: "0",
          budget: null,
          xiaoxiangPayNum: null,
          orgName: null,
          orgPayNum: null,
          merchantPayNum: null,
          alarmNum: null,
          alarmContent: null,
          alarmPhone: null,
          alarmEmail: null,
          payMethod: null,
          effectTime: null,
          limitNum: null,
          useRule: null,
          contractPhoto: null,
          shareFlag: null,
          shareTitle: null,
          shareContent: null,
          sharePhoto: null,
          receiveType: null,
          detailPhoto: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          rangeName: null,
          rangeCode : null,
          status: null,
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
