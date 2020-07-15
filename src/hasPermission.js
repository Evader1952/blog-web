// import store from "./store";
//
// export function hasPermission(permission) {
//     let myBtns = store.getters.btns;
//     return myBtns.indexOf(permission) > -1;
// }
const hasPermission = {
    install (Vue, options) {
        Vue.directive('hasPermission', {
            inserted (el, binding, vnode) {
                let btns = vnode.context.$route.meta.btns;
                console.log("btns",btns);
                // if(btns!=null){
                //     if (!btns.includes(binding.value)) {
                //         el.parentNode.removeChild(el);
                //     }
                // }
            }
        });
    }
};


export default hasPermission;