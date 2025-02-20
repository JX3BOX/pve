<template>
    <div class="p-baizhan-comment">
        <div class="m-header">
            <div class="u-title">讨论评价</div>
            <a :href="getLink" target="_blank">攻略</a>
        </div>
    </div>
</template>

<script>
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "BaizhanComment",
    computed: {
        currentBossName() {
            return this.$store.state.baizhan.currentBoss?.bossName || "";
        },
        getLink() {
            const domain = process.env.NODE_ENV === "development" ? __Root : location.origin + "/";
            const currentBossName = this.currentBossName;
            return domain + `fb/?fb_name=百战异闻录&topic=${currentBossName}`;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/comment.less";
</style>
