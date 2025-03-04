<template>
    <div class="m-detail-primary">
        <div class="u-group">
            <div class="u-title"> <i class="el-icon-tickets"></i> 内容 </div>
            <div class="u-primary u-content" v-if="payload.szContent">{{ payload.szContent }}</div>
            <div class="u-title"> <i class="el-icon-connection"></i> 限制条件 </div>
            <div class="u-primary">
                <el-row :gutter="20">
                    <el-col :span="6" v-if="hasProp('bCheckLevel')">
                        <span class="u-meta">
                            <span class="u-label">区分等级</span>
                            <span class="u-value">
                                <bool :value="!!payload.bCheckLevel" />
                            </span>
                        </span>
                    </el-col>

                    <el-col :span="6" v-if="hasProp('nScrutinyType')">
                        <span class="u-meta">
                            <span class="u-label">目标类型</span>
                            <span
                                class="u-value u-target"
                                :class="payload.nScrutinyType && 'is-' + payload.nScrutinyType"
                            >
                                {{ targetType }}
                            </span>
                        </span>
                    </el-col>

                    <el-col :span="6" v-if="hasProp('tKungFu')">
                        <span class="u-meta u-xf">
                            <span class="u-label">自身类型</span>
                            <span class="u-value">
                                <span v-if="selfType && selfType.length">
                                    <span v-for="xf in selfType" :key="xf">
                                        <img :src="getImage('xf', xf)" />
                                    </span>
                                </span>
                                <span v-else>不限</span>
                            </span>
                        </span>
                    </el-col>

                    <el-col :span="6" v-if="hasProp('nCount')">
                        <span class="u-meta">
                            <span class="u-label">层数/数量</span>
                            <span class="u-value">
                                {{ payload.nCount || "不限" }}
                            </span>
                        </span>
                    </el-col>

                    <el-col :span="6" v-if="hasProp('bAllLeave')">
                        <span class="u-meta">
                            <span class="u-label">全部消失</span>
                            <span class="u-value">
                                <bool :value="!!payload.bAllLeave" />
                            </span>
                        </span>
                    </el-col>

                    <el-col :span="6" v-if="hasProp('bSearch')">
                        <span class="u-meta">
                            <span class="u-label">子串查找</span>
                            <span class="u-value">
                                <bool :value="!!payload.bSearch" />
                            </span>
                        </span>
                    </el-col>

                    <el-col :span="6" v-if="hasProp('bReg')">
                        <span class="u-meta">
                            <span class="u-label">正则匹配</span>
                            <span class="u-value">
                                <bool :value="!!payload.bReg" />
                            </span>
                        </span>
                    </el-col>
                </el-row>
            </div>
            <div class="u-title"><i class="el-icon-bell"></i> 报警设置</div>
            <div class="u-primary">
                <el-row :gutter="20">
                    <el-col :span="12" v-if="hasProp('bTeamPanel')"
                        ><span class="u-meta u-line"
                            ><span class="u-label">团队面板</span>
                            <span class="u-value" v-if="hasProp('bTeamPanel')">
                                <span v-for="(event, i) in typeEvent[type]['bTeamPanel']" :key="i">
                                    <bool :value="!!payload[event]['bTeamPanel']" />
                                    {{ payload[event]["bTeamPanel"] ? "开启" : "未开启" }}
                                </span>
                            </span>
                            <span class="u-value" v-if="hasProp('bOnlySelfSrc')">
                                <span v-for="(event, i) in typeEvent[type]['bOnlySelfSrc']" :key="i">
                                    <bool :value="!!payload[event]['bOnlySelfSrc']" />
                                    仅来源于自己
                                </span>
                            </span></span
                        ></el-col
                    >
                    <el-col :span="12"
                        ><span class="u-meta u-line">
                            <span class="u-label">通用颜色</span>
                            <span class="u-value">
                                <i class="u-col" :style="{ background: payload.col }"></i>
                            </span> </span
                    ></el-col>
                    <el-col :span="12" v-if="hasProp('bScreenHead')"
                        ><span class="u-meta u-line">
                            <span class="u-label">头顶报警</span>
                            <span class="u-value">
                                <span v-for="(event, i) in typeEvent[type]['bScreenHead']" :key="i">
                                    <bool :value="!!payload[event]['bScreenHead']" />
                                    {{ payload[event]["bScreenHead"] ? "开启" : "未开启" }}
                                </span>
                            </span>
                        </span></el-col
                    >
                    <el-col :span="12" v-if="hasProp('bCenterAlarm')"
                        ><span class="u-meta u-line">
                            <span class="u-label">中央报警</span>
                            <span class="u-value">
                                <span class="u-value" v-for="(event, i) in typeEvent[type]['bCenterAlarm']" :key="i">
                                    <bool :value="!!payload[event]['bCenterAlarm']" />
                                    {{ eventMap[event] }}
                                </span>
                            </span>
                        </span></el-col
                    >
                    <el-col :span="12" v-if="hasProp('bFullScreen')"
                        ><span class="u-meta u-line">
                            <span class="u-label">全屏泛光</span>
                            <span class="u-value">
                                <span class="u-value" v-for="(event, i) in typeEvent[type]['bFullScreen']" :key="i">
                                    <bool :value="!!payload[event]['bFullScreen']" />
                                    {{ eventMap[event] }}
                                </span>
                            </span>
                        </span></el-col
                    >
                    <el-col :span="12" v-if="hasProp('bBuffList')"
                        ><span class="u-meta u-line">
                            <span class="u-label">自身气劲</span>
                            <span class="u-value">
                                <span v-for="(event, i) in typeEvent[type]['bBuffList']" :key="i">
                                    <bool :value="!!payload[event]['bBuffList']" />
                                    {{ payload[event]["bBuffList"] ? "开启" : "未开启" }}
                                </span>
                            </span>
                        </span></el-col
                    >
                    <el-col :span="12" v-if="hasProp('bPartyBuffList')"
                        ><span class="u-meta u-line">
                            <span class="u-label">团队气劲</span>
                            <span class="u-value">
                                <span v-for="(event, i) in typeEvent[type]['bPartyBuffList']" :key="i">
                                    <bool :value="!!payload[event]['bPartyBuffList']" />
                                    {{ payload[event]["bPartyBuffList"] ? "开启" : "未开启" }}
                                </span>
                            </span>
                        </span></el-col
                    >
                    <el-col :span="12" v-if="hasProp('bTeamChannel')"
                        ><span class="u-meta u-line">
                            <span class="u-label">团队通知</span>
                            <span class="u-value">
                                <span class="u-value" v-for="(event, i) in typeEvent[type]['bTeamChannel']" :key="i">
                                    <bool :value="!!payload[event]['bTeamChannel']" />
                                    {{ eventMap[event] }}
                                </span>
                            </span>
                        </span></el-col
                    >
                    <el-col :span="12" v-if="hasProp('bWhisperChannel')"
                        ><span class="u-meta u-line">
                            <span class="u-label">密聊通知</span>
                            <span class="u-value">
                                <span class="u-value" v-for="(event, i) in typeEvent[type]['bWhisperChannel']" :key="i">
                                    <bool :value="!!payload[event]['bWhisperChannel']" />
                                    {{ eventMap[event] }}
                                </span>
                            </span>
                        </span></el-col
                    >
                    <el-col :span="12" v-if="hasProp('tMark')">
                        <span class="u-meta u-line">
                            <span class="u-label">设置标记</span>
                            <span class="u-value">
                                <div v-for="(event, i) in typeEvent[type]['tMark']" :key="i" class="u-tline">
                                    <span v-if="typeEvent[type]['tMark']['length'] > 1" style="margin-right: 10px"
                                        ><i class="el-icon-caret-right"></i> {{ eventMap[event] }}</span
                                    >
                                    <span v-for="(markname, j) in tmarks" :key="j">
                                        <img
                                            class="u-mark"
                                            :src="getImage('tMark', j)"
                                            :alt="markname"
                                            :title="markname"
                                            v-if="!!payload[event]['tMark'][j]"
                                        />
                                    </span>
                                </div>
                            </span>
                        </span>
                    </el-col>
                    <el-col :span="12" v-if="hasProp('szVoice')"
                        ><span class="u-meta u-line">
                            <span class="u-label">语音报警</span>
                            <span class="u-value">
                                <div v-for="(event, i) in typeEvent[type]['szVoice']" :key="i" class="u-tline">
                                    <span v-if="typeEvent[type]['szVoice']['length'] > 1" style="margin-right: 10px">
                                        <i class="el-icon-caret-right"></i> {{ eventMap[event] }}
                                    </span>
                                    <span>
                                        {{ getSlugName(payload[event]["szVoice"])?.[1] || payload[event]["szVoice"] }}
                                    </span>
                                </div>
                            </span>
                        </span>
                    </el-col>
                </el-row>

                <span class="u-meta" v-if="hasProp('aFocus') && payload.aFocus && payload.aFocus.length">
                    <span class="u-label">设置焦点</span>
                    <span class="u-value">
                        <span class="u-focus u-line" v-for="(focus, i) in payload.aFocus" :key="i">
                            <i class="el-icon-aim"></i>
                            <span class="u-focus-life" v-if="focus.tLife && focus.tLife.bEnable">
                                血量
                                <b>{{ focus.tLife.szOperator }} {{ focus.tLife.nValue }} %</b>
                                ,
                            </span>
                            <span class="u-focus-relation">
                                目标为
                                <b>{{ calcRelation(focus.tRelation) }}</b>
                                单位时
                            </span>
                            <span class="u-focus-distance" v-if="focus.nMaxDistance">
                                , 最大生效距离：<b>{{ focus.nMaxDistance }}</b>
                                尺
                            </span>
                        </span>
                    </span>
                </span>
                <span
                    class="u-meta"
                    v-if="hasProp('aCataclysmBuff') && payload.aCataclysmBuff && payload.aCataclysmBuff.length"
                >
                    <span class="u-label">茗伊面板</span>
                    <span class="u-value">
                        <span class="u-panel u-line" v-for="(panel, i) in payload.aCataclysmBuff" :key="i">
                            <i class="el-icon-caret-right" v-if="payload.aCataclysmBuff.length > 1"></i>
                            <span class="u-panel-subitem" v-if="panel.szStackOp"
                                >当层数 <b>{{ panel.szStackOp }} {{ panel.nStackNum }}</b
                                >时
                            </span>
                            <span class="u-panel-subitem" v-if="panel.bOnlyMe"
                                ><bool :value="!!panel.bOnlyMe" />只监控自己</span
                            >
                            <span class="u-panel-subitem" v-if="panel.bOnlyMine"
                                ><bool :value="!!panel.bOnlyMine" />来源于自身</span
                            >
                            <span class="u-panel-subitem" v-if="panel.bCaution"
                                ><bool :value="!!panel.bCaution" />特效警告</span
                            >
                            <span class="u-panel-subitem" v-if="panel.bScreenHead"
                                ><bool :value="!!panel.bScreenHead" />头顶警告
                                <i class="u-col" :style="{ background: panel.colScreenHead }"></i
                            ></span>
                            <span class="u-panel-subitem" v-if="panel.bAttention"
                                ><bool :value="!!panel.bAttention" />蒙版警告
                                <i class="u-col" :style="{ background: panel.colors }"></i
                            ></span>
                        </span>
                    </span>
                </span>
            </div>
            <div class="u-title"> <i class="el-icon-alarm-clock"></i> 计时条 </div>
            <div class="u-primary u-countdown">
                <table v-if="payload.tCountdown && payload.tCountdown.length">
                    <thead>
                        <th>图标</th>
                        <th class="u-condition">触发条件</th>
                        <th>
                            <el-tooltip effect="dark" placement="top">
                                <div slot="content" class="u-tips">
                                    普通倒计时：10<br />
                                    分段倒计时：3,第一段倒计时;10,第二段倒计时;<br />
                                    血量倒计时：0.7,达到70%准备下P2距离P2第一次大招还剩3秒,3
                                    <br />
                                    清空倒计时：0（清空与该倒计时拥有相同 倒计时唯一标识 的所有当前存在的倒计时 以及
                                    其对应的 倒计时重复调用时间限制）<br />
                                    清空倒计时：-1（将会清空与该倒计时拥有相同 倒计时唯一标识
                                    的所有当前存在的倒计时；不会清空其对应的 倒计时重复调用时间限制）<br />
                                    清空倒计时：-2（将会清空与该倒计时拥有相同 倒计时唯一标识 的
                                    倒计时重复调用时间限制；不会清空其当前存在的 倒计时）<br />
                                    *请注意标点需要使用半角
                                </div>
                                <div> <i class="el-icon-info"></i> 倒计时/时间轴 </div>
                            </el-tooltip>
                        </th>
                        <th>
                            <el-tooltip effect="dark" placement="top">
                                <div slot="content" class="u-tips">
                                    {$me} 当前角色名<br />
                                    {$sender} 事件发起者<br />
                                    {$receiver} 事件接收者<br />
                                    {$B--} Buff名称，--为ID数字<br />
                                    {$S--} 技能名称，--为ID数字<br />
                                    {$N--} NPC名称，--为ID数字<br />
                                    {$D--} 物品名称，--为ID数字<br />
                                    {$M--} 地图名称，--为ID数字
                                </div>
                                <div> <i class="el-icon-info"></i> 计时条文字 </div>
                            </el-tooltip>
                        </th>
                        <th>
                            <el-tooltip effect="dark" placement="top" content="在此时间内，该倒计时不会被刷新重新计时"
                                ><div> <i class="el-icon-info"></i> 重复调用限制 </div></el-tooltip
                            >
                        </th>
                        <th>唯一识别符</th>
                        <th>过图不消失</th>
                        <th>团队通知</th>
                        <th>颜色</th>
                    </thead>
                    <tbody>
                        <tr v-for="(clock, i) in payload.tCountdown" :key="i">
                            <td>
                                <img class="u-icon" :src="iconLink(clock.nIcon || 13)" />
                            </td>
                            <td>{{ eventMap[clock.nClass] }}</td>
                            <td>{{ clock.nTime }}</td>
                            <td>{{ clock.szName }}</td>
                            <td>{{ clock.nRefresh }}</td>
                            <td>{{ clock.key }}</td>
                            <td><bool :value="!!clock.bHold" /></td>
                            <td><bool :value="!!clock.bTeamChannel" /></td>
                            <td>
                                <i
                                    class="u-col"
                                    :style="{
                                        background: bgColor(clock.nFrame),
                                    }"
                                ></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else>无</div>
            </div>
        </div>
    </div>
