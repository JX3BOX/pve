<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb
            name="数据构建"
            slug="dbm"
            root="/dbm"
            :publishEnable="false"
            :adminEnable="false"
            :feedbackEnable="true"
            :crumbEnable="true"
        >
            <img slot="logo" svg-inline :src="logo" />
            <Info />
            <template #op-append>
                <el-button
                    class="u-admin"
                    v-if="isEditor && isSingle"
                    type="primary"
                    icon="el-icon-setting"
                    size="small"
                    @click="drawer = true"
                    >管理</el-button
                >
            </template>
        </Breadcrumb>
        <LeftSidebar>
            <Nav />
        </LeftSidebar>
        <Main :withoutRight="true" class="m-main" :class="{ 'with-sticky': withSticky, 'show-shadow': showShadow }">
            <div class="m-primary">
                <AuthLayout>
                    <!-- <keep-alive include="item_mine,item_list"> -->
                        <router-view />
                    <!-- </keep-alive> -->
                </AuthLayout>
            </div>
            <Footer></Footer>
        </Main>
        <el-drawer
            title="管理菜单"
            :visible.sync="drawer"
            direction="rtl"
            :append-to-body="true"
            :size="600"
            custom-class="m-drawer"
            :wrapperClosable="true"
        >
            <template #title>
                <div class="u-manage-drawer__title">管理菜单</div>
            </template>
            <ManageDrawer @close="close" />
        </el-drawer>
    </div>
</template>

<script>
import Info from "@/components/dbm/common/Info.vue";
import Nav from "@/components/dbm/common/Nav.vue";
import User from "@jx3box/jx3box-common/js/user";
import AuthLayout from "@/layouts/dbm/AuthLayout.vue";
import ManageDrawer from "@/components/dbm/common/manage_drawer.vue";
import debounce from "lodash/debounce";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "App",
    components: {
        Info,
        Nav,
        AuthLayout,
        ManageDrawer,
    },
    props: [],
    data: function () {
        return {
            isEditor: false,
            drawer: false,
            showShadow: false,

            logo: __cdn + "logo/logo-light/dbm.svg",
        };
    },
    computed: {
        isSingle() {
            return !!this.$route.meta?.is_single;
        },
        withSticky() {
            return this.$route.meta.with_sticky;
        },
    },
    methods: {
        close: function () {
            this.drawer = false;
        },
        handleScroll() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            this.showShadow = scrollTop > 50;
        },
    },
    watch: {
        $route: {
            deep: true,
            handler: function () {
                window.scroll(0, 0);
            },
        },
    },
    mounted: function () {
        // 初始化地图列表
        this.$store.dispatch("getMapIndex");
        this.$store.dispatch("getSlugList");

        this.isEditor = User.isEditor();

        // 使用 lodash 的 debounce 函数来创建防抖函数
        const debouncedScrollHandler = debounce(this.handleScroll, 100); // 100 毫秒的防抖延迟时间，你可以根据需要调整
        window.addEventListener("scroll", debouncedScrollHandler);

        // 在组件销毁之前移除事件监听器
        this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("scroll", debouncedScrollHandler);
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/app.less";
#app {
    .u-admin {
        .fz(14px);
    }
}
</style>
