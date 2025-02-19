import Vue from "vue";
import Vuex from "vuex";
import User from "@jx3box/jx3box-common/js/user";
import { $img } from "@/service/tool/oss.js";
import { getDatabaseFields, getBreadcrumbs } from "@/service/tool/cms.js";

Vue.use(Vuex);

let store = {
    state: {
        // common
        client: location.href.includes("origin") ? "origin" : "std",
        isLogin: User.isLogin(),
        user_group: User.getInfo().group,
        isMiniProgram: document.getElementsByClassName("v-miniprogram")?.length > 0,
        mutationObserverInit: false,

        mapIndex: {},
        mapKeys: [],

        // post
        id: 0,
        user_id: 0,
        post: "",
        extend: {
            collection_data: "",
            directory: false,
        },

        // icons
        favList: [],

        // database
        database_client: location.href.includes("origin") ? "origin" : "std",
        database_type: "buff",
        database_ref_count: { buff: [], skill: [], doodad: [], npc: [], __queried: [] },
        database_stat: {
            version: "",
            count: "",
        },
        database_fields: "",
        database_blacklist: { buff: [], skill: [], doodad: [], npc: [] },
        stars: {
            buff: [],
            doodad: [],
            npc: [],
            skill: [],
        },
    },
    mutations: {
        switchClient: function (state, val) {
            state.client = val || "std";
        },
        storeFav(state, list) {
            state.favList = list;
        },
    },
    getters: {},
    actions: {
        initMutationObserver({ state }) {
            state.isMiniProgram = document.getElementsByClassName("v-miniprogram")?.length > 0;
            if (state.mutationObserverInit) return;
            const html = document.querySelector("html");
            const observer = new MutationObserver((mutationsList) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === "attributes" && mutation.attributeName === "class") {
                        state.isMiniProgram = html.classList.contains("v-miniprogram");
                    }
                }
            });
            observer.observe(html, { attributes: true, attributeFilter: ["class"] });
            state.mutationObserverInit = true;
        },
        getMapIndex({ state }) {
            $img.get("/map/data/map_index.json").then((res) => {
                const mapIndex = res.data;
                state.mapIndex = { ...mapIndex, ...state.mapIndex };
                state.mapKeys = Object.keys(state.mapIndex)
                    .map(Number)
                    .sort((a, b) => a - b);
            });
        },
        getDatabaseFields({ state }) {
            getDatabaseFields().then((res) => {
                const fields_map = res.data.data.reduce((acc, cur) => {
                    if (!acc[cur.type]) acc[cur.type] = {};
                    acc[cur.type][cur.field] = cur;
                    return acc;
                }, {});
                state.database_fields = fields_map;
            });
        },
        getDatabaseBlacklist({ state }) {
            const keys = Object.keys(state.database_blacklist).map((type) => `database_blacklist_${type}`);
            getBreadcrumbs(keys.join(",")).then((res) => {
                const list = res.data.data.reduce((acc, cur) => {
                    const type = cur.name.split("_")[2];
                    acc[type] = cur.html.split(",").filter((item) => item);
                    return acc;
                }, {});
                state.database_blacklist = list;
            });
        },
    },
    modules: {},
};

export default new Vuex.Store(store);
