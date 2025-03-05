<template>
    <nav class="m-nav">
        <nav-dialog></nav-dialog>

        <div class="m-nav-group" v-for="(group, key) in computedNavigator" :key="key" v-show="checkGroup(group)">
            <h5 class="m-nav-title" @click="toggleNav(group)">
                <span class="u-label">{{ group.label }}</span>
                <i class="u-toggle" :class="group.collapse ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i>
            </h5>
            <el-collapse-transition>
                <div class="m-nav-data-wrapper" v-show="group.collapse">
                    <div class="m-nav-data" v-for="item in group.list" :key="item.name">
                        <router-link :to="item.router">
                            <i class="u-icon" :class="item.icon"></i>
                            <span class="u-name">{{ item.name }}</span>
                        </router-link>
                    </div>
                </div>
            </el-collapse-transition>
        </div>
    </nav>
</template>

<script>
import { types } from "@/assets/data/dbm/types.json";
import User from "@jx3box/jx3box-common/js/user.js";
import { cloneDeep } from "lodash";

// components
import navDialog from "./nav_dialog.vue";
export default {
    name: "Nav",
    data: function () {
        return {
            types,

            navigator: {
                data: {
                    label: "数据大厅",
                    collapse: true,
                    isDev: false,
                    list: [
                        { router: { name: "pkg_list" }, icon: "el-icon-cloudy", name: "数据包" },
                        { router: { name: "item_list" }, icon: "el-icon-files", name: "元数据" },
                        { router: { name: "public_vpk" }, icon: "el-icon-service", name: "语音包" },
                    ],
                },
                item: {
                    label: "我的仓库",
                    collapse: true,
                    isDev: false,
                    list: [
                        { router: { name: "pkg_mine" }, icon: "el-icon-cloudy", name: "我的数据包" },
                        { router: { name: "item_mine" }, icon: "el-icon-files", name: "我的元数据" },
                        { router: { name: "my_vpk" }, icon: "el-icon-microphone", name: "我的语音包" },
                    ],
                },
                extend: {
                    label: "扩展",
                    collapse: true,
                    isDev: false,
                    list: [
                        { router: { name: "pkg_parse" }, icon: "el-icon-cpu", name: "解析器" },
                        { router: { name: "utils" }, icon: "el-icon-first-aid-kit", name: "工具集" },
                        { router: { name: "pkg_rank" }, icon: "el-icon-data-line", name: "排行榜" },
                    ],
                },
                // voice: {
                //     label: "工具",
                //     collapse: true,
                //     isDev: false,
                //     list: [
                //         { router: { name: "create_vpk" }, icon: "el-icon-mic", name: "制作语音包" },
                //     ],
                // },
            },
        };
    },
    computed: {
        current: function () {
            return this.$route.name;
        },
        isEditor() {
            return User.isEditor();
        },
        computedNavigator() {
            let navigator = cloneDeep(this.navigator);
            for (let key in navigator) {
                let group = navigator[key];
                group.list = group.list.filter((item) => {
                    if (item.hasRight) {
                        return this.isEditor;
                    }
                    return true;
                });
            }
            return navigator;
        },
    },
    methods: {
        toggleNav: function (group) {
            group.collapse = !group.collapse;
            this.$forceUpdate();
        },
        checkGroup: function (group) {
            return !group.isDev || (group.isDev && this.isEditor);
        },
        createData() {},
    },
    mounted: function () {},
    components: {
        navDialog,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/common/nav.less";
</style>
