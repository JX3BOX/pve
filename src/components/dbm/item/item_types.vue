<template>
    <el-tabs class="m-tabs" v-model="typeModel" @tab-click="switchType" v-if="mode === 'tab'" v-bind="$attrs">
        <el-tab-pane label="全部" name="ALL" v-if="showAll">
            <span slot="label">
                <i class="u-icon el-icon-menu"></i>
                <b>全部项目</b>
                <i class="u-type-count" v-if="counts['ALL']">({{ counts["ALL"] }})</i>
                <em class="i-type-ALL">ALL</em>
            </span>
        </el-tab-pane>
        <template v-for="(label, type) in types">
            <el-tab-pane v-if="!hide.includes(type)" :label="label" :name="type" :key="type">
                <span slot="label">
                    <i class="u-icon" :class="type == typeModel ? 'el-icon-folder-opened' : 'el-icon-folder'"></i>
                    <b>{{ label }}</b>
                    <i class="u-type-count" v-if="counts[type]">({{ counts[type] }})</i>
                    <em :class="'i-type-' + type">{{ type }}</em>
                </span>
            </el-tab-pane>
        </template>
    </el-tabs>
    <el-select
        v-else-if="mode === 'select'"
        v-model="typeModel"
        class="m-type-select"
        popper-class="m-type-select__popper"
        v-bind="$attrs"
        :size="size"
    >
        <el-option label="全部" value="ALL" v-if="showAll">
            <span class="u-type-desc">
                <span>全部</span>
                <em class="u-type-count" v-if="counts['ALL']">({{ counts["ALL"] }})</em>
            </span>
            <span class="u-type-tag i-type-ALL">ALL</span>
        </el-option>
        <el-option v-for="(desc, type) in types" :key="type" :label="desc" :value="type">
            <span class="u-type-desc">
                <span>{{ desc }}</span>
                <em class="u-type-count" v-if="counts[type]">({{ counts[type] }})</em>
            </span>
            <span class="u-type-tag" :class="'i-type-' + type">{{ type }}</span>
        </el-option>
    </el-select>
</template>

<script>
export default {
    name: "ItemTypes",
    props: {
        mode: {
            type: String,
            default: "tab",
        },
        replaceRoute: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            default: "ALL",
        },
        counts: {
            type: Object,
            default: () => ({}),
        },
        showAll: {
            type: Boolean,
            default: true,
        },
        types: {
            type: Object,
            default: () => {},
        },
        size: {
            type: String,
            default: "",
        },
        hide: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        typeModel: {
            get() {
                return this.type;
            },
            set(val) {
                this.$emit("update:type", val);
            },
        },
    },
    methods: {
        switchType: function ({ name }) {
            if (!this.replaceRoute) return;
            this.$router.replace({ query: { type: name } });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_types.less";
</style>
