<template>
    <div class="m-parse-update-pull">
        <el-progress :text-inside="true" :stroke-width="24" :percentage="progress" status="success"></el-progress>
        <div class="u-logs">
            <div class="u-log" v-for="(log, index) in logs" :key="index">
                <i class="u-log-icon el-icon-loading" v-if="log.status == 0"></i>
                <i class="u-log-icon el-icon-success" v-else-if="log.status == 1"></i>
                <i class="u-log-icon el-icon-error" v-else-if="log.status == -1"></i>
                <div class="u-log-text">{{ log.desc }}</div>
            </div>
        </div>
        <div class="m-parse-update-opr">
            <el-button type="primary" @click="cancel">上一步</el-button>
            <el-button type="primary" @click="next" :disabled="status != 1">下一步</el-button>
        </div>
    </div>
</template>

<script>
import { downloadPkg, getMyPkg } from "@/service/dbm/pkg";
export default {
    name: "ParsePull",
    props: {
        pkg_id: {
            type: Number,
            required: true,
        },
    },
    data: () => ({
        progress: 0,
        logs: [],
        status: 0,

        result: [],
    }),
    methods: {
        updateProgress(log, status, progress) {
            if (progress) this.progress = progress;
            const item = this.logs.find((item) => item.desc === log);
            if (item) {
                item.status = status;
            } else {
                this.logs.push({
                    desc: log,
                    status: status ?? 0,
                });
            }
        },
        /**
         * 10% 获取目标包信息
         * 20% 下载目标包
         * 45% 解析目标包
         * 80% 比对目标包
         * 100% 完成
         */
        async start() {
            const pkg_res = await getMyPkg(this.pkg_id);
            this.updateProgress("目标包信息获取成功", 1, 10);
            this.updateProgress("下载目标包", 0);
            const pkg_record = pkg_res.data?.data?.pkg_record;
            if (!pkg_record) {
                this.updateProgress("目标包没有构建记录，请先构建一次目标包", -1, 0);
                return;
            }
            const file_res = await downloadPkg(pkg_record.file);
            this.updateProgress("下载目标包", 1, 20);
            const file = file_res.data;
            const compareWorker = this.$store.state.parse_worker;
            compareWorker.onmessage = (e) => {
                const { type, data } = e.data;
                if (type === "progress" && data.options?.from === "compare")
                    this.updateProgress(data.message, data.options?.status, data.progress);
                if (type === "result" && e.data?.from === "compare") {
                    this.result = Object.freeze(data);
                    this.status = 1;
                    this.updateProgress("差异分析完成", 1, 100);
                }
            };
            compareWorker.postMessage({
                cmd: "compare",
                data: {
                    buffer: file,
                    pkg_id: this.pkg_id,
                },
            });
        },
        next() {
            this.$emit("success", this.result);
        },
        cancel() {
            this.$emit("cancel");
        },
    },
    mounted() {
        this.start().catch((e) => {
            console.log(e);
        });
    },
};
</script>

<style lang="less">
.m-parse-update-pull {
    .u-logs {
        display: flex;
        flex-direction: column;
        align-items: center;
        .pt(20px);
        gap: 10px;
        height: 400px;
    }
    .u-log {
        display: flex;
        align-items: center;
        gap: 10px;
        .u-log-icon {
            font-size: 20px;
            .mb(-2px);

            &.el-icon-success {
                color: #67c23a;
            }
            &.el-icon-error {
                color: #f56c6c;
            }
        }
    }
}
</style>
