<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>交易管理</BreadcrumbItem>
            <BreadcrumbItem>领红包注册登记</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.aliUId" placeholder="请输入支付宝UID" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.alipayName" placeholder="请输入支付宝账号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.aliName" placeholder="输入支付宝实名" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.phone" placeholder="请输入手机号" style="width: 200px" @on-clear="beginSearch(0)"/>
                <Input clearable v-model="query.wayId" placeholder="请输入渠道编码" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择账号状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="toDetail(row)" >详情</Button>
                        <Button type="primary" size="small" style="margin-right: 5px" v-if="row.state==1" @click="close(row)" >关闭账号</Button>
                    </template>
                </Table>
            </div>

            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
        </div>
        <Modal v-model="closeModal" title="关闭账号">
            <div slot="footer">
                <Form :model="formItem">
                    <FormItem>
                        <Input v-model="formItem.reason"
                               type="textarea"
                               :autosize="{minRows: 2,maxRows: 5}"
                               placeholder="请输入关闭此账号理由"/>
                    </FormItem>
                </Form>
                <Button type="default" @click="closeModal = false">取消</Button>
                <Button type="primary" @click="submitClose">确定关闭</Button>
            </div>
        </Modal>
    </div>

</template>

<script>
    import moment from 'moment';
    import {registerList,closeAccount} from "../../api/packet";

    export default {
        name: "redpacket-register",
        data() {
            return {
                dateRange: [],
                exportModal: false,
                closeModal: false,
                formItem:{
                    reason: ''
                },
                info: {},
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '支付宝UID',
                        key: 'aliUId',
                        width: 200,

                        align: 'center'
                    },
                    {
                        title: '支付宝账号',
                        key: 'alipayName',
                        align: 'center'
                    },
                    {
                        title: '支付宝实名',
                        key: 'aliName',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '手机号',
                        key: 'phone',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '渠道编码',
                        key: 'wayId',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'stateDsc',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '关闭原因',
                        key: 'reason',
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
                        value: '1',
                        label: '开启'
                    },
                    {
                        value: '-1',
                        label: '关闭'
                    }
                ],
                query:{
                },
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
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
                if (this.query.aliUId){
                    query.aliUId = this.query.aliUId;
                }
                if (this.query.alipayName){
                    query.alipayName = this.query.alipayName;
                }
                if (this.query.aliName){
                    query.aliName = this.query.aliName;
                }
                if (this.query.phone){
                    query.phone = this.query.phone;
                }
                if (this.query.wayId){
                    query.wayId = this.query.wayId;
                }
                if (this.query.state){
                    query.state = this.query.state;
                }

                const result = await registerList(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements
                }
            },
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            close(row){
                this.info=row;
                this.closeModal=true;
            },
            async submitClose(){
                let query = new Object()
                query.id = this.info.id;
                query.state = -1;
                query.reason = this.formItem.reason;
                const result = await closeAccount(query)
                if (result.code == 20000) {
                    this.$Message.success("关闭成功")
                    this.closeModal=false
                    this.getList(this.page.currentPage, this.page.count)
                } else {
                    this.$Message.error(`${result.msg}`)
                    this.closeModal=false
                    this.getList(this.page.currentPage, this.page.count)
                }
            },
            toDetail(row){
                this.$router.push({path: '/order/registerDetail', query: {id: row.id}})
            },

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