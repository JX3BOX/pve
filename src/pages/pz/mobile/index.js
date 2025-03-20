Vue.config.productionTip = false;

// 第三方UI组件
import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);

// 通用UI模块
import "@jx3box/jx3box-common/css/element.css";

// // 全局过滤器
import * as filters from '@/utils/pz/filters.js';
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

// 数据与路由
import router from "./router.js";
import store from "../store";

import App from "./index.vue";
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount("#app");
