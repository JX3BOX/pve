<template>
    <div class="m-icons">
        <h1 class="m-icons-title">剑三图标库</h1>
        <div class="m-icons-box">
            <el-radio-group v-model="mode" class="m-icons-radio">
                <el-radio-button label="search">探索模式</el-radio-button>
                <el-radio-button label="view">浏览模式</el-radio-button>
            </el-radio-group>
            <IconsSearch v-if="mode === 'search'" />
            <IconsView v-if="mode === 'view'" />
            <!-- <el-tabs v-model="activeTabName" type="card">
                <el-tab-pane label="图标库" name="list">
                </el-tab-pane>
                <el-tab-pane label="收藏图标" name="favicon">
                    <IconsFav />
                </el-tab-pane>
            </el-tabs> -->
        </div>
    </div>
</template>

<script>
import IconsSearch from "./search.vue";
import IconsView from "./icon_view.vue";
// import IconsFav from "./fav.vue";
export default {
    name: "icons",
    props: [],
    components: {
        IconsSearch,
        // IconsFav,
        IconsView,
    },
    data: function () {
        return {
            activeTabName: "list",

            mode: "search",
        };
    },
    computed: {},
    methods: {},
};
</script>

<style lang="less">
.m-icons-radio {
    .flex;
    justify-content: center;
    .mb(20px);
}
</style>
