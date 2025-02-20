import { $node } from "@jx3box/jx3box-common/js/https";

export function getAchievements(params) {
    return $node().get("/api/node/achievement/list", {
        params: params,
    });
}
