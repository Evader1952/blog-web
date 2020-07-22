<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>收支管理</BreadcrumbItem>
            <BreadcrumbItem>账目列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.title" placeholder="输入收支简介" style="width: 150px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <!--<DatePicker type="daterange" v-model="dateRange" style="width: 150px"></DatePicker>&nbsp;&nbsp;-->

                <Select v-model="query.type" clearable style="width: 150px; margin-right: 10px" placeholder="请选择收支类型">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="query.bizType" clearable style="width: 150px; margin-right: 10px" placeholder="请选择业务类型">
                    <Option v-for="item in bizTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="query.redPackState" clearable style="width: 150px; margin-right: 10px" placeholder="请选择返佣状态">
                    <Option v-for="item in redPackStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="query.buyWay" clearable style="width: 150px; margin-right: 10px" placeholder="请选择购买渠道">
                    <Option v-for="item in buyWayList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <DatePicker type="daterange"  v-model="dateRange" :options="options2" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>&nbsp;&nbsp;

                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="warning" style="width: 60px" @click="addOverhead=true">开销</Button>&nbsp;&nbsp;
                <Button type="success" style="width: 60px" @click="addTrade=true">刷单</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                <!--<Button type="primary" @click="excelExport">导出到文件管理</Button>&nbsp;&nbsp;-->
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="width: 60px;margin-right: 15px" v-if="row.redPackState==0" @click="settleRedPack(row)" >结算返佣</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="success" size="small" style="width: 60px" v-if="row.state==0" @click="settleAmount(row)" >结清金额</Button>
                    </template>
                </Table>
            </div>

            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
            <br/>
            <Tabs type="card">
                <Tab-pane label="收支查询">
                <div style="margin:0 auto;border:1px;width:500px;height:500px">
                    <DatePicker type="daterange"  v-model="dates"  :options="options2" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>&nbsp;&nbsp;
                    <Button type="primary" shape="circle" icon="ios-search" @click="getAmountByTime()">搜索</Button>
                    <br/><br/><br/>
                    <h2>收入: {{amountInOut.inAmount}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 支出: {{amountInOut.outAmount}}</h2>
                </div>
                </Tab-pane>
                <Tab-pane label="今日收支">
                    <Row :gutter="20">
                        <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
                            <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
                                <count-to :end="infor.count" count-class="count-style"/>
                                <p>{{ infor.title }}</p>
                            </infor-card>
                        </i-col>
                    </Row>
                    <h1>收入: {{amountData.dayInAmount}}</h1>
                    <h1>支出: {{amountData.dayOutAmount}}</h1>
                </Tab-pane>
                <Tab-pane label="本周收支">
                    <h1>收入: {{amountData.weekInAmount}}</h1>
                    <h1>支出: {{amountData.weekOutAmount}}</h1>
                </Tab-pane>
                <Tab-pane label="本月收支">
                    <h1>收入: {{amountData.monthInAmount}}</h1>
                    <h1>支出: {{amountData.monthOutAmount}}</h1>
                </Tab-pane>
                <Tab-pane label="年度收支">
                    <h1>收入: {{amountData.yearInAmount}}</h1>
                    <h1>支出: {{amountData.yearOutAmount}}</h1>
                </Tab-pane>
                <Tab-pane label="总收支">
                    <h1>收入: {{amountData.allInAmount}}</h1>
                    <h1>支出: {{amountData.allOutAmount}}</h1>
                </Tab-pane>
            </Tabs>
            <modal v-model="addTrade" :mask-closable="false" :closable="false" title="新增收支" :loading="modalLoading" @on-cancel="cancelAdds" @on-ok="add(1)">
                <div>
                    <Form label-position="left" :label-width="100" style="margin-left: 30px">
                        <FormItem label="收支简介：">
                            <Input type="text" v-model="addForm.title" style="width: 300px" placeholder="请输入商品名称"/>
                        </FormItem>
                        <FormItem label="商品价格：">
                            <Input type="text" v-model="addForm.amount" style="width: 300px" aria-required="true" placeholder="请输入商品价格"/>
                        </FormItem>

                        <FormItem label="实付金额：">
                            <Input type="text" v-model="addForm.paymentAmount" style="width: 300px" aria-required="true" placeholder="请输入实付金额"/>
                        </FormItem>

                        <FormItem label="备注：">
                            <Input type="textarea" v-model="addForm.remark" style="width: 300px"/>
                        </FormItem>

                        <FormItem label="购买渠道：">
                            <Select v-model="addForm.buyWay" clearable style="width: 300px" placeholder="请选择购买渠道">
                                <Option v-for="item in buyWayList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="佣金：">
                            <Input type="text" v-model="addForm.rebateAmount" style="width: 300px" aria-required="true" placeholder="请输入实付金额"/>
                        </FormItem>


                    </Form>
                </div>
            </modal>

            <modal v-model="addOverhead" :mask-closable="false" :closable="false" title="新增收支" :loading="modalLoading" @on-cancel="cancelAdds" @on-ok="add(0)">
                <div>
                    <Form label-position="left" :label-width="100" style="margin-left: 30px">
                        <FormItem label="收支类型：">
                            <RadioGroup v-model="addForm.types"  type="button">
                                <Radio v-for="item in typeList" :label="item.label" :key="item.value" :value="item.value"></Radio>
                            </RadioGroup>
                        </FormItem>
                        <!--<FormItem label="收支类型：">-->
                        <!--<Select v-model="addForm.type" clearable style="width: 300px" placeholder="请选择收支类型">-->
                        <!--<Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                        <!--</Select>-->
                        <!--</FormItem>-->
                        <FormItem label="收支简介：">
                            <Input type="text" v-model="addForm.title" style="width: 300px" placeholder="请输入商品名称"/>
                        </FormItem>
                        <FormItem label="收支金额：">
                            <Input type="text" v-model="addForm.amount" style="width: 300px" aria-required="true" placeholder="请输入商品价格"/>
                        </FormItem>
                        <FormItem label="收支备注：">
                            <Input type="textarea" v-model="addForm.remark" style="width: 300px"/>
                        </FormItem>
                    </Form>
                </div>
            </modal>

            <Modal v-model="exportModal" title="数据导出">
                <p slot="header" style="color:#000000;text-align:center">
                    数据导出
                </p>
                <p style="margin: 3px 0px">导出内容：订单列表</p>
                <p v-if="query.wayId !=null" style="margin: 3px 0px">渠道编码：{{query.wayId}}</p>
                <p v-if="query.name !=null" style="margin: 3px 0px">收款人:{{query.name}}</p>
                <p v-if="query.sellerNo !=null" style="margin: 3px 0px">收款账号：{{query.sellerNo}}</p>
                <p v-if="query.phoneNumber !=null" style="margin: 3px 0px">办理手机号：{{query.phoneNumber}}</p>
                <p style="margin: 3px 0px">开始时间：{{query.startTime}}</p>
                <p style="margin: 3px 0px">结束时间：{{query.endTime}}</p>
                <p style="margin: 3px 0px">加密字段：
                    <CheckboxGroup  v-model="hidden" @on-change="checkAllGroupChange" style="height: 18px;text-align: left;width:85%;float: right;margin-top: -2px;">
                        <Checkbox label="hiddenPhone" style="margin-left: -10px">办理手机号</Checkbox>
                        <Checkbox label="hiddenSellerNo" style="margin-left: 20px">收款账户</Checkbox>
                        <Checkbox label="hiddenSellerName" style="margin-left: 20px">收款人</Checkbox>
                    </CheckboxGroup>
                </p>
                <p style="margin: 3px 0px">导出规则： 导出任务创建后，会保留在任务列表中，10分钟后自动删除，请及时下载。</p>
                <div slot="footer">
                    <Button type="default" @click="exportModal = false">取消</Button>
                    <Button type="primary" @click="submitExport">创建导出任务</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import {batchExport, list,add,settle,getAmount,getAmountByTime} from "../../api/trade";
    export default {
        name: "trade-list",
        data() {
            return {
                inforCardData: [
                    { title: '新增用户', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
                    { title: '累计点击', icon: 'md-locate', count: 232, color: '#19be6b' },
                    { title: '新增问答', icon: 'md-help-circle', count: 142, color: '#ff9900' },
                    { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' },
                    { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
                    { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
                ],
                addTrade:false,
                addOverhead:false,
                selectExport:false,
                dateRange: [],
                dates:[],
                options2: {
                    shortcuts: [
                        {
                            text: '最近一周',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近一个月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近三个月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
                    ]
                },
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: '收支简介',
                        key: 'title',
                        width: 100,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: '金额',
                        key: 'amount',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '实付金额',
                        key: 'paymentAmount',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '返佣金额',
                        key: 'rebateAmount',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '购买渠道',
                        key: 'buyWayDesc',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '开销类型',
                        key: 'bizTypeDesc',
                        width: 100,
                        align: 'center'
                    },

                    {
                        title: '收支类型',
                        key: 'typeDesc',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '返佣状态',
                        key: 'redPackStateDesc',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'stateDesc',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 370,
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
                        label: '已结算'
                    },
                    {
                        value: '1',
                        label: '未结算'
                    },
                ],
                redPackStateList: [
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '',
                        label: '全部状态'
                    },
                    {
                        value: '0',
                        label: '待返佣'
                    },
                    {
                        value: '1',
                        label: '已返佣'
                    },
                ],

                buyWayList: [
                    {
                        value: '',
                        label: '无'
                    },
                    {

                        value: '0',
                        label: '淘宝'
                    },
                    {
                        value: '1',
                        label: '京东'
                    },
                    {
                        value: '2',
                        label: '拼多多'
                    },
                    {
                        value: '3',
                        label: '淘礼品'
                    },
                ],
                bizTypeList: [
                    {
                        value: '',
                        label: '全部'
                    },
                    {
                        value: '0',
                        label: '开销'
                    },
                    {
                        value: '1',
                        label: '刷单'
                    }
                ],
                typeList:[
                    {
                        value: '0',
                        label: '收入'
                    },
                    {
                        value: '1',
                        label: '支出'
                    }
                ],
                addForm:{},
                amountData:{},
                amountInOut:{},
                amountInfo:{},
                exportModal: false,
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
                refundModal: false,

            }
        },
        mounted() {
            this.getList(this.page.currentPage, this.page.count);
            this.getAmount();
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
                if (this.query.title){
                    query.title = this.query.title;
                }
                if (this.query.state){
                    query.state = this.query.state;
                }
                if (this.query.bizType){
                    query.bizType = this.query.bizType;
                }
                if (this.query.type){
                    query.type = this.query.type;
                }
                if (this.query.redPackState){
                    query.redPackState = this.query.redPackState;
                }
                if (this.query.buyWay){
                    query.buyWay = this.query.buyWay;
                }
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD') + ' 00:00:00'
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD') + ' 23:59:59'
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
            // exports(){
            //     this.selectExport = true
            // },

            // submitExport: async function () {
            //     let query = new Object()
            //     if (this.query.outTradeNo){
            //         query.outTradeNo = this.query.outTradeNo;
            //     }
            //     if (this.dateRange[0] != '' && this.dateRange[1] != '') {
            //         query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD') + ' 00:00:00'
            //         query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD') + ' 23:59:59'
            //     }
            //     for(let i=0;i<this.hidden.length;i++){
            //         let name = this.hidden[i];
            //         query[name] = true;
            //     }
            //     const result = await batchExport(query)
            //     this.exportModal=false;
            //     if (result.code == 20000) {
            //         this.$Message.success(result.data)
            //     } else {
            //         this.$Message.error(result.msg)
            //     }
            // },
            // excelExport: async function () {
            //     if (this.dateRange[0] != '' && this.dateRange[1] !='') {
            //         this.query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD') + ' 00:00:00';
            //         this.query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD') + ' 23:59:59';
            //         this.exportModal = true;
            //     }else{
            //         this.query.startTime =moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00';
            //         this.query.endTime =moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59';
            //         this.exportModal = true;
            //     }
            // },
            cancelAdds(){
                this.addForm={};

            },
            cancelLoading(){
                this.modalLoading = false
                setTimeout(() =>{
                    this.$nextTick(() =>{
                        this.modalLoading = true
                    })
                },100)
            },
            add:async function (bizType) {
                this.addForm.bizType=bizType;
                if (bizType == 1){
                    this.addForm.types="支出";
                }
                const result = await add(this.addForm)
                if (result.code == 20000) {
                    this.addForm = {};
                    this.getList(0, this.page.count);
                    this.$Message.success('添加成功')
                    this.addTrade = false;
                    this.addOverhead=false;
                    this.cancelLoading()
                }else {
                    this.$Message.error(result.msg);
                    this.cancelLoading()
                }
            },
            settleRedPack: async function (row) {
                this.$Modal.confirm({
                    title: '确认信息',
                    content: '<h4>确定结算返佣嘛</h4>',
                    okText: '我已确认',
                    cancelText: '取消',
                    onOk: () => {
                        settle({'id':row.id,'redPackState':1,'type':0}).then(result=>{
                            if(result.code == 20000){
                                this.getList(this.page.currentPage, this.page.count)
                                this.$Message.success(`${result.data}`)
                            }else {
                                this.$Message.error(`${result.msg}`)
                            }
                        })
                    },
                })
            },
            settleAmount: async function (row) {
                this.$Modal.confirm({
                    title: '确认信息',
                    content: '<h4>确定结清金额嘛</h4>',
                    okText: '我已确认',
                    cancelText: '取消',
                    onOk: () => {
                        settle({'id':row.id,'state':1,'type':1}).then(result=>{
                            if(result.code == 20000){
                                this.getList(this.page.currentPage, this.page.count)
                                this.$Message.success(`${result.data}`)
                            }else {
                                this.$Message.error(`${result.msg}`)
                            }
                        })
                    },
                })
            },
            getAmount:async function () {
                const result = await getAmount()
                if (result.code == 20000) {
                    this.amountData= result.data;
                    console.log(this.amountData)
                }
            },
            getAmountByTime:async function () {
                let query = new Object()
                if (this.dates[0] != '' && this.dates[1] != '') {
                    query.startTime = moment(this.dates[0]).format('YYYY-MM-DD') + ' 00:00:00'
                    query.endTime = moment(this.dates[1]).format('YYYY-MM-DD') + ' 23:59:59'
                }

                const result = await getAmountByTime(query)
                if (result.code == 20000) {
                    this.amountInOut= result.data;
                    console.log(this.amountInOut)
                }
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