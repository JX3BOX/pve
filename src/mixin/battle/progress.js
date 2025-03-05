export default {
    data: () => ({
        statusMap: [],
        progress: 0,
    }),
    methods: {
        clearProgress() {
            this.statusMap = [];
            this.progress = 0;
        },
        updateStatus(desc, status, processing) {
            let ready = this.statusMap.find((item) => item.desc === desc);
            if (processing) this.progress = Math.floor(processing);
            if (ready) ready.status = status;
            else this.statusMap.push({ desc, status });
        },
        statusIcon(status) {
            const iconMap = {
                0: ["el-icon-loading", ""],
                1: ["el-icon-success", "green"],
                2: ["el-icon-error", "red"],
                3: ["el-icon-s-flag", "green"],
            };
            return iconMap[status];
        },
    }
}