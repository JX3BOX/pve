import { flatten, over, sum, uniq } from "lodash";
import { getResource as getResourceFromApi } from "@/service/pz/game";
import { calculateAttrib as calcAttrStd } from "@/calc/stdV130/v130";
import { calculateAttrib as calcAttrOrigin } from "@/calc/originV80/v80";
import { hasEffect } from "@/utils/pz/equipFilter";
import overviewDisplay from "@/assets/data/pz/overview_display.js";
import { getEquipScore, getStoneScore, getEmbeddingScore, getGsStrengthScore } from "@/utils/pz/score.js";
import equip_map from "@/assets/data/pz/equip_map.json";

import { showAvatar } from "@jx3box/jx3box-common/js/utils.js";

const RESOURCE_TYPE_MAP = {
    0: "enchant",
    6: "weapon",
    7: "armor",
    8: "trinket",
};
// battle 传过来的code只包含装备和奇穴，需要转换成需要的格式再丢进iframe的组件里
export const jbbb2schema = async (code) => {
    let {
        EquipList: equips,
        TalentCode: talents,
        Title: title,
        Mount: mount,
        Client: client = "std",
        BodyType: body_type = 0,
    } = code ?? {};
    if (!equips) return;
    const resources = await getEquipResource(client, equips, talents);
    const talent_pzcode = await getTalentPzcode(client, talents);
    const snapshot = getSnapshot(equips, resources);
    const collections = getCollections(snapshot);
    const is_tertiary = equips?.TERTIARY_WEAPON ? 1 : 0;
    const attrs = getAttrs(client, snapshot, mount, talent_pzcode, is_tertiary, collections, body_type);
    const overview = getOverview(attrs, snapshot, mount, client, is_tertiary);
    return {
        title,
        client,
        weapon_mode: !is_tertiary,
        snapshot,
        overview,
        attrs,
        talent_pzcode,
        mount,
        is_tertiary,
        pz_author_info: {
            display_name: "JX3BOX",
            user_avatar: showAvatar(null, "m"),
        },
        user_id: 1,
    };
};

const getOverview = (attrs, snapshot, mount, client, is_tertiary) => {
    let overview = {
        equips: {},
        attrs: {},
        score: 0,
    };
    // 装备总览
    for (let position in snapshot) {
        let _snapshot = snapshot[position];
        let _equip = snapshot[position].equip;
        let equip = {
            name: _equip?.Name,
            icon: _equip?._IconID,
            level: _equip?.Level,
            attrs: _equip?._Attrs,
            strength: _snapshot.strength,
            embedding: _snapshot.embedding.map((e) => e.level),
            enhance: _snapshot?.enhance?.Name,
            enchant: _snapshot?.enchant?.Name,
            stone: _snapshot?.stone?.Name,
            stone_icon: _snapshot?.stone?.icon,
            max_strength_level: _equip?.MaxStrengthLevel,
            quality: _equip?.Quality,

            is_special: _equip?.BelongSchool === "精简" || hasEffect(_snapshot?.equip),
        };
        overview.equips[position] = equip;
    }
    // 属性总览
    const mountDisplay = overviewDisplay[mount];
    for (let key in mountDisplay) {
        overview.attrs[key] = attrs[mountDisplay[key]];
    }
    // 装分计算
    let scoreByName = {};
    for (let key in snapshot) {
        let _snapshot = snapshot[key];
        if (_snapshot.equip) {
            const position = equip_map[key].position;
            const equip = _snapshot.equip;
            // 基础装分
            const baseScore = getEquipScore(equip.Level, equip.Quality, position);
            // 五行石装分
            let embeddingScore = 0;
            if (_snapshot?.embedding.length) {
                embeddingScore = Math.round(
                    _snapshot?.embedding
                        ?.map((e) => getEmbeddingScore(e.level, client))
                        .reduce((prev, next) => prev + next)
                );
            }
            // 五彩石装分
            let stoneScore = 0;
            if (_snapshot.stone) {
                stoneScore = getStoneScore(_snapshot?.stone?.stone_level || 0, client);
            }
            // 精炼装分
            const strengthScore = getGsStrengthScore(baseScore, _snapshot.strength, {
                client,
                equipQuality: equip.Quality,
                equipPosition: equip.SubType,
                equipLevel: equip.Level,
            });

            // 大小附魔分
            const enchantScore = _snapshot?.enchant?.Score || 0;
            const enhanceScore = _snapshot?.enhance?.Score || 0;

            const _score = baseScore + embeddingScore + stoneScore + strengthScore + enchantScore + enhanceScore;

            scoreByName[key] = _score;
        }
    }
    if (is_tertiary) {
        scoreByName["PRIMARY_WEAPON"] = (scoreByName["TERTIARY_WEAPON"] + scoreByName["PRIMARY_WEAPON"]) / 2;
        scoreByName["TERTIARY_WEAPON"] = 0;
    }
    overview.score = Math.floor(sum(Object.values(scoreByName)));
    return overview;
};

