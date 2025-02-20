<template>
    <div class="m-extend">
        <list_side v-if="mode == 'list'"/>
        <single_side v-if="mode == 'single'"/>
    </div>
</template>

<script>
import list_side from "@/components/fb/list_side.vue";
import single_side from "@/components/fb/single_side.vue";
export default {
    name: "Extend",
    props: [],
    data: function() {
        return {};
    },
    computed: {
        mode: function() {
            return this.$store.state.mode
        },
    },
    methods: {},
    mounted: function() {},
    components: {
        list_side,
        single_side,
    },
};
</script>

<style lang="less"></style>
