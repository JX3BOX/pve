// mobile 属性显示

export const mobile_attrs = {
    std: {
        "PvE": {
            "内攻": ["attack", "baseAttack", "critialPercent", "overcomePercent", "haste", "strainPercent", "surplus"],
            "外攻": ["attack", "baseAttack", "critialPercent", "overcomePercent", "haste", "strainPercent", "surplus"],
            "坦克": ["life", "physicsShieldPercent", "magicShieldPercent", "surplus", "toughnessPercent", "dodgePercent", "parryPercent"],
            "治疗": ["therapy", "critialPercent", "criticalDamagePercent", "haste", "life", "physicsShieldPercent", "magicShieldPercent"],
        },
        "PvP": {
            "内攻": ["attack", "baseAttack", "critialPercent", "overcomePercent", "haste", "toughnessPercent", "decriticalDamagePercent"],
            "外攻": ["attack", "baseAttack", "critialPercent", "overcomePercent", "haste", "toughnessPercent", "decriticalDamagePercent"],
            "坦克": ["life", "physicsShieldPercent", "magicShieldPercent", "surplus", "toughnessPercent", "dodgePercent", "parryPercent"],
            "治疗": ["therapy", "critialPercent", "criticalDamagePercent", "haste", "life", "toughnessPercent", "decriticalDamagePercent"],
        }
    },
    origin: {
        "PvE": {
            "内攻": ["hitPercent", "attack", "baseAttack", "critialPercent", "overcomePercent", "haste", "strainPercent"],
            "外攻": ["hitPercent", "attack", "baseAttack", "critialPercent", "overcomePercent", "haste", "strainPercent"],
            "坦克": ["hitPercent", "life", "physicsShieldPercent", "magicShieldPercent", "toughnessPercent", "dodgePercent", "parryPercent"],
            "治疗": ["therapy", "critialPercent", "criticalDamagePercent", "haste", "life", "physicsShieldPercent", "magicShieldPercent"],
        },
        "PvP": {
            "内攻": ["hitPercent", "attack", "critialPercent", "overcomePercent", "haste", "toughnessPercent", "decriticalDamagePercent"],
            "外攻": ["hitPercent", "attack", "critialPercent", "overcomePercent", "haste", "toughnessPercent", "decriticalDamagePercent"],
            "坦克": ["hitPercent", "life", "physicsShieldPercent", "magicShieldPercent", "toughnessPercent", "dodgePercent", "parryPercent"],
            "治疗": ["therapy", "critialPercent", "criticalDamagePercent", "haste", "life", "physicsShieldPercent", "magicShieldPercent"],
        }
    }
}
