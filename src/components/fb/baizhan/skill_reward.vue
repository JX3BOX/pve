<template>
    <div class="m-skill-reward">
        <div class="u-header">技能掉落</div>
        <div class="u-skill-list">
            <a
                class="u-skill-item"
                :class="`u-skill-icon__${skill.skillColor}`"
                v-for="skill in skills"
                :key="skill.skillId"
                :href="getUrl(skill.skillId)"
                target="_blank"
                @click.prevent="toSkill(skill)"
            >
                <div class="u-skill-left">
                    <div class="u-img-wrap" :class="skill.isPassive && 'is-passive'">
                        <img class="u-skill-icon" :src="skill.skillIcon" :alt="skill.skillName" />
                    </div>
                    <span>{{ skill.skillName }}</span>
                </div>
                <div class="u-skill-right">
                    <img v-if="skill.isPassive" src="@/assets/img/fb/baizhan/passive.svg" svg-inline />
                    <img
                        v-if="skill.skillColor === 0 && !skill.isPassive"
                        src="@/assets/img/fb/baizhan/other_skill.svg"
                        svg-inline
                    />
                </div>
            </a>
        </div>
    </div>
</template>

<script>
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import { mapState } from "vuex";
export default {
    name: "SkillReward",
    props: ["skills"],
    computed: {
        ...mapState({
            allSkills: (state) => state.baizhan.skills,
        }),
    },
    methods: {
        getUrl(id) {
            const domain = process.env.NODE_ENV === "development" ? __Root : location.origin + "/";
            return domain + `app/database/?type=skill&query=${id}`;
        },
        toSkill(skill) {
            this.$store.commit("baizhan/setState", {
                key: "currentSkill",
                val: this.allSkills.find(
                    (item) => item.dwInSkillID === skill.skillId || item.dwOutSkillID === skill.skillId
                ),
            });
            this.$store.commit("baizhan/setState", {
                key: "activeTab",
                val: "skill",
            });
            this.$router.push({ query: { skill: skill.skillName } });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/skill_reward.less";
</style>
