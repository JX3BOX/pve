<template>
    <el-select
        v-bind="$attrs"
        v-model="valueModel"
        filterable
        remote
        reserve-keyword
        :remote-method="searchVpk"
        :loading="play_vpk_loading"
        size="small"
    >
        <el-option v-for="(item, index) in play_vpk_list" :key="index" :label="item.title" :value="item[field]">
        </el-option>
    </el-select>
</template>

<script>
import { getPublicVpkList, getVpkById, getVpk } from "@/service/dbm/vpk";

export default {
    name: "VpkSelect",
    props: {
        extraQuery: {
            type: Object,
            default: () => ({}),
        },
        value: {
            default: "",
        },
        field: {
            type: String,
            default: "id",
        },
    },
    model: {
        prop: "value",
        event: "change",
    },
    computed: {
        valueModel: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("change", val);
            },
        },
    },
    data: () => ({
        play_vpk_list: [],
        play_vpk_loading: false,
    }),
    methods: {
        searchVpk(keyword) {
            this.play_vpk_loading = true;
            return getPublicVpkList({
                ...this.extraQuery,
                title: keyword,
            })
                .then((res) => {
                    this.play_vpk_list = res.data.data.list;
                })
                .finally(() => {
                    this.play_vpk_loading = false;
                });
        },
        getVpk(id, mode) {
            if (mode === "uuid") {
                getVpk(id).then((res) => {
                    if (this.play_vpk_list.find((item) => item.id == res.data.data.id)) return;
                    this.play_vpk_list.unshift(res.data.data);
                });
            } else if (mode === "id") {
                getVpkById(id).then((res) => {
                    if (this.play_vpk_list.find((item) => item.id == res.data.data.id)) return;
                    this.play_vpk_list.unshift(res.data.data);
                });
            }
        },
    },
    mounted() {
        this.searchVpk("").then(() => {
            if (this.value) {
                this.getVpk(this.value, this.field);
            }
        });
    },
};
</script>

<style lang="less"></style>
