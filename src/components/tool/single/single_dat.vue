<template>
    <singlebox :post="post" :stat="stat" v-loading="loading" @extendUpdate="updateExtend" :postType="appKey">
        <div class="u-meta u-sub-block" slot="single-header">
            <em class="u-label">类型</em>
            <span class="u-value">{{ post_subtype }}</span>
        </div>

        <!-- 数据字段 -->
        <div class="m-single-meta" v-if="visible">
            <div class="u-subtype-1" v-if="subtype == 1 && data && data.length">
                <div v-for="(feed, i) in data" :key="feed + i">
                    <div class="u-data" v-if="i == 0">
                        <div class="u-feed">
                            <Mark :label="post.author" @click.native="copy(post.author)" />
                        </div>
                        <a
                            class="u-sync"
                            v-if="isAuthor || isEditor"
                            :href="'https://pull.j3cx.com/api/dbm/feed?key=' + post.author + '&_no_cache'"
                            target="_blank"
                            title="默认存在1分钟缓存，如需要即时生效请点击此按钮"
                        >
                            <i class="el-icon-video-play"></i> 云端同步刷新
                        </a>
                        <span class="u-desc">{{ feed.desc }}</span>
                        <a class="u-down el-button el-button--default el-button--small is-plain" :href="feed.file | showDown" target="_blank">
                            <i class="el-icon-download"></i>
                            <span>本地下载</span>
                        </a>
                    </div>
                    <div class="u-data" v-if="i != 0 && feed.status">
                        <div class="u-feed">
                            <Mark
                                :label="post.author"
                                :value="feed.name"
                                :BGR="post | highlight"
                                BGL="#24292e"
                                @click.native="copy(post.author + '#' + feed.name)"
                            />
                        </div>
                        <a
                            class="u-sync"
                            v-if="isAuthor || isEditor"
                            :href="'https://pull.j3cx.com/api/dbm/feed?key=' + post.author + '-' + feed.name + '&_no_cache'"
                            target="_blank"
                            title="默认存在1分钟缓存，如需要即时生效请点击此按钮"
                        >
                            <i class="el-icon-video-play"></i> 云端同步刷新
                        </a>
                        <span class="u-desc">{{ feed.desc }}</span>
                        <a class="u-down el-button el-button--default el-button--small is-plain" :href="feed.file | showDown" target="_blank">
                            <i class="el-icon-download"></i>
                            <span>本地下载</span>
                        </a>
                    </div>
                    <div class="u-data" v-if="!feed.status && cansee">
                        <div class="u-feed">
                            <Mark
                                :label="post.author"
                                :value="feed.name"
                                BGR="#f39"
                                BGL="#24292e"
                                @click.native="copy(post.author + '#' + feed.name)"
                            />
                        </div>
                        <a
                            class="u-sync"
                            v-if="isAuthor || isEditor"
                            :href="'https://pull.j3cx.com/api/dbm/feed?key=' + post.author + '-' + feed.name + '&_no_cache'"
                            target="_blank"
                            title="默认存在1分钟缓存，如需要即时生效请点击此按钮"
                        >
                            <i class="el-icon-video-play"></i> 云端同步刷新
                        </a>
                        <span class="u-desc">{{ feed.desc }}</span>
                        <a class="u-down el-button el-button--default el-button--small is-plain" :href="feed.file | showDown" target="_blank">
                            <i class="el-icon-download"></i>
                            <span>本地下载</span>
                        </a>
                    </div>
                </div>
                <div class="u-data u-data-add">
                    <div class="u-feed" v-if="meta.github">
                        <Mark :label="meta.github" value="@github" BGR="@color" BGL="#24292e" @click.native="copy(meta.github + '@github')">
                            <img class svg-inline src="@/assets/img/tool/github.svg" />
                        </Mark>
                    </div>
                    <div class="u-feed" v-if="meta.gitee">
                        <Mark :label="meta.gitee" value="@gitee" BGR="#c71d23" BGL="#24292e" @click.native="copy(meta.gitee + '@github')">
                            <img class="u-gitee" svg-inline src="@/assets/img/tool/gitee.svg" />
                        </Mark>
                    </div>
                    <div class="u-feed" v-if="meta.aliyun">
                        <Mark :label="meta.aliyun" value="@aliyun" BGR="#ff6a00" BGL="#24292e" @click.native="copy(meta.aliyun + '@github')">
                            <img class svg-inline src="@/assets/img/tool/aliyun.svg" />
                        </Mark>
                    </div>
                </div>
            </div>
            <div class="u-subtype-other" v-else-if="subtype != 1">
                <span class="u-typename">数据类型：{{ post_subtype }}</span>
                <a class="u-download el-button el-button--primary el-button--small" :href="meta.down | showDown" target="_blank" v-if="meta.down">
                    <i class="el-icon-download"></i>
                    <span class="u-long">默认数据下载</span>
                    <span class="u-short">下载</span>
                </a>
            </div>
        </div>
    </singlebox>
