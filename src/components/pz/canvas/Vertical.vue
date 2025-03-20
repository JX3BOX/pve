<!-- 竖版 -->
<template>
    <div>
        <canvas
            class="m-overview-vertical"
            id="overview-vertical"
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
            default: "vertical",
        },
        schema: {
            type: Object,
            default: () => {},
        },
    },
    components: {},
    data: function () {
        return {
            canvas: "",
            canvas_width: 750,
            canvas_height: 3468,
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
            return this.schema_client === "std" ? "奇穴" : "镇派";
        },
        id: function () {
            return this.schema?.id;
        },
        root_url: function () {
            return this.schema_client === "std" ? __Root : __OriginRoot;
        },
        isCangJian: function () {
            return isCangJian(this.mount);
        },
        title: function () {
            return this.schema?.title?.slice(0, 12) || this.mount_name + "配装";
        },
        prefix() {
            return this.schema_client == "std" ? "www" : "origin";
        },
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
            this.canvas = new fabric.StaticCanvas("overview-vertical");

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
                    direction: "vertical",
                },
            });
        },
        drawBg: function () {
            // 背景
            CanvasTools.drawBackground(this.canvas, "vertical", this.school_name);
        },
        drawHead: function () {
            const mount = this.isCangJian ? (this.schema?.is_tertiary ? "10145" : "10144") : this.mount;
            // 心法图标
            CanvasTools.drawMount(
                this.canvas,
                mount,
                {
                    left: this.canvas_width * 0.5,
                    originX: "center",
                    top: 128,
                    scale: 0.8,
                },
                "plus"
            );
            // 装分
            CanvasTools.drawText(this.canvas, `${this.schema?.overview?.score || "-"}`, {
                left: this.canvas_width * 0.5,
                top: 260,
                fill: "#000", //colors_by_mount_name[this.mount_name],
                fontSize: 30,
                lineHeight: 1,
                fontFamily: "Calibri",
                fontWeight: "600",
                originX: "center",
            });
        },
        drawHeader: function () {
            let center_point = this.canvas_width * 0.5;
            // 配装标题
            let title = this.title;
            CanvasTools.drawText(this.canvas, title, {
                left: center_point,
                top: 330,
                originX: "center",
                fill: "#fff",
                // fontFamily: "楷体",
                fontSize: 30,
            });
            // 作者
            let fz_author = 18;
            let basic_offsetY = 390;
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
                start_x: 62,
                start_y: 480,
                item_width: 145.5, // 元素宽度
                item_height: 100, // 元素高度
                item_margin: 15, // 元素间隔
                fz_number: 32,
                fz_number_w: 17.595,
                fz_desc: 16,
                number_add_top: -10,
                desc_add_top: 20,
                fz_percent: 22,
                percent_add_top: 2,
            });
        },
        drawTalent: function () {
            // 获取奇穴、镇派配装编码
            let pzcode = this.schema?.talent_pzcode;
            if (!pzcode || !pzcode.length) return;
            if (this.schema_client == "std") {
                CanvasTools.drawTalent(this.canvas, pzcode, {
                    start_x: 0,
                    start_y: 940,
                    box_width: this.canvas_width,
                    icon_size: 48,
                });
            } else {
                CanvasTools.drawTalent2(this.canvas, pzcode, {
                    start_x: 0,
                    start_y: 940,
                    box_width: this.canvas_width,
                    icon_size: 48,
                });
            }
            // 抬头文字
            CanvasTools.drawText(this.canvas, this.talent_label, {
                left: this.canvas_width * 0.5,
                top: 862,
                fill: "#fff",
                fontSize: 16,
                lineHeight: 1,
                originX: "center",
                fontWeight: "bold",
            });
        },
        drawEquips: function () {
            CanvasTools.drawText(this.canvas, "装备", {
                left: this.canvas_width * 0.5,
                top: 1162,
                fill: "#fff",
                fontSize: 16,
                lineHeight: 1,
                originX: "center",
                fontWeight: "bold",
            });

            let [unit_width, unit_height] = [640, 150];
            CanvasTools.drawEquips(this.canvas, this.overview?.equips, {
                mode: "vertical",

                top: 1169,
                left: 55,

                equip_width: unit_width,
                equip_height: unit_height,

                icon: {
                    size: 96,
                    left: -unit_width * 0.5,
                    top: 0,
                    originY: "center",
                    client: this.schema_client,
                },
                special: {
                    left: -unit_width * 0.5 - 22,
                    top: -28,
                    originY: "center",
                },
                name: {
                    left: 120,
                    top: 35,
                    fontSize: 20,
                    fontWeight: "normal",
                },
                level: {
                    fontSize: 14,
                },
                attr: {
                    fontSize: 16,
                    top: 70,
                },
                enhance: {
                    size: 28,
                    left: 120,
                    top: -unit_height * 0.5 + 35,
                    fontOffsetY: 3,
                    originX: "right",
                    originY: "top",
                },
                enchant: {
                    left: 120,
                    top: -unit_height * 0.5 + 35 + 30,
                    fontOffsetY: 33,
                    originX: "right",
                    originY: "top",
                },
                embedding: {
                    left: 120,
                    top: 98,
                    size: 24,
                    margin: 5,
                },
                stone: {
                    size: 24,
                    left: 97,
                    top: -9,
                },
            });
        },
        drawMetas: function () {
            let url = this.id ? `${this.root_url}pz/view/${this.id}` : `${this.root_url}pz`;
            CanvasTools.drawMetas(this.canvas, {
                canvas_width: this.canvas_width,
                mode: "vertical",
                link: {
                    url,
                    fill: "#fff",
                    left: this.canvas_width * 0.5,
                    top: this.canvas_height - 70,
                    fontSize: 13,
                    fontFamily: "Trebuchet MS",
                    originY: "bottom",
                    originX: "center",
                },
                cpr: {
                    text: `© JX3BOX魔盒配装器`,
                    fill: "#fff",
                    left: this.canvas_width * 0.5,
                    top: this.canvas_height - 100,
                    fontSize: 18,
                    originY: "bottom",
                    originX: "center",
                },
                qrcode: {
                    scale: 1,
                    left: this.canvas_width * 0.5,
                    top: this.canvas_height - 140,
                    originY: "bottom",
                    originX: "center",
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
