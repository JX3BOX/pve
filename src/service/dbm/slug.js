import {$next as $} from "@jx3box/jx3box-common/js/https";

/**
 * 获取slug列表
 * @returns Promise
 */
export async function getSlugList() {

    return new Promise((resolve, reject) => {
        const res = sessionStorage.getItem("dbm_slugs");
        if (res) {
            resolve(JSON.parse(res));
        } else {
            $().get("/api/next2/dbm/vpk/slugs").then(res => {
                sessionStorage.setItem("dbm_slugs", JSON.stringify({ data: res.data }));
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        }
    });
}
