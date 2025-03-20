<template>
    <Wrapper>
        <div class="m-pz-setting">
            <h2 class="m-pz-title"><i class="el-icon-setting"></i> 偏好设置</h2>
            <div class="m-setting-box">
                <el-form ref="form" :model="globalSetting" label-width="140px" label-position="left">
                    <el-divider content-position="left">扩展功能</el-divider>
                    <el-form-item label="是否自动保存">
                        <el-switch v-model="globalSetting.autosave" :active-value="1" :inactive-value="0"></el-switch>
                        <span class="u-tip">（2分钟自动保存一次）</span>
                    </el-form-item>
                    <el-divider content-position="left">默认设置</el-divider>
                    <el-form-item label="默认精炼等级">
                        <div class="u-setting-val">
                            <el-input-number
                                style="width: 200px"
                                v-model="globalSetting.strength"
                                :min="0"
                                :max="6"
                                size="small"
                            ></el-input-number>
                        </div>
                    </el-form-item>
                    <el-form-item label="默认镶嵌等级">
                        <div class="u-setting-val">
                            <el-input-number
                                style="width: 200px"
                                v-model="globalSetting.embedding"
                                :min="0"
                                :max="8"
                                size="small"
                            ></el-input-number>
                        </div>
                    </el-form-item>
                    <el-form-item label="筛选范围">
                        <span slot="label">
                            筛选范围
                            <span class="u-tip">(重制)</span>
                        </span>
                        <div class="u-setting-val">
                            <el-input-number
                                style="width: 160px"
                                v-model="globalSetting.std_min_level"
                                size="small"
                                :min="SETTINGS.std_level_lower_edge"
                                :max="SETTINGS.std_level_upper_edge"
                            ></el-input-number>
                            至
                            <el-input-number
                                style="width: 160px"
                                v-model="globalSetting.std_max_level"
                                size="small"
                                :min="SETTINGS.std_level_lower_edge"
                                :max="SETTINGS.std_level_upper_edge"
                            ></el-input-number>
                            <span class="u-tip">品质等级</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="筛选范围">
                        <span slot="label">
                            筛选范围
                            <span class="u-tip">(缘起)</span>
                        </span>
                        <div class="u-setting-val">
                            <el-input-number
                                style="width: 160px"
                                v-model="globalSetting.origin_min_level"
                                size="small"
                                :min="SETTINGS.origin_level_lower_edge"
                                :max="SETTINGS.origin_level_upper_edge"
                            ></el-input-number>
                            至
                            <el-input-number
                                style="width: 160px"
                                v-model="globalSetting.origin_max_level"
                                size="small"
                                :min="SETTINGS.origin_level_lower_edge"
                                :max="SETTINGS.origin_level_upper_edge"
                            ></el-input-number>
                            <span class="u-tip">品质等级</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="关注心法">
                        <div class="u-setting-val">
                            <div class="m-pz-xf u-setting-xf">
                                <el-radio v-for="(item, i) in globalSetting.star_mounts" :label="String(item)" :key="i">
                                    <img class="u-pic" :src="item | showMountIcon" :alt="item.name" />
                                </el-radio>

                                <el-popover
                                    popper-class="m-raid-members-xfbox"
                                    placement="top"
                                    trigger="click"
                                    :popper-options="{
                                        boundariesElement: 'body',
                                    }"
                                >
                                    <div class="u-xf-content">
                                        <span v-for="xf in xfMaps" :key="xf.id" @click="starMount(xf.id)">
                                            <img
                                                class="u-member-icon"
                                                :src="xf.id | showMountIcon"
                                                :alt="xf.name"
                                                :title="xf.name"
                                                :class="{
                                                    'u-selected-member-icon': globalSetting.star_mounts.includes(xf.id),
                                                }"
                                            />
                                        </span>
                                    </div>
                                    <el-button slot="reference" size="mini" type="primary" icon="el-icon-star-on"
                                        >选择心法<span class="u-star-mount">{{ star_mounts_count }}/3</span></el-button
                                    >
                                </el-popover>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="快捷按键">
                        <el-switch
                            v-model="globalSetting.key_shortcut"
                            :active-value="1"
                            :inactive-value="0"
                        ></el-switch>
                        <span class="u-tip">（可以使用 Ctrl + Alt + E 快捷获取数据版）</span>
                    </el-form-item>
                    <el-form-item label-width="0">
                        <el-button type="primary" :loading="processing" @click="submit()" class="u-btn">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </Wrapper>
