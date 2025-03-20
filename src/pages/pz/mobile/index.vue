<template>
    <router-view />
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { getGlobalSetting } from "@/service/pz/schema.js";
export default {
    name: "Mobile",
    mounted() {
        this.init();
    },
    methods: {
        checkSetting: function() {
            // 自动保存设定
            let cache = sessionStorage.getItem("pz_setting");
            if (!cache) {
                getGlobalSetting().then((res) => {
                    let setting = res.data.data;
                    this.$store.commit("SET_STATE", {
                        key: "setting",
                        value: setting,
                    });
                    sessionStorage.setItem("pz_setting", JSON.stringify(setting));
                });
            } else {
                this.$store.commit("SET_STATE", {
                    key: "setting",
                    value: JSON.parse(cache),
                });
            }
        },
        init: function() {
            if (User.isLogin()) {
                this.checkSetting();
            }
        },
    },
}
</script>

<style lang="less">
@import '~@/assets/css/pz/mobile/app.less';
</style>
