import passiveTalentOrigin from "@/assets/data/pz/passive_talent_origin_v90.json";
import { AddAttribute } from "../attr";

/**
 * 叠加奇穴被动属性
 * @param {*} attrs 属性Array
 * @param {*} mount 心法
 * @param {*} talents 激活的奇穴Array
 */
export function AddTalentAttrs(attrs, mount, talentCode) {
     //console.log(talentCode);
     //talents = [6566]; // 测试：霜风
    const mountTalents = passiveTalentOrigin[mount];

    var mountTalentSlots = {};

    if (mountTalents) {
        mountTalents.forEach(talentObj => {
            mountTalentSlots[`${talentObj.skill_id}_${talentObj.level}`] = talentObj.value;
        });

        // console.log(mountTalentSlots);

        if (mountTalentSlots && talentCode) {  // 判断有传入且对应心法存在被动属性奇穴
            talentCode.forEach(roleTalentItem => {
                const itemAttr = mountTalentSlots[`${roleTalentItem.id}_${roleTalentItem.level}`];
                if (itemAttr) {
                    //console.log(`Adding passive talent: ${roleTalentItem.name}`);
                    itemAttr.forEach(attrObj => {
                        const attrSlot = Object.keys(attrObj)[0];
                        const attrVal = Object.values(attrObj)[0];
                        AddAttribute(attrs, attrSlot, attrVal);
                    });
                }
            });

        }
    }
}
