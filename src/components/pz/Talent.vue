<template>
    <Fold class="m-pz-talent" :title="talentLabel" icon="el-icon-sunrise" :defaultValue="true">
        <div class="m-pz-talent-box">
            <a
                class="u-link-talent el-button el-button--primary is-plain el-button--mini"
                :href="talentLink"
                target="_blank"
            >
                前往{{ talentLabel }}模拟器
                <i class="el-icon-arrow-right"></i>
            </a>
            <span class="u-tip">（如需修改，请前往模拟器创建预设方案并选择即可。）</span>
            <template v-if="talentOptions && talentOptions.length">
                <el-select
                    class="u-preset m-pz-talent-select"
                    v-model="talent"
                    value-key="id"
                    placeholder="请选择一个预设方案（可搜索）"
                    clearable
                    filterable
                    reserve-keyword
                >
                    <el-option
                        v-for="item in talentOptions"
                        :key="item.id"
                        :label="item.name || item.title"
                        :value="item"
                    >
                        <div class="m-pz-talent-select-item">
                            <span>{{ item.name || item.title }}</span>
                            <small class="u-version">（版本号：{{ item.version }}）</small>
                        </div>
                    </el-option>
                </el-select>
            </template>
            <el-alert type="info" show-icon v-else>
                <span slot="title">
                    当前还没有定义任何预设方案，
                    <a :href="talentLink" target="_blank">点击创建</a>
                </span>
            </el-alert>
            <div class="m-talent-preview" :class="{ 'is-talent2': schema_client === 'origin' }" v-show="talent_id">
                <div class="m-talent-box qx-container" v-show="schema_client == 'std'"></div>
                <div class="m-talent2-box" v-show="schema_client === 'origin'">
                    <iframe class="m-talent2-container" v-if="talent2_url" :src="talent2_url" frameborder="0"></iframe>
                </div>
            </div>
        </div>
    </Fold>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { mapGetters } from "vuex";
import Fold from "@/components/pz/Fold.vue";

// 奇穴
import JX3_QIXUE from "@jx3box/jx3box-talent";
import "@jx3box/jx3box-talent/talent.css";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import { Base64 } from "js-base64";

