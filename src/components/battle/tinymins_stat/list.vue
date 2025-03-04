<template>
    <div class="m-stat-damage">
        <template v-if="mode === 'list'">
            <list-header class="m-stat-damage-header" :info="info" :overview="overview"></list-header>
            <list-common :data="listData" :teammates="teammates" @view="view">
                <template slot="header"
                    ><img svg-inline src="@/assets/img/battle/raid/skill.svg" class="u-title-icon" alt="" />{{
                        summaryTitle
                    }}</template
                >
            </list-common>
        </template>
        <template v-else>
            <single :data="current" :info="info" v-loading="loading"></single>
        </template>
    </div>
</template>

<script>
import { getSkillData, getTargetData } from "@/utils/battle/tinymins_v2/skill.js";
import listCommon from "./list_common.vue";
import listHeader from "./list_header.vue";
import single from "./single.vue";

export default {
    name: "list",
    props: ["info", "data", "mode"],
    components: {
        listCommon,
        listHeader,
        single,
    },
    model: {
        prop: "mode", //向上同步的数据
        event: "update", //向上同步数据的事件
    },
    data: function () {
        return {
            current: "",
            loading: false,
        };
    },
    computed: {
        type() {
            return this.$store.state.type;
        },
        combatRaw() {
            return this.$store.state.data;
        },
        overview: function () {
            return this.data[this.type]?.["overview"];
        },
        listData: function () {
            return this.data[this.type]?.["playerData"];
        },
        teammates: function () {
            return this.data["teammates"];
        },
        summaryTitle: function () {
            switch (this.type) {
                case "damage":
                    return "伤害总览";
                case "heal":
                    return "治疗总览";
                case "beHeal":
                    return "承疗总览";
                case "beDamage":
                    return "承伤总览";
                case "absorb":
                    return "化解总览";
                default:
                    return "";
            }
        },
    },
    methods: {
        view: function (item) {
            this.$emit("update", "single");
            this.renderSkills(item);
        },
        async renderSkills(item) {
            this.loading = true;
            item._skills = await getSkillData(item.skills);
            const __targets = JSON.parse(item.targets);
            item._targets = await getTargetData(__targets.data, this.combatRaw);

            this.current = item;
            if (this.current) {
                this.loading = false;
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/tinymins_stat/damage_list.less";
</style>
