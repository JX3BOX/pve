import Vue from "vue";
import Vuex from "vuex";

import cloneDeep from "lodash/cloneDeep";
import default_construct from "@/assets/data/pz/default_construct";
import equip_map from "@/assets/data/pz/equip_map.json";
import User from "@jx3box/jx3box-common/js/user";

Vue.use(Vuex);

let store = {
    state: {
        client: location.href.includes("origin") ? "origin" : "std",

        // 单个方案数据,不受前端本地修改(数据raw)
        schema: "",

        // 当前配装方案(只记录ID,方便同步数据库更新)
        // {$Equip:{equip:装备ID,strength:精炼等级, embedding:[6,6], stone:五彩石id, enhance:小附魔id, enchant:大附魔id, skill:特效技能id}}
        content: cloneDeep(default_construct),

        // 当前配装快照(存档完整信息,当锁定后,即使游戏数据库更新,快照仍展示历史数值)
        // {$Equip:{equip:{装备详细信息},strength:精炼等级, embedding:[6,6], stone:{五彩石详细属性}, enhance:{小附魔详细属性}, enchant:{大附魔详细属性}, skill:{特效技能信息}},..}
        snapshot: cloneDeep(default_construct),
        _snapshot: cloneDeep(default_construct), //当为冻结状态时，深度拷贝一份内容到此位置

        // 当前装备
        activeEquip: "",

        // 五彩石
        stones: {},
        score: {
            embed: 0,
            stone: 0,
        },

        // 心法相关
        kungfuMeta: {},
        mount: "",
        isTertiary: false, // 藏剑心法有可能为 true

        // attrs
        attrs: {},
        schema_score: 0,

        // 设置相关
        open_target: false,
        setting: {
            autosave: 0,
            strength: 6,
            embedding: 6,
            key_shortcut: 1
        },
        is_login: User.isLogin(),

        // map_list
        map_list: {},

        isRecommend: 0, // 是否自荐
        isAuditing: false // 是否审核中
    },
    mutations: {
        SET_STATE: function(state, { key, value }) {
            state[key] = value;
        },
        SET_ATTRS: function(state, data) {
            state.attrs = data;
        },
        Sync: function(state, { prop, data }) {
            const content = state.content[state.activeEquip];
            const snapshot = state.snapshot[state.activeEquip];

            Vue.set(content, prop, data.content);
            Vue.set(snapshot, prop, data.snapshot);
        },
        SET_SCHEMA: function(state, { key, value }) {
            const schema = state["schema"];
            Vue.set(schema, key, value);
        },
    },
    getters: {
        // 当前用户所处网站客户端版本
        client: (state) => {
            return state.client || "std";
        },
        // 当前配装方案的客户端版本
        schema_client: (state) => {
            return state.schema?.client || "std";
        },
        // 方案引用
        schema: (state) => {
            return state.schema;
        },
        // 当前schema是否为编辑推荐
        isStar: (state) => {
            return state.schema?.star;
        },
        // 当前schema的心法
        mount: (state) => {
            return state.schema?.mount;
        },

        content: (state) => {
            return state.content;
        },

        // 最终计算的属性总表
        attrs: (state) => {
            return state.attrs;
        },

        // 当前设置的装备KEY
        activeEquip: (state) => {
            return state.activeEquip;
        },
        // 当前部位快照
        activeSnapshot: (state) => {
            return state.snapshot[state.activeEquip];
        },
        // 当前部位快照的《装备》本身信息
        equip: (state) => {
            return state?.snapshot?.[state.activeEquip]?.["equip"] || null;
        },

        // 当前是否为武器（五彩石）
        isWeapon: (state) => {
            return !equip_map?.[state.activeEquip]?.["position"];
        },
        // 当前是否为暗器（范围伤害）
        isSecondaryWeapon: (state) => {
            return equip_map?.[state.activeEquip]?.["position"] == 1;
        },

        // 当前配装石头等级和个数
        stoneCounter: (state) => {
            let totalCount = 0;
            let totalLevel = 0;
            Object.values(state.snapshot).forEach((equip) => {
                (equip?.embedding || []).forEach((ops) => {
                    if (ops?.level > 0) {
                        totalCount += 1;
                        totalLevel += ops.level;
                    }
                });
            });

            return {
                totalCount,
                totalLevel,
            };
        },
        collections: (state) => {
            const collections = new Map();
            Object.entries(state.snapshot).forEach(([position, _snapshot]) => {
                if (~~_snapshot?.equip?.SetID) {
                    if (!collections.has(~~_snapshot?.equip?.SetID)) {
                        const _collection = {
                            count: 1,
                            id: ~~_snapshot.equip.SetID,
                            setData: _snapshot.equip._SetData,
                        };
                        collections.set(~~_snapshot.equip.SetID, _collection);
                    } else {
                        const collection = collections.get(~~_snapshot.equip.SetID);
                        collection.count += 1;
                        collections.set(~~_snapshot.equip.SetID, collection);
                    }
                }
            });
            return collections;
        },

        stones: (state) => {
            return state.stones;
        },

        gs: (state) => {
            let total = 0;
            for (let item in state.score) {
                total += item;
            }
            return total;
        },
        map_list: (state) => {
            return state.map_list;
        },

        // 是否为当前用户
        is_author: (state) => {
            return User.getInfo().uid == state.schema.user_id
        }
    },
    actions: {},
    modules: {},
};

export default new Vuex.Store(store);
