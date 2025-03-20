Vue.config.productionTip = false;

import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);

import "@jx3box/jx3box-common/css/element.css";

import App from "./index.vue";
new Vue({
    render: (h) => h(App),
}).$mount("#app");
