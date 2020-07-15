<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>文件管理</BreadcrumbItem>
            <BreadcrumbItem>文件列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">

                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择报表状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <DatePicker type="daterange" v-model="dateRange" style="width: 200px"
                            placeholder="申请导出时间范围"></DatePicker>
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" v-if="row.state==3"
                                @click="downLoad(row)">下载
                        </Button>
                    </template>
                </Table>
            </div>

            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count"
                      @on-change="changePage"/>
            </div>
        </div>


    </div>
</template>

<script>
    import {fileList, getHref} from "../../api/file";
    import util from '../../util';
    import moment from 'moment'
    export default {
        name: "fileManage",
        data() {
            return {
                addLoading: false,
                editLoading: false,
                shiftModal: false,
                editModal: false,
                province: false,
                fixedAmount: true,
                percentage: false,
                isFixedAmount: false,
                isPercentage: false,
                city: true,
                shop: false,
                row: null,
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '文件名',
                        key: 'fileName',
                        align: 'center'
                    },
                    {
                        title: '申请导出时间',
                        key: 'exprotTime',
                        align: 'center'
                    },
                    {
                        title: '报表状态',
                        key: 'stateStr',
                        align: 'center'
                    },
                    {
                        title: '导出人',
                        key: 'user',
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ],
                list: [],
                query: {},
                dateRange: [],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                stateList: [
                    {value: '', label: '全部状态'},
                    {value: '1', label: '报表生成失败'},
                    {value: '2', label: '报表生成中'},
                    {value: '3', label: '报表生成成功'},
                    {value: '4', label: '已失效'}
                ],
                formItem: {},
                formItemEdit: {},
                fileInfo: {}

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
                if (this.query.state) {
                    query.state = this.query.state;
                }
                if (this.dateRange[0] != '' && this.dateRange[1] != '') {
                    query.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD')
                    query.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD')
                }
                console.log(query)
                const result = await fileList(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements
                }
            },
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            async downLoad(row) {
                console.log(row)
                let filename = row.fileName;
                getHref({"filename": filename}).then(result => {
                    if (result.code == 20000) {
                        location.href = result.data;
                    } else {
                        this.$Message.error(`${result.msg}`)
                    }
                })
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