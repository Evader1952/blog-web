<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>账号管理</BreadcrumbItem>
            <BreadcrumbItem>关联商户</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.storeName" placeholder="输入商户名称" style="width: 180px"
                       @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Input clearable v-model="query.wayId" placeholder="输入渠道编码" style="width: 180px"
                       @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="addModal=true" >添加</Button>&nbsp;&nbsp;
                <Button type="primary" @click="showImport">批量新增</Button>&nbsp;&nbsp;

            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row, index }" slot="action">

                        <Button type="primary" size="small" style="width: 60px" @click="freeze(row)"
                                v-if="row.state==1">解除绑定
                        </Button>

                    </template>
                </Table>
            </div>
            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count"
                      @on-change="changePage"/>
            </div>
        </div>

        <Modal v-model="importModal" title="请选择excel表格" :mask-closable="false" footer-hide @on-cancel="hideImport">
            <Upload ref="upload" :action="importUrl"
                    :format="['xls','xlsx']" :headers="header" :on-success="batchImport">
                <Button type="primary" icon="md-cloud-upload">导入开通商户信息</Button>
            </Upload>
            <div style="text-align: right" v-show="importData">{{tip}}</div>
        </Modal>

        <modal v-model="addModal" :mask-closable="false" :closable="false" title="新增关联商户" :loading="modalLoading"
               @on-cancel="cancelAdds" @on-ok="addUserMerchant">
            <div>
                <Form label-position="left" :label-width="100" style="margin-left: 30px">

                    <FormItem label="关联渠道编码:">
                        <Input type="text" v-model="addForm.wayId" style="width: 300px" aria-required="true"
                               placeholder="请输入关联商户的渠道编码" />
                    </FormItem>

                </Form>
            </div>
        </modal>
    </div>
</template>

<script>
    import storage from '../../storage'
    import {subsidiaryMerchantList,updateSubsidiaryMerchant,addByWayId} from "../../api/merchantAccount";
    import axios from "../../config/axios";
    import batchImportUrl from "../../api/index";
    export default {
        name: "merchant-list",
        data() {
            return {
                modalLoading: true,
                userId: this.$route.query.id,
                addForm: {
                    wayId: '',
                },
                tip: '',
                header:{authorization:storage.get('login_token')},
                importUrl:axios.getBaseUrl()+batchImportUrl.merchantAccount.batchImport+"?uid="+this.$route.query.id+"",
                list: [],
                addModal:false,
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '商户名称',
                        key: 'storeName',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '渠道编码',
                        key: 'wayId',
                        width: 300,
                        tooltip: true
                    },
                    {
                        title: '关联渠道',
                        key: 'typeDesc',
                        width: 300,
                        tooltip: true
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 340,
                        align: 'center'
                    }

                ],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                query: {},
                importModal: false,
                importData: false,

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
                console.log(this.uid)
                let query = new Object()
                query.page = cp;
                query.limit = c;
                if (this.query.wayId) {
                    query.wayId = this.query.wayId;
                }
                if (this.query.storeName) {
                    query.storeName = this.query.storeName;
                }

                if (this.userId){
                    query.userId=this.userId;
                }

                const result = await subsidiaryMerchantList(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements
                }
            },
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            //批量导入相关
            showImport() {
                this.importModal = true;
            },
            hideImport(){
                this.importModal = false;
            },
            cancelAdds(){
                this.addForm={}
            },
            addUserMerchant: async function () {
                let query = new Object()
                if(this.userId){
                    query.uid=this.userId
                }
                if (this.addForm.wayId) {
                    query.wayId = this.addForm.wayId
                } else {
                    this.$Message.info('请填写渠道编码');
                    this.cancelLoading();
                    return;
                }
                const result = await addByWayId(query)
                if (result.code == 20000) {
                    this.addForm.wayId='';

                    this.$Message.success('添加成功')
                    this.addModal = false
                    this.getList(0, this.page.count);
                    this.cancelLoading()
                } else {
                    this.$Message.error(result.msg);
                    this.addForm.wayId='';
                    this.cancelLoading()
                }
            },
            cancelLoading() {
                this.modalLoading = false
                setTimeout(() => {
                    this.$nextTick(() => {
                        this.modalLoading = true
                    })
                }, 100)
            },
            freeze: async function (row) {
                this.$Modal.confirm({
                    title: '确认信息',
                    content: '<h4>是否解除绑定当前账号</h4>',
                    okText: '我已确认',
                    cancelText: '取消',
                    onOk: () => {
                        updateSubsidiaryMerchant({'id': row.id, 'state': 0}).then(result => {
                            if (result.code == 20000) {
                                this.getList(0, this.page.count);
                                this.$Message.success('解除绑定成功')
                            } else {
                                this.$Message.error(`${result.msg}`)
                            }
                        })
                    },
                })
            },
            batchImport(response) {
                if (response.code == 20000) {
                    this.$Message.success("导入成功")
                    this.hideImport();
                    this.$Modal.info({
                        title: "批量新增关联商户提示",
                        content: "新增关联商户成功"+response.data.successCount+"个，失败"+response.data.failCount+" 个, 详情已下载 "
                    });

                    location.href = response.data.url

                    this.getList(this.page.currentPage, this.page.count);
                } else {
                    this.$Message.error(response.msg)


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
