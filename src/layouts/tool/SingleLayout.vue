<template>
    <div class="p-layout p-layout--single">
        <Header></Header>
        <Breadcrumb
            name="工具资源"
            icon="jx3dat"
            slug="tool"
            root="/tool"
            :publishEnable="true"
            :adminEnable="true"
            :feedbackEnable="true"
            :crumbEnable="true"
            :show-extend="true"
            :subtypeMap="subtypeMap"
        >
            <template #op-prepend>
                <!-- <AdminDirectMessage :user-id="user_id" :sourceId="String(post.ID)" :sourceType="post.post_type"></AdminDirectMessage> -->
                <AdminDrop v-if="isTeammate" :post="post" :user-id="user_id"  :showMove="true"/>
            </template>
            <template #title>
                <span>{{ title }}</span>
            </template>
            <template #logo>
                <img svg-inline :src="logo" />
            </template>
        </Breadcrumb>
        <LeftSidebar :uid="user_id">
            <Nav :id="id" class="m-nav" />
        </LeftSidebar>
        <Main :withoutRight="false">
            <slot></slot>
            <RightSidebar :show-toggle="true">
                <Side :id="id" :post="post" class="m-extend" />
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import Nav from "@/components/tool/single/single_nav.vue";
import Side from "@/components/tool/single/single_side.vue";
import { getAppID } from "@jx3box/jx3box-common/js/utils";
// import AdminDirectMessage from "@jx3box/jx3box-common-ui/src/bread/AdminDirectMessage.vue";
import AdminDrop from "@jx3box/jx3box-common-ui/src/bread/AdminDrop.vue";
import User from "@jx3box/jx3box-common/js/user";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "SingleLayout",
    props: {
        appName: {
            type: String,
            default: "教程工具",
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
            id: getAppID(),

            subtypeMap: {
                1: "工具资源",
                2: "插件数据",
                3: "学习笔札",
                4: "魔盒文档"
            },

            logo: __cdn + "logo/logo-light/jx3dat.svg",
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
            return User.isTeammate()
        }
    },
    methods: {},
    components: {
        Nav,
        Side,
        // AdminDirectMessage,
        AdminDrop,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/list.less";
</style>
