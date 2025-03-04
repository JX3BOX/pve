<template>
    <fold-block class="m-countdown" name="countdown" desc="倒计时条" icon="el-icon-alarm-clock" :fold="false">
        <el-button class="u-countdown-add" icon="el-icon-circle-plus-outline" plain size="small" @click="add">
            添加计时条
        </el-button>
        <div class="u-table-wrapper">
            <table class="u-countdown-table" v-if="data.length">
                <thead>
                    <th></th>
                    <th class="u-condition">触发条件</th>
                    <th>
                        <el-tooltip effect="dark" placement="top">
                            <div slot="content" class="u-tips">
                                普通倒计时：10<br />
                                分段倒计时：3,第一段倒计时;10,第二段倒计时;<br />
                                血量倒计时：0.7,达到70%准备下P2距离P2第一次大招还剩3秒,3
                                <br />
                                清空倒计时：0（清空与该倒计时拥有相同 倒计时唯一标识 的所有当前存在的倒计时 以及
                                其对应的 倒计时重复调用时间限制）<br />
                                清空倒计时：-1（将会清空与该倒计时拥有相同 倒计时唯一标识
                                的所有当前存在的倒计时；不会清空其对应的 倒计时重复调用时间限制）<br />
                                清空倒计时：-2（将会清空与该倒计时拥有相同 倒计时唯一标识 的
                                倒计时重复调用时间限制；不会清空其当前存在的 倒计时）<br />
                                *请注意标点需要使用半角
                            </div>
                            <div><i class="el-icon-info"></i> 倒计时/时间轴</div>
                        </el-tooltip>
                    </th>
                    <th>
                        <el-tooltip effect="dark" placement="top">
                            <div slot="content" class="u-tips">
                                {$me} 当前角色名<br />
                                {$sender} 事件发起者<br />
                                {$receiver} 事件接收者<br />
                                {$B--} Buff名称，--为ID数字<br />
                                {$S--} 技能名称，--为ID数字<br />
                                {$N--} NPC名称，--为ID数字<br />
                                {$D--} 物品名称，--为ID数字<br />
                                {$M--} 地图名称，--为ID数字
                            </div>
                            <div><i class="el-icon-info"></i> 计时条文字</div>
                        </el-tooltip>
                    </th>
                    <th>
                        <el-tooltip effect="dark" placement="top" content="在此时间内，该倒计时不会被刷新重新计时">
                            <div><i class="el-icon-info"></i> 重复调用限制</div>
                        </el-tooltip>
                    </th>
                    <th>唯一识别符</th>
                    <th>过图不消失</th>
                    <th>
                        <el-tooltip effect="dark" placement="top" content="默认使用原图标或缺省图标13">
                            <div><i class="el-icon-info"></i> 图标</div>
                        </el-tooltip>
                    </th>
                    <th>颜色</th>
                    <th>团队通知</th>
                    <th>移除</th>
                </thead>
                <draggable
                    handle=".u-drag-arrow"
                    tag="tbody"
                    v-model="data"
                    animation="500"
                    @start="drag = true"
                    @end="drag = false"
                >
                    <tr v-for="(line, index) in data" :key="index">
                        <!-- 拖拽列 -->
                        <td class="u-drag-arrow"><i class="el-icon-rank"></i></td>
                        <!-- 触发条件选择 -->
                        <td>
                            <el-select
                                v-model.number="line.nClass"
                                placeholder="请选择"
                                size="small"
                                class="u-condition"
                                clearable
                            >
                                <el-option
                                    v-for="(desc, value) in events"
                                    :key="value"
                                    :label="desc"
                                    :value="Number(value)"
                                    :class="{ on: hasProp(value) }"
                                    class="u-countdown-condition-item"
                                >
                                </el-option>
                            </el-select>
                        </td>
                        <td :colspan="showSzName(line) ? 1 : 2">
                            <el-input v-model.lazy="line.nTime" placeholder="倒计时/分段计时" size="small">
                                <el-button slot="append" icon="el-icon-edit" @click="editLine(line)"></el-button>
                            </el-input>
                        </td>
                        <td v-if="showSzName(line)">
                            <el-input v-model="line.szName" placeholder="计时条文字" size="small"></el-input>
                        </td>
                        <!-- 重复触发限制 -->
                        <td>
                            <el-input
                                v-model.number="line.nRefresh"
                                placeholder=""
                                size="small"
                                class="u-refresh"
                            ></el-input>
                        </td>
                        <!-- 唯一标识符 -->
                        <td>
                            <el-input
                                v-model="line.key"
                                placeholder="如不清楚请留空"
                                size="small"
                                class="u-key"
                            ></el-input>
                        </td>
                        <!-- 过图不消失 -->
                        <td>
                            <el-switch v-model="line.bHold" active-color="#13ce66"> </el-switch>
                        </td>
                        <!-- 图标 -->
                        <td>
                            <el-input v-model.number="line.nIcon" placeholder="" size="small" class="u-icon">
                                <img class="u-pic" slot="prepend" :src="getIcon(line.nIcon)" />
                            </el-input>
                        </td>
                        <!-- 倒计时颜色 -->
                        <td>
                            <el-select
                                v-model.number="line.nFrame"
                                :width="20"
                                placeholder=""
                                class="u-color-select"
                                popper-class="m-color-select-popper"
                            >
                                <el-option v-for="(color, id) in cdcolors" :key="id" :value="id" label="">
                                    <div class="u-color-option" :style="{ background: bgColor(id) }">
                                        {{ id }}: {{ color }}
                                    </div>
                                </el-option>
                                <span
                                    slot="prefix"
                                    class="u-color-block"
                                    :style="{ background: bgColor(line.nFrame) }"
                                ></span>
                            </el-select>
                        </td>
                        <!-- 团队通知 -->
                        <td>
                            <el-switch v-model="line.bTeamChannel" active-color="#13ce66"> </el-switch>
                        </td>
                        <td>
                            <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="del(index)">
                                删除
                            </el-button>
                        </td>
                    </tr>
                </draggable>
            </table>
        </div>
        <item-countdown-edit ref="countdownEdit"></item-countdown-edit>
    </fold-block>
