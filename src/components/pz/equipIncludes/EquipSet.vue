<template>
    <div class="m-equip-set" v-if="equipNum && hasSet">
        <!-- 套装总览 -->
        <ul class="m-equip-set-list">
            <li class="title active">
                <span>{{ info.Name }}({{ activeNum }}/{{ equipNum }})</span>
            </li>
            <template v-for="(group, AucSubType) in list">
                <li :key="AucSubType" class="item">
                    <span
                        v-for="(equip, index) in uniqBy(group, 'Name')"
                        :key="index"
                        :class="isActive(equip, group) ? 'active' : 'inactive'"
                        >{{ equip.Name }}</span
                    >
                </li>
            </template>
        </ul>

        <!-- 套装激活 -->
        <ul class="m-equip-set-effect">
            <li
                class="u-equip-set-effect"
                v-for="(info, i) in collectEffects"
                :key="'equip-set-' + i"
                :class="info.active ? 'hole-active' : 'inactive'"
            >
                <span v-if="info.Desc">[{{ info.count }}]{{ info.Desc }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSet } from "@/service/pz/game.js";
import attributeDesc from "@/assets/data/pz/attr_desc.json";
import { extractTextContent } from "@/utils/pz/stringFormat.js";
import { extraSecondaryAttr } from "@/utils/pz/display.js";
import mount_equip from "@jx3box/jx3box-data/data/xf/mount_equip.json";
import { groupBy, uniqBy } from "lodash";

export default {
    name: "EquipSet",
    data() {
        return {
            info: {},
            list: [],
        };
    },
    computed: {
        ...mapGetters(["activeSnapshot", "equip", "collections", "schema_client", "mount"]),
        hasSet: function ({ equip, collections }) {
            const setID = ~~equip.SetID;
            return collections.has(setID);
        },
        mountAttr: function ({ mount }) {
            return mount_equip?.[mount];
        },
        // 激活数量
        activeNum: function () {
            if (~~this.equip.SetID) {
                const collection = this.collections.get(~~this.equip.SetID);
                return Math.min(collection.count, this.equipNum);
            }
            return 0;
        },
        equipIds: function () {
            const snapshot = this.$store.state.snapshot;

            let ids = [];

            Object.values(snapshot).forEach((v) => {
                if (v.equip) {
                    ids.push(v.equip.ID);
                }
            });

            return ids;
        },
        // 套装激活信息
        collectEffects: function ({ collections, equip }) {
            const effects = [];

            if (collections.has(~~equip?.SetID)) {
                const collection = collections.get(~~equip?.SetID);

                Object.entries(collection?.setData).forEach(([key, value]) => {
                    if (value) {
                        const _key = key.slice(0, 1);
                        const obj = {
                            count: ~~_key,
                            attr: value?.attr,
                            active: collection.count >= ~~_key,
                            Desc: this.formatDesc(value) || "",
                        };

                        if (effects.some((e) => e.count === ~~_key)) {
                            const item = effects.find((e) => e.count === ~~_key);
                            item.Desc += "," + (!!this.formatDesc(value) ? this.formatDesc(value) : "");
                        } else {
                            effects.push(obj);
                        }
                    }
                });
            }
            return effects;
        },
        // 套装装备数量
        equipNum: function () {
            return Object.keys(this.list).length;
        },
    },
    watch: {
        equip: {
            deep: true,
            immediate: true,
            handler() {
                if (~~this.equip.SetID) {
                    this.loadSet(this.equip.SetID);
                }
            },
        },
    },
    methods: {
        uniqBy,
        loadSet: function (id) {
            if (sessionStorage.getItem(`set-${id}`)) {
                this.list = JSON.parse(sessionStorage.getItem(`set-${id}`));
                this.info = JSON.parse(sessionStorage.getItem(`setinfo-${id}`));
            } else {
                getSet(id, {
                    client: this.schema_client,
                }).then((res) => {
                    // console.log('res================', res.data.info, res.data.list)
                    this.info = res.data.info;
                    // 按照部位分组
                    const list = groupBy(res.data.list, item  => `${item.AucGenre}_${item.AucSubType}`);
                    const setName = this.info.Name;

                    // 每个部分分别处理，并且按照与套装名称的相似度排序
                    Object.entries(list).forEach(([key, value]) => {
                        list[key] = value
                            .filter(
                                (equip) =>
                                    equip.MagicKind === this.mountAttr.duty ||
                                    equip.MagicKind === this.mountAttr.primary_attribute
                            )
                            .sort((a, b) => b.Name.indexOf(setName) - a.Name.indexOf(setName));
                        // 过滤后没装备了就删掉这个部位
                        if (list[key].length == 0) {
                            delete list[key];
                        }
                    });

                    this.list = list;

                    sessionStorage.setItem(`set-${id}`, JSON.stringify(this.list));
                    sessionStorage.setItem(`setinfo-${id}`, JSON.stringify(this.info));
                });
            }
        },
        isActive: function (equip, group) {
            // 现在身上穿着的所有装备的ID
            const equipIds = this.equipIds;
            // 判断套装中该部位的装备中是否有穿着的
            const activeOne = group.find((e) => equipIds.includes(e.ID));
            if (!activeOne) return false;
            // 名称一样的标黄
            const activeName = activeOne?.Name;
            return activeName === equip.Name;
        },
        formatDesc: function (data) {
            let _desc = "";
            // 特殊字段
            if (data.label) {
                let _dataArr = extractTextContent(data.label);
                _dataArr.forEach((sentence) => {
                    _desc += sentence.text;
                });
            } else {
                // 一般字段
                let base = ~~data.attr[1] || ~~data.attr[3];
                let attr = data.attr[0];
                if (base) {
                    const _base = extraSecondaryAttr(attr, Math.abs(base)) || "";

                    _desc = (base > 0 ? attributeDesc[attr] : attributeDesc[attr] + "降低") + _base;

                    // console.log(base, attr, _base, _desc)
                }
            }

            return _desc;
        },
    },
};
</script>
