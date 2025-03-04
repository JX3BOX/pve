<template>
    <div class="w-manage-drawer">
        <component :is="currentComponent" @close="onClose" @update="onUpdate"></component>
    </div>
</template>

<script>
import manage_pkg from "@/components/dbm/pkg/manage_pkg.vue";
import manage_vpk from "@/components/dbm/vpk/manage_vpk.vue";
import manage_item from "@/components/dbm/item/manage_item.vue";
export default {
    name: "ManageDrawer",
    data() {
        return {};
    },
    computed: {
        type() {
            return { item_detail: "item", pkg_detail: "pkg", public_view_vpk: "vpk", "manage_view_vpk": "vpk" }[this.$route.name];
        },
        currentComponent() {
            return {
                item: manage_item,
                pkg: manage_pkg,
                vpk: manage_vpk,
            }[this.type];
        },
    },
    methods: {
        onClose() {
            this.$emit("close");
        },
        onUpdate() {
            window.location.reload();
        },
    },
};
</script>

<style lang="less">
.w-manage-drawer {
    padding: 0 20px;
    height: calc(100% - 30px);
    .pr;
    .m-form-item {
        .flex;
        gap: 10px;
        align-items: center;

        .u-author {
            .w(200px);
        }
    }

    .u-color {
        .w(200px);
        .ml(20px);
        .flex;
        .el-input-group__prepend {
            // .pr;
            // top: 1px;
            // width: 20px;
            height: 32px;
            box-sizing: border-box;
            // border-radius: 4px;
        }
    }

    .m-footer {
        position: absolute;
        bottom: 20px;
        // 居中
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
