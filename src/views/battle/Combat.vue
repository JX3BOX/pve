<template>
    <div class="p-combat">
        <div v-if="showAnalysis">
            <subheader class="m-upload-header" title="战斗统计" desc="Battle Statistical Analysis"> </subheader>
            <analysis :id="id" :battleId="battleId" @success="showAnalysis = false"></analysis>
        </div>
        <!-- 动态组件，用于显示JclResult/Tinymins结果 -->
        <template v-else>
            <component :is="component" :allowAdd="!id" @save="save"></component>
            <template v-if="!!id">
                <Thx class="m-thx" :postId="id" postType="battle" :postTitle="current.title" :adminBoxcoinEnable="true"
                    :userBoxcoinEnable="true" />
                <Comment class="m-comment" :id="id" category="battle" />
            </template>
        </template>
    </div>
</template>

<script>
import { mapState } from "vuex";

import subheader from "@/components/battle/subheader.vue";
import Analysis from "@/components/battle/analysis.vue";
import TinyminsStat from "./TinyminsStat.vue";
import JclResult from "./JclResult.vue";
import JclPVP from "./JclPVP.vue";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";

export default {
    name: "Combat",
    props: [],
    components: {
        tinymins: TinyminsStat,
        jcl: JclResult,
        analysis: Analysis,
        'jcl-pvp': JclPVP,
        Comment,
        subheader,
    },
    data() {
        return {
            battleId: "",
            id: "",
            showAnalysis: false,

            components: {
                official: TinyminsStat,
                tinymins: TinyminsStat,
                jcl: JclResult,
                'jcl-pvp': JclPVP,
            },
        };
    },
    computed: {
        ...mapState(["analysis"]),
        type: function () {
            return this.$store.state.info.subject === 'pvp' ? 'jcl-pvp' : this.$store.state.info.type;
        },
        component: function () {
            return this.components[this.type];
        },
        current: function () {
            return this.$store.state.current;
        },
    },
    watch: {
        id: function () {
            this.$store.commit("RESET");
        },
    },
    methods: {
        save: function () {
            this.$router.push({
                name: "add",
                params: {
                    type: this.type,
                },
            });
        },
        init: function () {
            //如果本地没有分析结果并且没有ID的时候自动跳回上传页
            const query = this.$route.query;
            const id = this.$route.params.id;
            if (!this.analysis && !window.$store && !id && !query.battle_id) {
                this.$router.push({ name: "upload" });
            }
            //如果有ID的时候加载分析组件
            if (id || query.battle_id) {
                this.id = Number(id);
                this.battleId = decodeURIComponent(query.battle_id);
                this.showAnalysis = true;
            }
        },
    },
    mounted: function () {
        this.init();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/battle/combat.less";
</style>
