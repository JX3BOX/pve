import { AddAndMultiply, AddAndMultiplyByKilo, AddAttribute, GetAttr, GetAttributeConvert } from "../attr";
import {levelConst} from './levelConst.js';

export function GetPanel(attrs) {
    // console.log(attrs);
    let panelAttrs = {};
    let finalAttrs = {};
    CalcVitality(attrs, panelAttrs, finalAttrs);
    CalcAgility(attrs, panelAttrs, finalAttrs);
    CalcSpirit(attrs, panelAttrs, finalAttrs);
    CalcSpunk(attrs, panelAttrs, finalAttrs);
    CalcStrength(attrs, panelAttrs, finalAttrs);
    CalcAttackPower(attrs, panelAttrs, finalAttrs);
    CalcTherapyPower(attrs, panelAttrs, finalAttrs);
    CalcHit(attrs, panelAttrs, finalAttrs);
    CalcCriticalStrike(attrs, panelAttrs, finalAttrs);
    CalcCriticalDamagePower(attrs, panelAttrs, finalAttrs);
    CalcOvercome(attrs, panelAttrs, finalAttrs);
    CalcHaste(attrs, panelAttrs, finalAttrs);
    CalcStrain(attrs, panelAttrs, finalAttrs);
    CalcSurplusValue(attrs, panelAttrs, finalAttrs);
    CalcPhysicsShield(attrs, panelAttrs, finalAttrs);
    CalcMagicShield(attrs, panelAttrs, finalAttrs);
    CalcDodge(attrs, panelAttrs, finalAttrs);
    CalcParry(attrs, panelAttrs, finalAttrs);
    CalcParryValue(attrs, panelAttrs, finalAttrs);
    CalcToughness(attrs, panelAttrs, finalAttrs);
    CalcDecriticalDamage(attrs, panelAttrs, finalAttrs);
    ExportMeleeWeaponDamage(attrs, panelAttrs, finalAttrs);

    // console.log(panelAttrs);
    // console.log(finalAttrs);
    return panelAttrs
}

function CalcVitality(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->体质<---`);
    let atPanelFinalVitality = AddAndMultiply(GetAttr(attrs, "atBasePotentialAdd"), GetAttr(attrs, "atVitalityBase"), GetAttr(attrs, "atVitalityBasePercentAdd"));
    AddAttribute(panelAttrs, "Vitality", atPanelFinalVitality);
    AddAttribute(finalAttrs, "atVitality", atPanelFinalVitality);
    // console.log(`体质（面板体质 最终体质）：${atPanelFinalVitality}`)
    let atPanelVitalityAddMaxHealth = atPanelFinalVitality * 10;
    // console.log(`气血值提高：${atPanelVitalityAddMaxHealth}`)
    let atPanelMaxHealthBase = atPanelVitalityAddMaxHealth + GetAttr(attrs, "atMaxLifeBase");
    // console.log(`基础气血最大值：${atPanelMaxHealthBase}`)
    let atPanelMaxHealthFinal =
        AddAndMultiply(AddAndMultiply(atPanelMaxHealthBase, 0, GetAttr(attrs, "atMaxLifePercentAdd")), GetAttr(attrs, "atMaxLifeAdditional"), GetAttr(attrs, "atFinalMaxLifeAddPercent")) +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMaxLifeCof");
    // console.log(`最终气血最大值：${atPanelMaxHealthFinal}`)
    AddAttribute(panelAttrs, "MaxHealth", atPanelMaxHealthFinal);
}

function CalcAgility(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->身法<---`);
    let atAgility = AddAndMultiply(GetAttr(attrs, "atBasePotentialAdd"), GetAttr(attrs, "atAgilityBase"), GetAttr(attrs, "atAgilityBasePercentAdd"));
    AddAttribute(panelAttrs, "Agility", atAgility);
    AddAttribute(finalAttrs, "atAgility", atAgility);
    // console.log(`身法：${atAgility}`);
}

function CalcSpirit(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->根骨<---`);
    let atSpirit = AddAndMultiply(GetAttr(attrs, "atBasePotentialAdd"), GetAttr(attrs, "atSpiritBase"), GetAttr(attrs, "atSpiritBasePercentAdd"));
    AddAttribute(panelAttrs, "Spirit", atSpirit);
    AddAttribute(finalAttrs, "atSpirit", atSpirit);
    // console.log(`根骨：${atSpirit}`);
}

function CalcSpunk(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->元气<---`);
    let atSpunk = AddAndMultiply(GetAttr(attrs, "atBasePotentialAdd"), GetAttr(attrs, "atSpunkBase"), GetAttr(attrs, "atSpunkBasePercentAdd"));
    AddAttribute(panelAttrs, "Spunk", atSpunk);
    AddAttribute(finalAttrs, "atSpunk", atSpunk);
    // console.log(`元气：${atSpunk}`);
}

