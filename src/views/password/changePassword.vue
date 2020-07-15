<template>
    <div class="password">
        <Breadcrumb>
            <BreadcrumbItem>系统管理</BreadcrumbItem>
            <BreadcrumbItem>密码修改</BreadcrumbItem>
        </Breadcrumb>
        <div class="list-box">
            <Row>
                <Col span="12">
                    <Form :model="pwdInfo" label-position="left" :label-width="90">
                        <h3>修改密码后将退出系统 请使用新密码重新登录</h3>
                       <!-- <Divider orientation="left" dashed>修改密码后将退出系统 请使用新密码重新登录</Divider>-->
                        <FormItem label="输入旧密码">
                            <Input type="password" v-model="pwdInfo.passwordOld"></Input>
                        </FormItem>
                        <FormItem label="输入新密码">
                            <Input type="password" v-model="pwdInfo.passwordNewFirst"></Input>
                        </FormItem>
                        <FormItem label="重复新密码">
                            <Input type="password" v-model="pwdInfo.passwordNewSecond"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="success" @click="handleSave">修改</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
    import storage from '../../storage'
    import {changePassword} from "../../api/user";

    export default {
        name: "Password",
        data() {
            return {
                pwdInfo: {
                    passwordOld: '',
                    passwordNewFirst: '',
                    passwordNewSecond: ''
                }
            }
        },
        mounted: function () {
        },
        methods: {
            handleSave: async function() {
                const oldPwd = this.pwdInfo.passwordOld;
                const firPwd = this.pwdInfo.passwordNewFirst;
                const sendPwd = this.pwdInfo.passwordNewSecond;

                if( oldPwd.trim() == '' && firPwd.trim() == '' && sendPwd.trim() == '') {
                    this.$Message.error('任一项不可为空');
                    return;
                }

                if(firPwd !== sendPwd) {
                    this.$Message.error('两次密码输入不一致');
                    return;
                }
                if (firPwd.length>16){
                    this.$Message.error('密码长度不能超过16位');
                    return;
                }
                let params = {"oldPassword":oldPwd,"newPassword":sendPwd}
                const result = await changePassword(params);
                if(result.code == 40500) {
                    this.$Message.error(`${result.msg}`);
                } else {
                    this.$Message.success(`密码修改成功`);
                    sessionStorage.clear();
                    storage.remove('login_token');
                    this.$router.push({name: 'login'})
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .password
        width 100%
        .list-box
            margin 20px
            .ctrl-btn
                margin-top 10px
                margin-bottom 10px
            .page
                margin 10px
                text-align center
</style>