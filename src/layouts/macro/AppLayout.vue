<template>
    <div class="p-layout-app">
        <Header></Header>
        <Breadcrumb
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
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import { __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import app from "@/assets/data/macro/app.json";
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
        }
    },
    computed: {
        root() {
            return `/macro/${this.slug}`
        },
        logo() {
            const key = this.icon || this.slug;
            return __cdn + "logo/logo-light/" + key + ".svg";
        },
        title() {
            return app[this.slug]?.title || ''
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/macro/list.less";
@import "~@/assets/css/macro/miniprogram.less";
</style>
