Vue.config.productionTip = false;

// 第三方UI组件
import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);

// 通用UI模块
import JX3BOX_UI from "@jx3box/jx3box-common-ui";
import "@jx3box/jx3box-common/css/element.css";
import "@jx3box/jx3box-common/css/normalize.css";
Vue.use(JX3BOX_UI);

// 复制组件
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

// 图表组件
import ECharts from "vue-echarts";
import "echarts";
Vue.component("v-echart", ECharts);

import reporter from "@jx3box/jx3box-common/js/reporter";
reporter.install(Vue);

// 数据与路由
import router from "./router";
import store from "./store";

import App from "@/views/battle/App.vue";
new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
