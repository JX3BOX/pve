<template>
    <div class="w-skill" v-if="data">
        <div class="w-skill-wrapper">
            <img class="w-skill-icon" :src="iconLink(data.IconID || 13)" :alt="data.Name" />
            <div class="w-skill-content">
                <span class="w-skill-name">{{ data.Name }}</span>
                <span class="w-skill-desc" v-html="data.Desc"></span>
                <span class="w-skill-meta">ID : {{ data.SkillID }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Skill",
    props: ["data"],
    computed: {},
    watch: {},
    methods: {
        iconLink: function (id) {
            return iconLink(id, "std");
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/skill.less";
</style>
