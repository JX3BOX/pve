<template>
    <div class="m-snapshot-body" v-if="data && data.length">
        <div class="u-col" v-for="item in data" :key="item.name">
            <div
                class="u-item"
                v-clipboard:copy="item.name"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
            >
                <img class="u-icon" :src="item.mount | showMountIcon" />
                <span class="u-name">{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SnapshotBody",
    props: ["data"],
    components: {},
    data: function () {
        return {};
    },
    computed: {},
    watch: {},
    methods: {
        onCopy: function (val) {
            this.$notify({
                title: "复制成功",
                message: "复制内容 : " + val.text,
                type: "success",
            });
        },
        onError: function () {
            this.$notify.error({
                title: "复制失败",
                message: "请手动复制",
            });
        },
    },
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>
<style lang="less">
@import "~@/assets/css/team/snapshot/body.less";
</style>
