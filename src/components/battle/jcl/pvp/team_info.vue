<template>
    <div class="m-team-info">
        <div class="u-title">双方信息</div>
        <div class="u-player-list">
            <div class="u-player" v-for="(item, index) in players" :key="index" :class="playerClass(item)">
                <img class="u-player-icon" :src="showMountIcon(item.mount)" alt="" />
                <div class="u-player-info">
                    <div class="u-player-name">{{ item.name }}</div>
                    <div class="u-player-mount">{{ mountStr(item.mount) }}</div>
                </div>
                <el-button class="u-player-view" type="text" @click="view(item)">查看详情</el-button>
            </div>
        </div>
        <el-dialog
            :title="`${entityName} - 角色详情`"
            :visible.sync="showDetails"
            :modal="true"
            width="1320px"
            height="820px"
        >
            <div class="m-player-equip">
                <iframe width="1300" height="800" :src="iframeUrl" frameborder="0"></iframe>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { showMountIcon } from "@jx3box/jx3box-common/js/utils";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";

import { entityToJBBB } from "@/utils/battle/jcl/format.js";
import { Base64 } from "js-base64";

export default {
    name: "TeamInfo",
    components: {},
    data: () => ({
        showDetails: false,

        playerJbbb: "",
        entityName: "",
    }),
    computed: {
        players() {
            return Object.values(window.$store.entities)
                .filter((item) => item.type === "player" && item.mount > 0 && `${item.id}`.startsWith("5"))
                .map((item) => {
                    return {
                        ...item,
                        equips: item.equips.filter((e) => e.p < 12),
                        mountStr: xfid[item.mount],
                        talentsArr: item.talents
                            .map((i) => {
                                return i.p;
                            })
                            .filter((item) => item > 0),
                    };
                })
                .sort((a, b) => {
                    return Number(a.team) - Number(b.team);
                });
        },

        iframeUrl() {
            return `https://www.jx3box.com/pz/iframe.html?disableClick=1&code=${this.playerJbbb}}`;
        },
    },
    methods: {
        showMountIcon,
        mountStr(id) {
            return xfid[id];
        },
        playerClass(entity) {
            return {
                "u-red": entity.team === true,
                "u-blue": entity.team === false,
            };
        },
        view(item) {
            this.entityName = item.name;
            entityToJBBB(item.id).then((res) => {
                this.playerJbbb = encodeURIComponent(Base64.encode(JSON.stringify(res)));
                this.showDetails = true;
            });
        },
    },
    mounted() {},
};
</script>
<style lang="less">
@import "~@/assets/css/battle/jcl/pvp/team.less";
</style>
