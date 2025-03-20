<template>
    <ul class="m-equip-embed">
        <template v-if="embeds.length">
            <li
                v-for="(embed, index) in embeds"
                :class="embed.level > 0 ? 'hole-active' : 'inactive'"
                :key="'embed' + index"
            >
                <img :src="embed.level | getEmbedIcon" class="slot" alt="" />
                <span
                    >镶嵌孔：{{ attributeDesc[embed.attr]
                    }}{{ formatValue(embed) }}
                </span>
            </li>
        </template>
    </ul>
</template>

<script>
import { mapGetters } from "vuex";
import { getAttributEmbedValue, getEmbedIcon } from "@/utils/pz/embedding.js";
import attributeDesc from "@/assets/data/pz/attr_desc.json";
import { extraSecondaryAttr } from "@/utils/pz/display.js";
export default {
    name: "EquipEmbed",
    data() {
        return {
            attributeDesc,
        };
    },
    computed: {
        ...mapGetters(["equip", "activeSnapshot", "schema_client"]),
        embeds: function ({ activeSnapshot }) {
            const _embeds = [];

            activeSnapshot?.embedding.forEach((e) => {
                // 镶嵌孔属性值 如果raw[1]为'0'则需要去拿raw[3]的值
                // raw[0]为孔的属性字段
                const value = ~~e?.raw[1] || ~~e?.raw[3];
                const data = {
                    level: e.level,
                    attr: e?.raw[0],
                    val: getAttributEmbedValue(value, e.level, this.schema_client),
                };

                _embeds.push(data);
            });

            return _embeds;
        },
    },
    filters: {
        getEmbedIcon,
    },
    methods: {
        formatValue: function (embed) {
            return embed.val ? extraSecondaryAttr(embed.attr, embed.val) : "?";
        },
    },
};
</script>
