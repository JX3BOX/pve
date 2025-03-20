// 定义
import attrChangeTab from '@/assets/data/pz/equip_magic_changes.json';
const levelCof = [0.6, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 1.00, 1.20];
const decreaseCof = 0.2;

/**
 * 洗练功能的数值计算函数，传入的参数为选择的属性和属性值、目标属性，以及熔铸等级
 * 然后需要输出一个包含两个整数的数组，第一个整数为被洗属性的变化量，第二个整数为洗练新增属性的变化量
 */
function magic_change_calc({ from_name, from_value, to_name, level } = {}) {
    let decrease_value = decrease_value_calc(from_value);
    let increase_value = increase_value_calc({ from_name, from_value, to_name, level });
    return [-decrease_value, increase_value]
}

// 计算减少的属性
function decrease_value_calc(from_value) {
    let decrease_value = from_value * decreaseCof;
    decrease_value = Math.ceil(decrease_value);
    return decrease_value;
}
// 计算增加的属性
function increase_value_calc({ from_name, from_value, to_name, level } = {}) {
    let fromCof = attrChangeTab.find(item => item.from == from_name).value;
    let toCof = attrChangeTab.find(item => item.from == to_name).value;
    let increase_value = Math.floor(Math.floor(from_value * decreaseCof) * (fromCof / toCof) * levelCof[level - 1]);
    return Math.ceil(increase_value);
}

function magic_change_display(level) {
    let chars = "一二三四五六七八九";
    let level_char = chars[level - 1];
    let level_desc = ['小成', '贯通', '拔萃', '神技', '登峰', '盖世', '无双', '烁今', '入圣'][level - 1];
    return `${level_char}级 · ${level_desc}`;
}

export { magic_change_calc, decrease_value_calc, increase_value_calc, magic_change_display }

