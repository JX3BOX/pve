import { $node } from "@jx3box/jx3box-common/js/https";

export function getGemList(params) {
    return $node().get('/api/node/item/prediction', {
        params: params,
    })
}

