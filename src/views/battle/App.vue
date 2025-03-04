<template>
    <div id="app">
        <Header></Header>
        <Breadcrumb
            name="战斗统计"
            slug="battle"
            root="/battle"
            :publishEnable="false"
            :adminEnable="false"
            :feedbackEnable="true"
            :crumbEnable="true"
        >
            <el-dropdown class="m-header-dropmenu" v-if="isAdmin && id" slot="op-append" trigger="click">
                <el-button type="primary" size="small">管理操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown" class="m-header-dropmenu__content">
                    <el-dropdown-item @click.native="rank"><i class="el-icon-s-data"></i>天梯</el-dropdown-item>
                    <el-dropdown-item @click.native="edit"><i class="el-icon-edit-outline"></i>编辑</el-dropdown-item>
                    <el-dropdown-item @click.native="del"><i class="el-icon-delete"></i>删除</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </Breadcrumb>
        <LeftSidebar>
            <Nav />
        </LeftSidebar>
        <Main :withoutRight="true">
            <div class="m-main">
                <router-view />
            </div>
            <Footer></Footer>
        </Main>

        <EditLogs v-model="showEdit" :data="current" />
        <RankRelated v-model="showRank" :data="current" />
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { deleteBattle } from "@/service/battle/team";

import Nav from "@/components/battle/Nav.vue";
import EditLogs from "@/components/battle/common/edit_logs.vue";
import RankRelated from "@/components/battle/common/rank_related.vue";
export default {
    name: "App",
    data: function () {
        return {
            showEdit: false,
            showRank: false,
        };
    },
    computed: {
        isAdmin() {
            return User.isAdmin();
        },
        id() {
            return this.$route.params.id;
        },
        current() {
            return this.$store.state.current;
        }
    },
    methods: {
        del() {
            this.$confirm("确定删除该数据吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    deleteBattle(this.id).then((res) => {
                        this.$message({
                            type: "success",
                            message: "删除成功!",
                        });
                        this.$router.push({ name: 'public' });
                    });
                })
        },
        edit() {
            this.showEdit = true;
        },
        rank() {
            this.showRank = true;
        }
    },
    components: {
        Nav,
        EditLogs,
        RankRelated
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/app.less";
</style>
