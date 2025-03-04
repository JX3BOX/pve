<template>
    <div class="m-battle-fb">
        <tabs />
        <skill />
        <draggable class="rankbox"
            ><rank class="rank" v-for="(item, i) in title" :key="i" :title="item.name"
        /></draggable>
    </div>
</template>
<script>
import skill from "@/components/battle/skill.vue";
import tabs from "@/components/battle/tabs";
import rank from "@/components/battle/rank.vue";
import draggable from "vuedraggable";
export default {
    name: "Fb",
    props: [],
    data: function () {
        return {
            title: [{ name: "竞速榜" }, { name: "HPS榜" }, { name: "DPS榜" }],
        };
    },
    computed: {},

    methods: {},
    mounted: function () {},
    components: { skill, rank, tabs, draggable },
};
</script>
<style scoped lang="less">
.rankbox {
    display: flex;
    justify-content: space-around;
    .rank {
        background: #fff;
    }
}
</style>
