import { getStatusData } from "./skill";

// 治疗统计分析
function getHeal(raw) {
    let data = raw.HEAL;
    let exactData = data[4];

    // 遍历每一个玩家的具体情况
    let playerHeal = {};
    for (let item in exactData) {
        let _ = exactData[item]; //对应DK_REC.STAT
        playerHeal[item] = {
            total: _[2], //总有效伤害（即排除未命中的）
            dps: parseInt(_[2] / raw.TIME_DURING), //计算得出的秒伤
            overview: getStatusData(_[3]), //状态饼图次数统计、对应DK_REC_STAT.DETAIL
            skills: _[4], //技能数据、对应DK_REC_STAT.SKILL
            targets: JSON.stringify({ data: _[5] }), //目标数据（团长用于查打没打小怪）、对应DK_REC_STAT.TARGET
        };
    }

    for (const i in playerHeal) {
        if (playerHeal[i].total == 0) {
            delete playerHeal[i];
        }
    }

    // 团队治疗
    let overview = {
        total: data[3], //团队总伤害
        dps: parseInt(data[3] / raw.TIME_DURING), //团队秒伤
        during: raw.TIME_DURING, //战斗时长
        bossname: raw.BOSSNAME, //当前首领名称，用于跳转查看其它团队
    };

    return { overview, playerData: playerHeal };
}

function getBeHeal(raw) {
    let data = raw.BE_HEAL;

    // 该场战斗所有玩家的数据 {player_id:xxx}
    let exactData = data[4];

    // 遍历每一个玩家的具体情况
    let playerBeheal = {};
    for (let item in exactData) {
        let _ = exactData[item]; //对应DK_REC.STAT
        playerBeheal[item] = {
            total: _[2], //总有效伤害（即排除未命中的）
            dps: parseInt(_[2] / raw.TIME_DURING), //计算得出的秒伤
            overview: getStatusData(_[3]), //状态饼图次数统计、对应DK_REC_STAT.DETAIL
            skills: _[4], //技能数据、对应DK_REC_STAT.SKILL
            targets: JSON.stringify({ data: _[5] }), //目标数据（团长用于查打没打小怪）、对应DK_REC_STAT.TARGET
        };
    }

    // 团队伤害总览
    let overview = {
        total: data[3], //团队总伤害
        dps: parseInt(data[3] / raw.TIME_DURING), //团队秒伤
        during: raw.TIME_DURING, //战斗时长
        bossname: raw.BOSSNAME, //当前首领名称，用于跳转查看其它团队
    };

    return { overview, playerData: playerBeheal };
}

export { getHeal, getBeHeal };
