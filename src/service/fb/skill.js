import { $lua, $cms } from "@jx3box/jx3box-common/js/https";

function getLuaIndex(fbname, client = "std") {
    // return axios.get(__ossMirror + "lua/index.json?v=" + Date.now());
    return $lua().get(`/api/lua/fb/dist/${fbname}/index.json`, {
        params: {
            client: client,
        },
    });
}
function getLua(fbname, boss, client = "std") {
    // return axios.get(__ossMirror + `lua/${fb}/${boss}.json?v=` + Date.now());
    return $lua().get(`/api/lua/fb/dist/${fbname}/${boss}.json`, {
        params: {
            client: client,
        },
    });
}

function getIsSuperAuthor(uid) {
    return $cms().get(`/api/cms/user/is_super_author/${uid}`);
}

export { getLuaIndex, getLua, getIsSuperAuthor };
