/* 
tinymins的逻辑是raw -> JSON -(根据struct.json)-> DATA
为了减少工作量，这里直接把jx3dat的四个文件合并后的结果，转换为DATA，后续的逻辑就可以不变化
*/
import { getResource } from "@/service/battle/resource.js"
import { DK_REC_STAT, DK_REC_STAT_DETAIL, DK_REC_STAT_SKILL, SKILL_RESULT, defaultDetail } from "@/assets/data/battle/my_enum.js";
import { cloneDeep } from "lodash";
import store from "@/pages/battle/store.js"

const typeMap = {
    0: 'DAMAGE',
    1: 'HEAL',
    2: 'BE_DAMAGE',
    3: 'BE_HEAL',
}

export async function jx3dat2DATA(raw) {
    let result = {
        AWAYTIME: {},
        ABSORB: {},
        DAMAGE: {},
        HEAL: {},
        BE_DAMAGE: {},
        BE_HEAL: {},
        EVERYTHING: {},
        MAP: -1,
        SERVER: "未知",
        NAME_LIST: {},
        FORCE_LIST: {},
        EFFECT_LIST: {},
        PLAYER_LIST: {},
        TIME_BEGIN: Math.round(Date.now() / 1000),
        TIME_DURING: 0,
        TICK_BEGIN: 0,
        TICK_DURING: 0,
        UUID: 'undefined',
        BOSSNAME: '未知',
        VERSION: '-1',
    };
    let tmp_skills = new Set();
    // get general data
    for (let i in raw) {
        let data = raw[i];
        // build NAME_LIST FORCE_LIST EFFECT_LIST
        for (let id in data['tSkills']) {
            // NAME_LIST
            if (!result.NAME_LIST[id])
                result.NAME_LIST[id] = data['tSkills'][id]['tInfo']?.szName;
            // FORCE_LIST 
            if (!result.FORCE_LIST[id])
                result.FORCE_LIST[id] = data['tSkills'][id]['tInfo']?.dwForceID ?? 0;
            // EFFECT_LIST
            let skills = data['tSkills'][id]?.tSkill;
            if (!skills) continue;
            for (let skillIndex in skills) {
                let skill = skills[skillIndex];
                tmp_skills.add(skill.dwID);
            }
            // get DURING TIME
            for (let entityIndex in data['tDamage']) {
                let entity = data['tDamage'][entityIndex];
                if (entity.nValuePer != 0) {
                    let time = Math.round(entity.nValue / entity.nValuePer);
                    result.TIME_DURING = Math.max(result.TIME_DURING, time);
                    result.TICK_DURING = Math.max(result.TICK_DURING, time * 16);
                }
            }
        }
    }
    const client = store.state.client;
    let skills = (await getSkill([...tmp_skills], client)).data
    skills = skills.map(item => {
        let cacheKey = `skill_${item.SkillID}_0`
        sessionStorage.setItem(cacheKey, JSON.stringify({
            icon: item.IconID,
            level: 0,
            name: item.Name,
            _name: item.SkillName
        }));
        return {
            1: item.Name || `#${item.SkillID},${item.Level || 0}`,
            2: false,
            3: 1,
            4: item.SkillID,
            5: item.Level || 0,
        }
    })
    result.EFFECT_LIST = skills.reduce((prev, next) => {
        let key = `1,${next[4]},0`;
        prev[key] = next;
        return prev;
    }, {});
    // build DAMAGE/HEAL/BE_DAMAGE/BE_HEAL in DATA
    for (let i in raw) {
        let data = raw[i];
        let dataObj = result[typeMap[i]];
        dataObj[1] = result.TIME_DURING;  // 持续时间
        // 计算总输出
        let totalDamage = 0;
        let entitySTAT = {};
        for (let entityIndex in data['tDamage']) {
            let entity = data['tDamage'][entityIndex];
            let entityID = entity.dwID;
            totalDamage += entity.nValue;
            let _detail = data['tSkills'][entityID]?.tSkill || {};
            let DETAIL = {}
            let SKILL = {}
            for (let skillIndex in _detail) {
                let skill = _detail[skillIndex];
                // ======== DETAIL 统计
                // 应该漏了一下有点对应不上（x
                // 击中 0 
                if (skill['dwHit']) {
                    if (!DETAIL[SKILL_RESULT.HIT]) DETAIL[SKILL_RESULT.HIT] = cloneDeep(defaultDetail);
                    let subDetail = DETAIL[SKILL_RESULT.HIT];
                    subDetail[DK_REC_STAT_DETAIL.COUNT] += skill.dwHit;
                    subDetail[DK_REC_STAT_DETAIL.NZ_COUNT] += skill.dwHit;
                    subDetail[DK_REC_STAT_DETAIL.MAX] = Math.max(subDetail[DK_REC_STAT_DETAIL.MAX], skill.nMaxDamage);
                    subDetail[DK_REC_STAT_DETAIL.MAX_EFFECT] = Math.max(subDetail[DK_REC_STAT_DETAIL.MAX_EFFECT], skill.nMaxDamage);
                    subDetail[DK_REC_STAT_DETAIL.MIN] = Math.min(subDetail[DK_REC_STAT_DETAIL.MIN], skill.nMinDamage);
                    subDetail[DK_REC_STAT_DETAIL.MIN_EFFECT] = Math.min(subDetail[DK_REC_STAT_DETAIL.MIN_EFFECT], skill.nMinDamage);
                    subDetail[DK_REC_STAT_DETAIL.NZ_MIN] = Math.min(subDetail[DK_REC_STAT_DETAIL.NZ_MIN], skill.nMinDamage);
                    subDetail[DK_REC_STAT_DETAIL.NZ_MIN_EFFECT] = Math.min(subDetail[DK_REC_STAT_DETAIL.NZ_MIN_EFFECT], skill.nMinDamage);
                    subDetail[DK_REC_STAT_DETAIL.TOTAL] += skill.nTotalDamage;
                    subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] += skill.nTotalDamage;
                    subDetail[DK_REC_STAT_DETAIL.AVG] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL] / subDetail[DK_REC_STAT_DETAIL.COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.NZ_AVG] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL] / subDetail[DK_REC_STAT_DETAIL.NZ_COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.AVG_EFFECT] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] / subDetail[DK_REC_STAT_DETAIL.COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.NZ_AVG_EFFECT] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] / subDetail[DK_REC_STAT_DETAIL.NZ_COUNT]);
                }
                // 被格挡 1
                if (skill['dwParry']) {
                    if (!DETAIL[SKILL_RESULT.BLOCK]) DETAIL[SKILL_RESULT.BLOCK] = cloneDeep(defaultDetail);
                    let subDetail = DETAIL[SKILL_RESULT.BLOCK];
                    subDetail[DK_REC_STAT_DETAIL.COUNT] += skill.dwParry;
                    subDetail[DK_REC_STAT_DETAIL.NZ_COUNT] += skill.dwParry;
                }
                // 免疫 2
                if (skill['dwShield']) {
                    if (!DETAIL[SKILL_RESULT.SHIELD]) DETAIL[SKILL_RESULT.SHIELD] = cloneDeep(defaultDetail);
                    let subDetail = DETAIL[SKILL_RESULT.SHIELD];
                    subDetail[DK_REC_STAT_DETAIL.COUNT] += skill.dwShield;
                    subDetail[DK_REC_STAT_DETAIL.NZ_COUNT] += skill.dwShield;
                }
                // 被闪避 4
                if (skill['dwDodge']) {
                    if (!DETAIL[SKILL_RESULT.DODGE]) DETAIL[SKILL_RESULT.DODGE] = cloneDeep(defaultDetail);
                    let subDetail = DETAIL[SKILL_RESULT.DODGE];
                    subDetail[DK_REC_STAT_DETAIL.COUNT] += skill.dwDodge;
                    subDetail[DK_REC_STAT_DETAIL.NZ_COUNT] += skill.dwDodge;
                }
                // 会心 5
                if (skill['dwCriticalStrike']) {
                    if (!DETAIL[SKILL_RESULT.CRITICAL]) DETAIL[SKILL_RESULT.CRITICAL] = cloneDeep(defaultDetail);
                    let subDetail = DETAIL[SKILL_RESULT.CRITICAL];
                    subDetail[DK_REC_STAT_DETAIL.COUNT] += skill.dwCriticalStrike;
                    subDetail[DK_REC_STAT_DETAIL.NZ_COUNT] += skill.dwCriticalStrike;
                    subDetail[DK_REC_STAT_DETAIL.MAX] = Math.max(subDetail[DK_REC_STAT_DETAIL.MAX], skill.nMaxCSDamage);
                    subDetail[DK_REC_STAT_DETAIL.MAX_EFFECT] = Math.max(subDetail[DK_REC_STAT_DETAIL.MAX_EFFECT], skill.nMaxCSDamage);
                    subDetail[DK_REC_STAT_DETAIL.MIN] = Math.min(subDetail[DK_REC_STAT_DETAIL.MIN], skill.nMinCSDamage);
                    subDetail[DK_REC_STAT_DETAIL.MIN_EFFECT] = Math.min(subDetail[DK_REC_STAT_DETAIL.MIN_EFFECT], skill.nMinCSDamage);
                    subDetail[DK_REC_STAT_DETAIL.NZ_MIN] = Math.min(subDetail[DK_REC_STAT_DETAIL.NZ_MIN], skill.nMinCSDamage);
                    subDetail[DK_REC_STAT_DETAIL.NZ_MIN_EFFECT] = Math.min(subDetail[DK_REC_STAT_DETAIL.NZ_MIN_EFFECT], skill.nMinCSDamage);
                    subDetail[DK_REC_STAT_DETAIL.TOTAL] += skill.nTotalCSDamage;
                    subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] += skill.nTotalCSDamage;
                    subDetail[DK_REC_STAT_DETAIL.AVG] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL] / subDetail[DK_REC_STAT_DETAIL.COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.NZ_AVG] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL] / subDetail[DK_REC_STAT_DETAIL.NZ_COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.AVG_EFFECT] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] / subDetail[DK_REC_STAT_DETAIL.COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.NZ_AVG_EFFECT] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] / subDetail[DK_REC_STAT_DETAIL.NZ_COUNT]);
                }
                // 识破 6
                if (skill['dwInsight']) {
                    if (!DETAIL[SKILL_RESULT.INSIGHT]) DETAIL[SKILL_RESULT.INSIGHT] = cloneDeep(defaultDetail);
                    let subDetail = DETAIL[SKILL_RESULT.INSIGHT];
                    subDetail[DK_REC_STAT_DETAIL.COUNT] += skill.dwInsight;
                    subDetail[DK_REC_STAT_DETAIL.NZ_COUNT] += skill.dwInsight;
                    subDetail[DK_REC_STAT_DETAIL.MAX] = Math.max(subDetail[DK_REC_STAT_DETAIL.MAX], skill.nMaxInsightDamage);
                    subDetail[DK_REC_STAT_DETAIL.MAX_EFFECT] = Math.max(subDetail[DK_REC_STAT_DETAIL.MAX_EFFECT], skill.nMaxInsightDamage);
                    subDetail[DK_REC_STAT_DETAIL.MIN] = Math.min(subDetail[DK_REC_STAT_DETAIL.MIN], skill.nMinInsightDamage);
                    subDetail[DK_REC_STAT_DETAIL.MIN_EFFECT] = Math.min(subDetail[DK_REC_STAT_DETAIL.MIN_EFFECT], skill.nMinInsightDamage);
                    subDetail[DK_REC_STAT_DETAIL.NZ_MIN] = Math.min(subDetail[DK_REC_STAT_DETAIL.NZ_MIN], skill.nMinInsightDamage);
                    subDetail[DK_REC_STAT_DETAIL.NZ_MIN_EFFECT] = Math.min(subDetail[DK_REC_STAT_DETAIL.NZ_MIN_EFFECT], skill.nMinInsightDamage);
                    subDetail[DK_REC_STAT_DETAIL.TOTAL] += skill.nTotalInsightDamage;
                    subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] += skill.nTotalInsightDamage;
                    subDetail[DK_REC_STAT_DETAIL.AVG] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL] / subDetail[DK_REC_STAT_DETAIL.COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.NZ_AVG] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL] / subDetail[DK_REC_STAT_DETAIL.NZ_COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.AVG_EFFECT] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] / subDetail[DK_REC_STAT_DETAIL.COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.NZ_AVG_EFFECT] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] / subDetail[DK_REC_STAT_DETAIL.NZ_COUNT]);
                }
                // ======== 单个 SKILL 统计
                let skillKey = `1,${skill.dwID},0`;
                let skillDetail = {};
                if (skill['dwHit']) {
                    if (!skillDetail[SKILL_RESULT.HIT]) skillDetail[SKILL_RESULT.HIT] = cloneDeep(defaultDetail);
                    let subDetail = skillDetail[SKILL_RESULT.HIT];
                    subDetail[DK_REC_STAT_DETAIL.COUNT] += skill.dwHit;
                    subDetail[DK_REC_STAT_DETAIL.NZ_COUNT] += skill.dwHit;
                    subDetail[DK_REC_STAT_DETAIL.MAX] = Math.max(subDetail[DK_REC_STAT_DETAIL.MAX], skill.nMaxDamage);
                    subDetail[DK_REC_STAT_DETAIL.MAX_EFFECT] = Math.max(subDetail[DK_REC_STAT_DETAIL.MAX_EFFECT], skill.nMaxDamage);
                    subDetail[DK_REC_STAT_DETAIL.MIN] = Math.min(subDetail[DK_REC_STAT_DETAIL.MIN], skill.nMinDamage);
                    subDetail[DK_REC_STAT_DETAIL.MIN_EFFECT] = Math.min(subDetail[DK_REC_STAT_DETAIL.MIN_EFFECT], skill.nMinDamage);
                    subDetail[DK_REC_STAT_DETAIL.NZ_MIN] = Math.min(subDetail[DK_REC_STAT_DETAIL.NZ_MIN], skill.nMinDamage);
                    subDetail[DK_REC_STAT_DETAIL.NZ_MIN_EFFECT] = Math.min(subDetail[DK_REC_STAT_DETAIL.NZ_MIN_EFFECT], skill.nMinDamage);
                    subDetail[DK_REC_STAT_DETAIL.TOTAL] += skill.nTotalDamage;
                    subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] += skill.nTotalDamage;
                    subDetail[DK_REC_STAT_DETAIL.AVG] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL] / subDetail[DK_REC_STAT_DETAIL.COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.NZ_AVG] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL] / subDetail[DK_REC_STAT_DETAIL.NZ_COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.AVG_EFFECT] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] / subDetail[DK_REC_STAT_DETAIL.COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.NZ_AVG_EFFECT] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] / subDetail[DK_REC_STAT_DETAIL.NZ_COUNT]);
                }
                // 被格挡 1
                if (skill['dwParry']) {
                    if (!skillDetail[SKILL_RESULT.BLOCK]) skillDetail[SKILL_RESULT.BLOCK] = cloneDeep(defaultDetail);
                    let subDetail = skillDetail[SKILL_RESULT.BLOCK];
                    subDetail[DK_REC_STAT_DETAIL.COUNT] += skill.dwParry;
                    subDetail[DK_REC_STAT_DETAIL.NZ_COUNT] += skill.dwParry;
                }
                // 免疫 2
                if (skill['dwShield']) {
                    if (!skillDetail[SKILL_RESULT.SHIELD]) skillDetail[SKILL_RESULT.SHIELD] = cloneDeep(defaultDetail);
                    let subDetail = skillDetail[SKILL_RESULT.SHIELD];
                    subDetail[DK_REC_STAT_DETAIL.COUNT] += skill.dwShield;
                    subDetail[DK_REC_STAT_DETAIL.NZ_COUNT] += skill.dwShield;
                }
                // 被闪避 4
                if (skill['dwDodge']) {
                    if (!skillDetail[SKILL_RESULT.DODGE]) skillDetail[SKILL_RESULT.DODGE] = cloneDeep(defaultDetail);
                    let subDetail = skillDetail[SKILL_RESULT.DODGE];
                    subDetail[DK_REC_STAT_DETAIL.COUNT] += skill.dwDodge;
                    subDetail[DK_REC_STAT_DETAIL.NZ_COUNT] += skill.dwDodge;
                }
                // 会心 5
                if (skill['dwCriticalStrike']) {
                    if (!skillDetail[SKILL_RESULT.CRITICAL]) skillDetail[SKILL_RESULT.CRITICAL] = cloneDeep(defaultDetail);
                    let subDetail = skillDetail[SKILL_RESULT.CRITICAL];
                    subDetail[DK_REC_STAT_DETAIL.COUNT] += skill.dwCriticalStrike;
                    subDetail[DK_REC_STAT_DETAIL.NZ_COUNT] += skill.dwCriticalStrike;
                    subDetail[DK_REC_STAT_DETAIL.MAX] = Math.max(subDetail[DK_REC_STAT_DETAIL.MAX], skill.nMaxCSDamage);
                    subDetail[DK_REC_STAT_DETAIL.MAX_EFFECT] = Math.max(subDetail[DK_REC_STAT_DETAIL.MAX_EFFECT], skill.nMaxCSDamage);
                    subDetail[DK_REC_STAT_DETAIL.MIN] = Math.min(subDetail[DK_REC_STAT_DETAIL.MIN], skill.nMinCSDamage);
                    subDetail[DK_REC_STAT_DETAIL.MIN_EFFECT] = Math.min(subDetail[DK_REC_STAT_DETAIL.MIN_EFFECT], skill.nMinCSDamage);
                    subDetail[DK_REC_STAT_DETAIL.NZ_MIN] = Math.min(subDetail[DK_REC_STAT_DETAIL.NZ_MIN], skill.nMinCSDamage);
                    subDetail[DK_REC_STAT_DETAIL.NZ_MIN_EFFECT] = Math.min(subDetail[DK_REC_STAT_DETAIL.NZ_MIN_EFFECT], skill.nMinCSDamage);
                    subDetail[DK_REC_STAT_DETAIL.TOTAL] += skill.nTotalCSDamage;
                    subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] += skill.nTotalCSDamage;
                    subDetail[DK_REC_STAT_DETAIL.AVG] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL] / subDetail[DK_REC_STAT_DETAIL.COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.NZ_AVG] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL] / subDetail[DK_REC_STAT_DETAIL.NZ_COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.AVG_EFFECT] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] / subDetail[DK_REC_STAT_DETAIL.COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.NZ_AVG_EFFECT] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] / subDetail[DK_REC_STAT_DETAIL.NZ_COUNT]);
                }
                // 识破 6
                if (skill['dwInsight']) {
                    if (!skillDetail[SKILL_RESULT.INSIGHT]) skillDetail[SKILL_RESULT.INSIGHT] = cloneDeep(defaultDetail);
                    let subDetail = skillDetail[SKILL_RESULT.INSIGHT];
                    subDetail[DK_REC_STAT_DETAIL.COUNT] += skill.dwInsight;
                    subDetail[DK_REC_STAT_DETAIL.NZ_COUNT] += skill.dwInsight;
                    subDetail[DK_REC_STAT_DETAIL.MAX] = Math.max(subDetail[DK_REC_STAT_DETAIL.MAX], skill.nMaxInsightDamage);
                    subDetail[DK_REC_STAT_DETAIL.MAX_EFFECT] = Math.max(subDetail[DK_REC_STAT_DETAIL.MAX_EFFECT], skill.nMaxInsightDamage);
                    subDetail[DK_REC_STAT_DETAIL.MIN] = Math.min(subDetail[DK_REC_STAT_DETAIL.MIN], skill.nMinInsightDamage);
                    subDetail[DK_REC_STAT_DETAIL.MIN_EFFECT] = Math.min(subDetail[DK_REC_STAT_DETAIL.MIN_EFFECT], skill.nMinInsightDamage);
                    subDetail[DK_REC_STAT_DETAIL.NZ_MIN] = Math.min(subDetail[DK_REC_STAT_DETAIL.NZ_MIN], skill.nMinInsightDamage);
                    subDetail[DK_REC_STAT_DETAIL.NZ_MIN_EFFECT] = Math.min(subDetail[DK_REC_STAT_DETAIL.NZ_MIN_EFFECT], skill.nMinInsightDamage);
                    subDetail[DK_REC_STAT_DETAIL.TOTAL] += skill.nTotalInsightDamage;
                    subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] += skill.nTotalInsightDamage;
                    subDetail[DK_REC_STAT_DETAIL.AVG] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL] / subDetail[DK_REC_STAT_DETAIL.COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.NZ_AVG] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL] / subDetail[DK_REC_STAT_DETAIL.NZ_COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.AVG_EFFECT] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] / subDetail[DK_REC_STAT_DETAIL.COUNT]);
                    subDetail[DK_REC_STAT_DETAIL.NZ_AVG_EFFECT] = Math.round(subDetail[DK_REC_STAT_DETAIL.TOTAL_EFFECT] / subDetail[DK_REC_STAT_DETAIL.NZ_COUNT]);
                }
                SKILL[skillKey] = {
                    [DK_REC_STAT_SKILL.COUNT]: skill.dwCount,
                    [DK_REC_STAT_SKILL.NZ_COUNT]: skill.dwCount,
                    [DK_REC_STAT_SKILL.MAX]: skill.nMaxCSDamage || skill.nMaxDamage,
                    [DK_REC_STAT_SKILL.MAX_EFFECT]: skill.nMaxCSDamage || skill.nMaxDamage,
                    [DK_REC_STAT_SKILL.TOTAL]: skill.nTotalCSDamage + skill.nTotalDamage + skill.nTotalInsightDamage,
                    [DK_REC_STAT_SKILL.TOTAL_EFFECT]: skill.nTotalCSDamage + skill.nTotalDamage + skill.nTotalInsightDamage,
                    [DK_REC_STAT_SKILL.AVG]: Math.round((skill.nTotalCSDamage + skill.nTotalDamage + skill.nTotalInsightDamage) / skill.dwCount),
                    [DK_REC_STAT_SKILL.NZ_AVG]: Math.round((skill.nTotalCSDamage + skill.nTotalDamage + skill.nTotalInsightDamage) / skill.dwCount),
                    [DK_REC_STAT_SKILL.AVG_EFFECT]: Math.round((skill.nTotalCSDamage + skill.nTotalDamage + skill.nTotalInsightDamage) / skill.dwCount),
                    [DK_REC_STAT_SKILL.NZ_AVG_EFFECT]: Math.round((skill.nTotalCSDamage + skill.nTotalDamage + skill.nTotalInsightDamage) / skill.dwCount),
                    [DK_REC_STAT_SKILL.DETAIL]: skillDetail,
                    [DK_REC_STAT_SKILL.TARGET]: {}
                };
            }
            entitySTAT[entityID] = {  // REC_STAT
                [DK_REC_STAT.TOTAL]: entity.nValue,
                [DK_REC_STAT.TOTAL_EFFECT]: entity.nValue,
                [DK_REC_STAT.DETAIL]: DETAIL,
                [DK_REC_STAT.SKILL]: SKILL,
                [DK_REC_STAT.TARGET]: {},
            };
        }
        dataObj[2] = dataObj[3] = totalDamage;  // 总输出
        dataObj[4] = entitySTAT;
    }
    return result;
}

async function getSkill(ids, client) {
    return await getResource({
        client,
        type: 'skill',
        ids,
        fields: ['Name', 'SkillName', 'SkillID', 'Level', 'IconID']
    })
}