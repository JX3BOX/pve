<template>
    <div class="v-detail p-pkg-detail" v-loading="loading">
        <div class="m-detail-wrapper">
            <div class="m-detail">
                <div class="m-detail-header">
                    <Avatar
                        class="u-avatar"
                        :uid="pkg.user_id"
                        :frame="getUserMeta('user_avatar_frame')"
                        :url="getUserMeta('user_avatar')"
                        size="xs"
                    ></Avatar>
                    <span class="u-name">{{ pkg.title }}</span>
                    <span class="u-status" v-if="pkg.status"> <i class="el-icon-lock"></i> 私有 </span>
                    <div class="u-op">
                        <el-button plain class="u-back" icon="el-icon-caret-left" size="mini" @click="goBack">
                            后退
                        </el-button>
                        <template v-if="isAuthor || isMine">
                            <el-button
                                class="u-edit"
                                type="warning"
                                icon="el-icon-edit-outline"
                                size="mini"
                                @click="editPkg"
                                >编辑</el-button
                            >
                            <el-button class="u-delete" type="info" icon="el-icon-delete" size="mini" @click="deletePkg"
                                >删除</el-button
                            >
                        </template>
                    </div>
                </div>
                <div class="m-detail-meta">
                    <span class="u-meta u-type u-id">
                        <i class="u-type-label">{{ showType }}</i>
                        <i class="u-type-value" @click="copy(pkg.key)">
                            {{ pkg.key }}
                            <i class="el-icon-document-copy u-copy"></i>
                        </i>
                    </span>
                    <span class="u-meta u-type u-id u-version">
                        <i class="u-type-label">UUID</i>
                        <i class="u-type-value" @click="copy(getRecordMeta('uuid'))">
                            {{ getRecordMeta("uuid") || "-" }}
                            <i class="el-icon-document-copy u-copy"></i>
                        </i>
                    </span>
                    <span class="u-meta">
                        <span class="u-label">客户端</span>
                        <span class="u-value u-client i-client" :class="'i-client-' + pkg.client">{{
                            showClient
                        }}</span>
                    </span>
                    <span class="u-meta" v-if="pkg.client == 'std'">
                        <span class="u-label">语言</span>
                        <span class="u-value">
                            <b>{{ showLang }}</b>
                        </span>
                    </span>
                    <span class="u-meta">
                        <span class="u-label">数据模式</span>
                        <span class="u-value">
                            <b>{{ showMode }}</b>
                        </span>
                    </span>
                    <!-- <span class="u-meta">
                        <span class="u-label">标签</span>
                        <span class="u-value u-tags">
                            <router-link
                                class="u-tag"
                                v-for="tag in pkg.pkg_tag"
                                :key="tag"
                                :to="{ name: 'pkg_list', query: { tag: tag } }"
                                target="_blank"
                                >{{ tag }}</router-link
                            >
                        </span>
                    </span> -->
                </div>
                <div class="m-detail-meta">
                    <span class="u-meta" v-if="pkg.is_jx3box">
                        <span class="u-star u-mark"
                            ><i class="el-icon-cpu"></i> <span class="u-tiny-text">官方</span></span
                        >
                    </span>
                    <span class="u-meta" v-if="pkg.user">
                        <span class="u-label">作者</span>
                        <span class="u-value">
                            <a :href="authorLink(pkg.user_id)" target="_blank">
                                <i class="el-icon-link"></i>
                                {{ pkg.user.display_name || "佚名" }}
                            </a>
                        </span>
                    </span>
                    <span class="u-meta">
                        <span class="u-label">创建日期</span>
                        <span class="u-value">{{ showDate(new Date(pkg.created_at)) }}</span>
                    </span>
                    <span class="u-meta">
                        <span class="u-label">最后更新</span>
                        <span class="u-value">{{ showRecently(pkg.updated_at) }}</span>
                    </span>
                    <span class="u-meta" v-if="pkg.type == 1">
                        <span class="u-label">被依赖</span>
                        <span class="u-value"
                            >共 <strong>{{ (pkg.pkg_extend && pkg.pkg_extend.dependents) || 0 }}</strong> 个包</span
                        >
                    </span>
                    <span class="u-meta">
                        <span class="u-label">订阅数</span>
                        <span class="u-value"
                            >共 <strong>{{ (pkg.pkg_extend && pkg.pkg_extend.subscribers) || 0 }}</strong> 次</span
                        >
                    </span>
                </div>
            </div>
        </div>
        <div class="m-pkg-ac">
            <span class="u-title"><img svg-inline src="@/assets/img/dbm/common/ac.svg" />特别说明</span>
            <span class="u-desc">{{ pkg.notice }}</span>
        </div>
        <!-- <div class="m-pkg-tags">
            <span class="u-tag u-uuid"
                >{{ pkg.head }}
                <i class="el-icon-document-copy" title="复制UUID" @click="onCopy(pkg.head)"></i>
            </span>
            <router-link
                class="u-tag"
                v-for="tag in pkg.pkg_tag"
                :key="tag"
                :to="{ name: 'pkg_list', query: { tag: tag } }"
                target="_blank"
                >{{ tag }}</router-link
            >
        </div> -->

        <pkg-detail-extend :pkg="pkg"></pkg-detail-extend>

        <pkg-detail-primary :pkg="pkg"></pkg-detail-primary>
    </div>
