<template>
    <div class="u-stone-item" :class="{ active: stone.ID === selectedStone.ID }">
        <el-popover
            v-if="stone"
            :visible-arrow="false"
            popper-class="m-stone-item-pop"
            trigger="hover"
            :close-delay="0"
            v-model="visible"
        >
            <img slot="reference" class="u-stone-icon" :src="iconLink(stone.icon)" :alt="stone.Name" />
            <div class="u-stone-box">
                <ul class="u-stone-box-wrapper">
                    <li class="u-stone-box-name" :class="stone.stone_level | stoneLevel">
                        {{ stone.Name }}
                    </li>
                    <li class="u-stone-desc">使用：熔嵌到武器上，可给武器带来强大的威力。</li>
                    <li v-for="(attr, index) in stoneAttributes" :key="attr.attr">
                        <div class="u-stone-attr">
                            <div class="u-stone-attr-index">属性{{ index + 1 }}：</div>
                            <div class="u-stone-attr-desc">{{stoneAttributeDesc(attr, stone, index)}}</div>
                        </div>
                        <div class="u-stone-condition">
                            <div>条件{{ index + 1 }}：</div>
                            <div>
                                <div>全身的(五行石)大于等于{{ attr.count }}颗</div>
                                <div>(五行石)等级和大于等于{{ attr.intensity }}级</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </el-popover>
        <div>
            <span class="u-stone-name" :class="'stoneLevel-' + stone.stone_level">{{ stone.Name }}</span>
            <slot></slot>
            <el-button
                class="u-stone-clear"
                icon="el-icon-circle-close"
                size="small"
                type="text"
                @click.stop="cancelSelect"
                v-show="stone.ID == selectedStone.ID"
            ></el-button>
        </div>
    </div>
</template>

<script>
import attributeDesc from "@/assets/data/pz/attr_desc.json";
import { extraSecondaryAttr } from "@/utils/pz/display.js";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { mapGetters } from "vuex";
export default {
    props: ["stone", "selectedStone"],
    data: () => ({
        visible: false,
        attributeDesc,
    }),
    computed: {
        ...mapGetters(["schema_client"]),
        stoneAttributes: function ({ stone }) {
            if (stone) {
                return [
                    {
                        attr: stone.Attribute1ID,
                        count: ~~stone.DiamondCount1,
                        intensity: ~~stone.DiamondIntensity1,
                        value: extraSecondaryAttr(stone.Attribute1ID, ~~stone.Attribute1Value1),
                    },
                    {
                        attr: stone.Attribute2ID,
                        count: ~~stone.DiamondCount2,
                        intensity: ~~stone.DiamondIntensity2,
                        value: extraSecondaryAttr(stone.Attribute2ID, ~~stone.Attribute2Value1),
                    },
                    {
                        attr: stone.Attribute3ID,
                        count: ~~stone.DiamondCount3,
                        intensity: ~~stone.DiamondIntensity3,
                        value: extraSecondaryAttr(stone.Attribute3ID, ~~stone.Attribute3Value1),
                    },
                ].filter((s) => s.attr);
            }
            return [];
        },
    },
    filters: {
        stoneLevel: function (level) {
            if (level > 4) return "purple";
            if (level > 2) return "blue";
            return "green";
        },
    },
    methods: {
        iconLink(val) {
            return iconLink(val, this.schema_client);
        },
        cancelSelect: function () {
            this.$emit("cancelSelect");
        },
        stoneAttributeDesc: function(attribute, stone, index) {
            if(attribute.attr == 'atExecuteScript') {
                return stone[`Attribute${index + 1}Value2`];
            }else {
                return attributeDesc[attribute.attr] + attribute.value;
            }
        }
    },
};
</script>

<style lang="less">
.m-stone-item-pop {
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    // color:
    padding: 0;
    background-color: @q_background;

    .u-stone-box {
        margin: -2px;
    }

    .u-stone-box-wrapper {
        .pr;
        padding: 9px 10px 10px;
        line-height: 1.5;
        letter-spacing: 1px;
        // font-size: 12px;

        &::before {
            content: "";
            .pa;
            top: 0;
            left: 0;
            .w(100%);
            .h(100%);
            border: 1px solid @q_background;
            border-radius: 2px;
            box-sizing: border-box;
            pointer-events: none;
        }
    }

    .u-stone-box-name {
        // font-size: 14px;
        &.green {
            color: @q_green;
        }
        &.blue {
            color: @q_blue;
        }
        &.purple {
            color: @q_purple;
        }
    }

    .u-stone-desc {
        color: @q_font_green;
    }

    .u-stone-attr,
    .u-stone-condition {
        display: flex;
        justify-content: flex-start;
        max-width: 320px;
    }

    .u-stone-attr {
        color: @q_yellow;
    }

    .u-stone-attr-index {
        flex-shrink: 0;
    }

    .u-stone-condition {
        color: #ffb;
    }
}
</style>