function CalcStrength(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->力道<---`);
    let atStrength = AddAndMultiply(GetAttr(attrs, "atBasePotentialAdd"), GetAttr(attrs, "atStrengthBase"), GetAttr(attrs, "atStrengthBasePercentAdd"));
    AddAttribute(panelAttrs, "Strength", atStrength);
    AddAttribute(finalAttrs, "atStrength", atStrength);
    // console.log(`力道：${atStrength}`);
}

function CalcAttackPower(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->攻击力<---`);
    // console.log(attrs)

    let atPanelPhysicsAttackPowerBase =
        GetAttr(attrs, "atPhysicsAttackPowerBase") +
        GetAttributeConvert(finalAttrs, "atStrength", attrs, "atSystemStrengthToPhysicsAttackPowerCof");
    AddAttribute(panelAttrs, "PhysicsAttackPowerBase", atPanelPhysicsAttackPowerBase)
    // console.log(`外功基础攻击：${atPanelPhysicsAttackPowerBase}`);
    const basePhysicsAPWithPercent =
        AddAndMultiply(atPanelPhysicsAttackPowerBase, 0, GetAttr(attrs, "atPhysicsAttackPowerPercent"));
    const mountAddPhysicsAPConvert =
        GetAttributeConvert(finalAttrs, "atStrength", attrs, "atStrengthToPhysicsAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atAgility", attrs, "atAgilityToPhysicsAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToPhysicsAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToPhysicsAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToPhysicsAttackPowerCof");
    let atPanelPhysicsAttackPowerFinal = basePhysicsAPWithPercent + mountAddPhysicsAPConvert
    // console.log(`外功最终攻击：${atPanelPhysicsAttackPowerFinal}`);
    AddAttribute(panelAttrs, "PhysicsAttackPower", atPanelPhysicsAttackPowerFinal);
    AddAttribute(finalAttrs, "atPhysicsAttackPower", atPanelPhysicsAttackPowerFinal);


    let atPanelLunarAttackPowerBase =
        GetAttr(attrs, "atLunarAttackPowerBase") +
        GetAttr(attrs, "atSolarAndLunarAttackPowerBase") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSystemSpunkToLunarAttackPowerCof") +
        GetAttr(attrs, "atMagicAttackPowerBase");
    AddAttribute(panelAttrs, "LunarAttackPowerBase", atPanelLunarAttackPowerBase)
    // console.log(`阴性基础攻击：${atPanelLunarAttackPowerBase}`);
    const baseLunarAPWithPercent =
        AddAndMultiply(atPanelLunarAttackPowerBase, 0, GetAttr(attrs, "atLunarAttackPowerPercent"));
    const mountAddLunarAPConvert =
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToLunarAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToSolarAndLunarAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToLunarAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToLunarAttackPowerCof");
    let atPanelLunarAttackPowerFinal = baseLunarAPWithPercent + mountAddLunarAPConvert;
    // console.log(`阴性最终攻击：${atPanelLunarAttackPowerFinal}`);
    AddAttribute(panelAttrs, "LunarAttackPower", atPanelLunarAttackPowerFinal);
    AddAttribute(finalAttrs, "atLunarAttackPower", atPanelLunarAttackPowerFinal);


    let atPanelSolarAttackPowerBase =
        GetAttr(attrs, "atSolarAttackPowerBase") +
        GetAttr(attrs, "atSolarAndLunarAttackPowerBase") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSystemSpunkToSolarAttackPowerCof") +
        GetAttr(attrs, "atMagicAttackPowerBase");
    AddAttribute(panelAttrs, "SolarAttackPowerBase", atPanelSolarAttackPowerBase)
    // console.log(`阳性基础攻击：${atPanelSolarAttackPowerBase}`);
    const baseSolarAPWithPercent =
        AddAndMultiply(atPanelSolarAttackPowerBase, 0, GetAttr(attrs, "atSolarAttackPowerPercent"));
    const mountAddSolarAPConvert =
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToSolarAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToSolarAndLunarAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToSolarAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atStrength", attrs, "atStrengthToSolarAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToSolarAttackPowerCof");
    let atPanelSolarAttackPowerFinal = baseSolarAPWithPercent + mountAddSolarAPConvert;
    // console.log(`阳性最终攻击：${atPanelSolarAttackPowerFinal}`);
    AddAttribute(panelAttrs, "SolarAttackPower", atPanelSolarAttackPowerFinal);
    AddAttribute(finalAttrs, "atSolarAttackPower", atPanelSolarAttackPowerFinal);


    let atPanelNeutralAttackPowerBase =
        GetAttr(attrs, "atNeutralAttackPowerBase") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSystemSpunkToNeutralAttackPowerCof") +
        GetAttr(attrs, "atMagicAttackPowerBase");
    AddAttribute(panelAttrs, "NeutralAttackPowerBase", atPanelNeutralAttackPowerBase)
    // console.log(`混元基础攻击：${atPanelNeutralAttackPowerBase}`);
    const baseNeutralAPWithPercent =
        AddAndMultiply(atPanelNeutralAttackPowerBase, 0, GetAttr(attrs, "atNeutralAttackPowerPercent"));
    const mountAddNeutralAPConvert =
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToNeutralAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToNeutralAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToNeutralAttackPowerCof");
    let atPanelNeutralAttackPowerFinal = baseNeutralAPWithPercent + mountAddNeutralAPConvert;
    // console.log(`混元最终攻击：${atPanelNeutralAttackPowerFinal}`);
    AddAttribute(panelAttrs, "NeutralAttackPower", atPanelNeutralAttackPowerFinal);
    AddAttribute(finalAttrs, "atNeutralAttackPower", atPanelNeutralAttackPowerFinal);


    let atPanelPoisonAttackPowerBase =
        GetAttr(attrs, "atPoisonAttackPowerBase") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSystemSpunkToPoisonAttackPowerCof") +
        GetAttr(attrs, "atMagicAttackPowerBase");
    AddAttribute(panelAttrs, "PoisonAttackPowerBase", atPanelPoisonAttackPowerBase)
    // console.log(`毒性基础攻击：${atPanelPoisonAttackPowerBase}`);
    const basePoisonAPWithPercent =
        AddAndMultiply(atPanelPoisonAttackPowerBase, 0, GetAttr(attrs, "atPoisonAttackPowerPercent"));
    const mountAddPoisonAPConvert =
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToPoisonAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToPoisonAttackPowerCof") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToPoisonAttackPowerCof");
    let atPanelPoisonAttackPowerFinal = basePoisonAPWithPercent + mountAddPoisonAPConvert;
    // console.log(`毒性最终攻击：${atPanelPoisonAttackPowerFinal}`);
    AddAttribute(panelAttrs, "PoisonAttackPower", atPanelPoisonAttackPowerFinal);
    AddAttribute(finalAttrs, "atPoisonAttackPower", atPanelPoisonAttackPowerFinal);
}

