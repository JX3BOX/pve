<template>
    <div class="m-info">
        <div class="m-info-router">
            <router-link to="/"><i class="el-icon-collection"></i></router-link>
            <router-link to="/raw"><i class="el-icon-reading"></i></router-link>
            <router-link to="/recipe"><i class="el-icon-magic-stick"></i></router-link>
            <router-link to="/kungfu"><i class="el-icon-notebook-1"></i></router-link>
            <router-link to="/changelog"><i class="el-icon-news"></i></router-link>
            <router-link to="/haste"><i class="el-icon-stopwatch"></i></router-link>
            <router-link to="/dps"><i class="el-icon-cpu"></i></router-link>
            <router-link to="/ladder"><i class="el-icon-s-data"></i></router-link>
            <router-link to="/lua" v-if="isSuperAuthor"><i class="el-icon-full-screen"></i></router-link>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user.js";
export default {
    name: "Info",
    props: [],
    data: function() {
        return {
        };
    },
    computed: {
        client: function() {
            return this.$store.state.client;
        },
        isSuperAuthor : function (){
            return this.$store.state.isSuperAuthor
        }
    },
    methods: {},
    mounted: function() {},
};
</script>

<style lang="less">
@import "~@/assets/css/bps/info.less";
</style>
