<template>
    <div class="m-pz-strength">
        <i class="el-icon-circle-close u-close" title="清空精炼" @click="handleClear"></i>
        <el-rate class="u-rate" :value="strength" @change="handleLevelChange" :max="max"></el-rate>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "Strength",
    props: [],
    components: {},
    data: function () {
        return {
            strength: 0,
        };
    },
    computed: {
        ...mapGetters(["activeSnapshot",'equip']),
        max: function () {
            return ~~this.equip?.MaxStrengthLevel;
        },
    },
    watch: {
        activeSnapshot : {
            deep : true,
            immediate: true,
            handler : function (activeSnapshot){
                this.strength = activeSnapshot.strength || 0
            }
        }
    },
    methods: {
        // 精炼等级改变
        handleLevelChange: function (level) {
            this.strength = level
            this.$store.commit("Sync", {
                prop: "strength",
                data: {
                    content: this.strength,
                    snapshot: this.strength,
                },
            });
        },
        handleClear: function (){
            this.strength = 0
            this.$store.commit("Sync", {
                prop: "strength",
                data: {
                    content: this.strength,
                    snapshot: this.strength,
                },
            });
        }
    },
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less" scoped>
.m-pz-strength {
    .u-close {
        cursor: pointer;
        &:hover {
            color: @pink;
            transform: scale(1.3);
        }
    }

    .u-rate {
        .pa;
        top: -1px;
        left: 20px;
    }
}
</style>