<template>
    <div v-if="current.dwBossID" class="m-right-info">
        <div class="u-boss-info">
            <div class="u-name-wrap">
                <img class="u-avatar" :src="current.bossAvatar" :alt="current.bossName" />
                <div class="u-name-info">
                    <div class="u-floor">
                        <span>第{{ current.floor }}层</span>
                    </div>
                    <div class="u-name" @click="toBoss(current.bossName)">{{ current.bossName }}</div>
                </div>
            </div>
            <div class="u-effect-wrap">
                <div class="u-header">层数效果</div>
                <div class="u-effect-desc" v-if="current.nEffectID">
                    <div class="u-title">
                        <img
                            class="u-effect-icon"
                            :src="current.effectIcon"
                            :alt="current.effectName"
                            @click.stop="toBuff(current)"
                        />
                        <div class="u-name">{{ current.effectName }}</div>
                    </div>
                    <div class="u-desc" v-html="current.effectDesc"></div>
                </div>
                <div v-else class="u-no-effect">当前层没有特殊效果</div>
            </div>
            <SkillReward :skills="current.skills"></SkillReward>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import SkillReward from "@/components/fb/baizhan/skill_reward.vue";
export default {
    name: "BInfo",
    components: {
        SkillReward,
    },
    computed: {
        ...mapState({
            currentBoss: (state) => state.baizhan.currentBoss,
            skills: (state) => state.baizhan.skills,
        }),
        current() {
            const skills = this.currentBoss?.boss?.skills || [];
            return {
                ...this.currentBoss,
                effectIcon: iconLink(this.currentBoss.effect?.dwIconID || 18505),
                effectName: this.currentBoss.effect?.szName,
                effectDesc: this.currentBoss.effect?.szDescription,
                skills: skills.map((skill) => {
                    const skillObj = this.skills.find(
                        (item) => item.dwInSkillID === skill || item.dwOutSkillID === skill
                    );
                    return {
                        skillId: skill,
                        skillName: skillObj?.szSkillName,
                        skillColor: skillObj?.nColor,
                        skillIcon: iconLink(skillObj?.skillIconId || 13),
                        isPassive: !!~~skillObj?.Skill?.IsPassiveSkill,
                    };
                }),
            };
        },
    },
    methods: {
        toBoss(bossName) {
            this.$store.commit("baizhan/setState", {
                key: "currentBossName",
                val: bossName,
            });
            this.$store.commit("baizhan/setState", {
                key: "activeTab",
                val: "boss",
            });
            this.$router.push({ query: { boss: bossName } });
        },
        toBuff(floor) {
            const domain = process.env.NODE_ENV === "development" ? __Root : location.origin + "/";
            const url = domain + `app/database/?type=buff&query=${floor.effect.buffID}&level=${floor.effect.buffLevel}`;
            window.open(url, "_blank");
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/map_level_info.less";
@import "~@/assets/css/fb/baizhan/skill_reward.less";
</style>
