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

        <div class="u-pz-title">{{ schema.title }}</div>

        <hr class="u-hr-solid" :data-content="score" />

        <div class="m-pz-attrs" v-if="attrs">
            <div class="u-attr" v-for="attr in attrs.slice(0, 4)" :key="attr.key">
                <span class="u-attr-value"
                    >{{ attr.value }}
                    <span class="u-percent" v-show="attr.key.endsWith('Percent')">%</span>
                </span>
                <span class="u-attr-name">{{ attr.label }}</span>
            </div>
        </div>

        <EquipAnchor>
            <template #mid>
                <div class="m-mid-attrs" v-if="attrs">
                    <div class="u-attr" v-for="attr in attrs.slice(4, attrs.length)" :key="attr.key">
                        <span class="u-attr-value"
                            >{{ attr.value }}
                            <span class="u-percent" v-show="attr.key.endsWith('Percent')">%</span>
                        </span>
                        <span class="u-attr-name">{{ attr.label }}</span>
                    </div>
                </div>
            </template>
        </EquipAnchor>

        <hr class="u-hr-solid" :data-content="schema_client === 'std' ? '奇穴' : '镇派'" />

        <Talent :webview="true" />

        <hr class="u-hr-solid" data-content="描述" v-if="schema.desc" />

        <div class="u-desc" v-if="schema.desc">{{ schema.desc }}</div>

        <div class="m-pz-actions">
            <div class="u-icon" @click="save">
                <i class="el-icon-download"></i>
            </div>
            <div class="u-icon" @click="doFav" :class="{ favorite }">
                <i :class="favorite ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
            </div>
        </div>

        <Vertical ref="pzVertical" :schema="schema" class="m-pz-vertical" v-if="schema && saving" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
// 处理背景颜色
import { getMountColor } from "@/utils/pz/tools.js";
import * as CanvasTools from "@/utils/pz/canvas.js";
import { hasFav, addFav, delFav } from "@jx3box/jx3box-common-ui/service/fav";

import Avatar from "@jx3box/jx3box-common-ui/src/author/Avatar.vue";
import EquipAnchor from "./EquipAnchor.vue";
import Talent from "@/components/pz/Talent.vue";
import Vertical from "@/components/pz/canvas/Vertical.vue";
import { Toast } from "vant";
export default {
    name: "Info",
    components: {
        Avatar,
        EquipAnchor,
        Talent,
        Vertical,
    },
    data() {
        return {
            author: {},
            attrs: [],

            favorite: false,

            saving: false,
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

                this.hasFav();
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        save() {
            this.saving = true;
            this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs.pzVertical.save();
                    this.saving = false;
                }, 2000);
            });
        },
        doFav() {
            this.favorite ? this.delFav() : this.addFav();
        },
        hasFav() {
            hasFav('pz', this.schema.id).then((res) => {
                this.favorite = res.id || false;
            });
        },
        addFav() {
            addFav('pz', this.schema.id, this.schema.title).then((res) => {
                this.favorite = res.id;
                Toast({
                    message: '收藏成功',
                    position: 'top',
                })
            });
        },
        delFav() {
            delFav(this.favorite).then(() => {
                this.favorite = false;
                Toast({
                    message: '取消收藏',
                    position: 'top',
                })
            });
        },
    },
};
</script>
