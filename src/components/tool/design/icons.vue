<template>
    <div class="m-icons">
        <h1 class="m-icons-title">剑三图标库</h1>
        <div class="m-icons-box">
            <el-radio-group v-model="mode" class="m-icons-radio">
                <el-radio-button label="search">探索模式</el-radio-button>
                <el-radio-button label="view">浏览模式</el-radio-button>
                <el-radio-button class="phone-only" label="star" v-if="isPhone() || isMiniProgram"
                    >我的收藏</el-radio-button
                >
            </el-radio-group>
            <IconsSearch v-if="mode === 'search'" />
            <IconsView v-if="mode === 'view'" />
            <IconsFav v-if="mode == 'star'"></IconsFav>
        </div>
    </div>
</template>

<script>
import IconsSearch from "./search.vue";
import IconsView from "./icon_view.vue";
import IconsFav from "./fav.vue";
import { isPhone } from "@/utils";
import { mapState } from "vuex";

export default {
    name: "icons",
    props: [],
    components: {
        IconsSearch,
        IconsFav,
        IconsView,
    },
    data: function () {
        return {
            activeTabName: "list",

            mode: "search",
        };
    },
    computed: { ...mapState(["isMiniProgram"]) },
    methods: { isPhone },
};
</script>

<style lang="less">
.m-icons-radio {
    .flex;
    justify-content: center;
    .mb(20px);
}
</style>
