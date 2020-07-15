<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>交易管理</BreadcrumbItem>
            <BreadcrumbItem>退款列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.outTradeNo" placeholder="输入订单号" style="width: 170px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.outOrderNo" placeholder="输入外部订单号" style="width: 170px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.wayId" placeholder="输入渠道编码" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <DatePicker type="daterange" v-model="dateRange" style="width: 200px"></DatePicker>&nbsp;&nbsp;
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择退款状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="query.redPacketState" clearable style="width: 150px; margin-right: 10px" placeholder="请选择红包状态">
                    <Option v-for="item in rsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="query.repaymentState" clearable style="width: 150px; margin-right: 10px" placeholder="请选择垫资状态">
                    <Option v-for="item in rpsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="excelExport">导出到文件管理</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px"  v-if="row.redPacketState == 1" @click="changeRedPacketState(row)">红包回款</Button>
                        <Button type="primary" size="small" style="margin-right: 5px"  v-if="row.repaymentState == 2" @click="changeRepaymentState(row)">垫资回款</Button>
                        <Button type="primary" size="small" style="margin-right: 5px"  v-if="row.repaymentState == 3" @click="toConfirm(row)">结清贷款</Button>
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
                @on-ok="settle"
                @on-cancel="clearModal">
            <p>{{confirmContent}}</p>
        </Modal>
        <Modal v-model="exportModal" title="数据导出">
            <p slot="header" style="color:#000000;text-align:center">
                数据导出
            </p>
            <p style="margin: 3px 0px">导出内容：退款列表</p>
            <p v-if="query.outTradeNo !=null" style="margin: 3px 0px">订单号:{{query.outTradeNo}}</p>
            <p v-if="query.outOrderNo !=null" style="margin: 3px 0px">外部订单号：{{query.outOrderNo}}</p>
            <p v-if="query.wayId !=null" style="margin: 3px 0px">渠道编码：{{query.wayId}}</p>
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
    import {list,changeRedPacketState,changeRepaymentState,settle,batchExport} from "../../api/refund";

    export default {
        name: "trade-list",
        data() {
            return {
                dateRange: [],
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '订单号',
                        key: 'outTradeNo',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '外部订单号',
                        key: 'outOrderNo',
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
                        title: '渠道编码',
                        key: 'wayId',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '发起时间',
                        key: 'createTime',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '退款时间',
                        key: 'finishTime',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '交易时间',
                        key: 'dealTime',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '退款金额',
                        key: 'amount',
                        width: 200,
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
                        key: 'sellerName',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '红包金额',
                        key: 'redPacketAmount',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '退款状态',
                        key: 'stateDesc',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '红包状态',
                        key: 'redPacketStateDesc',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '垫资回款状态',
                        key: 'repaymentStateDesc',
                        width: 200,
                        align: 'center'
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
                        label: '等待退款'
                    },
                    {
                        value: '-1',
                        label: '退款失败'
                    },
                    {
                        value: '1',
                        label: '退款成功'
                    }
                ],
                rpsList: [
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '0',
                        label: '无需结清'
                    },
                    {
                        value: '3',
                        label: '回款成功'
                    },
                    {
                        value: '2',
                        label: '等待回款'
                    },
                    {
                        value: '1',
                        label: '结清贷款'
                    }
                ],
                rsList: [
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '1',
                        label: '未退还'
                    },
                    {
                        value: '2',
                        label: '已退还'
                    },
                    {
                        value: '0',
                        label: '未领取'
                    }
                ],
                query:{
                },
                loading:true,
                confirmModal:false,
                confirmTitle:"",
                confirmContent:"",
                row:null,
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                exportModal: false
            }
        },
        mounted() {
            this.getList(this.page.currentPage, this.page.count);
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
                if (this.query.state){
                    query.state = this.query.state;
                }
                if (this.query.redPacketState){
                    query.redPacketState = this.query.redPacketState;
                }
                if (this.query.repaymentState){
                    query.repaymentState = this.query.repaymentState;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD')
                }
                const result = await list(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements
                }
            },
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            changeRepaymentState: async function (row) {
                let query = {};
                query.id = row.id;
                const result = await changeRepaymentState(query)
                if (result.code == 20000) {
                    this.$Message.success("操作成功");
                    this.getList(this.page.currentPage, this.page.count);
                }else {
                    this.$Message.error(result.msg);
                }
            },
            changeRedPacketState: async function (row) {
                let query = {};
                query.id = row.id;
                const result = await changeRedPacketState(query)
                if (result.code == 20000) {
                    this.$Message.success("操作成功");
                    this.getList(this.page.currentPage, this.page.count);
                }else {
                    this.$Message.error(result.msg);
                }
            },
            settle: async function () {
                let query = {};
                query.outTradeNo = this.row.outTradeNo;
                const result = await settle(query)
                if (result.code == 20000) {
                    this.$Message.success("结清成功");
                    this.clearModal();
                    this.getList(this.page.currentPage, this.page.count);
                }else {
                    this.clearLoading();
                    this.$Message.error(result.msg);
                }
            },
            toConfirm:async function (row) {
                this.confirmModal = true;
                this.row = row;
                this.confirmTitle = "确认结清";
                this.confirmContent = "是否确认结清贷款？";
            },
            clearModal(){
                this.confirmModal = false;
                this.confirmTitle = "";
                this.confirmContent = "";
                this.clearLoading();
                this.$Modal.remove();
                this.row = null;
            },
            clearLoading(){
                this.loading = false;
                this.$nextTick(() => {
                    this.loading = true;
                })
            },
            /*batchExport: async function () {
                let query = new Object()
                if (this.query.outTradeNo){
                    query.outTradeNo = this.query.outTradeNo;
                }
                if (this.query.outOrderNo){
                    query.outOrderNo = this.query.outOrderNo;
                }
                if (this.query.state){
                    query.state = this.query.state;
                }
                if (this.query.redPacketState){
                    query.redPacketState = this.query.redPacketState;
                }
                if (this.query.repaymentState){
                    query.repaymentState = this.query.repaymentState;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD')
                }
                const result = await batchExport(query)
                if (result.code == 20000) {
                    location.href = result.data;
                }else {
                    this.$Message.error(result.msg);
                }
            },*/
            submitExport: async function () {
                let query = new Object()
                if (this.query.outTradeNo){
                    query.outTradeNo = this.query.outTradeNo;
                }
                if (this.query.outOrderNo){
                    query.outOrderNo = this.query.outOrderNo;
                }
                if (this.query.state){
                    query.state = this.query.state;
                }
                if (this.query.redPacketState){
                    query.redPacketState = this.query.redPacketState;
                }
                if (this.query.repaymentState){
                    query.repaymentState = this.query.repaymentState;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD')
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