<template>
    <div class="m-pz-attribute">
        <div class="m-attribute">
            <div class="u-title">
                <i class="el-icon-help"></i> 主属性
                <div class="u-cangjian-weapon" v-if="isCangJian">
                    <el-radio-group v-model="currentWeapon" size="mini">
                        <el-radio-button label="PRIMARY_WEAPON">轻剑</el-radio-button>
                        <el-radio-button label="TERTIARY_WEAPON">重剑</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <ul class="u-list">
                <li v-if="schema_client === 'origin'">
                    <span class="u-label">体型</span>
                    <b class="u-value">{{ roleTypeName }}</b>
                </li>
                <li>
                    <span class="u-label">装分</span>
                    <b class="u-value">{{ score }}</b>
                </li>
                <template v-for="(item, index) in displayAttributes.base">
                    <li v-if="checkedAttrs.includes(item)" :key="'base' + index">
                        <span class="u-label">{{ displayLabel(item) }}</span>
                        <b class="u-value">{{ displayAttr(item) }}</b>
                    </li>
                </template>
            </ul>

            <template v-if="displayAttributes.attack && displayAttributes.attack.length">
                <div class="u-title"><i class="el-icon-data-line"></i> 攻击属性</div>
                <ul class="u-list">
                    <template v-for="(item, index) in displayAttributes.attack">
                        <li :key="'attack' + index">
                            <span class="u-label" :class="{ 'is-link': item === 'HastePercent' }" @click="toApp(item)">
                                {{ displayLabel(item) }}
                                <!-- 仅为加速属性时才会渲染pop -->
                                <haste-recommend v-if="item === 'HastePercent'" :client="schema_client"
                                    :mount="mount"></haste-recommend>
                            </span>
                            <attributePop :attrName="item" :attrs="attrs">
                                <b class="u-value">{{ displayAttr(item) }}</b>
                                <span class="u-raw" v-if="isPercent(item)">{{ displayRaw(item) }}</span>
                            </attributePop>
                        </li>
                    </template>
                </ul>
            </template>

            <template v-if="displayAttributes.heal && displayAttributes.heal.length">
                <div class="u-title"><i class="el-icon-data-line"></i> 治疗属性</div>
                <ul class="u-list">
                    <template v-for="(item, index) in displayAttributes.heal">
                        <li :key="'heal' + index">
                            <span class="u-label">{{ displayLabel(item) }}
                                <haste-recommend v-if="item === 'HastePercent'" :client="schema_client"
                                    :mount="mount"></haste-recommend>
                            </span>
                            <attributePop :attrName="item" :attrs="attrs">
                                <b class="u-value">{{ displayAttr(item) }}</b>
                                <span class="u-raw" v-if="isPercent(item)">{{ displayRaw(item) }}</span>
                            </attributePop>
                        </li>
                    </template>
                </ul>
            </template>

            <template v-if="displayAttributes.shield && displayAttributes.shield.length">
                <div class="u-title">
                    <i class="el-icon-data-line"></i> 防御属性
                    <div class="u-all-attr">
                        <el-switch v-model="showAllShield" active-text="全部" size="mini"></el-switch>
                    </div>
                </div>
                <ul class="u-list">
                    <template v-for="(item, index) in shieldAttr">
                        <li :key="'shield' + index">
                            <span class="u-label">{{ displayLabel(item) }} </span>
                            <attributePop :attrName="item" :attrs="attrs">
                                <b class="u-value">{{ displayAttr(item) }}</b>
                                <span class="u-raw" v-if="isPercent(item)">{{ displayRaw(item) }}</span>
                            </attributePop>
                        </li>
                    </template>
                </ul>
            </template>
            <template>
                <div class="u-title">
                    <i class="el-icon-data-line"></i>其他属性
                </div>
                <ul class="u-list">
                    <template v-for="(item, index) in othersCommon">
                        <li :key="index">
                            <span class="u-label"> {{ displayLabel(item) }}</span>
                            <attributePop :attrName="item" :attrs="attrs">
                                <b class="u-value">{{ displayAttr(item) }}</b>
                                <span class="u-raw" v-if="isPercent(item)">{{ displayRaw(item) }}</span>
                            </attributePop>
                        </li>
                    </template>
                </ul>
            </template>
        </div>
    </div>
</template>

<script>
import {
    mount_display_attributes,
    xf_primary_attributes,
    stdTankCommon,
    originTankCommon,
    otherCommon
} from "@/assets/data/pz/mount_display_attributes.js";
import panelDesc from "@/assets/data/pz/attr_desc_panel.json";
import { mapGetters } from "vuex";
import { isCangJian } from "@/utils/pz/game.js";
import { calculateAttrib as calculateAttribStd } from "@/calc/stdV130/v130.js";
import { calculateAttrib as calculateAttribOrigin } from "@/calc/originV90/v90.js";
import descConvert from "@/assets/data/pz/attr_desc_panel.json";
import attributePop from "./AttributePop.vue";
import HasteRecommend from "./HasteRecommend.vue";
import { role_types } from "@/assets/data/pz/equip_settings";

