<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>账号管理</BreadcrumbItem>
            <BreadcrumbItem>关联范围</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">

                <Select v-model="query.type" clearable style="width: 150px; margin-right: 10px" placeholder="请选择关联类型">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input clearable v-model="query.range" placeholder="请输入关联范围" style="width: 180px"
                       @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="addModal=true" >添加</Button>&nbsp;&nbsp;

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

        <modal v-model="addModal" :mask-closable="false" :closable="false" title="新增管理账号" :loading="modalLoading"
               @on-cancel="cancelAdds" @on-ok="addUserMerchant">
            <div>
                <Form label-position="left" :label-width="100" style="margin-left: 30px">
                    <FormItem label="账号类型：">
                        <Select v-model="addForm.type" clearable style="width: 150px; margin-right: 10px"
                                placeholder="请选择账号类型" @on-change="selectFn($event)">
                            <Option v-for="type in typeList" :value="type.value" :key="type.value">{{ type.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="关联收款账号:" v-if="sellerNo">
                        <Input type="text" v-model="addForm.sellerNo" style="width: 300px" aria-required="true"
                               placeholder="请输入关联收款账号" v-if="sellerNo"/>
                    </FormItem>
                    <FormItem label="地市范围：" v-if="areas">
                        <Cascader :data="areaList" v-if="areas" @on-change="handleChange" change-on-select  ref="address"></Cascader>
                    </FormItem>
                </Form>
            </div>
        </modal>
    </div>
</template>

<script>
    import {userDimensionList,addSubsidiaryMerchant,getAreas,updateRange} from "../../api/merchantAccount";
    import util from "../../util";

    export default {
        name: "merchant-list",
        data() {
            return {
                modalLoading: true,
                userId: this.$route.query.id,
                provinceCode: '',
                cityCode: '',
                areaCode: '',
                areaList: [],
                areaDesc:'',
                addForm: {
                    type: '',
                    sellerNo: '',
                },

                list: [],
                addModal:false,
                sellerNo: false,
                areas: false,
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '关联类型',
                        key: 'typeDesc',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '关联范围',
                        key: 'range',
                        width: 150,
                        tooltip: true
                    },

                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                        align: 'center'
                    }

                ],
                clearSelect:'',
                typeList: [
                    {value: '0', label: '收款账号'},
                    {value: '1', label: '省市地区'},
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
            this.getAreas();
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
                if (this.query.type) {
                    query.type = this.query.type;
                }
                if (this.query.range) {
                    query.range = this.query.range;
                }

                if (this.userId){
                    query.userId=this.userId;
                }

                const result = await userDimensionList(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements
                }
            },
            changePage: function (cp) {
                this.getList((cp - 1), this.page.count)
            },
            handleChange(value, selectedData) {
                let text = selectedData.map(o => o.values);
                this.provinceCode = text[0];
                this.cityCode = text[1];
                this.areaCode = text[2];

                this.areaDesc = selectedData.map(o => o.label).join('-');

                console.log(this.areaDesc+"|153")

            },
            //获取区域
            getAreas: async function () {
                let query = new Object()
                const result = await getAreas(query)

                if (result.code == 20000) {
                    this.areaList = result.data;
                }
            },
            //批量导入相关
            showImport() {
                this.importModal = true;
            },
            hideImport(){
                this.importModal = false;
            },
            //选择下拉框变换样式
            selectFn: function (event) {
                if (event == 0) {
                    this.sellerNo = true,
                        this.areas = false;
                } else if (event == 1) {
                    this.areas = true,
                        this.sellerNo = false;
                } else {

                }
            },
            cancelAdds(){
               this.addForm={}
                this.$refs.address.clearSelect();
            },
            addUserMerchant: async function () {
                let query = new Object()
                if(this.userId){
                    query.uid=this.userId
                }
                if (this.addForm.type == 0 || this.addForm.type == 1) {
                    query.type = this.addForm.type
                } else {
                    this.$Message.info('请填写类型');
                    this.cancelLoading();
                    return;
                }
                if (this.addForm.type == 0 && this.addForm.sellerNo) {
                    query.sellerNo = this.addForm.sellerNo
                }

                if (this.addForm.type == 0 && util.isEmpty(this.addForm.sellerNo)) {
                    this.$Message.info('请填写收款账号');
                    this.cancelLoading();
                    return;
                }
                if (this.addForm.type == 1 && this.provinceCode) {
                    query.provinceCode = this.provinceCode;
                    if (!util.isEmpty(this.cityCode)) {
                        query.cityCode = this.cityCode;
                    }
                    if (!util.isEmpty(this.areaCode)) {
                        query.areaCode = this.areaCode;
                    }
                }
                if (this.addForm.type == 1 && util.isEmpty(this.provinceCode)) {
                    this.$Message.info('请填写区域');
                    this.cancelLoading();
                    return;
                }
                if (this.areaDesc){
                    query.areaDesc = this.areaDesc;
                }
                const result = await addSubsidiaryMerchant(query)
                if (result.code == 20000) {
                    this.addForm={}

                    if (!util.isEmpty(this.provinceCode)||!util.isEmpty(this.cityCode)||!util.isEmpty(this.areaCode)){
                        this.$refs.address.clearSelect();
                    }
                    this.provinceCode = '';
                    this.cityCode = '';
                    this.areaCode = '';
                    this.$Message.success('添加成功')
                    this.addModal = false
                    this.getList(0, this.page.count);
                    this.cancelLoading()
                } else {
                    this.$Message.error(result.msg);

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
                        updateRange({'id': row.id, 'state': 0}).then(result => {
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
