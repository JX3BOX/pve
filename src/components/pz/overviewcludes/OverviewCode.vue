<!-- 数据版 -->
<template>
    <div class="m-overview-code">
        <div class="u-id">
            <span>配装方案ID</span><b>{{ id }}</b>
        </div>
        <el-input class="u-code" type="textarea" v-model="value" :rows="8"></el-input>
        <div class="u-toolbar">
            <el-button class="u-btn u-btn-copy" icon="el-icon-document-copy" @click="copy" size="small"
                >点击复制</el-button
            >
            <a href="/tool/31607" class="u-link-doc" target="_blank"><i class="el-icon-warning-outline"></i>使用帮助</a>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { copyText } from "@/utils/pz/tools";
import { mount_display_attributes } from "@/assets/data/pz/mount_display_attributes";
import equip_map from "@/assets/data/pz/equip_map.json";
import { omit } from "lodash";
export default {
    data() {
        return {
            value: "",
        };
    },
    computed: {
        ...mapGetters(["attrs", "schema_client", "mount", "content", "schema"]),
        id: function () {
            return this.$route.params.id;
        },
        equip_map: function () {
            const _map = {};
            Object.entries(equip_map).forEach(([key, value]) => {
                _map[key] = value.tab_type;
            });
            return _map;
        },
    },
    watch: {
        schema: {
            deep: true,
            handler: function () {
                this.value = this.displaycode();
            },
        }
    },
    methods: {
        copy: function () {
            const message = "复制数据成功";
            copyText(this.displaycode(), message, this);
        },
        displaycode: function () {
            const { attrs, schema_client, mount, equip_map, content, schema } = this;
            if (!schema) return "";
            const mountAttrs = {};
            let displayAttrs = mount_display_attributes[schema_client][mount];

            displayAttrs = displayAttrs && Object.values(displayAttrs).flat() || [];

            displayAttrs.forEach((attr) => {
                mountAttrs[attr] = attrs[attr];
            });
            // 新增导出属性 装备列表
            const EquipList = {};

            Object.entries(content).forEach(([key, value]) => {
                if (value?.equip) {
                    const _equip = omit(value, ["skill", "equip"]);
                    _equip.id = `${equip_map[key]}_${value.equip}`;
                    EquipList[key] = _equip;
                }
            });

            mountAttrs.EquipList = EquipList;

            // 新增导出属性 配装标题
            mountAttrs.Title = schema.title;

            // 新增奇穴导出
            if (schema.talent_pzcode) {
                mountAttrs.TalentCode = schema.talent_pzcode.map(item => {
                    const { id, name, level } = item;
                    return { id, name, level };
                });
            }

            // 新增心法导出
            mountAttrs.Mount = schema.mount;

            // 装分导出
            mountAttrs.Score = schema.overview?.score;

            return JSON.stringify(mountAttrs);
        },
    },
    mounted() {
        try {
            this.value = this.displaycode();
        } catch (error) {
            console.log(error);
        }
    },
};
</script>

<style lang="less">
.m-overview-code {
    font-family: Consolas;
    .u-toolbar {
        .mt(10px);
        display: flex;
        justify-content: space-between;
    }
    .u-link-doc {
        .fz(12px);
        i {
            .mr(5px);
        }
        &:hover {
            text-decoration: underline;
        }
    }
    .u-id {
        .fz(14px,32px);
        display: inline-flex;
        .mb(10px);
        border: 1px solid #ddd;
        overflow: hidden;
        .r(3px);
        span,
        b {
            padding: 0 10px;
        }
        span {
            background-color: #f5f7fa;
            border-right: 1px solid #ddd;
        }
        b {
            background-color: #ffffda;
            color: #f00;
        }
    }
}
</style>