</template>

<script>
import bool from "@/components/dbm/bool.vue";
import { ScrutinyType, events } from "@/assets/data/dbm/types.json";
import tmarks from "@/assets/data/dbm/team_marks.json";
import typeEvent from "@/assets/data/dbm/type_event.json";
import cdcolors from "@/assets/data/dbm/countdown_colors.json";
import { getSlugName } from "@/utils/dbm/voice.js";

import { getImage } from "@/utils/dbm/common.js";
import { itemHasProp } from "@/utils/dbm/item.js";
import { iconLink } from "@jx3box/jx3box-common/js/utils.js";

export default {
    name: "ItemDetailPrimary",
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data: function () {
        return {
            ScrutinyType,
            typeEvent,
            tmarks,
            eventMap: events,
        };
    },
    computed: {
        type: function () {
            return this.item.type;
        },
        payload: function () {
            return this.item.payload;
        },
        targetType: function () {
            return this.payload.nScrutinyType ? ScrutinyType[~~this.payload.nScrutinyType] : "不限";
        },
        selfType: function () {
            return this.payload.tKungFu;
        },
    },
    methods: {
        getImage,
        iconLink,
        getSlugName,
        hasProp: function (prop) {
            return itemHasProp(this.type, prop);
        },
        calcRelation: function (r) {
            for (let key in r) {
                if (r.bAlly && !r.bEnemy) {
                    return "非敌对";
                } else if (!r.bAlly && r.bEnemy) {
                    return "敌对";
                } else {
                    return "任意";
                }
            }
        },
        bgColor: function (i) {
            return cdcolors[i];
        },
    },
    mounted: function () {},
    components: {
        bool,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item/item_detail_primary.less";
</style>
