import { getSkillList, getBuffList } from "@/service/battle/node"
import { uniq } from "lodash"
import skill_status from "@/assets/data/battle/skill_status.json";


// 获取skill与buff列表
async function fetchData(skills, buffs) {
    try {
        if (skills.length > 0) {
            // 1. 取出要请求的技能列表
            let skillIds = []
            skills.forEach(item => {
                const id = item.split(",")[1];
                const level = item.split(",")[2];
                const key = `skill_${id}_${level}`;

                let skill = sessionStorage.getItem(key);
                if (!skill) {
                    skill = sessionStorage.getItem(`skill_${id}_0`);
                }
                if (!skill) {
                    skillIds.push(id);
                }
            })
            // 2. 请求技能列表
            if (!skillIds.length) return
            const _skills = await getSkillList(uniq(skillIds).join(","));
            // 3. 存储技能列表
            _skills?.data?.forEach(item => {
                const { SkillID, Name, SkillName, IconID, Level } = item;
                const key = `skill_${SkillID}_${Level || 0}`;
                // const key = `skill_${SkillID}`;
                const _skill = sessionStorage.getItem(key);
                if (!_skill) {
                    sessionStorage.setItem(key, JSON.stringify({ name: Name, _name: SkillName, icon: IconID, level: Level }));
                }
            })
        }

        if (buffs.length > 0) {
            // 1. 取出要请求的buff列表
            let buffIds = []
            buffs.forEach(item => {
                const id = item.split(",")[1];
                const level = item.split(",")[2];
                const key = `buff_${id}_${level}`;

                let buff = sessionStorage.getItem(key);

                if (!buff) {
                    buff = sessionStorage.getItem(`buff_${id}_0`);
                }
                if (!buff) {
                    buffIds.push(id);
                }
            })
            // 2. 请求buff列表
            if (!buffIds.length) return
            // 3. 存储buff列表
            const _buffs = await getBuffList(uniq(buffIds).join(","));
            _buffs?.data?.forEach(item => {
                const { BuffID, Name, BuffName, IconID, Level } = item;
                const key = `buff_${BuffID}_${Level}`;
                const _buff = sessionStorage.getItem(key);

                if (!_buff) {
                    sessionStorage.setItem(key, JSON.stringify({ name: Name, _name: BuffName, icon: IconID, level: Level }));
                }
            })
        }

    } catch (error) {
        console.log(error);
    }
}


// 根据状态分类，记录各状态数目，制作命中、会心、偏离、识破饼图
function getStatusData(data) {
    let result = {};
    for (let status in data) {
        result[skill_status[status]] = data[status][1];
    }
    return result;
}

