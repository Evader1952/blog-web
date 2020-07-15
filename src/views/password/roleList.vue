<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>系统管理</BreadcrumbItem>
            <BreadcrumbItem>角色管理</BreadcrumbItem>
        </Breadcrumb>
        <div class="form-box">
            <div class="list">
                <Button type="primary" class="tab-right" @click="addRole = true">添加</Button>&nbsp;&nbsp;
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row, index }" slot="action" >
                        <Button type="primary" size="small" style="width: 60px;margin-right: 15px" @click="roleEdit(row)">修改</Button>
                        <Button type="primary" size="small" style="width: 60px" @click="unfreeze(row)" v-if="row.state==0">解冻</Button>
                        <Button type="primary" size="small" style="width: 60px" @click="freeze(row)" v-else>冻结</Button>
                    </template>
                </Table>
            </div>
        </div>

        <div class="Page">
            <Page class-name="page" size="small" :current="page.pageNum" :total="page.total" :page-size="page.count"  @on-change="changePage" />
        </div>

        <modal v-model="addRole" :mask-closable="false" :closable="false" :loading="modalLoading" title="新增角色权限" @on-cancel="cancelRoleAdd" @on-ok="roleAdd">
            <div>
                <Form label-position="left" :label-width="100" style="margin-left: 30px">
                    <FormItem label="角色名称：">
                    <Input type="text" v-model="name" style="width: 300px" placeholder="请输入角色名称"/>
                    </FormItem>
                    <FormItem label="角色备注：">
                        <Input type="text" v-model="remark" style="width: 300px" placeholder="请输入角色备注"/>
                    </FormItem>
                    <FormItem label="角色权限配置：">
                        <Tree :data="data1" :load-data="loadData" style="margin-top: -7px" @on-check-change="getChooseds" show-checkbox ref="tree1"></Tree>
                    </FormItem>
                </Form>
            </div>
        </modal>
        <modal v-model="editRole" :mask-closable="false" :closable="false" :loading="modalLoading" title="修改角色权限" @on-cancel="cancelRole" @on-ok="editAdd">
            <div>
                <Form label-position="left" :label-width="100" style="margin-left: 30px">
                    <FormItem label="角色名称：">
                        <Input type="text" v-model="name" style="width: 300px" />
                    </FormItem>
                    <FormItem label="角色备注：">
                        <Input type="text" v-model="remark" style="width: 300px" />
                    </FormItem>
                    <FormItem label="角色权限配置：">
                        <Tree :data="data2" :load-data="loadData1" style="margin-top: -7px" @on-check-change="getChoosed" show-checkbox ref="tree"></Tree>
                    </FormItem>
                </Form>
            </div>
        </modal>
    </div>
</template>

