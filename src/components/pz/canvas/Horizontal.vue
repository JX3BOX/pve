<!-- 横板 -->
<template>
    <div>
        <canvas
            class="m-overview-horizontal"
            id="overview-horizontal"
            :width="canvas_width"
            :height="canvas_height"
        ></canvas>
        <el-button type="primary" class="m-overview-save" icon="el-icon-download" @click="save">保存图片</el-button>
    </div>
</template>

<script>
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import { mount_belong_school } from "@jx3box/jx3box-data/data/xf/relation.json";
import * as CanvasTools from "@/utils/pz/canvas.js";
import { fabric } from "fabric";
import { __Root, __OriginRoot } from "@jx3box/jx3box-common/data/jx3box.json";
import { isCangJian } from "@/utils/pz/game.js";
import { reportNow } from "@jx3box/jx3box-common/js/reporter";

export default {
    name: "OverviewHorizontal",
    props: {
        mode: {
            type: String,
            default: "horizontal",
        },
        schema: {
            type: Object,
            default: () => {},
        },
    },
    data: function () {
        return {
            canvas: "",
            canvas_width: 1280,
            canvas_height: 720,
        };
    },
    computed: {
        mount: function () {
            return this.schema?.mount;
        },
        attrs: function () {
            return this.schema?.overview?.attrs;
        },
        schema_client: function () {
            return this.schema?.client;
        },
        mount_name: function () {
            return xfid[this.mount];
        },
        school_name: function () {
            return mount_belong_school[this.mount_name];
        },
        overview: function () {
            return this.schema?.overview;
        },
        talent_label: function () {
            return this.schema_client == "std" ? "奇穴" : "镇派";
        },
        id: function () {
            return this.schema?.id;
        },
        root_url: function () {
            return this.schema_client == "std" ? __Root : __OriginRoot;
        },
        isCangJian: function () {
            return isCangJian(this.mount);
        },
        title: function () {
            return this.schema?.title?.slice(0, 12) || this.mount_name + "配装";
        },
        prefix() {
            return this.schema_client == "std" ? "www" : "origin";
        }
    },
    watch: {
        schema: {
            deep: true,
            handler(val) {
                if (val && Object.keys(val).length) {
                    this.init();
                }
            },
        },
    },
    methods: {
        init: function () {
            this.canvas = new fabric.StaticCanvas("overview-horizontal");
            this.drawBg();
            this.drawHead();
            this.drawHeader();
            this.drawAttrs();
            this.drawTalent();
            this.drawEquips();
            this.drawMetas();
        },
        save: function () {
            let url = CanvasTools.exportData(this.canvas);
            const a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
            a.href = url;
            a.download = `${this.title}.png`;
            a.click();

            reportNow({
                caller: "pz_image_save",
                data: {
                    href: `${this.prefix}:/pz/view/${this.id}`,
                    direction: "horizontal"
                }
            })
        },
        drawBg: function () {
            // 背景
            CanvasTools.drawBackground(this.canvas, "horizontal", this.school_name);
        },
        drawHead: function () {
            const mount = this.isCangJian ? (this.schema?.is_tertiary ? "10145" : "10144") : this.mount;
            // 心法图标
            CanvasTools.drawMount(this.canvas, mount, {
                left: 85,
                top: 62,
                originX: "center",
            });
            // 装分
            CanvasTools.drawText(this.canvas, `${this.schema?.overview?.score || "-"}`, {
                left: 86,
                top: 122,
                fill: "#000", //colors_by_mount_name[this.mount_name],
                fontSize: 18,
                lineHeight: 1,
                fontFamily: "Calibri",
                originX: "center",
            });
        },
        drawHeader: function () {
            let center_point = 170 + 400 / 2;
            // 配装标题
            let title = this.title;
            CanvasTools.drawText(this.canvas, title, {
                left: center_point,
                top: 50,
                originX: "center",
                fill: "#fff",
                // fontFamily: "楷体",
                fontSize: 32,
            });
            // 作者
            let fz_author = 18;
            let basic_offsetY = 110;
            let fz_uid = 16;
            let avatar_size = 34;
            let author = this.schema?.pz_author_info?.display_name || "匿名";
            let $author = CanvasTools.drawText(this.canvas, author, {
                left: center_point,
                top: basic_offsetY,
                originX: "center",
                fill: "#fff",
                // fontFamily: "楷体",
                fontSize: fz_author,
            });
            let uid = `(UID:${this.schema?.user_id})`;
            let $uid = CanvasTools.drawText(this.canvas, uid, {
                left: center_point + $author.width / 2 + 10,
                top: basic_offsetY - (fz_author - fz_uid) / 2,
                fill: "#999",
                fontFamily: "Trebuchet MS",
                fontSize: fz_uid,
            });
            // 头像
            let avatar = this.schema?.pz_author_info?.user_avatar;
            CanvasTools.drawAvatar(this.canvas, avatar, {
                top: basic_offsetY - (avatar_size - fz_author) / 2,
                left: center_point - $author.width / 2 - 10,
                originX: "right",
            });
        },
        drawAttrs: function () {
            if (!this.overview || !this.overview.attrs) return;
            let data = CanvasTools.buildAttributes({
                client: this.schema_client,
                mount: this.mount,
                attrs: this.overview.attrs,
            });
            CanvasTools.drawAttributes(this.canvas, data, {
                start_x: 70,
                start_y: 180,
                item_width: 116, // 元素宽度
                item_height: 65, // 元素高度
                item_margin: 12, // 元素间隔
                fz_number: 24,
                fz_number_w: 13.2,
                number_add_top: -12,
                fz_desc: 14,
                desc_add_top: 14,
                fz_percent: 16,
                percent_add_top: 3,
            });
        },
        drawTalent: function () {
            // 获取奇穴、镇派配装编码
            let pzcode = this.schema?.talent_pzcode;
            if (!pzcode || !pzcode.length) return;
            if (this.schema_client == "std") {
                CanvasTools.drawTalent(this.canvas, pzcode, {
                    start_x: 70,
                    start_y: 480,
                    box_width: 498,
                    icon_size: 38,
                });
            } else {
                CanvasTools.drawTalent2(this.canvas, pzcode, {
                    start_x: 70,
                    start_y: 480,
                    box_width: 498,
                    icon_size: 38,
                });
            }
            // 抬头文字
            CanvasTools.drawText(this.canvas, this.talent_label, {
                left: 320,
                top: 426,
                fill: "#fff",
                fontSize: 18,
                lineHeight: 1,
                originX: "center",
                fontWeight: "bold",
            });
        },
        drawEquips: function () {
            let [unit_width, unit_height] = [526, 49];
            CanvasTools.drawEquips(this.canvas, this.overview?.equips, {
                mode: this.mode,

                left: 680,
                top: 41,

                equip_width: unit_width,
                equip_height: unit_height,

                icon: {
                    size: 38,
                    left: -unit_width * 0.5 + 27,
                    top: 0,
                    originY: "center",
                    originX: "left",
                    client: this.schema_client,
                },
                special: {
                    left: -unit_width * 0.5 + 8,
                    top: -4,
                    originY: "center",
                },
                name: {
                    left: 72,
                    top: 8,
                    fontSize: 14,
                    fontWeight: "bold",
                },
                position: {
                    fontSize: 12,
                },
                level: {
                    fontSize: 10,
                },
                attr: {
                    fontSize: 12,
                    top: 28,
                },
                enhance: {
                    size: 18,
                    left: 120,
                    top: -unit_height * 0.5 + 8 - 3,
                    fontOffsetY: -1,
                    originX: "right",
                    originY: "top",
                },
                enchant: {
                    left: 120,
                    top: -unit_height * 0.5 + 8 + 17,
                    fontOffsetY: 19,
                    originX: "right",
                    originY: "top",
                },
                embedding: {
                    left: 260,
                    top: 25,
                    size: 18,
                    margin: 3,
                },
                stone: {
                    size: 18,
                    left: 102,
                },
            });
        },
        drawMetas: function () {
            let url = this.id ? `${this.root_url}pz/view/${this.id}` : `${this.root_url}pz`;
            CanvasTools.drawMetas(this.canvas, {
                link: {
                    url,
                    fill: "#fff",
                    left: 90,
                    top: this.canvas_height - 20,
                    fontSize: 13,
                    fontFamily: "Trebuchet MS",
                    originY: "bottom",
                },
                cpr: {
                    text: `©JX3BOX魔盒配装器`,
                    fill: "#fff",
                    left: 90,
                    top: this.canvas_height - 45,
                    fontSize: 14,
                    fontFamily: "黑体",
                    originY: "bottom",
                },
                qrcode: {
                    scale: 0.4,
                    left: 15,
                    top: this.canvas_height - 15,
                    originY: "bottom",
                },
            });
        },
    },
    mounted: function () {
        if (this.schema) {
            this.init();
        }
    },
};
</script>
