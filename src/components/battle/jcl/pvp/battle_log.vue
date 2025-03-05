<template>
    <div class="m-battle-log">
        <div class="u-log-title">日志记录</div>
        <RecycleScroller class="u-log-scroll" :items="skillLog" :item-size="80" key-field="index" v-slot="{ item }">
            <div class="u-scroll-item">
                <div class="u-item-player">
                    <jcl-entity :id="item.source.v" :clickRedirect="false" :size="24"></jcl-entity>
                </div>
                <div class="u-item-skill__wrapper">
                    <div class="u-item-skill">
                        <span class="u-skill-time" @click="testOutput(item)">
                            {{ secTotime(item.time) }}
                        </span>
                        <jcl-skill
                            :id="item.skillId"
                            type="skill"
                            :size="28"
                            :clickRedirect="true"
                            :vertical="true"
                            :showID="false"
                        ></jcl-skill>
                    </div>
                </div>
                <div class="u-item-player">
                    <jcl-entity :id="item.target.v" :clickRedirect="false" :size="24"></jcl-entity>
                </div>
            </div>
        </RecycleScroller>
    </div>
</template>
<script>
import { getSkillList } from "@/service/battle/node";
import JclSkill from "@/components/battle/jcl/common/skill.vue";
import JclEntity from "@/components/battle/jcl/common/entity.vue";

export default {
    name: "BattleLog",
    components: {
        JclSkill,
        JclEntity,
    },
    props: {
        time: {
            type: Number,
            default: 0,
        },
    },
    data: () => ({
        allSkillArr: [],
    }),
    computed: {
        skillLog() {
            if (this.allSkillArr.length) {
                return this.getSkillLog.filter((item) => this.getSkill(item.skillId, "skillName"));
            }
            return [];
        }, //筛选出有记录技能名称的最终数据用于展示
        getSkillLog() {
            const entities = window.$store.entities;
            return window.$store.rows
                .filter(
                    (item) =>
                        (item.type === 19 || item.type === 21) &&
                        item.content.t === "skill" &&
                        entities[item.source.v]?.name &&
                        entities[item.target.v]?.name
                )
                .map((item, index) => {
                    return {
                        ...item,
                        skillId: item.content.v.split("_")[0],
                        index,
                    };
                }); //技能释放日志;
        }, //筛选角色释放技能的数据
        secTotime() {
            return (s) => {
                let t = "";
                if (s > -1) {
                    let min = Math.floor(s / 60) % 60;
                    let sec = s % 60;
                    if (min < 10) {
                        t += "0";
                    }
                    t += min + ":";
                    if (sec < 10) {
                        t += "0";
                    }
                    t += sec.toFixed(0);
                }
                return t;
            };
        },
        getSkill() {
            return (val, type) => {
                return this.findValue(this.allSkillArr, val, "SkillID", type);
            };
        }, //获取技能信息
        findValue() {
            return (arr, val, valKey = "value", labelKey = "label") => {
                const list = arr.find((item) => item[valKey] == val);
                return list ? list[labelKey] : "";
            };
        },
    },
    watch: {},
    methods: {
        testOutput(item) {
            console.log(item);
        },
        async getAllSkill() {
            const res = await getSkillList(
                Array.from(
                    new Set(
                        this.getSkillLog.map((item) => {
                            return item.skillId;
                        })
                    )
                ).join(",")
            );
            if (res.data) {
                this.allSkillArr = res.data.map((item) => {
                    return {
                        skillName: item.Name, //item.SkillName,
                        SkillID: item.SkillID,
                        skillIcon: `https://icon.jx3box.com/icon/${item.IconID}.png`,
                    };
                });
            }
        },
    },
    mounted() {
        this.getAllSkill(); //获取本局全部的技能数据
    },
};
</script>
<style lang="less">
@import "~@/assets/css/battle/jcl/pvp/logs.less";
</style>
