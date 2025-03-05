<template>
    <div class="m-entity-details">
        <el-tabs v-model="active">
            <el-tab-pane v-if="displayDamage" label="伤害分析" name="damage"> </el-tab-pane>
            <el-tab-pane v-if="displayTreat" label="治疗分析" name="treat"> </el-tab-pane>
            <el-tab-pane v-if="displayBeDamaged" label="承伤分析" name="beDamaged"> </el-tab-pane>
            <el-tab-pane v-if="displayBeTreated" label="承疗分析" name="beTreated"> </el-tab-pane>
            <el-tab-pane v-if="displayDeath" label="死亡分析" name="death"> </el-tab-pane>
            <el-tab-pane v-if="displayBuff" label="BUFF分析" name="buff"> </el-tab-pane>
            <el-tab-pane v-if="displaySkill" label="技能分析" name="skill"> </el-tab-pane>
            <el-tab-pane v-if="displaySay" label="喊话分析" name="say"> </el-tab-pane>
            <el-tab-pane v-if="displayScene" label="场景分析" name="scene"> </el-tab-pane>
        </el-tabs>
        <keep-alive>
            <component :is="component" :type="active" :entityID="entityID"></component>
        </keep-alive>
    </div>
</template>

<script>
import EntitySkills from "./details/skills.vue";
import EntitySays from "./details/says.vue";
import EntityScenes from "./details/scenes.vue";
import EntityStats from "./details/stats.vue";
import EntityBuff from "./details/buffs.vue";
import EntityDeath from "./details/deaths.vue";

export default {
    name: "EntityDetails",
    props: ["info", "data", "entityID"],
    components: { EntitySkills, EntitySays, EntityScenes, EntityStats, EntityBuff },
    data: () => ({
        active: "",
    }),
    computed: {
        initiallyActiveTab: function () {
            if (this.displayDamage) return "damage";
            if (this.displayTreat) return "treat";
            if (this.displayBeDamaged) return "beDamaged";
            if (this.displayBeTreated) return "beTreated";
            if (this.displayDeath) return "death";
            if (this.displaySkill) return "skill";
            if (this.displaySay) return "say";
            if (this.displayBuff) return "buff";
            return "scene";
        },
        displaySkill: function () {
            return window.$store.entitySkill.hasOwnProperty(this.entityID);
        },
        displayDamage: function () {
            return window.$store.entityStat.damage.hasOwnProperty(this.entityID);
        },
        displayTreat: function () {
            return window.$store.entityStat.treat.hasOwnProperty(this.entityID);
        },
        displayBeDamaged: function () {
            return window.$store.entityStat.beDamaged.hasOwnProperty(this.entityID);
        },
        displayBeTreated: function () {
            return window.$store.entityStat.beTreated.hasOwnProperty(this.entityID);
        },
        displayScene: function () {
            return window.$store.entityScene.hasOwnProperty(this.entityID);
        },
        displaySay: function () {
            return window.$store.entitySay.hasOwnProperty(this.entityID);
        },
        displayBuff: function () {
            return window.$store.entityBuff.hasOwnProperty(this.entityID);
        },
        displayDeath: function () {
            return window.$store.entityDeath.hasOwnProperty(this.entityID);
        },
        component: function () {
            const components = {
                skill: EntitySkills,
                say: EntitySays,
                scene: EntityScenes,
                death: EntityDeath,
                damage: EntityStats,
                treat: EntityStats,
                beDamaged: EntityStats,
                beTreated: EntityStats,
                buff: EntityBuff,
            };
            return components[this.active];
        },
    },
    created: function () {},
    watch: {
        entityID: {
            immediate: true,
            handler: function () {
                this.active = this.initiallyActiveTab;
            },
        },
    },
};
</script>

<style></style>
