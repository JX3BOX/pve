import { $cms, axios } from "@jx3box/jx3box-common/js/https";
const $ = $cms();

export const getPkgItems = (pkg_id, params) => $.get(`/api/cms/dbm/build/pkg/${pkg_id}/items`, { params });

export const downloadPkg = (file) => axios.get(file, { responseType: "arraybuffer" });