// 根据技能分类，制作技能占比与技能详情
async function getSkillData(data) {
    let result = [];
    const skillIds = [];
    const buffIds = [];
    Object.keys(data).forEach(item => {
        if (item.split(",")[0] == 1) {
            skillIds.push(item);
        } else {
            buffIds.push(item);
        }
    })
    await fetchData(skillIds, buffIds);
    for (let item in data) {
        let _skill = data[item]; //比对DK_REC_STAT.SKILL

        // 基本信息
        let skill = Object.assign({}, getSkillBasicInfo(item));

        // 技能统计（默认可以不展示无伤害技能）
        skill.count = _skill[1]; //次数（总数量）、技能占比用
        skill.total = _skill[6]; //总伤害（所有命中有效总伤害）、技能占比用
        skill.max = _skill[4]; //最大值（单次命中最大有效值）
        skill.avg = _skill[10]; //平均值（所有非零值四象轮回平均有效伤害）
        skill.min = _skill[11][0] ? _skill[11][0][6] : 0; //最小值（对应DK_REC_STAT_SKILL.DETAIL）

        // 技能状态统计（可求出单技能饼图）
        skill.hit = getSkillCount(_skill[11][0]); //命中数（对应DK_REC_STAT_SKILL.DETAIL）
        skill.miss = getSkillCount(_skill[11][3]); //偏离数
        skill.critical = getSkillCount(_skill[11][5]); //会心数
        skill.insight = getSkillCount(_skill[11][6]); //识破数

        result.push(skill);
    }

    return result;
}
function getSkillCount(val) {
    return val ? val[1] : 0;
}
// 通过类似1,2,3这样的组合唯一键求技能基础信息
function getSkillBasicInfo(skillkey) {
    let skill = {};
    let skill_key = skillkey.split(","); //1类型,2ID,3等级

    // ID
    let skill_id = skill_key[1];
    skill.id = ~~skill_id;
    skill.level = ~~skill_key[2];
    skill.type = ~~skill_key[0];

    // 图标+名称
    // 主动技能
    if (skill_key[0] == 1) {
        const key = `skill_${skill_id}_${skill.level}`;
        // const key = `skill_${skill_id}`;
        let _skill = sessionStorage.getItem(key);

        // 如果对应的level没有找到，就找level=0的
        if (!_skill) _skill = sessionStorage.getItem(`skill_${skill_id}_0`);

        if (_skill) {
            _skill = JSON.parse(_skill);
            skill.icon = _skill.icon;
            skill.name = _skill.name;
            skill._name = _skill._name;
        } else {
            skill.icon = 13;
            skill.name = "未知技能";
            skill._name = "未知技能";
        }
        // DOT技能
    } else {
        const key = `buff_${skill_id}_${skill.level}`;
        // const key = `buff_${skill_id}`;
        let _buff = sessionStorage.getItem(key);

        // 如果对应的level没有找到，就找level=0的
        if (!_buff) _buff = sessionStorage.getItem(`buff_${skill_id}_0`);

        if (_buff) {
            _buff = JSON.parse(_buff);
            skill.icon = _buff.icon;
            skill.name = _buff.name;
            skill._name = _buff._name;
        } else {
            skill.icon = 13;
            skill.name = "未知Buff";
            skill._name = "未知Buff";
        }
    }
    return skill;
}

// 根据目标分类
async function getTargetData(data, raw) {
    let targetsDamage = [];
    let namelist = raw.NAME_LIST;

    let count = 0;
    let targets = {};

    for (let item in data) {
        let targetDamage = {};
        // 存在输出量
        if (data[item][5]) {
            // 总数目
            targetDamage.count = ~~data[item][2];
            count += ~~data[item][2];
            // 总伤害
            targetDamage.total = ~~data[item][6];
            // 技能详情(对应DK_REC_STAT_TARGET.SKILL)
            targetDamage.skills = await getTargetSkillData(data[item][12]);
            // 目标信息(需要过滤掉目标为自己和无伤害)
            targetDamage.id = item;
            targetDamage.name = namelist[item];
            targets[item] = namelist[item];
            // 存储
            targetsDamage.push(targetDamage);
        }
    }

    let result = {
        _count: count, //此处技能数只针对对外目标，和默认的总数并不一致
        _targets: targets, //名称列表
        detail: targetsDamage,
    };

    return result;
}
async function getTargetSkillData(data) {
    let result = [];
    const skillIds = [];
    const buffIds = [];
    Object.keys(data).forEach(item => {
        if (item.split(",")[0] == 1) {
            skillIds.push(item);
        } else {
            buffIds.push(item);
        }
    })
    await fetchData(skillIds, buffIds);
    for (let item in data) {
        // 过滤无伤害技能
        if (data[item][4]) {
            let skill = Object.assign({}, getSkillBasicInfo(item));
            skill.max = data[item][2];
            skill.total = data[item][4];

            skill.count = 0;
            // 技能状态
            for (let status in data[item][5]) {
                skill[skill_status[status]] = ~~data[item][5][status];
                skill.count += ~~data[item][5][status];
            }

            result.push(skill);
        }
    }
    return result;
}

export { getStatusData, getSkillData, getTargetData };
