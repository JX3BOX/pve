<template>
    <el-popover
        popper-class="m-attribute-pop"
        trigger="hover"
        placement="right"
        :visible-arrow="false"
        :open-delay="50"
    >
        <span slot="reference">
            <slot></slot>
        </span>
        <div class="m-attribute-pop-content">
            <div class="u-attr-name">{{ displayAttr(topName, true) }}</div>
            <template v-if="isHitPop">
                <div v-for="val in hitDetails" :key="val">
                    {{ val }}
                </div>
            </template>
            <template v-else>
                <div v-for="attr in attrDetails" :key="attr">
                    {{ displayAttr(attr) }}
                </div>
            </template>
        </div>
    </el-popover>
</template>

<script>
import simpleAttr from "@/assets/data/pz/attr_display_pop.js";
import descConvert from "@/assets/data/pz/attr_desc_panel.json";
import hitFn from "@/assets/data/pz/hit_map.js";

import { mapGetters } from "vuex";

export default {
    props: {
        attrName: {
            type: String,
            default: "",
        },
        attrs: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        ...mapGetters(["schema"]),
        level: function () {
            return this.schema.global_level;
        },
        attrDetails: function () {
            return simpleAttr?.[this.topName] || [];
        },
        withoutDetail: function () {
            return this.attrName.split(",").length === 1;
        },
        topName: function () {
            const _attrName = this.attrName.split(",");

            return _attrName[0];
        },
        isHitPop: function () {
            return this.attrName.endsWith("HitPercent");
        },
        hitDetails: function ({ attrs, attrName }) {
            const hit = (attrs[attrName] * 100).toFixed(2);

            return hitFn(hit, this.level) || [];
        },
    },
    data() {
        return {};
    },
    methods: {
        displayLabel: function (key, isTop = false) {
            // console.log(key)
            return isTop ? descConvert[key]?.name : descConvert[key]?.popname || descConvert[key]?.name;
        },
        displayAttr: function (key, isTop) {
            const { attrs } = this;
            const keys = key.split(",");
            if (keys.length === 1) {
                const value = attrs[key];
                if (key.endsWith("Percent") || key.endsWith("Rate")) {
                    return `${this.displayLabel(key, isTop)}${(value && (value * 100).toFixed(2) + "%") || value}`;
                }
                return `${this.displayLabel(key, isTop)}${value}`;
            } else {
                let display = "";
                keys.forEach((_key, index) => {
                    let _display = "";
                    const value = attrs[_key];
                    if (_key.endsWith("Percent") || _key.endsWith("Rate")) {
                        _display = `${this.displayLabel(_key, isTop)}${(value * 100).toFixed(2) + "%"}。`;
                    } else {
                        if (index === keys.length - 1) {
                            _display += this.displayLabel(_key, isTop) + ` ${value}` + "。";
                        } else {
                            _display += this.displayLabel(_key, isTop) + `${value}` + "，";
                        }
                    }

                    display += _display;
                });
                return display;
            }
        },
    },
};
</script>

<style lang="less">
.m-attribute-pop {
    padding: 10px;
    background-color: lighten(@q_background, 0.5);
    color: #fff;
    .fz(13px,20px);
    &-content {
        .u-attr-name {
            color: @q_score_orange;
        }
    }
}
</style>
