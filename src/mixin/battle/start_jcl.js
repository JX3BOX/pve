import analysisWorker from "@/utils/battle/jcl/analysis.worker.js";

export default {
    methods: {
        // 入口函数，以analysis_$type命名
        analysis_jcl() {
            const vm = this;
            return new Promise((resolve) => {
                // 步骤函数以build_$type_xx命名（因为mixin会合并）
                // 本mixin中需要完成剩下75%进度，可以分更多步骤
                const raw = vm.$store.state.raw;
                let worker = new analysisWorker();
                worker.postMessage(raw);
                worker.onmessage = (e) => {
                    let { type, data } = e.data;
                    if (type == 'statusUpdated') {
                        vm.updateStatus(data.desc, data.status, data.processing);
                    } else if (type == 'result') {
                        window.$store = data;
                        this.$store.commit("set", {
                            key: "analysis",
                            val: true
                        })
                        this.updateStatus('整理结果', 1);
                        vm.updateStatus('分析完成', 3, 100);
                        resolve();
                    }
                }
            })
        }
    },
};
