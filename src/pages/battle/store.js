import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let store = {
    state: {
        // 原文件对象
        file: "",
        // 读取文件解码后内容
        raw: "",
        // lua转json
        data: "",
        // 分析数据
        analysis: "",
        // 数据库信息
        info: {
            subject: "stat", //分析主题
            type: "tinymins", //文件数据类型
            file_name: "", //原始文件名称
            file_size: 0, //原始文件大小
            // 更多数据内部提取的重要信息
        },
        //当前查看的单页的数据
        current: "",
        // 统计分析tab
        type: "damage",
        client: location.href.includes("origin") ? "origin" : "std",
    },
    mutations: {
        // 单个修改
        set: function (state, payload) {
            state[payload["key"]] = payload["val"];
        },
        setToken: function (state, payload) {
            state.stsToken = payload;
        },
        // 批量修改
        patch: function (state, payload) {
            for (let key in payload) {
                state[key] = payload[key];
            }
        },
        SET_INFO: function (state, payload) {
            state.info = payload;
        },
        SET_CURRENT: function (state, payload) {
            state.current = payload;
        },
        RESET: function (state) {
            state.file = "";
            state.raw = "";
            state.data = "";
            state.analysis = "";
            state.info = {
                subject: "stat", //分析主题
                type: "tinymins", //文件数据类型
            };
        },
    },
    getters: {},
    actions: {},
    modules: {},
};

export default new Vuex.Store(store);
