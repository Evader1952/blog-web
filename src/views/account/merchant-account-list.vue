<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>账号管理</BreadcrumbItem>
            <BreadcrumbItem>商户账号</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="search">
                <Input clearable v-model="query.username" placeholder="请输入账号" style="width: 180px"
                       @on-clear="beginSearch(0)"/>&nbsp;&nbsp;
                <Select v-model="query.state" clearable style="width: 150px; margin-right: 10px" placeholder="请选择账号状态">
                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>

                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" @click="addModal=true">新增</Button>&nbsp;&nbsp;
            </div>
            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="width: 60px;margin-right: 15px"
                                @click="edit(row)">修改
                        </Button>
                        <Button type="primary" size="small" style="width: 60px" @click="freeze(row)"
                                v-if="row.state==1">冻结
                        </Button>
                        <Button type="primary" size="small" style="width: 60px" @click="unfreeze(row)" v-else>解冻
                        </Button>
                    </template>
                </Table>
            </div>
            <div class="Page">
                <Page class-name="page" size="small" :total="page.total" :page-size="page.count"
                      @on-change="changePage"/>
            </div>
        </div>

        <modal width="450px" v-model="passwordModal" :mask-closable="false" :closable="false" @on-cancel="cancel"
               @on-ok="showPwd">
            <div style="text-align: center;margin: 10px 20px">
                <p style="font-weight: bolder;padding-bottom: 20px;font-size: 16px">请输入查看密码</p>
                <Input type="text" v-model="queryPwd" placeholder="请输入查看密码"/>
            </div>
        </modal>

        <modal width="450px" v-model="showPasswordModal" :mask-closable="false" :closable="false" @on-cancel="cancel"
               @on-ok="cancelPwdModal">
            <div style="text-align: center;margin: 10px 20px">
                <p style="font-weight: bolder;padding-bottom: 20px;font-size: 16px">请查看正确密码</p>
                <Input type="text" v-model="rowPwd" disabled/>
            </div>
        </modal>

        <modal v-model="addModal" :mask-closable="false" :closable="false" title="新增商户账号" :loading="modalLoading"
               @on-cancel="cancelAdds" @on-ok="addAccount">
            <div>
                <Form label-position="left" :label-width="100" style="margin-left: 30px">
                    <FormItem label="登录账号：">
                        <Input type="text" v-model="addForm.username" style="width: 300px" placeholder="请输入登录账号"/>
                    </FormItem>
                    <FormItem label="登陆密码：">
                        <Input type="text" v-model="addForm.pwd" style="width: 300px" placeholder="请输入登录密码"/>
                    </FormItem>
                    <FormItem label="账号备注：">
                        <Input type="textarea" v-model="addForm.remark" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="账号角色:">
                        商户角色
                    </FormItem>
                </Form>
            </div>
        </modal>

        <Modal v-model="importModal" title="请选择excel表格" :mask-closable="false" footer-hide @on-cancel="hideImport">
            <Upload ref="upload" :action="importUrl"
                    :format="['xls','xlsx']" :headers="header" :on-success="batchImport">
                <Button type="primary" icon="md-cloud-upload">导入开通商户信息</Button>
            </Upload>
            <div style="text-align: right" v-show="importData">{{tip}}</div>
        </Modal>

        <modal v-model="updateModel" :mask-closable="false" :closable="false" title="修改管理账号"
               :loading="modalLoading" @on-ok="updateUser" @on-cancel="cancelUpdateRole">
            <div>
                <Form label-position="left" :label-width="100" style="margin-left: 30px">
                    <FormItem label="登录账号：">
                        <Input type="text" v-model="editForm.username" style="width: 300px" placeholder="请输入登录账号" />
                    </FormItem>
                    <FormItem label="登陆密码：">
                        <Button type="primary" size="small" style="width: 60px;margin-right: 15px"
                                @click="resetPwd()">重置密码
                        </Button>
                    </FormItem>
                    <FormItem label="账号备注：">
                        <Input type="textarea" v-model="editForm.remark" style="width: 300px"/>
                    </FormItem>

                </Form>
            </div>
        </modal>


    </div>
