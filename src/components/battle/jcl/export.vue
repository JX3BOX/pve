<template>
    <el-dialog
        class="m-jcl-export"
        title="JCL日志导出"
        width="60%"
        :center="true"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
    >
        <div class="u-progress">
            <el-progress :percentage="progress" color="rgb(103, 194, 58)"></el-progress>
            <div class="u-progress-status">
                <p class="u-processing-status-item" v-for="(item, key) in statusMap" :key="key">
                    <span>{{ item.desc }}</span>
                    <span>
                        <i :class="statusIcon(item.status)[0]" :style="{ color: statusIcon(item.status)[1] }"></i>
                    </span>
                </p>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import ExportWorker from "@/utils/battle/jcl/export.worker.js";
import { saveAs } from "file-saver";
import mixin_progress from "@/mixin/battle/progress.js";

export default {
    name: "JclExport",
    components: {},
    mixins: [mixin_progress],
    data: () => ({
        dialogVisible: false,
        working: false,
        exporter: null,
    }),
    mounted() {},
    methods: {
        open() {
            this.dialogVisible = true;
            this.start();
        },
        start() {
            const vm = this;
            this.working = true;
            this.clearProgress();

            const filename =
                (this.$store.state.file
                    ? this.$store.state.file.name?.replace(/\.jcl/g, "")
                    : this.$store.state.current?.title) + "-JX3BOX-Export.csv";
            window.$store.filename = filename;
            const store = window.$store;
            this.exporter = new ExportWorker();
            this.exporter.onmessage = (e) => {
                const { type, data } = e.data;
                if (type === "statusUpdated") {
                    this.updateStatus(data.desc, data.status, data.processing);
                } else if (type === "result") {
                    this.updateStatus("构建完成，下载马上开始", 1, 99);
                    const blob = new Blob([data], { type: "application/octet-stream" });
                    saveAs(blob, filename);
                    this.updateStatus("导出成功", 3, 100);
                    vm.working = false;
                    vm.exporter.terminate();
                    vm.exporter = null;
                }
            };
            this.updateStatus("整理原始数据", 0, 0);
            this.exporter.postMessage(store);
        },
    },
};
</script>

<style lang="less">
.m-jcl-export {
    .mt(24px);
    .fz(12px,2);
    .u-progress {
        .mt(10px);
    }
    .u-progress-status {
        min-height: 280px;
        text-align: center;
    }
    .u-progress-desc-item {
        margin: 0 0 4px 0;
        i {
            margin-left: 6px;
        }
    }
}
</style>
