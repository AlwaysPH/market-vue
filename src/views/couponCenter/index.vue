<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="150px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="APP账号/手机号" prop="account">
            <el-input
              v-model="queryParams.account"
              placeholder="请输入APP账号/手机号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优惠券名称" prop="couponName">
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
          <el-form-item label="券使用状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择券使用状态" clearable size="small">
              <el-option
                v-for="dict in dict.type.use_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
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
      </el-row>
      <div style="margin-left: 35%;">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
      </div>
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
          v-hasPermi="['system:info:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="infoList">
      <el-table-column label="优惠券名称" align="center" prop="couponName" />
      <el-table-column label="优惠券码" align="center" prop="couponCode" />
      <el-table-column label="关联活动" align="center" prop="activityName"/>
      <el-table-column label="APP账号/手机号" align="center" prop="phoneNumber">
        <template slot-scope="scope">
          <span v-if="scope.row.phoneNumber">{{scope.row.phoneNumber}}</span>
          <span v-else-if="scope.row.appAccount">{{scope.row.appAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="领取时间" align="center" prop="receiveTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="券核销码" align="center" prop="writeOffCode"/>
      <el-table-column label="券链接" align="center" prop="linkUrl"/>
      <el-table-column label="券使用状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '0'">未生效</span>
          <span v-else-if="scope.row.status === '1'">未使用</span>
          <span v-else-if="scope.row.status === '2'">已使用</span>
          <span v-else-if="scope.row.status === '3'">已失效</span>
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
import { listInfo, exportInfo } from "@/api/couponCenter";

export default {
  name: "center",
  dicts: ['business_type', 'coupon_type', 'use_status'],
  data() {
    return {
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
        couponName: null,
        couponCode: null,
        status: null,
        account : null,
      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
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
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
    /** 导出按钮操作 */
    handleExport() {
      this.download('center/export', {
        ...this.queryParams
      }, `优惠券领取信息_${this.parseTime(new Date(),"{y}-{m}-{d}")}.xlsx`)
    },
  }
};
</script>
