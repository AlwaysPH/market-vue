<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="活动名称" prop="activityName">
        <el-input
          v-model="queryParams.activityName"
          placeholder="请输入活动名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择活动状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.activity_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="approveStatus">
        <el-select v-model="queryParams.approveStatus" placeholder="请选择审核状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.audit_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="activityList" border stripe>
      <el-table-column label="活动名称" align="center" prop="activityName" />
      <el-table-column label="活动状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '0'">未开始</span>
          <span v-else-if="scope.row.status === '1'">进行中</span>
          <span v-else-if="scope.row.status === '2'">已失效</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动总预算（元）" align="center" prop="budget" />
      <el-table-column label="审核状态" align="center" prop="approveStatus" >
        <template slot-scope="scope">
          <span v-if="scope.row.approveStatus === '0'">待审核</span>
          <span v-else-if="scope.row.approveStatus === '1'">审核通过</span>
          <span v-else-if="scope.row.approveStatus === '2'">审核拒绝</span>
          <span v-else-if="scope.row.approveStatus === '3'">待提交</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.row)"
            v-hasPermi="['activity:activity:query']"
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
  import { getListByCoupon, getInfo } from "@/api/activity";
  import detailsPop from '../activity/components/activityDetail'

  export default {
    name: "contactActivity",
    dicts: ['activity_status', 'audit_status'],
    components:{
      detailsPop
    },
    data() {
      return {
        //详情弹窗状态
        detailsModel: false,
        detailInfo:null,
        couponId: null,
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
        // 活动信息表格数据
        activityList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          activityName: null,
          startTime: null,
          endTime: null,
          approveStatus: null,
          status: null,
          couponId: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
      };
    },
    created() {
      const couponId = this.$route.params && this.$route.params.id
      this.queryParams.couponId = couponId;
      this.getList(couponId);
    },
    methods: {
      /** 查询活动信息列表 */
      getList() {
        this.loading = true;
        if(this.couponId){
          this.queryParams.couponId = this.couponId
        }
        getListByCoupon(this.queryParams).then(response => {
          this.activityList = response.rows;
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
