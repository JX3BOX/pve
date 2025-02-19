<template>
    <div class="m-database-item__npc">
        <div class="m-item">
            <div class="u-title">
                <div class="u-name">
                    <span class="u-name-primary">{{ data.Name }}&nbsp;</span>
                    <span class="u-name-secondary" v-if="data.BuffName"> ({{ data.BuffName }})</span>
                </div>
                <span class="u-name-add">
                    <span v-if="data.Title || data.Level">&lt;</span>
                    <span class="u-nick" v-if="data.Title">
                        {{ data.Title }}
                    </span>
                    <span v-if="data.Title && data.Level">·</span>
                    <b class="u-level" v-if="data.Level">{{ data.Level }}</b>
                    <span v-if="data.Title || data.Level">&gt;</span>
                </span>
                <div class="u-base">
                    <span class="u-map" v-if="data.MapName">
                        {{ data.MapName }}
                    </span>
                    <span class="u-intensity" v-if="data.Intensity">
                        <span>强度</span>
                        <span>{{ data.Intensity }}</span>
                    </span>
                </div>
                <div>
                    <span v-if="refCount" class="u-ref-count">
                        <i class="el-icon-connection"></i> 引用指数 {{ refCount }}</span
                    >
                    <Mark
                        class="u-id"
                        BGL="#333"
                        :value="'ID:' + data.ID"
                        :key="data.ID"
                        title="点击快速复制"
                        @click.native.stop="copy('ID')"
                    />
                </div>
            </div>
            <div class="u-primary">
                <div class="u-life">
                    <img class="u-desc-icon u-desc-icon-life" svg-inline src="@/assets/img/tool/database/energy.svg" />
                    <b>血量</b>
                    <em>MaxLife</em>
                    <strong>{{ data.MaxLife }}</strong>
                </div>
                <div class="u-mana">
                    <img class="u-desc-icon u-desc-icon-mana" svg-inline src="@/assets/img/tool/database/energy.svg" />
                    <b>内力</b>
                    <em>MaxMana</em>
                    <strong>{{ data.MaxMana }}</strong>
                </div>
                <div class="u-speed" v-if="data.RunSpeed || data.WalkSpeed">
                    <img class="u-desc-icon u-desc-icon-speed" svg-inline src="@/assets/img/tool/database/speed.svg" />
                    <b>跑速</b>
                    <em>RunSpeed</em>
                    <strong>{{ data.RunSpeed || data.WalkSpeed }}</strong>
                </div>
                <div class="u-touch" v-if="data.TouchRange">
                    <img class="u-desc-icon u-desc-icon-touch" svg-inline src="@/assets/img/tool/database/radar.svg" />
                    <b>范围</b>
                    <em>TouchRange</em>
                    <strong>{{ data.TouchRange }}</strong>
                </div>
                <div class="u-sense" v-if="data.Sense">
                    <img class="u-desc-icon u-desc-icon-sense" svg-inline src="@/assets/img/tool/database/sight.svg" />
                    <b>识破</b>
                    <em>Sense</em>
                    <strong>{{ data.Sense }}</strong>
                </div>
                <div class="u-dodge" v-if="data.Dodge">
                    <img class="u-desc-icon u-desc-icon-dodge" svg-inline src="@/assets/img/tool/database/miss.svg" />
                    <b>闪避</b>
                    <em>Dodge</em>
                    <strong>{{ data.Dodge }}</strong>
                </div>
                <div class="u-dodge" v-if="data.Parry">
                    <img class="u-desc-icon u-desc-icon-dodge" svg-inline src="@/assets/img/tool/database/miss.svg" />
                    <b>招架</b>
                    <em>Parry</em>
                    <strong>{{ data.ParryValue }}</strong>
                </div>
                <div class="u-shield">
                    <img class="u-desc-icon u-desc-icon-shield" svg-inline src="@/assets/img/tool/database/shield.svg" />
                    <b>防御</b>
                    <em>Shield</em>
                    <span class="u-prop-item">
                        外功防御
                        <em>PhysicsShieldBase</em>
                        <span class="u-value">{{ ~~data.PhysicsShieldBase }}</span>
                    </span>
                    <span class="u-prop-item">
                        混元防御
                        <em>NeutralMagicDefence</em>
                        <span class="u-value">{{ ~~data.NeutralMagicDefence }}</span>
                    </span>
                    <span class="u-prop-item">
                        阳性防御
                        <em>SolarMagicDefence</em>
                        <span class="u-value">{{ ~~data.SolarMagicDefence }}</span>
                    </span>
                    <span class="u-prop-item">
                        阴性防御
                        <em>LunarMagicDefence</em>
                        <span class="u-value">{{ ~~data.LunarMagicDefence }}</span>
                    </span>
                    <span class="u-prop-item">
                        毒性防御
                        <em>PoisonMagicDefence</em>
                        <span class="u-value">{{ ~~data.PoisonMagicDefence }}</span>
                    </span>
                </div>
                <div class="u-critical">
                    <img class="u-desc-icon u-desc-icon-attack" svg-inline src="@/assets/img/tool/database/attack.svg" />
                    <b>会心</b>
                    <em>Critical</em>
                    <span class="u-prop-item">
                        外功会心
                        <em>PhysicsCriticalStrike</em>
                        <span class="u-value">{{ ~~data.PhysicsCriticalStrike }}</span>
                    </span>
                    <span class="u-prop-item">
                        混元会心
                        <em>NeutralCriticalStrike</em>
                        <span class="u-value">{{ ~~data.NeutralCriticalStrike }}</span>
                    </span>
                    <span class="u-prop-item">
                        阳性会心
                        <em>SolarCriticalStrike</em>
                        <span class="u-value">{{ ~~data.SolarCriticalStrike }}</span>
                    </span>
                    <span class="u-prop-item">
                        阴性会心
                        <em>LunarCriticalStrike</em>
                        <span class="u-value">{{ ~~data.LunarCriticalStrike }}</span>
                    </span>
                    <span class="u-prop-item">
                        毒性会心
                        <em>PoisonCriticalStrike</em>
                        <span class="u-value">{{ ~~data.PoisonCriticalStrike }}</span>
                    </span>
                </div>
                <div class="u-attack">
                    <img class="u-desc-icon u-desc-icon-attack" svg-inline src="@/assets/img/tool/database/target.svg" />
                    <b>命中</b>
                    <em>Attack</em>
                    <span class="u-prop-item">
                        外功命中
                        <em>PhysicsAttackHit</em>
                        <span class="u-value">{{ ~~data.PhysicsAttackHit }}</span>
                    </span>
                    <span class="u-prop-item">
                        混元命中
                        <em>NeutralMagicHit</em>
                        <span class="u-value">{{ ~~data.NeutralMagicHit }}</span>
                    </span>
                    <span class="u-prop-item">
                        阳性命中
                        <em>SolarMagicHit</em>
                        <span class="u-value">{{ ~~data.SolarMagicHit }}</span>
                    </span>
                    <span class="u-prop-item">
                        阴性命中
                        <em>LunarMagicHit</em>
                        <span class="u-value">{{ ~~data.LunarMagicHit }}</span>
                    </span>
                    <span class="u-prop-item">
                        毒性命中
                        <em>PoisonMagicHit</em>
                        <span class="u-value">{{ ~~data.PoisonMagicHit }}</span>
                    </span>
                </div>
            </div>
            <el-button
                v-if="showDetail"
                class="u-props-toggle"
                :class="{ 'is-active': showProps }"
                @click="toggleProps"
            >
                <i class="el-icon-view"></i>
                <span v-if="showProps">收起属性</span>
                <span v-else>查看属性</span>
            </el-button>
        </div>
        <!-- 项目详情，仅在单页展示 -->
        <template v-if="showDetail">
            <!-- 详细字段列表 -->
            <div class="m-detail" v-if="showProps">
                <template v-for="(val, key) in data">
                    <span class="u-prop" :key="key" v-if="val">
                        <el-tooltip v-if="fieldLabel(key)" effect="dark" :content="key" placement="top">
                            <em>{{ fieldLabel(key) }}</em>
                        </el-tooltip>
                        <em v-else>{{ key }}</em>
                        {{ val }}
                    </span>
                </template>
            </div>
            <!-- 项目操作 -->
            <div class="m-operation" v-if="isLogin">
                <el-button
                    v-if="!star_id"
                    class="u-button u-star"
                    icon="el-icon-star-off"
                    plain
                    @click="star('npc', data.ID)"
                >
                    收藏数据
                </el-button>
                <el-button
                    v-else-if="isLogin"
                    class="u-button u-stared"
                    icon="el-icon-star-on"
                    plain
                    @click="cancelStar"
                >
                    取消收藏
                </el-button>
                <el-button
                    class="u-button u-to-dbm"
                    icon="el-icon-connection"
                    plain
                    @click="toDbm('npc', data.ID, data.Level)"
                >
                    在线构建
                </el-button>
            </div>
        </template>
    </div>
</template>
<script>
import itemMixin from "./mixin";

export default {
    name: "ItemNpc",
    mixins: [itemMixin],
};
</script>
<style lang="less">
@import "~@/assets/css/tool/database/item.less";
</style>
