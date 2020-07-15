<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>交易管理</BreadcrumbItem>
            <BreadcrumbItem>交易列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.outTradeNo" placeholder="输入订单号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.outOrderNo" placeholder="输入外部订单号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.authNo" placeholder="输入授权单号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.wayId" placeholder="输入渠道编码" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.sellerNo" placeholder="输入收款账号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.phoneNumber" placeholder="输入办理手机号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <DatePicker type="datetimerange" v-model="dateRange" style="width: 200px"></DatePicker>&nbsp;&nbsp;
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择交易状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="query.dealState" clearable style="width: 150px; margin-right: 10px" placeholder="请选择操作状态">
                    <Option v-for="item in settleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="query.city" clearable style="width: 150px; margin-right: 10px" placeholder="请选择地区">
                    <Option v-for="item in areaList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="excelExport">导出到文件管理</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row, index }" slot="action">
                        <!--<Button type="primary" size="small" style="margin-right: 5px"  v-if="row.state == 1 && (row.dealState == 4 || row.dealState == 0)" @click="toConfirm(1,row)">补发通知</Button>-->
                        <!--<Button type="primary" size="small" style="margin-right: 5px"  v-if="row.state == 1 && (row.dealState == 1 || row.dealState == 3)" @click="toConfirm(2,row)">结算</Button>-->
                        <Button type="primary" size="small" style="margin-right: 5px"  v-if="row.state == 1" @click="toConfirm(0,row)">退款</Button>
                        <Button type="primary" size="small" style="margin-right: 5px"  v-if="row.state == 1" @click="toConfirm(3,row)">还款金额</Button>
                    </template>
                </Table>
            </div>

            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
        </div>

        <Modal
                v-model="confirmModal"
                :loading="loading"
                :title="confirmTitle"
                @on-ok="toClick"
                @on-cancel="clearModal">
            <p>{{confirmContent}}</p>
        </Modal>

        <modal v-model="selectExport" width="550px"  mask-closable="false">
            <p slot="header" style="color:#000000;text-align:center">
                是否对以下敏感字段进行加密
            </p>
            <CheckboxGroup  v-model="hidden" @on-change="checkAllGroupChange" style="height: 50px;text-align: center;margin-top: 25px">
                <Checkbox label="hiddenPhone" style="margin-right: 60px">办理手机号</Checkbox>
                <Checkbox label="hiddenSellerNo" style="margin-right: 60px">收款账户</Checkbox>
                <Checkbox label="hiddenSellerName" style="margin-right: 20px">收款人</Checkbox>
            </CheckboxGroup>
            <div slot="footer" style="text-align: center">
                <Button type="primary" size="large" style="width: 100px" @click="batchExport">确定</Button>
            </div>
        </modal>
        <Modal v-model="exportModal" title="数据导出">
            <p slot="header" style="color:#000000;text-align:center">
                数据导出
            </p>
            <p style="margin: 3px 0px">导出内容：交易可退款列表</p>
            <p v-if="query.outTradeNo !=null" style="margin: 3px 0px">订单号:{{query.outTradeNo}}</p>
            <p v-if="query.outOrderNo !=null" style="margin: 3px 0px">外部订单号：{{query.outOrderNo}}</p>
            <p v-if="query.wayId !=null" style="margin: 3px 0px">渠道编码：{{query.wayId}}</p>
            <p v-if="query.receiveNo !=null" style="margin: 3px 0px">支付宝账号：{{query.receiveNo}}</p>
            <p style="margin: 3px 0px">开始时间：{{query.startTime}}</p>
            <p style="margin: 3px 0px">结束时间：{{query.endTime}}</p>
            <p style="margin: 3px 0px">导出规则： 导出任务创建后，会保留在任务列表中，10分钟后自动删除，请及时下载。</p>
            <div slot="footer">
                <Button type="default" @click="exportModal = false">取消</Button>
                <Button type="primary" @click="submitExport">创建导出任务</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import moment from 'moment';
    import {list,settle,refund,batchExport,getAreaListByLevelOrParentCode,getSettleAmount} from "../../api/trade";

    export default {
        name: "trade-list",
        data() {
            return {
                hiddenPhone:false,
                hiddenSellerNo:false,
                hiddenSellerName:false,
                selectExport:false,
                exportModal: false,
                hidden:['hiddenPhone','hiddenSellerNo','hiddenSellerName'],
                dateRange: [],
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '门店名称',
                        key: 'storeName',
                        width: 200,
                        tooltip: true,
                        align: 'center'
                    },
                    {
                        title: '渠道编码',
                        key: 'wayId',
                        width: 150
                    },
                    {
                        title: '订单号',
                        key: 'outTradeNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '授权订单号',
                        key: 'authNo',
                        width: 250,
                        align: 'center'
                    },
                    {
                        title: '外部订单号',
                        key: 'outOrderNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '套餐金额',
                        key: 'amount',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '结算金额',
                        key: 'settleAmount',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '办理手机',
                        key: 'phoneNumber',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '捆绑期数',
                        key: 'num',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '套餐标题',
                        key: 'title',
                        width: 200,
                        tooltip: true,
                        align: 'center'
                    },
                    {
                        title: '收款账号',
                        key: 'sellerNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '收款人',
                        key: 'name',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '返佣金额',
                        key: 'rebate',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '返佣结算状态',
                        key: 'rebateState',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '红包金额',
                        key: 'redPacketAmount',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '红包领取状态',
                        key: 'redPacketStateDesc',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '红包结算类型',
                        key: 'redPacketTypeDesc',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '红包领取账号',
                        key: 'redPacketSellerNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '交易时间',
                        key: 'createTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '结束时间',
                        key: 'finishTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '订单状态',
                        key: 'stateStr',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '当前状态',
                        key: 'dealStateStr',
                        width: 100,
                        render: (h, params) => {
                            return h('Tooltip', {
                                props: { placement: 'top',transfer: true }
                            }, [
                                params.row.dealStateStr,
                                h('div', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },
                                    [h('p',params.row.reason)])
                            ])
                        }
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ],
                list: [],
                stateList: [
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '0',
                        label: '等待支付'
                    },
                    {
                        value: '1',
                        label: '交易成功'
                    },
                    {
                        value: '2',
                        label: '交易退款'
                    },
                    {
                        value: '-1',
                        label: '交易关闭'
                    }
                ],
                settleList: [
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '4',
                        label: '等待通知'
                    },
                    {
                        value: '0',
                        label: '通知失败'
                    },
                    {
                        value: '2',
                        label: '等待打款'
                    },
                    {
                        value: '1',
                        label: '打款失败'
                    },
                    {
                        value: '3',
                        label: '当天签约'
                    },
                    {
                        value: '5',
                        label: '打款成功'
                    },
                    {
                        value: '6',
                        label: '还款成功'
                    },
                ],
                areaList: [
                ],
                query:{
                },
                loading:true,
                confirmModal:false,
                confirmTitle:"",
                confirmContent:"",
                type:null,
                row:null,
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
            }
        },
        mounted() {
            this.getList(this.page.currentPage, this.page.count);
            this.getAreaListByLevelOrParentCode();
        },
        methods: {
            beginSearch(isSearch) {
                if (isSearch == 0) {
                    this.page.currentPage = 0
                }
                this.getList(this.page.currentPage, this.page.count)
            },
            getList: async function (cp, c) {
                let query = new Object()
                query.page = cp;
                query.limit = c;
                if (this.query.outTradeNo){
                    query.outTradeNo = this.query.outTradeNo;
                }
                if (this.query.outOrderNo){
                    query.outOrderNo = this.query.outOrderNo;
                }
                if (this.query.authNo){
                    query.authNo = this.query.authNo;
                }
                if (this.query.state){
                    query.state = this.query.state;
                }
                if (this.query.dealState){
                    query.dealState = this.query.dealState;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.query.sellerNo){
                    query.sellerNo = this.query.sellerNo;
                }
                if (this.query.phoneNumber){
                    query.phoneNumber = this.query.phoneNumber;
                }
                if (this.query.city){
                    query.city = this.query.city;
                }
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
                }
                const result = await list(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements
                }
            },
            checkAllGroupChange(){
                for(let i=0;i<this.hidden.length;i++){
                    let name = this.hidden[i];
                    this.query[name] = true;
                }

            },
            exports(){
                this.selectExport = true
            },
            /*batchExport: async function () {
                let query = new Object()
                if (this.query.outTradeNo){
                    query.outTradeNo = this.query.outTradeNo;
                }
                if (this.query.outOrderNo){
                    query.outOrderNo = this.query.outOrderNo;
                }
                if (this.query.authNo){
                    query.authNo = this.query.authNo;
                }
                if (this.query.state){
                    query.state = this.query.state;
                }
                if (this.query.dealState){
                    query.dealState = this.query.dealState;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.query.sellerNo){
                    query.sellerNo = this.query.sellerNo;
                }
                if (this.query.phoneNumber){
                    query.phoneNumber = this.query.phoneNumber;
                }
                if (this.query.city){
                    query.city = this.query.city;
                }
                query.sort = "finish_time";
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
                }
                for(let i=0;i<this.hidden.length;i++){
                    let name = this.hidden[i];
                    query[name] = true;
                }
                console.log(query)
                const result = await batchExport(query)
                if (result.code == 20000) {
                    location.href = result.data;
                    this.selectExport = false;
                }else {
                    this.$Message.error(result.msg);
                }
            },*/
            getAreaListByLevelOrParentCode: async function() {
                let query = new Object();
                query.level = 2;
                const result = await getAreaListByLevelOrParentCode(query);
                if (result.code == 20000) {
                    this.areaList = result.data;
                }
            },
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            settle: async function () {
                let query = new Object()
                query.outTradeNo = this.row.outTradeNo;
                const result = await settle(query)
                if (result.code == 20000) {
                    this.$Message.success("操作成功")
                    this.clearModal();
                    this.getList(this.page.currentPage, this.page.count);
                }else {
                    this.$Message.error(result.msg)
                }
            },
            refund: async function () {
                let query = new Object()
                query.outTradeNo = this.row.outTradeNo;
                const result = await refund(query)
                if (result.code == 20000) {
                    this.$Message.success("退款成功")
                    this.clearModal();
                    this.getList(this.page.currentPage, this.page.count);
                }else {
                    this.$Message.error(result.msg)
                    this.clearLoading();
                }
            },
            toClick: async function () {
                if (this.type == 0) {
                    this.refund();
                } else {
                    this.clearModal();
                }
            },
            toConfirm:async function (type,row) {
                if (type == 0) {
                    this.confirmTitle = "确认退款";
                    this.confirmContent = "请确认相关资金已回款";
                } else if (type == 3) {
                    if (!this.getSettleAmount(row)) {
                        return;
                    }
                } else {
                    return;
                }
                this.row = row;
                this.type = type;
                this.confirmModal = true;
            },
            getSettleAmount: async function (row) {
                let query = new Object()
                query.authNo = row.authNo;
                const result = await getSettleAmount(query)
                if (result.code == 20000) {
                    this.confirmTitle = "还款金额";
                    this.confirmContent = "该笔订单结清还款金额为" + result.data + "元";
                    return true;
                } else {
                    this.$Message.error(result.msg)
                    this.clearLoading();
                    return false;
                }
            },
            clearModal(){
                this.confirmModal = false;
                this.confirmTitle = "";
                this.confirmContent = "";
                this.clearLoading();
                this.$Modal.remove();
                this.row = null;
                this.type = null;
            },
            clearLoading(){
                this.loading = false;
                this.$nextTick(() => {
                    this.loading = true;
                })
            },
            submitExport: async function () {
                let query = new Object()
                if (this.query.outTradeNo){
                    query.outTradeNo = this.query.outTradeNo;
                }
                if (this.query.outOrderNo){
                    query.outOrderNo = this.query.outOrderNo;
                }
                if (this.query.authNo){
                    query.authNo = this.query.authNo;
                }
                if (this.query.state){
                    query.state = this.query.state;
                }
                if (this.query.dealState){
                    query.dealState = this.query.dealState;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.query.sellerNo){
                    query.sellerNo = this.query.sellerNo;
                }
                if (this.query.phoneNumber){
                    query.phoneNumber = this.query.phoneNumber;
                }
                if (this.query.city){
                    query.city = this.query.city;
                }
                query.sort = "finish_time";
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
                }
                for(let i=0;i<this.hidden.length;i++){
                    let name = this.hidden[i];
                    query[name] = true;
                }
                const result = await batchExport(query)
                this.exportModal=false;
                if (result.code == 20000) {
                    this.$Message.success(result.data)
                } else {
                    this.$Message.error(result.msg)
                }
            },
            excelExport: async function () {
                if (this.dateRange[0] != '' && this.dateRange[1] !='') {
                    this.query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD');
                    this.query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD');
                    this.exportModal = true;
                }else{
                    this.query.startTime =moment(new Date()).format('YYYY-MM-DD');
                    this.query.endTime =moment(new Date()).format('YYYY-MM-DD');
                    this.exportModal = true;
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .box
        width 100%
        .form-box
            margin 20px
            .list
                margin-top 20px
                .image-style
                    width 100px
                    height 80px
                    margin 5px
                    .image-item
                        width 100%
                        height 100%
                        border-radius 5px
            .Page
                text-align: center
                padding: 20px
</style>