<template>
    <el-drawer :visible.sync="visible" :append-to-body="true" class="m-bahuang-drawer">
        <h3 class="u-bahuang-title" slot="title">我的预设方案</h3>
        <div class="m-bahuang-my">
            <div class="m-bahuang-list" v-loading="loading">
                <ul v-if="list && list.length">
                    <li class="m-bahuang-list-item" v-for="(item, i) in list" :key="i">
                        <span class="u-name" v-if="!item.edit">
                            <i class="u-icon el-icon-tickets"></i>
                            <span>{{ item.title }}</span>
                            <i v-if="!isEditing" class="u-edit el-icon-edit" title="修改名称" @click="edit(item)"></i>
                        </span>
                        <div v-if="item.edit">
                            <el-input v-model="currentShemaName" size="mini" class="u-shema-name"></el-input>
                            <el-button type="text" @click="put">保存</el-button>
                            <el-button type="text" @click="item.edit = false">取消</el-button>
                        </div>
                        <el-button-group>
                            <el-tooltip effect="dark" content="使用" placement="top">
                                <el-button size="mini" icon="el-icon-position" @click="use(item)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除" placement="top">
                                <el-button size="mini" icon="el-icon-delete" @click="del(item)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </li>

                    <el-pagination class="u-list-pagination" background hide-on-single-page
                        layout="prev,pager,next,->,total" :total="total" :page-size="per"
                        :current-page.sync="page"></el-pagination>
                </ul>
                <el-alert v-else title="当前没有任何预设方案" type="info" show-icon></el-alert>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import { putBh, delBh, getBhList } from '@/service/fb/bhhjSimulator'
export default {
    props: {
        drawer: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            list: [],
            loading: false,
            visible: false,
            per: 10,
            page: 1,
            total: 0,
            currentShemaName: "",
            currentSchema: "",
        };
    },
    computed: {
        isEditing: function () {
            return this.list.some((item) => item.edit);
        },
    },
    methods: {
        loadList: function () {
            this.loading = true;
            getBhList({
                page: this.page,
                per: this.per
            }).then(res => {
                this.loading = false
                this.list = res.data.data.list.map((item) => {
                    this.$set(item, "edit", false);
                    return item;
                });
                this.page = res.data.data.page;
                this.per = res.data.data.per;
                this.total = res.data.data.total;
            })
                .finally(() => {
                    this.loading = false;
                });
        },
        use: function (item) {
            this.$emit("use", item);
        },
        edit: function (item) {
            this.currentShemaName = item.title;
            this.currentSchema = item;
            item.edit = true;
        },
        put: function () {
            putBh(this.currentSchema.id, {
                title: this.currentShemaName,
            }).then(() => {
                this.$notify({
                    type: "success",
                    title: "成功",
                    message: "修改成功",
                });
                this.currentSchema.title = this.currentShemaName;
                this.currentSchema.edit = false;

                this.currentShemaName = "";
                this.currentSchema = "";
            });
        },
        del: function (item) {
            this.$confirm('确认删除' + item.title + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delBh(item.id).then((data => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.loadList()
                }))
            }).catch(() => {
            });
        }
    },
    watch: {
        drawer: function (val) {
            if (val) {
                this.loadList();
                this.visible = val;
            }
        },
        visible: function (val) {
            this.$emit("update-drawer", val);
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/bhhjSimulator/drawer.less";
</style>