const getCollections = (snapshot) => {
    let collections = {};
    for (let position in snapshot) {
        let equip = snapshot[position].equip;
        let set_id = equip?.SetID;
        if (~~set_id) {
            if (!collections[set_id]) {
                collections[set_id] = {
                    count: 0,
                    id: set_id,
                    setData: equip?._SetData,
                };
            }
            collections[set_id].count += 1;
        }
    }
    return new Map(Object.entries(collections));
};

const getAttrs = (client, snapshot, mount, talent_pzcode, is_tertiary, collections, body_type) => {
    return client == "std"
        ? calcAttrStd({
              snapshot,
              mount,
              talentCode: talent_pzcode,
              schema_client: client,
              useHeavy: is_tertiary,
              setCollection: collections,
              body_type,
          })
        : calcAttrOrigin({
              snapshot,
              mount,
              talentCode: talent_pzcode,
              schema_client: client,
              useHeavy: is_tertiary,
              setCollection: collections,
              body_type,
          });
};

const getEquipResource = async (client, equips, talents) => {
    let resources = {};
    // ['6_10400', '7_1000'] => {6: ['10400'], 7: ['1000']}
    let resource_ids = [
        ...uniq(
            flatten(
                Object.values(equips).map((equip) => [equip?.id, equip?.enchant, equip?.enhance, equip?.stone])
            ).filter((id) => id)
        ),
    ].reduce((acc, res_id) => {
        let [type, id] = `${res_id}`?.split("_");
        if (!id) {
            id = type;
            type = 0;
        }
        if (!acc[type]) acc[type] = [];
        acc[type].push(id);
        return acc;
    }, {});
    resource_ids = {
        ...resource_ids,
        1: talents.map((talent) => talent.id),
    };
    // 从接口获取资源
    for (let type of [0, 6, 7, 8]) {
        if (resource_ids[type]) {
            let res = await getResourceFromApi(client, RESOURCE_TYPE_MAP[type], resource_ids[type]);
            let data = res.data;
            if (!Array.isArray(data)) data = [data];
            data = data.reduce((acc, equip) => {
                acc[`${type}_${equip.ID}`] = equip;
                return acc;
            }, {});
            resources = {
                ...resources,
                ...data,
            };
        }
    }
    return resources;
};

const getTalentPzcode = async (client, talents) => {
    let skill_ids = talents.map((talent) => `${talent.id}_0`);
    let res = await getResourceFromApi(client, "skill", skill_ids);
    let skills = res.data;
    if (!skills.length) skills = [skills];
    let skill_resources = skills.reduce(
        (acc, skill) => ({
            ...acc,
            [skill.SkillID]: {
                id: skill.SkillID,
                name: skill.Name,
                icon: skill.IconID,
            },
        }),
        {}
    );
    return talents.map((talent) => {
        let id = talent.id;
        return skill_resources[id];
    });
};

const getSnapshot = (equips, resources) => {
    for (let position in equips) {
        let equip = equips[position];
        let equip_resource = resources[equip.id];
        // 附魔丢进去
        const enchant = resources[`0_${equip.enchant}`] ?? "";
        const enhance = resources[`0_${equip.enhance}`] ?? "";
        const stone = resources[`0_${equip.stone}`] ?? "";
        // 构造出一个镶嵌的数组
        let embedding = [];
        for (let i of [1, 2, 3]) {
            if (equip_resource["_DiamondAttributeID" + i]) {
                embedding.push({
                    level: 0,
                    raw: equip_resource["_DiamondAttributeID" + i],
                });
            }
        }
        for (let i in equip.embedding) {
            embedding[i]["level"] = equip.embedding[i];
        }
        // 装备
        equips[position] = {
            ...equip,
            enchant,
            enhance,
            stone,
            embedding,
            id: "",
            skill: "",
            equip: equip_resource,
        };
    }
    return equips;
};
