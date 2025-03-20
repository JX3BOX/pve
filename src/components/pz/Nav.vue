<template>
    <div class="m-pz-nav">
        <a class="m-nav-add el-button el-button--primary" @click="addPz">
            <i class="el-icon-plus"></i>
            <span>新配装方案</span>
        </a>

        <ul class="m-pz-route">
            <li
                v-for="(nav, index) in navList"
                :key="index"
            >
                <router-link :to="nav.path" class="u-item">
                    <i class="u-icon" :class="nav.icon"></i>
                    <span class="u-text">{{ nav.name }}</span>
                </router-link>
            </li>
        </ul>
        <!-- 新增配装方案 -->
        <add-pz-dialog v-model="showDialog"></add-pz-dialog>
    </div>
</template>

<script>
import AddPzDialog from "@/components/pz/AddPzDialog.vue";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "Nav",
    data() {
        return {
            navList: [
                {
                    name: "偏好设置",
                    key: "setting",
                    icon: "el-icon-setting",
                    path: "/setting",
                },
                {
                    name: "我的配装",
                    key: "mine",
                    icon: "el-icon-box",
                    path: "/mine",
                },
                {
                    name: "配装大厅",
                    key: "public",
                    icon: "el-icon-search",
                    path: "/public",
                },
                {
                    name: "配装对比",
                    key: "compare",
                    icon: "el-icon-s-operation",
                    path: "/compare",
                },
            ],
            showDialog: false,
            isLogin: User.isLogin(),
        };
    },
    methods: {
        addPz: function () {
            if (this.isLogin) {
                this.showDialog = true;
            } else {
                User.toLogin();
            }
        },
    },
    components: {
        AddPzDialog,
    },
    mounted() {
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/nav.less";
</style>
