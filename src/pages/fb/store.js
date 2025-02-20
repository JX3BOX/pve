import Vue from "vue";
import Vuex from "vuex";
import map from "@jx3box/jx3box-data/data/fb/fb_map.json";
import origin_map from "@jx3box/jx3box-data/data/fb/fb_map_origin.json";
import { default_zlp, default_fb } from "@/pages/fb/setting.json";
import baizhan from "./modules/baizhan";
Vue.use(Vuex);

let store = {
    state: {
        // client
        client: location.href.includes("origin") ? "origin" : "std",
        // post
        id: 0,
        user_id: 0,
        post: "",
        extend: {
            collection_data: "",
            directory: false,
        },
        // list
        map: location.href.includes("origin") ? origin_map : map,
        fb: "",
        zlp: "",
        luaindex: {},
        default_zlp: location.href.includes("origin") ? default_zlp.origin : default_zlp.std,
        default_fb: location.href.includes("origin") ? default_fb.origin : default_fb.std,

        maptree: "",

        isSuperAuthor: false,
    },
    mutations: {
        switchClient: function (state, val) {
            state.client = val || "std";
        },
        setState(state, val) {
            state[val.key] = val.val;
        },
    },
    getters: {
        dungeons(state) {
            let dungeons = {};

            Object.values(state.map).forEach((group) => {
                Object.assign(dungeons, group.dungeon);
            });

            return dungeons;
        },
    },
    actions: {},
    modules: {
        baizhan,
    },
};

export default new Vuex.Store(store);
