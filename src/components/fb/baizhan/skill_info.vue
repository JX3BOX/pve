<template>
    <div class="m-skill-info">
        <div class="u-skill-header">
            <div v-if="skill.isPassive" class="u-skill-passive">
                <div class="u-img-wrap">
                    <img :src="iconLink(skill.skillIconId)" />
                </div>
            </div>
            <div v-else class="u-skill-img">
                <img :src="iconLink(skill.skillIconId)" />
            </div>
            <div class="u-skill-info">
                <div class="u-id">ID {{ skill.dwInSkillID }}</div>
                <div class="u-title">{{ skill.szSkillName }}</div>
            </div>
        </div>
        <div class="u-skill-item">
            <div class="u-item-title">掉落来源</div>
            <div class="u-item-content">
                <div v-if="skill.szBossName" class="u-avatar">
                    <img
                        :src="getAvatar(skill.szBossName) || `${__imgRoot}fbcdpanel02_51.png`"
                        :alt="skill.szBossName"
                    />
                </div>
                <div class="u-name" :class="!skill.szBossName && 'u-no-name'">{{ skill.szBossName || "未知" }}</div>
            </div>
        </div>
        <div class="u-skill-item">
            <div class="u-item-title">技能信息</div>
            <div class="u-list">
                <div class="u-info u-cost">
                    <span class="u-label">占用</span>
                    <div class="u-cost-list">
                        <img v-for="point in skill.nCost" :key="point" :src="`${__imgRoot}baizhan_6.png`" />
                    </div>
                </div>
                <div class="u-info u-pz" v-if="skill.nColor">
                    <span class="u-label">破绽</span>
                    <div class="u-color" :class="`u-color__${skill.nColor}`">{{ skill.nColor ? "" : "-" }}</div>
                </div>
                <div v-if="skill.isPassive || (skill.nColor === 0 && !skill.isPassive)" class="u-info u-jn">
                    <img v-if="skill.isPassive" src="@/assets/img/fb/baizhan/passive.svg" svg-inline />
                    <img
                        v-if="skill.nColor === 0 && !skill.isPassive"
                        src="@/assets/img/fb/baizhan/other_skill.svg"
                        svg-inline
                    />
                </div>
            </div>
            <div class="u-list">
                <div class="u-info" v-for="item in skill.types" :key="item">{{ item }}</div>
            </div>
        </div>
        <div class="u-skill-item">
            <div class="u-item-title u-skill-title">
                <span>技能介绍</span>
                <img v-if="isShow" src="@/assets/img/fb/baizhan/showup.svg" @click="isShow = false" />
                <img v-else src="@/assets/img/fb/baizhan/hide.svg" @click="isShow = true" />
            </div>
            <div class="u-skill-desc" v-html="skillDesc"></div>
        </div>
        <div class="u-skill-btn" @click="getUrl">查看详细数据</div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "SkillInfo",
    inject: ["__imgRoot"],
    data() {
        return {
            isShow: false,
        };
    },
    computed: {
        ...mapState({
            currentSkill: (state) => state.baizhan.currentSkill,
            bosses: (state) => state.baizhan.bosses,
            types: (state) => state.baizhan.types,
        }),
        skillTypes() {
            return this.types.skill_types;
        },
        skill() {
            return {
                ...this.currentSkill,
                isPassive: ~~this.currentSkill?.Skill?.IsPassiveSkill,
                types: this.currentSkill.szType.map((item) => this.skillTypes.find((type) => type.id === item)?.name),
            };
        },
        skillDesc() {
            const desc = this.currentSkill?.ParsedSkill?.desc || "";
            return desc
                .replace(/\[.*?\]/g, (match, key) => {
                    return `<span class="${this.isShow ? "is-show" : "is-hidden"}">${match}</span>`;
                })
                .replaceAll("\\n", "<br><br>");
        },
    },
    methods: {
        iconLink,
        getUrl() {
            const domain = process.env.NODE_ENV === "development" ? __Root : location.origin + "/";
            const url = domain + `app/database/?type=skill&query=${this.skill.dwInSkillID}`;
            window.open(url, "_blank");
        },
        getAvatar(name) {
            return this.bosses.find((item) => item.name === name)?.avatar || "";
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/skill_info.less";
</style>
