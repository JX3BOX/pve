<template>
    <Main :withoutRight="true" :withoutLeft="!isEditPage">
        <LeftSidebar :open="isEditPage">
            <EquipAnchor />
        </LeftSidebar>
        <div class="m-pz-main" :class="{ isViewMode: !isEditPage }">
            <template v-if="id">
                <ToolBar />
                <Overview v-if="isIndex" />
                <template v-else>
                    <Pz />
                </template>
            </template>
        </div>
        <Footer></Footer>

        <OverviewCode ref="code" v-show="false" />
    </Main>
</template>

<script>
// components
import ToolBar from "@/components/pz/Toolbar.vue";
import EquipAnchor from "@/components/pz/EquipAnchor.vue";
import Pz from "@/components/pz/Pz.vue";
import Overview from "@/components/pz/Overview.vue";
import OverviewCode from "@/components/pz/overviewcludes/OverviewCode.vue";
// data
import { getPz, getSelfRecommend } from "@/service/pz/schema.js";
import { mapGetters } from "vuex";
import default_construct from "@/assets/data/pz/default_construct";
import equip_map from "@/assets/data/pz/equip_map.json";
import overviewDisplay from "@/assets/data/pz/overview_display.js";

// fn
import cloneDeep from "lodash/cloneDeep";
import isEmpty from "lodash/isEmpty";
import { calculateAttrib as calculateAttribStd } from "@/calc/stdV130/v130.js";
import { calculateAttrib as calculateAttribOrigin } from "@/calc/originV90/v90.js";
import { postStat } from "@jx3box/jx3box-common/js/stat.js";
import { getEquipScore, getStoneScore, getEmbeddingScore, getGsStrengthScore } from "@/utils/pz/score.js";
import { isCangJian } from "@/utils/pz/game.js";
import { hasEffect } from "@/utils/pz/equipFilter";

import hash from "object-hash";