</template>

<script>
import Wrapper from "@/components/pz/Wrapper.vue";
import { getGlobalSetting, saveGlobalSetting } from "@/service/pz/schema";
import SETTINGS from "@/pages/pz/setting.json";
import xf_map from "@jx3box/jx3box-data/data/xf/xf.json";
import { cloneDeep, pickBy } from "lodash";

const defaultSetting = {
    autosave: 0,
    strength: 6,
    embedding: 6,
    std_min_level: SETTINGS.std_min_level,
    std_max_level: SETTINGS.std_max_level,
    origin_min_level: SETTINGS.origin_min_level,
    origin_max_level: SETTINGS.origin_max_level,
    star_mounts: [],
    key_shortcut: 0,
};

export default {
    name: "Setting",
    props: [],
    components: {
        Wrapper,
    },
    data: function () {
        return {
            globalSetting: cloneDeep(defaultSetting),
            processing: false,
            SETTINGS,
            sync: false,
            xf_map,
        };
    },
    computed: {
        isLogin: function () {
            return this.$store.state.is_login;
        },
        xfMaps: function () {
            const xfMaps = [];
            Object.values(xf_map).forEach((value) => {
                if (value.id) {
                    xfMaps.push(value);
                }
            });

            // 移除山居剑意
            return xfMaps.filter((xf) => xf.id !== 10145);
        },
        star_mounts_count: function () {
            return this.globalSetting.star_mounts.length || 0;
        },
    },
    methods: {
        submit: function (mute = false) {
            this.processing = true;
            return saveGlobalSetting(this.globalSetting)
                .then(() => {
                    this.$store.commit("SET_STATE", {
                        key: "setting",
                        value: this.globalSetting,
                    });
                    sessionStorage.setItem("pz_setting", JSON.stringify(this.globalSetting));
                    if (!mute) {
                        this.$notify.success({
                            title: "成功",
                            message: "全局设置保存成功",
                        });
                    }
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        init: function () {
            // 不同窗口或同时异地修改
            this.isLogin &&
                getGlobalSetting().then((res) => {
                    const setting = res.data.data;

                    // 处理缺省值
                    this.globalSetting = {
                        ...cloneDeep(defaultSetting),
                        ...pickBy(setting, (value, key) => value !== null && defaultSetting[key] !== undefined),
                    };

                    if (!this.globalSetting.star_mounts) this.globalSetting.star_mounts = [];

                    this.$store.commit("SET_STATE", {
                        key: "setting",
                        value: setting,
                    });
                    sessionStorage.setItem("pz_setting", JSON.stringify(setting));

                    if (!this.sync) this.checkSetting(this.globalSetting);
                });
        },
        checkSetting(setting) {
            /* 如果用户配置的最小值低于SETTINGS中的最小值 ||
               用户配置中的最大值低于SETTINGS中的最小值
               => 更新用户配置 */
            if (
                setting["std_min_level"] < SETTINGS["std_min_level"] ||
                setting["std_max_level"] < SETTINGS["std_min_level"]
            ) {
                this.globalSetting["std_min_level"] = SETTINGS["std_min_level"];
                this.globalSetting["std_max_level"] = SETTINGS["std_max_level"];
            }

            if (
                setting["origin_min_level"] < SETTINGS["origin_min_level"] ||
                setting["origin_max_level"] < SETTINGS["origin_min_level"]
            ) {
                this.globalSetting["origin_min_level"] = SETTINGS["origin_min_level"];
                this.globalSetting["origin_max_level"] = SETTINGS["origin_max_level"];
            }
            this.submit(true).then(() => {
                this.sync = true;
                sessionStorage.setItem("pz_setting_sync", 1);
            });
        },
        starMount(xfId) {
            let { star_mounts } = this.globalSetting;

            if (star_mounts.includes(xfId)) {
                const index = star_mounts.findIndex((item) => item === xfId);

                star_mounts.splice(index, 1);
            } else {
                if (star_mounts.length < 3) {
                    star_mounts.unshift(xfId);
                }
            }
        },
    },
    filters: {},
    created: function () {
        this.sync = !!~~sessionStorage.getItem("pz_setting_sync");
    },
    mounted: function () {
        this.init();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/setting.less";
@import "~@/assets/css/pz/list.less";
</style>
