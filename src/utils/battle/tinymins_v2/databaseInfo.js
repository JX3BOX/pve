function getDatabaseInfo(data) {

    // 直接拿到的基本信息数据
    let record = {
        type: "tinymins",
        version: data.VERSION,
        time_begin: data.TIME_BEGIN, //时间戳秒
        time_during: data.TIME_DURING > 0 ? data.TIME_DURING : data.TICK_DURING, //战斗秒数
        time_end: data.TIME_BEGIN + (data.TIME_DURING > 0 ? data.TIME_DURING : data.TICK_DURING),
        server: data.SERVER,
        map: data.MAP,

        bossname: data.BOSSNAME,
        target_type: buildTargetType(data.BOSSNAME),
    };

    return record;
}

function getUperDamage(raw, player_id) {
    let all_damage_data = raw.DAMAGE[4];
    let damage = all_damage_data[player_id][2];
    let dps = parseInt(all_damage_data[player_id][2] / raw.TIME_DURING);
    return { damage, dps };
}

import bosslist from "@/assets/data/battle/bosslist.json";
function buildTargetType(bossname) {
    if (bossname.includes("木桩")) {
        return "anchor";
    } else if (bosslist.includes(bossname)) {
        return "boss";
    } else {
        return "other";
    }
}

export default getDatabaseInfo;
