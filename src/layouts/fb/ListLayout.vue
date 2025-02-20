<template>
    <div>
        <Header></Header>
        <Breadcrumb
            name="副本专栏"
            slug="fb"
            root="/fb"
            :publishEnable="true"
            :adminEnable="false"
            :feedbackEnable="true"
            :crumbEnable="true"
        >
            <template #logo>
                <img class="u-breadcrumb-logo" :src="logo" alt="">
            </template>
            <Info />
        </Breadcrumb>
        <LeftSidebar>
            <Nav class="m-nav" />
        </LeftSidebar>
        <Main :withoutRight="withoutRight">
            <div class="m-main m-fb">
                <tabs />
                <router-view />
            </div>
            <RightSidebar class="m-fb-right-side" :show-toggle="true">
                <Side class="m-extend" />
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/fb/list/list_nav.vue";
import tabs from "@/components/fb/tabs.vue";
import Info from "@/components/fb/Info.vue";
import Side from "@/components/fb/baizhan/map_side.vue";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "App",
    data: function () {
        return {
            withoutRight: false,
            logo: __cdn + "logo/logo-light/fb.svg",
        };
    },
    components: {
        Nav,
        tabs,
        Side,
        Info
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler: function (to, from) {
                this.withoutRight = to?.meta?.withoutRight;
            },
        },
    },
};
</script>

<style lang="less">
.m-fb-right-side {
//     &.c-sidebar-right.is-close {
//         transform: translateX(0) !important;
//     }
.c-sidebar-right-inner {
    background: #fff;
}
}
@import "~@/assets/css/fb/list.less";
</style>
