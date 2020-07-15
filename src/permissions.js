import router from './router'
import storage from './storage'
import util from "./util";
import {permissionList} from './api/user'

// function hasPermission(userPermissions, path) {
//     if (!path) return true
//     return userPermissions.some(permission => path === permission.)
// }

const whiteList = ['404','401'] // 不重定向白名单

router.beforeEach((to, from, next) => {
    const token = storage.get("login_token");
    if (to.name == 'login') {
        if (util.isEmpty(token)) {
            next();
        } else {
            router.push({name: 'home'})
        }
    } else {
        if (util.isEmpty(token)) {
            router.push({name: 'login'})
        } else {
            const permissions = getPermissions();
            if (!permissions || permissions == 0) {
                permissionList().then(resp => {
                    let permissions = resp.data;
                    savePermissions(permissions);
                    let routes = generateRoutes(permissions);
                    router.addRoutes(routes);
                    next({...to, replace: true});
                }).catch((err) => {
                    next({path: '/401', replace: true, query: {noGoBack: true}})
                })
            } else {
                if(from.name === to.name){

                }else {
                    next()
                }
            }
        }
    }
});

function generateRoutes(userPermissions) {
    let home = {
        path: '/home',
        name: 'home',
        component: () => import('./views/Home'),
        redirect: to => {
            return {
                name: 'index'
            }
        }
    }
    let defaultpage = {
        path: '*',
        redirect: {path: '/404'}
    }
    let index = {
        title:'首页',
        path: '/index',
        name: 'index',
        component: () => import( './views/About') /* 首页 */
    };
    let children = [index]
    let usermenus = []
    if (userPermissions && userPermissions.length > 0) {
        userPermissions.forEach(menu => {
            if (menu.submenus) {
                let submenus = [];
                menu.submenus.forEach(route => {
                    if(route.component) {
                        let views = route.component;
                        route.component = ()=> import(`./views${views}`);
                    }
                    let meta = {};
                    meta.btns = route.pageBtns;
                    route.meta = meta;
                    children.push(route)
                    submenus.push(route);
                })
                if (submenus.length > 0) {
                    usermenus.push({
                        title: menu.title,
                        name: menu.name,
                        icon: menu.icon,
                        submenus: submenus
                    })
                }
            }
        })
    }

    if (usermenus.length > 0) {
        saveMenus(usermenus);
    }
    home.children = children;
    return [home,defaultpage];
}

window.onbeforeunload = function () {
    deletePermissions()
}

export const getPermissions = function () {
    let data = sessionStorage.getItem('permissions');
    try{
        return JSON.parse(data);
    }catch (e) {
        return null;
    }
}

const saveMenus = function (menus) {
    sessionStorage.setItem('sidebar_menus',JSON.stringify(menus))
}

export const getMenus = function () {
    let data = sessionStorage.getItem('sidebar_menus');
    try{
        return JSON.parse(data);
    }catch (e) {
        return null;
    }
}

const savePermissions = function (permissions) {
    sessionStorage.setItem('permissions',JSON.stringify(permissions))
}

export const deletePermissions = function () {
    sessionStorage.removeItem('permissions')
}

export const deleteMenus = function () {
    sessionStorage.removeItem('sidebar_menus')
}
