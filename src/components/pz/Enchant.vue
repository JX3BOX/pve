<template>
    <div class="m-pz-enchant">
        <el-select
            class="u-enchant"
            :value="enchant"
            placeholder="选择附魔"
            filterable
            clearable
            :remote-method="loadData"
            :loading="loading"
            @visible-change="handleCollapse"
            @change="handleChange"
            value-key="ID"
        >
            <!-- <el-option value label="无">
                <div class="m-enchant-select-item">
                    <div class="u-null">留空</div>
                </div>
            </el-option>-->
            <el-option
                v-for="enchant in enchants"
                :key="enchant.ID"
                :value="enchant"
                :label="enchant.Name"
                class="m-enchant-select-item-wrapper"
            >
                <div class="m-enchant-select-item">
                    <b class="u-name isEnchant">{{ enchant.Name }}</b>
                </div>
            </el-option>
        </el-select>
        <a v-if="enchant" class="u-copy-icon" :class="{ 'is-copy': hasCopy }" title="复制" @click="handleCopy">
            <i class="el-icon-document-copy"></i>
        </a>
    </div>
</template>

<script>
import { getEnhance } from "@/service/pz/game.js";
import { mapGetters } from "vuex";
import equip_map from "@/assets/data/pz/equip_map.json";
import { copyText } from "@/utils/pz/tools.js";
import enchant_level_limit from "@/assets/data/pz/enchant_level_limit.json";

export default {
    name: "Enchant",
    props: [],
    components: {},
    data: function () {
        return {
            loading: false,
            enchant: "",
            enchants: [],
            hasCopy: false,
            originEnchant: ["atSkillEventHandler", "atExecuteScript"],
        };
    },
    computed: {
        ...mapGetters(["schema_client", "activeEquip", "activeSnapshot", "mount", "equip"]),
        equipSubtype: function ({ equip }) {
            switch (String(equip._Duty)) {
                case "1":
                case "2":
                    return "伤";
                case "3":
                    return "御";
                case "4":
                    return "疗";
                default:
                    return "";
            }
        },
        prefix: function ({ equip }) {
            const { Level } = equip;
            return Object.keys(enchant_level_limit)
                .filter((prefix) => {
                    const { min, max } = enchant_level_limit[prefix];
                    return min <= Level && Level <= max;
                })
                .sort((a, b) => enchant_level_limit[a].max - enchant_level_limit[b].max);
        },
    },
    watch: {
        activeSnapshot: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val) {
                    this.enchant = val.enchant;
                    this.enchants = [val.enchant];
                } else {
                    this.enchant = "";
                    this.enchants = [];
                }
            },
        },
    },
    methods: {
        loadData: function (search) {
            this.loading = true;
            const query = {
                client: this.schema_client,
                position: equip_map[this.activeEquip]["position"],
                search,
                subtype: 2,
            };
            getEnhance(query)
                .then((res) => {
                    const enchants = res.data
                        .filter((e) => !!~~e.Time)
                        .filter((enchant) => {
                            // 藏剑裤子大附魔特殊处理
                            if ((this.mount == "10144" || this.mount == "10145") && this.activeEquip === "BOTTOMS") {
                                return enchant.Name.includes("藏剑");
                            }
                            if (!!~~enchant.BelongKungfuID) {
                                // 裤子大附魔
                                return this.mount == enchant.BelongKungfuID;
                            } else {
                                // 其他大附魔
                                if (this.schema_client === "std") {
                                    // 品级不合适则不显示
                                    if (!this.prefix) return false;
                                    // 只展示对应部位的大附魔
                                    if (!["横", "纵", this.equipSubtype].some((str)=>enchant.Name.includes(str))) return false;
                                    // 只展示品级合适的前缀大附魔
                                    return this.prefix.some((prefix) => enchant.Name.includes(prefix));
                                } else {
                                    return this.originEnchant.some((attr) => enchant.Attribute1ID.includes(attr));
                                }
                            }
                        });
                    enchants.sort((a, b) => {
                        const [_a] = a.Name.split("·");
                        const [_b] = b.Name.split("·");
                        return this.prefix.indexOf(_a) - this.prefix.indexOf(_b);
                    });
                    this.enchants = enchants;
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
            this.enchant = val;
            this.$store.commit("Sync", {
                prop: "enchant",
                data: {
                    content: this.enchant.ID,
                    snapshot: this.enchant,
                },
            });
        },
        handleCopy: function () {
            const message = "已将附魔名称复制到剪贴板";
            copyText(this.enchant.Name, message, this);
        },
    },
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/pz/enchant.less";
</style>
