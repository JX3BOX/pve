<template>
    <div class="m-fb-skill-format" v-if="data">
        <div class="u-prop" v-for="(g, i) in data" :key="i">
            <template v-if="!ignore_props.includes(g.prop)">
                <b class="u-prop-name">{{keymap[g.prop] ? keymap[g.prop].desc : g.prop}}</b>
                <em class="u-prop-key">{{ g.prop }}</em>
                <el-tooltip effect="dark" :content="g.prop | propTips" placement="right">
                    <strong class="u-prop-value">
                        <!-- 扇形角度 -->
                        <template v-if="g.prop == 'nAngleRange'">{{ g.value | formatAngle }}</template>

                        <!-- 高度 -->
                        <template v-else-if="g.prop == 'nHeight'">
                            {{ nHeight }}
                            <span class="u-tip">{{ nHeight | tipHeight }}</span>
                        </template>
                        <template v-else-if="g.prop == 'nCastHeight'">
                            <template v-if="g.value">{{g.value | valueFilter}}</template>
                            <template v-else>{{ nHeight }}</template>
                        </template>

                        <!-- 目标数 -->
                        <template v-else-if="g.prop == 'nTargetCountLimit'">
                            <template v-if="Number(g.value) < 0">无限制</template>
                            <template v-else>最多{{ Number(g.value) }}人</template>
                        </template>

                        <!-- 读条时间 -->
                        <template v-else-if="g.prop == 'nPrepareFrames'">{{ nPrepare }}秒</template>
                        <template v-else-if="g.prop == 'nChannelFrame'">{{ nChannel }}秒</template>

                        <!-- 打断几率 -->
                        <template
                            v-else-if="
                                g.prop == 'nBeatBackRate' ||
                                    g.prop == 'nBrokenRate'
                            "
                        >{{ g.value | formatBreak }}</template>
                        <template
                            v-else-if="g.prop == 'nDismountingRate'"
                        >{{ g.value | formatPercent }}</template>

                        <!-- 默认 -->
                        <template v-else>{{ g.value | valueFilter }}</template>
                    </strong>
                </el-tooltip>
            </template>
        </div>
    </div>
</template>

<script>
import keymap from "@/assets/data/fb/keymap.json";
export default {
    name: "skill_format",
    props: ["data"],
    data: function () {
        return {
            keymap,
            detail: {},
            ignore_props: ["nChannelInterval"],
        };
    },
    computed: {
        nHeight: function () {
            let val = this.detail["nHeight"];
            if (Array.isArray(val) && val.includes("LENGTH_BASE")) {
                val = val[0];
            }
            return Array.isArray(val) ? val.join(" ") : val;
        },
        nChannel: function () {
            let total = this.calcProp(this.detail["nChannelFrame"]);
            let per = this.calcProp(this.detail["nChannelInterval"]);
            let val = total / per;
            return val;
        },
        nPrepare: function () {
            let val = this.detail["nPrepareFrames"];
            if (Array.isArray(val)) {
                val = this.calcProp(val[0]) * val[2];
            }
            return parseFloat(val / 16);
        },
    },
    methods: {
        calcProp: function (val) {
            if (Array.isArray(val)) {
                return this.calcProp(val[0]) * val[2];
            } else {
                return val;
            }
        },
    },
    filters: {
        valueFilter: function (val) {
            if (
                Array.isArray(val) &&
                (val.includes("LENGTH_BASE") || val.includes("PERCENT_BASE"))
            ) {
                return val[0];
            } else if (val === true) {
                return "是";
            } else if (val === false) {
                return "否";
            }
            return Array.isArray(val) ? val.join(" ") : val;
        },
        formatHeight: function (val) {
            let _val = val;
            if (Array.isArray(val) && val.includes("LENGTH_BASE")) {
                _val = val[0];
            }
            return Array.isArray(_val) ? _val.join(" ") : _val;
        },
        formatBreak: function (val) {
            let _val = val;
            if (Array.isArray(val) && val.includes("PERCENT_BASE")) {
                _val = val[0];
            }
            return _val ? ((_val * 1024) / 1024) * 100 + "%" : "不可";
        },
        formatAngle: function (val) {
            return parseInt((val * 360) / 256) + "°";
        },
        formatPercent: function (val) {
            return ((val * 1024) / 1024) * 100 + "%";
        },
        propTips: function (key) {
            return keymap[key]
                ? keymap[key]["shortmark"] || keymap[key]["remark"]
                : key;
        },
        tipHeight: function (val) {
            if (val <= 3) {
                return "(2段跳可规避)";
            } else if (val <= 12.8) {
                return "(扶摇可规避)";
            } else if (val <= 14.2) {
                return "(扶摇+2段跳可规避)";
            }
        },
    },
    watch: {
        data: {
            deep: true,
            handler: function (val) {
                val &&
                    val.forEach((item) => {
                        this.detail[item.prop] = item.value;
                    });
            },
            immediate: true,
        },
    },
    mounted: function () {},
    components: {},
};
</script>
