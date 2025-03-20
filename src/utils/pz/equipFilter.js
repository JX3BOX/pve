import mount_equip from "@jx3box/jx3box-data/data/xf/mount_equip.json";

/**
 * 重制装备筛选返回属性参数a
 * @param {*} param0
 */
const stdFilterParams = ({ hasCommon = true, hasSimplify = true, hasPrecious = true, onlySchool = true, mount, weaponType }) => {
    let BelongSchool = new Set();
    let MagicKind = new Set();

    let _params = {};

    // 当装备为武器时
    if (weaponType) {
        // 主武器
        if (weaponType === "PRIMARY_WEAPON") {
            _params.DetailType = mount_equip[mount]["primary_weapon_type"];
        } else if (weaponType === "TERTIARY_WEAPON") {
            _params.DetailType = mount_equip[mount]["tertiary_weapon_type"];
        }

        return _params
    }

    // 职能
    const duty = mount_equip[mount]["duty"];
    // 门派
    const schoolName = mount_equip[mount]["school_name"];
    // 共享门派
    const share = mount_equip[mount]["share_school"];
    // 主要属性
    const primaryAttr = mount_equip[mount]["primary_attribute"];
    // 勾选通用
    if (hasCommon) {
        BelongSchool.add("通用");
        // 心法主属性
        MagicKind.add(primaryAttr);
    }
    // 勾选精简
    if (hasSimplify) {
        BelongSchool.add("精简");
        // 心法职能
        MagicKind.add(duty);
    }
    if (hasPrecious) {
        if (onlySchool) {
            BelongSchool.add(schoolName);
            MagicKind.add(duty);
        } else {
            BelongSchool.add(schoolName);

            share.forEach((s) => {
                BelongSchool.add(s);
            });

            MagicKind.add(duty);
        }
    }

    _params = {
        BelongSchool: [...BelongSchool].join(","),
        MagicKind: [...MagicKind].join(","),
    };

    return _params;
};

/**
 * 缘起装备筛选返回属性参数
 * @param {*} param0
 */
const originFilterParams = ({ hasCommon = true, hasSimplify = true, hasPrecious = true, onlySchool = true, mount, weaponType }) => {
    const BelongSchool = new Set();
    const MagicKind = new Set();

    let _params = {};

    // 当装备为武器时
    if (weaponType) {
        // 主武器
        if (weaponType === "PRIMARY_WEAPON") {
            _params.DetailType = mount_equip[mount]["primary_weapon_type"];
        } else if (weaponType === "TERTIARY_WEAPON") {
            _params.DetailType = mount_equip[mount]["tertiary_weapon_type"];
        }

        return _params
    }

    // 职责
    const duty = mount_equip[mount]["duty"];
    // 门派
    const schoolName = mount_equip[mount]["school_name"];
    // 共享门派
    const share = mount_equip[mount]["share_school"];
    // 主要属性
    const primaryAttr = mount_equip[mount]["primary_attribute"];

    if (hasCommon) {
        BelongSchool.add("通用");
        // MagicKind.add(primaryAttr);
    }

    if (hasSimplify) {
        BelongSchool.add("精简");
        MagicKind.add(duty);
    }

    if (hasPrecious) {
        if (onlySchool) {
            BelongSchool.add(schoolName);
            MagicKind.add(duty);
            MagicKind.add(primaryAttr);
        } else {
            BelongSchool.add(schoolName);

            share.forEach((s) => {
                BelongSchool.add(s);
            });

            MagicKind.add(duty);
        }
    }

    _params = {
        BelongSchool: [...BelongSchool].join(","),
        MagicKind: [...MagicKind].join(","),
    };

    return _params;
};

/**
 * 判断装备是否为特效武器
 * @param {Object} equip
 * @returns {Boolean}
 */
const hasEffect = (equip) => {
    if (!equip) return false;
    // 使用特效
    if (!!~~equip.SkillID) return true;
    // 被动特效
    if (
        equip._AttrType?.includes("atSetEquipmentRecipe") ||
        equip._AttrType?.includes("atSkillEventHandler")
    )
        return true;
    // 无特殊效果
    return false;
}

export { stdFilterParams, originFilterParams, hasEffect };
