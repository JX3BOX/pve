// 近身伤害提高
const damageRangeDesc = ([base, range]) => {
    return `${base} - ${base + range}`;
};

// 攻击速度
const getSpeed = ([base, range, speed]) => {
    return (speed / 16).toFixed(1);
};

// 每秒伤害
const damagePerSecond = ([base, range, speed]) => {
    const _speed = (base + range / 2) / (speed / 16);
    return _speed % 1 === 0 ? _speed : _speed.toFixed(1);
};

//应该是装备渲染的属性描述
const extra = {
    atDivingFrameBase: (value) => value / 16 + "秒",
    atActiveThreatCoefficient: (value) => ((value / 1024) * 100).toFixed(1) + "%",
    atAddHorseSprintPowerCost: (value) => (value / 19) * 3 + "点",
    atAddSprintPowerCost: (value) => (value / 19) * 3 + "点",
    atAddHorseSprintPowerMax: (value) => value / 100 + "点",
    atAddSprintPowerMax: (value) => value / 100 + "点",
    atAddHorseSprintPowerRevive: (value) => (value / 20) * 3 + "点",
    atAddSprintPowerRevive: (value) => ((value / 20) * 3).toFixed(0) + "点",
    atAgilityBasePercentAdd: (value) => (value / 1024) * 100 + "%",
    atBeTherapyCoefficient: (value) => ((value / 1024) * 100).toFixed(0) + "%",
    atMoveSpeedPercent: (value) => ((value / 1024) * 100).toFixed(0) + "%",
    atDamageToLifeForSelf: (value) => ((value / 1024) * 100).toFixed(2) + "%",
    atStrengthBasePercentAdd: (value) => ((value / 1024) * 100).toFixed(0) + "%",
    atSpunkBasePercentAdd: (value) => ((value / 1024) * 100).toFixed(0) + "%",
    atSpiritBasePercentAdd: (value) => ((value / 1024) * 100).toFixed(0) + "%",
    atVitalityBasePercentAdd: (value) => ((value / 1024) * 100).toFixed(0) + "%",
    atAgilityBasePercentAdd: (value) => ((value / 1024) * 100).toFixed(0) + "%",
    atTherapyCoefficient: (value) => ((value / 1024) * 100).toFixed(0) + "%",
    atNeutralCriticalStrikeBaseRate: (value) => ((value / 1024) * 10).toFixed(0) + "%",
    atLunarCriticalStrikeBaseRate: (value) => ((value / 1024) * 10).toFixed(0) + "%",
    atPoisonCriticalStrikeBaseRate: (value) => ((value / 1024) * 10).toFixed(0) + "%",
    atDropDefence: (value) => value + "点",
};

const extraSecondaryAttr = (key, value) => {
    if (extra[key]) {
        return extra[key](value);
    }
    return value;
};

export { damageRangeDesc, getSpeed, damagePerSecond, extraSecondaryAttr };
