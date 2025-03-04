// 用户上传
const { $cms } = require("@jx3box/jx3box-common/js/https");

export const upload = (file) => {
    return $cms().post("/api/cms/upload", file);
};
