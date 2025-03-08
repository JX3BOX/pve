<template>
    <div class="p-skills">
        <el-table
            ref="table"
            class="m-table"
            :data="skills"
            height="83vh"
            :row-class-name="getRowClassName"
            @cell-mouse-enter="onMouse"
            @row-click="onClick"
        >
            <el-table-column label="技能" min-width="150">
                <template #default="{ row: skill }">
                    <div class="u-skill-cell">
                        <!--  <div class="u-skill-img" :class="`u-skill-icon__${skill.nColor}`">
                            <img :src="iconLink(skill.skillIconId)" />
                        </div> -->
                        <skill_icon :source="skill"></skill_icon>
                        <!-- <span>{{ skill.szSkillName }}</span> -->
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="!isIpad()" prop="szBossName" label="首领" sortable min-width="150">
                <template #default="{ row }">
                    {{ row.szBossName || "-" }}
                </template>
            </el-table-column>
            <el-table-column v-if="!isIpad()" prop="nCost" label="占用" sortable min-width="150">
                <template #default="{ row: skill }">
                    <div class="u-points">
                        <img v-for="point in skill.nCost" :key="point" :src="`${__imgRoot}baizhan_6.png`" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="!isIpad()" prop="nColor" label="破绽" sortable min-width="150">
                <template #default="{ row }">
                    {{ getColor(row.nColor) }}
                </template>
            </el-table-column>
            <el-table-column v-if="!isIpad()" prop="cd" label="调息" sortable min-width="150">
                <template #default="{ row }">
                    <span v-html="row.cd"></span>
                </template>
            </el-table-column>
            <el-table-column prop="szType" label="效果" min-width="150">
                <template #default="{ row }">
                    <div class="u-types">
                        <div class="u-type" v-for="item in getType(row.szType)" :key="item" v-html="item"></div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="!isNoteBook()" min-width="150">
                <template #default="{ row }">
                    <div class="u-detail-btn" @click="toDetail(row.dwInSkillID)">详细数据</div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { isPhone, isIpad, isNoteBook } from "@/utils";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import skill_icon from "./skill_icon.vue";

export default {
    name: "Skills",
    components: {
        skill_icon,
    },
    inject: ["__imgRoot"],
    data: () => ({
        skills: [],
        isPin: false,
    }),
    computed: {
        ...mapState({
            types: (state) => state.baizhan.types,
            skillList: (state) => state.baizhan.skills,
            params: (state) => state.baizhan.skillParams,
            currentSkill: (state) => state.baizhan.currentSkill,
        }),
        skillColors() {
            return this.types.skill_colors;
        },
        skillCosts() {
            return this.types.skill_costs;
        },
        skillTypes() {
            return this.types.skill_types;
        },
    },
    watch: {
        skillList: {
            immediate: true,
            deep: true,
            handler(list) {
                this.skills = list.map((item) => {
                    return {
                        ...item,
                        cd: item.ParsedSkill?.tooltip?.[3]?.[1] || "-",
                    };
                });
            },
        },
        params: {
            deep: true,
            handler(params) {
                const { color, cost, type, name, bossName } = params;
                if (!color && !cost && !name && !type && !bossName) {
                    return (this.skills = this.skillList.map((item) => {
                        return {
                            ...item,
                            cd: item.ParsedSkill?.tooltip?.[3]?.[1] || "-",
                        };
                    }));
                }
                this.skills = this.skillList
                    .filter((item) => {
                        return (
                            (!color || item.nColor === color) &&
                            (!cost || item.nCost === cost) &&
                            (!bossName ||
                                item.szBossName.indexOf(bossName) > -1 ||
                                (bossName === "未知" && !item.szBossName)) &&
                            (!type || (item.szType && item.szType.includes(type))) &&
                            (!name || item?.szSkillName?.indexOf(name) > -1)
                        );
                    })
                    .map((item) => {
                        return {
                            ...item,
                            cd: item.ParsedSkill?.tooltip?.[3]?.[1] || "-",
                        };
                    });
                this.$store.commit("baizhan/setState", {
                    key: "currentSkill",
                    val: this.skills?.[0] || {},
                });
            },
        },
    },
    methods: {
        iconLink,
        isPhone,
        isIpad,
        isNoteBook,
        getColor(nColor) {
            return nColor ? this.skillColors.find((item) => item.id === nColor)?.name : "-";
        },
        getType(types) {
            const arr = types
                ? types.map((type) => {
                      return this.skillTypes.find((item) => item.id === type)?.name;
                  })
                : [];
            const len = arr.length;
            if (len > 2) {
                return [arr[0], `其他 <b>${arr.length - 1}</b> 个效果`];
            }
            return arr;
        },
        toDetail(id) {
            const domain = process.env.NODE_ENV === "development" ? __Root : location.origin + "/";
            const url = domain + `app/database/?type=skill&query=${id}`;
            window.open(url, "_blank");
        },
        onMouse(row) {
            // if (this.isPin) return;
            this.$store.commit("baizhan/setState", {
                key: "currentSkill",
                val: row,
            });
        },
        onClick(row) {
            if (this.isPin) {
                if (row.dwInSkillID === this.currentSkill.dwInSkillID) {
                    this.isPin = false;
                }
            } else {
                this.isPin = true;
            }
        },
        getRowClassName({ row }) {
            return row.dwInSkillID === this.currentSkill.dwInSkillID ? "is-active" : "";
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/skills.less";
</style>