</template>

<script>

    import storage from '../../storage'
    import {list, getAreas, queryPwd, update, addUser,updateDetail,resetPwd} from "../../api/merchantAccount";

    export default {
        name: "merchant-account-list",
        data() {
            return {
                rowId:'',
                modalLoading: true,
                passwordModal: false,
                showPasswordModal: false,
                addModal: false,
                importModal:false,
                updateModel:false,
                add: false,
                text: '',
                id: '',
                addForm: {
                    username: '',
                    pwd: '',
                    remark: '',
                },
                areaList: [],
                provinceCodee: '',
                cityCodee: '',
                areaCodee: '',
                rowPwd:'',
                queryPwd:'',
                editForm:{
                    pwd:'',
                    username:'',

                },
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '登录账号',
                        key: 'username',
                        width: 200,
                        align: 'center'
                    },

                    {
                        title: '密码',
                        key: 'passWord',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                    on: {
                                        click: (row) => {
                                            this.passwordModal = true
                                            this.id = params.row.id
                                        }
                                    },
                                    style: {
                                        tooltip: true,
                                        textDecoration: 'underline'
                                    },
                                },
                                '查看'
                            )
                        }
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '下属商户/区域数',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            return h('Button', {
                                on: {
                                    click: (row) => {
                                        this.$router.push({path: '/subsidiary/merchant/list', query: {id: params.row.uid}})

                                    }
                                },
                                style: {
                                    marginRight: '10px',
                                    width:'40px'
                                },
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                            }, params.row.merchantCount)
                        }
                    },
                    {
                        title: '关联范围数',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            return h('Button', {
                                on: {
                                    click: (row) => {
                                        this.$router.push({path: '/areas/merchant/list', query: {id: params.row.uid}})

                                    }
                                },
                                style: {
                                    marginRight: '10px',
                                    width:'40px'
                                },
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                            }, params.row.rangeCount)
                        }
                    },
                    {
                        title: '账号状态',
                        key: 'stateDesc',
                        width: 200
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        width: 200
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                        align: 'center'
                    }
                ],
                list: [],
                stateList: [
                    {value: '', label: '全部状态'},
                    {value: '1', label: '正常'},
                    {value: '0', label: '已冻结'},
                ],
                typeList: [
                    {value: '0', label: '商户类'},
                    {value: '1', label: '区域类'},
                ],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0
                },
                query: {},
            }
        },
        mounted() {

            this.getList(this.page.currentPage, this.page.count);
               this.getAreas();
        },
        methods: {
            cancelPwdModal(){
                this.showPasswordModal=false;
                this.queryPwd='';
            },
            beginSearch(isSearch) {
                if (isSearch == 0) {
                    this.page.currentPage = 0
                }
                this.getList(this.page.currentPage, this.page.count)
            },
            getList: async function (cp, c) {
               // console.log(this.importUrl)
                let query = new Object()
                query.page = cp;
                query.limit = c;
                if (this.query.username) {
                    query.username = this.query.username;
                }
                if (this.query.state) {
                    query.state = this.query.state;
                }
                if (this.query.alipayLogonId) {
                    query.alipayLogonId = this.query.alipayLogonId;
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
            showPwd: async function () {
                let query = new Object()
                query.uid = this.id

                if (this.queryPwd) {
                    query.pwd = this.queryPwd
                }
                const result = await queryPwd(query)
                if (result.code == 20000) {
                    this.rowPwd = result.data
                    this.showPasswordModal = true
                } else {
                    this.$Message.error(`${result.msg}`)
                    this.queryPwd = ''
                }
            },
            cancel() {
                this.queryPwd = ''
            },
            //获取区域
            getAreas: async function () {
                let query = new Object()
                const result = await getAreas(query)

                if (result.code == 20000) {
                    this.areaList = result.data;
                }
            },
            handleChange(value, selectedData) {
                let text = selectedData.map(o => o.values);
                this.provinceCode = text[0];
                this.cityCode = text[1];
                this.areaCode = text[2];

            },
            freeze: async function (row) {
                this.$Modal.confirm({
                    title: '确认信息',
                    content: '<h4>是否冻结当前账号</h4>',
                    okText: '我已确认',
                    cancelText: '取消',
                    onOk: () => {
                        update({'id': row.id, 'state': 0}).then(result => {
                            if (result.code == 20000) {
                                this.getList(0, this.page.count);
                                this.$Message.success('冻结成功')
                            } else {
                                this.$Message.error(`${result.msg}`)
                            }
                        })
                    },
                })
            },
            unfreeze: async function (row) {
                this.$Modal.confirm({
                    title: '确认信息',
                    content: '<h4>是否解冻当前账号</h4>',
                    okText: '我已确认',
                    cancelText: '取消',
                    onOk: () => {
                        update({'id': row.id, 'state': 1}).then(result => {
                            if (result.code == 20000) {
                                this.getList(0, this.page.count);
                                this.$Message.success('解冻成功')
                            } else {
                                this.$Message.error(`${result.msg}`)
                            }
                        })
                    },
                })
            },

            //添加账号
            addAccount: async function () {
                let query = new Object()
                if (this.addForm.username) {
                    query.username = this.addForm.username
                } else {
                    this.$Message.info('请填写登录账号');
                    this.cancelLoading();
                    return;
                }
                if (this.addForm.pwd) {
                    query.pwd = this.addForm.pwd
                } else {
                    this.$Message.info('请填写登录密码');
                    this.cancelLoading();
                    return;
                }
                if (this.addForm.remark) {
                    query.remark = this.addForm.remark
                }
                query.pwd = this.addForm.pwd
                const result = await addUser(query)
                if (result.code == 20000) {
                    this.addForm.username='';
                    this.addForm.pwd='';
                    this.addForm.remark='';
                    this.$Message.success('添加成功')
                    this.addModal = false
                    this.getList(0, this.page.count);
                    this.cancelLoading()
                } else {
                    this.$Message.error(result.msg);
                    this.cancelLoading()
                }
            }
            ,
            cancelAdds(){
                this.addForm={}

            },
            cancelLoading() {
                this.modalLoading = false
                setTimeout(() => {
                    this.$nextTick(() => {
                        this.modalLoading = true
                    })
                }, 100)
            },

            edit(row){
                this.rowId=row.id;
                this.updateModel=true;
                this.editForm.username=row.username
                this.editForm.remark=row.remark
            },
            //重置密码
            resetPwd:async function() {
                console.log("test:"+this.rowId)
                let query = new Object()
                if (this.rowId){
                    query.uid=this.rowId
                }
                const result = await resetPwd(query)
                if (result.code == 20000) {
                    this.$Message.success('重置密码成功')
                    this.cancelLoading()
                }else {
                    this.$Message.error(result.msg);
                    this.cancelLoading()
                }
            },
            updateUser:async function() {
                let query = new Object()
                if (this.editForm.username){
                    query.id=this.rowId
                    query.username=this.editForm.username
                    query.remark=this.editForm.remark
                }else {
                    this.$Message.info('请输入密码');
                    this.cancelLoading();
                    return;
                }
                const result = await updateDetail(query)
                if (result.code == 20000) {
                    this.editForm = {};
                    this.getList(0, this.page.count);
                    this.$Message.success('修改成功')
                    this.updateModel = false
                    this.cancelLoading()
                }else {
                    this.$Message.error(result.msg);
                    this.cancelLoading()
                }
            },
            cancelUpdateRole(){
                this.updateModel=false;
                this.editForm= {}
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
