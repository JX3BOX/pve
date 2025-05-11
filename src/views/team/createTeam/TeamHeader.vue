<template>
    <div class="header">
        <div class="title">
            <div class="title-text">
                {{ teamInfo.game_activity_name }}
                <i class="el-icon-edit-outline" @click="dialogVisible = true;form.game_activity_name = teamInfo.game_activity_name;form.remark = teamInfo.remark"></i>
            </div>
            <div class="team-info">
                <div class="team-info-item">
                    <div class="team-info-item-title">发起人员</div>
                    <div class="team-info-item-value">(UID:{{ teamInfo.user_id }})</div>
                </div>
                <div class="team-info-item">
                    <div class="team-info-item-title">发起时间</div>
                    <div class="team-info-item-value">{{ teamInfo.created_at }}</div>
                </div>
                <div class="team-info-item">
                    <div class="team-info-item-title">活动编号</div>
                    <div class="team-info-item-value">{{ teamInfo.game_activity_number }}</div>
                </div>
            </div>
        </div>
        <div class="team-remark">
            <div class="team-remark-title">活动公告</div>
            <div class="team-remark-content">{{ teamInfo.remark }}</div>
        </div>
        <el-dialog title="编辑活动" :visible.sync="dialogVisible" width="30%">
            <el-form :model="form" label-width="100px">
                <el-form-item label="活动名称">
                    <el-input v-model="form.game_activity_name" placeholder="请输入活动名称" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="活动公告">
                    <el-input v-model="form.remark" placeholder="请输入活动公告" type="textarea" maxlength="50" :rows="2" resize="none"></el-input>
                </el-form-item>
            </el-form>
            <div style="text-align: center;">
                <el-button type="primary" @click="editTeam">确定</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>     

<script>
import { updateTeamName } from '@/service/team/qqbot';
export default {
    name: "TeamHeader",
    props: {
        teamInfo: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            dialogVisible: false,
            form: {
                game_activity_name: '',
                remark: '',
            },
        };
    },
    methods: {
        editTeam() {
            this.dialogVisible = false;
            if(this.form.game_activity_name !== this.teamInfo.game_activity_name){
                updateTeamName(this.$route.query.id,{game_activity_name:this.form.game_activity_name}).then(res => {
                    this.$message.success('修改成功');
                });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 822px;
    height: 91px;
    .title {
        width: 538px;
        height: 91px;
        border-radius: 12px;
        background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
        box-sizing: border-box;
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title-text {
            height: 35px;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0px;
            line-height: 35px;
            color: rgba(255, 255, 255, 1);
            i {
                cursor: pointer;
            }
        }
        .team-info {
            width: 100%;
            height: 36px;
            display: flex;
            .team-info-item {
                margin-right: 24px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .team-info-item-title {
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 17.38px;
                    color: rgba(255, 255, 255, 0.5);
                }
                .team-info-item-value {
                    font-size: 12px;
                    font-weight: 400;
                    letter-spacing: 0px;
                    line-height: 17.38px;
                    color: rgba(255, 255, 255, 1);
                }
            }
        }
    }
    .team-remark {
        width: 280px;
        height: 91px;
        border-radius: 8px;
        background: linear-gradient(180deg, rgba(56, 56, 56, 1) 0%, rgba(0, 0, 0, 1) 100%);
        box-shadow: inset 0px 10px 5px rgba(0, 0, 0, 1);
        box-sizing: border-box;
        padding: 4px 12px;
        .team-remark-title {
            width: 56px;
            height: 21px;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0px;
            line-height: 21px;
            color: rgba(255, 195, 0, 1);
        }
        .team-remark-content {
            width: 256px;
            height: 58px;
            font-size: 12px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 17.38px;
            color: rgba(255, 255, 255, 1);
            overflow: scroll;
            scrollbar-width: none;
        }
    }
}
</style>
