import buffmap from "@/assets/data/battle/buff.json";

// 对buff数据根据受益人进行分组
function buildBuffData(raw, onlyUper) {
    // 如果没有开启完全复盘
    if (!raw.EVERYTHING[1]) return;

    const data = raw.EVERYTHING;
    const result = {};
    const uper = Object.keys(raw.PLAYER_LIST)[0];

    // 遍历每一条记录
    for (let i in data) {
        let item = data[i];
        // 只分析buff数据(根据枚举4位代表EVERYTHING_TYPE，其中TYPE枚举下5代表BUFF_UPDATE)
        if (item[4] != 5) continue;

        // 分析全团或仅自己(6号位代表目标ID)
        if (onlyUper && item[6] != uper) continue;

        // 初始化用户数据(如果该用户记录首次被遍历到)
        let player_id = item[6];
        if (!result[player_id]) result[player_id] = {};

        // 过滤隐藏buff
        let buff_id = item[7];
        if (!buffmap[buff_id] || !~~buffmap[buff_id]["icon"]) continue;

        // 记录一个BUFF(如果该buff用户首次获取到)
        if (!result[player_id][buff_id])
            result[player_id][buff_id] = {
                info: {},
                total: 0,
                raw: [],
                format: [],
            };

        // 记录基础信息
        result[player_id][buff_id]["info"] = {
            id: ~~buff_id,
            icon: ~~buffmap[buff_id]["icon"],
            name: buffmap[buff_id]["name"],
            level: ~~item[8],
        };

        // 记录一个BUFF具体数据
        result[player_id][buff_id]["raw"].push({
            stack_num: ~~item[11], //层数
            status: !item[10], //记录获取或消失
            timestamp: item[2], //记录时间戳（秒）
        });
    }

    const start_timestamp = raw.TIME_BEGIN;
    const end_timestamp = raw.TIME_BEGIN + raw.TIME_DURING;
    // 格式化buff为时间段
    for (let player_id in result) {
        // 遍历玩家buff
        let player_buffs = result[player_id];
        for (let buff_id in player_buffs) {
            let buff_data = player_buffs[buff_id];

            // 对一个buff格式化
            let len = buff_data.raw.length;

            // A.如果buff的第一次情况是消失，需要补全头
            if (!buff_data.raw[0]["status"]) {
                buff_data.raw.unshift({
                    timestamp: start_timestamp,
                    status: true,
                });
            }

            // B.如果buff的最后一次是获取，没有得到消失，则要补全尾
            if (buff_data.raw[len - 1]["status"]) {
                buff_data.raw.push({
                    timestamp: end_timestamp,
                    status: false,
                });
            }

            // C.正常遍历格式化所有记录形成二维数组
            // 但同时存在多层层数的buff会出现buff消失
            let flag = null;
            let ts = 0;
            let index = -1;
            for (let record of buff_data.raw) {
                // 如果是刷新buff层数跳过
                if (record.status == flag) continue;
                flag = record.status;

                index++;
                // 如果是开始节点、偶数节点
                if (flag) {
                    buff_data.format[index] = [];
                    buff_data.format[index][0] = record.timestamp;
                    ts = record.timestamp;
                    // 如果是结束节点、奇数节点
                } else {
                    buff_data.format[index - 1][1] = record.timestamp;
                    buff_data.total += record.timestamp - ts;
                }
            }
        }
    }

    return result;
}

export { buildBuffData };
