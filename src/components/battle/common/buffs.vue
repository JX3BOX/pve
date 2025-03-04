<template>
    <fold-wrapper class="m-buffs" v-if="player_data">
        <div slot="header">
            <img svg-inline src="@/assets/img/battle/raid/buff.svg" />Buff分析
        </div>
        <timeline :data="player_data" :raw="raw"></timeline>
    </fold-wrapper>
</template>

<script>
import foldWrapper from "@/vue/components/fold_wrapper.vue";
import timeline from "@/vue/components/timeline.vue";
export default {
    name: "singleBuffTimeline",
    props: ["raw", "player_id", "buffdata"],
    components: {
        "fold-wrapper": foldWrapper,
        'timeline': timeline,
    },
    data: function () {
        return {};
    },
    computed: {
        player_data: function () {
            return this.buffdata && this.buffdata[this.player_id];
        },
    },
    methods: {},
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>