</template>

<script>
import { cloneDeep } from "lodash";
import { iconLink } from "@jx3box/jx3box-common/js/utils.js";
import { getIcon } from "@/assets/js/dbm/common.js";
import { itemHasProp } from "@/utils/dbm/item";
import { mapState } from "vuex";

import FoldBlock from "@/components/dbm/common/fold_block.vue";
import ItemCountdownEdit from "./item_countdown_edit.vue";

import cdcolors from "@/assets/data/dbm/countdown_colors.json";
import types from "@/assets/data/dbm/types.json";

import draggable from "vuedraggable";

export default {
    name: "itemCountdown",
    props: ["data", "type", "icon"],
    data: function () {
        return {
            defaultItem: {
                nClass: "",
                nTime: "",
                szName: "",
                nRefresh: "",
                key: "",
                bHold: false,
                nIcon: this.icon || 13,
                nFrame: "",
                bTeamChannel: false,
            },
            events: types.events,
            drag: false,
            cdcolors,
        };
    },
    watch: {
        data: {
            deep: true,
            handler: function (newval) {
                // 时间轴的2种值形态
                newval.forEach((item) => {
                    if (item.nTime && !isNaN(item.nTime)) {
                        item.nTime = Number(item.nTime);
                    }
                });
                this.$emit("update", newval);
            },
        },
        icon: function (resourceIcon) {
            this.defaultItem.nIcon = resourceIcon || 13;
        },
    },
    methods: {
        iconLink,
        getIcon,
        hasProp(prop) {
            return itemHasProp(this.item.type, prop);
        },
        bgColor(i) {
            return cdcolors[i];
        },
        add() {
            this.data.push(cloneDeep(this.defaultItem));
        },
        del(i) {
            this.data.splice(i, 1);
        },
        reset() {
            this.data = cloneDeep(this.defaultItem);
        },
        showSzName(line) {
            return !line.nTime || !isNaN(Number(line.nTime));
        },
        editLine(line, index) {
            this.$refs["countdownEdit"].open(line, index);
        },
    },
    computed: {
        ...mapState(["item"]),
    },
    components: { FoldBlock, draggable, ItemCountdownEdit },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_countdown.less";
</style>
