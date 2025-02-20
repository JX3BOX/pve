<template>
    <div class="m-simple-map">
        <div class="u-header">
            <div class="u-title">本周出现位置</div>
            <div class="u-time">{{ duration.start }} ~ {{ duration.end }}</div>
        </div>
        <div class="u-list">
            <div class="u-step" v-for="(item, stepIndex) in list" :key="stepIndex">
                <div class="u-floor" :class="indexes.includes(stepIndex * row + index) && 'is-active'" v-for="(floor, index) in item" :key="index">{{ stepIndex * row + index + 1 }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { moment } from "@jx3box/jx3box-common/js/moment";
import { arr1to2 } from "@/utils";
import { cloneDeep } from "lodash";
export default {
    name: "MapSimple",
    computed: {
        ...mapState({
            currentBossName: (state) => state.baizhan.currentBossName,
            step: (state) => state.baizhan.step,
            row: (state) => state.baizhan.row,
            maps: (state) => state.baizhan.maps,
        }),
        indexes() {
            const indexes = [];
            this.maps.forEach((item, index) => {
                if (item.bossName === this.currentBossName) {
                    indexes.push(index);
                }
            });
            return indexes;
        },
        update_moment() {
            return moment(this.$store.state.baizhan.map.updated_at);
        },
        duration() {
            return {
                start: this.update_moment.startOf("week").format("MM/DD"),
                end: this.update_moment.endOf("week").format("MM/DD"),
            };
        },
        list() {
            const data = cloneDeep(this.maps);
            return arr1to2(data, this.row);
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/map_simple.less";
</style>