export default {
    name: "Attribute",
    props: [],
    components: {
        attributePop,
        HasteRecommend,
    },
    data: function () {
        return {
            attrs: {},
            descConvert,
            checkedAttrs: [],
            mountAttrs: [],
            currentWeapon: "TERTIARY_WEAPON",
            showAllAttack: false,
            showAllShield: false,
        };
    },
    computed: {
        ...mapGetters(["schema_client", "mount", "collections", "activeEquip", "schema"]),
        isCangJian: function () {
            return isCangJian(this.mount);
        },
        snapshot: function () {
            return this.$store.state.snapshot;
        },
        score: function () {
            return this.$store.state.schema_score;
        },
        displayAttributes: function ({ schema_client, mount }) {
            return mount_display_attributes[schema_client][mount];
        },
        shieldAttr: function ({ displayAttributes, showAllShield }) {
            const tankCommon = this.schema_client == "origin" ? originTankCommon : stdTankCommon;
            return showAllShield ? tankCommon : displayAttributes.shield;
        },
        othersCommon: function () {
            return otherCommon;
        },
        isTertiary: function () {
            return this.currentWeapon !== "PRIMARY_WEAPON";
        },
        talentPzCode: function () {
            return this.$store.state.schema?.talent_pzcode || [];
        },
        roleType: function () {
            return this.$store.state.schema?.role_type || 1;
        },
        roleTypeName: function () {
            return role_types.filter((role) => role.value === this.roleType)[0]["text"];
        },
    },
    watch: {
        snapshot: {
            deep: true,
            handler(val) {
                this.attrs = this.isCangJian ? this.formatAttrs(val, this.isTertiary) : this.formatAttrs(val);

                this.$store.commit("SET_STATE", {
                    key: "attrs",
                    value: this.attrs,
                });
            },
        },
        isTertiary: function (val) {
            this.attrs = this.formatAttrs(this.snapshot, val);

            this.$store.commit("SET_STATE", { key: "isTertiary", value: val });
        },
        activeEquip: function (val) {
            if (this.isCangJian) this.currentWeapon = val;
        },
    },
    methods: {
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
        init: function () {
            const _attrs = [];
            const displayAttributes = mount_display_attributes[this.schema_client][this.mount];

            const xf_primary = xf_primary_attributes[this.mount];
            Object.values(displayAttributes).forEach((attr) => {
                _attrs.push(...attr);
            });

            const panelAttrs = [];

            Object.entries(panelDesc).forEach(([key, attr]) => {
                if (attr.default) {
                    panelAttrs.push(key);
                }
            });

            this.checkedAttrs = _attrs.filter((_attr) => panelAttrs.includes(_attr));

            this.checkedAttrs.push(xf_primary);

            this.attrs = this.isCangJian
                ? this.formatAttrs(this.snapshot, this.isTertiary)
                : this.formatAttrs(this.snapshot);

            this.$store.commit("SET_STATE", {
                key: "attrs",
                value: this.attrs,
            });
        },
        displayLabel: function (key) {
            return descConvert[key].name;
        },
        displayAttr: function (key) {
            const { attrs } = this;
            const value = attrs[key];
            if (key.endsWith("Percent") || key.endsWith("Rate")) {
                return (value && (value * 100).toFixed(2) + "%") || value;
            }
            return value;
        },
        displayRaw: function (key) {
            const { attrs } = this;
            let _key = "";
            if (key.includes("DefCriticalPercent")) {
                _key = key.replace("DefCriticalPercent", "");
            } else {
                _key = key.includes("Percent") ? key.replace("Percent", "") : key.replace("Rate", "");
            }
            return attrs[_key];
        },
        /**
         * 是否为百分值
         * @param {String} attr 数值key
         */
        isPercent: function (attr) {
            return attr.includes("Percent") || attr.includes("Rate") || attr.includes("DefCriticalPercent");
        },
        toApp: function (attrName) {
            if (attrName === "HastePercent") {
                window.open("/bps/#/haste", "_blank");
            }
        },
    },
    mounted: function () {
        this.$nextTick(() => {
            if (this.isCangJian) {
                this.currentWeapon = this.schema?.weapon_mode ? "PRIMARY_WEAPON" : "TERTIARY_WEAPON";
            } else {
                this.currentWeapon = "PRIMARY_WEAPON";
            }
            this.init();
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/attribute.less";
</style>
