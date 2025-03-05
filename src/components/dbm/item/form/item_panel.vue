<template>
    <div class="m-my-panel">
        <div class="m-my-panel-item" v-for="(item, i) in data" :key="i">
            <div class="u-item u-op">
                限定层数：
                <el-select class="u-op-opr" v-model="item['szStackOp']" placeholder="比较符号" size="small" clearable>
                    <el-option v-for="(x, j) in op" :key="j" :label="x" :value="x"> </el-option>
                </el-select>
                <el-input class="u-op-value" v-model.number="item['nStackNum']" placeholder="" size="small"> </el-input>
                <span class="u-desc"><em>（不指定时为等于1）</em></span>
            </div>
            <div class="u-item">
                条件限制：
                <el-checkbox v-model="item['bOnlyMine']">仅来源自己</el-checkbox>
                <span class="u-space"></span>
                <el-checkbox v-model="item['bOnlyMe']">仅监控自己</el-checkbox>
            </div>
            <div class="u-item">
                特效警告：
                <el-switch v-model="item['bCaution']" active-color="#13ce66"> </el-switch>
                <span class="u-desc"><em>（花括号闪动效果）</em></span>
            </div>
            <div class="u-item">
                头顶警告：
                <el-switch v-model="item['bScreenHead']" active-color="#13ce66"> </el-switch>
                <span class="u-space"></span>
                <el-color-picker v-model="item.colScreenHead" size="small"></el-color-picker>
                <span class="u-desc"><em>（头顶名字高亮）</em></span>
            </div>
            <div class="u-item">
                蒙版警告：
                <el-switch v-model="item['bAttention']" active-color="#13ce66"> </el-switch>
                <span class="u-space"></span>
                <el-color-picker v-model="item.colors" @change="calcMIX(i)" size="small"></el-color-picker>
                <span class="u-desc"><em>（半透明遮挡效果，同时覆盖默认图标边框色）</em></span>
            </div>
            <div class="u-item">
                描边透明度：<el-slider
                    v-model.number="item.nColAlpha"
                    :min="0"
                    :max="255"
                    input-size="mini"
                    :show-input="false"
                ></el-slider>
            </div>
            <span style="display: none">
                <input type="text" v-model="item.col" />
            </span>

            <div class="u-item">
                优先级别：
                <el-input class="u-text" v-model.number="item['nPriority']" placeholder="" size="small"> </el-input>
                <span class="u-desc"><em>（0为最大,数字越小优先级越高）</em></span>
            </div>
            <div class="u-item">
                备注说明：
                <el-input class="u-text" v-model="item['szReminder']" placeholder="" size="small"> </el-input>
                <span class="u-desc"><em>（仅显示第一个字符）</em></span>
            </div>

            <div class="u-del">
                <el-button plain size="mini" type="danger" icon="el-icon-circle-close" @click="del(i)"
                    >移除监控</el-button
                >
            </div>
        </div>
        <el-button plain icon="el-icon-circle-plus-outline" @click="add">增加监控</el-button>
    </div>
</template>

<script>
import _ from "lodash";
import op from "@/assets/data/dbm/op.json";
import hex2int from "@/utils/dbm/hex2int.js";
import defaultPanel from "@/assets/data/dbm/default_item_panel.json";

export default {
    name: "ItemPanel",
    props: ["origin"],
    model: {
        prop: "origin",
        event: "update",
    },
    data: function () {
        return {
            data: this.origin && this.origin.length ? this.origin : [],
            op,
            shouldUpdate: true,
        };
    },
    watch: {
        data: {
            deep: true,
            handler: function (newval) {
                // 计算组合颜色码
                newval.forEach((item) => {
                    this.calcMIX(item);
                });
                for (let item of newval) {
                    for (let key in item) {
                        if (defaultPanel[key] === undefined) {
                            delete item[key];
                        }
                    }
                }

                this.$emit("update", newval);
            },
        },
        origin: {
            deep: true,
            handler: function (newval) {
                if (!this.shouldUpdate) return;
                this.shouldUpdate = false;
                if (newval) {
                    newval.forEach((item) => {
                        // 存在col，需要反解析
                        if (item.col) {
                            let col = item.col;
                            item.nColAlpha = hex2int(col.slice(7));
                            item.__colors = col.slice(0, 7);
                        }
                    });
                    this.data = newval;
                } else {
                    this.data = [_.cloneDeep(defaultPanel)];
                }
                this.shouldUpdate = true;
            },
        },
    },
    methods: {
        add: function () {
            this.data.push(_.cloneDeep(defaultPanel));
        },
        del: function (i) {
            this.data.splice(i, 1);
        },
        calcMIX: function (item) {
            let alpha = item.nColAlpha;
            let color = item.colors;
            if (color && alpha) {
                if (alpha < 16) {
                    alpha = "0" + alpha.toString(16);
                } else {
                    alpha = alpha.toString(16);
                }
                item.col = item.colors + alpha;
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_panel.less";
</style>
