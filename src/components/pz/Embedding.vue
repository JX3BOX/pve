<!-- 五行石镶嵌 -->
<template>
    <div class="m-pz-embedding" v-if="embedding">
        <span v-for="(embed,i) in embedding" :key="'emdding' + i">
            <el-popover
                trigger="click"
                :key="i"
                popper-class="m-embed-dialog"
                v-model="embeddingVisible[i]"
            >
                <div class="u-embedding-content">
                    <img
                        class="u-embed-icon"
                        @click="changeEmbed(i, num)"
                        v-for="num in embeddingOptions"
                        :key="num"
                        :src="num | getEmbedIcon"
                    />
                </div>
                <img class="u-embed-icon" slot="reference" :src="embed | getEmbedIcon" />
            </el-popover>
        </span>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getEmbedIcon } from "@/utils/pz/embedding.js";
export default {
    name: "Embedding",
    data() {
        return {
            embedding: [],
            embeddingVisible: [],
            embeddingOptions: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        };
    },
    computed: {
        ...mapGetters(["activeEquip", "equip"]),
        count: function ({ equip }) {
            let count = 0;
            for (let prop in equip) {
                if (
                    prop == "DiamondAttributeID1" &&
                    ~~equip["DiamondAttributeID1"]
                )
                    count += 1;
                if (
                    prop == "DiamondAttributeID2" &&
                    ~~equip["DiamondAttributeID2"]
                )
                    count += 1;
                if (
                    prop == "DiamondAttributeID3" &&
                    ~~equip["DiamondAttributeID3"]
                )
                    count += 1;
            }
            // return 3
            return count;
        },
        default_embedding: function () {
            return new Array(this.count).fill(6);
        },
        store_embedding: function () {
            return this.$store.state.snapshot[this.activeEquip]["embedding"];
        },
        embedding_data: function ({ equip }) {
            let data = [];
            for (let prop in equip) {
                const _data = {};
                if (
                    prop == "DiamondAttributeID1" &&
                    ~~equip["DiamondAttributeID1"]
                ) {
                    _data.level = this.embedding[0];
                    _data.raw = equip["_DiamondAttributeID1"];
                    data.push(_data);
                }
                if (
                    prop == "DiamondAttributeID2" &&
                    ~~equip["DiamondAttributeID2"]
                ) {
                    _data.level = this.embedding[1];
                    _data.raw = equip["_DiamondAttributeID2"];
                    data.push(_data);
                }
                if (
                    prop == "DiamondAttributeID3" &&
                    ~~equip["DiamondAttributeID3"]
                ) {
                    _data.level = this.embedding[2];
                    _data.raw = equip["_DiamondAttributeID3"];
                    data.push(_data);
                }
            }
            return data;
        },
    },
    watch: {
        store_embedding: {
            immediate: true,
            handler: function (val) {
                this.embedding = val?.length
                    ? val.map((v) => v.level)
                    : this.default_embedding;
                val.forEach((_, i) => {
                    this.$set(this.embeddingVisible, i, false);
                });
            },
        },
    },
    methods: {
        changeEmbed: function (i, num) {
            this.embedding.splice(i, 1, num);
            this.$store.commit("Sync", {
                prop: "embedding",
                data: {
                    content: this.embedding,
                    snapshot: this.embedding_data,
                },
            });
            this.embeddingVisible[i] = false;
        },
    },
    filters: {
        getEmbedIcon,
    },
};
</script>

<style lang="less">
.m-embed-dialog {
    .u-embedding-content {
        width: 180px;
        text-align: center;
        .clearfix;
    }
    .u-embed-icon {
        @h: 36px;
        .size(@h);
        .mr(8px);
        .mb(8px);
        cursor: pointer;
        .db;
        .fl;
        &:hover {
            outline: 2px solid #49c10f;
        }
    }
}
.m-pz-embedding {
    @h: 36px;
    margin-top: (40px - @h)/2;
    .clearfix;
    .u-embed-icon {
        .db;
        .fl;
        .size(@h);
        .mr(8px);
        cursor: pointer;
    }
}
</style>
