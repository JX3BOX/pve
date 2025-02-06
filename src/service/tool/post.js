import { $cms } from "@jx3box/jx3box-common/js/https";

export function getMyPost(params) {
    return $cms().get("/api/cms/posts/my", {
        params: params,
    });
}

export function getPosts(params) {
    return $cms().get("/api/cms/posts", {
        params,
    });
}

export function getPost(id) {
    return $cms().get(`/api/cms/post/${id}`);
}

export function getMyPostCount() {
    return $cms().get("/api/cms/posts/user/my/count");
}

export function getIsSuperAuthor(uid) {
    return $cms().get(`/api/cms/user/is_super_author/${uid}`);
}
