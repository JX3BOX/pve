import { $cms } from "@jx3box/jx3box-common/js/https";

function getMenuGroup(name) {
    return $cms({ mute: true }).get(`/api/cms/menu-group/${name}`);
}

function getBread(key) {
    return $cms({ mute: true }).get(`/api/cms/breadcrumb/${key}`);
}

function getSkillGroups(key) {
    return $cms({ mute: true }).get(`/api/cms/pvp/collection/group`, {
        params: {
            group: key,
        },
    });
}

function getMenuGroups(params) {
    return $cms({ mute: true }).get(`/api/cms/menu-group`, {
        params: params,
    });
}

export { getMenuGroup, getBread, getMenuGroups, getSkillGroups };