export default {
    name: "Detail",
    components: {
        EquipAnchor,
        Pz,
        Overview,
        ToolBar,
        OverviewCode,
    },
    data: function () {
        return {
            overview: "",
        };
    },
    computed: {
        ...mapGetters(["schema_client", "schema", "mount", "attrs", "collections"]),
        id: function () {
            return this.$route.params.id;
        },
        isEditPage: function () {
            return this.$route.name === "edit";
        },
        isCangJian: function () {
            return isCangJian(this.mount);
        },
        isIndex: function () {
            return !this.$store.state.activeEquip;
        },
        isTertiary: function () {
            return this.$store.state.isTertiary;
        },
        snapshot: function () {
            return this.$store.state.snapshot;
        },
        talentPzCode: function () {
            return this.$store.state.schema?.talent_pzcode || [];
        },
        roleType: function () {
            return this.$store.state.schema?.role_type || 0;
        },
        score: function ({ snapshot, schema_client }) {
            let score = {
                withName: {},
            };
            Object.entries(snapshot).forEach(([key, _snapshot]) => {
                if (_snapshot.equip) {
                    const position = equip_map[key].position;
                    const equip = _snapshot.equip;

                    // 基础装分
                    const baseScore = getEquipScore(equip.Level, equip.Quality, position);

                    // 五行石装分
                    let embeddingScore = 0;
                    if (_snapshot?.embedding.length) {
                        embeddingScore = _snapshot?.embedding
                            ?.map((e) => getEmbeddingScore(e.level, schema_client))
                            .reduce((prev, next) => prev + next);
                    }

                    // 五彩石装分
                    let stoneScore = 0;
                    if (_snapshot.stone) {
                        stoneScore = getStoneScore(_snapshot?.stone?.stone_level || 0, schema_client);
                    }

                    // 精炼装分
                    const strengthScore = getGsStrengthScore(baseScore, _snapshot.strength, {
                        client: schema_client,
                        equipQuality: equip.Quality,
                        equipPosition: equip.SubType,
                        equipLevel: equip.Level,
                    });

                    // 大小附魔分
                    const enchantScore = _snapshot?.enchant?.Score || 0;
                    const enhanceScore = _snapshot?.enhance?.Score || 0;
                    const _score =
                        baseScore +
                        Math.round(embeddingScore + stoneScore) +
                        strengthScore +
                        enchantScore +
                        enhanceScore;

                    score.withName[key] = _score;
                }
            });

            let _score = 0;
            if (this.isCangJian) {
                let cangjianWeapon = 0;
                Object.entries(score.withName).forEach(([key, value]) => {
                    if (key === "TERTIARY_WEAPON" || key === "PRIMARY_WEAPON") {
                        cangjianWeapon += value;
                    } else {
                        _score += value;
                    }
                });

                _score = _score + cangjianWeapon / 2;
            } else {
                Object.values(score.withName).forEach((value) => {
                    _score += value;
                });
            }

            return Math.floor(_score);
        },
        setting: function () {
            return this.$store.state.setting;
        },
    },
    mounted() {
        // 按下 ctrl + alt + e 进行复制
        this.setting.key_shortcut && document.addEventListener("keydown", this.onKeyShortcut);
    },
    beforeDestroy() {
        this.setting.key_shortcut && document.removeEventListener("keydown", this.onKeyShortcut);
    },
    methods: {
        loadData: function () {
            this.loading = true;
            getPz(this.id)
                .then((res) => {
                    const _isEmpty = isEmpty(res?.data?.data?.content);
                    const data = res?.data?.data;
                    // 有些数据content可能经过多次转义（暂时不知道哪来的，先适配一下）
                    if (data) {
                        if (typeof data.content === "string") data.content = JSON.parse(data.content);
                        if (typeof data.snapshot === "string") data.snapshot = JSON.parse(data.snapshot);
                        if (typeof data.talent_code === "string") data.talent_code = JSON.parse(data.talent_code);
                        if (typeof data.talent_pzcode === "string") data.talent_pzcode = JSON.parse(data.talent_pzcode);
                    }

                    this.$store.commit("SET_STATE", {
                        key: "schema",
                        value: res.data?.data,
                    });
                    this.$store.commit("SET_STATE", {
                        key: "content",
                        value: (!_isEmpty && res.data?.data?.content) || cloneDeep(default_construct),
                    });
                    this.$store.commit("SET_STATE", {
                        key: "snapshot",
                        value: res.data?.data?.snapshot || cloneDeep(default_construct),
                    });
                    this.$store.commit("SET_STATE", {
                        key: "isTertiary",
                        value: res.data?.data?.weapon_mode ? false : !!this.isCangJian,
                    });

                    // 藏剑默认为重剑
                    const attrs = this.formatAttrs(this.snapshot, this.isTertiary);

                    this.$store.commit("SET_STATE", {
                        key: "attrs",
                        value: attrs,
                    });

                    this.overview = this.handleOverview();

                    // 生成原始hash
                    this.createHash({ ...res?.data?.data, overview: this.overview });

                    // 提交统计
                    postStat("pz", this.id);

                    // 获取自荐配置
                    this.loadRecommend();
                })
                .catch((e) => {
                    this.$message.error(e?.data?.msg || "获取数据失败");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        createHash: function (data) {
            let current_hash = hash(JSON.parse(JSON.stringify(data)));
            sessionStorage.setItem(`schema_hash_${this.id}`, current_hash);
        },
        formatAttrs: function (snapshot, isTertiary = false) {
            if (this.schema_client === "origin") {
                return calculateAttribOrigin({
                    snapshot,
                    mount: this.mount,
                    setCollection: this.collections,
                    schema_client: "origin",
                    useHeavy: isTertiary,
                    talentCode: this.talentPzCode,
                    bodyType: this.roleType,
                    level: this.schema?.overview?.level || 0,
                });
            }
            return calculateAttribStd({
                snapshot,
                mount: this.mount,
                setCollection: this.collections,
                schema_client: "std",
                useHeavy: isTertiary,
                talentCode: this.talentPzCode,
                level: this.schema?.overview?.level || 0,
            });
        },
        // 包含特效判断
        hasEffect,
        handleOverview: function () {
            const attrs = this.formatAttrs(this.snapshot, this.isTertiary);

            this.$store.commit("SET_STATE", {
                key: "attrs",
                value: attrs,
            });

            const { snapshot, mount, schema } = this;
            const _overview = {
                equips: {},
                attrs: {},
                score: 0,
                level: schema?.overview?.level || 0,
            };

            Object.entries(snapshot).forEach(([key, _snapshot]) => {
                const _equip = {};

                _equip.name = _snapshot?.equip?.Name;
                _equip.icon = _snapshot?.equip?._IconID;
                _equip.level = _snapshot?.equip?.Level;
                _equip.attrs = _snapshot?.equip?._Attrs;
                _equip.strength = _snapshot.strength;
                _equip.embedding = _snapshot?.embedding?.map((embed) => embed.level);
                _equip.enhance = _snapshot?.enhance?.Name;
                _equip.enchant = _snapshot?.enchant?.Name;
                _equip.stone = _snapshot?.stone?.Name;
                _equip.stone_icon = _snapshot?.stone?.icon;
                _equip.max_strength_level = _snapshot?.equip?.MaxStrengthLevel;
                _equip.quality = _snapshot?.equip?.Quality;

                _equip.is_special = _snapshot?.equip?.BelongSchool === "精简" || this.hasEffect(_snapshot?.equip);

                _overview.equips[key] = _equip;
            });

            const mountDisplay = overviewDisplay[mount];

            Object.entries(mountDisplay).forEach(([key, attr]) => {
                _overview.attrs[key] = this.displayAttr(attr, this.attrs[attr]);
            });

            _overview.score = this.score;

            return _overview;
        },
        displayAttr: function (key, value) {
            /* if (key.includes("Percent") || key.includes("Rate")) {
                return (value && Number((value * 100).toFixed(2))) || value;
            } */
            return value;
        },
        onKeyShortcut: function (e) {
            if (e.ctrlKey && e.altKey && e.key === "e") {
                this.$refs.code.copy();
            }
        },
        loadRecommend() {
            getSelfRecommend(this.id).then((res) => {
                const data = res?.data?.data;
                if (data) {
                    if (data.status === 0) {
                        this.$store.commit("SET_STATE", {
                            key: "isRecommend",
                            value: 1,
                        });
                        // 处于审核中
                        this.$store.commit("SET_STATE", {
                            key: "isAuditing",
                            value: true,
                        });
                    } else {
                        this.$store.commit("SET_STATE", {
                            key: "isRecommend",
                            value: 0,
                        });
                    }
                } else {
                    this.$store.commit("SET_STATE", {
                        key: "isRecommend",
                        value: 0,
                    });
                }
            });
        },
    },
    watch: {
        id: {
            immediate: true,
            handler: function () {
                this.loadData();
            },
        },
        score: {
            immediate: true,
            handler: function () {
                this.$store.commit("SET_STATE", {
                    key: "schema_score",
                    value: this.score,
                });
            },
        },
        overview: {
            deep: true,
            handler() {
                this.$store.commit("SET_SCHEMA", {
                    key: "overview",
                    value: this.overview,
                });
            },
        },
        snapshot: {
            deep: true,
            handler() {
                this.overview = this.handleOverview();
            },
        },
        talentPzCode: {
            deep: true,
            handler() {
                this.overview = this.handleOverview();
            },
        },
        isTertiary() {
            this.overview = this.handleOverview();
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/view.less";
</style>
