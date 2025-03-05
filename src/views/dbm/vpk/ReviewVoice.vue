<template>
    <div class="p-vpk-public p-vpk-list p-vpk-voice">
        <div class="m-archive-search m-voice-filter">
            <el-select v-model="status">
                <el-option label="全部" value=""></el-option>
                <el-option label="待审核" :value="0"></el-option>
                <el-option label="已通过" :value="1"></el-option>
                <el-option label="未通过" :value="-1"></el-option>
            </el-select>
            <el-input v-model="vpk_id">
                <span slot="prepend">语音包ID</span>
            </el-input>
            <el-select v-model="is_upgrade" class="u-type">
                <span slot="prefix">类型</span>
                <el-option label="全部" value=""></el-option>
                <el-option label="全新" :value="0"></el-option>
                <el-option label="迭代" :value="1"></el-option>
            </el-select>
        </div>
        <div class="m-vpk-review__list" v-loading="loading">
            <template v-if="list && list.length">
                <el-table :data="list">
                    <el-table-column label="状态" width="120">
                        <template slot-scope="{ row }">
                            <span class="u-voice-status" :class="getVoiceStatusClass(row)">
                                <img svg-inline src="@/assets/img/dbm/vpk/sound.svg" />
                                （{{ getVoiceStatus(row) }}）
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="试听" width="100">
                        <template slot-scope="{ row }">
                            <template v-if="row">
                                <el-button
                                    type="primary"
                                    size="small"
                                    :icon="row.isPlaying ? 'el-icon-video-pause' : 'el-icon-video-play'"
                                    @click="play(row)"
                                    :disabled="!!currentId && currentId !== row.id"
                                    >{{ (row["isPlaying"] && "停止") || "试听" }}</el-button
                                >
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="标识符">
                        <template slot-scope="{ row }">
                            {{ getSlugMeta(row, "remark") }}
                            <!-- <small class="u-slug">（{{ row.slug }}）</small> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="用户备注">
                        <template slot-scope="{ row }">
                            {{ row.remark }}
                        </template>
                    </el-table-column>
                    <el-table-column label="所属语音包">
                        <template slot-scope="{ row }">
                            <a :href="`/dbm/vpk/manage/${row.vpk_id}`" target="_blank">
                                <el-tag>语音包 : {{ row.vpk_id }}</el-tag>
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column label="类型">
                        <template slot-scope="{ row }">
                            <el-tag type="warning" v-if="row.replace_target">迭代</el-tag>
                            <el-tag type="success" v-else>全新</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="上次处理人">
                        <template slot-scope="{ row }">
                            <div class="u-assessor" v-if="row.assessor">
                                <Avatar
                                    class="u-avatar"
                                    :uid="row.assessor.id"
                                    :url="row.assessor.avatar"
                                    size="xxs"
                                ></Avatar>
                                {{ row.assessor.display_name }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{ row }">
                            <span class="u-voice-op">
                                <el-button
                                    type="success"
                                    size="small"
                                    icon="el-icon-circle-check"
                                    @click="onAudit(row, 'pass')"
                                    >通过</el-button
                                >
                                <el-button
                                    plain
                                    size="small"
                                    icon="el-icon-circle-close"
                                    @click="onAudit(row, 'refuse')"
                                    >拒绝</el-button
                                >
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                    class="m-archive-pages"
                    background
                    layout="total, prev, pager, next, jumper"
                    :hide-on-single-page="true"
                    :page-size="per"
                    :total="total"
                    :current-page.sync="page"
                    @current-change="loadData"
                ></el-pagination>
            </template>
            <template v-else>
                <el-empty class="m-vpk-null" description="暂无数据" :image-size="120"></el-empty>
            </template>
        </div>

        <audioPlayerVue ref="player" @ended="onEnded" />
    </div>
</template>

<script>
import { getAllVoiceList, auditVoice, deleteVoice } from "@/service/dbm/voice";
import { removeEmptyParams } from "@/utils/dbm/params";
import audioPlayerVue from "@/components/dbm/vpk/AudioPlayer.vue";
import { getAudioLink } from "@/utils/dbm/voice";
import { getSlugList } from "@/service/dbm/slug";
export default {
    name: "ReviewVoice",
    components: {
        audioPlayerVue,
    },
    data() {
        return {
            status: 0,
            vpk_id: "",
            is_upgrade: 1,

            // 分页
            page: 1,
            per: 10,
            total: 0,

            list: [],
            loading: false,

            currentId: "",

            slugs: {},
        };
    },
    computed: {
        params() {
            const params = {
                pageIndex: this.page,
                pageSize: this.per,
                status: this.status,
                vpk_id: this.vpk_id,
                is_upgrade: this.is_upgrade,
            };
            return removeEmptyParams(params);
        },
        resetParams() {
            return [this.status, this.vpk_id, this.is_upgrade, this.pageSize];
        },
    },
    watch: {
        params: {
            immediate: true,
            deep: true,
            handler: function () {
                this.loadData();
            },
        },
        resetParams: {
            immediate: true,
            deep: true,
            handler: function () {
                this.page = 1;
            },
        },
    },
    mounted() {
        this.loadSlug();
    },
    methods: {
        getUserMeta(item, key) {
            return item?.assessor?.[key] || "";
        },
        loadData() {
            this.loading = true;
            getAllVoiceList(this.params)
                .then((res) => {
                    this.list = (res.data.data?.list || []).map((item) => {
                        return {
                            ...item,
                            isPlaying: false,
                        };
                    });
                    this.total = res.data.data.page.total;
                    this.currentId = "";
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadSlug() {
            this.slugLoading = true;
            getSlugList()
                .then((res) => {
                    this.slugs = res.data.data?.reduce((prev, cur) => {
                        prev[cur.slug] = {
                            group_name: cur.group_name,
                            remark: cur.remark,
                            slug: cur.slug,
                        };
                        return prev;
                    }, {});
                })
                .finally(() => {
                    this.slugLoading = false;
                });
        },
        getVoiceStatus(item) {
            const statusMap = {
                "-1": "未通过",
                0: "审核中",
                1: "已通过",
            };
            return (item?.filename && statusMap[item.status]) || "未设置";
        },
        getVoiceStatusClass(item) {
            const statusMap = {
                "-1": "isReject",
                0: "isChecking",
                1: "isReady",
            };
            return (item?.filename && statusMap[item.status]) || "";
        },
        getSlugMeta(item, key) {
            return this.slugs[item.slug]?.[key] || "";
        },
        play(item) {
            this.currentId = item.id;
            const isPlaying = item.isPlaying;

            if (!isPlaying) {
                item.isPlaying = true;
                this.playSrc = getAudioLink(item["filename"]);
                this.$refs.player.play(this.playSrc);
            } else {
                this.$refs.player.pause();
                item.isPlaying = false;
            }
        },
        onEnded() {
            const item = this.list.find((item) => item.id === this.currentId);
            item.isPlaying = false;
            this.currentId = "";
        },
        // 审批
        onAudit(item, action) {
            auditVoice(item?.vpk_id, item?.id, action).then((res) => {
                this.$message.success("操作成功");
                if (this.status !== "") this.list = this.list.filter((v) => v.id !== item.id);
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/vpk/voice.less";
.m-voice-filter{
    .u-type{
        .el-input__prefix{
            .h(100%);
            line-height: 40px;
            padding:0 10px;
            // background-color:@bg-gray;
        }
        .el-input--prefix .el-input__inner{
            padding-left:50px;
        }
    }
}
</style>
