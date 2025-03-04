<template>
    <div class="m-pkg-batch">
        <el-switch v-model="selectingModel" active-color="#13ce66" active-text="选择模式"></el-switch>
        <span class="u-count" v-if="selectingModel">({{ dataSelectCount }}/{{ cloudData.length }})</span>
        <el-checkbox
            v-if="selectingModel"
            class="u-check-all"
            v-model="checkAll"
            label="全选"
            border
            size="mini"
            @change="checkSwitch"
        ></el-checkbox>
        <el-button type="primary" icon="el-icon-setting" size="mini" @click="open"> 批量构建 </el-button>

        <el-drawer
            title="数据包批量构建"
            :visible.sync="visible"
            append-to-body
            size="50%"
            custom-class="m-pkg-batch__drawer"
            :close-on-press-escape="false"
            :wrapper-closable="false"
            :show-close="false"
        >
            <div class="m-pkg-batch-details">
                <!-- 构建方案选择 -->
                <div class="u-recipe-select">
                    <el-select
                        v-model="recipe_id"
                        placeholder="请选择批量构建方案"
                        size="small"
                        clearable
                        popper-class="m-recipe-select__popper"
                        @change="onRecipeSelect"
                    >
                        <el-option
                            class="u-recipe-item"
                            v-for="(item, index) in recipes"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                        >
                            <span>{{ item.name }}</span>
                            <el-button
                                icon="el-icon-delete"
                                type="text"
                                @click.stop="onRecipeDelete(item.id)"
                            ></el-button>
                        </el-option>
                    </el-select>
                </div>
                <!-- 构建列表 -->
                <div class="u-build-table" v-loading="loading">
                    <table>
                        <thead>
                            <tr>
                                <th v-if="building" class="u-progress-td"></th>
                                <th class="u-op-column" v-if="!building">操作</th>
                                <th>数据包</th>
                                <th class="u-version-column">当前版本</th>
                                <th class="u-version-column">新版本名</th>
                                <th class="u-version-column">备注</th>
                                <th v-if="building" class="u-message-column">构建状态</th>
                            </tr>
                        </thead>
                        <draggable
                            handle=".u-drag-arrow"
                            tag="tbody"
                            v-model="buildList"
                            animation="200"
                            @start="drag = true"
                            @end="drag = false"
                        >
                            <tr v-for="(pkg, index) in buildList" :key="index">
                                <td v-if="building" class="u-progress-td">
                                    <div :key="`progress-${index}`" class="u-build-progress__wrapper">
                                        <div
                                            class="u-build-progress__inner"
                                            :class="`is-${pkg.status}`"
                                            :style="progressStyle(pkg)"
                                        ></div>
                                    </div>
                                </td>
                                <!-- 拖拽列 -->
                                <td v-if="!building">
                                    <div class="u-table-ops">
                                        <i class="u-drag-arrow el-icon-rank"></i>
                                        <el-button
                                            class="u-btn-top"
                                            icon="el-icon-download"
                                            type="text"
                                            @click="pkgToTop(index)"
                                        ></el-button>
                                        <el-button
                                            class="u-btn-bottom"
                                            icon="el-icon-download"
                                            type="text"
                                            @click="pkgToTop(index, true)"
                                        ></el-button>
                                        <el-button
                                            class="u-btn-close"
                                            icon="el-icon-close"
                                            type="text"
                                            @click="removePkg(index)"
                                        ></el-button>
                                    </div>
                                </td>
                                <td>
                                    <el-tooltip placement="top" effect="dark" :content="`#${pkg.id}：${pkg.title}`">
                                        <a :href="`/dbm/pkg/${pkg.id}/raw`" target="_blank">
                                            <span>{{ pkg.key }}</span>
                                        </a>
                                    </el-tooltip>
                                </td>
                                <td>{{ pkg.current }}</td>
                                <td>
                                    <el-input
                                        size="mini"
                                        v-model="pkg.target"
                                        placeholder="新版本名"
                                        v-if="!building"
                                    ></el-input>
                                    <span v-else>{{ pkg.target }}</span>
                                </td>
                                <td>
                                    <el-input
                                        size="mini"
                                        v-model="pkg.commit"
                                        placeholder="新版本名"
                                        v-if="!building"
                                    ></el-input>
                                    <span v-else>{{ pkg.commit }}</span>
                                </td>
                                <td v-if="building" class="u-message-column">{{ pkg.message }}</td>
                            </tr>
                        </draggable>
                    </table>
                </div>

                <!-- 确定构建 -->
                <div class="u-build-options" v-if="!building">
                    <el-checkbox v-model="updateModules">同步依赖包至最新版</el-checkbox>
                </div>
                <div class="u-build-buttons">
                    <div class="u-build-buttons__confirm" v-if="build_success">
                        <el-button type="primary" size="small" @click="onConfirm" icon="el-icon-circle-check"
                            >构建结束</el-button
                        >
                    </div>
                    <div class="u-build-buttons__left" v-if="!building">
                        <el-button type="primary" size="small" @click="onRecipeSave" icon="el-icon-circle-plus-outline"
                            >保存为新方案</el-button
                        >
                        <el-button
                            type="primary"
                            size="small"
                            icon="el-icon-refresh"
                            @click="onRecipeUpdate"
                            v-if="this.recipe && this.recipe_id === this.last_recipe_id"
                        >
                            更新方案
                        </el-button>
                    </div>

                    <el-button plain size="small" @click="cancel" v-if="!building">取消</el-button>
                    <el-button type="primary" size="small" @click="start" v-if="!building">开始构建</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { mapState } from "vuex";
