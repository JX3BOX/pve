<template>
    <el-form :label-position="labelPosition" label-width="100px">
        <el-form-item label="属性筛选">
            <el-checkbox-group v-model="form.attr">
                <el-checkbox
                    v-for="attr in equipAttributes"
                    :key="attr"
                    :label="attr"
                >{{ equip_attributes[attr] }}
                </el-checkbox
                >
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="类型筛选">
            <el-radio-group v-model="form.pv_type" size="small">
                <el-radio-button key="all" label>全部</el-radio-button>
                <el-radio-button
                    v-for="(type, index) in pv_types"
                    :key="type"
                    :label="type"
                >{{ index }}
                </el-radio-button
                >
            </el-radio-group>
        </el-form-item>

        <el-form-item label="来源筛选">
            <div slot="label">
                <span>来源筛选</span>
                <el-tooltip content="该筛选数据来源游戏内装备大全，部分装备可能存在填表误差" placement="top-start">
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </div>
            <el-checkbox-group v-model="form.GetType">
                <el-checkbox
                    v-for="GetType in equip_from"
                    :key="GetType"
                    :label="GetType"
                >{{ GetType }}
                </el-checkbox
                >
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="品质筛选">
            <div class="u-level">
                <el-radio-group
                    class="u-level-switch"
                    v-model="form.levelMode"
                    size="mini"
                >
                    <el-radio-button label="range">范围</el-radio-button>
                    <el-radio-button label="number">指定</el-radio-button>
                </el-radio-group>

                <div class="u-level-slider" v-if="form.levelMode == 'range'">
                    <span class="u-level-range">
                        <el-input-number
                            :min="equipQuality.min"
                            :max="equipQuality.max"
                            size="mini"
                            :step="equipQuality.step"
                            :value="form.range[0]"
                            :controls="false"
                            @blur="(e) => handleLevelChange(e, 'min')"
                            style="width: 65px"
                        ></el-input-number>
                        <span class="u-between"> 品至 </span>
                        <el-input-number
                            :min="equipQuality.min"
                            :max="equipQuality.max"
                            size="mini"
                            :step="equipQuality.step"
                            :value="form.range[1]"
                            :controls="false"
                            @blur="(e) => handleLevelChange(e, 'max')"
                            style="width: 65px"
                        ></el-input-number>
                        <span class="u-between"> 品</span>
                    </span>
                    <el-slider
                        v-model="form.range"
                        :min="equipQuality.min"
                        :max="equipQuality.max"
                        :step="equipQuality.step"
                        range
                        class="m-pz-quality-range"
                    ></el-slider>
                </div>

                <el-input-number
                    v-else
                    class="u-level-number"
                    v-model="form.level"
                    controls-position="right"
                    :step="equipQuality.step"
                    :min="0"
                    :max="equipQuality.max"
                    size="mini"
                ></el-input-number>
            </div>
        </el-form-item>
        <el-form-item label="其他筛选" v-show="!isWeapon">
            <el-checkbox v-model="form.hasCommon">散件</el-checkbox>
            <el-checkbox v-model="form.hasSimplify">精简</el-checkbox>
            <template v-if="activeEquip !== 'SECONDARY_WEAPON'">
                <el-tooltip content="此项不包含切糕">
                    <el-checkbox v-model="form.hasPrecious">套装</el-checkbox>
                </el-tooltip>
                <el-checkbox
                    v-model="form.onlySchool"
                    :disabled="!form.hasPrecious"
                >仅显示本门派
                </el-checkbox
                >
            </template>
        </el-form-item>
        <el-form-item label="装备选择">
            <div slot="label">
                <span>装备选择</span>
                <el-tooltip content="直接搜索装备名称可以选择其他心法的装备" placement="top-start">
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </div>
            <el-select
                v-model="selectedEquip"
                placeholder="需要跨门派类别时可直接输入名字快捷搜索"
                no-data-text="没有符合筛选条件的装备"
                style="width: 80%"
                popper-class="m-pz-select"
                reserve-keyword
                clearable
                remote
                filterable
                :remote-method="remoteMethod"
                :loading="equipLoading"
                @change="handleEquipChange"
                @visible-change="handleEquipVisible"
                @clear="clearEquip"
                value-key="ID"
                class="m-pz-select-input"
            >
                <el-option
                    v-for="(equip, i) in equips"
                    :key="equip.ID"
                    :value="equip"
                    :label="equip.Name"
                    :class="{ isLast: i == equips.length - 1 }"
                >
                    <div class="m-pz-filter-select-item">
                        <div
                            class="u-equip-item"
                            :class="'isQuality-' + equip.Quality"
                        >
                            <i
                                class="u-equip-simp"
                                :class="{
                                    isSimp:
                                        equip.BelongSchool === '精简' ||
                                        hasEffect(equip),
                                }"
                            ></i>
                            <img
                                class="u-equip-pic"
                                :src="showEquipIcon(equip._IconID)"
                            />
                            <b class="u-equip-name">{{ equip.Name }}</b>
                            <template
                                v-for="(mountName, index) in showMountName(
                                    equip.RecommendID
                                )"
                            >
                                <span
                                    :key="index"
                                    class="u-equip-school"
                                    :style="{
                                        backgroundColor:
                                            colors_by_mount_name[mountName],
                                    }"
                                    v-if="!form.onlySchool && isPrecious(equip)"
                                >{{ mountName }}</span
                                >
                            </template>
                            <span
                                class="u-equip-camp"
                                :style="{
                                        background: getCampTipBgStyle(equip_camp[equip.RequireCamp]),
                                    }"
                                v-if="equip.RequireCamp in equip_camp"
                            >{{ equip_camp[equip.RequireCamp] }}</span
                            >
                            <span
                                class="u-equip-tags"
                                v-if="equip._Attrs.length"
                            >（{{ equip._Attrs | showKeyAttribute }}）</span
                            >
                            <span
                                class="u-equip-tags"
                                v-if="
                                    !equip._Attrs.length && equip._Duty == 4
                                "
                            >（治疗）</span
                            >
                            <span
                                class="u-equip-lastChosen"
                                v-if="lastChosen === equip.ID"
                            >
                                &lt;上次选择&gt;
                            </span>
                        </div>
                        <span class="u-equip-level">
                            {{ equip.Level + "品" }}
                        </span>
                    </div>
                    <div
                        class="u-more"
                        v-if="i == equips.length - 1 && showMoreTrigger"
                        @click.stop="appendData"
                    >
                        <i class="el-icon-arrow-down"></i> 加载更多
                    </div>
                </el-option>
            </el-select>
            <a
                v-if="selectedEquip"
                class="u-copy-icon"
                :class="{ 'is-copy': hasCopy }"
                title="复制"
                @click="handleCopy"
            >
                <i class="el-icon-document-copy"></i>
            </a>
        </el-form-item>
    </el-form>
