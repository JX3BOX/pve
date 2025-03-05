export const DK = {
    UUID: 1, // 战斗唯一标识
    BOSSNAME: 2, // 日志名字
    VERSION: 3, // 数据版本号
    TIME_BEGIN: 4, // 战斗开始时间
    TICK_BEGIN: 5, // 战斗开始毫秒时间
    TIME_DURING: 6, // 战斗持续时间
    TICK_DURING: 7, // 战斗持续毫秒时间
    AWAYTIME: 8, // 死亡/掉线时间节点
    NAME_LIST: 9, // 名称缓存
    FORCE_LIST: 10, // 势力缓存
    EFFECT_LIST: 11, // 效果信息缓存
    DAMAGE: 12, // 输出统计
    HEAL: 13, // 治疗统计
    BE_HEAL: 14, // 承疗统计
    BE_DAMAGE: 15, // 承伤统计
    EVERYTHING: 16, // 战斗复盘
    ABSORB: 17, // 化解统计
    PLAYER_LIST: 18, // 玩家信息缓存
    SERVER: 19, // 所在服务器
    MAP: 20, // 所在地图
}

export const DK_REC = {
    TIME_DURING: 1,
    TOTAL: 2,
    TOTAL_EFFECT: 3,
    STAT: 4,
}

export const DK_REC_STAT = {
    TOTAL: 1,
    TOTAL_EFFECT: 2,
    DETAIL: 3,
    SKILL: 4,
    TARGET: 5,
}

export const DK_REC_STAT_DETAIL = {
    COUNT: 1, // 命中记录数量（假设nSkillResult是命中）
    NZ_COUNT: 2, // 非零值命中记录数量
    MAX: 3, // 单次命中最大值
    MAX_EFFECT: 4, // 单次命中最大有效值
    MIN: 5, // 单次命中最小值
    NZ_MIN: 6, // 单次非零值命中最小值
    MIN_EFFECT: 7, // 单次命中最小有效值
    NZ_MIN_EFFECT: 8, // 单次非零值命中最小有效值
    TOTAL: 9, // 所有命中总伤害
    TOTAL_EFFECT: 10, // 所有命中总有效伤害
    AVG: 11, // 所有命中平均伤害
    NZ_AVG: 12, // 所有非零值命中平均伤害
    AVG_EFFECT: 13, // 所有命中平均有效伤害
    NZ_AVG_EFFECT: 14, // 所有非零值命中平均有效伤害
}

export const DK_REC_STAT_SKILL = {
    COUNT: 1, // 该玩家四象轮回释放次数（假设szEffectName是四象轮回）
    NZ_COUNT: 2, // 该玩家非零值四象轮回释放次数
    MAX: 3, // 该玩家四象轮回最大输出量
    MAX_EFFECT: 4, // 该玩家四象轮回最大有效输出量
    TOTAL: 5, // 该玩家四象轮回输出量总和
    TOTAL_EFFECT: 6, // 该玩家四象轮回有效输出量总和
    AVG: 7, // 该玩家所有四象轮回平均伤害
    NZ_AVG: 8, // 该玩家所有非零值四象轮回平均伤害
    AVG_EFFECT: 9, // 该玩家所有四象轮回平均有效伤害
    NZ_AVG_EFFECT: 10, // 该玩家所有非零值四象轮回平均有效伤害
    DETAIL: 11, // 该玩家四象轮回输出结果分类统计
    TARGET: 12, // 该玩家四象轮回承受者统计
}

export const DK_REC_STAT_SKILL_DETAIL = {
    COUNT: 1, // 命中记录数量
    NZ_COUNT: 2, // 非零值命中记录数量
    MAX: 3, // 单次命中最大值
    MAX_EFFECT: 4, // 单次命中最大有效值
    MIN: 5, // 单次命中最小值
    NZ_MIN: 6, // 单次非零值命中最小值
    MIN_EFFECT: 7, // 单次命中最小有效值
    NZ_MIN_EFFECT: 8, // 单次非零值命中最小有效值
    TOTAL: 9, // 所以命中总伤害
    TOTAL_EFFECT: 10, // 所有命中总有效伤害
    AVG: 11, // 所有命中平均伤害
    NZ_AVG: 12, // 所有非零值命中平均伤害
    AVG_EFFECT: 13, // 所有命中平均有效伤害
    NZ_AVG_EFFECT: 14, // 所有非零值命中平均有效伤害
}

