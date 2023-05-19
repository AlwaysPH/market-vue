<template>
  <div class="app-container">
    <el-form :model="dataParams" ref="queryForm" :inline="true" label-width="68px">
      <el-row>
        <el-col :span="17">
          <el-form-item label="数据概况"/>
        </el-col>
        <el-col :span="7">
          <el-form-item label="统计时间" prop="statisticsTime">
            <el-date-picker
              value-format="yyyy-MM-dd"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              v-model="dateRange"
              clearable
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <table cellspacing="0" style="width: 99%" align = "center" border="0">
      <tbody>
      <tr>
        <td class="el-table__cell is-leaf" ><div class="cell" style="font-weight: bold;text-align: center;" >活动数</div></td>
        <td class="el-table__cell is-leaf" ><div class="cell" style="font-weight: bold;text-align: center;">发放券数量（张）</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">领取券数量（张）</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">领取率（%）</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">使用率（%）</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">交易总金额（元）</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">用券总单量（个）</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">用券笔单价（元）</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">拉新数</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">使用数</div></td>
      </tr>
      <tr>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">{{ summaryData.activityNum }}</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">{{ summaryData.sendCouponNum }}</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">{{ summaryData.receiveCouponNum }}</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">{{ summaryData.receiveRate }}</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">{{ summaryData.useRate }}</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">{{ summaryData.amount }}</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">{{ summaryData.orderNum }}</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">{{ summaryData.orderPrice }}</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">{{ summaryData.newNum }}</div></td>
        <td class="el-table__cell is-leaf"><div class="cell" style="font-weight: bold;text-align: center;">{{ summaryData.useNum }}</div></td>
      </tr>
      </tbody>
    </table>

    <el-form style="margin-top: 2%;" :model="queryParams" ref="queryForm" :inline="true" label-width="95px">
      <el-form-item label="活动名称" prop="activityName">
        <el-input
          v-model="queryParams.activityName"
          placeholder="请输入活动名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="优惠券名称" prop="couponName">
        <el-input
          v-model="queryParams.couponName"
          placeholder="请输入优惠券名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="优惠券码" prop="couponCode">
        <el-input
          v-model="queryParams.couponCode"
          placeholder="请输入优惠券码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动时间" prop="activityTime">
        <el-date-picker
          value-format="yyyy-MM-dd"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          v-model="activityDateRange"
          clearable
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="infoList">
      <el-table-column label="优惠券名称" align="center" prop="couponName" />
      <el-table-column label="优惠券码" align="center" prop="couponCode" />
      <el-table-column label="关联活动名称" align="center" prop="activityName"/>
      <el-table-column label="活动总预算（元）" align="center" prop="budget" />
      <el-table-column label="发放券数量" align="center" prop="sendCouponNum" />
      <el-table-column label="领取率" align="center" prop="receiveRate" />
      <el-table-column label="使用率" align="center" prop="useRate" />
      <el-table-column label="优惠总金额" align="center" prop="orderAmount" />
      <el-table-column label="交易总金额" align="center" prop="orderAmount" />
      <el-table-column label="用券总单量" align="center" prop="orderAmount" />
      <el-table-column label="用券笔单价" align="center" prop="orderAmount" />
      <el-table-column label="拉新数" align="center" prop="orderAmount" />
      <el-table-column label="使用数" align="center" prop="orderAmount" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
  import { getSummary, listInfo } from "@/api/index";

  export default {
    name: "index",
    components:{
    },
    data() {
      return {
        summaryData: [],
        // 日期范围
        activityDateRange: [],
        dateRange: [],
        activityTime: [],
        formLabelWidth: "150px",
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 活动信息表格数据
        infoList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          activityName: null,
          couponName: null,
          couponCode: null,
        },
        dataParams:{},
        // 表单参数
        form: {},
      };
    },
    created() {
      this.getSummaryData()
      this.getList();
    },
    methods: {
      //获取汇总数据
      getSummaryData(){
        getSummary(this.addDateRange(this.dataParams, this.dateRange)).then(res =>{
           this.summaryData = res.data
        })
      },
      getList() {
        this.loading = true;
        listInfo(this.addDateRange(this.queryParams, this.activityDateRange)).then(response => {
            this.infoList = response.rows;
            this.total = response.total;
            this.loading = false;
        });
      },
      // 表单重置
      reset() {
        this.form = {
          activityName: null,
          couponName: null,
          couponCode: null,
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
      /** 导出按钮操作 */
      handleExport() {
        this.download('activity/export', {
          ...this.queryParams
        }, `活动信息_${this.parseTime(new Date(), "{y}-{m}-{d}")}.xlsx`)
      },
      //格式化时间
      filterTime(e) {
        let date = new Date(e);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        let h = date.getHours();
        h = h < 10 ? "0" + h : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? "0" + minute : minute;
        let s = date.getSeconds();
        s = s < 10 ? "0" + s : s;
        return y + "-" + m + "-" + d;
      },
    }
  };
</script>
