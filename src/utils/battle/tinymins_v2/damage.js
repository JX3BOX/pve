import { getStatusData } from "./skill";

// 伤害统计分析
function getDamage(raw) {
    let data = raw.DAMAGE;

    // 该场战斗所有玩家的数据 {player_id:xxx}
    let exactData = data[4];

    // 遍历每一个玩家的具体情况
    let playerDamage = {};
    for (let item in exactData) {
        let _ = exactData[item]; //对应DK_REC.STAT
        playerDamage[item] = {
            total: _[2], //总有效伤害（即排除未命中的）
            dps: parseInt(_[2] / raw.TIME_DURING), //计算得出的秒伤
            overview: getStatusData(_[3]), //状态饼图次数统计、对应DK_REC_STAT.DETAIL
            skills: _[4], //技能数据、对应DK_REC_STAT.SKILL
            targets: JSON.stringify({ data: _[5] }), //目标数据（团长用于查打没打小怪）、对应DK_REC_STAT.TARGET
        };
    }

    // 团队伤害总览
    let overview = {
        total: Math.abs(data[3]), //团队总伤害
        dps: parseInt(Math.abs(data[3]) / raw.TIME_DURING), //团队秒伤
        during: raw.TIME_DURING, //战斗时长
        bossname: raw.BOSSNAME, //当前首领名称，用于跳转查看其它团队
    };

    return { overview, playerData: playerDamage };
}

export { getDamage };
