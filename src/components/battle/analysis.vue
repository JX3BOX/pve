<template>
    <div class="m-analysis">
        <template v-if="!error">
            <el-progress class="u-processing" :percentage="progress" color="rgb(103, 194, 58)"></el-progress>
            <p class="u-processing-saying">正在驯养上品的好鸽子</p>
            <div class="u-processing-desc">
                <p class="u-processing-desc-item" v-for="(item, key) in statusMap" :key="key">
                    <span>{{ item.desc }}</span>
                    <!-- 具体进度展示 -->
                    <span>
                        <i :class="statusIcon(item.status)[0]" :style="{ color: statusIcon(item.status)[1] }"></i>
                    </span>
                </p>
            </div>
        </template>
        <template v-else>
            <el-alert title="数据不存在或没有访问权限" type="error" :closable="false" show-icon center> </el-alert>
        </template>
    </div>
</template>

<script>
import { isKData, isBinary, luadata, DictType, readKData, readBinary } from "@jx3box/jx3-luadata";
import { parseJx3dat } from "luat2json";
import PakoWorker from "@/utils/battle/pako.worker.js";
import iconv from "iconv-lite";

import start_tinymins from "@/mixin/battle/start_tinymins";
import start_official from "@/mixin/battle/start_official";

import mixin_progress from "@/mixin/battle/progress.js";

