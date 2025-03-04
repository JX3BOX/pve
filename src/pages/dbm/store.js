import Vue from "vue";
import Vuex from "vuex";
import { __ossMirror, __imgPath, __iconPath } from "@jx3box/jx3box-common/data/jx3box.json";

import { $img } from "@/service/dbm/oss";
import { getMapList } from "@/service/dbm/node";
import { getSlugList } from "@/service/dbm/slug";

import customMap from "@/assets/data/dbm/custom_map.json";
import defaultItem from "@/assets/data/dbm/default_item.js";
import defaultItemListParams from "@/assets/data/dbm/default_item_list_params.json";
import { defaultPkg } from "@/assets/data/dbm/default_pkg";
import { cloneDeep } from "lodash";
Vue.use(Vuex);

let store = {
    state: {
        // common
        client: location.href.includes("origin") ? "origin" : "std",
        mapIndex: customMap,
        mapTypeIndex: {},
        mapKeys: [],

        // item
        item: cloneDeep(defaultItem),
        resource: "",
        item_list_params: cloneDeep(defaultItemListParams),
        item_list_selected: [],

        // parser
        parse_status: "selecting",
        parse_worker: null,
        parse_file: "",
        parse_checked: { BUFF: [], DEBUFF: [], CASTING: [], NPC: [], DOODAD: [], TALK: [], CHAT: [] },
        parse_filter: {
            map: [],
            keyword: "",
            checked: false,
        },
        parse_result: "",

        // vpk
        vpk: "",
        slugs: [],

        // pkg
        pkg: cloneDeep(defaultPkg),
        pkg_file: "",
        pkg_selected: [],

        // target
        target_tags: [],

        // mark
        mark_map: [670],
        mark_data: [],
    },
    mutations: {
        RESET_ITEM: function (state) {
            state.item = cloneDeep(defaultItem);
            state.resource = "";
        },
        SET_ITEM_LIST_PARAMS_ID: function (state, payload) {
            state.params.dwID = payload;
        },
        SET_ITEM_LIST_PARAMS_LEVEL: function (state, payload) {
            state.params.nLevel = payload;
        },
        RESET_ITEM_LIST_PARAMS: function (state) {
            state.item_list_params = cloneDeep(defaultItemListParams);
        },
        RESET_ITEM_SELECTED: function (state) {
            state.item_list_selected = [];
        },
        REMOVE_ITEM_SELECT: function (state, ids) {
            state.item_list_selected = state.item_list_selected.filter((item) => !ids.includes(item.id));
        },
        TOGGLE_ITEM_SELECT: function (state, toggle_item) {
            const item = state.item_list_selected.find((item) => item.id == toggle_item.id);
            if (item) {
                state.item_list_selected = state.item_list_selected.filter((item) => item.id != toggle_item.id);
            } else {
                state.item_list_selected.push(toggle_item);
            }
        },
        REMOVE_PKG_SELECT: function (state, ids) {
            state.pkg_selected = state.pkg_selected.filter((item) => !ids.includes(item.id));
        },
        TOGGLE_PKG_SELECT: function (state, toggle_item) {
            const item = state.pkg_selected.find((item) => item.id == toggle_item.id);
            if (item) {
                state.pkg_selected = state.pkg_selected.filter((item) => item.id != toggle_item.id);
            } else {
                state.pkg_selected.push(toggle_item);
            }
        },
        RESET_PARSER: function (state) {
            state.parse_status = "selecting";
            state.parse_file = "";
            state.parse_checked = { BUFF: [], DEBUFF: [], CASTING: [], NPC: [], DOODAD: [], TALK: [], CHAT: [] };
            state.parse_filter = {
                map: "",
                keyword: "",
                checked: false,
            };
            state.parse_result = "";
            if (state.parse_worker) {
                state.parse_worker.terminate();
                state.parse_worker = null;
            }
        },
        RESET_PARSE_SELECT: function (state) {
            state.parse_checked = { BUFF: [], DEBUFF: [], CASTING: [], NPC: [], DOODAD: [], TALK: [], CHAT: [] };
            state.parse_filter.checked = false;
        },
        SET_PARSE_STATUS: function (state, payload) {
            state.parse_status = payload;
        },
        SET_PARSE_FILE: function (state, payload) {
            state.parse_file = payload;
        },
        SET_PARSE_RESULT: function (state, payload) {
            state.parse_result = payload;
        },
        // 语音包
        ACTIVE_VPK: function (state, payload) {
            state.vpk = payload;
        },
        // 数据包
        SET_PKG: function (state, payload) {
            state.pkg = payload;
        },
        RESET_PKG: function (state, payload = {}) {
            state.pkg = cloneDeep({ ...defaultPkg, ...payload });
        },
        SET_PKG_FILE: function (state, payload) {
            state.pkg_file = payload;
        },
        SET_PKG_ITEM: function (state, payload) {
            state.pkg[payload.key] = payload.value;
        },
        // 目标监控
        SET_TARGET_TAGS: function (state, payload) {
            state.target_tags = payload;
        },
        // 场景标记
        SET_MARK_MAP: function (state, payload) {
            state.mark_map = payload;
        },
        SET_MARK_DATA: function (state, payload) {
            state.mark_data = payload;
        },
    },
    getters: {
        isDBtype: function (state) {
            return state.type != "TALK" && state.type != "CHAT";
        },
        getParams: function (state) {
            return state.params;
        },
        getName: function (state) {
            return state.name;
        },
        getDefaultIcon: function (state) {
            return __iconPath + "icon/" + state._icon + ".png";
        },
        getDefaultName: function (state) {
            return state._name;
        },
    },
    actions: {
        getMapIndex: function ({ state }) {
            getMapList().then((res) => {
                const list = res.data.data.list;
                const mapIndex = list.reduce((acc, cur) => {
                    acc[cur.ID] = cur.MapName;
                    return acc;
                }, {});
                state.mapTypeIndex = list.reduce((acc, cur) => {
                    acc[cur.ID] = cur.MapType;
                    return acc;
                }, {});
                state.mapIndex = { ...mapIndex, ...state.mapIndex };
                state.mapKeys = Object.keys(state.mapIndex)
                    .map(Number)
                    .sort((a, b) => b - a);
            });
        },
        getSlugList: function ({ state }) {
            getSlugList().then((res) => {
                const { code, data } = res.data ?? {};
                if (code !== 0) return;
                const slugs = data.reduce((acc, cur) => {
                    const { group_name, is_official, remark, slug } = cur;
                    if (!acc[group_name]) acc[group_name] = [];
                    acc[group_name].push({
                        is_official,
                        value: slug,
                        label: remark,
                    });
                    return acc;
                }, {});
                state.slugs = [];
                for (let group_name in slugs) {
                    const group = {
                        value: group_name,
                        label: group_name,
                        children: [],
                    };
                    for (let slug of slugs[group_name]) group.children.push(slug);
                    state.slugs.push(group);
                }
            });
        },
    },
};

export default new Vuex.Store(store);
