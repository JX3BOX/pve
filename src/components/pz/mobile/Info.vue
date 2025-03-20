<template>
    <div class="m-detail-info" :style="style">
        <i class="u-pz-id">配装ID: {{ schema.id }}</i>
        <Avatar
            v-if="author"
            class="u-avatar"
            :uid="schema.user_id"
            :url="author.user_avatar"
            :frame="author.user_avatar_frame"
            size="s"
        />
        <div class="u-desc" v-if="schema.desc">{{ schema.desc }}</div>

        <hr class="u-hr-solid" :data-content="score" />

        <div class="m-pz-attrs" v-if="attrs">
            <div class="u-attr" v-for="attr in attrs" :key="attr.key">
                <span class="u-attr-value"
                    >{{ attr.value }}
                    <span class="u-percent" v-show="attr.key.endsWith('Percent')">%</span>
                </span>
                <span class="u-attr-name">{{ attr.label }}</span>
            </div>
        </div>

        <hr class="u-hr-solid" data-content="装备" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
// 处理背景颜色
import { getMountColor } from "@/utils/pz/tools.js";
import descConvert from "@/assets/data/pz/attr_desc_panel.json";
import * as CanvasTools from "@/utils/pz/canvas.js";

import Avatar from "@jx3box/jx3box-common-ui/src/author/Avatar.vue";
export default {
    name: "Info",
    components: {
        Avatar,
    },
    data() {
        return {
            author: {},
            descConvert,
            attrs: {},
        };
    },
    computed: {
        ...mapGetters(["schema", "schema_client", "mount"]),
        mountColor() {
            return getMountColor(this.mount);
        },
        style() {
            return {
                background: `linear-gradient(269.1deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%), ${this.mountColor}`,
            };
        },
        overview() {
            return this.schema?.overview;
        },
        score() {
            return `装备分数 ${this.overview?.score || 0}`;
        },
    },
    watch: {
        schema: {
            handler: function (val) {
                if (!val) return;
                this.author = val.pz_author_info;

                // 生成属性
                this.attrs = CanvasTools.buildAttributes({
                    client: this.schema_client,
                    mount: this.mount,
                    attrs: this.overview?.attrs,
                });
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
    },
};
</script>
