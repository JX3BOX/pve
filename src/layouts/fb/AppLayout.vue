<template>
    <div>
        <Header></Header>
        <Breadcrumb
            :class="`m-${slug}-breadcrumb`"
            :name="title"
            :slug="slug"
            :root="root"
            :feedbackEnable="true"
            :crumbEnable="false"
        >
            <img slot="logo" svg-inline :src="logo" />
        </Breadcrumb>
        <Main :class="className" :withoutRight="true" :withoutLeft="true">
            <slot></slot>
            <Footer v-if="slug !== 'baizhan'"></Footer>
        </Main>
    </div>
</template>

<script>
import { __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import app from "@/assets/data/fb/app.json";
export default {
    name: "AppLayout",
    props: {
        slug: {
            type: String,
            default: "",
        },
        icon: {
            type: String,
            default: "",
        },
        className: {
            type: String,
            default: "",
        },
    },
    computed: {
        root() {
            return app[this.slug]?.root || "/";
        },
        logo() {
            const key = this.icon || this.slug;
            return __cdn + "logo/logo-light/" + key + ".svg";
        },
        title() {
            return app[this.slug]?.title || "";
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/list.less";
.m-baizhan-breadcrumb {
    padding: 10px 20px;
    background-color: @baizhan_bg;
    border-color: @baizhan_bg;
    .u-title {
        color: #c8c8c8 !important;
    }
    @media screen and (max-width: @ipad) {
        .u-menu {
            .db !important;
        }
        .u-channel-logo {
            width: 0;
            padding-left: 10px;
            img {
                .none !important;
            }
        }
    }
    img,
    svg {
        filter: invert(78%) sepia(61%) saturate(1%) hue-rotate(314deg) brightness(96%) contrast(83%);
    }
}
</style>
