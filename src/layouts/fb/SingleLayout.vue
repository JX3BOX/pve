<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb name="副本专栏" slug="fb" :publishEnable="true" :feedbackEnable="true" :adminEnable="true">
            <template #op-prepend>
                <!-- <AdminDirectMessage :user-id="user_id" :sourceId="String(post.ID)" :sourceType="post.post_type"></AdminDirectMessage> -->
                <AdminDrop v-if="isTeammate" :post="post" :user-id="user_id"  :showMove="true"/>
            </template>
            <template #title>
                <span>
                    {{ title }}
                </span>
            </template>
            <template #logo>
                <img class="u-breadcrumb-logo" :src="logo" alt="">
            </template>
        </Breadcrumb>
        <LeftSidebar :uid="user_id">
            <Nav :id="id" class="m-nav" />
        </LeftSidebar>
        <Main :withoutRight="false">
            <slot></slot>
            <RightSidebar :show-toggle="true">
                <Side :id="id" class="m-extend" />
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/fb/single/single_nav.vue";
import Side from "@/components/fb/single/single_side.vue";
import { getAppIcon, getAppID } from "@jx3box/jx3box-common/js/utils";
import AdminDrop from "@jx3box/jx3box-common-ui/src/bread/AdminDrop.vue";
import User from "@jx3box/jx3box-common/js/user";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "SingleLayout",
    props: [],
    data: function() {
        return {
            id: getAppID(),
            logo: __cdn + "logo/logo-light/fb.svg",
        };
    },
    computed: {
        user_id: function () {
            return this.$store.state.user_id;
        },
        post: function (){
            return this.$store.state.post;
        },
        title() {
            return this.post.post_title || document.title;
        },
        isTeammate() {
            return User.isTeammate();
        }
    },
    methods: { getAppIcon },
    components: {
        Nav,
        Side,
        // AdminDirectMessage,
        AdminDrop,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
</style>

