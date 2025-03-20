import { hasEffect } from "./equipFilter";

/**
 * 自动添加tag
 * @param {Object} snapshot 装备快照
 * @returns {Array<String>} 标签
 */
const autoTag = (snapshot) => {

    const _snapshotValue = Object.values(snapshot)?.map(item => item.equip);

    let tag = new Set();

    for (const item of _snapshotValue) {
        if (item) {
            const attrs = item?._Attrs || []
            // 装备内含有化劲属性即为PvP类型
            if (attrs.includes('Decritical')) {
                tag.add('PvP')
            }
            // 装备内含有无双属性即为PvE类型
            if (attrs.includes('Strain')) {
                tag.add('PvE')
            }
            // 是否包含特效
            if (hasEffect(item)) {
                tag.add('特效')
            }
            // 精简
            if (item?.BelongSchool === "精简") {
                tag.add('精简')
            }
        }
    }

    let _tag = Array.from(tag)

    const PRIMARY_WEAPON = snapshot['PRIMARY_WEAPON']['equip']
    const TERTIARY_WEAPON = snapshot?.['TERTIARY_WEAPON']?.['equip'] || ''

    // 橙武判断
    if (PRIMARY_WEAPON['Quality'] === '5') {
        _tag.push('橙武')
    }

    // 大橙武
    if (['帮会绑定', '活动', '任务'].includes(PRIMARY_WEAPON['GetType']) || (TERTIARY_WEAPON && ['帮会绑定', '活动', '任务'].includes(TERTIARY_WEAPON['GetType']))) {
        _tag.push('大橙武')
    }

    // 小橙武
    if (['神兵试炼'].includes(PRIMARY_WEAPON['GetType']) || (TERTIARY_WEAPON && ['神兵试炼'].includes(TERTIARY_WEAPON['GetType']))) {
        _tag.push('小橙武')
    }

    // 如果不包含精简和特效则新增[平民]tag
    if (!_tag.includes('精简') && !_tag.includes('特效') && !_tag.includes('橙武')) {
        _tag.push('平民')
    }

    return _tag
}

export default autoTag
