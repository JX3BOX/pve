<template>
    <Wrapper>
        <div class="v-compare">
            <h2 class="m-pz-title m-compare-title">
                <i class="el-icon-s-operation"></i> 配装对比
                <el-button
                    class="u-reset"
                    plain
                    size="small"
                    icon="el-icon-refresh-left"
                    @click="reset"
                    >重置</el-button
                >
            </h2>
            <div class="m-compare-box">
                <div class="m-compare-header">
                    <div class="u-number u-block">
                        <span class="u-label">对比数量</span>
                        <el-input-number
                            v-model="num"
                            :min="2"
                            :max="5"
                        ></el-input-number>
                    </div>
                    <div class="u-schemas u-block">
                        <span class="u-label">选择方案</span>
                        <el-select
                            class="u-type"
                            v-model="type"
                            placeholder="请选择"
                        >
                            <el-option label="我的方案" value="mine"
                                >我的方案</el-option
                            >
                            <el-option label="公共方案" value="public"
                                >公共方案</el-option
                            >
                        </el-select>
                        <el-select
                            class="u-schema"
                            v-model="schema"
                            placeholder="请输入关键词"
                            filterable
                            clearable
                            remote
                            reserve-keyword
                            :remote-method="loadData"
                            :loading="loading"
                            popper-class="u-schema-pop"
                            value-key="id"
                        >
                            <template slot="prefix">
                                <i class="el-icon-search"></i>
                            </template>
                            <el-option
                                v-for="item in list"
                                :key="item.id"
                                :label="item.title"
                                :value="item"
                            >
                                <div class="u-item">
                                    <img
                                        class="u-mount-icon"
                                        :src="item.mount | showMountIcon"
                                    />
                                    <span class="u-title">{{
                                        item.title
                                    }}</span>
                                    <span class="u-score" v-if="type === 'mine'"
                                        >装分：{{
                                            (item.overview &&
                                                item.overview.score) ||
                                            "-"
                                        }}</span
                                    >
                                    <span
                                        class="u-author"
                                        v-if="type === 'public'"
                                    >
                                        <img
                                            class="u-author-avatar"
                                            :src="
                                                item.pz_author_info.user_avatar
                                                    | showAvatar
                                            "
                                            alt=""
                                        />
                                        <span class="u-author-name">{{
                                            item.pz_author_info.display_name
                                        }}</span>
                                    </span>
                                </div>
                            </el-option>
                        </el-select>
                        <el-button
                            class="u-btn"
                            type="primary"
                            icon="el-icon-plus"
                            @click="addSchema"
                            >加入</el-button
                        >
                    </div>
                </div>
                <div class="m-compare-body" v-if="data.length">
                    <div
                        class="u-schema"
                        v-for="(item, index) in data"
                        :key="item.id"
                    >
                        <h5 class="u-title">
                            <img
                                :src="item.mount | showMountIcon"
                                class="u-icon"
                            />
                            <a
                                :href="item.id | getPzLink"
                                class="u-name"
                                target="_blank"
                                >{{ item.title }}</a
                            >
                        </h5>
                        <div class="u-attrs">
                            <div class="u-attr" v-if="item.overview.score">
                                <span class="u-label"> 装分 </span>
                                <span class="u-value">
                                    {{ item.overview.score }}
                                </span>
                            </div>
                            <template v-for="attr in sortedCompareAttrs">
                                <div
                                    v-if="item.overview.attrs[attr]"
                                    class="u-attr"
                                    :key="attr + item.id"
                                    @mouseenter="handleHover(attr)"
                                    @mouseleave="current = ''"
                                    :class="{ active: current === attr }"
                                >
                                    <span class="u-label">
                                        {{ showAttrName(attr, item.mount) }}
                                    </span>
                                    <span
                                        class="u-value"
                                        :class="[
                                            compare_cls(
                                                attr,
                                                item.overview.attrs[attr]
                                            ),
                                            {
                                                'u-value-active': !index,
                                            },
                                        ]"
                                        >{{
                                            showVal(
                                                attr,
                                                item.overview.attrs[attr]
                                            )
                                        }}</span
                                    >
                                    <span
                                        class="u-raw"
                                        v-if="isPercent(attr)"
                                        >{{
                                            showRaw(attr, item.overview.attrs)
                                        }}</span
                                    >
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <el-alert
                    v-else
                    class="m-compare-null"
                    title="请选择加入你要对比的配装方案"
                    type="info"
                    center
                    show-icon
                ></el-alert>
            </div>
        </div>
    </Wrapper>
