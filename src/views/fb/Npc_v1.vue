<template>
    <div class="m-fb-npc" v-loading="loading">
        <el-input class="m-npc-search" placeholder="请输入NPC名称或ID" v-model.trim.lazy="search" @change="loadData" :disabled="onlyboss">
            <template slot="prepend"><i class="el-icon-search"></i> 搜索</template>
            <el-switch class="u-switch u-onlyboss" slot="append" v-model="onlyboss" active-color="#13ce66" inactive-text="只看首领" @change="loadData"></el-switch>
        </el-input>
        <div class="m-filter-group" v-if="onlyboss">
            <el-radio-group v-model="mapid" size="medium">
                <el-radio-button v-for="item in maps" :key="item.map_id" :label="item.map_id">{{ item.mode }}</el-radio-button>
            </el-radio-group>
        </div>
        <ul class="m-npc-list" v-if="data.length">
            <li v-for="(npc, i) in data" class="u-item" :key="npc + i">
                <i v-if="onlyboss" class="u-isBoss">
                    <img src="@/assets/img/fb/boss_mini.png" />
                </i>
                <img class="u-icon" src="@/assets/img/fb/iboss.png" />
                <Mark class="u-mark u-id" :value="npc.ID" v-clipboard:copy="npc.ID" v-clipboard:success="onCopy" v-clipboard:error="onError" :key="npc.ID" />
                <div class="u-title">
                    <a class="u-name" :href="npc.ID | getNpcLink" target="_blank">
                        <i class="el-icon-link"></i>
                        {{ npc.Name }}
                    </a>
                    <span class="u-name-add">
                        <span v-if="npc.Title || npc.Level">&lt;</span>
                        <span class="u-nick" v-if="npc.Title">{{ npc.Title }}</span>
                        <span v-if="npc.Title && npc.Level">·</span>
                        <b class="u-level" v-if="npc.Level">{{ npc.Level }}</b>
                        <span v-if="npc.Title || npc.Level">&gt;</span>
                    </span>
                    <div class="u-base">
                        <span class="u-atmap" v-if="npc.MapName">
                            <em>MapName</em>
                            {{ npc.MapName }}
                        </span>
                        <!-- <span class="u-totation" v-if="npc._Notation">
                            <em>_Notation</em>
                            {{ npc._Notation }}
                        </span>-->
                        <span class="u-intensity" v-if="npc.Intensity">
                            强度
                            <em>Intensity</em>
                            {{ npc.Intensity }}
                        </span>
                    </div>
                </div>
                <div class="u-primary">
                    <div class="u-life">
                        <b>血量</b>
                        <em>MaxLife</em>
                        <i class="u-range">
                            <strong
                                :style="{
                                    width: (npc.MaxLife * 100) / 99999999 + '%',
                                }"
                                >{{ showBigInt(npc.MaxLife) }}</strong
                            >
                        </i>
                    </div>
                    <div class="u-mana">
                        <b>内力</b>
                        <em>MaxMana</em>
                        <i class="u-range">
                            <strong
                                :style="{
                                    width: (npc.MaxMana * 100) / 99999999 + '%',
                                }"
                                >{{ showBigInt(npc.MaxMana) }}</strong
                            >
                        </i>
                    </div>
                    <div class="u-speed" v-if="npc.RunSpeed || npc.WalkSpeed">
                        <b>跑速</b>
                        <em>RunSpeed</em>
                        {{ npc.RunSpeed || npc.WalkSpeed }}
                    </div>
                    <div class="u-touch" v-if="npc.TouchRange">
                        <b>范围</b>
                        <em>TouchRange</em>
                        {{ npc.TouchRange }}
                    </div>
                    <div class="u-sense" v-if="npc.Sense">
                        <b>识破</b>
                        <em>Sense</em>
                        {{ npc.Sense }}
                    </div>
                    <div class="u-dodge" v-if="npc.Dodge">
                        <b>闪避</b>
                        <em>Dodge</em>
                        {{ npc.Dodge }}
                    </div>
                    <div class="u-dodge" v-if="npc.Parry">
                        <b>招架</b>
                        <em>Parry</em>
                        {{ npc.ParryValue }}
                    </div>
                    <div class="u-shield">
                        <b>防御</b>
                        <em>Shield</em>
                        <!-- <span class="u-sitem">
                            <span
                                class="u-value"
                            >外攻{{showDefence(~~npc.PhysicsShieldBase,~~npc.Level)}}</span>
                        </span>
                        <span class="u-sitem">
                            <span
                                class="u-value"
                            >内攻{{showDefence(~~npc.NeutralMagicDefence || ~~npc.SolarMagicDefence || ~~npc.LunarMagicDefence || ~~npc.PoisonMagicDefence,npc.Level)}}</span>
                        </span>-->
                        <!-- <template v-if="isAdmin"> -->
                        <span class="u-sitem">
                            外功防御
                            <em>PhysicsShieldBase</em>
                            <span class="u-value">{{ ~~npc.PhysicsShieldBase }}</span>
                        </span>
                        <span class="u-sitem">
                            混元防御
                            <em>NeutralMagicDefence</em>
                            <span class="u-value">{{ ~~npc.NeutralMagicDefence }}</span>
                        </span>
                        <span class="u-sitem">
                            阳性防御
                            <em>SolarMagicDefence</em>
                            <span class="u-value">{{ ~~npc.SolarMagicDefence }}</span>
                        </span>
                        <span class="u-sitem">
                            阴性防御
                            <em>LunarMagicDefence</em>
                            <span class="u-value">{{ ~~npc.LunarMagicDefence }}</span>
                        </span>
                        <span class="u-sitem">
                            毒性防御
                            <em>PoisonMagicDefence</em>
                            <span class="u-value">{{ ~~npc.PoisonMagicDefence }}</span>
                        </span>
                        <!-- </template> -->
                    </div>
                    <div class="u-critical">
                        <b>会心</b>
                        <em>Critical</em>
                        <span class="u-sitem" v-if="client == 'std'">
                            外攻会心
                            <span class="u-value">{{ showCritical(~~npc.PhysicsCriticalStrike, ~~npc.Level) }}</span>
                        </span>
                        <span class="u-sitem" v-if="client == 'std'">
                            内攻会心
                            <span class="u-value">{{
                                showCritical(~~npc.NeutralCriticalStrike || ~~npc.NeutralCriticalStrike || ~~npc.SolarCriticalStrike || ~~npc.LunarCriticalStrike, ~~npc.Level)
                            }}</span>
                        </span>
                        <!-- <span class="u-sitem">（即T御劲需求，具体以BOSS主要攻击类型为主）</span> -->
                        <!-- <template v-if="isAdmin"> -->
                        <span class="u-sitem">
                            外功会心
                            <em>PhysicsCriticalStrike</em>
                            <span class="u-value">{{ ~~npc.PhysicsCriticalStrike }}</span>
                        </span>
                        <span class="u-sitem">
                            混元会心
                            <em>NeutralCriticalStrike</em>
                            <span class="u-value">{{ ~~npc.NeutralCriticalStrike }}</span>
                        </span>
                        <span class="u-sitem">
                            阳性会心
                            <em>SolarCriticalStrike</em>
                            <span class="u-value">{{ ~~npc.SolarCriticalStrike }}</span>
                        </span>
                        <span class="u-sitem">
                            阴性会心
                            <em>LunarCriticalStrike</em>
                            <span class="u-value">{{ ~~npc.LunarCriticalStrike }}</span>
                        </span>
                        <span class="u-sitem">
                            毒性会心
                            <em>PoisonCriticalStrike</em>
                            <span class="u-value">{{ ~~npc.PoisonCriticalStrike }}</span>
                        </span>
                        <!-- </template> -->
                    </div>
                    <div class="u-attack" v-if="isOrigin">
                        <b>命中</b>
                        <em>Attack</em>
                        <!-- <span class="u-sitem">
                            <span class="u-value">{{~~npc.PhysicsAttackHit}}</span>
                        </span>-->
                        <!-- <template v-if="isAdmin"> -->
                        <span class="u-sitem">
                            外功命中
                            <em>PhysicsAttackHit</em>
                            <span class="u-value">{{ ~~npc.PhysicsAttackHit }}</span>
                        </span>
                        <span class="u-sitem">
                            混元命中
                            <em>NeutralMagicHit</em>
                            <span class="u-value">{{ ~~npc.NeutralMagicHit }}</span>
                        </span>
                        <span class="u-sitem">
                            阳性命中
                            <em>SolarMagicHit</em>
                            <span class="u-value">{{ ~~npc.SolarMagicHit }}</span>
                        </span>
                        <span class="u-sitem">
                            阴性命中
                            <em>LunarMagicHit</em>
                            <span class="u-value">{{ ~~npc.LunarMagicHit }}</span>
                        </span>
                        <span class="u-sitem">
                            毒性命中
                            <em>PoisonMagicHit</em>
                            <span class="u-value">{{ ~~npc.PoisonMagicHit }}</span>
                        </span>
                        <!-- </template> -->
                    </div>
                </div>
                <!-- <div class="u-misc" v-if="hasRight">
                    <span class="u-remark">
                        CanSeeLifeBar:
                        <strong>{{ npc.CanSeeLifeBar }}</strong>
                    </span>
                    <span class="u-remark">
                        IsSelectable:
                        <strong>{{ npc.IsSelectable }}</strong>
                    </span>

                    <span class="u-remark">
                        ReviveTime:
                        <strong>{{ npc.ReviveTime }}</strong>
                    </span>
                    <span class="u-remark">
                        ImmunityMask:
                        <strong>{{ npc.ImmunityMask }}</strong>
                    </span>
                    <span class="u-remark">
                        ScriptName:
                        <strong>{{ npc.ScriptName }}</strong>
                    </span>
                </div>
                <div class="u-misc-tip" v-else>
                    <i class="el-icon-lock"></i> 更多词条仅
                    <a href="/vip/premium?from=database_npc" target="_blank">高级/专业版会员</a>可见
                </div>-->
                <!-- <div class="u-misc-tip">
                    <a :href="npc.ID | getNpcLink" target="_blank">
                        <i class="el-icon-link"></i> 查看更多词条
                    </a>
                </div>-->
            </li>
        </ul>
        <el-alert v-else class="m-archive-null" type="info" center show-icon> 该副本没有找到相关条目，全图搜索请前往<a href="/app/database" target="_blank">[剑三数据库]</a>应用 </el-alert>
        <template v-if="!onlyboss">
            <el-button class="m-archive-more" :class="{ show: hasNextPage }" type="primary" :loading="loading" @click="appendPage(++page)">加载更多</el-button>
            <el-pagination
                class="m-archive-pages"
                background
                :hide-on-single-page="true"
                @current-change="changePage"
                :current-page.sync="page"
                :page-size.sync="per"
                layout="total, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </template>
    </div>
