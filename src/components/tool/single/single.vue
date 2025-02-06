<template>
    <singlebox :post="post" :stat="stat" v-loading="loading" @extendUpdate="updateExtend">
        <!-- 头部子类型 -->
        <div class="u-meta u-sub-block" slot="single-header">
            <em class="u-label">类型</em>
            <span class="u-value">
                {{ post_subtype }}
            </span>
        </div>

        <single-meta :post="post"></single-meta>
    </singlebox>
</template>

<script>
// 依赖模块
import singlebox from "@/components/tool/cms-single";
import single_meta from "./single_meta.vue";

// 本地数据
import { getPost } from "@/service/tool/post.js";
import { getStat, postStat, postHistory } from "@jx3box/jx3box-common/js/stat";
import types from "@/assets/data/tool/tool_types.json";
import { getAppIcon, getAppID } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
const appKey = "tool"
export default {
    name: "single",
    data: function() {
        return {
            loading: false,
            post: {},
            stat: {},
            id: getAppID(),
        };
    },
    computed: {
        post_subtype: function() {
            let subtype = this.post?.post_subtype;
            return subtype ? types[subtype] : "-";
        },
        isTool: function() {
            return this.post?.post_subtype == "1";
        },
    },
    methods : {
        updateExtend : function (val){
            this.$store.state.extend = val
        }
    },
    mounted: function() {
        if (this.id) {
            this.loading = true;
            getPost(this.id)
                .then((res) => {

                    this.post = this.$store.state.post = res.data.data;
                    this.$store.state.id = this.id;
                    this.$store.state.user_id = this.post?.post_author;

                    document.title = this.post.post_title;

                    User.isLogin() && postHistory({
                        source_type: appKey,
                        source_id: ~~this.id,
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
        'single-meta':single_meta,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/single.less";
</style>