function CalcTherapyPower(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->治疗<---`);


    let atPanelTherapyPowerBase =
        GetAttr(attrs, "atTherapyPowerBase");
    AddAttribute(panelAttrs, "TherapyPowerBase", atPanelTherapyPowerBase)
    // console.log(`基础治疗：${atPanelTherapyPowerBase}`);
    const baseTherapyWithPercent =
        AddAndMultiply(atPanelTherapyPowerBase, 0, GetAttr(attrs, "atTherapyPowerPercent"));
    const mountAddTherapyConvert =
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToTherapyPowerCof") +
        GetAttributeConvert(finalAttrs, "atLunarAttackPower", attrs, "atLunarAttackPowerToTherapyPowerCof") +
        GetAttributeConvert(finalAttrs, "atNeutralAttackPower", attrs, "atNeutralAttackPowerToTherapyPowerCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToTherapyPowerCof")
    let atPanelTherapyPowerFinal = baseTherapyWithPercent + mountAddTherapyConvert;
    // console.log(`最终治疗：${atPanelTherapyPowerFinal}`);
    AddAttribute(panelAttrs, "TherapyPower", atPanelTherapyPowerFinal);
    AddAttribute(finalAttrs, "atTherapyPower", atPanelTherapyPowerFinal);
}

function CalcHit(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->命中<---`);


    let atPanelPhysicsHitValue =
        GetAttr(attrs, "atPhysicsHitValue") +
        GetAttr(attrs, "atAllTypeHitValue");
    // console.log(`外功命中等级：${atPanelPhysicsHitValue}`);
    AddAttribute(panelAttrs, "PhysicsHit", atPanelPhysicsHitValue);
    AddAttribute(finalAttrs, "atPhysicsHitValue", atPanelPhysicsHitValue);
    let atPanelPhysicsHitPercent =
        0.9 +
        atPanelPhysicsHitValue / (levelConst.fHitValueParam * levelConst.nLevelCoefficient) +
        GetAttr(attrs, "atPhysicsHitBaseRate") / 10000;
    // console.log(`外功命中百分比：${(atPanelPhysicsHitPercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "PhysicsHitPercent", atPanelPhysicsHitPercent);


    let atPanelLunarHitValue =
        GetAttr(attrs, "atLunarHitValue") +
        GetAttr(attrs, "atSolarAndLunarHitValue") +
        GetAttr(attrs, "atMagicHitValue") +
        GetAttr(attrs, "atAllTypeHitValue");
    // console.log(`阴性命中等级：${atPanelLunarHitValue}`);
    AddAttribute(panelAttrs, "LunarHit", atPanelLunarHitValue);
    AddAttribute(finalAttrs, "atLunarHitValue", atPanelLunarHitValue);
    let atPanelLunarHitPercent =
        0.9 +
        atPanelLunarHitValue / (levelConst.fHitValueParam * levelConst.nLevelCoefficient) +
        GetAttr(attrs, "atMagicHitBaseRate") / 10000 +
        GetAttr(attrs, "atLunarHitBaseRate") / 10000;
    // console.log(`阴性命中百分比：${(atPanelLunarHitPercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "LunarHitPercent", atPanelLunarHitPercent);


    let atPanelSolarHitValue =
        GetAttr(attrs, "atSolarHitValue") +
        GetAttr(attrs, "atSolarAndLunarHitValue") +
        GetAttr(attrs, "atMagicHitValue") +
        GetAttr(attrs, "atAllTypeHitValue");
    // console.log(`阳性命中等级：${atPanelSolarHitValue}`);
    AddAttribute(panelAttrs, "SolarHit", atPanelSolarHitValue);
    AddAttribute(finalAttrs, "atSolarHitValue", atPanelSolarHitValue);
    let atPanelSolarHitPercent =
        0.9 +
        atPanelSolarHitValue / (levelConst.fHitValueParam * levelConst.nLevelCoefficient) +
        GetAttr(attrs, "atMagicHitBaseRate") / 10000 +
        GetAttr(attrs, "atSolarHitBaseRate") / 10000;
    // console.log(`阳性命中百分比：${(atPanelSolarHitPercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "SolarHitPercent", atPanelSolarHitPercent);


    let atPanelNeutralHitValue =
        GetAttr(attrs, "atNeutralHitValue") +
        GetAttr(attrs, "atMagicHitValue") +
        GetAttr(attrs, "atAllTypeHitValue");
    // console.log(`混元命中等级：${atPanelNeutralHitValue}`);
    AddAttribute(panelAttrs, "NeutralHit", atPanelNeutralHitValue);
    AddAttribute(finalAttrs, "atNeutralHitValue", atPanelNeutralHitValue);
    let atPanelNeutralHitPercent =
        0.9 +
        atPanelNeutralHitValue / (levelConst.fHitValueParam * levelConst.nLevelCoefficient) +
        GetAttr(attrs, "atMagicHitBaseRate") / 10000 +
        GetAttr(attrs, "atNeutralHitBaseRate") / 10000;
    // console.log(`混元命中百分比：${(atPanelNeutralHitPercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "NeutralHitPercent", atPanelNeutralHitPercent);


    let atPanelPoisonHitValue =
        GetAttr(attrs, "atPoisonHitValue") +
        GetAttr(attrs, "atMagicHitValue") +
        GetAttr(attrs, "atAllTypeHitValue");
    // console.log(`毒性命中等级：${atPanelPoisonHitValue}`);
    AddAttribute(panelAttrs, "PoisonHit", atPanelPoisonHitValue);
    AddAttribute(finalAttrs, "atPoisonHitValue", atPanelPoisonHitValue);
    let atPanelPoisonHitPercent =
        0.9 +
        atPanelPoisonHitValue / (levelConst.fHitValueParam * levelConst.nLevelCoefficient) +
        GetAttr(attrs, "atMagicHitBaseRate") / 10000 +
        GetAttr(attrs, "atPoisonHitBaseRate") / 10000;
    // console.log(`毒性命中百分比：${(atPanelPoisonHitPercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "PoisonHitPercent", atPanelPoisonHitPercent);
}

