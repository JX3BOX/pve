<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb
            name="团队平台"
            slug="team"
            root="/team"
            :publishEnable="false"
            :adminEnable="false"
            :feedbackEnable="true"
            :crumbEnable="true"
        >
            <img slot="logo" :src="logo" />
        </Breadcrumb>
        <LeftSidebar>
            <Nav />
        </LeftSidebar>
        <Main :withoutRight="true">
            <div class="m-main" :style="{ minHeight: keepHeight }">
                <router-view v-if="isPublic || isLogin" />
                <el-alert v-else title="请先登录" type="warning" description="使用本功能请先登录" show-icon> </el-alert>
            </div>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
// import Nav from "@/components/widget/Nav.vue";
import Nav from "@/components/team/widget/Nav2.vue";
import User from "@jx3box/jx3box-common/js/user";
import { __Root, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "wrapper",
    data: function () {
        return {
            isLogin: User.isLogin(),
            keepHeight: window.innerHeight - 220 + "px",
            logo: __cdn + "logo/logo-light/team.svg",
        };
    },
    computed: {
        isPublic: function () {
            return this.$route.meta.isPublic;
        },
    },
    methods: {},
    mounted: function () {
        let oldhash = "#/org/view/";
        let old_id = location.hash.slice(oldhash.length, location.hash.length);
        if (location.hash.includes(oldhash)) {
            location.href = __Root + "team/org/" + old_id;
        }
    },
    components: {
        Nav,
    },
};
</script>

<style lang="less">
@import "../../assets/css/team/app.less";
</style>
