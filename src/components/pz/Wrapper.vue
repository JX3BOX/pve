<template>
    <div class="v-pz">
        <LeftSidebar>
            <Nav></Nav>
        </LeftSidebar>
        <Main :withoutRight="true">
            <div class="m-main">
                <div class="v-wrapper">
                    <template v-if="cansee">
                        <slot></slot>
                    </template>
                    <el-empty class="m-pz-login" v-else :image-size="128" description="仅登录后可使用">
                        <el-button type="primary" @click="goLogin">
                            登录
                            <i class="el-icon-arrow-right"></i>
                        </el-button>
                    </el-empty>
                </div>
            </div>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/pz/Nav.vue";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "Wrapper",
    props: [],
    data: function () {
        return {};
    },
    computed: {
        isLogin: function () {
            return this.$store.state.is_login;
        },
        isPublic: function () {
            return this.$route.meta.isPublic;
        },
        cansee: function () {
            return this.isPublic || this.isLogin;
        },
    },
    methods: {
        goLogin: function () {
            User.toLogin();
        },
    },
    created: function () {},
    components: {
        Nav,
    },
};
</script>

<style lang="less">
.v-wrapper {
    min-height: calc(100vh - @header-height - @bread-height - 100px);
    box-sizing: border-box;
}
</style>