function CalcCriticalStrike(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->会心<---`);


    let atPanelPhysicsCriticalStrike =
        GetAttr(attrs, "atPhysicsCriticalStrike") +
        GetAttr(attrs, "atAllTypeCriticalStrike") +
        GetAttributeConvert(finalAttrs, "atAgility", attrs, "atAgilityToPhysicsCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atStrength", attrs, "atStrengthToPhysicsCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToPhysicsCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToPhysicsCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atAgility", attrs, "atSystemAgilityToPhysicsCriticalStrikeCof")
    // console.log(`外功会心等级：${atPanelPhysicsCriticalStrike}`);
    AddAttribute(panelAttrs, "PhysicsCriticalStrike", atPanelPhysicsCriticalStrike);
    AddAttribute(finalAttrs, "atPhysicsCriticalStrike", atPanelPhysicsCriticalStrike);
    let atPhysicsCriticalStrikeRate = AddAndMultiply(atPanelPhysicsCriticalStrike, 0, 0);  // 修正唐门心法弩箭机关+1%面板会心，BuffID12738,12739判断，12740加属性
    let atPanelPhysicsCriticalStrikePercent = atPhysicsCriticalStrikeRate / (levelConst.fCriticalStrikeParam * levelConst.nLevelCoefficient) + GetAttr(attrs, "atPhysicsCriticalStrikeBaseRate") / 10000;
    // console.log(`外功会心百分比：${(atPanelPhysicsCriticalStrikePercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "PhysicsCriticalStrikeRate", atPanelPhysicsCriticalStrikePercent);


    let atPanelLunarCriticalStrike =
        GetAttr(attrs, "atLunarCriticalStrike") +
        GetAttr(attrs, "atAllTypeCriticalStrike") +
        GetAttr(attrs, "atMagicCriticalStrike") +
        GetAttr(attrs, "atSolarAndLunarCriticalStrike") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMagicCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToLunarCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToSolarAndLunarCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSystemSpiritToLunarCriticalStrikeCof")
    // console.log(`阴性会心等级：${atPanelLunarCriticalStrike}`);
    AddAttribute(panelAttrs, "LunarCriticalStrike", atPanelLunarCriticalStrike);
    AddAttribute(finalAttrs, "atLunarCriticalStrike", atPanelLunarCriticalStrike);
    let atPanelLunarCriticalStrikePercent = atPanelLunarCriticalStrike / (levelConst.fCriticalStrikeParam * levelConst.nLevelCoefficient) + GetAttr(attrs, "atLunarCriticalStrikeBaseRate") / 10000;
    // console.log(`阴性会心百分比：${(atPanelLunarCriticalStrikePercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "LunarCriticalStrikeRate", atPanelLunarCriticalStrikePercent);

    let atPanelSolarCriticalStrike =
        GetAttr(attrs, "atSolarCriticalStrike") +
        GetAttr(attrs, "atAllTypeCriticalStrike") +
        GetAttr(attrs, "atMagicCriticalStrike") +
        GetAttr(attrs, "atSolarAndLunarCriticalStrike") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMagicCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToSolarCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToSolarCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToSolarAndLunarCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSystemSpiritToSolarCriticalStrikeCof")
    // console.log(`阳性会心等级：${atPanelSolarCriticalStrike}`);
    AddAttribute(panelAttrs, "SolarCriticalStrike", atPanelSolarCriticalStrike);
    AddAttribute(finalAttrs, "atSolarCriticalStrike", atPanelSolarCriticalStrike);
    let atPanelSolarCriticalStrikePercent = atPanelSolarCriticalStrike / (levelConst.fCriticalStrikeParam * levelConst.nLevelCoefficient) + GetAttr(attrs, "atSolarCriticalStrikeBaseRate") / 10000;
    // console.log(`阳性会心百分比：${(atPanelSolarCriticalStrikePercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "SolarCriticalStrikeRate", atPanelSolarCriticalStrikePercent);


    let atPanelNeutralCriticalStrike =
        GetAttr(attrs, "atNeutralCriticalStrike") +
        GetAttr(attrs, "atAllTypeCriticalStrike") +
        GetAttr(attrs, "atMagicCriticalStrike") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMagicCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToNeutralCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToNeutralCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSystemSpiritToNeutralCriticalStrikeCof")
    // console.log(`混元会心等级：${atPanelNeutralCriticalStrike}`);
    AddAttribute(panelAttrs, "NeutralCriticalStrike", atPanelNeutralCriticalStrike);
    AddAttribute(finalAttrs, "atNeutralCriticalStrike", atPanelNeutralCriticalStrike);
    let atPanelNeutralCriticalStrikePercent = atPanelNeutralCriticalStrike / (levelConst.fCriticalStrikeParam * levelConst.nLevelCoefficient) + GetAttr(attrs, "atNeutralCriticalStrikeBaseRate") / 10000;
    // console.log(`混元会心百分比：${(atPanelNeutralCriticalStrikePercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "NeutralCriticalStrikeRate", atPanelNeutralCriticalStrikePercent);


    let atPanelPoisonCriticalStrike =
        GetAttr(attrs, "atPoisonCriticalStrike") +
        GetAttr(attrs, "atAllTypeCriticalStrike") +
        GetAttr(attrs, "atMagicCriticalStrike") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMagicCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToPoisonCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToPoisonCriticalStrikeCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSystemSpiritToPoisonCriticalStrikeCof");
    // console.log(`毒性会心等级：${atPanelPoisonCriticalStrike}`);
    AddAttribute(panelAttrs, "PoisonCriticalStrike", atPanelPoisonCriticalStrike);
    AddAttribute(finalAttrs, "atPoisonCriticalStrike", atPanelPoisonCriticalStrike);
    let atPanelPoisonCriticalStrikePercent = atPanelPoisonCriticalStrike / (levelConst.fCriticalStrikeParam * levelConst.nLevelCoefficient) + GetAttr(attrs, "atPoisonCriticalStrikeBaseRate") / 10000;
    // console.log(`毒性会心百分比：${(atPanelPoisonCriticalStrikePercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "PoisonCriticalStrikeRate", atPanelPoisonCriticalStrikePercent);
}

function CalcCriticalDamagePower(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->会效<---`);


    let atPanelPhysicsCriticalDamagePower =
        GetAttr(attrs, "atPhysicsCriticalDamagePowerBase") +
        GetAttr(attrs, "atAllTypeCriticalDamagePowerBase") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToPhysicsCriticalDamagePowerCof") +
        GetAttributeConvert(finalAttrs, "atAgility", attrs, "atAgilityToPhysicsCriticalDamagePowerCof") +
        GetAttributeConvert(finalAttrs, "atStrength", attrs, "atStrengthToPhysicsCriticalDamagePowerCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToPhysicsCriticalDamagePowerCof") +
        GetAttributeConvert(finalAttrs, "atAgility", attrs, "atSystemAgilityToPhysicsCriticalStrikePowerCof");
    AddAttribute(panelAttrs, "PhysicsCriticalDamagePower", atPanelPhysicsCriticalDamagePower);
    // console.log(`外功会效等级：${atPanelPhysicsCriticalDamagePower}`);
    let atPhysicsCriticalDamagePowerPercent = AddAndMultiply(atPanelPhysicsCriticalDamagePower, 0, GetAttr(attrs, "atPhysicsCriticalDamagePowerPercent"));
    let atPanelPhysicsCriticalDamagePowerPercent = (levelConst.fPlayerCriticalCof + 1) + atPhysicsCriticalDamagePowerPercent / (levelConst.fCriticalStrikePowerParam * levelConst.nLevelCoefficient) + GetAttr(attrs, "atPhysicsCriticalDamagePowerBaseKiloNumRate") / 1024;
    // console.log(`外功会效百分比：${(atPanelPhysicsCriticalDamagePowerPercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "PhysicsCriticalDamagePowerPercent", atPanelPhysicsCriticalDamagePowerPercent);
    AddAttribute(finalAttrs, "atPhysicsCriticalDamagePower", atPanelPhysicsCriticalDamagePowerPercent);


    let atPanelLunarCriticalDamagePower =
        GetAttr(attrs, "atLunarCriticalDamagePowerBase") +
        GetAttr(attrs, "atMagicCriticalDamagePowerBase") +
        GetAttr(attrs, "atAllTypeCriticalDamagePowerBase") +
        GetAttr(attrs, "atSolarAndLunarCriticalDamagePowerBase") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToLunarCriticalDamagePowerCof") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToSolarAndLunarCriticalDamagePowerCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSystemSpiritToLunarCriticalStrikePowerCof");
    AddAttribute(panelAttrs, "LunarCriticalDamagePower", atPanelLunarCriticalDamagePower);
    // console.log(`阴性会效等级：${atPanelLunarCriticalDamagePower}`);
    let atLunarCriticalDamagePowerPercent = AddAndMultiply(atPanelLunarCriticalDamagePower, 0, GetAttr(attrs, "atLunarCriticalDamagePowerPercent"));
    let atPanelLunarCriticalDamagePowerPercent =
        (levelConst.fPlayerCriticalCof + 1) +
        atLunarCriticalDamagePowerPercent / (levelConst.fCriticalStrikePowerParam * levelConst.nLevelCoefficient) +
        GetAttr(attrs, "atMagicCriticalDamagePowerBaseKiloNumRate") / 1024 +
        GetAttr(attrs, "atLunarCriticalDamagePowerBaseKiloNumRate") / 1024;
    // console.log(`阴性会效百分比：${(atPanelLunarCriticalDamagePowerPercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "LunarCriticalDamagePowerPercent", atPanelLunarCriticalDamagePowerPercent);
    AddAttribute(finalAttrs, "atLunarCriticalDamagePower", atPanelLunarCriticalDamagePowerPercent);


    let atPanelSolarCriticalDamagePower =
        GetAttr(attrs, "atSolarCriticalDamagePowerBase") +
        GetAttr(attrs, "atMagicCriticalDamagePowerBase") +
        GetAttr(attrs, "atAllTypeCriticalDamagePowerBase") +
        GetAttr(attrs, "atSolarAndLunarCriticalDamagePowerBase") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToSolarCriticalDamagePowerCof") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToSolarAndLunarCriticalDamagePowerCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSystemSpiritToSolarCriticalStrikePowerCof");
    AddAttribute(panelAttrs, "SolarCriticalDamagePower", atPanelSolarCriticalDamagePower);
    // console.log(`阳性会效等级：${atPanelSolarCriticalDamagePower}`);
    let atSolarCriticalDamagePowerPercent = AddAndMultiply(atPanelSolarCriticalDamagePower, 0, GetAttr(attrs, "atSolarCriticalDamagePowerPercent"));
    let atPanelSolarCriticalDamagePowerPercent =
        (levelConst.fPlayerCriticalCof + 1) +
        atSolarCriticalDamagePowerPercent / (levelConst.fCriticalStrikePowerParam * levelConst.nLevelCoefficient) +
        GetAttr(attrs, "atMagicCriticalDamagePowerBaseKiloNumRate") / 1024 +
        GetAttr(attrs, "atSolarCriticalDamagePowerBaseKiloNumRate") / 1024;
    // console.log(`阳性会效百分比：${(atPanelSolarCriticalDamagePowerPercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "SolarCriticalDamagePowerPercent", atPanelSolarCriticalDamagePowerPercent);
    AddAttribute(finalAttrs, "atSolarCriticalDamagePower", atPanelSolarCriticalDamagePowerPercent);


    let atPanelNeutralCriticalDamagePower =
        GetAttr(attrs, "atNeutralCriticalDamagePowerBase") +
        GetAttr(attrs, "atMagicCriticalDamagePowerBase") +
        GetAttr(attrs, "atAllTypeCriticalDamagePowerBase") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToNeutralCriticalDamagePowerCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSystemSpiritToNeutralCriticalStrikePowerCof");
    AddAttribute(panelAttrs, "NeutralCriticalDamagePower", atPanelNeutralCriticalDamagePower);
    // console.log(`混元会效等级：${atPanelNeutralCriticalDamagePower}`);
    let atNeutralCriticalDamagePowerPercent = AddAndMultiply(atPanelNeutralCriticalDamagePower, 0, GetAttr(attrs, "atNeutralCriticalDamagePowerPercent"));
    let atPanelNeutralCriticalDamagePowerPercent =
        (levelConst.fPlayerCriticalCof + 1) +
        atNeutralCriticalDamagePowerPercent / (levelConst.fCriticalStrikePowerParam * levelConst.nLevelCoefficient) +
        GetAttr(attrs, "atMagicCriticalDamagePowerBaseKiloNumRate") / 1024 +
        GetAttr(attrs, "atNeutralCriticalDamagePowerBaseKiloNumRate") / 1024;
    // console.log(`混元会效百分比：${(atPanelNeutralCriticalDamagePowerPercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "NeutralCriticalDamagePowerPercent", atPanelNeutralCriticalDamagePowerPercent);
    AddAttribute(finalAttrs, "atNeutralCriticalDamagePower", atPanelNeutralCriticalDamagePowerPercent);


    let atPanelPoisonCriticalDamagePower =
        GetAttr(attrs, "atPoisonCriticalDamagePowerBase") +
        GetAttr(attrs, "atMagicCriticalDamagePowerBase") +
        GetAttr(attrs, "atAllTypeCriticalDamagePowerBase") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToPoisonCriticalDamagePowerCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSystemSpiritToPoisonCriticalStrikePowerCof");
    AddAttribute(panelAttrs, "PoisonCriticalDamagePower", atPanelPoisonCriticalDamagePower);
    // console.log(`毒性会效等级：${atPanelPoisonCriticalDamagePower}`);
    let atPoisonCriticalDamagePowerPercent = AddAndMultiply(atPanelPoisonCriticalDamagePower, 0, GetAttr(attrs, "atPoisonCriticalDamagePowerPercent"));
    let atPanelPoisonCriticalDamagePowerPercent =
        (levelConst.fPlayerCriticalCof + 1) +
        atPoisonCriticalDamagePowerPercent / (levelConst.fCriticalStrikePowerParam * levelConst.nLevelCoefficient) +
        GetAttr(attrs, "atMagicCriticalDamagePowerBaseKiloNumRate") / 1024 +
        GetAttr(attrs, "atPoisonCriticalDamagePowerBaseKiloNumRate") / 1024;
    // console.log(`毒性会效百分比：${(atPanelPoisonCriticalDamagePowerPercent * 100).toFixed(2)}%`);
    AddAttribute(panelAttrs, "PoisonCriticalDamagePowerPercent", atPanelPoisonCriticalDamagePowerPercent);
    AddAttribute(finalAttrs, "atPoisonCriticalDamagePower", atPanelPoisonCriticalDamagePowerPercent);

}

