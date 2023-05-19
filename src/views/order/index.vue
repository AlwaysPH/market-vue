<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="卡号" prop="cardNo" :label-width="labelWidth">
            <el-input
              v-model="queryParams.cardNo"
              placeholder="请输入卡号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="商户号" prop="merchantNo" :label-width="labelWidth">
            <el-input
              v-model="queryParams.merchantNo"
              placeholder="请输入商户号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="商户订单号" prop="merchantOrderNo" :label-width="labelWidth">
            <el-input
              v-model="queryParams.merchantOrderNo"
              placeholder="请输入商户订单号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="订单状态" prop="orderStatus" :label-width="labelWidth">
            <el-select v-model="queryParams.orderStatus" placeholder="请选择订单状态" clearable size="small">
              <el-option
                v-for="dict in dict.type.order_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="APP账号/手机号" prop="accountNo" :label-width="labelWidth">
            <el-input
              v-model="queryParams.accountNo"
              placeholder="请输入APP账号/手机号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="交易时间" prop="transTime" :label-width="labelWidth">
            <el-date-picker
              value-format="yyyy-MM-dd hh:mm:ss"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              v-model="dateRange"
              clearable
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-left: 35%;">
        <el-col :span="8">
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

    <el-table v-loading="loading" :data="infoList">
      <el-table-column label="商户号" fixed align="center" prop="merchantNo" />
      <el-table-column label="商户名称" fixed align="center" prop="merchantName" />
      <el-table-column label="APP账号/手机号" fixed align="center" prop="accountNo" />
      <el-table-column label="商品名称" fixed align="center" prop="itemName" />
      <el-table-column label="商户订单号" align="center" prop="merchantOrderNo" />
      <el-table-column label="交易订单号" align="center" prop="orderNo" />
      <el-table-column label="订单金额" align="center" prop="orderAmount" />
      <el-table-column label="坐扣手续费" align="center" prop="orgType" />
      <el-table-column label="收支手续费" align="center" prop="orgType" />
      <el-table-column label="营销活动手续费" align="center" prop="orgType" />
      <el-table-column label="付款金额" align="center" prop="orgType" />
      <el-table-column label="优惠券码" align="center" prop="orgType" />
      <el-table-column label="优惠金额" align="center" prop="orgType" />
      <el-table-column label="营销金额" align="center" prop="orgType" />
      <el-table-column label="交易时间" align="center" prop="transTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.transTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="orgType" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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

  </div>
</template>

<script>
  import { listOrg } from "@/api/order";

  export default {
    name: "order",
    dicts: ['order_status'],
    components:{
    },
    data() {
      return {
        dateRange: [],
        labelWidth: '150px',
        // 遮罩层
        loading: false,
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
        // 表格数据
        infoList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          cardNo: null,
          merchantNo: null,
          merchantOrderNo: null,
          orderStatus: null,
          accountNo: null,
          dateRange: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
        }
      };
    },
    created() {
      // this.getList();
    },
    methods: {
      /** 查询机构列表 */
      getList() {
        this.loading = true;
        // listOrg(this.queryParams).then(response => {
        //   this.orgList = response.rows;
        //   this.total = response.total;
          this.loading = false;
        // });
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
          roleType: null,
          registerAddress: null,
          companyNum: null,
          companyCode: null,
          invoicePhone: null,
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
        this.download('order/export', {
          ...this.queryParams
        }, `订单详情_${this.parseTime(new Date(), "{y}-{m}-{d}")}.xlsx`)
      },
    }
  };
</script>
