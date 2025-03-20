<template>
    <div class="m-pz-enchant">
        <!-- 小附魔 -->
        <el-select
            class="u-enhance"

            :value="enhance"
            value-key="ID"

            placeholder="选择附魔"
            :loading="loading"
            @visible-change="handleVisibleChange"
            @change="handleChange"

            filterable
            :filter-method="handleFilter"

            clearable
            @clear="handleReset"
        >
            <!-- <el-option value="" label="无">
                <div class="m-enchant-select-item">
                    <div class="u-null">留空</div>
                </div>
            </el-option>-->
            <el-option
                v-for="enhance in filterEnhances"
                :key="enhance.ID"
                :value="enhance"
                :label="enhance.Name"
                class="m-enchant-select-item-wrapper"
            >
                <div class="m-enchant-select-item">
                    <b class="u-name isEnhance" :class="{ isAdvanced: enhance._quality > 3 }">{{ enhance.Name }}</b>
                    <i class="u-value">{{ enhance.AttriName }}</i>
                </div>
            </el-option>
        </el-select>
        <a
            v-if="enhance"
            class="u-copy-icon"
            :class="{ 'is-copy': hasCopy }"
            title="复制"
            @click="handleCopy"
        >
            <i class="el-icon-document-copy"></i>
        </a>

        <!-- <el-select v-model="filterValue" class="u-filter-attr" clearable>
            <el-option v-for="attr in attrsMaps" :key="attr.value" :value="attr.value" :label="attr.label"></el-option>
        </el-select>-->

        <!-- <el-checkbox class="u-enhance-filter" v-model="isFilter">
            <span>过滤</span>
        </el-checkbox>
        <el-tooltip content="开启心法匹配过滤">
            <i class="el-icon-info u-icon"></i>
        </el-tooltip>-->
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getEnhance } from "@/service/pz/game.js";
import equip_map from "@/assets/data/pz/equip_map.json";
import { copyText } from "@/utils/pz/tools.js";
export default {
    name: "Enhance",
    props: [],
    components: {},
    data: function () {
        return {
            loading: false,
            enhance: "",
            // enhances: [],
            copyEnhances: [],
            hasCopy: false,

            isFilter: true,

            filterValue: "",
            filterEnhances: [],
        };
    },
    computed: {
        ...mapGetters([
            "schema_client",
            "activeEquip",
            "mount",
            "activeSnapshot",
        ]),
    },
    watch: {
        activeSnapshot: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val) {
                    this.enhance = val.enhance;
                    this.filterEnhances = [val.enhance]
                } else {
                    this.enhance = "";
                    this.enhances = [];
                }
            },
        },
        activeEquip: function () {
            // this.loadData();
            this.filterValue = "";
        },
    },
    methods: {
        loadData: function (search = "") {
            const key = `client_${this.schema_client}_position_${equip_map[this.activeEquip]["position"]}`
            const enhanceStorage = sessionStorage.getItem(key)
            if (enhanceStorage) {
                this.filterEnhances = JSON.parse(enhanceStorage)
                this.copyEnhances = JSON.parse(enhanceStorage)
                return
            }
            this.loading = true;
            const query = {
                client: this.schema_client,
                position: equip_map[this.activeEquip]["position"],
                search,
                subtype: 1,
                latest_enhance: 1
            };
            getEnhance(query)
                .then((res) => {
                    this.filterEnhances = this.copyEnhances = res.data
                        .filter((e) => {
                            let hasAttriName = !!e.AttriName
                            let isNoteWaBao = !e.Name.includes('寻踪觅宝')
                            let ignoreXianKe = this.schema_client == 'std' ? !e.Name.includes('线刻') : true
                            return hasAttriName && isNoteWaBao && ignoreXianKe
                        })
                        .sort(
                            (a, b) =>
                                ~~b.Attribute1Value1 - ~~a.Attribute1Value1
                        );
                    sessionStorage.setItem(key, JSON.stringify(this.copyEnhances))
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleCollapse: function (val) {
            if (val) {
                this.loadData();
            }
        },
        handleChange: function (val) {
            this.enhance = val;
            this.$store.commit("Sync", {
                prop: "enhance",
                data: {
                    content: this.enhance.ID,
                    snapshot: this.enhance,
                },
            });
        },
        handleCopy: function () {
            const message = "已将附魔名称复制到剪贴板";
            copyText(this.enhance.Name, message, this);
        },
        handleFilter: function (val) {
            if (val) {
                this.filterEnhances = this.copyEnhances.filter(
                    (en) => en.Name.includes(val) || en.AttriName.includes(val)
                );
            } else {
                this.filterEnhances = this.copyEnhances
            }
        },
        handleReset : function (){
            this.filterEnhances = this.copyEnhances;
        },
        handleVisibleChange: function (val){
            if (val) {
                this.loadData()
            }
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/enchant.less";
</style>