function CalcOvercome(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->破防<---`);

    let atPanelPhysicsOvercomeBase =
        GetAttr(attrs, "atPhysicsOvercomeBase") +
        GetAttributeConvert(finalAttrs, "atStrength", attrs, "atSystemStrengthToPhysicsOvercomeCof");
    AddAttribute(panelAttrs, "PhysicsOvercomeBase", atPanelPhysicsOvercomeBase);
    let atPanelPhysicsOvercome =
        GetAttr(attrs, "atPhysicsOvercomeBase") +
        GetAttributeConvert(finalAttrs, "atStrength", attrs, "atSystemStrengthToPhysicsOvercomeCof") +
        GetAttributeConvert(finalAttrs, "atStrength", attrs, "atStrengthToPhysicsOvercomeCof") +
        GetAttributeConvert(finalAttrs, "atAgility", attrs, "atAgilityToPhysicsOvercomeCof") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToatPhysicsOverComeCof");
    atPanelPhysicsOvercome = AddAndMultiply(atPanelPhysicsOvercome, 0, GetAttr(attrs, "atPhysicsOvercomePercent"));
    AddAttribute(panelAttrs, "PhysicsOvercome", atPanelPhysicsOvercome);
    // console.log(`外功破防等级：${atPanelPhysicsOvercome}`);
    let atPanelPhysicsOvercomePercent = atPanelPhysicsOvercome / (levelConst.fOvercomeParam * levelConst.nLevelCoefficient);
    // console.log(`外功破防百分比：${(atPanelPhysicsOvercomePercent * 100).toFixed(2)}`);
    AddAttribute(panelAttrs, "PhysicsOvercomePercent", atPanelPhysicsOvercomePercent);
    AddAttribute(finalAttrs, "atPhysicsOvercomePercent", atPanelPhysicsOvercomePercent);


    let atPanelLunarOvercomeBase =
        GetAttr(attrs, "atLunarOvercomeBase") +
        GetAttr(attrs, "atSolarAndLunarOvercomeBase") +
        GetAttr(attrs, "atMagicOvercome") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSystemSpunkToLunarOvercomeCof");
    AddAttribute(panelAttrs, "LunarOvercomeBase", atPanelLunarOvercomeBase);
    let atPanelLunarOvercome =
        GetAttr(attrs, "atLunarOvercomeBase") +
        GetAttr(attrs, "atSolarAndLunarOvercomeBase") +
        GetAttr(attrs, "atMagicOvercome") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSystemSpunkToLunarOvercomeCof") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMagicOverComeCof");
    atPanelLunarOvercome = AddAndMultiply(atPanelLunarOvercome, 0, GetAttr(attrs, "atLunarOvercomePercent"));
    AddAttribute(panelAttrs, "LunarOvercome", atPanelLunarOvercome);
    // console.log(`阴性破防等级：${atPanelLunarOvercome}`);
    let atPanelLunarOvercomePercent = atPanelLunarOvercome / (levelConst.fOvercomeParam * levelConst.nLevelCoefficient);
    // console.log(`阴性破防百分比：${(atPanelLunarOvercomePercent * 100).toFixed(2)}`);
    AddAttribute(panelAttrs, "LunarOvercomePercent", atPanelLunarOvercomePercent);
    AddAttribute(finalAttrs, "atLunarOvercomePercent", atPanelLunarOvercomePercent);


    let atPanelSolarOvercomeBase =
        GetAttr(attrs, "atSolarOvercomeBase") +
        GetAttr(attrs, "atSolarAndLunarOvercomeBase") +
        GetAttr(attrs, "atMagicOvercome") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSystemSpunkToSolarOvercomeCof");
    AddAttribute(panelAttrs, "SolarOvercomeBase", atPanelSolarOvercomeBase);
    let atPanelSolarOvercome =
        GetAttr(attrs, "atSolarOvercomeBase") +
        GetAttr(attrs, "atSolarAndLunarOvercomeBase") +
        GetAttr(attrs, "atMagicOvercome") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSystemSpunkToSolarOvercomeCof") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMagicOverComeCof");
    atPanelSolarOvercome = AddAndMultiply(atPanelSolarOvercome, 0, GetAttr(attrs, "atSolarOvercomePercent"));
    AddAttribute(panelAttrs, "SolarOvercome", atPanelSolarOvercome);
    // console.log(`阳性破防等级：${atPanelSolarOvercome}`);
    let atPanelSolarOvercomePercent = atPanelSolarOvercome / (levelConst.fOvercomeParam * levelConst.nLevelCoefficient);
    // console.log(`阳性破防百分比：${(atPanelSolarOvercomePercent * 100).toFixed(2)}`);
    AddAttribute(panelAttrs, "SolarOvercomePercent", atPanelSolarOvercomePercent);
    AddAttribute(finalAttrs, "atSolarOvercomePercent", atPanelSolarOvercomePercent);


    let atPanelNeutralOvercomeBase =
        GetAttr(attrs, "atNeutralOvercomeBase") +
        GetAttr(attrs, "atMagicOvercome") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSystemSpunkToNeutralOvercomeCof")
    AddAttribute(panelAttrs, "NeutralOvercomeBase", atPanelNeutralOvercomeBase);
    let atPanelNeutralOvercome =
        GetAttr(attrs, "atNeutralOvercomeBase") +
        GetAttr(attrs, "atMagicOvercome") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSystemSpunkToNeutralOvercomeCof") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSpunkToNeutralOvercomeCof") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMagicOverComeCof");
    atPanelNeutralOvercome = AddAndMultiply(atPanelNeutralOvercome, 0, GetAttr(attrs, "atNeutralOvercomePercent"));
    AddAttribute(panelAttrs, "NeutralOvercome", atPanelNeutralOvercome);
    // console.log(`混元破防等级：${atPanelNeutralOvercome}`);
    let atPanelNeutralOvercomePercent = atPanelNeutralOvercome / (levelConst.fOvercomeParam * levelConst.nLevelCoefficient);
    // console.log(`混元破防百分比：${(atPanelNeutralOvercomePercent * 100).toFixed(2)}`);
    AddAttribute(panelAttrs, "NeutralOvercomePercent", atPanelNeutralOvercomePercent);
    AddAttribute(finalAttrs, "atNeutralOvercomePercent", atPanelNeutralOvercomePercent);


    let atPanelPoisonOvercomeBase =
        GetAttr(attrs, "atPoisonOvercomeBase") +
        GetAttr(attrs, "atMagicOvercome") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSystemSpunkToPoisonOvercomeCof");
    AddAttribute(panelAttrs, "PoisonOvercomeBase", atPanelPoisonOvercomeBase);
    let atPanelPoisonOvercome =
        GetAttr(attrs, "atPoisonOvercomeBase") +
        GetAttr(attrs, "atMagicOvercome") +
        GetAttributeConvert(finalAttrs, "atSpunk", attrs, "atSystemSpunkToPoisonOvercomeCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToPoisonOvercomeCof") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMagicOverComeCof");
    atPanelPoisonOvercome = AddAndMultiply(atPanelPoisonOvercome, 0, GetAttr(attrs, "atPoisonOvercomePercent"));
    AddAttribute(panelAttrs, "PoisonOvercome", atPanelPoisonOvercome);
    // console.log(`毒性破防等级：${atPanelPoisonOvercome}`);
    let atPanelPoisonOvercomePercent = atPanelPoisonOvercome / (levelConst.fOvercomeParam * levelConst.nLevelCoefficient);
    // console.log(`毒性破防百分比：${(atPanelPoisonOvercomePercent * 100).toFixed(2)}`);
    AddAttribute(panelAttrs, "PoisonOvercomePercent", atPanelPoisonOvercomePercent);
    AddAttribute(finalAttrs, "atPoisonOvercomePercent", atPanelPoisonOvercomePercent);
}

function CalcHaste(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->加速<---`);
    let atPanelHaste = GetAttr(attrs, "atHasteBase");
    AddAttribute(panelAttrs, "Haste", atPanelHaste);
    AddAttribute(finalAttrs, "atHaste", atPanelHaste);
    // console.log(`加速等级：${atPanelHaste}`);
    let atPanelHastePercent = Math.max(Math.floor(atPanelHaste / (levelConst.fHasteRate * levelConst.nLevelCoefficient) * 1024) / 1024, atPanelHaste / (levelConst.fHasteRate * levelConst.nLevelCoefficient)) + GetAttr(attrs, "atHasteBasePercentAdd") / 1024;
    AddAttribute(panelAttrs, "HastePercent", atPanelHastePercent);
    // console.log(`加速百分比：${atPanelHastePercent}`);

}

