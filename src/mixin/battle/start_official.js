import { jx3dat2DATA } from "@/utils/battle/jx3dat/jx3dat2data";
import getDatabaseInfo from "@/utils/battle/tinymins_v2/databaseInfo";

export default {
    methods: {
        // 入口函数，以analysis_$type命名
        async analysis_official() {
            // 步骤函数以build_$type_xx命名（因为mixin会合并）
            // 本mixin中需要完成剩下75%进度，可以分更多步骤
            const raw = this.$store.state.raw;
        
            let data = await this.buildOfficialData(raw);
            this.updateStatus('补充信息', 0);
            // 2.补充数据库信息字段
            await this.buildOfficialInfo(data);
            // 3.分析业务数据
            this.updateStatus('分析结果', 0);
            await this.buildTinyminsAnalysis(data);
        },
        async buildOfficialData(raw) {
            return await jx3dat2DATA(raw);
        },
        async buildOfficialInfo(data) {
            return new Promise((resolve, reject) => {
                if (data) {
                    try {
                        const extend = getDatabaseInfo(data);
                        const info = Object.assign({}, extend, this.$store.state.info);
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
    },
};
