<template>
    <div class="m-battle-skill">
        <div class="u-item el-card" v-for="(item, i) in xfmap" :key="i">
            <a class="u-link" :href="navLink(item.name)" :class="{ on: isActive(item.name) }">
                <i class="u-pic"><img :src="item.id | xficon" :alt="item.name" /></i>
                <span class="u-txt">{{ item.name }}</span>
            </a>
        </div>
    </div>
</template>
<script>
//import somemod from '@/components/battle/somemod.vue';
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "skill",
    props: [],
    data: function () {
        return { xfmap };
    },
    computed: {},
    methods: {
        isActive: function (name) {
            return this.$store.state.subtype == name;
        },
        navLink: function (val) {
            return `./?subtype=${val}` + "#" + this.$route.path;
        },
    },
    filters: {
        xficon: function (val) {
            return __imgPath + "image/xf/" + val + ".png";
        },
    },
    components: {},
};
</script>
<style scoped lang="less">
@import "~@/assets/css/battle/components/skill.less";
</style>