function CalcStrain(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->无双<---`);

    let atPanelStrain = AddAndMultiply(GetAttr(attrs, "atStrainBase"), 0, GetAttr(attrs, "atStrainPercent"));
    // console.log(`无双等级：${atPanelStrain}`);
    AddAttribute(panelAttrs, "Strain", atPanelStrain);
    let atPanelStrainPercent = atPanelStrain / (levelConst.fInsightParam * levelConst.nLevelCoefficient) + GetAttr(attrs, "atStrainRate");
    AddAttribute(panelAttrs, "StrainPercent", atPanelStrainPercent);
    AddAttribute(finalAttrs, "atStrain", atPanelStrainPercent);
    // console.log(`无双百分比：${(atPanelStrainPercent * 100).toFixed(2)}`);
}

function CalcSurplusValue(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->破招<---`);

    let atPanelSurplusValue = AddAndMultiply(GetAttr(attrs, "atSurplusValueBase"), 0, GetAttr(attrs, "atSurplusValueAddPercent"));
    // console.log(`破招等级：${atPanelSurplusValue}`);
    AddAttribute(panelAttrs, "SurplusValue", atPanelSurplusValue);
    let atPanelSurplusValuePercent = atPanelSurplusValue / (levelConst.fInsightParam * levelConst.nLevelCoefficient);
    AddAttribute(panelAttrs, "SurplusValuePercent", atPanelSurplusValuePercent);
    AddAttribute(finalAttrs, "atSurplusValue", atPanelSurplusValuePercent);
    // console.log(`破招百分比：${(atPanelSurplusValuePercent * 100).toFixed(2)}`);
}

