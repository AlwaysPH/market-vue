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
      <el-form-item label="修改人" prop="updateName">
        <el-input
          v-model="queryParams.updateName"
          placeholder="请输入修改人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="操作类型" prop="operationType">
        <el-select v-model="queryParams.operationType" placeholder="请选择操作类型" clearable size="small">
          <el-option
            v-for="dict in dict.type.operation_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="searchTime">
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column label="活动名称" align="center" prop="activityName" />
      <el-table-column label="操作类型" align="center" prop="operationType" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.operationType === '0'">新增</span>
          <span v-else-if="scope.row.operationType === '1'">修改</span>
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
      <el-table-column label="创建时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" align="center" prop="updateName" />
      <el-table-column label="审核状态" align="center" prop="approveStatus" >
        <template slot-scope="scope">
          <span v-if="scope.row.approveStatus === '0'">待审核</span>
          <span v-else-if="scope.row.approveStatus === '1'">审核通过</span>
          <span v-else-if="scope.row.approveStatus === '2'">审核拒绝</span>
        </template>
      </el-table-column>
      <el-table-column label="审核备注" align="center" prop="auditRemark" />
      <el-table-column label="审核时间" align="center" prop="auditTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.approveStatus === '0'"
            @click="handleAudit(scope.row)"
            v-hasPermi="['activity:activity:audit']"
          >审核</el-button>
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

    <!--审核弹窗-->
    <el-dialog title="审核" :visible.sync="checkModel" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="checkInfo">
        <el-form-item label=" 审核结果:" :label-width="formLabelWidth" prop="status">
          <el-radio v-model="checkInfo.status" label="1">通过</el-radio>
          <el-radio v-model="checkInfo.status" label="2">拒绝</el-radio>
        </el-form-item>
        <el-form-item label=" 审核备注:" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="checkInfo.auditRemark"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkConfirm">确 定</el-button>
        <el-button @click="checkCancel">取 消</el-button>
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
  import { listInfo, getInfo, audit } from "@/api/activity";
  import detailsPop from "./components/activityDetail"

  export default {
    name: "activity",
    dicts: ['activity_status', 'audit_status', 'share_flag', 'org_name', 'operation_type'],
    components:{
      detailsPop
    },
    data() {
      return {
        // 日期范围
        dateRange: [],
        //审核弹窗状态
        checkModel: false,
        checkInfo: {
          id : null,
          status: null,
          auditRemark : null,
        },
        formLabelWidth: "150px",
        //详情弹窗状态
        detailsModel: false,
        detailInfo:null,
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
        // 活动信息表格数据
        infoList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          activityName: null,
          searchStartTime: null,
          searchEndTime: null,
          approveStatus: null,
          status: null,
          updateName: null,
          searchTime: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询活动信息列表 */
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
          regionName: null,
          regionCode : null,
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('activity/export', {
          ...this.queryParams
        }, `活动信息_${this.parseTime(new Date(),"{y}-{m}-{d}")}.xlsx`)
      },
      //格式化时间
      filterTime(e){
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
      //打开审核弹窗
      handleAudit(e) {
        this.checkModel = true;
        this.checkInfo.id = e.id
      },
      //确认审核弹窗
      checkConfirm(e) {
        let form = this.checkInfo;
        if(!this.checkInfo.status){
          this.$message.warning("审核结果不能为空")
          return
        }
        form['approveStatus'] = this.checkInfo.status
        audit(form).then((res) => {
          this.$message.success('审批成功')
          this.checkInfo.id = null
          this.checkInfo.status = null
          this.checkInfo.remark = null
          this.handleQuery();
        });
        this.checkModel = false;
      },
      //关闭审核弹窗
      checkCancel() {
        this.checkModel = false;
      },
    }
  };
</script>
