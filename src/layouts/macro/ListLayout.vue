<template>
    <div>
        <Header></Header>
        <Breadcrumb
            name="云端宏"
            slug="macro"
            root="/macro"
            :publishEnable="true"
            :adminEnable="false"
            :feedbackEnable="true"
            :crumbEnable="true"
        >
            <template #logo>
                <img class="u-breadcrumb-logo" svg-inline :src="logo" alt="">
            </template>
            <Info />
        </Breadcrumb>
        <LeftSidebar>
            <Nav class="m-nav" />
        </LeftSidebar>
        <Main :withoutRight="false">
            <div class="m-main">
                <tabs />
                <router-view />
            </div>
            <RightSidebar class="m-macro-right-side" :showToggle="true">
                <Side class="m-extend" />
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Info from "@/components/macro/list/Info.vue";
import Nav from "@/components/macro/list/list_nav.vue";
import Side from "@/components/macro/list/list_side.vue";
import tabs from "@/components/macro/tabs.vue";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "App",
    props: [],
    data: function () {
        return {
            logo: __cdn + "logo/logo-light/macro.svg",
        };
    },
    methods: {},
    components: {
        Info,
        Nav,
        Side,
        tabs,
    },
};
</script>

<style lang="less">
.m-macro-right-side {
    .c-sidebar-right-inner {
        background: #fff;
    }
}
@import "~@/assets/css/macro/list.less";
@import "~@/assets/css/macro/miniprogram.less";
</style>
