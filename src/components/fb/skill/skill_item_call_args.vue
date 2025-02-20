<template>
    <span>
        <span class="u-call-arg" v-for="(arg, i) in args" :key="i">
            <unit :arg="arg" />
            <em v-if="i < args.length - 1">,</em>
        </span>
    </span>
</template>

<script>
import unit from "@/components/fb/skill/skill_item_call_arg.vue";
export default {
    name: "args",
    props: ["args"],
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
    mounted: function () {},
    components: {
        unit,
    },
};
</script>
