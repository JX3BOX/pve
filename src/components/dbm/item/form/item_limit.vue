<template>
    <fold-block
        class="m-item-limit"
        name="target"
        desc="限制条件"
        icon="el-icon-connection"
        :fold="false"
        v-if="showLimit">
        <!-- 目标势力 -->
        <el-form-item label="目标类型" prop="nScrutinyType" v-if="hasProp('nScrutinyType')" class="u-target-type">
            <el-radio-group v-model="item.payload.nScrutinyType">
                <el-radio v-for="(label, key) in types.ScrutinyType" :key="key" :label="key" border>{{
                    label
                }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <!-- 自身心法 -->
        <el-form-item label="自身类型" prop="tKungFu" v-if="hasProp('tKungFu')" class="u-self-mount">
            <el-select v-model="item.payload.tKungFu" multiple placeholder="请选择" filterable clearable allow-create>
                <el-option v-for="(label, value) in xfid" :key="value" :label="label" :value="value">
                    <span class="u-label">{{ label }}</span>
                    <span class="u-value">{{ value }}</span>
                </el-option>
            </el-select>
            <span class="u-desc">支持多选、支持自定义创建，不指定时为全部心法</span>
        </el-form-item>
        <!-- 目标BUFF/数量 -->
        <el-form-item :label="countLabel" prop="nCount" v-if="hasProp('nCount')">
            <span slot="label">
                <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content" class="u-tips">当指定数值时"失去/消失"类事件将不会再触发监控<br /></div>
                    <div>
                        {{ countLabel }}
                        <i class="el-icon-info"></i>
                    </div>
                </el-tooltip>
            </span>
            <el-input v-model.number="item.payload.nCount" placeholder="可留空"></el-input>
            <span class="u-desc">不要求时请留空</span>
        </el-form-item>
        <!-- 全部达成 -->
        <el-form-item label="全部消失" prop="bAllLeave" v-if="hasProp('bAllLeave')">
            <el-switch v-model="item.payload.bAllLeave" active-color="#13ce66"> </el-switch>
            <span class="u-desc">消失报警仅在全部消失时才触发</span>
        </el-form-item>
    </fold-block>
</template>
<script>
import FoldBlock from "@/components/dbm/common/fold_block.vue";
import types from "@/assets/data/dbm/types.json";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import { mapState } from "vuex";
import { itemHasProp } from "@/utils/dbm/item";

export default {
    name: "",
    components: { FoldBlock },
    data: () => ({ types }),
    computed: {
        ...mapState({
            item: "item",
            client: "client",
        }),
        countLabel: function () {
            return ["BUFF", "DEBUFF"].includes(this.type) ? "层数达到" : "数量达到";
        },
        showLimit: function () {
            return !["TALK", "CHAT"].includes(this.type);
        },
        xfid: () => xfid,
    },
    methods: {
        // 根据type控制字段显隐
        hasProp(prop) {
            return itemHasProp(this.item.type, prop);
        },
    },
};
</script>
<style lang="less" scoped></style>
