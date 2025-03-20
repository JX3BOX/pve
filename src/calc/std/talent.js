import passiveTalentStd from "@/assets/data/passive_talent_std.json";
import { AddAttribute } from "../attr";

/**
 * 叠加奇穴被动属性
 * @param {*} attrs 属性Array
 * @param {*} mount 心法
 * @param {*} talents 激活的奇穴Array
 */
export function AddTalentAttrs(attrs, mount, talentCode) {
    // console.log(talentCode);
    const talents = talentCode.map(talent => talent.id)
    // talents = [6566]; // 测试：霜风
    const mountTalents = passiveTalentStd[mount];
    if(mountTalents && talents){  // 判断有传入且对应心法存在被动属性奇穴
        mountTalents.forEach(mountSkill => {
            if (talents.includes(mountSkill.skill_id)) {
                //console.log(`Adding passive talent: ${mountSkill.remark}`);
                // 奇穴的每个被动属性
                mountSkill.value.forEach(attrObj => {
                    const attrSlot = Object.keys(attrObj)[0];
                    const attrValue = Object.values(attrObj)[0];
                    AddAttribute(attrs, attrSlot, attrValue);
                });
            }
        });
    }
}