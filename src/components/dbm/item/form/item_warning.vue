<template>
    <fold-block name="warning" desc="报警设置" icon="el-icon-bell" :fold="false">
        <el-form-item label="团队面板" v-if="hasProp('bTeamPanel')">
            <el-checkbox
                v-for="(event, i) in typeEvent[item.type]['bTeamPanel']"
                :key="'bTeamPanel' + i"
                v-model="item.payload[event]['bTeamPanel']"
            >
                {{ eventMap[event] }}
            </el-checkbox>

            <el-checkbox
                v-for="(event, i) in typeEvent[item.type]['bOnlySelfSrc']"
                :key="'bOnlySelfSrc' + i"
                v-model="item.payload[event]['bOnlySelfSrc']"
                :disabled="!item.payload[event]['bTeamPanel']"
            >
                仅来源于自己
            </el-checkbox>
        </el-form-item>
        <el-form-item label="头顶报警" v-if="hasProp('bScreenHead')">
            <span slot="label">
                <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content" class="u-tips">
                        BUFF和DEBUFF头顶作用于获得气劲的目标，NPC为监控的NPC；<br />
                        技能是释放技能的那个目标，而非技能作用的目标。
                    </div>
                    <div>头顶报警 <i class="el-icon-info"></i></div>
                </el-tooltip>
            </span>

            <el-checkbox
                v-for="(event, i) in typeEvent[item.type]['bScreenHead']"
                :key="i"
                v-model="item.payload[event]['bScreenHead']"
            >
                {{ eventMap[event] }}
            </el-checkbox>
        </el-form-item>

        <el-form-item label="中央报警" v-if="hasProp('bCenterAlarm')">
            <el-checkbox
                v-for="(event, i) in typeEvent[item.type]['bCenterAlarm']"
                :key="i"
                v-model="item.payload[event]['bCenterAlarm']"
                >{{ eventMap[event] }}</el-checkbox
            >
        </el-form-item>

        <el-form-item label="全屏泛光" v-if="hasProp('bFullScreen')">
            <el-checkbox
                v-for="(event, i) in typeEvent[item.type]['bFullScreen']"
                :key="i"
                v-model="item.payload[event]['bFullScreen']"
                >{{ eventMap[event] }}</el-checkbox
            >
        </el-form-item>

        <el-form-item label="自身气劲列表" v-if="hasProp('bBuffList')">
            <el-checkbox
                v-for="(event, i) in typeEvent[item.type]['bBuffList']"
                :key="i"
                v-model="item.payload[event]['bBuffList']"
                >{{ eventMap[event] }}</el-checkbox
            >
        </el-form-item>
        <el-form-item label="团队气劲列表" v-if="hasProp('bPartyBuffList')">
            <el-checkbox
                v-for="(event, i) in typeEvent[item.type]['bPartyBuffList']"
                :key="i"
                v-model="item.payload[event]['bPartyBuffList']"
                >{{ eventMap[event] }}</el-checkbox
            >
        </el-form-item>

        <el-form-item label="团队通知" v-if="hasProp('bTeamChannel')">
            <el-checkbox
                v-for="(event, i) in typeEvent[item.type]['bTeamChannel']"
                :key="i"
                v-model="item.payload[event]['bTeamChannel']"
                >{{ eventMap[event] }}</el-checkbox
            >
        </el-form-item>
        <el-form-item label="密聊通知" v-if="hasProp('bWhisperChannel')">
            <el-checkbox
                v-for="(event, i) in typeEvent[item.type]['bWhisperChannel']"
                :key="i"
                v-model="item.payload[event]['bWhisperChannel']"
                >{{ eventMap[event] }}</el-checkbox
            >
        </el-form-item>
        <!-- 语音报警 -->
        <el-form-item label="语音报警" v-if="hasProp('szVoice')" class="u-voice">
            <div v-for="(event, i) in typeEvent[item.type]['szVoice']" :key="i">
                <div class="u-voice-title" v-if="typeEvent[item.type]['szVoice']['length'] > 1">
                    <i class="el-icon-price-tag"></i>
                    {{ eventMap[event] }}
                </div>
                <div class="u-voice-settings">
                    <el-cascader
                        :props="{ emitPath: false }"
                        size="mini"
                        v-model="item.payload[event]['szVoice']"
                        :clearable="true"
                        :filterable="true"
                        :options="slugs"
                        :show-all-levels="false"
                    ></el-cascader>
                    <el-switch
                        size="mini"
                        v-model="item.payload[event]['bVoiceSelfOnly']"
                        :inactive-value="false"
                        :active-value="true"
                        active-text="仅在自身气劲下播放"
                    >
                    </el-switch>
                    <el-input size="mini" v-model="item.payload[event]['szVoice']" :clearable="true"></el-input>
                </div>
            </div>
        </el-form-item>
        <el-form-item v-if="hasProp('tMark')">
            <span slot="label">
                <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content" class="u-tips" v-html="tMarkLabel"></div>
                    <div>设置标记 <i class="el-icon-info"></i></div>
                </el-tooltip>
            </span>
            <div v-for="(event, i) in typeEvent[item.type]['tMark']" :key="i">
                <div class="u-mark-groupname" v-if="typeEvent[item.type]['tMark']['length'] > 1">
                    <i class="el-icon-price-tag"></i>
                    {{ eventMap[event] }}
                </div>
                <div class="u-mark-group">
                    <el-checkbox v-for="(markname, j) in tmarks" :key="j" v-model="item.payload[event]['tMark'][j]">
                        <img :src="getImage('tMark', j)" :alt="markname" :title="markname" />
                    </el-checkbox>
                </div>
            </div>
        </el-form-item>
        <el-form-item label="添加焦点" v-if="hasProp('aFocus')" class="u-focus">
            <span slot="label">
                <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content" class="u-tips">
                        仅开启茗伊焦点列表并设置关联方可生效
                        <br />
                        高级设置不设置时则只要出现则添加焦点
                    </div>
                    <div>添加焦点 <i class="el-icon-info"></i></div>
                </el-tooltip>
            </span>

            <el-switch v-model="item.defaultPropsStatus.aFocus" active-color="#13ce66"> </el-switch>
            <item-focus v-model="item.payload.aFocus" v-if="item.defaultPropsStatus.aFocus"></item-focus>
        </el-form-item>
        <el-form-item label="报警颜色" prop="col">
            <span slot="label">
                <el-tooltip class="item" effect="dark" placement="top" content="11">
                    <div slot="content" class="u-tips">
                        包括：团队面板BUFF/DEBUFF描边颜色、自身气劲列表、头顶报警
                        <br />
                        其优先级较低，自身气劲列表颜色仅此处设置生效
                    </div>
                    <div>报警颜色 <i class="el-icon-info"></i></div>
                </el-tooltip>
            </span>
            <el-color-picker v-model="item.payload.col" color-format="rgb"></el-color-picker>
        </el-form-item>
    </fold-block>
