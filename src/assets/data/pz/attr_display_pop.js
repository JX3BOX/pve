const attack = [
    "PhysicsAttackPowerBase,PhysicsAttackPower",
    "SolarAttackPowerBase,SolarAttackPower",
    "NeutralAttackPowerBase,NeutralAttackPower",
    "LunarAttackPowerBase,LunarAttackPower",
    "PoisonAttackPowerBase,PoisonAttackPower",
];

const critical = [
    "PhysicsCriticalStrike,PhysicsCriticalStrikeRate",
    "SolarCriticalStrike,SolarCriticalStrikeRate",
    "NeutralCriticalStrike,NeutralCriticalStrikeRate",
    "LunarCriticalStrike,LunarCriticalStrikeRate",
    "PoisonCriticalStrike,PoisonCriticalStrikeRate",
];

const criticalDamage = [
    "PhysicsCriticalDamagePower,PhysicsCriticalDamagePowerPercent",
    "SolarCriticalDamagePower,SolarCriticalDamagePowerPercent",
    "NeutralCriticalDamagePower,NeutralCriticalDamagePowerPercent",
    "LunarCriticalDamagePower,LunarCriticalDamagePowerPercent",
    "PoisonCriticalDamagePower,PoisonCriticalDamagePowerPercent",
];

const overcome = [
    "PhysicsOvercomeBase,PhysicsOvercome,PhysicsOvercomePercent",
    "SolarOvercomeBase,SolarOvercome,SolarOvercomePercent",
    "NeutralOvercomeBase,NeutralOvercome,NeutralOvercomePercent",
    "LunarOvercomeBase,LunarOvercome,LunarOvercomePercent",
    "PoisonOvercomeBase,PoisonOvercome,PoisonOvercomePercent",
];
const shield = [
    "SolarShieldBase,SolarShield,SolarShieldPercent",
    "NeutralShieldBase,NeutralShield,NeutralShieldPercent",
    "LunarShieldBase,LunarShield,LunarShieldPercent",
    "PoisonShieldBase,PoisonShield,PoisonShieldPercent",
];

const simpleAttr = {
    PhysicsAttackPower: attack,
    SolarAttackPower: attack,
    NeutralAttackPower: attack,
    LunarAttackPower: attack,
    PoisonAttackPower: attack,
    PhysicsCriticalStrikeRate: critical,
    SolarCriticalStrikeRate: critical,
    NeutralCriticalStrikeRate: critical,
    LunarCriticalStrikeRate: critical,
    PoisonCriticalStrikeRate: critical,
    PhysicsCriticalDamagePowerPercent: criticalDamage,
    SolarCriticalDamagePowerPercent: criticalDamage,
    NeutralCriticalDamagePowerPercent: criticalDamage,
    LunarCriticalDamagePowerPercent: criticalDamage,
    PoisonCriticalDamagePower: criticalDamage,
    PhysicsOvercomePercent: overcome,
    SolarOvercomePercent: overcome,
    NeutralOvercomePercent: overcome,
    LunarOvercomePercent: overcome,
    PoisonOvercomePercent: overcome,
    HastePercent: ["Haste,BaseHastePercent","HastePercent,HasteForAttackPercent","FinelChannelTimePercent"],
    StrainPercent: ["Strain,StrainPercent"],
    SolarShieldPercent: shield,
    NeutralShieldPercent: shield,
    LunarShieldPercent: shield,
    PoisonShieldPercent: shield,
    TherapyPower: ["TherapyPowerBase"],
    DecriticalDamagePercent: ["DecriticalDamage"],
    ToughnessDefCriticalPercent: ["Toughness,ToughnessDefCriticalPercent,ToughnessDecirDamagePercent"],
    SolarShieldPercent: shield,
    NeutralShieldPercent: shield,
    LunarShieldPercent: shield,
    PoisonShieldPercent: shield,
    PhysicsShieldPercent: ["PhysicsShieldBase,PhysicsShield,PhysicsShieldPercent"],
    ParryPercent: ["Parry"],
    DodgePercent: ["Dodge"],
    PhysicsHitPercent: ["PhysicsHit,PhysicsHitPercent"],
    SolarHitPercent: ["SolarHit,SolarHitPercent"],
    NeutralHitPercent: ["NeutralHit,NeutralHitPercent"],
    LunarHitPercent: ["LunarHit,LunarHitPercent"],
    PoisonHitPercent: ["PoisonHit,PoisonHitPercent"],
    PVXAllRound: ["PVXAllRoundtoSurplusValue","PVXAllRoundtoStrain","PVXAllRoundtoDecriticalDamage"],
};

export default simpleAttr;
