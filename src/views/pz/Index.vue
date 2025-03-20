<template>
    <div></div>
    <!-- <Wrapper>
        <div class="m-pz-index">
            <div class="u-logo">
                <img :src="getAppIcon('pz_on')" />
            </div>
            <h1 class="u-title">魔盒配装器<i class="u-mark">JX3BOX</i></h1>
            <div class="u-docs">
                <a href="/tool/31141" target="_blank"><i class="el-icon-warning-outline"></i> 常见问题</a>
                <a href="/tool/30424" target="_blank"><i class="el-icon-collection"></i> 开发者文档</a>
            </div>
        </div>
    </Wrapper>-->
</template>

<script>
// import Wrapper from "@/components/Wrapper.vue";
// import { getAppIcon } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Index",
    props: [],
    components: {
        // Wrapper,
    },
    data: function () {
        return {};
    },
    computed: {
        is_login: function () {
            return this.$store.state.is_login;
        },
    },
    watch: {},
    // methods: { getAppIcon },
    filters: {},
    created: function () {
        if (this.is_login) {
            this.$router.push("/mine");
        } else {
            this.$router.push("/public");
        }
    },
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/pz/index.less";
</style>