</template>
<script>
import FoldBlock from "@/components/dbm/common/fold_block.vue";
import types from "@/assets/data/dbm/types.json";
import { mapState } from "vuex";
import { itemHasProp } from "@/utils/dbm/item";
import { getImage } from "@/utils/dbm/common";
import typeEvent from "@/assets/data/dbm/type_event.json";
import tmarks from "@/assets/data/dbm/team_marks.json";

import ItemFocus from "@/components/dbm/item/form/item_focus.vue";

export default {
    name: "",
    components: { FoldBlock, ItemFocus },
    data: () => ({
        tmarks,
        types,
        typeEvent,
        eventMap: types.events,
    }),
    computed: {
        ...mapState(["item", "client", "slugs"]),
        type() {
            return this.item.type;
        },
        tMarkLabel() {
            if (this.type == "BUFF" || this.type == "DEBUFF")
                return "可用于当获得气劲时，给获得气劲的玩家设置一个标记。<br/> 例如开启了白云和扇子两个标记，则第一个使用白云标记，第二个使用扇子标记。<br/> 当获得气劲玩家的数目超过标记数时，后续的玩家将不会再获得标记。";
            if (this.type == "CASTING") return "给释放技能的目标设置标记，而不是技能的目标。";
            if (this.type == "NPC") return "在相同触发条件下，只给第一个NPC。";
            return "";
        },
    },
    methods: {
        getImage,
        // 根据type控制字段显隐
        hasProp(prop) {
            return itemHasProp(this.item.type, prop);
        },
    },
};
</script>
<style lang="less" scoped></style>
