<!-- 装备升品组件 -->
<template>
    <div class="u-magic">
        <div class="u-magic-level">
            <el-slider v-model="GrowthLevel" :step="10" :min="0" :max="max" show-stops @input="applyGrowthLevel">
            </el-slider>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "GrowthLevel",
    data: function () {
        return {
            GrowthLevel: 0,
        };
    },
    computed: {
        ...mapGetters(["activeSnapshot",'equip']),
        max: function () {
            return ~~this.equip?.MaxGrowthLevel;
        },
    },
    methods: {
        //前端拿growthlevel
        applyGrowthLevel: function (nowGrowth) {
            this.GrowthLevel = nowGrowth;
            this.$store.commit("Sync", {
                prop: "GrowthLevel",
                data: {
                    content: this.GrowthLevel,
                    snapshot: this.GrowthLevel,
                },
            });
            // console.log(this.GrowthLevel)
        },
    },
    watch: {
        activeSnapshot: {
            deep: true,
            immediate: true,
            handler: function (activeSnapshot) {
                this.GrowthLevel = activeSnapshot.GrowthLevel || 0;
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/magic_change.less";
</style>
