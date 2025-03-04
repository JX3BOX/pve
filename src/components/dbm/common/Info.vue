<template>
    <div class="m-info">
        <div class="m-info-router">
            <router-link title="云数据" to="/dbm/pkg/list"><i class="el-icon-cloudy"></i></router-link>
            <router-link title="元数据" to="/dbm/item/list"><i class="el-icon-goods"></i></router-link>
            <router-link title="语音包" to="/dbm/vpk/list"><i class="el-icon-service"></i></router-link>
            <router-link title="文档中心" to="/"><i class="el-icon-notebook-1"></i></router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "Info",
    props: [],
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/common/info.less";
</style>