</template>

<script>
// 依赖模块
import singlebox from "@/components/tool/cms-single";

// 本地数据
import { getPost } from "@/service/tool/post.js";
import { getStat, postStat, postHistory } from "@jx3box/jx3box-common/js/stat";
import { jx3dat_types } from "@/assets/data/tool/types.json";
import { getAppIcon, getAppID,resolveImagePath, getLink } from "@jx3box/jx3box-common/js/utils";


// 工具方法
import User from "@jx3box/jx3box-common/js/user";

const appKey = "tool";

export default {
    name: "single",
    data: function() {
        return {
            loading: false,
            post: {},
            stat: {},

            meta: {},
            data : [],

            appKey,
            id: getAppID(),
        };
    },
    computed: {
        isAuthor: function() {
            return User.getInfo().uid == this.post?.post_author;
        },
        isEditor : function (){
            return User.isEditor()
        },
        subtype: function() {
            return this.post?.post_subtype;
        },
        post_subtype: function() {
            return jx3dat_types?.[this.subtype] || "-";
        },
        visible: function () {
            return this.post?._check;
        },
    },
    methods: {
        onCopy: function(val) {
            this.$notify({
                title: "订阅号复制成功",
                message: "复制内容 : " + val.text,
                type: "success",
            });
        },
        onError: function() {
            this.$notify.error({
                title: "复制失败",
                message: "请手动复制",
            });
        },
        updateExtend: function(val) {
            this.$store.state.extend = val;
        },
        copy(content) {
            console.log(content)
            navigator.clipboard
                .writeText(content)
                .then(() => {
                    this.$notify({
                        title: "复制成功",
                        message: "复制内容 : " + content,
                        type: "success",
                    });
                })
                .catch(() => {
                    this.$message({
                        message: "复制失败",
                        type: "error",
                    });
                });
        },
    },
    filters: {
        highlight: function(item) {
            const colormap = {
                newbie: "#49c10f",
                advanced: "#fba524",
                recommended: "#cb91ff",
                geek: "#fc3c3c",
            };
            if (item.mark) {
                return colormap[item.mark[0]];
            }
            return "#035cc1";
        },
        showDown: function(val) {
            return val && resolveImagePath(val);
        },
    },
    mounted: function() {
        if (this.id) {
            this.loading = true;
            getPost(this.id)
                .then((res) => {
                    this.post = this.$store.state.post = res.data.data;
                    this.$store.state.id = this.id;
                    this.$store.state.user_id = this.post?.post_author;
                    this.meta = this.post?.post_meta;
                    this.data = this.post?.post_meta?.data;

                    document.title = this.post.post_title;

                    User.isLogin() && postHistory({
                        source_type: appKey,
                        source_id: this.id,
                        link: location.href,
                        title: this.post.post_title,
                    });
                })
                .finally(() => {
                    this.loading = false;
                });

            getStat(appKey, this.id).then((res) => {
                this.stat = this.$store.state.stat = res.data;
            });
            postStat(appKey, this.id);
        }
    },
    components: {
        singlebox,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/single.less";
</style>
