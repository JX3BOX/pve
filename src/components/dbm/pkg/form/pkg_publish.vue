<template>
    <el-dialog class="m-pkg-publish" :visible="modelValue" @close="onClose" title="数据包发布" append-to-body>
        <el-form
            label-width="80px"
            label-position="left"
            :model="form"
            ref="form"
            :rules="rules"
            :disabled="building || loading"
            status-icon
        >
            <el-form-item label="构建">
                <el-checkbox v-model="form.build" @change="onBuildChange">是</el-checkbox>
                <span class="u-warning"> <i class="el-icon-warning-outline"></i>如不进行数据构建，请取消勾选 </span>
            </el-form-item>
            <el-form-item label="当前版本">
                <span>{{ current_version || "v0.0.0" }}</span>
            </el-form-item>
            <el-form-item label="版本号" prop="version" :inline-message="true">
                <el-input
                    v-model="form.version"
                    placeholder="输入版本号，不能包含#和@"
                    :disabled="!form.build"
                    size="small"
                    @change="onVersionChange"
                ></el-input>
            </el-form-item>
            <el-form-item label="发版说明">
                <el-input
                    v-model="form.commit"
                    placeholder="输入发版说明"
                    type="textarea"
                    :rows="4"
                    :disabled="!form.build"
                ></el-input>
            </el-form-item>
        </el-form>
        <div class="m-build-info" v-if="building">
            <p>
                <span>构建进度</span>
                <span v-if="build_log"> - </span>
                <span class="m-build-log">{{ build_log }}</span>
            </p>
            <el-progress
                :percentage="build_progress"
                text-inside
                :stroke-width="20"
                :status="!build_error ? 'success' : 'exception'"
            ></el-progress>
        </div>

        <template #footer>
            <div class="m-publish__footer">
                <el-button @click="onClose">取消</el-button>
                <el-button type="primary" @click="onConfirm" :loading="loading">{{ confirmText }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import {
    updatePkg,
    uploadHub,
    checkName,
    getPkgItems,
    downloadPkg,
    removeModuleFromPkg,
    removeItemFromPkg,
    refreshCache,
} from "@/service/dbm/pkg.js";
import { mapState } from "vuex";
import { pick } from "lodash";
import dayjs from "dayjs";
import { types } from "@/assets/data/dbm/types.json";
import lodash from "lodash";
import DBMWorker from "@/utils/dbm/dbm.worker.js";
import { sleep } from "@/utils/dbm/parse";
import { serializer } from "luadata";
import { toJx3dat } from "@/utils/dbm/jx3dat.js";

export default {
    name: "PkgPublish",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        pkgType: {
            type: Number,
            default: 1,
        },
    },
    model: {
        prop: "modelValue",
        event: "update:modelValue",
    },
    data() {
        return {
            loading: false,
            form: {
                build: true,
                version: "",
                commit: "",
            },
            current_version: "",

            building: false,
            build_progress: 0,
            build_error: false,
            build_log: "拉取元数据",
            build_worker: null,

            rules: {
                version: [{ validator: this.checkVersion, trigger: "blur" }],
            },
        };
    },
    computed: {
        ...mapState({
            pkg: "pkg",
            pkg_file: "pkg_file",
        }),
        confirmText() {
            return this.form.build ? "构建发版" : "确认更新";
        },
        items() {
            const items = {};
            const pkg_items = lodash.cloneDeep(this.pkg.items);
            for (let type in types) {
                const value = pkg_items[type];
                items[type] =
                    (value &&
                        value
                            .replace(/，/g, ",")
                            .replace(/,$/, "")
                            .split(",")
                            .filter((item) => item)
                            .map(Number)) ||
                    [];
                delete pkg_items[type];
            }
            // items["__meta"] = pkg_items;
            return items;
        },
        total_items() {
            let total = 0;
            Object.values(this.items).forEach((item) => {
                total += item.length;
            });
            return total;
        },
    },
    watch: {
        pkg: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val?.pkg_record) {
                    this.current_version = val.pkg_record.version;
                }
            },
        },
    },
    mounted() {
        this.form.commit = dayjs().format("YYYY-MM-DD HH:mm:ss") + " 改动";
    },
    beforeDestroy() {
        this.build_worker?.terminate();
    },
    methods: {
        updateBuildLog(message, progress) {
            if (progress) this.build_progress = Math.round(progress);
            if (message) this.build_log = message;
        },
        async build() {
            /**
             * 10% 下载元数据
             * 30% 下载依赖包
             * 40% 包信息写入
             * 65% 依赖包合并
             * 70% 元数据构建
             * 80% 元数据合并
             * 90% 上传
             * 100% 构建/更新成功
             */
            this.build_progress = 0;
            this.building = true;
            this.updateBuildLog("开始构建", 0);
            // 接口获取元数据
            const { data: items } = await getPkgItems(this.pkg.id);
            this.updateBuildLog(`元数据：拉取成功，共 ${items.length} 条。`, 10);

            const modules_data = lodash.cloneDeep(this.pkg.modules);
            const modules = [];
            const transfers = [];
            const module_download_progress = 20 / modules_data.length;
            // 分别下载各个依赖包
            for (let index in modules_data) {
                const new_progress = 10 + (Number(index) + 1) * module_download_progress;
                const count_str = `(${Number(index) + 1}/${modules_data.length})`;
                const module = modules_data[index];
                const key = module?.module?.key;
                const uuid = module.uuid;
                if (!module.record) {
                    this.updateBuildLog(`依赖包${count_str}: 【${key}】(${uuid}) 没有构建记录，跳过。`, new_progress);
                    continue;
                }
                try {
                    const filePath = module.record.file;
                    const { data: file } = await downloadPkg(filePath);
                    transfers.push(file);
                    module.raw = file;
                    modules.push(module);
                } catch (e) {
                    this.updateBuildLog(`依赖包${count_str}: 【${key}】(${uuid}) 下载/解析失败，跳过。`, new_progress);
                }
                this.updateBuildLog(`依赖包${count_str}: 【${key}】(${uuid}) 下载成功。`, new_progress);
                await sleep(996);
            }
            // 按优先级排序
            modules.sort((a, b) => a.priority - b.priority);

            // 合并等计算密集任务交给worker
            this.updateBuildLog(`依赖包: 下载完成。`, 30);
            this.build_worker = new DBMWorker();
            const data = await new Promise((resolve) => {
                this.build_worker.onmessage = (e) => {
                    const { type, data } = e.data;
                    if (type === "progress") {
                        const { message, progress } = data;
                        this.updateBuildLog(message, progress);
                    } else if (type === "result") {
                        this.build_worker.terminate();
                        resolve(data);
                    }
                };
                this.build_worker.postMessage(
                    {
                        cmd: "build",
                        data: {
                            pkg: lodash.cloneDeep(this.pkg),
                            items,
                            modules,
                        },
                    },
                    transfers
                );
            });
            const { buffer, invalid_items } = data;
            if (invalid_items.length > 0) {
                this.updateBuildLog(`删除无效条目...`, 80);
                await removeItemFromPkg(this.pkg.id, invalid_items);
                await sleep(233);
            }
            this.updateBuildLog(`上传构建结果...`, 82);
            const form = new FormData();
            form.append("jx3dat", new Blob([buffer], { type: "application/octet-stream" }));
            form.append("version", this.form.version);
            const upload_res = await uploadHub(form).catch((e) => {
                console.log(e);
                this.updateBuildLog(`上传构建结果失败，请稍后再试`, 0);
                this.building = false;
            });
            const { download_url: file } = upload_res.data ?? {};
            if (!file) return;
            this.updateBuildLog(`上传构建结果...Done`, 90);
            await sleep(233);
            delete data["buffer"];
            return { ...data, file };
        },
        onClose() {
            this.$emit("update:modelValue", false);
        },
        onConfirm() {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    this.building = true;
                    let data = pick(this.pkg, [
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
                        "is_raw",
                        "modules",
                        "remark",
                        "type",
                    ]);
                    data.pkg_tag = lodash.uniq(data.pkg_tag);
                    // 目标监控单独处理tags
                    if (data.type == 2) {
                        data.pkg_tag = this.$store.state.target_tags;
                    }
                    // 场景标记地图
                    if (data.type == 3) {
                        data.pkg_tag = this.$store.state.mark_map;
                    }
                    try {
                        if (this.form.build) {
                            if (this.pkg.type == 3) {
                                const mark_data = this.$store.state.mark_data;
                                const target_data = mark_data.map((item, index) => {
                                    return {
                                        mark: index + 1,
                                        remark: item.remark,
                                        img: item.img,
                                        x: Number(item.x) || 0,
                                        y: Number(item.y) || 0,
                                        z: Number(item.z) || 0,
                                    };
                                });
                                const lua = serializer.serialize(target_data);
                                const buffer = toJx3dat(lua);
                                const formData = new FormData();
                                formData.append("jx3dat", new Blob([buffer], { type: "application/octet-stream" }));
                                formData.append("version", this.form.version);
                                await uploadHub(formData)
                                    .then((res) => {
                                        data.file = res.data.download_url;
                                    })
                                    .finally(() => {
                                        this.loading = false;
                                    });
                                data.version = String(this.form.version);
                                data.commit = this.form.commit;
                                data.items = {};
                                data.modules = [];
                                data.total_modules = 0;
                                data.total_items = 0;
                                data.file_name = `${this.pkg.key}@${this.form.version}.jx3dat`;
                            } else if (this.pkg.is_raw) {
                                // 没有文件则报错
                                if (!this.pkg_file) {
                                    this.$message.error("请上传数据文件");
                                    this.loading = false;
                                    return;
                                }
                                // 上传文件
                                const formData = new FormData();
                                formData.append("jx3dat", this.pkg_file);
                                formData.append("version", this.pkg.name);
                                await uploadHub(formData)
                                    .then((res) => {
                                        data.file = res.data.download_url;
                                    })
                                    .finally(() => {
                                        this.loading = false;
                                    });

                                // 存储file_name
                                data.file_name = this.pkg_file?.name || "";

                                // 针对目标监控
                                if (data.type == 2) {
                                    data.pkg_tag = this.$store.state.target_tags;
                                }

                                data.total_modules = 0;
                                data.total_items = 0;
                                data.version = this.form.version;
                                data.commit = this.form.commit;
                            } else {
                                const { file, total_items, items_snapshot } = await this.build();
                                // data.total_items = this.total_items;
                                data.version = String(this.form.version);
                                data.commit = this.form.commit;
                                data.items = items_snapshot;
                                data.file = file;
                                data.total_items = total_items;

                                // 移除失效包
                                const modules = this.pkg.modules.filter((mod) => !mod.record || !mod.module);
                                if (modules.length) {
                                    await removeModuleFromPkg(
                                        this.pkg.id,
                                        modules.map((module) => module.module_id).join(",")
                                    ).catch((e) => {
                                        this.$alert("移除失效依赖包失败", "错误", {
                                            type: "error",
                                            iconClass: "el-icon-warning-outline",
                                            confirmButtonText: "确定",
                                        });
                                    });
                                }
                                const modules_data = this.pkg.modules.filter((module) => module.record);
                                data.total_modules = modules_data.length;
                                data.modules = modules_data;
                            }
                        }
                    } catch (e) {
                        this.updateBuildLog(`数据包构建或上传过程中出现问题，构建失败。请打开浏览器控制台截图反馈。`);
                        this.build_error = true;
                        this.loading = false;
                        console.error(e);
                        return;
                    }

                    data.pkg_meta = pick(this.pkg.pkg_meta, [
                        "szAuthor",
                        "szServer",
                        "szLang",
                        "szOfficialVoicePacketUUID",
                        "szCustomVoicePacketUUID",
                        "szEdition",
                    ]);

                    await updatePkg(this.pkg.id, data, { build: Number(this.form.build) })
                        .then(() => {
                            if (!this.pkg.is_raw && this.form.build) {
                                this.updateBuildLog(`数据包构建成功`, 100);
                            }
                            this.$message.success("提交成功");
                            this.$emit("update:modelValue", false);

                            // 刷新缓存
                            refreshCache(this.pkg.key);

                            this.$router.push({
                                name: "pkg_detail_raw",
                                params: {
                                    id: this.pkg.id,
                                },
                            });
                        })
                        .finally(() => {
                            this.building = false;
                            this.loading = false;
                        });
                }
            });
        },
        onBuildChange(val) {
            if (val) {
                this.form.commit = dayjs().format("YYYY-MM-DD HH:mm:ss") + " 改动";
            }
        },
        onVersionChange() {
            // 去除#和@
            this.form.version = this.form.version?.replace(/[@#]/g, "");
        },
        checkVersion(rule, value, callback) {
            if (this.form.build) {
                if (!value) {
                    callback(new Error("请输入版本号"));
                } else {
                    checkName({ key: this.pkg.key, version: value }).then((res) => {
                        if (res.data.data) {
                            callback(new Error("版本号已存在"));
                        } else {
                            callback();
                        }
                    });
                }
            } else {
                callback();
            }
        },
    },
};
</script>

<style lang="less">
.m-pkg-publish {
    .u-warning {
        .ml(10px);
        color: orange;
        i {
            .mr(3px);
        }
        .fz(12px);
    }
    .el-form-item {
        .mb(10px);
    }
    .m-build-log {
        .bold;
    }
}
</style>
