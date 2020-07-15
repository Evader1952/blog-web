<template>
    <div class="menu">
        <div class="logo">
            <h1>
                <Icon type="md-cube" size="40"/>&nbsp;&nbsp;{{name}}
            </h1>
        </div>
        <Menu ref="leftMenu" :theme="theme" :active-name="activeName" width="auto" :open-names="activeMenu"
              accordion @on-select="activeNav" @on-open-change="activeParentMenu">
            <Submenu :name="menu.name" v-for="(menu,index) in menus" :key="index">
                <template slot="title">
                    <Icon :type="menu.icon"/>
                    {{menu.title}}
                </template>
                <MenuItem :name="submenu.name" v-if="submenu.type == 1" v-for="(submenu,index) in menu.submenus" :key="index" :to="{name: submenu.name}">
                    <Icon :type="submenu.icon"/>
                    {{submenu.title}}
                </MenuItem>
            </Submenu>
        </Menu>
    </div>
</template>

<script>
    import {getMenus} from '../permissions'
    export default {
        name: 'JdMenu',
        props: {
            name: String,
            theme:{
                default:'light',
                type:String
            }
        },
        data(){
          return {
              menus:[],
              activeName:'',
              activeMenu:[]
          }
        },
        created() {
            this.getActiveNav();
            this.getActiveParentMenu();
            this.menus = getMenus();
        },
        methods:{
            activeNav: function (name) {
                sessionStorage.setItem('activeNav',name);
            },
            activeParentMenu: function (name) {
                if (name == null || name == undefined || name.length == 0){
                    sessionStorage.removeItem('openParentMenu');
                    return;
                }
                sessionStorage.setItem('openParentMenu',name[0]);
            },
            getActiveNav:function () {
                this.activeName = sessionStorage.getItem('activeNav');
            },
            getActiveParentMenu: function () {
                let menu = sessionStorage.getItem('openParentMenu');
                if (menu != null && menu != undefined && menu != ''){
                    this.activeMenu.push(menu);
                }
            },
        }
    }
</script>

<style scoped lang="stylus">
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
</style>