<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>系统管理</BreadcrumbItem>
            <BreadcrumbItem>移动端菜单</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">

            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" v-if="row.sort!=1"
                                @click="sort(row,-1)">上移
                        </Button>
                        <Button type="primary" size="small" style="margin-right: 5px" v-if="row.sort!=page.total"
                                @click="sort(row,1)">下移
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
    import {h5List, changeSort} from "../../api/file";
    import moment from 'moment'
    export default {
        name: "h5Index",
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
                        title: '菜单名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '排序号',
                        key: 'sort',
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
                query: {id:''},
                dateRange: [],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                formItem: {},
                formItemEdit: {},
                fileInfo: {},
                state: '',
                totalElements: ''

            }
        },
        mounted() {
            this.getList(this.page.currentPage, this.page.count);
        },
        methods: {

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
                const result = await h5List(query)
                if (result.code == 20000) {
                    this.list = result.data.content;


                    this.page.total = result.data.totalElements
                    console.log(this.page.total)
                }
            },
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            async sort(row,state) {
                let query = new Object()
                query.id=row.id;
                query.state=state;
                const result = await changeSort(query)
                if (result.code == 20000) {
                    this.$Message.success(`${result.data}`)
                } else {
                    this.$Message.error(`${result.msg}`)
                }
                this.getList(this.page.currentPage, this.page.count);

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