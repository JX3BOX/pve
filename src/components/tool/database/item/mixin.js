import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { starCancel, star } from "@/service/tool/cms";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { mapState } from "vuex";
import attr_desc from "@/assets/data/tool/database/attr_desc.json";
import props_buff from "@/assets/data/tool/database/props_buff.json";
import props_skill from "@/assets/data/tool/database/props_skill.json";
import props_npc from "@/assets/data/tool/database/props_npc.json";

const { __Root, __OriginRoot } = JX3BOX;

export default {
    props: {
        type: String,
        data: [Object, Array],
        refCount: {
            type: Number,
            default: 0,
        },
        hasRight: {
            type: Boolean,
            default: false,
        },
        showDetail: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        showProps: true,
        staring: false,
    }),
    computed: {
        ...mapState({
            isLogin: (state) => state.isLogin,
            database_fields: (state) => state.database_fields,
        }),
        id_key() {
            const map = {
                buff: "BuffID",
                skill: "SkillID",
                doodad: "ID",
                npc: "ID",
            };
            return map[this.type];
        },
        star_id() {
            if (!this.isLogin) return false;
            const list = this.$store.state.stars[this.type];
            const item = list.find((i) => {
                if (
                    ["skill", "buff"].includes(this.type) &&
                    this.data.Level !== undefined &&
                    this.data.Level !== null
                ) {
                    return i.id === this.data[this.id_key] && i.level === this.data.Level;
                } else {
                    return i.id === this.data[this.id_key];
                }
            });
            if (!item) return null;
            return item.star_id;
        },
        database_key() {
            const id = this.data[this.id_key];
            const level = this.data.Level;
            if (level === null || level === undefined) {
                return `${this.type}_${id}`;
            } else {
                return `${this.type}_${id}_${level}`;
            }
        },
    },
    methods: {
        toggleProps() {
            this.showProps = !this.showProps;
        },
        iconLink(id) {
            let client = this.$store.state.database_client === "std" ? "" : "origin";
            if (this.$store.state.database_type === "doodad") client = "";
            return iconLink(id, client);
        },
        copy(propName) {
            navigator.clipboard
                .writeText(this.data[propName])
                .then(() => {
                    this.$message({
                        message: "已复制ID",
                        type: "success",
                    });
                })
                .catch(() => {
                    this.$message({
                        message: "复制失败",
                        type: "error",
                    });
                });
        },
        filterRaw: function (str) {
            str = str && str.replace(/\\n/g, "\n");
            str = str && str.replace(/(\<TALENT.*?\>)/g, "\n$1");
            str = str && str.replace(/(\<EnchantID.*?\>)/g, "\n$1");
            return str;
        },
        // 收藏/取消收藏
        star(type, id, level) {
            if (this.staring) return;
            const data = {
                type,
                id,
            };
            if (level !== undefined && level !== null) data.level = level;
            this.staring = true;
            star(data)
                .then((res) => {
                    const { code, data } = res.data;
                    if (code === 0) {
                        data.name = this.data.Name || this.data.SkillName || this.data.BuffName;
                        data.remark = this.data.Remark;
                        data.icon = this.type === "doodad" ? 10909 : this.data.IconID;
                        data.desc = this.data.Desc;
                        data.resource = this.data;

                        this.$store.state.stars[type].push(data);
                    }
                })
                .finally(() => {
                    this.staring = false;
                });
        },
        cancelStar() {
            if (!this.star_id || this.staring) return;
            this.staring = true;
            starCancel(this.star_id)
                .then((res) => {
                    const { code, msg } = res.data;
                    if (code === 0) {
                        this.$store.state.stars[this.type] = this.$store.state.stars[this.type].filter(
                            (item) => item.star_id !== this.star_id
                        );
                    } else {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    }
                })
                .finally(() => {
                    this.staring = false;
                });
        },
        // 跳转到DBM新建元数据
        toDbm(type, id, level) {
            const typeMap = {
                doodad: "DOODAD",
                npc: "NPC",
                buff: "BUFF",
                skill: "CASTING",
            };
            const client = this.$store.state.client;
            const root = client === "std" ? __Root : __OriginRoot;
            const url = new URL(`${root}dbm/item/create`);
            url.searchParams.append("type", typeMap[type] || type);
            url.searchParams.append("id", id);
            url.searchParams.append("level", level);
            window.open(url.href, "_blank");
        },
        attrLabel(attr) {
            return attr_desc[attr] || null;
        },
        fieldLabel(field) {
            const component_type = this.$options.name;
            const component_type_map = {
                ItemBuff: "buff",
                ItemSkill: "skill",
                ItemDoodad: "doodad",
                ItemNPC: "npc",
            };
            const props_map = {
                buff: props_buff,
                skill: props_skill,
                npc: props_npc,
            };
            const type = component_type_map[component_type];
            const fields = this.database_fields[type];
            const props = props_map[type] ?? {};
            if (fields?.[field]?.label !== field) return fields?.[field]?.label;
            return props[field]?.desc || field;
        },
    },
};
