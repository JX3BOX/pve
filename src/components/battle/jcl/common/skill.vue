<template>
    <!-- 用于技能/BUFF展示 -->
    <div class="m-jcl-skill" :class="{ 'm-jcl-skill__vertical': vertical }" :title="name">
        <div class="u-skill-icon" :style="iconStyle">
            <img class="u-skill-img" :src="iconSrc" alt="" />
            <span class="u-skill-stack" :style="stackStyle" v-show="showStack">{{ stack }}</span>
        </div>
        <a class="u-skill-name" v-if="link && clickRedirect" :href="link" target="_blank">{{ name }}</a>
        <span class="u-skill-name" v-else target="_blank">{{ name }}</span>
    </div>
</template>

<script>
import { iconLink, getLink } from "@jx3box/jx3box-common/js/utils";
import { getResource } from "@/utils/battle/jcl/resource";
import { resourceName } from "@/utils/battle/jcl/format";
export default {
    name: "JclSkill",
    props: {
        type: {
            type: String,
            default: "skill",
        },
        id: {
            type: String,
            default: "110_1",
        },
        size: {
            type: Number,
            default: 20,
        },
        stack: {
            type: Number,
            default: 1,
        },
        clickRedirect: {
            type: Boolean,
            default: true,
        },
        vertical: {
            type: Boolean,
            default: false,
        },
        showID: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        resource() {
            return getResource(this.type, this.id);
        },
        iconSrc() {
            if (!this.resource) return iconLink(13, this.client);
            return iconLink(this.resource.icon, this.client);
        },
        link() {
            if (!this.resource || !this.clickRedirect) return "";
            return getLink(this.type, this.resource.id, this.resource.level);
        },
        name() {
            if (!this.resource) return "未知";
            return resourceName(this.resource, this.showID);
        },
        showStack() {
            return this.stack > 1;
        },
        iconStyle() {
            return { width: this.size + "px", height: this.size + "px" };
        },
        stackStyle() {
            return { fontSize: this.size / 2 + "px" };
        },
        client() {
            return window.$store?.client ?? "std";
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/jcl/skill.less";
</style>
