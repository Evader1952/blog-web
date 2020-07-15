<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>系统管理</BreadcrumbItem>
            <BreadcrumbItem>套餐管理</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.title" placeholder="输入套餐标题" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.num" placeholder="输入捆绑期数" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;
                <Select v-model="query.bizType" clearable style="width: 150px; margin-right: 10px" placeholder="请选择套餐类型" >
                    <Option v-for="item in bizTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
<!--                <Select v-model="query.redPackState" clearable style="width: 150px; margin-right: 10px" placeholder="请选择红包状态" >-->
<!--                    <Option v-for="item in redPacketList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
<!--                </Select>-->
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择套餐状态">
                    <Option v-for="item in mealList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
            </div>

            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 10px" v-if="row.state==0" @click="up(row)">上架</Button>
                        <Button type="primary" size="small" style="margin-right: 10px;background-color: darkgray;color: white;border: none" v-else-if="row.state==1" >上架</Button>

                        <Button type="primary" size="small" style="margin-right: 10px" v-if="row.state==1" @click="takeOff(row)">下架</Button>
                        <Button type="primary" size="small" style="margin-right: 10px;background-color: darkgray;color: white;border: none" v-else-if="row.state==0">下架</Button>

                        <Button type="primary" size="small" @click="edit(row)">编辑</Button>
                        <Button type="primary" size="small" v-if="row.type==2" @click="toPlanPage(row)">充值计划</Button>
                    </template>
                </Table>
            </div>

            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
        </div>

        <Modal  v-model="editMeals"
                title="修改套餐管理信息"
                :mask-closable="false"
                :closable="false"
                :loading="modalLoading"
                @on-ok="editsMeal">
            <Form label-position="right" :label-width="130">
                <FormItem label="套餐标题：">
                    <Input type="textarea" v-model="title" style="width: 270px"/>
                </FormItem>
                <FormItem label="套餐金额：">
                    <Input v-model="totalAmount" style="width: 270px" disabled/>
                </FormItem>
                <FormItem label="结算金额：">
                    <Input v-model="settleAmount" style="width: 270px"/>
                </FormItem>
                <FormItem label="每期应还：">
                    <Input v-model="eachAmount" style="width: 270px"/>
                </FormItem>
                <FormItem label="捆绑期数：">
                    <Input v-model="num" style="width: 270px" disabled/>
                </FormItem>
                <FormItem label="红包金额：">
                    <Input v-model="redPacketAmount" style="width: 270px"/>
                </FormItem>
                <FormItem label="红包状态：">
                    <Select v-model="redPacketState" style="width: 150px; margin-right: 10px" >
                        <Option v-for="item in redPackList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import {list,update} from "../../api/meal";

    export default {
        name: "mealList",
        data(){
            return{
                title:'',
                totalAmount:'',
                redPacketAmount:'',
                num:'',
                redPacketState:'',
                redPacketStateStr:'',
                settleAmount:'',
                eachAmount:'',
                query:{},
                columns:[
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '套餐标题',
                        key: 'title',
                        align: 'center',
                        tooltip:true,
                    },
                    {
                        title: '套餐金额',
                        key: 'totalAmount',
                        align: 'center'
                    },
                    {
                        title: '结算金额',
                        key: 'settleAmount',
                        align: 'center'
                    },
                    {
                        title: '每期应还',
                        key: 'eachAmount',
                        align: 'center'
                    },
                    {
                        title: '捆绑期数',
                        key: 'num',
                        align: 'center'
                    },
                    // {
                    //     title: '红包状态',
                    //     key: 'redPacketStateStr',
                    //     align: 'center'
                    // },
                    // {
                    //     title: '红包金额',
                    //     key: 'redPacketAmount',
                    //     align: 'center'
                    // },
                    {
                        title: '套餐状态',
                        key: 'stateStr',
                        align: 'center'
                    },
                    {
                        title: '业务类型',
                        key: 'typeName',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        align: 'center',
                        width: '200'
                    }
                ],
                redPacketList:[
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '1',
                        label: '开启'
                    },
                    {
                        value: '0',
                        label: '关闭的'
                    },
                ],
                bizTypeList:[
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '1',
                        label: '和分期'
                    },
                    {
                        value: '2',
                        label: '物联网卡'
                    },
                ],

                mealList:[
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '1',
                        label: '已上架'
                    },
                    {
                        value: '0',
                        label: '已下架'
                    },
                ],
                redPackList:[
                    {
                        value: 1,
                        label: '开启'
                    },
                    {
                        value: 0,
                        label: '关闭的'
                    },
                ],
                list:[],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                modalLoading: true,
                editMeals:false,
            }
        },
        mounted() {
            this.getList(this.page.currentPage, this.page.count)
        },
        methods:{
            beginSearch(isSearch) {
                if (isSearch == 0) {
                    this.page.currentPage = 0
                }
                this.getList(this.page.currentPage, this.page.count)
            },
            getList: async function(cp,c){
                let query = new Object()
                query.page = cp;
                query.limit = c;
                this.page.currentPage = cp;
                this.page.count = c;
                if (this.query.title){
                    query.title = this.query.title;
                }
                if(this.query.num){
                    query.num = this.query.num;
                }
                if (this.query.redPackState){
                    query.redPackState = this.query.redPackState;
                }
                if (this.query.state){
                    query.state = this.query.state;
                }
                const result = await list(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements
                }
            },
            async takeOff(row){
                update({'id':row.id,'state':0}).then(result=>{
                    if(result.code == 20000){
                        this.getList(this.page.currentPage, this.page.count)
                        this.state = '0'
                    }else {
                        this.$Message.error(`${result.msg}`)
                    }
                })
            },
            async up(row){
                update({'id':row.id,'state':1}).then(result=>{
                    if(result.code == 20000){
                        this.getList(this.page.currentPage, this.page.count)
                        this.state = '0'
                    }else {
                        this.$Message.error(`${result.msg}`)
                    }
                })
            },
            edit(row){
                this.editMeals = true
                this.title = row.title
                this.num = row.num
                this.totalAmount = row.totalAmount
                this.settleAmount = row.settleAmount
                this.redPacketAmount = row.redPacketAmount
                this.redPacketState = row.redPacketState
                this.eachAmount = row.eachAmount
                this.id = row.id
                console.log(this.redPacketState);
            },
            async editsMeal(){
                let query = new Object()
                if(this.title){
                    query.title = this.title
                }else {
                    this.$Message.info('请填写活动标题');
                    this.cancelLoading();
                    return;
                }
                if(this.num){
                    query.num = this.num
                }else {
                    this.$Message.info('请填写捆绑期数');
                    this.cancelLoading();
                    return;
                }
                if(this.totalAmount){
                    query.totalAmount = this.totalAmount
                }else {
                    this.$Message.info('请填写套餐金额');
                    this.cancelLoading();
                    return;
                }
                if(this.settleAmount){
                    query.settleAmount = this.settleAmount
                }else {
                    this.$Message.info('请填写结算金额');
                    this.cancelLoading();
                    return;
                }
                if(this.redPacketAmount){
                    query.redPacketAmount = this.redPacketAmount
                }else {
                    this.$Message.info('请填写红包金额');
                    this.cancelLoading();
                    return;
                }
                if(this.redPacketState == 0 || this.redPacketState == 1){
                    query.redPacketState = this.redPacketState
                }else {
                    this.$Message.info('请填写红包状态');
                    this.cancelLoading();
                    return;
                }
                if(this.eachAmount){
                    query.eachAmount = this.eachAmount
                }else {
                    this.$Message.info('请填写每期应还');
                    this.cancelLoading();
                    return;
                }
                query.id = this.id
                const result = await update(query)
                if(result.code == 20000){
                    this.$Message.success(`编辑成功`)
                    this.getList(this.page.currentPage, this.page.count)
                    this.cancelLoading()
                    this.editMeals = false
                }else {
                    this.$Message.error(`${result.msg}`)
                }
            },
            cancelLoading(){
                this.modalLoading = false
                setTimeout(() =>{
                    this.$nextTick(() =>{
                        this.modalLoading = true
                    })
                },100)
            },
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            toPlanPage: async function (row) {
                this.$router.push({path: '/setmeal/mealPlan', query: {id: row.id,num:row.num,packageNo:row.packageNo,title:row.title,totalAmount:row.totalAmount}})
            }
        },
    }
</script>

<style lang="stylus" scoped>
    .box
        width 100%
        .form-box
            margin 20px
            .list
                margin-top 20px
        .Page
            text-align: center
            padding: 20px
</style>