import { $node } from "@jx3box/jx3box-common/js/https";

// 批量获取skill数据
export function getSkillList(ids) {
    return $node().get("/skills", {
        params: {
            ids,
        },
    });
}

// 批量获取buff数据
export function getBuffList(ids) {
    return $node().get("/buffs", {
        params: {
            ids,
        },
    });
}
