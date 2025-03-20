<!-- 横板 -->
<template>
    <div class="m-overview-canvas-box">
        <vertical :schema="schema"></vertical>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Vertical from '@/components/pz/canvas/Vertical.vue'

export default {
    name: "OverviewVertical",
    props: {
        mode: {
            type: String,
            default: "vertical",
        },
    },
    components: {
        Vertical
    },
    computed: {
        ...mapGetters(["schema"]),
    },
};
</script>
