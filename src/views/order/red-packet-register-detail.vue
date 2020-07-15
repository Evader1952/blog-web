<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>注册详情</BreadcrumbItem>
            <BreadcrumbItem :to="{name:'redpacketRegister'}">领红包注册登记</BreadcrumbItem>
            <BreadcrumbItem>商户详情</BreadcrumbItem>
        </Breadcrumb>

        <div class="form-box">
            <Button type="primary" style="margin-right: 10px" v-if="edit == 0" @click="toEdit">编辑</Button>
            <Button type="primary" style="margin-right: 10px" v-if="edit == 1" @click="save">保存</Button>
            <Tabs name="tab" value="a" class="imgView">
                <TabPane label="注册信息" name="a" tab="tab">
                    <div class="content">
                        <Row>
                            <Col span="11">
                                <div class="box-right">
                                    <div class="detailsInfo" v-if="edit == 0">
                                        <p>支付宝UID<span>{{detail.aliUId}}</span></p>
                                        <p>支付宝账号<span>{{detail.aliNo}}</span></p>
                                        <p>支付宝实名<span>{{detail.aliName}}</span></p>
                                        <p>手机号<span>{{detail.phone}}</span></p>
                                        <p>渠道编码<span>{{detail.wayId}}</span></p>
                                    </div>
                                    <div class="detailsInfo" v-if="edit == 1">
                                        <p>支付宝UID<span><Input disabled="disabled" type="text" v-model="detail.aliUId" size="small"
                                                             style="width: 250px"/></span></p>
                                        <p>支付宝账号<span><Input type="text" v-model="detail.aliNo" size="small"
                                                             style="width: 250px"/></span></p>
                                        <p>支付宝实名<span><Input type="text" v-model="detail.aliName" size="small"
                                                              style="width: 250px"/></span></p>
                                        <p>手机号<span><Input type="text" v-model="detail.phone" size="small"
                                                             style="width: 250px"/></span></p>
                                        <p>渠道编码<span><Input disabled="disabled" type="text" v-model="detail.wayId" size="small"
                                                             style="width: 250px"/></span></p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </TabPane>
            </Tabs>
            <H3 style="margin-top: 20px;">修改记录列表：</H3>
            <div class="list" style="margin-top: 5px;">
                <Table size="small" :columns="columns" :data="list" >
                    <template slot-scope="{ row }" slot="action">
                    </template>
                </Table>
            </div>
            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
        </div>
    </div>
</template>

<script>
    import {detail,updateRegister,getChangeLog} from "../../api/packet";
    export default {
        name: "registerDetail",
        data() {
            return {
                detail:{},
                edit:0,
                list: [],
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '修改项目',
                        key: 'changeItem',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '修改前',
                        key: 'beforeChange',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '修改后',
                        key: 'afterChange',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '修改时间',
                        align: 'center',
                        key: 'changeTime'
                    },
                    {
                        title: '操作人',
                        align: 'center',
                        key: 'operator'
                    }
                ],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
            }
        },
        mounted() {
            this.getDetail();
            this.getChangeList(this.page.currentPage, this.page.count);
        },
        methods: {
            toEdit: async function () {
                this.edit =1;
            },
            save: async function () {
                let query = this.detail;
                const result = await updateRegister(query)
                if (result.code == 20000) {
                    this.$Message.success("修改成功")
                    this.getDetail();
                    this.edit =0;
                    this.getChangeList(this.page.currentPage, this.page.count);
                }else {
                    this.$Message.error(result.msg);
                }
            },
            getDetail: async function () {
                let query = new Object()
                query.id = this.$route.query.id;
                if (query.id == null || query.id == undefined){
                    return;
                }
                const result = await detail(query)
                if (result.code == 20000) {
                    this.detail = result.data;
                }
            },
            getChangeList: async function (cp, c) {
                let query = new Object()
                query.page = cp;
                query.limit = c;
                query.redPacketRegisterRecordId = this.$route.query.id;
                if (query.redPacketRegisterRecordId == null || query.redPacketRegisterRecordId == undefined){
                    return;
                }
                const result = await getChangeLog(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements;
                }
            },
            changePage: function (cp) {
                this.getChangeList((cp - 1), this.page.count)
            },

        }
    }
</script>

<style lang="stylus" scoped>
    .box
        width 100%
        .form-box
            margin 20px
            .Page
                text-align: center
                padding: 20px
            .tab-right
                position absolute
                right 40px
                top 90px
                z-index 99
            .content
                border 1px solid #ccc
                border-top none
                margin-top -17px
                .box-left
                    padding 20px
                    height 700px
                    h4
                        font-size 16px
                        color #666
                        margin-bottom 10px
                    .imgView img
                        width auto
                        height auto
                        max-width 100%
                        max-height 600px

                .box-right
                    /*padding 30px 0*/
                    margin-left 20px
                    padding-bottom 10px
                    h4
                        font-size 16px
                        color #666
                        margin-bottom 20px
                    .detailsInfo
                        p
                            font-size 14px
                            line-height 27px
                            text-align left
                        span
                            float right
                            text-align right

</style>