<!-- 横板 -->
<template>
    <div class="m-overview-canvas-box">
        <horizontal :schema="schema"></horizontal>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Horizontal from '@/components/pz/canvas/Horizontal.vue'

export default {
    name: "OverviewHorizontal",
    props: {
        mode: {
            type: String,
            default: "horizontal",
        },
    },
    components: {
        Horizontal
    },
    computed: {
        ...mapGetters(["schema"]),
    },
};
</script>
