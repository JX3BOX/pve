<template>
    <div class="team-content">
        <div class="team-detail">
            <TeamHeader :teamInfo="teamInfo" />
            <div class="statistics">
                <div class="statistics-count">正式编队({{ teamInfo.total_members }})</div>
                <div class="statistics-role">
                    <div class="statistics-role-item">
                        <div class="role-count tank">1</div>
                        承伤
                    </div>
                    <div class="statistics-role-item">
                        <div class="role-count hps">1</div>
                        治疗
                    </div>
                    <div class="statistics-role-item">
                        <div class="role-count dps">1</div>
                        输出
                    </div>
                </div>
            </div>
            <Member :members="teamInfo.members" @changeMember="changeMember" />
        </div>
    </div>
</template>

<script>
import { getTeamInfo } from "@/service/team/qqbot";
import TeamHeader from "./TeamHeader.vue";
import Member from "./Member.vue";
export default {
    name: "Team",
    components: {
        TeamHeader,
        Member,
    },
    data() {
        return {
            teamInfo: {},
            activityId: this.$route.query.id,
            refresh: 0,
        };
    },
    mounted() {
        this.getTeamInfo();
    },
    methods: {
        getTeamInfo(isChange) {
            getTeamInfo(this.activityId)
                .then((res) => {
                    res.data.data.total_members = res.data.data.members.length;
                    const members = new Array(25).fill(null);
                    res.data.data.members.forEach((member) => {
                        members[member.serial_no - 1] = member;
                    });
                    this.teamInfo = {
                        ...res.data.data,
                        members,
                    };
                })
                .catch((err) => {
                    this.refresh++
                    if(this.refresh<5){
                        this.getTeamInfo();
                    }
                });
        },
        changeMember(member1,member2) {
            this.teamInfo.members.splice(member1.serial_no - 1, 1, member2);
            this.teamInfo.members.splice(member2.serial_no - 1, 1, member1);
            this.getTeamInfo();
        },
    },
};
</script>

<style lang="less" scoped>
.team-content {
    height: 100%;
    margin-left: 100px;
    display: flex;
    .team-detail {
        align-self: center;
        box-sizing: border-box;
        width: 100%;
        border-radius: 12px;
        background: linear-gradient(180deg, rgba(64, 64, 64, 1) 0%, rgba(87, 87, 87, 1) 100%);
        border: 0.5px solid rgba(255, 255, 255, 1);
        box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.25);
        padding: 20px;
        .statistics {
            height: 24px;
            width: 100%;
            margin-top: 12px;
            display: flex;
            justify-content: space-between;
            .statistics-count {
                height: 100%;
                font-size: 16px;
                font-weight: 700;
                letter-spacing: 0px;
                line-height: 24px;
                color: rgba(255, 255, 255, 1);
            }
            .statistics-role {
                height: 100%;
                width: 156px;
                display: flex;
                justify-content: space-between;
                .statistics-role-item {
                    height: 100%;
                    width: 44px;
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 24px;
                    color: rgba(255, 255, 255, 1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .role-count {
                        height: 16px;
                        width: 16px;
                        line-height: 16px;
                        border-radius: 2px;
                        text-align: center;
                        &.tank {
                            background: linear-gradient(180deg, rgba(140, 91, 63, 1) 0%, rgba(0, 0, 0, 1) 100%);
                        }
                        &.hps {
                            background: linear-gradient(180deg, rgba(68, 130, 93, 1) 0%, rgba(0, 0, 0, 1) 100%);
                        }
                        &.dps {
                            background: linear-gradient(180deg, rgba(60, 98, 140, 1) 0%, rgba(0, 0, 0, 1) 100%);
                        }
                    }
                }
            }
        }
    }
}
</style>
