<template>
    <li class="m-list-item--miniprogram">
        <div class="m-left">
            <img class="u-img" :src="getBanner(item.post_banner, item.post_subtype)" :key="item.ID" />
        </div>
        <div class="m-right m-info">
            <div class="m-header">
                <div class="u-title">
                    {{ item.post_title || "无标题" }}
                </div>
                <span class="u-label u-zlp" v-if="item.zlp">{{ item.zlp }}</span>
                <span class="u-label u-zlp u-wujie" v-if="item.is_wujie">无界</span>
            </div>
            <div class="m-bottom">
                <div class="m-auth">
                    <img class="u-avatar" :src="item.author_info | showAvatar" :alt="item.author_info | showNickname" />
                    <div class="u-name">{{ item.author_info | showNickname }}</div>
                </div>
                <div class="u-date">
                    <time v-if="order == 'update'">{{ item.post_modified | dateFormat }}</time>
                    <time v-else>{{ item.post_date | dateFormat }}</time>
                </div>
            </div>
        </div>
    </li>
</template>

<script>
import { showAvatar, authorLink, showBanner, buildTarget } from "@jx3box/jx3box-common/js/utils";
import { __ossMirror, __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import { showDate } from "@jx3box/jx3box-common/js/moment.js";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
export default {
    name: "ListItemMiniprogram",
    props: ["item", "order", "caller"],
    components: {},
    methods: {
        getBanner: function (val, subtype) {
            if (val) {
                if (val.endsWith(".webp") || val.endsWith(".gif")) {
                    return val;
                }
                return showBanner(val);
            } else {
                let img_name = (subtype && xfmap[subtype]?.["id"]) || 0;
                return __imgPath + "image/bps_thumbnail/" + img_name + ".png";
            }
        },
    },
    filters: {
        authorLink,
        showHighlight: function (val) {
            return val ? `color:${val};font-weight:600;` : "";
        },
        showAvatar: function (userinfo) {
            return showAvatar(userinfo?.user_avatar);
        },
        showNickname: function (userinfo) {
            return userinfo?.display_name || "匿名";
        },
        dateFormat: function (gmt) {
            return showDate(new Date(gmt));
        },
        xficon: function (val) {
            if (!val || val == "其它") val = "通用";
            let xf_id = xfmap[val] && xfmap[val]["id"];
            return __imgPath + "image/xf/" + xf_id + ".png";
        },
    },
};
</script>

<style lang="less">
.m-list-item--miniprogram {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    box-sizing: border-box;
    padding: 8px 0;

    .m-left,
    .m-right {
        flex: 1;
        max-width: calc(50% - 5px);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        align-self: stretch;
    }

    .m-left.m-info {
        padding: 4px 4px 0 0;
    }
    .m-right.m-info {
        padding: 4px 0 0 4px;
    }

    .m-center {
        max-width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 16px;
    }

    .m-header {
        box-sizing: border-box;
        max-width: 100%;
        gap: 8px;
    }

    .m-bottom {
        margin-top: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .u-date {
            color: var(--black-40, rgba(28, 28, 28, 0.4));
            font-size: 10px;
            font-style: normal;
            font-weight: 400;
            line-height: 15px;
        }
    }

    .u-img {
        width: 178px;
        height: 89px;
        flex-shrink: 0;
        float: 1;
        background: var(--primary-brand-2);
        border-radius: 8px;
        background: #dfdfdf;
        overflow: hidden;
    }

    .u-label {
            .fz(12px,1.2);
            .r(3px);
            .mr(5px);
            padding: 2px 5px;
        }
        .u-zlp {
            border: 1px solid #fa80a2;
            color: #fa80a2;
        }
        .u-wujie {
            border: 1px solid #00dcda;
            color: #3ae0f1;
            background: #eff;
        }

    .u-title {
        color: var(--black-80, rgba(28, 28, 28, 0.8));
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 150%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
        box-sizing: border-box;
        padding-bottom: 4px;
        &.no-intro {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }

    .m-auth {
        display: flex;
        align-items: center;
        .u-avatar {
            width: 12px;
            height: 12px;
            border-radius: 100%;
            margin-right: 4px;
        }

        .u-name {
            color: var(--black-40, rgba(28, 28, 28, 0.4));
            font-size: 10px;
            font-style: normal;
            font-weight: 400;
            line-height: 15px;
        }
    }
}
</style>
