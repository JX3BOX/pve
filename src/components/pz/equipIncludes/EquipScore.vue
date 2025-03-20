<template>
    <div class="m-equip-score">
        <!-- 品质等级 -->
        <div class="u-equip-quality">
            品质等级
            {{ equip.Level }}
            <span class="isStrength" v-if="activeSnapshot.strength > 0"> (+{{ equipLevel }}) </span>
        </div>

        <!-- 装备分数 基础装分（+ 精炼装分 + 镶嵌装分） -->
        <div class="u-equip-score">
            装备分数
            {{ baseScore }}
            <span
                class="isStrength"
                v-if="activeSnapshot.strength > 0 || embeddingScore || enchantScore || enhanceScore"
            >
                ({{ strengthScore ? `+${strengthScore}` : "" }}{{ extraScore ? `+${extraScore}` : "" }})
            </span>
            <span></span>
        </div>

        <div class="u-equip-source">
            装备来源 :
            <span>
                {{ drop }}
            </span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getEquipScore, getStoneScore, getEmbeddingScore, getGsStrengthScore } from "@/utils/pz/score.js";
import { getEquipDrop } from "@/service/pz/game";
import equip_map from "@/assets/data/pz/equip_map.json";
import { extractString } from "@/utils/pz/re";
export default {
    name: "EquipScore",
    data: () => ({
        equipInfo: null,
    }),
    computed: {
        ...mapGetters(["activeSnapshot", "equip", "activeEquip", "isWeapon", "schema_client", "map_list"]),
        position: function () {
            return equip_map[this.activeEquip].position;
        },
        baseScore: function ({ equip, position }) {
            return getEquipScore(equip.Level, equip.Quality, position);
        },
        equipLevel: function ({ equip, activeSnapshot, schema_client }) {
            // 装分和品质的精炼成长与重制一致
            return getGsStrengthScore(equip.Level, activeSnapshot.strength, {
                client: schema_client,
                type: "quality",
                equipQuality: equip.Quality,
                equipPosition: equip.SubType,
                equipLevel: equip.Level,
            });
        },
        strengthScore: function ({ baseScore, activeSnapshot, schema_client, equip }) {
            // 装分和品质的精炼成长与重制一致
            return getGsStrengthScore(baseScore, activeSnapshot.strength, {
                client: schema_client,
                equipQuality: equip.Quality,
                equipPosition: equip.SubType,
                equipLevel: equip.Level,
            });
        },
        // 镶嵌的五行石等级数
        embeddingScore: function ({ activeSnapshot, schema_client }) {
            if (activeSnapshot?.embedding.length) {
                return activeSnapshot?.embedding
                    ?.map((e) => getEmbeddingScore(e.level, schema_client))
                    ?.reduce((prev, next) => prev + next);
            }
            return 0;
        },
        stoneScore: function ({ activeSnapshot, isWeapon, schema_client }) {
            if (isWeapon) {
                return getStoneScore(activeSnapshot?.stone?.stone_level || 0, schema_client);
            }
            return 0;
        },
        drop: function ({ equip, equipInfo }) {
            let drop = "";
            const BelongMapID = equipInfo?.BelongMapID;

            if (BelongMapID) {
                const _maps = BelongMapID.split(",");

                _maps.forEach((map_id, i) => {
                    drop += `${this.map_list[map_id] || "未知"}` + (i === _maps.length - 1 ? "" : "/ ");
                });
            } else {
                if (equipInfo?.GetType) {
                    const group_names = equipInfo.GetType.split(",");
                    const regex = /\{(\[?.*?\]?,?)\}/g;
                    const group_descs = extractString(regex, equipInfo.Get_Desc)?.map((desc) =>
                        desc[1].replace(/[\[\]]/g, "").replace(/,/g, "，")
                    );
                    // return result
                    group_names.forEach((t, i) => {
                        drop += `${t}（${group_descs[i] || "未知"}）` + (i === group_names.length - 1 ? "" : "/ ");
                    });
                } else {
                    drop = equip.GetType;
                }
            }

            return drop;
        },
        enchantScore: function () {
            return this.activeSnapshot.enchant?.Score || 0;
        },
        enhanceScore: function () {
            return this.activeSnapshot.enhance?.Score || 0;
        },
        extraScore({ embeddingScore, enchantScore, enhanceScore, stoneScore }) {
            return Math.round(embeddingScore + stoneScore) + enchantScore + enhanceScore;
        },
    },
    watch: {
        equip: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val) {
                    getEquipDrop(equip_map[this.activeEquip]?.["tab_type"], this.equip.ID, this.schema_client).then(
                        (res) => {
                            this.equipInfo = res.data;
                        }
                    );
                }
            },
        },
    },
};
</script>
