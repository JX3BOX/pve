<template>
    <div class="m-skill-item">
        <!-- 图标 -->
        <img class="u-icon" src="@/assets/img/fb/iskill.png" />

        <!-- 原始ID -->
        <template v-if="AdvancedMode">
            <Mark
                v-if="skill.origin_id"
                class="u-id u-mark"
                :value="skill.origin_id || 0"
                v-clipboard:copy="skill.origin_id"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
            />
        </template>

        <div class="u-title">
            <!-- 名字 -->
            <span class="u-name">
                {{ name }}
                <!-- 原始技能 -->
                <template v-if="AdvancedMode">
                    <a v-if="skill.origin_name" :href="skill.origin_id | getDBlink" target="_blank">
                        <i class="el-icon-connection"></i>
                        {{ skill.origin_name || "未知" }}
                    </a>

                    <!-- 技能特性 -->
                    <em v-if="skill.isPenetration">(穿透)</em>
                    <em v-if="skill.isPuncture">(穿刺)</em>
                </template>
            </span>

            <!-- 伤害 -->
            <template v-if="AdvancedMode">
                <div class="u-damage" v-if="skill.tSkillData.length">
                    <span class="u-label">
                        伤害值
                        <!-- <em>nDamageBase</em> -->
                    </span>
                    <span class="u-data-group" v-for="(g, i) in skill.tSkillData" :key="i">
                        <el-tooltip class="item" effect="dark" placement="top">
                            <div slot="content">
                                <span>
                                    <span>{{ keymap.nDamageRand.desc }}</span>
                                    <span>(nDamageRand)</span>
                                    <strong>{{ g.nDamageRand }}</strong>
                                </span>
                                <br />
                                <span>
                                    <span>{{ keymap.nCostMana.desc }}</span>
                                    <span>(nCostMana)</span>
                                    <strong>{{ g.nCostMana }}</strong>
                                </span>
                            </div>
                            <span>
                                <em>nDamageBase</em>
                                <b>{{ keymap.nDamageBase.desc }}</b>
                                <strong>{{ g.nDamageBase }}</strong>
                            </span>
                        </el-tooltip>
                    </span>
                </div>
            </template>
        </div>

        <!-- 属性 -->
        <div class="u-props" v-if="skill.props.length">
            <!-- 详解版 -->
            <template v-if="AdvancedMode">
                <skill-item-props :data="skill.props" />
            </template>
            <!-- 简单版 -->
            <template v-else>
                <div class="u-prop" v-for="(g, i) in skill.props" :key="i">
                    <b>{{ keymap[g.prop] ? keymap[g.prop].desc : g.prop }}</b>
                    <em>{{ g.prop }}</em>
                    <el-tooltip effect="dark" :content="g.prop | propTips" placement="right">
                        <strong>
                            {{
                            g.value | valueFilter
                            }}
                        </strong>
                    </el-tooltip>
                </div>
            </template>
        </div>

        <!-- 其他调用 -->
        <!-- <template v-if="AdvancedMode">
            <el-collapse accordion class="u-call-box" v-if="skill.call.length">
                <el-collapse-item>
                    <template slot="title">
                        ✿ 附加效果组
                    </template>
                    <div class="u-call" v-for="(g, i) in skill.call" :key="i">
                        <skill-item-call :data="g" />
                    </div>
                </el-collapse-item>
            </el-collapse>
        </template>-->

        <!-- <template v-if="!AdvancedMode">
            <div class="u-private">
                <i class="el-icon-lock"></i> 更多词条仅
                <a href="/vip/premium?from=database_npc" target="_blank">高级/专业版会员</a>可见
            </div>
        </template> -->
    </div>
</template>

<script>
import keymap from "@/assets/data/fb/keymap.json";
import skill_item_props from "@/components/fb/skill/skill_item_props.vue";
export default {
    name: "skill_item",
    props: ["hasRight", "data", "name"],
    data: function () {
        return {
            keymap,
        };
    },
    computed: {
        AdvancedMode: function () {
            return true;
            // return this.hasRight;
        },
        skill: function () {
            return this.data;
        },
    },
    methods: {
        onCopy: function (val) {
            this.$notify({
                title: "复制成功",
                message: "复制内容 : " + val.text,
                type: "success",
            });
        },
        onError: function () {
            this.$notify.error({
                title: "复制失败",
                message: "请手动复制",
            });
        },
    },
    filters: {
        valueFilter: function (val) {
            return Array.isArray(val) ? val.join(" ") : val;
        },
        propTips: function (key) {
            return keymap[key] ? keymap[key]["remark"] : key;
        },
        getDBlink: function (val) {
            return "/app/database/?type=skill&query=" + val;
        },
    },
    mounted: function () {},
    components: {
        "skill-item-props": skill_item_props,
        // "skill-item-call": skill_item_call,
    },
};
</script>