import { getBattle } from "@/service/battle/team";
import axios from "axios";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { __ossMirror, __ossRoot, __down } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "analysis",
    props: ["id", "battleId"],
    components: {},
    mixins: [mixin_progress, start_tinymins, start_official],
    data: () => ({
        blob: null, //下载到的文件

        error: false, // 错误
    }),
    computed: {
        subject: function () {
            return this.$store.state.info.subject;
        },
        type: function () {
            return this.$store.state.info.type;
        },
    },
    methods: {
        // 看看store里面有没有存当前看的战斗的信息，没有的话就去请求
        getBattleInfo() {
            let current = this.$store.state.current;
            if (current && (this.id == current.id || this.battleId == current.battle_id)) {
                // store有数据，直接拿
                this.$store.commit("SET_INFO", {
                    subject: current.subject || "team",
                    type: current.type,
                });
                return new Promise((resolve) => resolve(current));
            } else {
                // store没数据，请求
                let state;
                state = getBattle(this.id);

                return state
                    .then((res) => {
                        if (res.data.code === 0) {
                            let data = res.data.data;
                            this.$store.commit("set", {
                                key: "current",
                                val: data,
                            });
                            this.$store.commit("SET_INFO", {
                                subject: data.subject || "team",
                                type: data.type,
                            });
                        } else {
                            this.error = true;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        this.error = true;
                    });
            }
        },
        // 下载地址拼接
        resolveDownLink(url, fromOrigin = false) {
            if (url.startsWith("http")) {
                return resolveImagePath(url);
            } else {
                const downRoot = __down;
                const cdnRoot = __ossMirror;
                return (fromOrigin ? cdnRoot : downRoot) + url?.slice(1);
            }
        },
        // 下载战斗数据文件
        download(fromOrigin = false) {
            let url = this.$store.state.current.raw;
            this.updateStatus("下载战斗数据", 0);
            // 下载压缩文件
            return axios({
                url: this.resolveDownLink(url, fromOrigin),
                method: "GET",
                responseType: "blob",
                onDownloadProgress: (e) => {
                    const downloadProgress = e.loaded / e.total;
                    this.updateStatus("下载战斗数据", 0, Math.floor(downloadProgress * 15));
                },
            });
        },
        // 解压
        inflate() {
            this.updateStatus("解压战斗数据", 0);
            return this.blob.arrayBuffer().then((buffer) => {
                return new Promise((resolve) => {
                    let worker = new PakoWorker();
                    worker.onmessage = (e) => {
                        e = e.data;
                        if (e.type == "progress") {
                            this.updateStatus("解压战斗数据", 0, e.data * 0.1 + 15);
                        } else if (e.type == "result") {
                            this.updateStatus("解压战斗数据", 1, 25);
                            resolve(e.data);
                        }
                    };
                    worker.postMessage({ type: "inflate", raw: buffer });
                });
            });
        },
        // 如果没有传id或者battleId，那就直接file reader读store的file
        readFile() {
            this.updateStatus("读取战斗数据文件", 0);
            if (this.subject != "official") {
                // 对于单文件的战斗数据
                return this._readFile(this.$store.state.file).then((payload) => {
                    if (isKData(payload)) payload = readKData(payload).payload;
                    if (isBinary(payload)) payload = readBinary(payload, { dictType: DictType.Object }).payload;
                    else payload = parseJx3dat(iconv.decode(Buffer.from(payload), "gbk"));
                    this.$store.commit("set", {
                        key: "raw",
                        val: payload,
                    });
                    this.updateStatus("读取战斗数据文件", 1, 25);
                });
            } else {
                // 官方战斗数据是多个文件，需要单独处理。
                // 考虑官方战斗数据转换为tinymins数据的data形式
                // 然后直接序列化成JSON文件用于上传下载什么的
                return new Promise(async (resolve) => {
                    let result = {};
                    for (let file of this.$store.state.file) {
                        let payload = await this._readFile(file);
                        if (isKData(payload)) payload = readKData(payload).payload;
                        if (isBinary(payload)) payload = readBinary(payload, { dictType: DictType.Object });
                        else
                            payload = luadata.unserialize(iconv.decode(Buffer.from(payload), "gbk").slice(6), {
                                dictType: "object",
                            });
                        result[file.type] = payload;
                    }
                    this.$store.commit(
                        "set",
                        Object.freeze({
                            key: "raw",
                            val: result,
                        })
                    );
                    resolve(true);
                    this.updateStatus("读取战斗数据文件", 1, 25);
                });
            }
        },
        // file => arrayBuffer
        _readFile(file) {
            return new Promise((resolve) => {
                let reader = new FileReader();
                reader.onload = (e) => {
                    let result = e.target.result;
                    resolve(result);
                };
                reader.readAsArrayBuffer(file.raw);
            });
        },
        start: async function () {
            // 清空之前的分析结果
            this.$store.commit("set", {
                key: "result",
                val: {},
            });
            // 检查是否传入ID，如果没有传入ID就直接读store的file，否则需要先下载
            if (this.id || this.battleId) {
                await this.getBattleInfo();
                let res;
                try {
                    res = await this.download(false);
                } catch (e) {
                    try {
                        res = await this.download(true);
                    } catch (e) {
                        this.error = true;
                    }
                }
                if (!res) return;

                this.blob = res.data;
                this.updateStatus("下载战斗数据", 1, 15);
                const raw = await this.inflate();

                if (this.subject != "official") {
                    const data = parseJx3dat(raw);
                    this.$store.commit("set", {
                        key: "raw",
                        val: data,
                    });
                } else {
                    const data = JSON.parse(raw);
                    for (const key in data) {
                        data[key] = luadata.unserialize(data[key].replace(/^return /, ""), { dictType: "object" });
                    }
                    this.$store.commit("set", {
                        key: "raw",
                        val: data,
                    });
                    console.log(data);
                }
            } else {
                await this.readFile();
            }

            let file = this.$store.state.file;
            this.$store.commit("patch", {
                file_name: file.name,
                file_size: file.size,
            });
            const action = "analysis_" + this.type;
            if (!this[action]) {
                this.error = true;
                return;
            }
            await this[action]();
            this.$emit("success");
        },
    },
    mounted: function () {
        this.start();
    },
};
</script>

<style lang="less">
.m-analysis {
    .mt(24px);
    .fz(12px,2);
    .u-processing {
        .mt(10px);
    }

    .u-processing-saying {
        .color(#99a9bf);
        .fz(16px,2);
        text-align: center;
    }
    .u-processing-desc {
        min-height: 280px;
        text-align: center;
    }
    .u-processing-desc-item {
        margin: 0 0 4px 0;
        i {
            margin-left: 6px;
        }
    }
}
</style>
