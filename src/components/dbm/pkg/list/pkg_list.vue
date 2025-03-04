<template>
    <div class="m-pkg-list">
        <pkg-list-item
            v-for="item in data"
            :key="item.id"
            :item="item"
            @update="onUpdate"
            :selecting="selecting"
        ></pkg-list-item>
    </div>
</template>

<script>
import PkgListItem from "@/components/dbm/pkg/list/pkg_list_item.vue";
export default {
    name: "pkg-list",
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        selecting: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        PkgListItem,
    },
    data: function () {
        return {};
    },
    computed: {},
    watch: {},
    methods: {
        onUpdate() {
            this.$emit("update");
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
// .m-pkg-list {
//     margin-top: 10px;
// }
</style>
