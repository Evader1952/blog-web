<template>
    <div class="home">
        <jd-menu name="管理后台"></jd-menu>
        <Row>
            <Col span="21" offset="3">
                <div class="header">
                    <!--<span @click="messages" v-if="role != null && role.type != 0">消息<Badge dot v-if="num!='0'"><Icon-->
                            <!--type="ios-mail" size="16"/></Badge><Icon v-else type="ios-mail" size="16"/></span>-->

                    <span @click="logout">登出&nbsp;<Icon type="md-exit" size="15"/></span>
                </div>
                <div class="content">
                    <router-view></router-view>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import JdMenu from '../components/JdMenu';
    import storage from '../storage'
    import {deleteMenus,deletePermissions} from "../permissions";

    export default {
        name: 'home',
        components: {JdMenu},
        data() {
            return {
                activeName: null,
                activeMenu: [],
                theme: 'light',
            }
        },
        comments: {
            JdMenu
        },
        mounted: function () {

        },
        methods: {
            logout: function () {
                this.$Modal.confirm({
                    title: '提醒',
                    content: '<p>您即将登出系统</p><p>请您确认当前操作</p>',
                    loading: true,
                    onOk: () => {
                        this.$Modal.remove();
                        this.$Message.success(`您已退出系统`)
                        storage.remove('login_token')
                        deleteMenus();
                        deletePermissions();
                        sessionStorage.removeItem('activeNav')
                        // this.$router.replace({ path: '/login',
                        //     query: {
                        //         t: Date.now()
                        //     }})
                        location.reload();
                    }
                })
            },
        },
    }
</script>
<style lang="stylus" scoped>
    .menu
        position fixed
        z-index 999
        width 12.5%
        background-color #e8eaec
        height 100%

        .logo
            height 74px
            display flex
            align-items center
            background #5b6270
            padding 10px 10px 10px 40px
            border-bottom 1px solid #e8eaec
            img
                width 100px
            h1
                font-size 24px
                margin-left 5px
                color #ffffff

        .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title
            padding: 14px 1px

    .header
        text-align right
        height 74px
        background-color #5b6270
        display flex
        align-items center
        justify-content flex-end
        border-bottom 1px solid #e8eaec

        span
            margin-right 22px
            cursor pointer
            color #ffffff

            &:hover
                color #e8eaec

    .content
        display block
        text-align left
        background-color white
        padding 8px
</style>