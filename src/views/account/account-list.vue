<template>
    <div class="box">
        <Breadcrumb>
            <BreadcrumbItem>账号管理</BreadcrumbItem>
            <BreadcrumbItem>账号列表</BreadcrumbItem>
        </Breadcrumb>

        <div class="form-box">
            <div class="search">
                <Select v-model="query.rolesTypeList" clearable style="width: 150px; margin-right: 10px" placeholder="请选择角色类型">
                    <Option v-for="item in roleType" :value="item.type" :key="item.type">{{ item.name }}</Option>
                </Select>
                <Input clearable v-model="query.username" placeholder="请输入你要查询的账号" style="width: 200px" @on-clear="beginSearch(0)"/>&nbsp;
                <Button slot="append" icon="ios-search" @click="beginSearch(0)">搜索</Button>&nbsp;&nbsp;
                <Button type="primary" style="width: 60px" @click="addRole=true">添加</Button>
            </div>

            <div class="list">
                <Table size="small" :columns="columns" :data="list">
                    <template slot-scope="{ row, index }" slot="action" >
                        <Button type="primary" size="small" style="width: 60px;margin-right: 15px" @click="editRole(row)">修改</Button>
                        <Button type="primary" size="small" style="width: 60px" @click="freeze(row)" v-if="row.state==1">冻结</Button>
                        <Button type="primary" size="small" style="width: 60px" @click="unfreeze(row)" v-else>解冻</Button>
                    </template>
                </Table>
            </div>

            <div class="Page">
                <Page class-name="page" size="small" :current="page.pageNum" :total="page.total" :page-size="page.count" @on-change="changePage" />
            </div>
        </div>

        <modal width="450px" v-model="passwordModal" :mask-closable="false" :closable="false" @on-cancel="cancel" @on-ok="showPwd">
            <div style="text-align: center;margin: 10px 20px">
                <p style="font-weight: bolder;padding-bottom: 20px;font-size: 16px">请输入查看密码</p>
                <Input type="password" v-model="queryPwd" placeholder="请输入查看密码"/>
            </div>
        </modal>

        <modal width="450px" v-model="showPasswordModal" :mask-closable="false" :closable="false" @on-cancel="cancel" @on-ok="cancel">
            <div style="text-align: center;margin: 10px 20px">
                <p style="font-weight: bolder;padding-bottom: 20px;font-size: 16px">请查看正确密码</p>
                <Input type="text" v-model="queryPwd" disabled />
            </div>
        </modal>

        <modal v-model="addRole" :mask-closable="false" :closable="false" title="新增管理账号" :loading="modalLoading" @on-cancel="cancelAdds" @on-ok="addAccount">
            <div>
                <Form label-position="left" :label-width="100" style="margin-left: 30px">
                    <FormItem label="登录账号：">
                        <Input type="text" v-model="editForm.username" style="width: 300px" placeholder="请输入登录账号"/>
                    </FormItem>
                    <FormItem label="登陆密码：">
                        <Input type="text" v-model="editForm.pwd" style="width: 300px" aria-required="true" placeholder="请输入登录密码"/>
                    </FormItem>
                    <FormItem label="数据权限：">
                        <Select v-model="editForm.type" clearable style="width: 300px" placeholder="请输入数据角色">
                            <Option v-for="item in dataTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="附加信息：">
                        <Input type="text" v-model="editForm.code" style="width: 300px" aria-required="true" placeholder="请输入code"/>
                    </FormItem>
                    <FormItem label="账号备注：">
                        <Input type="textarea" v-model="editForm.remark" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="账号角色：">
                        <Icon type="ios-add" style="border: 1px solid #cccccc;width: 25px;height: 25px;text-align: center;line-height: 24px;font-size: 18px" @click="chooseRole=true"/><br>
                        <span v-for="item in selectedRoleName" :value="item.type" :key="item.type" :label="item.type"  style="margin-right: 25px">{{item.name}}</span>
                    </FormItem>
                </Form>
            </div>
        </modal>

        <modal width="450px" v-model="chooseRole" :mask-closable="false" :closable="false" @on-cancel="cancelAdd" @on-ok="confirm">
            <div style="text-align: center;margin: 10px 20px">
                <p style="font-weight: bolder;padding-bottom: 20px;font-size: 16px">角色选择</p>
                <CheckboxGroup  v-model="chooseRoles"  style="height: 50px;text-align: center;margin-top: 25px">
                    <Checkbox v-for="item in roleType" :key="item.type" :label="item.type" ref="checkboxGroup" style="margin-right: 30px">{{item.name}}</Checkbox>
                </CheckboxGroup>
            </div>
        </modal>

        <modal v-model="updateRole" :mask-closable="false" :closable="false" title="修改管理账号" :loading="modalLoading" @on-ok="updateAccount" @on-cancel="cancelUpdateRole">
            <div>
                <Form label-position="left" :label-width="100" style="margin-left: 30px">
                    <FormItem label="登录账号：">
                        <Input type="text" v-model="editForm.username" style="width: 300px" placeholder="请输入登录账号"/>
                    </FormItem>
