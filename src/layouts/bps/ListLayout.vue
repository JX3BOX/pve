<template>
    <div>
        <Header></Header>
        <Breadcrumb
            name="职业专栏"
            slug="bps"
            root="/bps"
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
                <slot></slot>
            </div>
            <RightSidebar class="m-bps-right-side" :show-toggle="true">
                <Side class="m-extend" />
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Info from "@/components/bps/list/Info.vue";
import Nav from "@/components/bps/list/list_nav.vue";
import Side from "@/components/bps/list/list_side.vue";
import tabs from "@/components/bps/tabs.vue";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "App",
    props: [],
    data: function () {
        return {
            logo: __cdn + "logo/logo-light/bps.svg",
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
.m-bps-right-side {
    .c-sidebar-right-inner {
        background-color: #fff !important;
    }
}
@import "~@/assets/css/bps/list.less";
@import "~@/assets/css/bps/miniprogram.less";
</style>
