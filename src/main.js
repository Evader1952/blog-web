import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import storage from "./storage";
import 'iview/dist/styles/iview.css'
import permissions from './permissions'
import {
    Badge,
    Radio,
    RadioGroup,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Checkbox,
    CheckboxGroup,
    Col,
    DatePicker,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Form,
    FormItem,
    Icon,
    Input,
    InputNumber,
    Menu,
    MenuItem,
    Message,
    Modal,
    Option,
    Page,
    Progress,
    Row,
    Select,
    Submenu,
    Switch,
    Table,
    TabPane,
    Tabs,
    Tooltip,
    Tree,
    Upload,
    Cascader,
} from 'iview';

Vue.config.productionTip = false


Vue.component('Button', Button);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Radio', Radio);
Vue.component('Message', Message);
Vue.component('Table', Table);
Vue.component('Page', Page);
Vue.component('Breadcrumb', Breadcrumb);
Vue.component('BreadcrumbItem', BreadcrumbItem);
Vue.component('Row', Row);
Vue.component('Col', Col);
Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Input', Input);
Vue.component('Upload', Upload);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('ISwitch', Switch);
Vue.component('Submenu', Submenu);
Vue.component('Menu', Menu);
Vue.component('MenuItem', MenuItem);
Vue.component('Icon', Icon);
Vue.component('Modal', Modal);
Vue.component('DropdownMenu', DropdownMenu );
Vue.component('DropdownItem', DropdownItem );
Vue.component('Dropdown', Dropdown );
Vue.component('Progress', Progress );
Vue.component('DatePicker', DatePicker );
Vue.component('Tabs', Tabs );
Vue.component('TabPane', TabPane );
Vue.component('Tooltip', Tooltip );
Vue.component('Badge',Badge);
Vue.component('CheckboxGroup',CheckboxGroup);
Vue.component('Checkbox',Checkbox);
Vue.component('InputNumber',InputNumber);
Vue.component('Tree',Tree);
Vue.component('Cascader',Cascader);


Vue.prototype.$Message = Message;

Vue.prototype.$Modal = Modal;

Vue.prototype.$Message.config({
    duration: 2
});

// Vue.prototype.hasPerm = hasPermission;

Vue.directive('hasPermission', {
    inserted (el, binding, vnode) {
        let btns = vnode.context.$route.meta.btns;
        if(btns!=null){
            if (!btns.includes(binding.value)) {
                el.parentNode.removeChild(el);
            }
        }
    }
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

new Vue({
  router, store,
  render: h => h(App)
}).$mount('#app')