import draggable from "vuedraggable";
import {
    getBatchBuildInfo,
    appendModuleToPkg,
    getModuleList,
    downloadPkg,
    getPkgItems,
    removeItemFromPkg,
    uploadHub,
    removeModuleFromPkg,
    updatePkg,
} from "@/service/dbm/pkg";
import { getRecipeList, createRecipe, updateRecipe, deleteRecipe } from "@/service/dbm/recipe";
import DBMWorker from "@/utils/dbm/dbm.worker.js";
import dayjs from "dayjs";
import lodash from "lodash";

export default {
    name: "PkgBatch",
    props: ["selecting", "data"],
    components: {
        draggable,
    },
    data: () => ({
        loading: false,
        building: false,
        build_success: false,
        visible: false,
        checkAll: false,

        progress: 0,
        recipes: [],
        recipe_id: null,
        last_recipe_id: null,

        updateModules: true,
        drag: false,
        buildList: [],
    }),
    computed: {
        ...mapState({
            selected: (state) => state.pkg_selected,
        }),
        selectingModel: {
            get() {
                return this.selecting;
            },
            set(val) {
                this.$emit("update:selecting", val);
            },
        },
        cloudData() {
            return this.data.filter((item) => !item.is_raw);
        },
        dataSelectCount() {
            return this.cloudData.filter((item) => this.selected.find((i) => i.id === item.id)).length;
        },
        outputRecipe() {
            return this.buildList.map((item) => item.id);
        },
        recipe() {
            return this.recipes.find((item) => item.id === this.recipe_id);
        },
    },
    methods: {
        // 整体交互逻辑
        open() {
            this.visible = true;
            if (!this.buildList.length && this.selected.length) {
                this.initBuildList();
            }
        },
        onConfirm() {
            this.build_success = false;
            this.building = false;
            this.buildList = [];
            this.$store.commit(
                "REMOVE_PKG_SELECT",
                this.selected.map((item) => item.id)
            );
            this.visible = false;
        },
        async start() {
            // 方案更新
            if (!this.buildList.length) {
                this.$message({ message: "请添加构建数据包", type: "warning" });
                return;
            }
            // 初始化worker
            this.building = true;
            try {
                const worker = new DBMWorker();
                const vm = this;
                const build_result = {};
                for (let build of this.buildList) {
                    const pkg = build.pkg;
                    const workerTransfer = [];
                    // 检查是否需要先更新依赖
                    this.updateBuildProgress(build, 0, { status: "building" });
                    if (pkg.pkg_module.length && this.updateModules) {
                        this.updateBuildProgress(build, 0, { message: "更新依赖项" });
                        // 批量更新依赖
                        await appendModuleToPkg(
                            build.id,
                            pkg.pkg_module.map((item) => ({ id: item.module_id }))
                        );
                        // 更新依赖后，重新拉取包的信息
                        this.updateBuildProgress(build, 10, { message: "依赖更新成功" });
                        const res = await getModuleList(build.id);
                        const newModules = res.data.data;
                        pkg.pkg_module = newModules;
                    }
                    // 根据modules，一次下载依赖的构建结果（如果开启了更新依赖，检查build_result内是否有构建结果，有的话直接用）
                    if (pkg.pkg_module.length) {
                        this.updateBuildProgress(build, 10, { message: "获取依赖包" });
                        let progress = 0;
                        let progress_step = 100 / pkg.pkg_module.length;
                        for (let module of pkg.pkg_module) {
                            if (build_result[module.module_id] && this.updateModules) {
                                // 如果开启了更新依赖，检查build_result内是否有构建结果，有的话直接用
                                module.raw = build_result[module.module_id];
                            } else {
                                // 没有构建结果，下载
                                const filePath = module.record.file;
                                const { data: file } =
                                    (await downloadPkg(filePath).catch((err) => console.log(err))) || {};
                                module.raw = file;
                                workerTransfer.push(file);
                            }
                            progress += progress_step;
                            this.updateBuildProgress(build, 10 + (progress / 100) * 30);
                        }
                    }

                    // 拉取目标包的所有元数据项
                    this.updateBuildProgress(build, 40, { message: "获取元数据" });
                    const { data: items } = await getPkgItems(build.id);
                    this.updateBuildProgress(build, 50, { message: `获取成功，共${items.length}项` });
                    // 构建包
                    const data = await new Promise((resolve, reject) => {
                        worker.onmessage = (e) => {
                            const { type, data } = e.data;
                            if (type === "progress") {
                                const { progress } = data;
                                this.updateBuildProgress(build, 50 + ((progress - 40) / 40) * 30);
                            } else if (type === "result") {
                                resolve(data);
                            }
                        };
                        this.updateBuildProgress(build, 50, { message: `准备工作完成，构建中...` });
                        worker.postMessage(
                            {
                                cmd: "build",
                                data: {
                                    pkg,
                                    items,
                                    modules: pkg.pkg_module,
                                },
                            },
                            workerTransfer
                        );
                    });
                    // 缓存构建结果
                    const { buffer, invalid_items } = data;
                    build_result[pkg.id] = buffer;
                    this.updateBuildProgress(build, 80, { message: `构建成功，上传构建结果...` });
                    // 删除无效条目
                    if (invalid_items.length > 0) {
                        await removeItemFromPkg(pkg.id, invalid_items);
                    }
                    // 上传包
                    const form = new FormData();
                    form.append("jx3dat", new Blob([buffer], { type: "application/octet-stream" }));
                    form.append("version", build.target);
                    const upload_res = await uploadHub(form).catch((e) => {
                        this.updateBuildProgress(build, 0, {
                            message: `上传失败，流程终止，请检查网络环境或者重新登录...`,
                        });
                        this.build_success = false;
                        throw e;
                    });
                    this.updateBuildProgress(build, 90, { message: `上传成功，自动发版...` });
                    const { download_url: file } = upload_res?.data ?? {};
                    data.file = file;

                    // 发版
                    await this.updatePkg(build, data);
                    this.updateBuildProgress(build, 100, { status: "success", message: `构建成功` });
                }
                this.build_success = true;
            } catch (e) {
                console.log(e);
            }
        },
        async updatePkg(build, build_result) {
            const pkg = build.pkg;
            const data = lodash.pick(pkg, [
                "name",
                "client",
                "lang",
                "status",
                "title",
                "notice",
                "desc",
                "comment",
                "comment_visible",
                "allow_gift",
                "pkg_tag",
                "pkg_meta",
                "pkg_tag",
                "is_raw",
                "modules",
                "remark",
                "type",
            ]);
            const { file, total_items, items_snapshot } = build_result;
            data.version = String(build.target);
            data.commit = build.commit;
            data.items = items_snapshot;
            data.file = file;
            data.total_items = total_items;

            const modules = pkg.pkg_module.filter((mod) => !mod.record || !mod.module);
            if (modules.length) {
                await removeModuleFromPkg(pkg.id, modules.map((mod) => mod.module_id).join(","));
            }
            const modules_data = pkg.pkg_module.filter((mod) => mod.record);
            data.total_modules = modules_data.length;
            data.modules = modules_data;
            await updatePkg(pkg.id, data, { build: 1 });
            this.updateBuildProgress(build, 100, { status: "success", message: "构建成功" });
        },
        async updateBuildProgress(build, progress, { status, message } = {}) {
            if (progress !== undefined) build.progress = progress;
            if (status) build.status = status;
            if (message) build.message = message;
        },

        cancel() {
            this.visible = false;
        },
        initBuildList() {
            const pkg_ids = this.recipe
                ? this.recipe.recipe
                : this.selected.filter((item) => !item.is_raw).map((item) => item.id);
            if (!pkg_ids) return;
            this.loading = true;
            getBatchBuildInfo(pkg_ids.join(","))
                .then((res) => {
                    const data = res.data.data;
                    const commit = dayjs().format("YYYY-MM-DD HH:mm:ss 改动");
                    this.buildList = pkg_ids
                        .map((id) => {
                            const pkg = data.find((i) => i.id === id);
                            if (pkg) {
                                // 包加入selected
                                if (!this.selected.find((i) => i.id === id)) this.selected.push(pkg);
                                const version = pkg.pkg_record[0]?.version || 0;
                                return {
                                    // 基本信息
                                    pkg: pkg,
                                    id: pkg.id,
                                    title: pkg.title,
                                    key: pkg.key,
                                    current: version,
                                    target: version ? this.nextVersion(version) : dayjs().format("YYMMDDHHmm"),
                                    commit,

                                    // 构建进度
                                    progress: 0,
                                    status: "success",
                                    message: "",
                                };
                            } else {
                                return null;
                            }
                        })
                        .filter((item) => item);
                    // 移除selected中不在buildList中的包
                    const ids = this.selected.map((item) => item.id);
                    this.$store.commit(
                        "REMOVE_PKG_SELECT",
                        ids.filter((id) => !this.buildList.find((i) => i.id === id))
                    );
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        nextVersion(version) {
            // 如果是日期格式
            let _version = version.startsWith("v") ? version.slice(1) : version;
            if (/2\d{5,}/.test(_version) && _version.length % 2 === 0) {
                // 可能是日期，硬猜
                if (_version.length === 6) {
                    _version = dayjs().format("YYMMDD");
                } else if (_version.length === 8) {
                    _version = dayjs().format("YYMMDDHH");
                } else if (_version.length === 10) {
                    _version = dayjs().format("YYMMDDHHmm");
                } else {
                    _version = null;
                }

                if (_version) {
                    return version.startsWith("v") ? `v${_version}` : _version;
                }
            }

            // 如果是 vx.x.x , 最后一位+1
            if (/^v?(\d+\.)+\d+$/.test(version)) {
                const arr = version.split(".");
                arr[arr.length - 1] = Number(arr[arr.length - 1]) + 1;
                return arr.join(".");
            }
            // 如果是数字，+1
            if (/^\d+$/.test(version)) {
                return Number(version) + 1;
            }

            return "";
        },

        // 包选择操作
        checkSwitch() {
            const isCheckAll = this.cloudData.every((item) => this.selected.find((i) => i.id === item.id));
            if (isCheckAll) {
                const ids = this.cloudData.map((item) => item.id);
                this.$store.commit("REMOVE_PKG_SELECT", ids);
            } else {
                const notSelected = this.cloudData.filter((item) => !this.selected.find((i) => i.id === item.id));
                this.selected.push(...notSelected);
            }
            this.checkAll = !isCheckAll;
        },
        pkgToTop(index, toBottom = false) {
            if (toBottom) {
                if (index < this.buildList.length - 1) {
                    const item = this.buildList.splice(index, 1)[0];
                    this.buildList.push(item);
                }
                return;
            }
            if (index > 0) {
                const item = this.buildList.splice(index, 1)[0];
                this.buildList.unshift(item);
            }
        },
        removePkg(index) {
            const pkg = this.buildList[index];
            this.$store.commit("REMOVE_PKG_SELECT", [pkg.id]);
            this.buildList.splice(index, 1);
        },
        // 构建方案逻辑
        loadRecipes() {
            getRecipeList().then((res) => {
                this.recipes = res.data.data;
            });
        },
        onRecipeSave() {
            this.$prompt("请输入方案名称", "添加方案", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputPattern: /\S+/,
                inputErrorMessage: "方案名称不能为空",
            })
                .then(({ value }) => {
                    createRecipe({ name: value, recipe: this.outputRecipe }).then((res) => {
                        this.recipes.push(res.data.data);
                        this.$message({ message: "方案创建成功", type: "success" });
                    });
                })
                .catch(() => {});
        },
        onRecipeUpdate() {
            this.$confirm("确定更新该方案吗？", "更新方案", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    updateRecipe(this.recipe_id, this.outputRecipe).then(() => {
                        const recipe = this.recipes.find((item) => item.id === this.recipe_id);
                        recipe.recipe = this.outputRecipe;
                        this.$message({ message: "方案更新成功", type: "success" });
                    });
                })
                .catch(() => {});
        },
        onRecipeDelete(id) {
            this.$confirm("确定删除该方案吗？", "删除方案", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    deleteRecipe(id).then(() => {
                        this.recipes = this.recipes.filter((item) => item.id !== id);
                        if (this.recipe_id === id) this.recipe_id = null;
                        this.$message({ message: "方案删除成功", type: "success" });
                    });
                })
                .catch(() => {});
        },
        onRecipeSelect() {
            if (this.buildList.length) {
                this.$confirm("切换方案将重置当前已调配好的构建顺序，是否清空？", "切换方案", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.buildList = [];
                        this.initBuildList();
                        this.last_recipe_id = this.recipe_id;
                    })
                    .catch(() => {
                        this.recipe_id = this.last_recipe_id;
                    });
            } else {
                this.initBuildList();
                this.last_recipe_id = this.recipe_id;
            }
        },
        // 样式生成
        progressStyle(pkg) {
            const progress = pkg.progress;
            return {
                width: `${progress}%`,
            };
        },
    },
    watch: {
        selected() {
            this.checkAll = this.cloudData.every((item) => this.selected.find((i) => i.id === item.id));
        },
        data() {
            this.checkAll = this.cloudData.every((item) => this.selected.find((i) => i.id === item.id));
        },
    },
    mounted() {
        this.loadRecipes();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/pkg/batch.less";
</style>
