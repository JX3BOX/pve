import { getDamage } from "./damage";
import { getBeHeal, getHeal } from "./heal";
import { getAbsorb, getBeDamage, getDeathInfo } from "./tank";
import { getTeamMap } from "./teamBasicInfo";

// 传入茗伊战斗数据lua转json后版本
function buildRaidData(raw) {
    return {
        damage: getDamage(raw),
        heal: getHeal(raw),
        beHeal: getBeHeal(raw),
        beDamage: getBeDamage(raw),
        absorb: getAbsorb(raw),
        death: getDeathInfo(raw),
        teammates: getTeamMap(raw),
    }
}

export { buildRaidData }
