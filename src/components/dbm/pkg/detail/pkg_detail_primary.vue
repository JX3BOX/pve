<template>
    <div class="m-pkg-detail__primary">
        <el-tabs class="m-pkg-core" v-model="active" @tab-click="onTabClick">
            <el-tab-pane label="详细说明" name="desc">
                <Article :content="pkg.desc" v-if="pkg.desc"></Article>
                <div class="m-pkg-null" v-else> <i class="el-icon-warning-outline"></i> 暂无任何详细说明 </div>
            </el-tab-pane>
            <el-tab-pane label="标点内容" name="mark" v-if="pkg.type == 3">
                <el-table :data="mark_data" size="mini">
                    <el-table-column label="#" width="32px">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="X 坐标" prop="x"> </el-table-column>
                    <el-table-column label="Y 坐标" prop="y"> </el-table-column>
                    <el-table-column label="Z 坐标" prop="z"> </el-table-column>
                    <el-table-column label="备注" prop="remark"> </el-table-column>
                    <!-- <el-table-column label="图片">
                        <template #default="{ row }">
                            <el-image
                                style="width: 48px; height: 48px"
                                :src="row.img"
                                fit="cover"
                                :preview-src-list="[row.img]"
                            >
                                <div slot="error" class="u-no-image"> - </div>
                            </el-image>
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="元数据" name="items" v-if="pkg.type == 1 && !pkg.is_raw">
                <pkg-detail-items :pkg="pkg"></pkg-detail-items>
            </el-tab-pane>
            <el-tab-pane label="依赖包" name="modules" v-if="pkg.type == 1 && !pkg.is_raw">
                <div class="m-dependency-table" v-if="modules && modules.length">
                    <el-table :data="modules" size="small" max-height="500px">
                        <el-table-column prop="key" label="数据">
                            <template slot-scope="scope">
                                <a :href="moduleLink(scope.row)" target="_blank">{{ showDependency(scope.row) }}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="priority" label="优先级">
                            <template #default="scope">
                                {{ scope.row.priority || 0 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="uuid" label="UUID">
                            <template #default="scope">
                                <div @click="onCopy(scope.row)" class="u-uuid">
                                    {{ scope.row.uuid }}
                                </div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="操作" width="100px">
                            <template slot-scope="scope">
                                <el-button
                                    type="danger"
                                    size="mini"
                                    icon="el-icon-remove-outline"
                                    @click="onRemove(scope.row)"
                                    >移除</el-button
                                >
                            </template>
                        </el-table-column> -->
                    </el-table>
                </div>
                <div v-else title="暂未添加依赖包" type="info" class="m-dependency-null"
                    ><i class="el-icon-warning-outline"></i>暂未添加依赖包</div
                >
            </el-tab-pane>
            <el-tab-pane label="被依赖" name="dependents" v-if="pkg.type == 1 && !pkg.is_raw">
                <div class="m-dependent-table" v-if="dependents && dependents.length">
                    <el-table :data="dependents" size="small" max-height="500px">
                        <el-table-column prop="key" label="数据">
                            <template #default="{ row }">
                                <a :href="`/dbm/pkg/${row.id}`" target="_blank">{{ row.key }}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="作者">
                            <template #default="{ row }">
                                <a :href="authorLink(row.pkg_user.ID)" target="_blank">
                                    <i class="el-icon-link"></i>
                                    {{ row.pkg_user.display_name || "佚名" }}
                                </a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-else title="暂未添加依赖包" type="info" class="m-dependency-null"
                    ><i class="el-icon-warning-outline"></i>暂未添加依赖包</div
                ></el-tab-pane
            >
            <el-tab-pane label="历史版本" name="history">
                <div class="m-version-list" v-if="history.length">
                    <el-table :data="history" size="mini" v-loading="loading">
                        <el-table-column label="版本" prop="version">
                            <template #default="{ row }">
                                <span>{{ row.version }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="发版说明" prop="commit"> </el-table-column>
                        <el-table-column label="备注" prop="remark"> </el-table-column>
                        <el-table-column label="创建时间" prop="created_at">
                            <template #default="{ row }">
                                {{ showTime(row.created_at) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100px">
                            <template #default="{ row }">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-check"
                                    :disabled="pkgDisabled(row)"
                                    @click="onSelectPkg(row)"
                                    >切换</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        class="u-pagination"
                        hide-on-single-page
                        layout="prev,pager,next"
                        background
                        :current-page.sync="page"
                        :page-size="per"
                        :total="total"
                        small
                    ></el-pagination>
                </div>
                <el-alert v-else type="info" title="该数据包暂无历史版本" show-icon></el-alert>
            </el-tab-pane>
        </el-tabs>
        <div class="m-pkg-misc">
            <!-- 打赏 -->
            <Thx
                class="m-thx"
                :postId="id"
                postType="dbm_pkg"
                :postTitle="pkg.title"
                :userId="pkg.user_id"
                :adminBoxcoinEnable="true"
                :userBoxcoinEnable="true"
                :client="client"
                :allowGift="pkg.allow_gift"
            />

            <!-- 评论 -->
            <div ref="commentView" class="m-single-comment">
                <el-divider content-position="left"><i class="el-icon-chat-line-round"></i> 评论</el-divider>
                <Comment :id="id" category="dbm_pkg" v-if="!pkg.comment" />
                <el-alert title="作者没有开启评论功能" type="warning" show-icon v-else></el-alert>
            </div>
        </div>
    </div>
</template>

<script>
import { getPkgVersion, getPkgDependents } from "@/service/dbm/pkg";
import { showTime } from "@/utils/dbm/dateFormat";
import { authorLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";

// components
import Thx from "@jx3box/jx3box-common-ui/src/single/Thx.vue";
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import pkgDetailItems from "./pkg_detail_items.vue";
import { mapState } from "vuex";
export default {
    name: "PkgDetailPrimary",
    components: {
        Thx,
        Article,
        pkgDetailItems,
    },
    props: {
        pkg: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            active: "desc",

            history: [],
            loading: false,
            per: 10,
            page: 1,
            total: 0,

            dependents: [],
        };
    },
    computed: {
        getThumbnail,
        ...mapState({
            mark_data: (state) => state.mark_data,
        }),
        id() {
            return ~~this.$route.params.id;
        },
        modules() {
            return this.pkg?.pkg_record?.modules;
        },
        items() {
            return this.pkg?.pkg_record?.items;
        },
        params() {
            return {
                per: this.per,
                page: this.page,
            };
        },
        client() {
            return this.$store.state.client;
        },
        isTarget() {
            return this.pkg?.type == 2;
        },
    },
    watch: {
        params: {
            handler() {
                this.loadHistory();
            },
            deep: true,
        },
        id: {
            handler(val) {
                getPkgDependents(val).then((res) => {
                    this.dependents = res.data.data.list;
                });
            },
            immediate: true,
        },
    },
    methods: {
        authorLink,
        showTime,
        onTabClick() {
            if (this.active === "history") {
                this.page = 1;
                this.loadHistory();
            }
        },
        showDependency(mod) {
            let key = mod.module?.key;
            let version = mod.record?.version;
            return `${key}@${version}`;
        },
        moduleLink(mod) {
            let id = mod.module_id;
            let version = mod.record?.version;
            return `/dbm/pkg/${id}?version=${version}`;
        },
        // 复制uuid
        onCopy({ uuid }) {
            navigator.clipboard.writeText(uuid);
            this.$notify.success({
                title: "复制成功",
                message: uuid,
            });
        },
        loadHistory() {
            this.loading = true;
            getPkgVersion(this.id, this.params)
                .then((res) => {
                    this.history = res.data.data?.list || [];
                    this.total = res.data.data?.total || 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        pkgDisabled(row) {
            return this.pkg?.pkg_record?.version === row.version;
        },
        onSelectPkg(row) {
            this.$router.push({
                query: {
                    version: row.version,
                },
            });
        },
    },
};
</script>

<style lang="less">
.m-pkg-detail__primary {
    .mt(20px);
    .m-pkg-misc {
        margin-top: 20px;
    }

    .u-pagination {
        margin-top: 10px;
        .x;
    }
}
.m-pkg-core {
    min-height: 500px;

    .u-no-image {
        .flex;
        justify-content: center;
        align-items: center;
        height: 48px;
        color: #999;
    }
}
.m-pkg-null {
    .x;
    .fz(12px);
    color: #999;
    padding: 60px;
}
</style>
