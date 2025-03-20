<template>
    <div class="m-toolbar">
        <div class="m-toolbar__left">
            <slot name="left">
                <el-button size="mini" @click="handleBack" round>返回</el-button>
            </slot>
        </div>
        <div class="m-toolbar__center">
            <slot name="center"></slot>
        </div>
        <div class="m-toolbar__right">
            <slot name="right">
                <el-button type="success" round v-if="isAuthor" size="mini" @click="submit">保存</el-button>
                <el-button type="primary" round v-else size="mini" @click="copy">复制</el-button>
            </slot>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { updatePz, addPz } from "@/service/pz/schema.js";
import { __dataPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { Toast } from "vant";
import SETTINGS from "@/pages/pz/setting.json";
import autoTag from "@/utils/pz/autoTag.js";
export default {
    name: "Toolbar",
    computed: {
        ...mapGetters(["schema", "schema_client", "attrs", "mount"]),
        id() {
            return this.$route.params.id;
        },
        data() {
            return this.$store.state.schema;
        },
        isAuthor() {
            return this.$store.getters.is_author;
        },
        content: function () {
            return this.$store.state.content;
        },
        snapshot: function () {
            return this.$store.state.snapshot;
        },
        overview: function () {
            return this.$store.state.schema?.overview;
        },
        isTertiary: function () {
            return this.$store.state.isTertiary;
        },
    },
    mounted() {
        this.loadMapList();
    },
    methods: {
        handleBack() {
            this.$router.go(-1);
        },
        // 复制
        copy() {
            addPz({ ...this.data, title: this.data.title + "-拷贝", fork_id: this.data?.id }).then((res) => {
                Toast({
                    message: "复制成功",
                    position: "top",
                });

                setTimeout(() => {
                    this.$router.push("/detail/" + res.data.data.id);
                }, 1000);
            });
        },
        submit(mute = false) {
            let tags = []
            if (!this.data?.tags?.length) {
                tags = autoTag(this.snapshot);
                this.data.tags = tags
            }
            return updatePz(this.id, {
                ...this.data,
                snapshot: this.snapshot,
                content: this.content,
                overview: this.overview,
                talent_id: this.schema.talent_id || null,
                talent_code: this.schema.talent_code || null,
                talent_pzcode: this.schema.talent_pzcode || null,
                global_level: this.schema?.global_level || SETTINGS.global_level,
                data: this.attrs,
                weapon_mode: this.isTertiary ? 0 : 1, // 0表示重剑，1表示轻剑
            }).then(() => {
                Toast({
                    message: "方案保存成功",
                    type: "success",
                });
            });
        },
        // 获取副本map_list
        loadMapList: function (){
            try {
                const map_list = sessionStorage.getItem(`jb_map_list`);
                if (map_list) {
                    this.$store.commit('SET_STATE', {key: 'map_list', value: JSON.parse(map_list)})
                } else {
                    fetch(`${__dataPath}/map/data/map_index.json`).then(res => {
                        return res.json()
                    }).then(res => {
                        this.$store.commit('SET_STATE', {key: 'map_list', value: res})
                        sessionStorage.setItem(`jb_map_list`, JSON.stringify(res))
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/mobile/common.less";
</style>
