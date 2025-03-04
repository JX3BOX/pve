import User from "@jx3box/jx3box-common/js/user";

const defaultPkg = {
    name: "", // 数据名
    status: 0, // 状态 0公开 1私有
    client: location.href.includes("origin") ? "origin" : "std", // 客户端 std origin
    lang: "cn", // 语言 cn tr
    title: "", // 标题
    pkg_tag: [], // 标签
    notice: "", // 特别说明
    desc: "", // 补充说明
    remark: "", // 备注
    comment: 0, // 评论开关 0开启 1关闭
    comment_visible: 0, // 评论可见 0所有人可见 1仅自己可见
    allow_gift: 1, // 打赏开关 0关闭 1开启
    is_raw: 0, // 0云数据 1本地数据
    type: 1, // 1团队监控 2目标监控
};

const extendPkg = {
    file: "",
    items: {
        BUFF: "",
        DEBUFF: "",
        CASTING: "",
        NPC: "",
        DOODAD: "",
        TALK: "",
        CHAT: "",
    },
    pkg_meta: {
        szAuthor: User.getInfo().name,
        szServer: "",
        szLang: "zhcn",
        szOfficialVoicePacketUUID: "",
        szCustomVoicePacketUUID: "",
    },
    modules: [],
    total_items: 0,
    total_modules: 0,
};

const itemsFields = ["BUFF", "DEBUFF", "CASTING", "NPC", "DOODAD", "TALK", "CHAT"];

export { defaultPkg, extendPkg, itemsFields };
