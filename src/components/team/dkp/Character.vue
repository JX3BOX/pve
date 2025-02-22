<template>
    <div class="m-team-character_wrapper">
        <img class="u-character-logo" :src="xf | showSchoolIcon" />
        <span class="u-character-name">
            {{ name }}
        </span>
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";

export default {
    name: "Character",
    props: {
        xf: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    data: function() {
        return {};
    },
    computed: {},
    filters: {
    },
    watch: {},
    mounted: function() {},
    methods: {},
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/team/dkp/character.less";
</style>
