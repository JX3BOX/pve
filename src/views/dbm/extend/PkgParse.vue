<template>
    <div class="v-data-parse">
        <div class="m-header" v-if="!hideHeaderStatus.includes(parse_status)">
            <h1 class="u-title"> 数据解析器 </h1>
            <p class="u-desc">
                分析本地现有的数据，一键导入云数据库，游戏导出格式请使用【除】压缩加密格式之外的。
                <a href="/tool/17695" target="_blank">[帮助文档]</a>
            </p>
            <div class="u-ops">
                <el-button class="u-reset" plain icon="el-icon-delete" size="small" type="warning" @click="reset">
                    清空重置
                </el-button>
            </div>
        </div>
        <parse-import @start="start" v-if="parse_status == 'selecting'" />
        <parse-progress
            ref="progress"
            v-if="parse_status == 'parsing' || parse_status == 'parsed'"
            @status="onStatusChange"
        />
        <parse-result v-if="parse_status == 'view'" />
        <parse-update v-if="parse_status == 'update'" />
    </div>
</template>

<script>
import ParseImport from "@/components/dbm/parse/parse_import.vue";
import ParseProgress from "@/components/dbm/parse/parse_progress.vue";
import ParseResult from "@/components/dbm/parse/result/parse_result.vue";
import ParseUpdate from "@/components/dbm/parse/update/parse_update.vue";

import DBMWorker from "@/utils/dbm/dbm.worker.js";
import { mapState } from "vuex";
import { pushSource } from "@/service/dbm/pkg";
import type_database_map from "@/assets/data/dbm/type_database_map.json";

export default {
    name: "Parse",
    components: {
        ParseImport,
        ParseProgress,
        ParseResult,
        ParseUpdate,
    },
    data: () => ({
        hideHeaderStatus: ["view", "update"],
    }),
    computed: {
        ...mapState(["parser", "parse_file", "parse_result", "parse_status"]),
    },
    methods: {
        reset() {
            this.$store.commit("RESET_PARSER");
        },
        /**
         * 10% 读取文件
         * 15% 编码转换
         * 20% 解析文件
         * 25% 条目统计
         * 75% 生成结果
         * 100% 资源整理，解析完成
         */
        start() {
            this.$store.state.parse_worker = new DBMWorker();
            const parseWorker = this.$store.state.parse_worker;
            parseWorker.onmessage = (e) => {
                const { type, data } = e.data;
                if (type === "progress") {
                    this.$refs.progress.update(data);
                } else if (type === "result") {
                    this.$store.commit("SET_PARSE_RESULT", Object.freeze(data));
                    this.$store.commit("SET_PARSE_STATUS", "parsed");
                    parseWorker.onmessage = null;
                    if (window.pushSourceScale !== undefined) {
                        this.pushSourceRank();
                    }
                }
            };
            this.$store.commit("SET_PARSE_STATUS", "parsing");
            parseWorker.postMessage({
                cmd: "parse",
                data: {
                    file: this.parse_file.raw,
                },
            });
        },
        onStatusChange(status) {
            this.$store.commit("SET_PARSE_STATUS", status);
        },
        pushSourceRank() {
            /**
             * 人工干预指数 - 仅支持人工操作
             * 浏览器控制台 pushSourceRank = true
             */
            const query_items = [];
            const result = this.parse_result;
            for (let type in result) {
                if (["TALK", "CHAT"].includes(type)) continue;
                const db_type = type_database_map[type];

                for (let item of result[type]) {
                    const payload = item.payload;
                    const { dwID, nLevel } = payload;
                    let query_item = query_items.find(
                        (item) =>
                            item.type === db_type &&
                            item.id === dwID &&
                            (item.level === nLevel || ["NPC", "DOODAD"].includes(type))
                    );
                    if (!query_item) {
                        query_item = {
                            type: db_type,
                            id: dwID,
                            count: window.pushSourceScale,
                        };
                        if (!["NPC", "DOODAD"].includes(type)) query_item.level = nLevel;

                        query_items.push(query_item);
                    } else {
                        query_item.count += window.pushSourceScale;
                    }
                }
            }
            pushSource(query_items)
                .then((res) => console.log(res.data))
                .catch((e) => console.log(e));
        },
    },
    mounted() {
        if (Object.keys(this.parse_result).some((key) => this.parse_result[key].length)) {
            this.$store.commit("SET_PARSE_STATUS", "view");
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/parse/parse.less";
</style>
