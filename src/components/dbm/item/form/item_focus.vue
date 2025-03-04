<template>
    <div class="m-focus">
        <div class="m-focus-item" v-for="(item, i) in data" :key="i">
            <div class="u-relation">
                <span class="u-label">目标关系要求：</span>
                <el-checkbox v-model="item['tRelation']['bAll']">全部</el-checkbox>
                <el-checkbox v-model="item['tRelation']['bAlly']" :disabled="item['tRelation']['bAll']"
                    >非敌对目标</el-checkbox
                >
                <el-checkbox v-model="item['tRelation']['bEnemy']" :disabled="item['tRelation']['bAll']"
                    >敌对目标</el-checkbox
                >
            </div>
            <div class="u-op">
                <span class="u-label">指定血量要求：</span>
                <el-switch v-model="item['tLife']['bEnable']" active-color="#13ce66"> </el-switch>
                <el-select
                    class="u-op-opr"
                    v-model="item['tLife']['szOperator']"
                    placeholder="请选择比较符号"
                    size="small"
                    clearable
                >
                    <el-option v-for="(x, j) in op" :key="j" :label="x" :value="x"> </el-option>
                </el-select>
                <el-input class="u-op-value" v-model.number="item['tLife']['nValue']" placeholder="" size="small" clearable>
                    <span slot="append">%</span>
                </el-input>
            </div>
            <div>
                <span class="u-label">生效距离限制：</span>
                <el-input v-model.number="item['nMaxDistance']" placeholder="可留空，推荐35" size="small"></el-input>
            </div>
            <div>
                <span class="u-label">替换焦点名称：</span>
                <el-input v-model.number="item['szDisplay']" placeholder="可留空" size="small"></el-input>
            </div>
            <div class="u-del" v-if="data.length > 1">
                <el-button plain size="mini" type="danger" icon="el-icon-circle-close" @click="del(i)"
                    >移除焦点</el-button
                >
            </div>
        </div>
        <el-button plain size="mini" icon="el-icon-circle-plus" @click="add">增加焦点</el-button>
    </div>
</template>

<script>
import op from "@/assets/data/dbm/op.json";
import focusSample from "@/assets/data/dbm/default_item_payload_focus.json";
import { cloneDeep } from "lodash";

export default {
    name: "itemFocus",
    props: ["origin"],
    model: {
        prop: "origin",
        event: "update",
    },
    data: function () {
        return {
            data: this.origin && this.origin.length ? this.origin : [cloneDeep(focusSample)],
            op,
        };
    },
    watch: {
        data: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
        origin: {
            deep: true,
            handler: function (newval) {
                if (newval) {
                    this.data = newval;
                } else {
                    this.data = [cloneDeep(focusSample)];
                }
            },
        },
    },
    methods: {
        add: function () {
            this.data.push(cloneDeep(focusSample));
        },
        del: function (i) {
            this.data.splice(i, 1);
        },
    },
    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_focus.less";
</style>
