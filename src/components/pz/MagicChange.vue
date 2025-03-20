<!-- 装备熔铸组件 -->
<template>
    <div class="u-magic">
        <el-alert type="warning" :closable="false">
            <span slot="title"
                ><i class="el-tooltip el-icon-info"></i> 熔铸功能的数据算法来源于样本推测,
                如有数据不准确的现象请带游戏内装备截图在界面右上角进行反馈</span
            >
        </el-alert>
        <p class="u-maigc-attribute__title">熔铸属性选择</p>
        <div class="u-magic-attribute">
            <el-select
                v-model="be_changed_attribute"
                placeholder="请选择被洗属性"
                :clearable="true"
                @change="applyMagicChange"
                @clear="cancelMagicChange"
            >
                <el-option
                    v-for="item in allow_change_attributes"
                    :key="item.attr"
                    :label="item.desc"
                    :value="item.attr"
                >
                </el-option>
            </el-select>
            <i class="u-magic-arrow el-icon-right"></i>
            <el-select
                v-model="target_attribute"
                placeholder="请选择目标属性"
                :clearable="true"
                @change="applyMagicChange"
                @clear="cancelMagicChange"
            >
                <el-option
                    v-for="item in allow_target_attributes"
                    :key="item.attr"
                    :label="item.desc"
                    :value="item.attr"
                >
                </el-option>
                <span slot="empty" class="u-magic-target__empty">请先选择被洗属性</span>
            </el-select>
        </div>
        <p class="u-maigc-level__title">
            熔铸品级选择：<span class="u-magic-level__value">{{ format_level(change_level) }}熔铸</span>
        </p>
        <div class="u-magic-level">
            <el-slider
                v-model="change_level"
                :step="1"
                :min="1"
                :max="9"
                :format-tooltip="format_level"
                show-stops
                @input="applyMagicChange"
            >
            </el-slider>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import attr_desc from "@/assets/data/pz/attr_desc.json";
import equip_magic_changes from "@/assets/data/pz/equip_magic_changes.json";
import { magic_change_calc } from "@/utils/pz/magic_change.js";
import { increase_value_calc } from "@/utils/pz/magic_change.js";

export default {
    name: "MagicChange",
    data: () => ({
        be_changed_attribute: "",
        target_attribute: "",
        change_level: 9,

        change_level_max: 9,
    }),
    computed: {
        ...mapGetters(["activeSnapshot"]),
        equip_attributes() {
            let equip = this.activeSnapshot.equip;
            let result = {};
            let base_max = 6;
            let magic_max = 12;
            // 基础属性, 白字
            for (let i = 1; i <= base_max; i++) {
                let attr = equip[`Base${i}Type`];
                if (!attr) break;
                let attr_value = ~~equip[`Base${i}Min`];
                result[attr] = attr_value;
            }
            // Magic属性, 绿字
            for (let i = 1; i <= magic_max; i++) {
                let attr = equip[`_Magic${i}Type`]?.attr;
                let attr_name = attr?.[0];
                if (!attr) break;
                let attr_value = ~~attr[1] || ~~attr[3];
                result[attr_name] = attr_value;
            }
            return result;
        },
        allow_change_attributes: function () {
            let result = [];
            for (let attr_name in this.equip_attributes) {
                let attr_value = this.equip_attributes[attr_name];
                //let decrease_value = decrease_value_calc(attr_value);
                result.push({
                    attr: attr_name,
                    value: attr_value,
                    desc: `${attr_desc[attr_name]}${attr_value}` /* + `(-${decrease_value})` */,
                });
            }
            // 过滤掉熔铸表里妹有的属性
            result = result.filter((item) => equip_magic_changes.some((change) => change.from === item.attr));
            return result;
        },
        allow_target_attributes: function () {
            let result = [];
            let magic_change = equip_magic_changes.find((change) => change.from === this.be_changed_attribute);
            if (!magic_change) return [];
            let targets = magic_change?.targets;
            // 获取可以转化的属性
            for (let target of targets) {
                let increase_value = increase_value_calc({
                    from_name: this.be_changed_attribute,
                    from_value: this.equip_attributes[this.be_changed_attribute],
                    to_name: target,
                    level: this.change_level,
                });
                result.push({ attr: target, desc: attr_desc[target] + increase_value });
                //缘起90全局屏蔽命中，写的不好能跑就行
                result = result.filter(item => !item.attr.includes("Hit"));
            }
            // 过滤掉装备里已经有的属性
            // 这里逻辑有些乱...这个过滤写的太飘了。意思就是，先获得源属性可以转换成的所有属性，然后对这些属性进行一个筛
            // 筛的条件是，对于每一个可能的目标属性，要求不满足：该属性去掉atAllType关键字后是装备里某条属性的子串
            // 虽然讲了还是有些混乱，但是...日后再改吧
            result = result.filter(
                (item) =>
                    !this.allow_change_attributes.some((attr) => {
                        return attr.attr.includes(item.attr.replace(/atAllType|atMagic|atPhysics/g, ""));
                    })
            );
            return result;
        },
    },
    methods: {
        format_level: function (level) {
            let chars = "一二三四五六七八九";
            return chars[level - 1] + "品";
        },
        //应用洗练选项，计算洗练后的属性，将属性应用到快照，打上熔铸标记
        applyMagicChange: function () {
            if (!this.be_changed_attribute || !this.target_attribute) return;
            // 获得需要洗练的属性的值
            let magic_change_value = this.allow_change_attributes.find(
                (item) => item.attr == this.be_changed_attribute
            ).value;
            let [from_change, to_change] = magic_change_calc({
                from_name: this.be_changed_attribute,
                from_value: magic_change_value,
                to_name: this.target_attribute,
                level: this.change_level,
            });
            //给这个部位的快照添加一个标记，便于打开装备自动选择洗练属性
            this.$set(this.activeSnapshot, "magic_change", {
                from: this.be_changed_attribute,
                from_value: from_change,
                to: this.target_attribute,
                to_value: to_change,
                level: this.change_level,
            });
        },
        //清掉组件的洗练选项
        cancelMagicChange: function () {
            this.be_changed_attribute = "";
            this.target_attribute = "";
            this.activeSnapshot.magic_change = {};
        },
    },
    watch: {
        activeSnapshot: {
            deep: true,
            immediate: true,
            handler: function (newSnapshot) {
                if (newSnapshot?.magic_change?.from) {
                    this.be_changed_attribute = newSnapshot.magic_change.from;
                    this.target_attribute = newSnapshot.magic_change.to;
                    this.change_level = newSnapshot.magic_change.level;
                } else {
                    this.be_changed_attribute = "";
                    this.target_attribute = "";
                    this.change_level = 9;
                }
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/magic_change.less";
</style>