<script>
    import {addRole, freezeRole, list, roleDetail, treeList, updateRole} from "../../api/role";


    export default {
        name: "roleList",
        data(){
            return{
                name:'',
                remark:'',
                authority:'',
                addRole:false,
                editRole:false,
                modalLoading:true,
                roleMenus:[],
                columns: [
                    {
                        title: '序号',
                        width: 120,
                        align: 'center',
                        render: (h,params) => {
                            return h('span', params.index + (this.page.pageNum -1) * this.page.count + 1)
                        }
                    },
                    {
                        title: '角色名称',
                        key: 'name',
                        width: 350,
                        align: 'center'
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        width: 481,
                        tooltip: true,
                        align: 'center'
                    },
                    {
                        title: '绑定帐号数',
                        key: 'count',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'stateDesc',
                        width: 150,
                        align: 'center',
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 370,
                        align: 'center'
                    }
                ],
                list:[],
                page: {
                    currentPage: 0,
                    count: 10,
                    total: 0,
                    pageNum:1,
                },
                data1: [
                    {
                        id:0,
                        title: '所有权限',
                        loading: false,
                        children: []
                    }
                ],
                data2: [
                    {
                        id:0,
                        title: '所有权限',
                        loading: false,
                        children: []
                    }
                ],
                data3: [
                    {
                        id:0,
                        title: '所有权限',
                        loading: false,
                        children: []
                    }
                ],

            }
        },
        mounted(){
            this.getList(this.page.currentPage, this.page.count)
        },
        methods:{
            reset(){
                this.data2 = [];
                let obj = new Object();
                obj.id = 0;
                obj.title = '所有权限';
                obj.loading = false;
                obj.children = [];
                this.data2 .push(obj)
            },
            loadData (item, callback) {
                treeList().then(result=>{
                    if(result.code == 20000){
                        this.treeDatas = result.data
                    }
                    const data = this.treeDatas
                    // this.data1[0].children = this.treeData
                    // this.data1 = this.treeData
                    callback(data)
                })
            },
            loadData1 (item, callback) {
                roleDetail({'id':this.id}).then(result=>{
                    if(result.code == 20000){
                        this.treeData = result.data.treeList
                    }
                    const data = this.treeData
                    callback(data)
                })
            },
            cancelRoleAdd(){
                this.name = '';
                this.remark = '';
                if(this.data1[0].expand == true){
                    this.data1[0].expand = false;
                }
                this.data1[0].checked = false;
                this.data1[0].indeterminate = false;
                this.getCheckedByFilter(this.data1[0].children)
            },
            cancelRole(){
                this.name = '';
                this.remark = '';
                this.data2[0].children = [];
                this.data2[0].indeterminate = false;
                this.data2[0].checked = false;
                this.reset()
                //
                // this.loadData1()
                // // this.data2 = this.data3
                // this.data1[0].expand = false;
            },
            roleEdit(row){
                this.editRole = true
                this.id = row.id
                this.name = row.name
                this.remark = row.remark
                this.type = row.type
                this.roleMenus = this.roleMenus
            },
            getList: async function (cp, c) {
                let query = new Object()
                query.page = cp;
                query.limit = c;
                const result = await list(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements
                }
            },
            changePage: function (cp) {
                this.page.pageNum = cp
                this.getList((cp - 1), this.page.count)
            },
            getCheckedByFilter(data){
                data.map((arr)=>{
                    arr.checked = false;
                    arr.indeterminate = false;
                    if(arr.children){
                        this.getCheckedByFilter(arr.children)
                    }
                })
            },
            freeze: async function (row) {
                this.$Modal.confirm({
                    title: '确认信息',
                    content: '<h4>是否冻结当前角色</h4>',
                    okText: '我已确认',
                    cancelText: '取消',
                    onOk: () => {
                        freezeRole({'id':row.id,'type':row.type,'roleState':0,'roleMenuState':0}).then(result=>{
                            if(result.code == 20000){
                                this.getList(this.page.currentPage, this.page.count)
                                this.$Message.success('冻结成功')
                            }else {
                                this.$Message.error(`${result.msg}`)
                            }
                        })
                    },
                })
            },
            unfreeze: async function (row) {
                this.$Modal.confirm({
                    title: '确认信息',
                    content: '<h4>是否解冻当前角色</h4>',
                    okText: '我已确认',
                    cancelText: '取消',
                    onOk: () => {
                        freezeRole({'id':row.id,'type':row.type,'roleState':1,'roleMenuState':1}).then(result=>{
                            if(result.code == 20000){
                                this.getList(this.page.currentPage, this.page.count)
                                this.$Message.success('解冻成功')
                            }else {
                                this.$Message.error(`${result.msg}`)
                            }
                        })
                    },
                })
            },
            roleAdd:async function(){
                let query = new Object()
                if(this.name){
                    query.name = this.name
                }else {
                    this.$Message.error('请输入角色名称')
                    this.cancelLoading()
                    return
                }
                if(this.remark){
                    query.remark = this.remark
                }else {
                    this.$Message.error('请输入角色备注')
                    this.cancelLoading()
                    return
                }
                query.roleMenus = JSON.stringify(this.roleMenus)
                const result = await addRole(query)
                if (result.code == 20000) {
                    this.getList(this.page.currentPage, this.page.count)
                    this.$Message.success('添加成功')
                    this.cancelLoading()
                    this.addRole = false
                    this.cancelRoleAdd()
                }else {
                    this.$Message.error(result.msg);
                    this.cancelLoading()

                }

            },
            getChooseds(){
                let sourceNodeList = this.$refs.tree1.getCheckedAndIndeterminateNodes();
                console.log("bb",sourceNodeList);
                let roleDatas = [];

                sourceNodeList.forEach((item)=>{
                    if (item.id !==0 && item.type !== 0){
                        console.log(item)
                        let role = {};
                        role.menuCode = item.code
                        role.homeMenuCode = item.homeCode
                        roleDatas.push(role);
                    }
                })
                console.log('aa',roleDatas)
                this.roleMenus = roleDatas
                // console.log(this.roleMenus)
            },
            getChoosed(){
                let sourceNodeList = this.$refs.tree.getCheckedAndIndeterminateNodes();
                console.log("bb",sourceNodeList);
                let roleDatas = [];

                sourceNodeList.forEach((item)=>{
                    if (item.id !==0 && item.type !== 0){
                        console.log(item)
                        let role = {};
                        role.menuCode = item.code
                        role.homeMenuCode = item.homeCode
                        roleDatas.push(role);
                    }
                })
                console.log('aa',roleDatas)
                this.roleMenus = roleDatas
                // console.log(this.roleMenus)
            },
            editAdd:async function(){
                let query = new Object()
                if(this.name){
                    query.name = this.name
                }else {
                    this.$Message.error('角色名称不能为空')
                    this.cancelLoading()
                    return
                }
                if(this.remark){
                    query.remark = this.remark
                }else {
                    this.$Message.error('角色备注不能为空')
                    this.cancelLoading()
                    return
                }
                query.type = this.type
                query.id = this.id
                if(this.roleMenus==''){
                    this.roleMenus = []
                }
                query.roleMenus = JSON.stringify(this.roleMenus)
                const result = await updateRole(query)
                if (result.code == 20000) {
                    this.$Message.success('修改成功')
                    this.getList(this.page.currentPage, this.page.count)
                    this.editRole = false
                    this.cancelRole()
                }else {
                    this.$Message.error(result.msg);
                    this.name = ''
                    this.remark = ''
                    this.roleMenus = ''
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
        },
    }
</script>

<style lang="stylus" scoped>
    .box
        width 100%
        .form-box
            margin 20px
            .tab-right
                position absolute
                right 40px
                top 100px
                z-index 99
                width 60px
            .list
                margin-top 20px
        .Page
            text-align: center
            padding: 20px

</style>