<template>
    <div class="v-member-list">
        <div class="m-filter m-title">
            <el-radio-group v-model="tab" size="small">
                <el-radio-button label="UserList">正式团员</el-radio-button>
                <el-radio-button label="PendingList">待处理申请</el-radio-button>
            </el-radio-group>
            <!-- <div class="u-member-op">
                <a href="/tool/23785" class="u-help" target="_blank"> <i class="el-icon-info"></i> 帮助文档 </a>
            </div> -->
        </div>
        <component :is="tab" :id="id" />
    </div>
</template>

<script>
import PendingList from "./PendingList.vue";
import RoleList from "./RoleList.vue";
import UserList from "./UserList.vue";
export default {
    props: ["id"],
    data: function() {
        return {
            tab: "UserList",
        };
    },
    computed: {
        pendingList: function() {
            const pending = this.$store.state.pendingList;
            let obj = {};
            pending.forEach((p) => {
                obj[p.team_id] = p.pending;
            });
            return obj;
        },
    },
    components: {
        PendingList,
        RoleList,
        UserList,
    },
};
</script>

<style lang="less">
.v-member-list {
    .m-filter {
        .x;
        .mb(20px);
        .pr;
    }

    .u-member-op {
        .pa;
        .rt(0);
    }
}
.m-select-org {
    .ml(5px);
}
@media screen and (max-width: @phone) {
    .v-member-list {
        .u-op {
            .none;
        }
    }
}
</style>
