<template>
    <Wrapper>
        <div class="m-pz-mine" v-loading="loading">
            <h2 class="m-pz-title">
                <i class="el-icon-box"></i> 我的配装
                <div class="u-misc">
                    <span class="u-total">
                        共
                        <b>{{ total }}</b
                        >份配装方案
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
                    >
                        <img class="u-pic" :src="item.id | showMountIcon" :alt="item.name" />
                        <span class="u-txt">
                            {{ item.id ? item.name : "全部" }}
                        </span>
                    </el-radio>
                </div>
                <div class="m-pz-search">
                    <el-input placeholder="请输入关键词" v-model="search">
                        <template slot="prepend"> <i class="el-icon-search"></i> 搜 索 </template>
                        <el-button slot="append" icon="el-icon-s-promotion" v-if="isPC"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="m-pz-list" v-if="list && list.length">
                <el-table
                    class="m-pz-table"
                    ref="filterTable"
                    :data="list"
                    @row-click="qkEdit"
                    :stripe="true"
                    row-class-name="u-row"
                    :fit="true"
                >
                    <el-table-column prop="mount" label="心法" width="160" column-key="mount">
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
                            <span :to="'/edit/' + scope.row.id" target="_blank">
                                <i class="u-client" :class="scope.row.client || 'std'">{{
                                    scope.row.client == "origin" ? "缘起" : "重制"
                                }}</i>

                                <span class="u-label u-adaptation" v-if="scope.row.client === 'std' && scope.row.adaptation">{{
                                    scope.row.adaptation | showAdaptation
                                }}</span>
                                <i v-if="scope.row.client" class="u-client u-level" :class="scope.row.client || 'std'"
                                    >Lv.{{ scope.row.global_level }}</i
                                >
                                <!-- 资料片 -->
                                <span class="u-label u-zlp" v-if="scope.row.zlp">{{ scope.row.zlp }}</span>
                                <i class="u-top" v-if="scope.row.sticky"><i class="el-icon-top"></i>置顶</i>
                                <i class="u-mark" v-if="~~scope.row.star">★ 编辑推荐</i>
                                <i class="u-sticky" v-if="~~scope.row.sticky_time"
                                    ><i class="el-icon-download"></i> 置顶</i
                                >
                                <span class="u-title">{{ scope.row.title }}</span>
                                <span class="u-desc">{{ scope.row.desc | showDesc }}</span>
                            </span>
                        </div>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" width="160">
                        <template slot-scope="scope">
                            <span class="u-status" :class="scope.row.status ? 'private' : 'public'">
                                <template v-if="scope.row.status"> <i class="el-icon-lock"></i> 私有 </template>
                                <template v-else> <i class="el-icon-unlock"></i> 公开 </template>
                                <img
                                    class="u-lock"
                                    v-if="scope.row.is_locked"
                                    title="冻结"
                                    svg-inline
                                    src="@/assets/img/pz/common/snowflake1.svg"
                                />
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="op" label="操作" width="210">
                        <template slot-scope="scope">
                            <!-- <el-button
                                class="u-btn u-btn-view"
                                type="text"
                                @click.stop="handleView(scope.row.id)"
                                size="mini"
                                icon="el-icon-link"
                            >查看</el-button>-->
                            <el-button
                                class="u-btn u-btn-edit"
                                type="text"
                                @click.stop="handleEdit(scope.row.id)"
                                size="mini"
                                icon="el-icon-edit-outline"
                                >编辑</el-button
                            >
                            <el-button
                                class="u-btn u-btn-delete"
                                type="text"
                                @click.stop="handleDelete(scope.row, scope.$index)"
                                size="mini"
                                icon="el-icon-delete"
                                >删除</el-button
                            >
                            <el-button
                                class="u-btn u-btn-delete"
                                type="text"
                                @click.stop="handleStick(scope.row)"
                                size="mini"
                                :icon="scope.row.sticky_time ? 'el-icon-bottom' : 'el-icon-top'"
                                >{{ scope.row.sticky_time ? "取消置顶" : "置顶" }}</el-button
                            >
                        </template>
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
import { getMyPzList, removePz, setSticky } from "@/service/pz/schema.js";
import OpenTarget from "@/components/pz/OpenTarget.vue";
import { removeEmpty } from "@/utils/pz/tools.js";
import { adaptations } from "@/assets/data/pz/query_types.json";
export default {
    name: "Mine",
    data() {
        return {
            loading: false,
            list: [],
            total: 0,
            page: 1,
            per: 10,

            // 搜索
            search: "",
            mount: "0",
            isPC: window.innerWidth >= 768,
            adaptations,
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client || "std";
        },
        settings: function () {
            return this.$store.state.setting;
        },
        xfMaps: function () {
            let xfMaps = [];
            let common = {};
            Object.values(xf_map).forEach((value) => {
                if (!value.id) {
                    common = value;
                } else {
                    xfMaps.push(value);
                }
            });

            let tmpMount = [];

            if (this.settings.star_mounts?.length) {
                this.settings.star_mounts.forEach((item) => {
                    let index = xfMaps.findIndex((xf) => xf.id === item);
                    let mount = xfMaps.splice(index, 1);

                    tmpMount = [...tmpMount, ...mount];
                });
            }

            xfMaps = [...tmpMount, ...xfMaps];

            // 移除山居剑意
            return [common, ...xfMaps].filter((xf) => xf.id !== 10145);
        },
        params: function () {
            let _params = {
                per: this.per,
                page: this.page,
                search: this.search,
                sticky: 1, // 置顶
            };

            if (~~this.mount) {
                _params.mount = this.mount;
            }
            return removeEmpty(_params);
        },
        openInNewWindow: function () {
            return !!~~this.$store.state.open_target;
        },
        isLogin: function () {
            return this.$store.state.is_login;
        },
    },
    methods: {
        handleView: function (id) {
            this.$router.push({
                name: "view",
                params: {
                    id: id,
                },
            });
        },
        handleEdit: function (id) {
            this.$router.push({
                name: "edit",
                params: {
                    id: id,
                },
            });
        },
        qkEdit: function (row, column, event) {
            if (this.openInNewWindow) {
                window.open("/pz/edit/" + row.id, "_blank");
            } else {
                this.$router.push({
                    name: "edit",
                    params: {
                        id: row.id,
                    },
                });
            }
        },
        handleDelete: function (row, i) {
            this.$confirm(`确认删除"${row.title}"方案？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        instance.confirmButtonLoading = true;
                        removePz(row.id)
                            .then(() => {
                                done();
                                this.list.splice(i, 1);
                                this.$notify({
                                    title: "成功",
                                    message: "方案删除成功",
                                    type: "success",
                                });
                            })
                            .finally(() => {
                                instance.confirmButtonLoading = false;
                            });
                    } else {
                        done();
                    }
                },
            });
        },
        changePage: function () {
            window.scrollTo(0, 0);
        },
        loadData: function () {
            this.loading = true;
            getMyPzList(this.params)
                .then((res) => {
                    this.list = res.data.data.list || [];
                    this.total = res.data.data.total || 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleMountChange: function (mount) {
            this.$router.push({
                name: this.$route.name,
                query: { mount: mount },
            });
        },
        handleStick: function (row) {
            const data = {
                sticky: row.sticky_time ? 0 : 1,
            };

            setSticky(row.id, data).then(() => {
                if (this.page === 1) this.loadData();
                else this.page = 1;
            });
        },
    },
    watch: {
        mount: function () {
            this.page = 1;
        },
        params: {
            // immediate: true,
            deep: true,
            handler: function () {
                this.isLogin && this.$route.name === "mine" && this.loadData();
            },
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
    filters: {
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
    components: {
        OpenTarget,
        Wrapper,
    },
    activated() {
        this.isLogin && this.$route.name === "mine" && this.loadData();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/list.less";
@import "~@/assets/css/pz/mine.less";
</style>
