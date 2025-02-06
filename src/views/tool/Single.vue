<template>
    <SingleLayout>
        <single></single>
    </SingleLayout>
</template>

<script>
import SingleLayout from '@/layouts/tool/SingleLayout.vue';
import single from "@/components/tool/single/single.vue";

export default {
    name: "App",
    components: {
        SingleLayout,
        single,
    },
    computed: {
        user_id: function () {
            return this.$store.state.user_id;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/app.less";
</style>
