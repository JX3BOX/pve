<template>
    <div>
        <div class="m-parse-update-select">
            <pkg-select :selected.sync="select_pkg" :multiple="false"></pkg-select>
        </div>
        <div class="m-parse-update-opr">
            <el-button type="primary" @click="confirmPkg" :disabled="!select_pkg">就选它啦！</el-button>
        </div>
    </div>
</template>

<script>
import PkgSelect from "@/components/dbm/pkg/pkg_select.vue";

export default {
    name: "ParsePkgSelect",
    components: { PkgSelect },
    data: () => ({
        select_pkg: null,
    }),
    methods: {
        confirmPkg() {
            if (!this.select_pkg) {
                this.$alert("请先选择要对比的数据包");
                return;
            } else {
                this.$emit("confirm", this.select_pkg);
            }
        },
    },
};
</script>
