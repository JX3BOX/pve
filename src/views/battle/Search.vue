<template>
    <div class="m-empty" v-loading="loading">
        <el-empty :image-size="200" v-if="hasNoData" description="该标识数据未上传或标识不存在"></el-empty>
    </div>
</template>

<script>
import { getJclBattle } from "@/service/battle/team";
export default {
    name: "Search",
    data() {
        return {
            hasNoData: false,
            loading: false,
        };
    },
    computed: {
        battleId: function () {
            return this.$route.query.battle_id;
        },
    },
    mounted() {
        this.getJclBattle();
    },
    methods: {
        getJclBattle: function () {
            this.loading = true;
            getJclBattle({
                battle_id: this.battleId
            }).then((res) => {
                if (res.data.data) {
                    this.$router.push({
                        name: "combat",
                        params: {
                            id: res.data.data.id,
                        },
                    });
                } else {
                    this.hasNoData = true;
                }
            }).catch(e => {
                if (e.data.code === 404) {
                    this.hasNoData = true;
                }
            }).finally(() => {
                this.loading = false;
            });
        },
    },
}
</script>

<style lang="less" scoped>
.m-empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 100px;
}
</style>
