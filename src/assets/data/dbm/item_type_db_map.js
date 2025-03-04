export const resolve_type_map = {
    B: "buff",
    N: "npc",
    S: "skill",
    D: "doodad",
};
export const type_db_map = {
    BUFF: "buff",
    DEBUFF: "buff",
    CASTING: "skill",
    NPC: "npc",
    DOODAD: "doodad",
};
export const type_primary_key_map = {
    BUFF: "BuffID",
    DEBUFF: "BuffID",
    CASTING: "SkillID",
    NPC: "ID",
    DOODAD: "ID",
};
export const type_fields_map = {
    BUFF: ["BuffID", "Level", "IconID", "Name", "Remark", "BuffName"],
    DEBUFF: ["BuffID", "Level", "IconID", "Name", "Remark", "BuffName"],
    CASTING: ["SkillID", "Level", "IconID", "Name", "Remark", "SkillName"],
    NPC: ["ID", "Name", "Title"],
    DOODAD: ["ID", "Name", "BarText"],
};
export const db_type_fields_map = {
    buff: ["BuffID", "Level", "IconID", "Name", "Remark", "BuffName"],
    npc: ["ID", "Name", "Title"],
    skill: ["SkillID", "Level", "IconID", "Name", "Remark", "SkillName"],
    doodad: ["ID", "Name", "BarText"],
};