function CalcPhysicsShield(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->外防<---`);

    let atPanelPhysicsShieldBase =
        GetAttr(attrs, "atPhysicsShieldBase");
    AddAttribute(panelAttrs, "PhysicsShieldBase", atPanelPhysicsShieldBase);
    // console.log(`基础外防等级：${atPanelPhysicsShieldBase}`);
    let atPanelPhysicsShieldFinal =
        AddAndMultiply(atPanelPhysicsShieldBase, 0, GetAttr(attrs, "atPhysicsShieldPercent")) +
        GetAttr(attrs, "atPhysicsShieldAdditional") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToPhysicsShieldCof");
    AddAttribute(panelAttrs, "PhysicsShield", atPanelPhysicsShieldFinal);
    // console.log(`最终外防等级：${atPanelPhysicsShieldFinal}`);
    let atPanelPhysicsShieldFinalPercent = atPanelPhysicsShieldFinal / (atPanelPhysicsShieldFinal + levelConst.fPhysicsShieldParam * levelConst.nLevelCoefficient);
    AddAttribute(panelAttrs, "PhysicsShieldPercent", atPanelPhysicsShieldFinalPercent);
    // console.log(`最终外防百分比：${atPanelPhysicsShieldFinalPercent}`);

}

function CalcMagicShield(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->内防<---`);


    let atPanelLunarShieldBase =
        GetAttr(attrs, "atMagicShield") +
        GetAttr(attrs, "atLunarMagicShieldBase");
    AddAttribute(panelAttrs, "LunarShieldBase", atPanelLunarShieldBase);
    // console.log(`基础阴性内防等级：${atPanelLunarShieldBase}`);
    let atPanelLunarShieldFinal =
        AddAndMultiply(atPanelLunarShieldBase, 0, GetAttr(attrs, "atLunarMagicShieldPercent")) +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMagicShieldCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToLunarMagicShieldCof");
    AddAttribute(panelAttrs, "LunarShield", atPanelLunarShieldFinal);
    // console.log(`最终阴性内防等级：${atPanelLunarShieldFinal}`);
    let atPanelLunarShieldFinalPercent = atPanelLunarShieldFinal / (atPanelLunarShieldFinal + levelConst.fMagicShieldParam * levelConst.nLevelCoefficient);
    AddAttribute(panelAttrs, "LunarShieldPercent", atPanelLunarShieldFinalPercent);
    // console.log(`最终阴性内防百分比：${atPanelLunarShieldFinalPercent}`);


    let atPanelSolarShieldBase =
        GetAttr(attrs, "atMagicShield") +
        GetAttr(attrs, "atSolarMagicShieldBase");
    AddAttribute(panelAttrs, "SolarShieldBase", atPanelSolarShieldBase);
    // console.log(`基础阳性内防等级：${atPanelSolarShieldBase}`);
    let atPanelSolarShieldFinal =
        AddAndMultiply(atPanelSolarShieldBase, 0, GetAttr(attrs, "atSolarMagicShieldPercent")) +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMagicShieldCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToSolarMagicShieldCof");
    AddAttribute(panelAttrs, "SolarShield", atPanelSolarShieldFinal);
    // console.log(`最终阳性内防等级：${atPanelSolarShieldFinal}`);
    let atPanelSolarShieldFinalPercent = atPanelSolarShieldFinal / (atPanelSolarShieldFinal + levelConst.fMagicShieldParam * levelConst.nLevelCoefficient);
    AddAttribute(panelAttrs, "SolarShieldPercent", atPanelSolarShieldFinalPercent);
    // console.log(`最终阳性内防百分比：${atPanelSolarShieldFinalPercent}`);


    let atPanelNeutralShieldBase =
        GetAttr(attrs, "atMagicShield") +
        GetAttr(attrs, "atNeutralMagicShieldBase");
    AddAttribute(panelAttrs, "NeutralShieldBase", atPanelNeutralShieldBase);
    // console.log(`基础混元内防等级：${atPanelNeutralShieldBase}`);
    let atPanelNeutralShieldFinal =
        AddAndMultiply(atPanelNeutralShieldBase, 0, GetAttr(attrs, "atNeutralMagicShieldPercent")) +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMagicShieldCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToNeutralMagicShieldCof");
    AddAttribute(panelAttrs, "NeutralShield", atPanelNeutralShieldFinal);
    // console.log(`最终混元内防等级：${atPanelNeutralShieldFinal}`);
    let atPanelNeutralShieldFinalPercent = atPanelNeutralShieldFinal / (atPanelNeutralShieldFinal + levelConst.fMagicShieldParam * levelConst.nLevelCoefficient);
    AddAttribute(panelAttrs, "NeutralShieldPercent", atPanelNeutralShieldFinalPercent);
    // console.log(`最终混元内防百分比：${atPanelNeutralShieldFinalPercent}`);


    let atPanelPoisonShieldBase =
        GetAttr(attrs, "atMagicShield") +
        GetAttr(attrs, "atPoisonMagicShieldBase");
    AddAttribute(panelAttrs, "PoisonShieldBase", atPanelPoisonShieldBase);
    // console.log(`基础毒性内防等级：${atPanelPoisonShieldBase}`);
    let atPanelPoisonShieldFinal =
        AddAndMultiply(atPanelPoisonShieldBase, 0, GetAttr(attrs, "atPoisonMagicShieldPercent")) +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToMagicShieldCof") +
        GetAttributeConvert(finalAttrs, "atSpirit", attrs, "atSpiritToPoisonMagicShieldCof");
    AddAttribute(panelAttrs, "PoisonShield", atPanelPoisonShieldFinal);
    // console.log(`最终毒性内防等级：${atPanelPoisonShieldFinal}`);
    let atPanelPoisonShieldFinalPercent = atPanelPoisonShieldFinal / (atPanelPoisonShieldFinal + levelConst.fMagicShieldParam * levelConst.nLevelCoefficient);
    AddAttribute(panelAttrs, "PoisonShieldPercent", atPanelPoisonShieldFinalPercent);
    // console.log(`最终毒性内防百分比：${atPanelPoisonShieldFinalPercent}`);
}

