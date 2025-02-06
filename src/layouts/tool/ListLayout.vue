<template>
    <div class="p-layout p-layout--list">
        <Header></Header>
        <Breadcrumb
            :name="appName"
            icon="jx3dat"
            :slug="appKey"
            :root="`/${appKey}`"
            :publishEnable="true"
            :adminEnable="false"
            :feedbackEnable="true"
            :crumbEnable="true"
        >
        <template #logo>
                <img svg-inline :src="logo" />
            </template>
            <Info />
        </Breadcrumb>
        <LeftSidebar>
            <Nav class="m-nav" />
        </LeftSidebar>
        <Main :withoutRight="withoutRight">
            <div class="m-main">
                <tabs></tabs>
                <list-top v-if="showListTop"></list-top>
                <slot></slot>
            </div>
            <RightSidebar class="m-tool-right-side" :show-toggle="true">
                <Side class="m-extend" />
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Info from "@/components/tool/list/Info.vue";
import Nav from "@/components/tool/list/list_nav.vue";
import Side from "@/components/tool/list/list_side.vue";
import Tabs from "@/components/tool/list/list_tabs.vue";
import ListTop from "@/components/tool/list/list_top.vue";
import {__cdn} from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "App",
    props: {
        appName: {
            type: String,
            default: "工具资源",
        },
        appKey: {
            type: String,
            default: "tool",
        },
        withoutRight: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            logo: __cdn + "logo/logo-light/jx3dat.svg",
        };
    },
    computed: {
        showListTop() {
            return this.$route.name === 'index' && !this.$route.query?.subtype;
        }
    },
    methods: {},
    components: {
        Info,
        Nav,
        Side,
        Tabs,
        ListTop,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/list.less";

.m-tool-right-side {
    .c-sidebar-right-inner {
        background: #fff;
    }
}
</style>
