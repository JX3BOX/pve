<template>
    <div class="m-pz-box" v-loading="loading">
        <div class="m-pz-overview" v-if="data">
            <!-- 信息 -->
            <template v-if="isEditMode">
                <el-divider class="u-div" content-position="left">
                    <i class="el-icon-edit-outline"></i> 信息
                </el-divider>
                <div class="m-pz-info isEditMode">
                    <el-input
                        class="u-title"
                        v-model="form.title"
                        placeholder="配装方案标题"
                        show-word-limit
                        clearable
                        :maxlength="50"
                    ></el-input>
                    <el-input
                        class="u-textarea"
                        v-model="form.desc"
                        type="textarea"
                        placeholder="补充描述"
                        show-word-limit
                        :maxlength="255"
                        :rows="4"
                    ></el-input>
                </div>
            </template>
            <template v-else>
                <div class="m-pz-info">
                    <Avatar
                        class="u-avatar"
                        :uid="data.user_id"
                        :url="data.pz_author_info && data.pz_author_info.user_avatar"
                        :frame="data.pz_author_info && data.pz_author_info.user_avatar_frame"
                        size="m"
                    />
                    <h1 class="u-title">
                        <i class="u-status el-icon-lock" v-if="data.status"></i>
                        {{ data.title }}
                    </h1>
                    <div class="u-meta">
                        <span class="u-fork" v-if="data.fork_id && fork_info">
                            <img svg-inline src="@/assets/img/pz/fork.svg" alt="" />
                            forked from
                            <a class="u-link" :href="'/pz/view/' + fork_info.id" target="_blank"
                                >{{ fork_info.pz_author_info.display_name }}/{{ fork_info.title }}</a
                            >
                        </span>
                        <span class="u-author">
                            By
                            <a class="u-author-name" :href="data.user_id | authorLink" target="_blank">
                                {{ data.pz_author_info && data.pz_author_info.display_name }}
                            </a>
                        </span>
                        <time class="u-time">{{ data.updated_at | formatTime }}</time>
                        <div>
                            <i class="u-mark" v-if="~~data.star">★ 编辑推荐</i>
                            <i class="u-client i-client" :class="schema_client || 'std'">
                                {{ schema_client == "origin" ? "缘起" : "重制" }}
                            </i>
                            <i class="u-level i-client" :class="schema_client || 'std'"
                                >Lv.{{ data.global_level || SETTINGS[schema_client + "_global_level"] }}</i
                            >
                        </div>
                    </div>
                    <div class="u-desc" v-if="data.desc">{{ data.desc }}</div>
                </div>
            </template>

            <!-- 奇穴 -->
            <Talent :key="schema.id" v-if="isEditMode" />

            <!-- 增益 -->
            <Buff v-if="isEditMode" />

            <!-- 附加 -->
            <div class="m-pz-extend" v-if="isEditMode">
                <el-divider class="u-div" content-position="left">
                    <i class="el-icon-collection-tag"></i> 扩展
                </el-divider>
                <el-form label-width="80px" label-position="left">
                    <el-form-item label="标签">
                        <el-checkbox-group v-model="form.tags">
                            <el-checkbox v-for="tag in tags" :label="tag" :key="tag">{{ tag }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="版本">
                        <!-- 下拉选择 -->
                        <el-select v-model="form.zlp" placeholder="请选择适用资料片" size="small">
                            <el-option v-for="zlp in zlps" :key="zlp" :label="zlp" :value="zlp"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="适用">
                        <!-- 下拉选择 -->
                        <el-select v-model="form.adaptation" placeholder="请选择适用" size="small">
                            <el-option
                                v-for="item in adaptations"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 设置 -->
            <div class="m-pz-setting" v-if="isEditMode">
                <el-divider class="u-div" content-position="left"> <i class="el-icon-setting"></i> 设置 </el-divider>
                <el-form label-width="80px" label-position="left">
                    <el-form-item label="可见性">
                        <el-checkbox :true-label="1" :false-label="0" v-model="form.status">仅自己可见</el-checkbox>
                    </el-form-item>
                    <el-form-item label="冻结">
                        <span slot="label">
                            <el-tooltip
                                placement="top"
                                content="防止版本迭代导致的装备属性变更，冻结后将不能修改方案中的装备属性与计算结果，将锁定装备快照与计算结果。"
                            >
                                <i class="el-icon-info"></i> </el-tooltip
                            >冻结
                        </span>
                        <el-checkbox :true-label="1" :false-label="0" v-model="form.is_locked">冻结封存</el-checkbox>
                    </el-form-item>
                    <el-form-item label="自荐" v-show="!schema.star">
                        <el-checkbox :true-label="1" :false-label="0" :value="isRecommend" @change="onRecommendChange"
                            >推荐至精选</el-checkbox
                        >
                        <span class="u-pending" v-if="isAuditing">（待审核）</span>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 预览 -->
            <template v-if="!isEditMode">
                <el-divider class="u-div" content-position="left"> <i class="el-icon-pie-chart"></i> 预览 </el-divider>
                <el-tabs v-model="activeName" type="card">
                    <el-tab-pane label="横版图" name="horizontal"></el-tab-pane>
                    <el-tab-pane label="竖版图" name="vertical"></el-tab-pane>
                    <el-tab-pane label="属性版" name="attribute"></el-tab-pane>
                    <el-tab-pane label="数据版" name="pzCode"></el-tab-pane>
                    <el-tab-pane label="嵌入版" name="pzIframe"></el-tab-pane>
                </el-tabs>
                <div class="m-pz-canvas">
                    <component :is="activeName" :key="schema.id"></component>
                </div>
            </template>

            <!-- 互动 -->
            <div class="m-pz-thx" v-if="!isEditMode">
                <Thx
                    :postId="~~id"
                    postType="pz"
                    :postTitle="data.title"
                    :userId="author_id"
                    :adminBoxcoinEnable="true"
                    :userBoxcoinEnable="true"
                />
            </div>

            <!-- 评论 -->
            <div class="m-pz-comment" v-if="!isEditMode">
                <el-divider class="u-div" content-position="left">
                    <i class="el-icon-chat-dot-round"></i> 讨论
                </el-divider>
                <Comment :id="id" category="pz" order="desc" />
            </div>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import { mapGetters } from "vuex";
import { tags, adaptations } from "@/assets/data/pz/query_types.json";
import SETTINGS from "@/pages/pz/setting.json";
import { getPz } from "@/service/pz/schema.js";
import zlps from "@jx3box/jx3box-common/data/jx3_zlp.json";

// components
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
import OverviewHorizontal from "./overviewcludes/OverviewHorizontal.vue";
import OverviewVertical from "./overviewcludes/OverviewVertical.vue";
import OverviewCode from "./overviewcludes/OverviewCode.vue";
import OverviewIframe from "./overviewcludes/OverviewIframe.vue";
import Attribute from "./Attribute.vue";
import Talent from "./Talent.vue";
import Buff from "./Buff.vue";

export default {
    name: "Overview",
    props: [],
    data: function () {
        return {
            isLogin: User.isLogin(),
            SETTINGS,

            // 基础数据
            loading: false,
            form: {
                title: "",
                desc: "",
                talent: [],
                is_locked: 0,
                status: 0,
                tags: [],
                zlp: "",
                adaptation: "std",
            },

            //config
            tags,
            adaptations,

            // 总览
            canvas_visible: false,
            activeName: "horizontal", //window.innerWidth < 1280 ? "vertical" : "horizontal",

            // fork
            fork_info: "",
            firstLoad: true,
        };
    },
    computed: {
        ...mapGetters(["schema", "schema_client", "attrs", "mount"]),
        data: function () {
            return this.$store.state.schema;
        },
        id: function () {
            return this.$route.params.id;
        },
        isAuditing: function () {
            return this.$store.state.isAuditing;
        },
        isRecommend: function () {
            return this.$store.state.isRecommend;
        },
        author_id: function () {
            return this.data.user_id;
        },
        isAuthor: function () {
            return User.getInfo().uid == this.data.user_id;
        },
        isEditMode: function () {
            return this.$route.name == "edit" && this.isAuthor;
        },
        client: function () {
            return this.$store.state.client;
        },
        equipOverview: function () {
            return "";
        },
        zlps: function () {
            return this.schema_client == "std" ? zlps.std : zlps.origin;
        },
    },
    watch: {
        data: {
            deep: true,
            immediate: true,
            handler: function (val, oVal) {
                if (val) {
                    this.form = val;
                    this.form.tags = val.tags || [];

                    if (val?.fork_id && this.firstLoad) {
                        this.loadForkInfo(val.fork_id);
                    }
                }
            },
        },
    },
    methods: {
        check: function () {
            let hasTitle = this.form.title;
            return hasTitle;
        },
        exportPz: function () {
            this.canvas_visible = true;
        },
        loadForkInfo: function (fork_id) {
            getPz(fork_id)
                .then((res) => {
                    const data = res?.data?.data;
                    // 有些数据content可能经过多次转义（暂时不知道哪来的，先适配一下）
                    if (data) {
                        if (typeof data.content === "string") data.content = JSON.parse(data.content);
                        if (typeof data.snapshot === "string") data.snapshot = JSON.parse(data.snapshot);
                        if (typeof data.talent_code === "string") data.talent_code = JSON.parse(data.talent_code);
                        if (typeof data.talent_pzcode === "string") data.talent_pzcode = JSON.parse(data.talent_pzcode);
                    }
                    this.fork_info = res.data.data;
                    this.firstLoad = false;
                })
                .catch(() => {});
        },

        onRecommendChange(val) {
            this.$store.commit("SET_STATE", {
                key: "isRecommend",
                value: val,
            });
        },
    },
    filters: {
        showAvatar: function (val) {
            return showAvatar(val, "m");
        },
    },
    created: function () {},
    mounted: function () {},
    components: {
        Comment,
        horizontal: OverviewHorizontal,
        vertical: OverviewVertical,
        pzCode: OverviewCode,
        pzIframe: OverviewIframe,
        Talent,
        attribute: Attribute,
        Buff,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/overview.less";
</style>
