<template>
    <Wrapper>
        <div class="m-pz-common" v-loading="loading">
            <h2 class="m-pz-title">
                <i class="el-icon-search"></i> 配装大厅
                <div class="u-misc">
                    <span class="u-total">
                        共
                        <b>100w+</b>
                        <!-- <b>{{ total }}</b> -->
                        份配装方案
                    </span>
                </div>
            </h2>
            <div class="m-pz-filter">
                <div class="m-pz-xf">
                    <el-radio
                        v-for="(item, i) in xfMaps"
                        v-model="mount"
                        :label="String(item.id)"
                        :key="i"
                        @change="handleMountChange"
                        v-show="item.client.includes(client)"
                    >
                        <img class="u-pic" :src="item.id | showMountIcon" :alt="item.name" />
                        <span class="u-txt">{{ item.id ? item.name : "全部" }}</span>
                    </el-radio>
                </div>
                <div class="m-pz-search">
                    <el-input placeholder="请输入关键词" v-model="search.keyword">
                        <template slot="prepend" v-if="isPC">
                            <el-select v-model="global_level" placeholder="请选择" class="u-values u-level" size="mini">
                                <el-option
                                    v-for="global_level in global_levels"
                                    :key="global_level"
                                    :label="global_level + '级'"
                                    :value="global_level"
                                ></el-option>
                            </el-select>
                            <!-- <i class="el-icon-search"></i> 搜 索 -->
                        </template>
                        <template slot="append">
                            <el-switch
                                class="u-rec"
                                v-model="star"
                                active-color="#13ce66"
                                active-text="只看推荐"
                            ></el-switch>
                        </template>
                    </el-input>
                    <div class="m-pz-filter-tags">
                        <label class="u-label"><i class="el-icon-collection-tag"></i> 标签</label>
                        <el-checkbox-group class="u-values" v-model="search.tags">
                            <el-checkbox v-for="tag in tags" :label="tag" :key="tag">{{ tag }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div class="m-pz-filter-tags">
                        <label class="u-label"><i class="el-icon-price-tag"></i> 版本</label>
                        <el-checkbox-group class="u-values" v-model="search.zlp">
                            <el-checkbox v-for="zlp in zlps" :label="zlp" :key="zlp">{{ zlp }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div v-if="client === 'std'" class="m-pz-filter-tags">
                        <label class="u-label"><i class="el-icon-house"></i> 适用</label>
                        <el-checkbox-group class="u-values" v-model="search.adaptation">
                            <el-checkbox
                                v-for="adaptation in adaptations"
                                :label="adaptation.value"
                                :key="adaptation.value"
                                >{{ adaptation.label }}</el-checkbox
                            >
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
            <div class="m-pz-list" v-if="list && list.length">
                <el-table
                    class="m-pz-table"
                    :data="list"
                    @row-click="qkView"
                    :stripe="true"
                    row-class-name="u-row"
                    :fit="true"
                >
                    <el-table-column prop="mount" label="心法" width="180" column-key="mount">
                        <template slot-scope="scope">
                            <img class="u-xf-icon" :src="scope.row.mount | showMountIcon" :alt="scope.row.mount" />
                            <span>{{ scope.row.mount | showMountName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="配装名称">
                        <template slot="header">
                            配装名称
                            <OpenTarget />
                        </template>
                        <div class="u-name" slot-scope="scope">
                            <span :to="'/view/' + scope.row.id" target="_blank">
                                <i class="u-client" :class="scope.row.client || 'std'">{{
                                    scope.row.client == "origin" ? "缘起" : "重制"
                                }}</i>
                                <span class="u-label u-adaptation" v-if="client === 'std' && scope.row.adaptation">{{
                                    scope.row.adaptation | showAdaptation
                                }}</span>
                                <!-- <i
                                    class="u-level i-client"
                                    :class="scope.row.client || 'std'"
                                >Lv.{{ scope.row.global_level || SETTINGS[scope.row.client+'_global_level'] }}</i> -->
                                <!-- 资料片 -->
                                <span class="u-label u-zlp" v-if="scope.row.zlp">{{ scope.row.zlp }}</span>
                                <i class="u-mark" v-if="~~scope.row.star">★ 编辑推荐</i>
                                <span class="u-title">{{ scope.row.title }}</span>
                                <span class="u-desc">{{ scope.row.desc | showDesc }}</span>
                            </span>
                        </div>
                    </el-table-column>
                    <el-table-column label="作者" width="180">
                        <span slot-scope="scope" class="u-author">
                            <img class="u-author-avatar" :src="scope.row | showAvatar" alt />
                            <a
                                @click.stop
                                class="u-author-name"
                                :href="scope.row.user_id | authorLink"
                                target="_blank"
                                >{{ (scope.row.pz_author_info && scope.row.pz_author_info.display_name) || "" }}</a
                            >
                        </span>
                    </el-table-column>
                    <el-table-column prop="updated_at" label="更新时间" width="180">
                        <span slot-scope="scope" class="u-time">{{ scope.row.updated_at | formatTime }}</span>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="m-pz-pages"
                    background
                    layout="prev, pager, next,jumper"
                    :hide-on-single-page="true"
                    :page-size="per"
                    :total="total"
                    :current-page.sync="page"
                    @current-change="changePage"
                ></el-pagination>
            </div>
            <el-alert v-else class="m-pz-null" title="没有找到相关条目" type="info" center show-icon></el-alert>
        </div>
    </Wrapper>
</template>

<script>
import Wrapper from "@/components/pz/Wrapper.vue";
import xf_map from "@jx3box/jx3box-data/data/xf/xf.json";
import { getPublicPzList } from "@/service/pz/schema.js";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import OpenTarget from "@/components/pz/OpenTarget.vue";
import { tags, adaptations } from "@/assets/data/pz/query_types.json";
import { removeEmpty } from "@/utils/pz/tools.js";
import { debounce } from "lodash";
import { reportNow } from "@jx3box/jx3box-common/js/reporter";
import jx3_zlp from "@jx3box/jx3box-common/data/jx3_zlp.json";

import { std_global_level, origin_global_level, global_levels } from "@/pages/pz/setting.json";

export default {
    name: "Public",
    data() {
        return {
            loading: false,
            list: [],
            total: 0,
            page: 1,
            per: 10,

            // 搜索
            search: {
                keyword: "",
                tags: [],
                zlp: [],
                adaptation: [],
            },
            mount: "0",
            star: true,
            global_level: 120,
            global_levels: global_levels,
            isPC: window.innerWidth >= 768,

            tags,
            adaptations: adaptations.filter(item => item.value != 'both'),

            isInit: true,
        };
    },
    computed: {
        xfMaps: function () {
            const xfMaps = [];
            let common = {};
            Object.values(xf_map).forEach((value) => {
                if (!value.id) {
                    common = value;
                } else {
                    xfMaps.push(value);
                }
            });

            // 移除山居剑意
            return [common, ...xfMaps].filter((xf) => xf.id !== 10145);
        },
        client: function () {
            return this.$store.state.client || "std";
        },
        params: function () {
            let _params = {
                per: this.per,
                page: this.page,
                search: this.search.keyword,
                tags: this.search.tags.join(","),
                client: this.client,
                // valid: 1,
                global_level: this.global_level,
                zlp: this.search.zlp.join(","),
                adaptation: this.search.adaptation.join(","),
            };

            if (~~this.mount) {
                _params.mount = this.mount;
            }
            if (this.star) {
                _params.star = 1;
            }
            return removeEmpty(_params);
        },
        openInNewWindow: function () {
            return !!~~this.$store.state.open_target;
        },
        zlps() {
            return jx3_zlp[this.client];
        },
    },
    filters: {
        showAvatar: function (row) {
            return showAvatar(row?.pz_author_info?.user_avatar);
        },
        showDesc: function (str) {
            if (str) {
                return str.split("\n")[0].slice(0, 50);
            }
            return str;
        },
        showAdaptation: function (adaptation) {
            return adaptations.find((item) => item.value === adaptation)?.label || adaptation;
        },
    },
    // mounted() {
    //     if (!this.search.zlp.includes(SETTINGS.current_zlp)) {
    //         this.search.zlp.push(SETTINGS.current_zlp)
    //     }
    // },
    methods: {
        pzLink(row) {
            const prefix = this.client === "std" ? "www" : "origin";
            return `${prefix}:/pz/view/${row.id}`;
        },
        qkView: function (row, column, event) {
            reportNow({
                caller: "pz_public_click",
                data: {
                    href: this.pzLink(row),
                },
            });
            if (this.openInNewWindow) {
                window.open("/pz/view/" + row.id, "_blank");
            } else {
                this.$router.push({
                    name: "view",
                    params: {
                        id: row.id,
                    },
                });
            }
        },
        changePage: function () {
            window.scrollTo(0, 0);
        },
        loadData: function () {
            this.loading = true;
            getPublicPzList(this.params)
                .then((res) => {
                    this.list = res.data.data.list || [];
                    this.total = res.data.data.total || 0;

                    reportNow({
                        caller: "pz_public_load",
                        data: {
                            aggregate: this.list.map((item) => this.pzLink(item)),
                        },
                    });
                })
                .finally(() => {
                    this.loading = false;
                    this.isInit = false;
                });
        },
        handleMountChange: function (mount) {
            this.$router.push({
                name: this.$route.name,
                query: { mount: mount },
            });
        },
    },
    watch: {
        client: {
            immediate: true,
            handler: function (val) {
                this.global_level = val == "origin" ? origin_global_level : std_global_level;
            },
        },
        mount: function () {
            this.page = 1;
        },
        star: function () {
            this.page = 1;
        },
        // "params.tags": {
        //     deep: true,
        //     handler() {
        //         this.page = 1;
        //     },
        // },
        search: {
            deep: true,
            handler() {
                this.page = 1;
            },
        },
        params: {
            deep: true,
            immediate: true,
            handler: debounce(function () {
                if (this.$route.name == "public") {
                    this.loadData();
                }
            }, 500),
        },
        $route: {
            deep: true,
            immediate: true,
            handler() {
                if (this.$route.query?.mount) {
                    this.mount = this.$route.query?.mount;
                }
            },
        },
    },
    components: {
        OpenTarget,
        Wrapper,
    },
    activated() {
        if (!this.isInit && this.$route.name === "public") {
            this.loadData();
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/list.less";
@import "~@/assets/css/pz/public.less";
</style>