<!--                    <FormItem label="登陆密码：">-->
<!--                        <Input type="text" v-model="editForm.pwd" style="width: 300px" placeholder="请输入登录密码"/>-->
<!--                    </FormItem>-->
                    <FormItem label="账号备注：">
                        <Input type="textarea" v-model="editForm.remark" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="账号角色：">
                        <Icon type="ios-add" style="border: 1px solid #cccccc;width: 25px;height: 25px;text-align: center;line-height: 24px;font-size: 18px" @click="chooseRole=true"/><br>
                        <span v-for="item in selectedRoleName" :value="item.type" :key="item.type" :label="item.type"  style="margin-right: 25px">{{item.name}}</span>
                    </FormItem>
                </Form>
            </div>
        </modal>
    </div>
</template>

<script>
    import {freeze, list} from "../../api/user";
    import {addUser, detail, queryPwd, roleSelectList, updateDetail} from "../../api/role";

    export default {
        name: "account-list",
        data(){
            return{
                id:'',
                uid:'',
                username:'',
                pwd:'',
                remark:'',
                queryPwd:'',
                modalLoading:true,
                passwordModal:false,
                addRole:false,
                updateRole:false,
                chooseRole:false,
                showPasswordModal:false,
                rolesTypeList:'',
                query: {},
                editForm:{
                    username:'',
                    pwd:'',
                    remark:'',
                },
                showRoleType:[],
                showRoleTypes:[],
                chooseRoles:[],
                selectedRoleName:[],
                roleType:[],
                columns:[
                    {
                        title: '序号',
                        width: 121,
                        align: 'center',
                        render: (h,params) => {
                            return h('span', params.index + (this.page.pageNum -1) * this.page.count + 1)
                        }
                    },
                    {
                        title: '账号',
                        key: 'username',
                        width: 300,
                        align: 'center'
                    },
                    {
                        title: '密码',
                        key: 'passWord',
                        width: 300,
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                    on: {
                                        click: (row) => {
                                            this.passwordModal = true
                                            this.uid = params.row.uid

                                        }
                                    },
                                    style: {
                                        tooltip: true,
                                        textDecoration:'underline'
                                    },
                                },
                                '查看'
                            )
                        }
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        width: 370,
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'stateDesc',
                        width: 190,
                        align: 'center'
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
                    total: 0,
                    pageNum:1,
                },
                list:[],
                dataTypes:[
                    {
                        value: '0',
                        label: '管理员数据角色'
                    },
                    {
                        value: '2',
                        label: '商户数据角色'
                    },
                    {
                        value: '3',
                        label: '市级数据角色'
                    },
                    {
                        value: '4',
                        label: '省级数据角色'
                    },
                ],
            }
        },
        mounted(){
            this.getList(this.page.currentPage, this.page.count);
            this.roleTypeList();
            this.beginSearch();
        },
        computed:{
            // roleTypes:function () {
            //     console.log(this.editForm.roleTypes)
            //     return this.editForm.roleTypes;
            // }
        },
        watch:{
            rolesTypeList:function (val) {
                val = val + "";
                // let val = this.editForm.roleTypes;
                if (this.roleType) {
                    let arr = [];
                    if (val) {
                        for (let i = 0; i < this.roleType.length; i++) {
                            let arr1 = val.split(",");
                            for (let j = 0; j < arr1.length; j++) {
                                if (this.roleType[i].type == arr1[j]) {
                                    // console.log("index",val.indexOf(this.roleType[i].type));
                                    arr.push(this.roleType[i]);
                                }
                            }
                            // if (val.indexOf(this.roleType[i].type) > -1) {
                            //     console.log("index",val.indexOf(this.roleType[i].type));
                            //     arr.push(this.roleType[i]);
                            // }
                        }
                    }
                    this.selectedRoleName = arr;
                }
            }
        },
        methods:{
            beginSearch(isSearch) {
                if (isSearch == 0) {
                    this.page.currentPage = 1
                    this.getList(0, this.page.count)
                } else {
                    this.page.currentPage = 1
                    this.getList(0, this.page.count)
                }
            },
            getList: async function (cp, c) {
                let query = new Object()
                query.page = cp;
                query.limit = c;
                if(this.query.rolesTypeList != undefined && this.query.rolesTypeList != null){
                    query.type =this.query.rolesTypeList
                }
                if (this.query.username){
                    query.username = this.query.username;
                }
                const result = await list(query)
                if (result.code == 20000) {
                    this.list = result.data.content;
                    this.page.total = result.data.totalElements;
                }
            },
            changePage: function (cp) {
                this.page.pageNum = cp
                this.getList((cp - 1), this.page.count)
            },
            freeze: async function (row) {
                this.$Modal.confirm({
                    title: '确认信息',
                    content: '<h4>是否冻结当前角色</h4>',
                    okText: '我已确认',
                    cancelText: '取消',
                    onOk: () => {
                        freeze({'id':row.id,'state':0}).then(result=>{
                            if(result.code == 20000){
                                this.getList(0, this.page.count);
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
                        freeze({'id':row.id,'state':1}).then(result=>{
                            if(result.code == 20000){
                                this.getList(0, this.page.count);
                                this.$Message.success('解冻成功')
                            }else {
                                this.$Message.error(`${result.msg}`)
                            }
                        })
                    },
                })
            },
            roleTypeList: async function(){
                let query = new Object()
                const result  = await roleSelectList(query);
                if (result.code == 20000) {
                    this.roleType = result.data;
                }
            },
            chooseRoleType(data){
                if (data.length<=0){
                    return;
                }
                let data1 = new Array();
                for (let i = 0;i<this.roleType.length;i++){
                    for (let j = 0;j<data.length;j++){
                        if (this.roleType[i].type == data[j]){
                             data1.push(this.roleType[i])
                        }
                    }
                }
                this.showRoleTypes = data1;
                // data1 = data1 + data +  ","
                // data1 = data1.substring(0, data1.lastIndexOf(","))
                // console.log(data1)
            },
            addAccount:async function () {
                // let showRoleTypes = ''
                // for (let i = 0;i<this.showRoleType.length;i++){
                //     showRoleTypes = showRoleTypes + this.showRoleType[i].type+",";
                // }
                // showRoleTypes = showRoleTypes.substring(0, showRoleTypes.lastIndexOf(","))
                // console.log(showRoleTypes);

                if(this.editForm.type == undefined){
                    this.editForm.type = ''
                }
                const result = await addUser(this.editForm)
                if (result.code == 20000) {
                    this.editForm = {};
                    this.rolesTypeList = ''
                    this.getList(0, this.page.count);
                    this.$Message.success('添加成功')
                    this.chooseRoles = []
                    this.selectedRoleName= []
                    this.addRole = false
                    this.cancelLoading()
                }else {
                    this.$Message.error(result.msg);
                    this.cancelLoading()
                }
            },
            cancelAdd(){
                // this.editForm = ''
                // this.chooseRoles= []
                // this.selectedRoleName = []
                // this.editForm.roleTypes = '';
                // this.rolesTypeList = "";
            },
            cancelAdds(){
                this.editForm.username = ''
                this.editForm.pwd = ''
                this.editForm.remark = ''
                this.editForm.code = ''
                this.editForm.type = ''
                this.chooseRoles = []
                this.selectedRoleName= []
            },
            cancelUpdateRole(){
                this.editForm = {}
                this.chooseRoles= []
                this.selectedRoleName = []
                this.rolesTypeList = "";
            },
            editRole:async function(row){
                this.updateRole = true

                detail({'id':row.id}).then(result=>{
                    if(result.code == 20000){
                        this.editForm = result.data;
                        this.showRoleTypes = this.editForm.roleSelects;
                        let chooseRoles = [];
                        this.showRoleTypes.forEach((item)=>{
                            if(item.select>0){
                                chooseRoles.push(item.type)
                            }
                        })
                        this.chooseRoles = chooseRoles;
                        this.editForm.roleTypes = chooseRoles.join(",");
                        this.rolesTypeList = chooseRoles.join(",");
                    }
                })


            },
            updateAccount:async function() {
                // let query = new Object()
                // query.id = this.id
                // query.pwd = this.editForm.pwd
                // query.username = this.editForm.username
                // query.uid = this.uid
                // query.remark = this.editForm.remark
                // query.roleTypes = this.rolesTypeList
                // const result = await updateDetail(query)
                // if(result.code == 20000){
                //     this.$Message.success(`修改成功`)
                //     this.updateRole = false
                //     this.getList(0, this.page.count)
                //     this.username = ''
                //     this.pwd = ''
                //     this.remark = ''
                // }else {
                //     this.$Message.error(`${result.msg}`)
                //     this.username = ''
                //     this.pwd = ''
                //     this.remark = ''
                // }
                const result = await updateDetail(this.editForm)
                if (result.code == 20000) {
                    this.editForm = {};
                    this.rolesTypeList = ''
                    this.chooseRoles = []
                    this.getList(0, this.page.count);
                    this.$Message.success('修改成功')
                    this.updateRole = false
                }else {
                    this.$Message.error(result.msg);
                    this.cancelLoading()
                }
            },
            showPwd:async function(){
                let query = new Object()
                query.uid = this.uid
                if(this.queryPwd){
                    query.pwd = this.queryPwd
                }
                const result = await queryPwd(query)
                if(result.code == 20000){
                    this.queryPwd = result.data
                    this.showPasswordModal = true
                }else {
                    this.$Message.error(`${result.msg}`)
                    this.queryPwd = ''
                }
            },
            cancel(){
                this.queryPwd = ''
            },
            confirm(){
                this.editForm.roleTypes = this.chooseRoles.join(",");
                this.rolesTypeList = this.chooseRoles.join(",");
            },
            cancelLoading(){
                this.modalLoading = false
                setTimeout(() =>{
                    this.$nextTick(() =>{
                        this.modalLoading = true
                    })
                },100)
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
        .Page
            text-align: center
            padding: 20px
</style>