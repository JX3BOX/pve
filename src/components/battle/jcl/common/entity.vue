<template>
    <!-- 用于单位/玩家展示 -->
    <div class="m-jcl-entity">
        <img
            v-if="type == 'player'"
            class="u-entity-icon"
            :width="size"
            :height="size"
            :src="showMountIcon(entity.mount)"
        />
        <a class="u-entity-name" :style="nameStyle" v-if="renderLink" :href="npcLink" target="_blank" @click.stop>{{
            name
        }}</a>
        <span class="u-entity-name" :style="nameStyle" v-else>{{ name }}</span>
    </div>
</template>

<script>
import { showMountIcon, getLink } from "@jx3box/jx3box-common/js/utils";
import { entityName } from "@/utils/battle/jcl/format.js";
export default {
    name: "JclEntity",
    props: {
        id: {
            type: Number,
            default: 0,
        },
        clickRedirect: {
            type: Boolean,
            default: true,
        },
        size: {
            type: Number,
            default: 20,
        },
    },
    computed: {
        entity: function () {
            return window.$store.entities[this.id];
        },
        type: function () {
            return this.entity?.type ?? "npc";
        },
        name: function () {
            if (this.entity) return entityName(this.entity);
            return null;
        },
        npcLink: function () {
            return this.entity ? getLink("npc", this.entity.templateID) : "#";
        },
        renderLink: function () {
            return this.clickRedirect && this.entity && this.entity.type == "npc";
        },
        nameStyle: function () {
            return {
                color: this.renderLink ? "#409eff" : "#606266",
                fontSize: "12px",
            };
        },
    },
    methods: {
        showMountIcon,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/jcl/entity.less";
</style>