</template>

<script>
import { getMapNpc, getBoss } from "@/service/fb/npc";
import { __ossMirror } from "@jx3box/jx3box-common/data/jx3box";
import User from "@jx3box/jx3box-common/js/user";
import { getLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "NPCv1",
    props: [],
    data: function() {
        return {
            loading: true,
            data: [],

            per: 10,
            total: 0,
            page: 0,
            pages: 1,

            search: "",
            onlyboss: true,
            mapid: "",
            bossids: [],

            hasRight: false,
            isAdmin: User.isAdmin(),

            critical_coefficient: {
                "110": 35737.5,
                "111": 37691.15,
                "112": 39644.8,
                "113": 41598.45,
                "114": 43552.1,
            },
            defence_coefficient: {
                "110": 19091.25,
                "111": 20134.905,
                "112": 21178.56,
                "113": 22222.215,
                "114": 23265.87,
            },
        };
    },
    computed: {
        hasNextPage: function() {
            return this.total > 1 && this.page < this.pages;
        },
        fb: function() {
            return this.$route.query.fb_name || this.$store.state.default_fb;
        },
        fb_search_name: function() {
            return this.dungeons[this.fb]['name_for_search'] || this.fb;
        },
        map() {
            return this.$store.state.map;
        },
        dungeons() {
            let dungeons = {};

            Object.values(this.map).forEach((group) => {
                Object.assign(dungeons, group.dungeon);
            });

            return dungeons;
        },
        maps: function() {
            return this.dungeons?.[this.fb]["maps"];
        },
        bosslist: function() {
            return this.dungeons?.[this.fb]["boss"];
        },
        client: function() {
            return this.$store.state.client || "std";
        },
        isOrigin: function() {
            return this.client == "origin";
        },
        params: function() {
            let params = {
                per: this.per,
                client: this.client,
            };
            if (this.search) {
                if (isNaN(this.search)) {
                    params.Name = this.search;
                } else {
                    params.ID = this.search;
                }
            }
            return params;
        },
    },
    methods: {
        loadData: function(i = 1, append = false) {
            this.loading = true;
            if (!this.onlyboss) {
                let params = Object.assign(this.params, {
                    page: i,
                    client: this.client,
                });
                getMapNpc(this.fb_search_name, params)
                    .then((res) => {
                        if (append) {
                            this.data = this.data.concat(res.data.list);
                        } else {
                            window.scrollTo(0, 0);
                            this.data = res.data.list;
                        }
                        this.total = res.data.total;
                        this.pages = res.data.pages;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                // 获取当前地图首领
                this.page = 1;
                getBoss(this.mapid, this.client)
                    .then((res) => {
                        let ids = res?.data?.reduce((ids, cur) => {
                            let NPCID = cur.NPCID?.split("、");
                            if(NPCID) ids.push(...(NPCID.map(id => parseInt(id))));
                            return ids;
                        }, []);
                        getMapNpc(this.fb_search_name, {
                            ids: ids.join(","),
                            client: this.client,
                            per: 20
                        }).then((res) => {
                            this.data = res?.data?.list || [];
                        });
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        changePage: function(i) {
            this.loadData(i);
        },
        appendPage: function(i) {
            this.loadData(i, true);
        },
        // isBoss: function (id) {
        //     return !!bossids.includes(id);
        // },
        onCopy: function(val) {
            this.$notify({
                title: "复制成功",
                message: "复制内容 : " + val.text,
                type: "success",
            });
        },
        onError: function() {
            this.$notify.error({
                title: "复制失败",
                message: "请手动复制",
            });
        },
        showDefence: function(val, level) {
            // 等级 lv 防御shield 防御系数shieldx5.091【赛季维护】 属性因子y205 等级常数lvn18800
            // =FLOOR((shield/(shield+(shieldx*(y*lv-lvn)))*1024),1)/1024
            // =shield/(shield+(shieldx*(y*lv-lvn))))
            // return (
            //     parseInt((val / (val + 5.091 * (205 * level - 18800))) * 100) +
            //     "%"
            // );
            if (level) {
                return ((val / this.defence_coefficient[level]) * 100).toFixed(2) + "%";
            } else {
                return val;
            }
        },
        showCritical: function(val, level) {
            // 会心CriticalStrike 全局常数x3750【等级维护】会心CriticalStrikex
            // =ROUND(CriticalStrike/x/CriticalStrikex,3)
            // return ((val / 3750 / 9.53) * 100).toFixed(2) + "%";
            if (level) {
                return ((val / this.critical_coefficient[level]) * 100).toFixed(2) + "%";
            } else {
                return val;
            }
        },
        showBigInt: function(val) {
            let _val = val / 100000000;
            if (_val > 1) {
                return _val.toFixed(2) + "亿";
            } else {
                return parseInt(_val * 10000) + "万";
            }
        },
    },
    watch: {
        fb: {
            immediate: true,
            handler: function() {
                this.mapid = this.maps.slice(-1)[0]["map_id"];
                this.loadData();
            },
        },
        mapid: function() {
            this.loadData();
        },
    },
    mounted: function() {
        User.isLogin() &&
            User.isVIP().then((data) => {
                this.hasRight = data;
            });
    },
    filters: {
        getNpcLink: function(val) {
            return getLink("npc", val);
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/npc.less";
</style>