export const DK_REC_STAT_SKILL_TARGET = {
    MAX: 1, // 该玩家四象轮回击中的这个玩家最大伤害
    MAX_EFFECT: 2, // 该玩家四象轮回击中的这个玩家最大有效伤害
    TOTAL: 3, // 该玩家四象轮回击中的这个玩家伤害总和
    TOTAL_EFFECT: 4, // 该玩家四象轮回击中的这个玩家有效伤害总和
    COUNT: 5, // 该玩家四象轮回击中的这个玩家结果统计
    NZ_COUNT: 6, // 该玩家非零值四象轮回击中的这个玩家结果统计
}

export const DK_REC_STAT_TARGET = {
    COUNT: 1, // 该玩家对idTarget的技能释放次数
    NZ_COUNT: 2, // 该玩家对idTarget的非零值技能释放次数
    MAX: 3, // 该玩家对idTarget的技能最大输出量
    MAX_EFFECT: 4, // 该玩家对idTarget的技能最大有效输出量
    TOTAL: 5, // 该玩家对idTarget的技能输出量总和
    TOTAL_EFFECT: 6, // 该玩家对idTarget的技能有效输出量总和
    AVG: 7, // 该玩家对idTarget的技能平均输出量
    NZ_AVG: 8, // 该玩家对idTarget的非零值技能平均输出量
    AVG_EFFECT: 9, // 该玩家对idTarget的技能平均有效输出量
    NZ_AVG_EFFECT: 10, // 该玩家对idTarget的非零值技能平均有效输出量
    DETAIL: 11, // 该玩家对idTarget的技能输出结果分类统计
    SKILL: 12, // 该玩家对idTarget的技能具体分别统计
}

export const DK_REC_STAT_TARGET_DETAIL = {
    COUNT: 1, // 命中记录数量（假设nSkillResult是命中）
    NZ_COUNT: 2, // 非零值命中记录数量
    MAX: 3, // 单次命中最大值
    MAX_EFFECT: 4, // 单次命中最大有效值
    MIN: 5, // 单次命中最小值
    NZ_MIN: 6, // 单次非零值命中最小值
    MIN_EFFECT: 7, // 单次命中最小有效值
    NZ_MIN_EFFECT: 8, // 单次非零值命中最小有效值
    TOTAL: 9, // 所以命中总伤害
    TOTAL_EFFECT: 10, // 所有命中总有效伤害
    AVG: 11, // 所有命中平均伤害
    NZ_AVG: 12, // 所有非零值命中平均伤害
    AVG_EFFECT: 13, // 所有命中平均有效伤害
    NZ_AVG_EFFECT: 14, // 所有非零值命中平均有效伤害
}

export const DK_REC_STAT_TARGET_SKILL = {
    MAX: 1, // 该玩家击中这个玩家的四象轮回最大伤害
    MAX_EFFECT: 2, // 该玩家击中这个玩家的四象轮回最大有效伤害
    TOTAL: 3, // 该玩家击中这个玩家的四象轮回伤害总和
    TOTAL_EFFECT: 4, // 该玩家击中这个玩家的四象轮回有效伤害总和
    COUNT: 5, // 该玩家击中这个玩家的四象轮回结果统计
    NZ_COUNT: 6, // 该玩家非零值击中这个玩家的四象轮回结果统计
}

export const SKILL_RESULT = {
    HIT: 0, // 命中
    BLOCK: 1, // 格挡
    SHIELD: 2, // 无效
    MISS: 3, // 偏离
    DODGE: 4, // 闪避
    CRITICAL: 5, // 会心
    INSIGHT: 6, // 识破
}

export const defaultDetail = {
    [DK_REC_STAT_DETAIL.COUNT]: 0,
    [DK_REC_STAT_DETAIL.NZ_COUNT]: 0,
    [DK_REC_STAT_DETAIL.MAX]: 0,
    [DK_REC_STAT_DETAIL.MAX_EFFECT]: 0,
    [DK_REC_STAT_DETAIL.MIN]: Number.MAX_SAFE_INTEGER,
    [DK_REC_STAT_DETAIL.MIN_EFFECT]: Number.MAX_SAFE_INTEGER,
    [DK_REC_STAT_DETAIL.NZ_MIN]: Number.MAX_SAFE_INTEGER,
    [DK_REC_STAT_DETAIL.NZ_MIN_EFFECT]: Number.MAX_SAFE_INTEGER,
    [DK_REC_STAT_DETAIL.TOTAL]: 0,
    [DK_REC_STAT_DETAIL.TOTAL_EFFECT]: 0,
    [DK_REC_STAT_DETAIL.AVG]: 0,
    [DK_REC_STAT_DETAIL.NZ_AVG]: 0,
    [DK_REC_STAT_DETAIL.AVG_EFFECT]: 0,
    [DK_REC_STAT_DETAIL.NZ_AVG_EFFECT]: 0,
}
