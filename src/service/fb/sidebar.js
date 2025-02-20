import { $cms } from "@jx3box/jx3box-common/js/https";

function getNews(type, limit = 1) {
    return $cms({ mute: true })
        .get("/api/cms/news", {
            params: {
                type,
                limit,
                status: 1,
            },
        })
        .then((res) => {
            return res.data.data;
        });
}

export { getNews };