import { getUserTalents, getDefaultTalent } from "@/service/pz/talent.js";
import { __Domain, __Origin, __ossRoot } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "Talent",
    props: ["webview"],
    components: {},
    data: function () {
        return {
            isLogin: User.isLogin(),

            // 奇穴
            talentDriver: null,

            // 天赋数据
            talent: "",
            talent_id: "",
            talent_pzcode: [],
            talent_code: "",
            talent2_url: "",

            // 天赋选项
            talentOptions: [],
            ready: false,
        };
    },
    computed: {
        ...mapGetters(["schema", "schema_client", "mount"]),
        data: function () {
            return this.$store.state.schema;
        },
        author_id: function () {
            return this.data.user_id;
        },
        isAuthor: function () {
            return User.getInfo().uid == this.data.user_id;
        },
        isEditMode: function () {
            return this.$route.name == "edit" && this.isAuthor;
        },
        mountNameForTalent: function () {
            return ~~this.mount ? xfid[this.mount] : "其它";
        },
        talentLink: function () {
            return this.schema_client == "std" ? "/macro/talent" : "/macro/talent2";
        },
        talentType: function () {
            return this.schema_client == "std" ? "talent" : "talent2";
        },
        talentLabel: function () {
            return this.schema_client == "std" ? "奇穴" : "镇派";
        },
    },
    watch: {
        data: {
            deep: true,
            immediate: true,
            handler: function (data) {
                // 根据schema更新本地数据（前端显示绑定相关）、确保异步加载完成
                // 已存在有效设定数据
                if (data && data?.talent_id) {
                    this.talent = {
                        id: data.talent_id,
                        code: data.talent_code,
                        pzcode: data.talent_pzcode,
                    };
                }
            },
        },
        talentOptions: {
            deep: true,
            handler: function (val) {
                // 如果没有数据，则设置默认
                if (!val.length) return;
                if (!this.talent_id) {
                    let data = this.talentOptions[0];
                    this.talent = {
                        id: data.id,
                        code: data.code,
                        pzcode: data.pzcode,
                    };
                }
            },
        },
        talent: {
            deep: true,
            immediate: true,
            handler: function (item) {
                if (!item) return;
                // 本地进行了切换时，反向推送给schema
                this.talent_id = item.id;
                this.$store.commit("SET_SCHEMA", {
                    key: "talent_id",
                    value: item.id,
                });

                this.talent_pzcode = item.pzcode;
                this.$store.commit("SET_SCHEMA", {
                    key: "talent_pzcode",
                    value: item.pzcode,
                });

                this.talent_code = item.code;
                this.$store.commit("SET_SCHEMA", {
                    key: "talent_code",
                    value: item.code,
                });
            },
        },
        talent_code: {
            deep: true,
            immediate: true,
            handler: function (code) {
                // 不管是变更还是加载，当有新的有效编码时，重载模拟器
                if (code) {
                    this.reloadTalent();
                }
            },
        },
    },
    methods: {
        // 初始化奇穴模拟器（此时渲染使用空奇穴模板）
        installTalent: function (code) {
            this.talentDriver = new JX3_QIXUE({
                client: "std",
            });
        },
        // 重载模拟器
        reloadTalent: function () {
            // 此时仅有存在有效编码才会重载，此处无需再次作有效判断
            if (this.schema_client === "origin") {
                this.renderTalent2(this.talent_code);
            } else {
                this.renderTalent(this.talent_code);
            }
        },
        // 重加载镇派模拟器窗口
        renderTalent2: function (code) {
            const _encode = Base64.encode(JSON.stringify(code));
            if (this.webview) {
                this.talent2_url = `${__ossRoot}static/jx3box-talent2/index.html?webview=true&code=${_encode}`;
            } else {
                this.talent2_url = `${__ossRoot}static/jx3box-talent2/index.html?code=${_encode}`;
            }
        },
        // 重渲染奇穴模拟器
        renderTalent: function (code) {;
            this.$nextTick(() => {
                this.talentDriver?.then((ins) => {
                    ins.load({
                        ...code,
                        client: code?.client || "std"
                    });
                });
            });
        },
        getUserTalentsData: function (schema_client, talentType, mount) {
            return getUserTalents({
                client: schema_client,
                type: talentType,
                mount: mount,
                _all: 1,
            });
        },
        // 加载用户所拥有的全部预设
        loadUserPreset: function () {
            let mount = this.mount == "10144" ? "10144,10145" : this.mount;
            return this.getUserTalentsData(this.schema_client, this.talentType, mount).then((res) => {
                this.talentOptions = res.data.data || [];
                if (this.talentOptions.length) {
                    this.ready = true;
                } else {
                    // 如果用户该心法还没有任何预设，自动为其创建保底的一套
                    this.loadDefault();
                }
            });
        },
        loadDefault() {
            getDefaultTalent(this.mount, this.schema_client).then((res) => {
                let data = res.data?.data;
                if (data) {
                    let code = JSON.parse(data.code);
                    let pzcode = JSON.parse(data.pzcode);
                    data = {
                        ...data,
                        code: code,
                        pzcode: pzcode,
                        version: code.version,
                    };
                    this.talentOptions = [data];
                    this.talent = data;
                } else {
                    this.talentOptions = [];
                }
            });
        },
        // 初始化
        init: function () {
            // 奇穴模拟器本地初始化
            if (this.schema_client == "std") this.installTalent();
            // 总是预载用户全部预设
            if (!this.ready) {
                this.loadUserPreset();
            }
        },
    },
    mounted: function () {
        this.init();
    },
    components: {
        Fold,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/talent.less";
</style>
