<template>
    <el-select
        v-bind="$attrs"
        v-model="valueModel"
        popper-class="m-pkg-version-select__popper"
        reserve-keyword
        @visible-change="onVisible"
    >
        <el-option
            class="u-option"
            v-for="(version, index) in versions"
            :key="index"
            :value="version.uuid"
            :label="version.version"
        >
            <span class="u-version">{{ version.version }}</span>
            <span class="u-time">{{ showRecently(version.created_at) }}</span>
        </el-option>
        <el-select-loading @load-more="getVersions" :hasMore="hasMore" :loading="loading"></el-select-loading>
    </el-select>
</template>

<script>
import { showRecently } from "@/utils/dbm/dateFormat.js";
import { getPkgVersion } from "@/service/dbm/pkg";
import ElSelectLoading from "@/components/dbm/common/el_select_loading.vue";

export default {
    name: "PkgVersionSelect",
    components: {
        ElSelectLoading,
    },
    props: {
        pkg_id: {
            type: Number,
            default: 0,
        },
        value: {
            default: "",
        },
        defaultName: {
            type: String,
            default: "",
        },
    },
    computed: {
        valueModel: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("change", { pkg: this.pkg_id, uuid: val });
            },
        },
        hasMore() {
            return this.total > this.versions.length;
        },
    },
    data: () => ({
        init: false,
        loading: false,
        page: 1,
        total: 0,
        versions: [],
    }),
    methods: {
        showRecently,
        onVisible() {
            if (this.init) return;
            this.versions = [];
            this.init = true;
            this.getVersions();
        },
        getVersions() {
            if (this.loading) return;

            this.loading = true;
            getPkgVersion(this.pkg_id, { page: this.page, per: 20 })
                .then((res) => {
                    this.versions = [...this.versions, ...res.data.data.list];
                    this.total = res.data.data.total;
                    this.page += 1;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {
        this.versions.push({
            uuid: this.value,
            version: this.defaultName,
        });
    },
    watch: {
        pkg_id: {
            handler() {
                this.init = false;
                this.page = 1;
                this.versions = [];
            },
        },
    },
};
</script>

<style lang="less">
.m-pkg-version-select__popper {
    .u-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .u-time {
        .fz(14px);
        color: #999;
    }
}
</style>
