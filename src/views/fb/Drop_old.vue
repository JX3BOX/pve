<template>
    <div class="m-fb-drop" v-loading="loading">
        <el-tabs v-model="mapid" type="card" @tab-click="loadData">
            <el-tab-pane
                :label="item.mode"
                :name="item.map_id"
                v-for="(item, i) in maplist"
                :key="i"
            >
                <div class="u-bosslist">
                    <!-- <div class="u-label">首领</div> -->
                    <div
                        class="u-boss"
                        :class="{ on: item.BossIndex == bossid }"
                        v-for="(item, j) in bosslist"
                        :key="j"
                        @click="changeBoss(item.BossIndex)"
                    >
                        <!-- <img :src="bossavatar(j)" /> -->
                        <img class="u-boss-avatar" svg-inline src="@/assets/img/fb/skull.svg" />
                        {{ item.BOSS }}
                    </div>
                </div>
                <div class="u-droplist">
                    <div class="u-tabs">
                        <el-tabs
                            tab-position="left"
                            class="u-group"
                            v-for="(group, groupname) in fillDroplist(droplist)"
                            :key="groupname"
                            v-model="activeType"
                        >
                            <el-tab-pane
                                :label="dropType(groupname)"
                                v-if="groupname !== 'maps'"
                                :name="groupname"
                            ></el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="u-drops">
                        <div class="u-drop" v-for="(group, groupname) in droplist" :key="groupname">
                            <div
                                v-show="
                                    activeType == 'all' ||
                                        groupname == activeType
                                "
                            >
                                <template v-if="groupname !== 'maps'">
                                    <div class="u-drop-wrapper" v-if="group && group.length">
                                        <div
                                            class="u-item"
                                            v-for="(drop, dropindex) in group"
                                            :key="dropindex"
                                        >
                                            <el-popover
                                                placement="top"
                                                width="200"
                                                trigger="hover"
                                                :open-delay="100"
                                                :close-delay="50"
                                            >
                                                <drop_item
                                                    class="u-item-content"
                                                    :data="drop"
                                                    :type="groupname"
                                                ></drop_item>
                                                <div slot="reference">
                                                    <i
                                                        class="u-drop-item-icon u-item-icon"
                                                        :class="
                                                            'u-item-color-' +
                                                                drop.Color
                                                        "
                                                    >
                                                        <img
                                                            v-if="
                                                                drop.Icon &&
                                                                    drop.Icon
                                                                        .FileName
                                                            "
                                                            :src="
                                                                drop.Icon
                                                                    .FileName
                                                            "
                                                        />
                                                        <img v-else src="../assets/img/null.png" />
                                                    </i>
                                                    <span class="u-item-name">
                                                        {{
                                                        drop.Name
                                                        }}
                                                    </span>
                                                </div>
                                            </el-popover>
                                        </div>
                                    </div>
                                    <el-alert
                                        v-if="
                                            activeType != 'all' &&
                                                (!group ||
                                                    (group && !group.length))
                                        "
                                        title="没有相关条目"
                                        type="info"
                                        show-icon
                                    ></el-alert>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <router-link class="u-switch-version" to="/drop_v2"><i class="el-icon-sort"></i> 切换至新版</router-link>
    </div>
</template>

<script>
import { getDrop, getBoss } from "@/service/fb/drop";
import { __iconPath, __ossRoot } from "@jx3box/jx3box-common/data/jx3box.json";
import dropmap from "@/assets/js/drop.json";
import drop_item from "@/components/fb/drop/drop_item";
import _ from "lodash";

export default {
    name: "Drop",
    props: [],
    data: function () {
        return {
            mapid: "",
            bossid: "",
            bosslist: [],
            droplist: [],
            activeType: "all",
            data: {},
            loading: false,
        };
    },
    computed: {
        fb: function () {
            return this.$route.query.fb_name || this.$store.state.default_fb;
        },
        zlp: function () {
            return this.$route.query.fb_zlp || this.$store.state.default_zlp;
        },
        client : function (){
            return this.$store.state.client || 'std'
        },
        maplist: function () {
            return (
                this.$store.state.map &&
                this.$store.state.map[this.zlp]["dungeon"][this.fb]["maps"]
            );
        },
    },
    methods: {
        changeBoss : function (bossindex){
            this.bossid = bossindex
        },
        loadData: function () {
            this.loadBossList().then(() => {
                this.loadDropList();
            });
        },
        loadBossList: function () {
            return getBoss(this.mapid,this.client).then((res) => {
                this.bosslist = res?.data || [];
                this.bossid = this.bosslist[0]["BossIndex"];
            });
        },
        loadDropList: function () {
            this.loading = true;
            return getDrop(this.bossid,this.client)
                .then((res) => {
                    this.droplist = res?.data && res?.data?.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        dropType: function (val) {
            return dropmap[val];
        },
        fillDroplist: function (list) {
            if (list) list["all"] = [];
            return list;
        },
        showDrop: function (drop) {
            this.data = drop;
        },
    },
    watch: {
        fb: {
            immediate: true,
            handler: function () {
                this.mapid = this.maplist && this.maplist[0]["map_id"];
                this.loadData();
            },
        },
        bossid : {
            handler : function (){
                this.loadDropList()
            }
        }
    },
    components: {
        drop_item,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/drop.less";
</style>
