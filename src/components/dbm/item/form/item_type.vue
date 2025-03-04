<template>
    <fold-block class="m-item-form-type" name="type" desc="数据类型" icon="el-icon-folder" :fold="false" :fixed="true">
        <el-form-item label="类型" class="u-type">
            <el-select v-model="item.type">
                <el-option v-for="(label, value) in types" :key="value" :label="label" :value="value">
                    <span class="u-label">{{ label }}</span>
                    <span class="u-value">{{ value }}</span>
                </el-option>
            </el-select>
        </el-form-item>
        <!-- 地图 -->
        <el-form-item label="地图" class="u-map">
            <el-switch v-if="!isEditMode" v-model="item.allMap" active-text="所有地图通用" class="u-common">
            </el-switch>
            <span v-if="!item.allMap" class="u-desc"> 可快速搜索过滤，支持多选 </span>
            <div v-if="!item.allMap">
                <el-select
                    v-model="item.map"
                    filterable
                    placeholder="请指定地图"
                    clearable
                    :multiple="!isEditMode"
                    :disabled="!isEditMode && item.allMap"
                >
                    <el-option v-for="key in mapKeys" :key="key" :label="`${mapIndex[key]}(${key})`" :value="`${key}`">
                        <span class="u-label">{{ mapIndex[key] }}</span>
                        <span class="u-value">{{ key }}</span>
                    </el-option>
                </el-select>
            </div>
        </el-form-item>
    </fold-block>
</template>

<script>
import FoldBlock from "@/components/dbm/common/fold_block.vue";
import types from "@/assets/data/dbm/types.json";
import { mapState } from "vuex";

export default {
    name: "ItemFormType",
    components: { FoldBlock },
    inject: {
        isEditMode: {
            default: false,
        },
    },
    computed: {
        ...mapState(["item", "mapIndex", "mapKeys"]),
        types() {
            const itemTypes = types.types;
            // 创建模式都可以选
            if (!this.isEditMode) {
                return itemTypes;
            }
            // 编辑模式，如果是BUFF类型，只能在BUFF/DEBUFF切换，其它的类型都不能改
            if (this.isBuffType) {
                return {
                    BUFF: itemTypes["BUFF"],
                    DEBUFF: itemTypes["DEBUFF"],
                };
            } else {
                return {
                    [item.type]: itemTypes[item.type],
                };
            }
        },
        isBuffType() {
            return ["BUFF", "DEBUFF"].includes(this.item.type);
        },
    },
};
</script>

<style lang="less"></style>
