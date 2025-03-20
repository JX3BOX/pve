/**
 * 缘起70级命中 pop 显示
 */
const hitFn = (hit, role_level) => {
    return target_levels(role_level).map((level) => {
        return `对等级为 ${level} 的目标命中几率为 ${hit - hit_level_down(role_level, level)}%`;
    });
};

const target_levels = (level) => {
    return [...Array(5).keys()].map(x => x + level);
}

const hit_level_down = (role_level, target_level) => {
    let cof = [0, 2.5, 5, 10, 20];
    return cof[target_level - role_level];
}

export default hitFn;
