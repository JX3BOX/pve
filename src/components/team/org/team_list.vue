<template>
    <div class="m-team-list" v-loading="loading" :class="{ isIndex }">
        <div class="m-team-list-header">
            <div class="m-filter">
                <el-input
                    class="u-name u-filter"
                    v-model="name"
                    placeholder="查找团队"
                    size="large"
                    @change="searchTeam"
                    style="width: 100%"
                >
                    <i class="el-icon-search" slot="prefix" @click="loadData"></i>
                </el-input>
            </div>
            <div class="m-filter__sub">
                <el-select
                    class="u-server u-select u-filter"
                    v-model="server"
                    placeholder="选择服务器"
                    size="small"
                    filterable
                    @change="changeServer"
                >
                    <el-option key="all" label="全部服务器" value></el-option>
                    <el-option v-for="item in serversWithClient" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <template v-if="!isIndex">
                    <el-switch  class="u-isVerified u-filter" v-model="isVerified" active-color="#0366d6" inactive-color="#ddd" active-text="只看认证"> </el-switch>
                    <el-checkbox-group v-model="tag">
                        <el-checkbox v-for="item in tags" :key="item" :label="item" :value="item"></el-checkbox>
                    </el-checkbox-group>
                </template>
                <router-link
                    class="u-more el-button el-button--primary is-plain el-button--mini"
                    to="/org/list"
                    v-if="isIndex"
                    >查看更多&raquo;</router-link
                >
            </div>
        </div>
        <div class="u-list" v-if="data && data.length">
            <router-link class="u-item" :to="'/org/' + item.ID" v-for="(item, i) in data" :key="i" target="_blank">
                <span class="u-pic">
                    <img :src="item.logo | showLogo" v-if="item.logo" />
                    <img src="@/assets/img/team/team_logo_null.svg" v-else />
                </span>
                <span class="u-name">
                    {{ item.name }}
                    <i class="u-status" v-if="item.status == 1" title="已认证">
                        <img svg-inline src="@/assets/img/team/verify.svg" />
                    </i>
                    <span class="u-medals">
                        <img
                            class="u-medal-icon"
                            :src="medal.icon | showTeamMedal"
                            v-for="(medal, x) in item.medals"
                            :key="x"
                            :title="medal.name"
                        />
                    </span>
                </span>
                <span class="u-meta">
                    <span class="u-server">
                        <em>服务器</em>
                        {{ item.server }}
                    </span>
                    <span class="u-server">
                        <em>团长</em>
                        <a class="u-super" :href="authorLink(item.super)" target="_blank">
                            <img
                                class="u-user-avatar"
                                :src="showAvatar(item.super_user_info && item.super_user_info.avatar)"
                            />
                            {{ item.super_user_info && item.super_user_info.display_name }}
                        </a>
                    </span>
                </span>
                <span class="u-recruit">
                    {{ item.recruit || item.desc }}
                </span>
                <span class="u-tag" v-if="item.tags && item.tags.length">
                    <span class="u-tag-list">
                        <span
                            class="u-tag-item"
                            :class="{ love: tag == '可教学' }"
                            v-for="(tag, i) in item.tags"
                            :key="i"
                            >{{ tag }}</span
                        >
                    </span>
                </span>
            </router-link>
        </div>
        <el-alert v-else class="m-team-list-null" title="没有找到相关条目" type="info" center show-icon></el-alert>
        <el-pagination
            v-if="!isIndex"
            class="m-team-list-pages"
            background
            layout="total, prev, pager, next,jumper"
            :hide-on-single-page="true"
            :page-size="per"
            :total="total"
            :current-page.sync="page"
            @current-change="changePage"
        ></el-pagination>
    </div>
</template>

<script>
import servers from "@jx3box/jx3box-data/data/server/server_list.json";
import serverMap from "@jx3box/jx3box-data/data/server/server_map.json";
import server_std from "@jx3box/jx3box-data/data/server/server_std.json";
import server_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import tags from "@/assets/data/team/tags.json";
import { getThumbnail, showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
import { __ossMirror, __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { getTeams } from "@/service/team/team.js";
export default {
    name: "TeamList",
    props: ["limit", "isIndex"],
    components: {},
    data: function () {
        return {
            per: this.limit || 10,
            page: 1,
            total: 1,
            pages: 1,
            data: [
                {
                    ID: 13,
                    status: 1,
                    super: 6314,
                    admin: "",
                    server: "服务器名",
                    name: "团队名字",
                    desc: "",
                    logo: "",
                    recruit: "招2个七秀",
                    found: "",
                    time: "",
                    contact: "",
                    tv: "",
                    created_at: "2020-10-06T16:29:17+08:00",
                    updated_at: "2020-10-06T16:29:17+08:00",
                    deleted_at: "0001-01-01T00:00:00Z",
                    medals: [
                        {
                            icon: "dmd",
                            name: "达摩洞百强团队",
                        },
                    ],
                    tags: ["可教学", "固定团"],
                },
            ],
            loading: false,
            name: "",
            server: "",
            servers,
            isVerified: false,
            tags,
            tag: [],
        };
    },
    computed: {
        params: function () {
            let params = {
                pageIndex: this.page,
                pageSize: this.per,
                // recruit: 1,
                server: this.server,
                name: this.name,
                tag: this.tag && this.tag.length ? this.tag.join(",") : "",
                client: this.client,
            };
            if (this.isVerified) {
                params.status = 1;
            }
            return params;
        },
        client: function () {
            return this.$store.state.client;
        },
        serversWithClient: function () {
            return this.client == "std" ? server_std : server_origin;
        },
    },
    methods: {
        showAvatar,
        authorLink,
        loadData: function () {
            this.loading = true;
            getTeams(this.params)
                .then((res) => {
                    this.total = res.data.data.page.total;
                    this.pages = res.data.data.page.pageTotal;
                    this.data = res.data.data.list || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changePage: function () {
            this.$emit("changePage", this.page);
        },
        changeServer: function () {
            this.page = 1;
        },
        searchTeam: function () {},
    },
    watch: {
        params: function (newparams) {
            this.loadData();
        },
    },
    filters: {
        showLogo: function (val) {
            return getThumbnail(val, 204, true);
        },
        showTeamMedal: function (val) {
            return __imgPath + "image/medals/team/" + val + ".gif";
        },
    },
    created: function () {},
    mounted: function () {
        this.loadData();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/team/org/team_list.less";
</style>