</template>

<script>
import { getMyPkg, getPkg, deletePkg, refreshCache } from "@/service/dbm/pkg";
import { authorLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";
import { showDate, showRecently } from "@/utils/dbm/dateFormat";
import User from "@jx3box/jx3box-common/js/user";
import { __clients } from "@jx3box/jx3box-common/data/jx3box.json";
import { pkg_types } from "@/assets/data/dbm/types.json";
import { serializer } from "luadata";
import { readJx3dat } from "@/utils/dbm/jx3dat.js";

import pkgDetailExtend from "@/components/dbm/pkg/detail/pkg_detail_extend.vue";
import pkgDetailPrimary from "@/components/dbm/pkg/detail/pkg_detail_primary.vue";
export default {
    name: "PkgDetail",
    props: [],
    components: {
        pkgDetailExtend,
        pkgDetailPrimary,
    },
    data: function () {
        return {
            pkg: {},
            loading: false,
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
        isMine() {
            return this.$route.name == "pkg_detail_raw";
        },
        isEditor() {
            return User.isEditor();
        },
        isAuthor() {
            return this.pkg?.user_id == User.getInfo().uid;
        },
        showVersion() {
            return this.$route.query?.version || this.pkg?.pkg_record?.version || "v0.0.0";
        },
        showClient() {
            return __clients[this.pkg.client];
        },
        showLang() {
            return this.pkg.lang == "cn" ? "简体中文" : "繁体中文";
        },
        showMode() {
            return this.pkg.is_raw == 0 ? "云数据" : "本地数据";
        },
        showType() {
            return pkg_types[this.pkg.type];
        },
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler() {
                this.loadData();
            },
        },
    },
    methods: {
        getThumbnail(url, size) {
            return getThumbnail(url, size || [280, 160]);
        },
        getUserMeta(key) {
            return this.pkg?.user?.[key] || "";
        },
        getRecordMeta(key) {
            return this.pkg?.pkg_record?.[key] || "";
        },
        authorLink,
        showDate,
        showRecently,
        loadData() {
            const fn = this.isMine ? getMyPkg : getPkg;

            this.loading = true;
            fn(this.id, { version: this.$route.query?.version })
                .then((res) => {
                    this.$store.state.pkg = this.pkg = res.data.data;
                    if (this.pkg.type == 3) {
                        this.parseMarkData();
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        async parseMarkData() {
            const url = this.getRecordMeta("file");
            if (!url) this.$store.commit("SET_MARK_DATA", []);
            const buffer = Buffer.from(await fetch(url).then((res) => res.arrayBuffer()));
            const content = readJx3dat(buffer).content;
            const data = serializer.unserialize(content, { dictType: "object" });
            this.$store.commit("SET_MARK_DATA", data);
        },
        copy(val) {
            navigator.clipboard.writeText(val);
            this.$notify.success({
                title: "复制成功",
                message: val,
            });
        },
        goBack() {
            if (this.$route.meta.previousPageExists) {
                this.$router.go(-1);
            } else {
                const name = this.isMine ? "pkg_mine" : "pkg_list";
                this.$router.push({ name });
            }
        },
        editPkg() {
            const targetMap = {
                1: "pkg_edit",
                2: "target_edit",
                3: "mark_edit",
            };
            const name = targetMap[this.pkg.type];
            this.$router.push({
                name,
                params: {
                    id: this.id,
                },
            });
        },
        deletePkg() {
            if (!this.id) return;
            this.$alert("确定永久删除么？该操作无法撤销。", "消息", {
                confirmButtonText: "确定",
                type: "warning",
                callback: (action) => {
                    if (action == "confirm") {
                        deletePkg(this.id)
                            .then(async () => {
                                this.$message({
                                    message: "删除成功！",
                                    type: "success",
                                });
                                this.$router.push({
                                    name: "pkg_mine",
                                });
                                await refreshCache(this.pkg.key);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                },
            });
        },
    },
    mounted() {
        window.$router = this.$router;
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_detail.less";
@import "~@/assets/css/dbm/pkg/single.less";
</style>
