<template>
    <singlebox :post="post" :stat="stat" v-loading="loading" @extendUpdate="updateExtend">
        <!-- 子类型 -->
        <div class="u-meta u-sub-block" slot="single-header">
            <em class="u-label">副本</em>
            <span class="u-value">
                {{ post_subtype }}
            </span>
        </div>
    </singlebox>
</template>

<script>
// 依赖模块
import singlebox from "@/components/fb/cms-single";

// 本地数据
import { getPost } from "@/service/fb/post.js";
import { getStat, postStat, postHistory, postReadHistory } from "@jx3box/jx3box-common/js/stat";
import User from "@jx3box/jx3box-common/js/user";
const appKey = "fb"
export default {
    name: "single",
    props: ["id"],
    data: function () {
        return {
            loading: false,
            post: {},
            stat: {},
        };
    },
    computed: {
        post_subtype: function () {
            return this.post?.post_subtype || "其它";
        },
    },
    methods: {
        updateExtend: function (val) {
            this.$store.state.extend = val;
        },
    },
    mounted: function () {
        if (this.id) {
            this.loading = true;
            getPost(this.id)
                .then((res) => {
                    this.post = this.$store.state.post = res.data.data;
                    this.$store.state.id = this.id;
                    this.$store.state.user_id = this.post?.post_author;

                    document.title = this.post.post_title;

                    if (User.isLogin()) {
                        postHistory({
                            source_type: appKey,
                            source_id: ~~this.id,
                            link: location.href,
                            title: this.post.post_title,
                            author_id: this.post.post_author,
                            banner: this.post.post_banner,
                        });

                        this.post.visible > 1 &&
                            postReadHistory({
                                id: this.id,
                                category: "posts",
                                subcategory: "default",
                                visible_type: ~~this.post.visible,
                                author_id: this.post.post_author,
                                banner: this.post.post_banner,
                                contentMetaId: this.post.link_content_meta_id,
                            });
                    }
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
@import "~@/assets/css/fb/single.less";
</style>
