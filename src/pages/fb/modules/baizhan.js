import { getBosses, getBossInfo, getTypes, getSkills, getSkillInfo, getEffects, getMap } from "@/service/fb/baizhan";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import {
    effects as baizhanEffects,
    skill_costs,
    skill_types,
    skill_colors,
} from "@/assets/data/fb/baizhan_effects.js";

export default {
    namespaced: true,
    state: {
        // 当前页面
        activeTab: "map",

        currentEffect: {},
        currentBoss: {},
        currentBossName: "",
        types: {
            skill_colors: skill_colors,
            skill_costs: skill_costs,
            skill_types: skill_types,
        },
        bosses: [],
        skills: [],
        skillExtraList: [],
        effects: [],
        skillParams: {},
        mapFilterInit: "init",

        step: 6,
        row: 10,
        map: "",
        maps: [],

        downLoading: false,

        currentSkill: {},
        search: "", // BOSS攻略查询
    },
    getters: {
        bossNames(state) {
            return ["精英首领"].concat(
                Array.from(new Set(state.bosses.map((item) => item.name))).filter((item) => item !== "精英首领")
            );
        },
    },
    mutations: {
        setState(state, val) {
            state[val.key] = val.val;
        },
    },
    actions: {
        setInit({ commit }, currentBoss = {}) {
            commit("setState", {
                key: "mapFilterInit",
                val: "init",
            });
            commit("setState", {
                key: "currentEffect",
                val: {},
            });
            commit("setState", {
                key: "currentBossName",
                val: "",
            });
            commit("setState", {
                key: "currentBoss",
                val: currentBoss,
            });
        },
        async loadBosses({ commit, dispatch }, payLoad) {
            const cache = sessionStorage.getItem(`baizhan-bosses`);
            if (!payLoad?.isForce && cache) {
                const data = JSON.parse(cache);
                commit("setState", {
                    key: "bosses",
                    val: data,
                });
            } else {
                // 手动强制替换 或没有存storage
                await getBosses().then((res) => {
                    let list = res.data?.data || [];
                    list = list
                        .filter((item) => item.dwNpcID)
                        .map((item) => {
                            return {
                                id: item.dwNpcID,
                                avatar: item.ImagePath
                                    ? `${__imgPath}pve/baizhan/${item.ImagePath.match(
                                          /\\([^\\]*)\./
                                      )[1].toLowerCase()}_${item.ImageFrame}.png`
                                    : `${__imgPath}pve/baizhan/fbcdpanel02_51.png`,
                                name: item.szName,
                                skills: item.szSkill,
                            };
                        });
                    let map = new Map();
                    let mapList = list.filter((v) => !map.has(v.name) && map.set(v.name, 1));
                    const names = mapList.map((item) => item.name).join(",");
                    getBossInfo({ names: names }).then((resInfo) => {
                        const bossExtraList = resInfo.data?.data || [];
                        const bosses = list.map((item) => {
                            item.link = bossExtraList.find((boss) => boss.boss_name === item.name)?.link || "";
                            return item;
                        });
                        commit("setState", {
                            key: "bosses",
                            val: bosses,
                        });
                        sessionStorage.setItem(`baizhan-bosses`, JSON.stringify(bosses));
                        if (payLoad?.isForce) {
                            dispatch("loadMap");
                        }
                    });
                });
            }
        },
        async loadSkills({ commit }) {
            const cache = sessionStorage.getItem(`baizhan-skills`);
            const extraCache = sessionStorage.getItem(`baizhan-skillExtraList`);
            if (cache && extraCache) {
                const data = JSON.parse(cache);
                commit("setState", {
                    key: "skills",
                    val: data,
                });
                commit("setState", {
                    key: "currentSkill",
                    val: data?.[0] || {},
                });
                const extraData = JSON.parse(extraCache);
                commit("setState", {
                    key: "skillExtraList",
                    val: extraData,
                });
            } else {
                await getSkills().then((res) => {
                    const list = res.data?.data?.list || [];
                    const ids = list.map((item) => item.dwInSkillID).join(",");
                    getSkillInfo({ ids: ids }).then((resInfo) => {
                        const skillExtraList = resInfo.data?.data || [];
                        const newList = list.map((item) => {
                            const extra = skillExtraList.find((extra) => extra.skill_id === item.dwInSkillID) || {};
                            item.extra = extra;
                            item.skillIconId = item?.Skill?.IconID;
                            if (item.szBossName === "钱宗龙杜姬欣") {
                                item.szBossName = "钱宗龙";
                            }
                            return item;
                        });
                        commit("setState", {
                            key: "skills",
                            val: newList,
                        });
                        commit("setState", {
                            key: "currentSkill",
                            val: newList?.[0] || {},
                        });
                        commit("setState", {
                            key: "skillExtraList",
                            val: skillExtraList,
                        });
                        sessionStorage.setItem(`baizhan-skills`, JSON.stringify(newList));
                        sessionStorage.setItem(`baizhan-skillExtraList`, JSON.stringify(skillExtraList));
                    });
                });
            }
        },
        async loadEffects({ commit }) {
            const cache = sessionStorage.getItem(`baizhan-effects`);
            if (cache) {
                const data = JSON.parse(cache);
                commit("setState", {
                    key: "effects",
                    val: data,
                });
            } else {
                await getEffects().then((res) => {
                    const list = res.data?.data || [];
                    list.unshift({
                        nID: 0,
                        dwIconID: 18505,
                        szName: "无",
                        szDescription: "",
                        reward: 0,
                        tags: "",
                        buffID: 24848,
                    });
                    const effects = list.map((item) => {
                        const effect = baizhanEffects.find((effect) => effect.id === item.nID) || {};
                        let reward = effect.reward;
                        if (effect.rewardRegexp) {
                            const matches = item.szDescription.match(effect.rewardRegexp);
                            if (matches?.[1]) {
                                reward = Number(matches[1]);
                            }
                        }
                        return {
                            ...item,
                            reward: reward || 0,
                            tags: effect?.tags || [],
                            buffID: effect?.buffID || 24848,
                            buffLevel: effect?.buffLevel || 1,
                        };
                    });
                    commit("setState", {
                        key: "effects",
                        val: effects,
                    });
                    sessionStorage.setItem(`baizhan-effects`, JSON.stringify(effects));
                });
            }
        },
        async loadMap({ commit, state }) {
            await getMap().then((res) => {
                if (res.data?.code !== 0) return;
                state.map = res.data?.data || "";

                const bosses = state.bosses;
                const effects = state.effects;
                const data = res.data?.data?.data || [];
                const list = data.map((item) => {
                    return {
                        ...item,
                        boss: bosses.find((boss) => boss.id === item.dwBossID),
                        bossName: bosses.find((boss) => boss.id === item.dwBossID)?.name,
                        bossLink: bosses.find((boss) => boss.id === item.dwBossID)?.link,
                        bossAvatar: bosses.find((boss) => boss.id === item.dwBossID)?.avatar,
                        effect: effects.find((effect) => effect.nID === item.nEffectID),
                    };
                });
                commit("setState", {
                    key: "maps",
                    val: list,
                });
                // commit("setState", {
                //     key: "currentBoss",
                //     val: list[0],
                // });
            });
        },
    },
};