</template>

<script>
// dep
import { mapGetters } from "vuex";

// data
import equip_map from "@/assets/data/pz/equip_map.json";
import {
    equip_attributes,
    xf_attrs,
    xf_subtypes,
    pv_types,
    equip_from, equip_camp,
} from "@/assets/data/pz/equip_settings.js";
import { school_contains_mount } from "@jx3box/jx3box-data/data/xf/relation.json";
import { mount_types } from "@jx3box/jx3box-data/data/xf/mount_group.json";
import { colors_by_mount_name } from "@jx3box/jx3box-data/data/xf/colors.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import recommend from "@/assets/data/pz/recommend.json";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import xf from "@jx3box/jx3box-data/data/xf/xf.json";
import { stdFilterParams, originFilterParams } from "@/utils/pz/equipFilter.js";
import { copyText } from "@/utils/pz/tools.js";
import SETTINGS from "@/pages/pz/setting.json";

// service
import { getEquips } from "@/service/pz/game.js";

import debounce from "lodash/debounce";

export default {
    name: "EquipFilter",
    props: {
        labelPosition: {
            type: String,
            default: "left",
        },
    },
    data() {
        return {
            pv_types,
            equip_attributes,
            colors_by_mount_name,
            colors_by_camp_name: {
                "浩气盟": ['#4E4EFF', '#4E4EFFaa'],
                "恶人谷": ['#C74848', '#C74848aa']
            },
            equip_from,

            form: {
                attr: [],
                pv_type: "1",
                GetType: [],

                hasCommon: true,
                hasSimplify: true,

                hasPrecious: true,
                onlySchool: true,
                levelMode: "range",
                level: "",
                range: [4000, 5680],
            },

            // 装备数据
            equips: [],
            copyEquips: [],
            equipLoading: false,
            selectedEquip: "",
            tempEquipName: "",
            pagination: {
                page: 1,
                per: 50,
                pages: 1,
            },
            lastChosen: "",

            // 复制
            hasCopy: false,

            // 查询参数 - 名称
            filterName: "",

        };
    },
    computed: {
        equip_camp() {
            return equip_camp;
        },
        ...mapGetters([
            "equip",
            "schema_client",
            "activeEquip",
            "mount",
            "isWeapon",
        ]),
        qualityText: function() {
            return this.form.range.reduce((x, y) => `${x} 品 - ${y} 品`);
        },
        $subtype: function({ activeEquip }) {
            return equip_map[activeEquip].type;
        },
        mountType: function({ mount }) {
            let mountType = "";
            Object.entries(mount_types).forEach(([key, value]) => {
                if (value.includes(~~mount)) {
                    mountType = key;
                }
            });
            return mountType;
        },
        params: function({ form, schema_client, activeEquip, mount }) {
            let _params = {
                client: schema_client,
                position: equip_map[activeEquip].position,
                pv_type: form.pv_type,
                attr: form.attr.join(","),
                GetType: form.GetType.join(","),
                duty: xf_subtypes[mount],
                pz: 1,
                page: this.pagination.page,
                per: this.pagination.per,
            };

            if (form.levelMode == "number") {
                _params.level = form.level || equipQuality.min;
            } else {
                _params.min_level = form.range[0];
                _params.max_level = form.range[1];
            }

            const data = {
                hasCommon: form.hasCommon,
                hasSimplify: form.hasSimplify,
                hasPrecious: form.hasPrecious,
                onlySchool: form.onlySchool,
                mount,
            };

            if (this.isWeapon) data.weaponType = this.activeEquip;

            const clientParams = schema_client === "std" ? stdFilterParams(data) : originFilterParams(data);

            return { ..._params, ...clientParams };
        },
        data: function() {
            return this.$store.state.content;
        },
        equipQuality: function({ schema_client }) {
            return {
                min: SETTINGS[schema_client + "_level_lower_edge"],
                max: SETTINGS[schema_client + "_level_upper_edge"],
                step: SETTINGS[schema_client + "_level_range_step"],
            };
        },
        equipAttributes: function({ schema_client, mount }) {
            if (schema_client === "std") {
                return xf_attrs[mount].filter((e) => e !== "Hit");
            }
            return xf_attrs[mount].filter((e) => e !== "Surplus");
        },
        schoolName: function({ mount }) {
            let schoolName = "";
            Object.entries(school_contains_mount).forEach(([key, value]) => {
                if (value.includes(~~mount)) {
                    schoolName = key;
                }
            });
            return schoolName;
        },
        showMoreTrigger: function() {
            return this.pagination.page < this.pagination.pages;
        },
        setting: function() {
            return this.$store.state.setting;
        },
    },
    methods: {
        // 阵营背景颜色
        getCampTipBgStyle(campName) {
            const colors = this.colors_by_camp_name[campName];
            if (colors) {
                return `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`;
            }
            return "";
        },
        // 阵营装备判断
        isCampEquip(equip) {
            if ([2, 4].includes(equip.RequireCamp)) {

            }
        },
        // 图标
        showEquipIcon: function(id) {
            return iconLink(id, this.schema_client); //'std'
        },
        // 通过RecommendID获取适合该心法的
        showMountName: function(recommendID) {
            const recommendMount =
                recommend[this.schema_client]["id_mount"][recommendID];

            return recommendMount ? recommendMount.map((re) => xfid[re]) : [];
        },
        // 套装判断
        isPrecious: function(equip) {
            if (this.schema_client === "std") {
                return (
                    equip.BelongSchool != "通用" && equip.BelongSchool != "精简"
                );
            }
            return ~~equip.SetID;
        },
        // 包含特效判断
        hasEffect: function(equip) {
            // 使用特效
            if (!!~~equip.SkillID) return true;
            // 被动特效
            if (
                equip._AttrType?.includes("atSetEquipmentRecipe") ||
                equip._AttrType?.includes("atSkillEventHandler")
            )
                return true;
            // 无特殊效果
            return false;
        },
        // 不进行关键字搜索获取装备
        loadEquips: function() {
            this.pagination.page = 1;
            this.equipLoading = true;
            getEquips(this.$subtype, this.params)
                .then((res) => {
                    this.equips = this.equipFilter(res.data.list) || [];
                    this.pagination.page = res.data.page;
                    this.pagination.pages = res.data.pages;
                    this.pagination.per = res.data.per;
                    // this.handleEquip();
                })
                .finally(() => {
                    this.equipLoading = false;
                });
        },
        appendData: function() {
            this.pagination.page += 1;
            this.equipLoading = true;
            let params = {};
            if (this.filterName) {
                params = {
                    page: this.pagination.page,
                    name: this.filterName,
                    position: equip_map[this.activeEquip].position,
                    pz: 1,
                    client: this.schema_client,
                };
            } else {
                params = this.params;
            }
            getEquips(this.$subtype, params)
                .then((res) => {
                    this.equips = this.equips.concat(this.equipFilter(res.data.list) || []);
                    // this.handleEquip();
                })
                .finally(() => {
                    this.equipLoading = false;
                });
        },
        remoteMethod: debounce(function(query) {
            this.pagination.page = 1;
            if (query) {
                this.filterName = query.replace(/\[|]/g, "");
                this.equipLoading = true;
                getEquips(this.$subtype, {
                    name: query.replace(/\[|]/g, ""),
                    position: equip_map[this.activeEquip].position,
                    pz: 1,
                    client: this.schema_client,
                })
                    .then((res) => {
                        this.equips = this.equipFilter(res.data.list) || [];
                        this.pagination.page = res.data.page;
                        this.pagination.pages = res.data.pages;
                        this.pagination.per = res.data.per;
                    })
                    .finally(() => {
                        this.equipLoading = false;
                    });
            } else {
                // this.loadEquips();
            }
        }, 1000),
        handleEquipVisible: function(val) {
            if (val) {
                this.filterName = "";
                this.loadEquips();
            }
        },
        // 装备改变
        handleEquipChange: function(equip) {
            this.lastChosen = equip.ID;
            this.$store.commit("Sync", {
                prop: "equip",
                data: {
                    content: equip.ID,
                    snapshot: equip,
                },
            });

            // 默认精炼满级
            this.$store.commit("Sync", {
                prop: "strength",
                data: {
                    content: Math.min(
                        this.setting.strength,
                        ~~equip.MaxStrengthLevel,
                    ),
                    snapshot: Math.min(
                        this.setting.strength,
                        ~~equip.MaxStrengthLevel,
                    ),
                },
            });

            // 默认插满五行石
            let embedingLength = 0;
            const embedding_data = [];
            for (const key in equip) {
                if (key.includes("_DiamondAttributeID") && equip[key]) {
                    const data = {
                        level: this.setting.embedding,
                        raw: equip[key],
                    };
                    embedding_data.push(data);
                    embedingLength++;
                }
            }

            const embedding = new Array(embedingLength).fill(
                this.setting.embedding,
            );

            this.$store.commit("Sync", {
                prop: "embedding",
                data: {
                    content: embedding,
                    snapshot: embedding_data,
                },
            });

            // 选择装备时清空大小附魔
            this.clearEquip();
            // 清空装备时，清掉洗练数据
            this.clearMagicChange();

        },
        clearEquip: function() {
            // 清空装备时，大附魔和小附魔都要去除
            // this.$store.commit("Sync", {
            //     prop: "enhance",
            //     data: {
            //         content: "",
            //         snapshot: "",
            //     },
            // });

            this.$store.commit("Sync", {
                prop: "enchant",
                data: {
                    content: "",
                    snapshot: "",
                },
            });
        },
        clearMagicChange: function() {
            // 清空装备时，清掉洗练数据
            this.$store.commit("Sync", {
                prop: "magic_change",
                data: "",
            });
        },
        // 品质筛选
        handleLevelChange: function(e, type) {
            if (type === "min") {
                const min = ~~e?.target?.value;
                const max = this.form.range[1];
                this.form.range = [min, max];
            } else {
                const min = this.form.range[0];
                const max = ~~e?.target?.value;
                this.form.range = [min, max];
            }
        },
        // 复制
        handleCopy: function() {
            const message = "已将装备名称复制到剪贴板";
            copyText(this.selectedEquip.Name, message, this);
        },
        // 获得装备列表之后本地再进行一个过滤
        // 比如传的是藏剑，需要过滤掉所有 Require{i}Type 为6，但是Require{i}Value不为传入藏剑的装备
        equipFilter: function(list) {
            return list.filter((item) => {
                const force = xf[xfid[this.mount]]?.force;
                if (!force) return true;
                for (let i = 1; i <= 6; i++) {
                    if (item[`Require${i}Type`] == 6 && item[`Require${i}Value`] != force) {
                        return false;
                    }
                }
                return true;
            });
        },
        init: function() {
            this.form.range = [
                this.$store.state.setting[this.schema_client + "_min_level"] ||
                SETTINGS[this.schema_client + "_min_level"],
                this.$store.state.setting[this.schema_client + "_max_level"] ||
                SETTINGS[this.schema_client + "_min_level"],
            ];
        },
    },
    watch: {
        equip: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val) {
                    this.selectedEquip = val;
                    this.equips = [val];
                } else {
                    this.selectedEquip = "";
                    this.equips = [];
                }
            },
        },
    },
    filters: {
        showKeyAttribute: function(attrs) {
            let _attrs = attrs.map((attr) => {
                return equip_attributes[attr];
            });
            return _attrs.join(" ");
        },
    },
    mounted() {
        this.init();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/pz.less";
</style>
