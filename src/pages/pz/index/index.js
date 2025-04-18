Vue.config.productionTip = false;

// 第三方UI组件
import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);

// 通用UI模块
import JX3BOX_UI from '@jx3box/jx3box-common-ui'
import "@jx3box/jx3box-common/css/element.css";
import "@jx3box/jx3box-common/css/normalize.css";
Vue.use(JX3BOX_UI);

import reporter from "@jx3box/jx3box-common/js/reporter";
reporter.install(Vue);

// 全局过滤器
import * as filters from '@/utils/pz/filters.js';
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

// 数据与路由
import router from "./router";
import store from "../store";

import App from "./App.vue";
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount("#app");

