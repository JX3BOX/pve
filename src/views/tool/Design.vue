<template>
    <AppLayout slug="design" icon="design" name="设计资源" :has-right="hasRight" class="p-design">
        <template #left>
            <Nav ></Nav>
        </template>
        <template #breadcrumb-content>
            <Info></Info>
        </template>
        <div class="m-archive-box">
            <router-view></router-view>
        </div>
        <template #right>
            <favVue></favVue>
        </template>
    </AppLayout>
</template>

<script>
import AppLayout from "@/layouts/tool/AppLayout.vue";
import Nav from "@/components/tool/design/nav.vue";
import favVue from "@/components/tool/design/fav.vue";
import Info from "@/components/tool/design/Info.vue";
export default {
    name: "Design",
    components: {
        AppLayout,
        Nav,
        Info,
        favVue,
    },
    data() {
        return {};
    },
    computed: {
        hasRight() {
            return !!this.$route?.meta?.hasRight;
        },
    },
    methods: {},
    mounted() {
        document.title = "设计资源 - JX3BOX";
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/design/design.less";
.m-archive-box {
    padding: 20px 25px;
}
.p-design .c-sidebar-left{
    padding:10px 0;
}
@media screen and (max-width: @phone) {
    .m-archive-box {
        padding: 20px 10px;
    }
    .c-sidebar-right {
        .none;
    }
}
</style>
