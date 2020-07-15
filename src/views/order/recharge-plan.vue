<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>交易管理</BreadcrumbItem>
            <BreadcrumbItem>交易列表</BreadcrumbItem>
            <BreadcrumbItem>充值计划</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="info">
                <h2 style="padding-bottom: 10px;">
                    <span>订单号：{{this.tradeInfo.outOrderNo}}</span>
                    <span style="margin-left: 20px;">订单状态：{{this.tradeInfo.stateStr}}</span>
                    <span style="margin-left: 20px;">办理手机号：{{this.tradeInfo.phone}}</span>
                    <span style="margin-left: 20px;">期数：{{this.tradeInfo.num}}</span>
                </h2>
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px"  v-if="row.state == 0 || row.state == -1" @click="doRecharge(row)">充值</Button>
                    </template>
                </Table>
            </div>
        </div>
    </div>
</template>

<script>
    import {list, doRecharge} from "../../api/recharge";

    export default {
        name: "trade-recharge-plan",
        data() {
            return {
                columns: [
                    {
                        title: '充值期数',
                        key: 'num',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '充值金额',
                        key: 'amount',
                        // width: 100,
                        align: 'center'
                    },
                    // {
                    //     title: '充值流水号',
                    //     key: 'planNo',
                    //     width: 200,
                    //     align: 'center'
                    // },
                    {
                        title: '充值状态',
                        key: 'state',
                        // width: 100,
                        align: 'center'
                    },
                    {
                        title: '充值时间',
                        key: 'time',
                        // width: 150,
                        align: 'center'
                    },
                    {
                        title: '充值成功时间',
                        key: 'successTime',
                        // width: 150,
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
                        label: '未充值'
                    },
                    {
                        value: '1',
                        label: '充值成功'
                    },
                    {
                        value: '2',
                        label: '充值中'
                    },
                    {
                        value: '-1',
                        label: '充值失败'
                    }
                ],
                query: {
                },
                row: null,
                tradeInfo:{
                    outOrderNo: this.$route.query.outOrderNo,
                    state: this.$route.query.state,
                    stateStr: this.$route.query.stateStr,
                    phone: this.$route.query.phone,
                    num: this.$route.query.num,
                    planList:[]
                },
                isRecharge: false,
                outOrderNo: this.$route.query.outOrderNo
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            beginSearch() {
                this.getList()
            },
            getList: async function () {
                let query = new Object()
                query.outOrderNo = this.outOrderNo
                const result = await list(query)
                if (result.code == 20000) {
                    this.list = result.data;
                }
            },
            doRecharge: async function (row) {
                if (this.isRecharge) {
                    this.$Message.error("正在充值中，请勿重复操作")
                    return;
                }
                this.isRecharge = true;
                this.row = row;
                let param = new Object();
                param.outOrderNo = this.tradeInfo.outOrderNo;
                param.num = row.num;
                const result = await doRecharge(param)
                this.isRecharge = false;
                if (result.code == 20000) {
                    this.$Message.success("充值成功")
                    this.getList();
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