function CalcDodge(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->闪避<---`);


    let atPanelDodgeBase =
        GetAttr(attrs, "atDodge") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToDodgeCof") +
        GetAttributeConvert(finalAttrs, "atAgility", attrs, "atAgilityToDodgeCof") +
        GetAttributeConvert(finalAttrs, "atAgility", attrs, "atSystemAgilityToDodgeCof");
    let atPanelDodge = AddAndMultiplyByKilo(atPanelDodgeBase, 0, 0);
    AddAttribute(panelAttrs, "Dodge", atPanelDodge);
    // console.log(`闪避等级：${atPanelDodge}`);
    let atPanelDodgePercent = atPanelDodge / (atPanelDodge + levelConst.fDodgeParam * levelConst.nLevelCoefficient) + GetAttr(attrs, "atDodgeBaseRate") / 10000;
    AddAttribute(panelAttrs, "DodgePercent", atPanelDodgePercent);
    // console.log(`闪避百分比：${atPanelDodgePercent}`);
}

function CalcParry(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->招架<---`);


    let atPanelParryBase =
        GetAttr(attrs, "atParryBase") +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToParryCof") +
        GetAttributeConvert(finalAttrs, "atAgility", attrs, "atAgilityToParryCof");
    let atPanelParryWithKilo = AddAndMultiplyByKilo(atPanelParryBase, 0, 0);
    let atPanelParry = AddAndMultiply(atPanelParryWithKilo, 0, GetAttr(attrs, "atParryPercent"));
    AddAttribute(panelAttrs, "Parry", atPanelParry);
    // console.log(`招架等级：${atPanelParry}`);
    let atPanelParryPercent = atPanelParry / (atPanelParry + levelConst.fParryParam * levelConst.nLevelCoefficient) + GetAttr(attrs, "atParryBaseRate") / 10000 + 0.03;
    AddAttribute(panelAttrs, "ParryPercent", atPanelParryPercent);
    // console.log(`招架百分比：${atPanelParryPercent}`);
}

function CalcParryValue(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->拆招<---`);


    let atPanelParryValueBase =
        GetAttr(attrs, "atParryValueBase");
    let atPanelParryValue =
        AddAndMultiply(atPanelParryValueBase, 0, GetAttr(attrs, "atParryValuePercent")) +
        GetAttributeConvert(finalAttrs, "atVitality", attrs, "atVitalityToParryValueCof") +
        GetAttributeConvert(finalAttrs, "atStrength", attrs, "atSystemStrengthToParryValueCof") +
        GetAttributeConvert(finalAttrs, "atAgility", attrs, "atAgilityToParryValueCof");
    AddAttribute(panelAttrs, "ParryValue", atPanelParryValue);
    // console.log(`拆招等级：${atPanelParryValue}`);
}

function CalcToughness(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->御劲<---`);


    let atPanelToughnessWithKilo = AddAndMultiplyByKilo(GetAttr(attrs, "atToughnessBase"), 0, GetAttr(attrs, "atToughnessBaseRate"))
    let atPanelToughness = AddAndMultiply(atPanelToughnessWithKilo, 0, GetAttr(attrs, "atToughnessPercent"));
    AddAttribute(panelAttrs, "Toughness", atPanelToughness);
    // console.log(`御劲等级：${atPanelToughness}`);

    let atToughnessDefCriticalPercent = atPanelToughness / (levelConst.fDefCriticalStrikeParam * levelConst.nLevelCoefficient);
    AddAttribute(panelAttrs, "ToughnessDefCriticalPercent", atToughnessDefCriticalPercent);
    // console.log(`御劲减会心百分比：${atToughnessDefCriticalPercent}`);

    let atToughnessDecirDamagePercent = atPanelToughness / (levelConst.fToughnessDecirDamageCof * levelConst.nLevelCoefficient);
    AddAttribute(panelAttrs, "ToughnessDecirDamagePercent", atToughnessDecirDamagePercent);
    // console.log(`御劲减会伤百分比：${atToughnessDecirDamagePercent}`);
}

function CalcDecriticalDamage(attrs, panelAttrs, finalAttrs) {
    // console.log(`--->化劲<---`);


    let atPanelDecritical = AddAndMultiply(GetAttr(attrs, "atDecriticalDamagePowerBase"), 0, GetAttr(attrs, "atDecriticalDamagePowerPercent"));
    AddAttribute(panelAttrs, "DecriticalDamage", atPanelDecritical);
    // console.log(`化劲等级：${atPanelDecritical}`);

    let atDecriticalPercent =
        atPanelDecritical / (atPanelDecritical + levelConst.fDecriticalStrikePowerParam * levelConst.nLevelCoefficient) +
        GetAttr(attrs, "atDecriticalDamagePowerBaseKiloNumRate") / 1000;
    AddAttribute(panelAttrs, "DecriticalDamagePercent", atDecriticalPercent);
    // console.log(`化劲百分比：${atDecriticalPercent}`);
}

function ExportMeleeWeaponDamage(attrs, panelAttrs, finalAttrs) {
    AddAttribute(panelAttrs, "MeleeWeaponAttackSpeed", GetAttr(attrs, "atMeleeWeaponAttackSpeedBase"));
    AddAttribute(panelAttrs, "MeleeWeaponDamage", GetAttr(attrs, "atMeleeWeaponDamageBase"));
    AddAttribute(panelAttrs, "MeleeWeaponDamageRand", GetAttr(attrs, "atMeleeWeaponDamageRand"));
}
