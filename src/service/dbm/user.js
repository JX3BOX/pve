import { $cms } from "@jx3box/jx3box-common/js/https";
const $ = $cms();

export const getUserList = (params) => $.get(`/api/cms/user/list`, { params });
