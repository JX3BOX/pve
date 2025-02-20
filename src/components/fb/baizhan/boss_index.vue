<template>
    <div class="p-boss-info">
        <div class="m-boss-info" :class="!topic && 'is-no-data'">
            <img
                class="u-default"
                v-if="!topic || topic === '通用'"
                src="@/assets/img/fb/baizhan/right_default.svg"
                svg-inline
            />
            <template v-else>
                <div class="m-boss">
                    <div class="u-boss-info">
                        <img class="u-boss-avatar" :src="current.avatar" />
                        <div class="u-name-info">
                            <div class="u-label">{{ isImportant ? "精英首领" : "首领" }}</div>
                            <div class="u-name">{{ topic }}</div>
                        </div>
                    </div>
                </div>
                <SkillReward :skills="current.skills"></SkillReward>
                <MapSimple></MapSimple>
            </template>
        </div>
        <div class="m-boss-raider" :class="!topic && 'no-boss'">
            <div class="u-header">
                <div class="u-title">相关攻略</div>
                <a :href="getLink()" target="_blank">查看全部</a>
            </div>
            <BossRaider></BossRaider>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import topicObj from "@/assets/data/fb/baizhan_topic.json";
import BossRaider from "./boss_raider.vue";
import SkillReward from "./skill_reward.vue";
import MapSimple from "./map_simple.vue";
export default {
    name: "BossInfo",
    components: {
        BossRaider,
        SkillReward,
        MapSimple,
    },
    data() {
        return {
            topicObj,
        };
    },
    computed: {
        ...mapState({
            bosses: (state) => state.baizhan.bosses,
            topic: (state) => state.baizhan.currentBossName,
            skills: (state) => state.baizhan.skills,
            maps: (state) => state.baizhan.maps,
        }),
        indexes() {
            const indexes = [];
            this.maps.forEach((item, index) => {
                if (item.bossName === this.topic) {
                    indexes.push(index + 1);
                }
            });
            return indexes;
        },
        isImportant() {
            return this.indexes.some((i) => i % 10 === 0);
        },
        current() {
            const currentBoss = this.bosses.find((item) => item.name === this.topic) || {};
            const skills = currentBoss.skills || [];
            return {
                ...currentBoss,
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
    watch: {},
    methods: {
        getLink() {
            const domain = process.env.NODE_ENV === "development" ? __Root : location.origin + "/";
            const url = domain + `fb/?fb_name=百战异闻录`;
            return url;
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/fb/baizhan/boss_info.less";
</style>
