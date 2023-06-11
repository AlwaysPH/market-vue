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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['activity:activity:add']"
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
          v-hasPermi="['activity:activity:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column label="活动名称" align="center" prop="activityName" />
      <el-table-column label="活动状态" align="center" prop="status" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '0'">未开始</span>
          <span v-else-if="scope.row.status === '1'">进行中</span>
          <span v-else-if="scope.row.status === '2'">已失效</span>
          <span v-else-if="scope.row.status === '3'">已停止</span>
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
      <el-table-column label="订单优惠总金额（元）" align="center" prop="orderAmount" />
      <el-table-column label="创建时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联优惠券数" align="center" prop="couponNum" width="100px">
        <template slot-scope="scope">
          <router-link :to="'/activity/contact/index/' + scope.row.id" class="link-type">
            <span>{{ scope.row.couponNum }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="适用商户数量" align="center" prop="merchantNum" width="100px"/>
      <el-table-column label="审核状态" align="center" prop="approveStatus" >
        <template slot-scope="scope">
          <span v-if="scope.row.approveStatus === '0'">待审核</span>
          <span v-else-if="scope.row.approveStatus === '1'">审核通过</span>
          <span v-else-if="scope.row.approveStatus === '2'">审核拒绝</span>
          <span v-else-if="scope.row.approveStatus === '3'">待提交</span>
        </template>
      </el-table-column>
      <el-table-column label="领取门槛" align="center" prop="receiveType" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.receiveType === '0'">全部</span>
          <span v-else-if="scope.row.receiveType === '1'">新用户</span>
          <span v-else-if="scope.row.receiveType === '2'">首单</span>
          <span v-else-if="scope.row.receiveType === '3'">指定用户</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="审核备注" align="center" prop="auditRemark" />-->
<!--      <el-table-column label="审核时间" align="center" prop="auditTime" >-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
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
            @click="handleUpdate(scope.row)"
            v-hasPermi="['activity:activity:edit']"
            v-if="scope.row.approveStatus === '3' || scope.row.approveStatus === '2'"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="(scope.row.approveStatus === '1' && scope.row.status === '1') || (scope.row.approveStatus === '1' && scope.row.status === '0') || (scope.row.approveStatus === '1' && scope.row.status === '3') "
            @click="handleGrant(scope.row)"
            v-hasPermi="['activity:activity:grant']"
          >发放</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.approveStatus === '3' || scope.row.approveStatus === '2'"
            @click="submitAudit(scope.row)"
            v-hasPermi="['activity:activity:submitAudit']"
          >提交审核</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.approveStatus === '3' || scope.row.approveStatus === '2'"
            @click="configCoupon(scope.row)"
            v-hasPermi="['activity:activity:coupon']"
          >配置优惠</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.approveStatus === '3' || scope.row.approveStatus === '2'"
            @click="configMerchant(scope.row)"
            v-hasPermi="['activity:activity:merchant']"
          >配置商户</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="(scope.row.approveStatus === '3' || scope.row.approveStatus === '2') && scope.row.receiveType === '3'"
            @click="specifyUser(scope.row)"
            v-hasPermi="['activity:activity:specifyUser']"
          >指定用户</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleStop(scope.row)"
            v-if="scope.row.approveStatus === '1' && scope.row.status === '1'"
            v-hasPermi="['activity:activity:stop']"
          >停止</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.approveStatus === '1' && scope.row.status === '3'"
            @click="handleRestart(scope.row)"
            v-hasPermi="['activity:activity:restart']"
          >重启</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['activity:activity:remove']"
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

    <!-- 添加或修改活动信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-form-item label="基本信息"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动系统内名称" prop="activityAbb">
              <el-input v-model="form.activityAbb" placeholder="请输入活动系统内名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动名称" prop="activityName">
              <el-input v-model="form.activityName" placeholder="请输入活动名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动简介" prop="intro">
              <el-input type="textarea" :row="4" v-model="form.intro" placeholder="请输入活动简介" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动区域范围" prop="range">
              <el-cascader
                size="large"
                :options="options"
                v-model="form.regionName"
                collapse-tags
                :props="props"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="活动预算"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动总预算（元）" prop="budget">
              <el-input v-model="form.budget" placeholder="请输入活动总预算" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="潇湘支付出资比例（%）" prop="xiaoxiangPayNum">
              <el-input v-model="form.xiaoxiangPayNum" placeholder="请输入潇湘支付出资比例" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构出资比例（%）" prop="orgPayNum">
              <el-input v-model="form.orgPayNum" placeholder="请输入机构出资比例" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出资机构名称" prop="orgName">
              <el-select v-model="form.orgName" placeholder="请选择" clearable size="small">
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
              <el-input v-model="form.merchantPayNum" placeholder="请输入商户出资比例" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="活动展示信息"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付方式" prop="payMethod">
              <el-input type="textarea" :row="4" v-model="form.payMethod" placeholder="请输入支付方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效时间" prop="effectTime">
              <el-input type="textarea" :row="4" v-model="form.effectTime" placeholder="请输入有效时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="限次限量" prop="limitNum">
              <el-input type="textarea" :row="4" v-model="form.limitNum" placeholder="请输入限次限量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用规则" prop="useRule">
              <el-input type="textarea" :row="4" v-model="form.useRule" placeholder="请输入使用规则" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动缩略图" prop="contractPhoto">
              <upload-file
                :limit="shrinkPics.limit"
                @getFile="getShrinkPic"
                :fileType="shrinkPics.fileTypeList"
                ref="contractPhoto"
              ></upload-file>
              <div style="height: 20px; color: #faad14; font-size: 14px">
                最多上传3张，尺寸在800*800以上
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动详情图" prop="detailPhoto">
              <upload-file
                :limit="detailPics.limit"
                @getFile="getDetailPic"
                :fileType="detailPics.fileTypeList"
                ref="detailPhoto"
              ></upload-file>
              <div style="height: 20px; color: #faad14; font-size: 14px">
                最多上传3张，尺寸在800*800以上
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="分享设置"></el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否允许用户分享" prop="shareFlag">
              <el-select v-model="form.shareFlag" placeholder="请选择" clearable size="small">
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
              <el-input v-model="form.shareTitle" placeholder="请输入分享标题" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分享文案" prop="shareContent">
              <el-input type="textarea" :row="4" v-model="form.shareContent" placeholder="请输入分享文案" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分享图片" prop="sharePhoto">
              <upload-file
                :limit="share.limit"
                @getFile="getSharePic"
                :fileType="share.fileTypeList"
                ref="sharePhoto"
              ></upload-file>
              <div style="height: 20px; color: #faad14; font-size: 14px">
                最多上传3张，尺寸在800*800以上
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--指定用户弹窗-->
    <el-dialog title="选择卡分类" :visible.sync="cardModel" width="1300px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="userInfo">
        <el-row>
          <el-col :span="8">
            <el-form-item label="卡属性编号" prop="cardNo">
              <el-input style="width: 200px;" v-model="userInfo.cardNo" @change="cardNoChange" placeholder="请输入卡属性编号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="卡属性名称" prop="cardName">
              <el-input style="width: 200px;" filterable disabled v-model="userInfo.cardName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="joinCard">加入</el-button>
          </el-col>
        </el-row>
        <el-input style="display: none" v-model="userInfo.appUserId" />
        <el-input style="display: none" v-model="userInfo.appAccount" />
        <el-input style="display: none" v-model="userInfo.companyUserName" />
        <el-input style="display: none" v-model="userInfo.cardFaceName" />
        <el-input style="display: none" v-model="userInfo.phoneNumber" />
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleImport"
            >导入</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="已添加"></el-form-item>
        </el-row>
        <el-table  :data="cardList">
          <el-table-column label="序号" align="center" type="index"/>
          <el-table-column label="卡属性编号" align="center" prop="cardNo" />
          <el-table-column label="卡属性名称" align="center" prop="cardName"/>
          <el-table-column label="APPuserID" align="center" prop="appUserId"/>
          <el-table-column label="APP账号" align="center" prop="appAccount"/>
          <el-table-column label="企业客户名称" align="center" prop="companyUserName" />
          <el-table-column label="卡面名称" align="center" prop="cardFaceName" />
          <el-table-column label="手机号" align="center" prop="phoneNumber" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleDeleteCard(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cardConfirm">提 交</el-button>
        <el-button @click="cardCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--发放优惠券弹窗-->
    <el-dialog title="发放优惠券" :visible.sync="grantModel" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="grantInfo" :rules="grantRules">
        <el-form-item label="优惠券名称" prop="couponName" label-width="180px">
          <el-select v-model="grantInfo.couponName" placeholder="请选择优惠券名称" @change="couponNameChange" clearable size="small">
            <el-option
              v-for="dict in couponNameList"
              :key="dict.id"
              :label="dict.couponName"
              :value="dict.couponName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label=" 库存数量:" :label-width="formLabelWidth" prop="inventoryNum">
          <el-input disabled v-model="grantInfo.inventoryNum" />
        </el-form-item>
        <el-form-item label=" 发放数量:" :label-width="formLabelWidth" prop="grantNum">
          <el-input type="number" v-model="grantInfo.grantNum" placeholder="请输入发放数量"/>
        </el-form-item>
        <el-input style="display: none" v-model="grantInfo.couponId" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="grantConfirm">确 定</el-button>
        <el-button @click="grantCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 卡分类导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?activityId=' + id"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--配置商户弹窗-->
    <el-dialog title="适用商户/门店" :visible.sync="merchantModel" width="1300px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="merchantInfo">
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary"  size="mini" @click="addMerchant">新增商户</el-button>
              <el-button size="mini" @click="importMerchant">导入商户</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table :data="merchantList">
          <el-table-column label="商户名称" align="center" prop="merchantName" />
          <el-table-column label="商户编号" align="center" prop="merchantNo"/>
          <el-table-column label="行业类型" align="center" prop="industryType">
            <template slot-scope="scope">
              <span v-if="scope.row.industryType === '5621'">大型商场</span>
              <span v-else-if="scope.row.industryType === '5998'">大型超市</span>
              <span v-else-if="scope.row.industryType === '7408'">娱乐</span>
              <span v-else-if="scope.row.industryType === '7991'">旅游</span>
              <span v-else-if="scope.row.industryType === '5999'">连锁便利店</span>
              <span v-else-if="scope.row.industryType === '7430'">其他</span>
            </template>
          </el-table-column>
          <el-table-column label="本次活动营销资金结算方式" align="center" prop="settleType">
            <template slot-scope="scope">
              <span v-if="scope.row.settleType === '0'">足额结算</span>
              <span v-else-if="scope.row.settleType === '1'">差额预存</span>
            </template>
          </el-table-column>
          <el-table-column label="活动期间商户消费费率" align="center" prop="activityConsumRate" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleDeleteMerchant(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="merchantConfirm">提 交</el-button>
        <el-button @click="merchantCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 商户导入对话框 -->
    <el-dialog :title="merchantUpload.title" :visible.sync="merchantUpload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="merchantUpload.headers"
        :action="merchantUpload.url + '?activityId=' + id"
        :disabled="merchantUpload.isUploading"
        :on-progress="merchantUploadProgress"
        :on-success="handleMerchantFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importMerchantTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMerchantFileForm">确 定</el-button>
        <el-button @click="merchantUpload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--新增商户弹窗-->
    <el-dialog
      width="1200px"
      :title="merchantTitle"
      :visible.sync="merchantOpen"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="merchantForm" :rules="merchantRules">
        <el-row>
          <el-col :span="10">
            <el-form-item label="行业类型" prop="industryType" label-width="180px">
              <el-select v-model="merchantForm.industryType" :disabled="editFlag" placeholder="请选择行业类型" @change="firstChange" clearable size="small">
                <el-option
                  v-for="dict in dict.type.industry_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商户名称" prop="merchantName" label-width="180px">
              <el-select v-model="merchantForm.merchantName" filterable :disabled="editFlag" placeholder="请选择商户名称" @change="merchantNameChange" clearable size="small">
                <el-option
                  v-for="dict in merchantNameList"
                  :key="dict.id"
                  :label="dict.merchantName"
                  :value="dict.merchantName"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商户编号" prop="merchantNo" label-width="180px">
              <el-input  v-model="merchantForm.merchantNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="活动营销资金结算方式" prop="settleType" label-width="180px">
              <el-select v-model="merchantForm.settleType" placeholder="请选择结算方式" clearable size="small">
                <el-option
                  v-for="dict in dict.type.settle_type"
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
            <el-form-item label="活动期间商户消费费率" prop="activityConsumRate" label-width="180px">
              <el-input type="number" v-model="merchantForm.activityConsumRate" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="当前消费费率有效期" prop="consumRate" label-width="180px">
              <el-date-picker
                v-model="merchantForm.effectStartTime"
                type="datetime"
                disabled>
              </el-date-picker>至
              <el-date-picker
                v-model="merchantForm.effectEndTime"
                type="datetime"
                disabled>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="merchantAddCancel"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="merchantAddConfirm"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!--详情-->
    <details-pop
      @cancel="detailCancel"
      :detailInfo="detailInfo"
      :dialogFormVisible="detailsModel"
    ></details-pop>
    <!--关联优惠券-->
    <contactCoupon-pop
      @check="couponConfirm"
      @cancel="couponCancel"
      :couponInfo="couponInfo"
      :dialogFormVisible="couponModel"
    ></contactCoupon-pop>
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo, addInfo, updateInfo, audit, submitAudit, submitCoupon,
  specifyUser, grantCoupon, submitGrant, configMerchant, stopActivity, restartActivity,
  getCardUserInfo, getMerchantList, getConfigMerchant } from "@/api/activity";
import { regionData,  CodeToText, TextToCode} from "element-china-area-data";
import uploadFile from "../components/uploadFile";
import detailsPop from "./components/activityDetail"
import contactCouponPop from './components/configCoupon'
import { getToken } from "@/utils/auth";

export default {
  name: "activity",
  dicts: ['activity_status', 'audit_status', 'share_flag', 'org_name', 'industry_type',
    'settle_type', 'merchant_status'],
  components:{
    uploadFile,
    detailsPop,
    contactCouponPop,
  },
  data() {
    return {
      //商户导入
      merchantUpload:{
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/activity/merchantImportData"
      },
      //新增商户弹窗
      merchantNameList: [],
      merchantTitle: null,
      merchantOpen: false,
      editFlag: false,
      merchantForm: {
        industryType: null,
        merchantName: null,
        merchantNo: null,
        settleType: null,
        merchantStatus: '1',
        activityNum: null,
        consumRate: null,
        activityConsumRate: null,
        effectStartTime: null,
        effectEndTime: null,
      },
      //商户弹窗
      merchantModel: false,
      merchantInfo: {},
      merchantList: [],
      // 导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/activity/importData"
      },
      couponNameList: [],
      formLabelWidth: '150px',
      //发放优惠券弹窗
      grantModel: false,
      grantInfo: {
        couponName: null,
        couponId: null,
        inventoryNum: null,
        grantNum: null,
      },
      //指定用户弹窗
      id : null,
      cardModel:false,
      userInfo: {
        cardNo: null,
        cardName: null,
        appUserId: null,
        appAccount: null,
        companyUserName: null,
        cardFaceName: null,
        phoneNumber: null,
      },
      cardList: [],
      //关联优惠券弹窗
      couponModel: false,
      couponInfo: null,
      //详情弹窗状态
      detailsModel: false,
      detailInfo:null,
      //缩略图片
      shrinkPics:{
        limit: 3,
        fileTypeList: "jpg,png,jpeg",
        fileList: [],
      },
      //详情图片
      detailPics:{
        limit: 3,
        fileTypeList: "jpg,png,jpeg",
        fileList: [],
      },
      //分享图片
      share: {
        limit: 3,
        fileTypeList: "jpg,png,jpeg",
        fileList: [],
      },
      //省市区
      options: regionData,
      props:{multiple :true},
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
        startTime: null,
        endTime: null,
        approveStatus: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        activityAbb: [
          { required: true, message: "活动系统内名称不能为空", trigger: "change" },
          { max: 20, message: '活动系统内名称长度不能超过20', trigger: 'blur' }
        ],
        activityName: [
          { required: true, message: "活动名称不能为空", trigger: "blur" },
          { max: 20, message: '活动名称长度不能超过20', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        intro:[
          { required: true, message: "活动简介不能为空", trigger: "blur" }
        ],
        rangeName: [
          { required: true, message: "活动区域范围不能为空", trigger: "blur" }
        ],
        budget: [
          { required: true, message: "活动总预算不能为空", trigger: "blur" },
          {
            pattern: /^([0-9]|[1-9]\d+)(\.\d{1,2})?$/,
            message: "请输入正确的数字",
            trigger: "blur"
          }
        ],
        xiaoxiangPayNum: [
          { required: true, message: "潇湘支付出资比例不能为空", trigger: "blur" },
          {
            pattern: /^(100|([1-9][0-9]?)|(0|[1-9][0-9]?)(\.[\d]{1,2}))$/,
            message: "请输入正确的数字",
            trigger: "blur"
          }
        ],
        orgName: [
          { required: true, message: "出资机构名称不能为空", trigger: "blur" }
        ],
        alarmNum: [
          { required: true, message: "剩余资金预警比例不能为空", trigger: "blur" },
          {
            pattern: /^(100|([1-9][0-9]?)|(0|[1-9][0-9]?)(\.[\d]{1,2}))$/,
            message: "请输入正确的数字",
            trigger: "blur"
          }
        ],
        alarmContent: [
          { required: true, message: "预警内容不能为空", trigger: "blur" }
        ],
        alarmPhone: [
          { required: true, message: "预警手机号不能为空", trigger: "blur" },
        ],
        payMethod: [
          { required: true, message: "支付方式不能为空", trigger: "blur" }
        ],
        effectTime: [
          { required: true, message: "有效时间不能为空", trigger: "blur" }
        ],
        limitNum: [
          { required: true, message: "限制次数不能为空", trigger: "blur" }
        ],
        useRule: [
          { required: true, message: "使用规则不能为空", trigger: "blur" }
        ],
      },
      merchantRules:{
        merchantName: [
          { required: true, message: "商户名称不能为空", trigger: "blur" }
        ],
        merchantNo: [
          { required: true, message: "商户编号不能为空", trigger: "blur" }
        ],
        settleType: [
          { required: true, message: "活动营销资金结算方式不能为空", trigger: "blur" }
        ],
        industryType: [
          { required: true, message: "行业类型不能为空", trigger: "blur" }
        ],
        activityConsumRate: [
          { required: true, message: "活动期间商户消费费率不能为空", trigger: "blur" },
          {
            pattern: /^([0-9]|[1-9]\d+)(\.\d{1,2})?$/,
            message: "请输入正确的数字",
            trigger: "blur"
          }
        ],
      },
      grantRules:{
        couponName: [
          { required: true, message: "优惠券名称不能为空", trigger: "blur" }
        ],
        grantNum: [
          { required: true, message: "发放数量不能为空", trigger: "blur" },
          {
            pattern: /^[+]{0,1}(\d+)$/,
            message: "请输入正确的数字",
            trigger: "blur"
          }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询活动信息列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
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
        intro: null,
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
      this.reset();
      this.open = true;
      this.title = "添加活动信息";
      this.form.shareFlag = '1'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        if(response.data.regionCode){
          let address = (response.data.regionCode).split(",");
          for(let i = 0; i < address.length; i++){
            address[i] = address[i].split("-").map(Number)
          }
          this.form.regionName = address
        }
        this.open = true;
        this.title = "修改活动信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.shareFlag === '1'){
            if(!this.form.shareTitle){
              this.$message.warning("分享标题不能为空")
              return
            }
            if(!this.form.shareContent){
              this.$message.warning("分享文案不能为空")
              return
            }
          }
          if(!this.form.regionName){
            this.$message.warning("活动区域范围不能为空")
            return
          }
          this.form.startTime = this.filterTime(this.form.startTime)
          this.form.endTime = this.filterTime(this.form.endTime)
          let region = this.form.regionName
          let result = []
          let regionList = []
          for(let i = 0; i < region.length; i++){
            let data = region[i]
            let str = ''
            let code = ''
            for(let j = 0; j < data.length; j++){
              str += CodeToText[data[j]]
              code += data[j] + '-'
            }
            regionList.push(code.substr(0, code.length -1))
            result.push(str)
          }
          this.form.regionName = result.join(",")
          this.form.regionCode = regionList.join(",")
          this.form.contractPhoto = this.shrinkPics.fileList.join(",")
          this.form.detailPhoto = this.detailPics.fileList.join(",")
          this.form.sharePhoto = this.share.fileList.join(",")
          if (this.form.id != null) {
            updateInfo(this.form).then(response => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            if(this.shrinkPics.fileList.length <= 0){
              this.$message.warning("活动缩略图不能为空")
              return
            }
            if(this.detailPics.fileList.length <= 0){
              this.$message.warning("活动详情图不能为空")
              return
            }
            if(this.form.shareFlag === '1'){
              if(this.share.fileList.length <= 0){
                this.$message.warning("分享图片不能为空")
                return
              }
            }
            addInfo(this.form).then(response => {
              this.$message.success("新增成功");
              this.shrinkPics.fileList = []
              this.detailPics.fileList = []
              this.share.fileList = []
              this.$refs.contractPhoto.fileList = []
              this.$refs.detailPhoto.fileList = []
              this.$refs.sharePhoto.fileList = []
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除当前的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInfo(ids);
        }).then(() => {
          this.getList();
        this.$message.info("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('activity/export', {
        ...this.queryParams
      }, `活动信息_${this.parseTime(new Date(),"{y}-{m}-{d}")}.xlsx`)
    },
    //分享图片
    getSharePic(e, type) {
      let arr = [];
      e.map((item) => {
        arr.push(item.url);
      });
      this.share.fileList = arr;
    },
    //详情图片
    getDetailPic(e, type) {
      let arr = [];
      e.map((item) => {
        arr.push(item.url);
      });
      this.detailPics.fileList = arr;
    },
    //缩略图片
    getShrinkPic(e, type) {
      let arr = [];
      e.map((item) => {
        arr.push(item.url);
      });
      this.shrinkPics.fileList = arr;
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
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + s;
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
    //提交审核
    submitAudit(e){
      let data = {}
      data['id'] = e.id
      submitAudit(data).then((res) => {
        this.$message.success('提交成功')
        this.handleQuery();
      })
    },
    //配置优惠
    configCoupon(e){
      getInfo(e.id).then(res => {
        this.couponInfo = res.data
        this.couponInfo.sameActivityFlag = '0'
        this.couponInfo.diffActivityFlag = '0'
        this.couponInfo.outActivityFlag = '0'
        if(!this.couponInfo.contactList){
          this.couponInfo.isEdit = '0'
        }else {
          this.couponInfo.isEdit = '1'
        }
        this.couponModel = true;
      })
    },
    // 取消配置优惠弹窗
    couponCancel() {
      this.couponModel = false;
    },
    //提交配置优惠
    couponConfirm(){
      let form = this.couponInfo;
      form['activityId'] = form.activityId
      form['couponInfoList'] = form.infoList
      submitCoupon(form).then(res => {
        this.$message.success('操作成功')
        this.couponModel = false;
        this.handleQuery();
      })
    },
    //打开指定用户弹窗
    specifyUser(e){
      this.cardModel = true
      this.id = e.id
    },
    //根据卡编号获取卡片信息
    cardNoChange(e){
      getCardUserInfo(e).then(res => {
        this.userInfo.cardNo = res.data.cardNo
        this.userInfo.cardName = res.data.cardName
        this.userInfo.appUserId = res.data.appUserId
        this.userInfo.appAccount = res.data.appAccount
        this.userInfo.companyUserName = res.data.companyUserName
        this.userInfo.cardFaceName = res.data.cardFaceName
        this.userInfo.phoneNumber = res.data.phoneNumber
      });
    },
    //加入
    joinCard(){
      let cardInfo = this.userInfo
      if(cardInfo){
        this.cardList.push(cardInfo)
      }
    },
    //删除卡片信息
    handleDeleteCard(e){
      let index = this.cardList.indexOf(e)
      if(index !== -1){
        this.cardList.splice(index, 1)
      }
    },
    //取消指定用户
    cardCancel(){
      this.id = null
      this.userInfo = {}
      this.cardList = []
      this.cardModel = false
    },
    //提交指定用户
    cardConfirm(){
      if(this.cardList.length <= 0){
        this.$message.warning("请添加卡分类信息")
        return
      }
      let data = {}
      data['cardInfoList'] = this.cardList
      data['activityId'] = this.id
      specifyUser(data).then(res => {
        if(res.code > 0){
          this.$message.success('操作成功')
          this.id = null
          this.handleQuery();
        }else {
          this.$message.error(res.msg)
        }
        this.cardModel = false;
      })
    },
    //打开发放优惠券弹窗
    handleGrant(e){
      this.id = e.id
      grantCoupon(e.id).then(res => {
        this.couponNameList = res.data
      })
      this.grantModel = true
    },
    //优惠券名称下拉框修改，同步修改其他数据
    couponNameChange(e){
      this.couponNameList.forEach(d => {
        if(d.couponName === e){
          this.grantInfo.inventoryNum = d.inventoryNum
          this.grantInfo.couponId = d.couponId
        }
      })
    },
    //关闭发放优惠券弹窗
    grantCancel(){
      this.grantInfo.inventoryNum = null
      this.grantInfo.couponId = null
      this.grantInfo.couponName = null
      this.grantInfo.grantNum = null
      this.couponNameList = []
      this.grantModel = false
    },
    //提交发放优惠券
    grantConfirm(){
      if(!this.grantInfo.grantNum){
        this.$message.warning("请输入发放数量")
        return
      }
      if(Number(this.grantInfo.grantNum) > this.grantInfo.inventoryNum){
        this.$message.warning("发放数量不能超过库存数量")
        return
      }
      this.grantInfo.activityId = this.id
      submitGrant(this.grantInfo).then(res=>{
        this.$message.success("发放成功")
        this.grantInfo.inventoryNum = null
        this.grantInfo.couponId = null
        this.grantInfo.couponName = null
        this.grantInfo.grantNum = null
        this.couponNameList = []
        this.id = null
        this.grantModel = false
      })
    },
    //卡分类导入
    handleImport(){
      this.upload.title = "卡分类导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('activity/importTemplate', {
      }, `卡分类模板.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.cardCancel()
      this.$alert("<div style='overflow: auto; width:600px;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    //打开配置商户弹窗
    configMerchant(e){
      this.id = e.id
      getConfigMerchant(e.id).then(res => {
        this.merchantList = res.data
        this.merchantModel = true
      })
    },
    //选择行业类型加载商户
    firstChange(type){
      getMerchantList(type).then(res => {
        this.merchantNameList = res.data
      })
    },
    //修改商户名称
    merchantNameChange(e){
      this.merchantNameList.forEach(d => {
        if(d.merchantName === e){
          this.merchantForm.merchantNo = d.merchantNo
          this.merchantForm.activityNum = d.activityNum
          this.merchantForm.consumRate = d.consumRate
          this.merchantForm.activityConsumRate = d.activityConsumRate
        }
      })
    },
    //打开新增商户弹窗
    addMerchant(){
      //获取商户列表（领取门槛为指定卡号，可消费商户仅支持在指定卡号的可用商户范围内选择）

      //获取活动有效时间
      getInfo(this.id).then(res => {
        this.merchantForm.effectStartTime = res.data.startTime
        this.merchantForm.effectEndTime = res.data.endTime
      })
      this.merchantTitle = '新增商户'
      this.merchantOpen = true
    },
    //取消新增商户弹窗
    merchantAddCancel(){
      this.merchantOpen = false
      this.merchantNameList = []
      this.merchantForm.merchantNo = null
      this.merchantForm.activityNum = null
      this.merchantForm.consumRate = null
      this.merchantForm.activityConsumRate = null
      this.merchantForm.effectStartTime = null
      this.merchantForm.effectEndTime = null
      this.merchantForm.settleType = null
    },
    //提交选择的商户
    merchantAddConfirm(){
      let flag = false
      let data = {}
      if(this.merchantList.length > 0){
        this.merchantList.forEach(e => {
          if(e.merchantNo === this.merchantForm.merchantNo){
            e.settleType = this.merchantForm.settleType
            e.activityConsumRate = this.merchantForm.activityConsumRate
            flag = true
          }
        })
      }
      if(!flag){
        data['merchantNo'] = this.merchantForm.merchantNo.trim()
        data['merchantName'] = this.merchantForm.merchantName.trim()
        data['industryType'] = this.merchantForm.industryType.trim()
        data['settleType'] = this.merchantForm.settleType.trim()
        data['activityConsumRate'] = this.merchantForm.activityConsumRate.trim()
        this.merchantList.push(data)
      }
      this.merchantOpen = false
      this.merchantForm.merchantNo = null
      this.merchantForm.merchantName = null
      this.merchantForm.activityConsumRate = null
      this.merchantForm.effectStartTime = null
      this.merchantForm.effectEndTime = null
      this.merchantForm.settleType = null
      this.merchantForm.industryType = null
      this.merchantNameList = []
    },
    //删除选择的商户
    handleDeleteMerchant(e){
      let index = this.merchantList.indexOf(e)
      if(index !== -1){
        this.merchantList.splice(index, 1)
      }
    },
    //取消配置商户弹窗
    merchantCancel(){
      this.id = null
      this.merchantList = []
      this.merchantModel = false
    },
    //提交保存配置商户
    merchantConfirm(){
      if(this.merchantList.length <= 0){
        this.$message.warning("请选择商户")
        return
      }
      let data = {}
      data['activityId'] = this.id
      data['merchantList'] = this.merchantList
      configMerchant(data).then(res => {
        this.$message.success("配置成功")
        this.id = null
        this.merchantList = []
        this.merchantModel = false
      })
    },
    //商户导入
    importMerchant(){
      this.merchantUpload.title = "卡分类导入";
      this.merchantUpload.open = true;
    },
    /** 商户下载模板操作 */
    importMerchantTemplate() {
      this.download('activity/importMerchantTemplate', {
      }, `商户模板.xlsx`)
    },
    // 文件上传中处理
    merchantUploadProgress(event, file, fileList) {
      this.merchantUpload.isUploading = true;
    },
    // 文件上传成功处理
    handleMerchantFileSuccess(response, file, fileList) {
      this.merchantUpload.open = false;
      this.merchantUpload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.merchantCancel()
      this.$alert("<div style='overflow: auto; width:600px;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitMerchantFileForm() {
      this.$refs.upload.submit();
    },
    //停止活动
    handleStop(e){
      const id = e.id;
      let data = {}
      data['activityId'] = id
      this.$confirm('是否确认停止当前的活动?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return stopActivity(data);
      }).then(() => {
        this.getList();
        this.$message.info("停止成功");
      }).catch(() => {});
    },
    //重启活动
    handleRestart(e){
      const id = e.id;
      let data = {}
      data['activityId'] = id
      this.$confirm('是否确认重启当前的活动?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return restartActivity(data);
      }).then(() => {
        this.getList();
        this.$message.info("重启成功");
      }).catch(() => {});
    },
  }
};
</script>
