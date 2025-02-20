import { $lua } from "@jx3box/jx3box-common/js/https";

function getLuaIndex(fbname, client = "std") {
    return $lua({ mute: true }).get(`/api/lua/fb/src/${fbname}/index.json`, {
        params: {
            client: client,
        },
    });
}
function getLua(fbname, filename, client = "std") {
    let _path = '/api/lua/fb' + encodeURIComponent(`/src/${fbname}/${filename}`);
    return $lua().get(_path, {
        params: {
            client: client,
        },
    });
}

export { getLuaIndex, getLua };
