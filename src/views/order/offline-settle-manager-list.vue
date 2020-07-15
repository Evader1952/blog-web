<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>交易管理</BreadcrumbItem>
            <BreadcrumbItem>线下结算列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.authNo" placeholder="输入授权单号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <DatePicker type="daterange" v-model="dateRange" style="width: 200px" placeholder="请选择导入时间"></DatePicker>&nbsp;&nbsp;


                <Button slot="append" icon="ios-search" @click="beginSearch(0)" v-hasPermission="'search'">搜索</Button>&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" @click="showImport" >批量导入</Button>&nbsp;&nbsp;
                <Button type="primary" class="tab-right" @click="exportTemplate" >下载模板</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list" >

                </Table>
            </div>
            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
        </div>
        <Modal v-model="importModal" title="请选择excel表格" :mask-closable="false" footer-hide @on-cancel="hideImport">
            <Upload ref="upload" :action="importUrl"
                    :format="['xls','xlsx']" :headers="header" :on-success="batchImport">
                <Button type="primary" icon="md-cloud-upload">导入线下结算信息</Button>
            </Upload>
            <div style="text-align: right" v-show="importData">{{tip}}</div>
        </Modal>

    </div>
</template>

<script>
    import moment from 'moment'
    import storage from '../../storage'
    import {list,exportTemplate} from "../../api/offlineSettle";
    import axios from "../../config/axios";
    import batchImportUrl from "../../api/index";

    export default {
        name: "merchant-list",
        data() {
            return {
                dateRange: [],
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '授权单号',
                        key: 'authNo',
                        width: 250
                    },
                    {
                        title: '结算金额',
                        key: 'settleAmount',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '描述',
                        key: 'remark',
                        width: 100,
                        tooltip: true
                    },
                    {
                        title: '状态',
                        key: 'stateDesc',
                        width: 100,
                        tooltip: true
                    },
                    {
                        title: '退单时间',
                        key: 'refundTime',
                        width: 200,
                        tooltip: true
                    },
                    {
                        title: '导入时间',
                        key: 'createTime',
                        width: 200,
                        tooltip: true
                    },

                ],
                list: [],
                stateList: [
                    {value:'',label:'全部状态'},
                    {value:'0',label:'已退单'},
                    {value:'1',label:'已结算'},
                ],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                query:{

                },
                row:null,
                importModal:false,
                importData:false,
                tip: '',
                header:{authorization:storage.get('login_token')},
                importUrl:axios.getBaseUrl()+batchImportUrl.offlineSettle.batchImport,
            }
        },
        mounted() {
             this.getList(this.page.currentPage, this.page.count);
        },
        methods: {
            showImport() {
                this.importModal = true;
            },
            hideImport(){
                this.importModal = false;
            },

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
                if (this.query.authNo){
                    query.authNo = this.query.authNo;
                }
                if (this.query.state){
                    query.state = this.query.state;
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
            batchImport(response) {
                if (response.code == 20000) {
                    this.$Message.success("导入成功")
                    this.hideImport();
                    location.href = response.data;
                    this.getList(this.page.currentPage, this.page.count);
                } else {
                    this.$Message.error(response.msg)
                }
            },
            exportTemplate: async function () {
                let params={}
                const result = await exportTemplate(params)
                if (result.code == 20000) {
                    location.href = result.data;
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
                width 73%
            .Page
                text-align: center
                padding: 20px
</style>