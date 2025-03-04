<template>
    <div class="c-auth-layout">
        <template v-if="checkAuth && !isLogin">
            <el-empty class="m-auth-empty" description="仅登陆后可使用" :image-size="200">
                <el-button icon="el-icon-arrow-right" type="primary" @click="toLogin">登录</el-button>
            </el-empty>
        </template>
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user.js";
export default {
    name: "AuthLayout",
    data() {
        return {
            isLogin: User.isLogin(),
        }
    },
    computed : {
        checkAuth(){
            return this.$route.meta.auth
        }
    },
    methods: {
        toLogin() {
            User.toLogin()
        }
    }
}
</script>

<style lang="less">
.m-auth-empty {
    .flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
}
</style>
