<template>
    <div class="m-info">
        <div class="m-info-router">
            <router-link to="/">
                <i class="el-icon-collection"></i>
            </router-link>
            <router-link to="/drop">
                <i class="el-icon-present"></i>
            </router-link>
            <router-link to="/gem">
                <i class="el-icon-cherry"></i>
            </router-link>
            <router-link to="/cj">
                <i class="el-icon-medal"></i>
            </router-link>
            <router-link to="/story">
                <i class="el-icon-film"></i>
            </router-link>
            <!-- <router-link to="/map">
                <i class="el-icon-map-location"></i>
            </router-link> -->
            <router-link to="/npc">
                <i class="el-icon-aim"></i>
            </router-link>
            <router-link to="/attr">
                <i class="el-icon-help"></i>
            </router-link>
            <router-link to="/skill" v-if="isSuperAuthor && client == 'std'">
                <i class="el-icon-key"></i>
            </router-link>
            <router-link to="/lua" v-if="isSuperAuthor">
                <i class="el-icon-full-screen"></i>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "Info",
    props: [],
    data: function () {
        return {
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        isSuperAuthor : function (){
            return this.$store.state.isSuperAuthor
        }
    },
    methods: {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/fb/info.less";
</style>
