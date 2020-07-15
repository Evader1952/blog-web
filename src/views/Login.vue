<template>
    <div class="login">
        <div class="case">
            <Div>登录</Div>
            <Form ref="user" :model="user" :rules="loginRules" :label-width="48">
                <FormItem label="账号" prop="name">
                    <Input v-model="user.name" placeholder="输入用户账号..."/>
                </FormItem>
                <FormItem label="密码" prop="pwd">
                    <Input type="password" v-model="user.pwd" placeholder="输入账号密码..."/>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="commitLogin('user')" @keyup.enter="commitLogin('user')" id="login">登录</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    import storage from '../storage'
    import {login} from '../api/user'
    import router from "../router";

    export default {
        name: "login",
        data() {
            return {
                user: {
                    name: '',
                    pwd: ''
                },
                loginRules: {
                    name: [{required: true, message: '用户名不可为空', trigger: 'blur'}],
                    pwd: [{required: true, message: '用户密码不可为空', trigger: 'blur'}],
                }
            }
        },
        mounted: function () {

        },
        methods: {
            commitLogin: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var param = {
                            username: this.user.name,
                            password: this.user.pwd
                        }
                        login(param).then(json => {
                            if (json.data.code == 20000){
                                storage.set('login_token', json.headers.authorization, 120)

                                this.$router.push({name: 'home'})
                            } else {
                                this.$Message.error(`${json.data.msg}`)
                            }
                        }).catch(function (e) {
                            console.error(e)
                        });
                    } else {
                        this.$Message.error('请正确输入登录账号或密码!');
                    }
                })
            }
        }
    }
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) {
            document.getElementById("login").click();
        }
    }
</script>

<style lang="stylus" scoped>
    .login
        background-image url("../assets/sayagata-400px.png")
        position absolute
        width 100%
        height 100%
        display flex
        align-items center
        justify-content center

        .case
            padding 0px 22px
            width 340px
            border-radius 4px
            background-color rgba(255, 255, 255, 0.3)

            button
                position relative
                right 18px
</style>