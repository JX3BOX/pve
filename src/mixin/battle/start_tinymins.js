import parse from "@/utils/battle/tinymins_v2/formatToHashmap";
import getDatabaseInfo from "@/utils/battle/tinymins_v2/databaseInfo";
import { buildRaidData } from "@/utils/battle/tinymins_v2/buildData";

export default {
    methods: {
        // 入口函数，以analysis_$type命名
        async analysis_tinymins() {
            const raw = this.$store.state.raw;
            // 步骤函数以build_$subject_xx命名（因为mixin会合并）
            // 本mixin中需要完成剩下75%进度，可以分更多步骤
            // 1.解析为json
            this.updateStatus('解析文件', 0);
            const data = await this.buildTinyminsData(raw);
            this.updateStatus('补充信息', 0);
            // 2.补充数据库信息字段
            await this.buildTinyminsInfo(data);
            // 3.分析业务数据
            this.updateStatus('分析结果', 0);
            await this.buildTinyminsAnalysis(data);
        },
        async buildTinyminsData(raw) {
            return new Promise((resolve, reject) => {
                if (raw) {
                    try {
                        const data = parse(raw);
                        this.$store.commit("set", {
                            key: "data",
                            val: data,
                        });
                        resolve(data);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject("raw is empty");
                }
            })
                .then((data) => {
                    this.updateStatus('解析文件', 1, 50);
                    return data;
                })
                .catch((e) => {
                    this.updateStatus('解析文件', 2);
                    console.log(e);
                });
        },
        async buildTinyminsInfo(data) {
            return new Promise((resolve, reject) => {
                if (data) {
                    try {
                        const extend = getDatabaseInfo(data);
                        const info = Object.assign({}, this.$store.state.info, extend);
                        this.$store.commit("set", {
                            key: "info",
                            val: info,
                        });
                        resolve(info);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject("data is empty");
                }
            })
                .then((data) => {
                    this.updateStatus('补充信息', 1, 75);
                    return data;
                })
                .catch((e) => {
                    this.updateStatus('补充信息', 2);
                    console.log(e);
                });
        },
        async buildTinyminsAnalysis(data) {
            return new Promise((resolve, reject) => {
                if (data) {
                    try {
                        const analysis = buildRaidData(data);
                        this.$store.commit("set", {
                            key: "analysis",
                            val: analysis,
                        });
                        resolve(analysis);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject("data is empty");
                }
            })
                .then((analysis) => {
                    this.updateStatus('分析结果', 3, 100);
                    return analysis;
                })
                .catch((e) => {
                    this.updateStatus('分析结果', 2);
                    console.log(e);
                });
        },
    },
};