</template>

<script>
import Wrapper from "@/components/pz/Wrapper.vue";
import { getMyPzList, getPublicPzList, getPz } from "@/service/pz/schema";
import {
    compareAttrs,
    sortedCompareAttrs,
} from "@/assets/data/pz/overview_display";
import { xf_primary_attributes } from "@/assets/data/pz/equip_settings";
import { getLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Compare",
    props: [],
    components: {
        Wrapper,
    },
    data: function () {
        return {
            num: 2,
            type: "mine",
            schema: "",

            loading: false,
            list: [],

            raw: [],
            // sortedCompareAttrs,
            xf_primary_attributes,

            current: "",
        };
    },
    computed: {
        data: function () {
            return this.raw.filter((item) => {
                return item && Object.keys(item).length;
            });
        },
        avgs: function () {
            let avgs = this.data[0]?.["overview"]?.["attrs"];
            return avgs;
        },
        isFull: function () {
            return this.data.length >= this.num;
        },
        isLogin: function () {
            return this.$store.state.is_login;
        },
        sortedCompareAttrs: function ({ data }){
            const client = data[0].client
            return sortedCompareAttrs[client]
        }
    },
    watch: {
        type: function () {
            this.loadData();
        },
    },
    methods: {
        // 加载配装方案
        loadData: function (query = "") {
            const params = {
                search: query,
                page: 1,
            };
            if (this.type === "mine") {
                this.loading = true;
                getMyPzList(params)
                    .then((res) => {
                        this.list = res.data.data.list;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                this.loading = true;
                getPublicPzList(params)
                    .then((res) => {
                        this.list = res.data.data.list;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        // 重置
        reset: function () {
            this.raw = [];
        },
        // 工具函数
        compare_cls: function (attr, value) {
            let diff = value - this.avgs[attr];
            if (diff > 0) {
                return "isDown";
            } else if (diff < 0) {
                return "isUp";
            }
        },
        async addSchema() {
            const res = await getPz(this.schema?.id)
            const schema = res.data.data

            if (!schema.overview) {
                this.$alert(
                    "该配装方案为测试期间方案，需要对该配装方案重新保存一次方可使用本功能。",
                    "提醒",
                    {
                        confirmButtonText: "确定",
                    }
                );
                return;
            }

            if (this.isFull) {
                this.$alert(
                    "当前已达到配装对比数目上限，请调整上限数量",
                    "提醒",
                    {
                        confirmButtonText: "确定",
                    }
                );
                return;
            }

            const ids = this.raw.map((item) => item.id);
            if (!ids.includes(schema.id)) {
                if (this.raw.length < this.num) {
                    this.raw.push(schema);
                    this.$notify({
                        title: "成功",
                        message: "导入成功",
                        type: "success",
                        duration: 500,
                    });
                }
            }
        },
        isPercent: function (attr) {
            return attr.includes("Percent");
        },
        showAttrName: function (val, mount) {
            if (val === "primary") {
                return xf_primary_attributes[mount];
            }
            return compareAttrs[val] || val;
        },
        showVal: function (key, val) {
            if (key.endsWith("Percent")) {
                return (val * 100).toFixed(2) + "%";
            }
            return val;
        },
        showRaw: function (key, attrs) {
            const _key = key.replace("Percent", "");
            return attrs[_key];
        },
        formatAttrs: function (item) {
            return Object.keys(item).sort((a, b) => a - b);
        },
        handleHover: function (attr) {
            this.current = attr;
        },
        // 初始化
        init: function () {
            this.isLogin && this.loadData();
        },
    },
    filters: {
        getPzLink: function (val) {
            return getLink("pz", val);
        },
    },
    created: function () {},
    mounted: function () {
        this.init();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/compare.less";
</style>
