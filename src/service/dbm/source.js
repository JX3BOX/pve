import { $cms } from "@jx3box/jx3box-common/js/https";

export function getRefCount(ids) {
    return $cms().get("/api/cms/dbm/source", { params: { ids: ids.join(",") } });
}
