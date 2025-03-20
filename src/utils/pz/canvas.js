import { fabric } from "fabric";
import { __iconPath } from "@jx3box/jx3box-common/data/jx3box.json";
import lodash from "lodash";
import { showAttributeValue } from "@/utils/pz/tools.js";
import axios from "axios";
import { __imgPath, __ossMirror } from "@jx3box/jx3box-common/data/jx3box.json";

// 设置背景图 ${name}读node_modules\@jx3box\jx3box-data\data\xf\relation.json
function drawBackground(canvas, mode, name) {
    let url = __ossMirror + `static/pz/img/overview/${mode}/${name}.png`;
    let defaultUrl = __ossMirror + `static/pz/img/overview/${mode}/默认.png`;
    axios
        .get(url, {
            responseType: "arraybuffer",
        })
        .then((res) => {
            const base64 = Buffer.from(res.data, "binary").toString("base64");
            url = "data:image/png;base64," + base64;

            canvas.setBackgroundImage(url, canvas.renderAll.bind(canvas));
        })
        .catch((error) => {
            console.warn(`Warn: ${name}.png not found`, error);
            axios
                .get(defaultUrl, {
                    responseType: "arraybuffer",
                })
                .then((res) => {
                    const base64 = Buffer.from(res.data, "binary").toString("base64");
                    defaultUrl = "data:image/png;base64," + base64;

                    canvas.setBackgroundImage(defaultUrl, canvas.renderAll.bind(canvas));
                });
        });
}

// 设置心法图标
function drawMount(canvas, mount, opt, size = "mini") {
    let url = require(`@/assets/img/pz/mount/${size}/${mount}.png`);
    fabric.Image.fromURL(
        url,
        function (oImg) {
            if (opt.scale) oImg.scale(opt.scale);
            oImg.set(opt);
            canvas.add(oImg);
        },
        {
            crossOrigin: "anonymous",
        }
    );
}

// 设置文字
function drawText(canvas, str, opt) {
    let text = new fabric.Text(str, opt);
    canvas.add(text);
    return text;
}

// 设置水平居中文字
function drawCenterText(canvas, str, opt) {
    let rect = new fabric.Rect({
        fill: "transparent",
        // fill:getRandomRGBA(),
        originX: "center",
        originY: "center",
        width: opt.width,
        height: opt.height,
    });
    let _opt = lodash.omit(opt, ["width", "height", "left", "top"]);
    Object.assign(_opt, { originX: "center", originY: "center" });
    let text = new fabric.Text(str, _opt);
    let group = new fabric.Group([rect, text], {
        left: opt.left,
        top: opt.top,
    });
    canvas.add(group);
    group.text = text;
    return group;
}

// 设置图标
function drawIcon(iconId, opt, callback) {
    // 区分正式服&怀旧服图标
    let prefix = opt.client && opt.client == "origin" ? "origin_" : "";
    let url = __iconPath + prefix + "icon/" + iconId + ".png";

    axios
        .get(url, {
            responseType: "arraybuffer",
        })
        .then((res) => {
            const base64 = Buffer.from(res.data, "binary").toString("base64");
            url = "data:image/png;base64," + base64;

            // url = URL.createObjectURL(res.data);
            const img = new Image();
            // img.crossOrigin = "anonymous";
            img.src = url;
            img.onload = function () {
                const oImg = new fabric.Image(img);
                if (opt.size) oImg.scale(opt.size / 48);
                oImg.set(opt);
                callback && callback(oImg);
                // URL.revokeObjectURL(url);

                // fabric.Image.fromURL(
                //     url,
                //     function (oImg) {
                //         if (opt.size) oImg.scale(opt.size / 48);
                //         oImg.set(opt);
                //         callback && callback(oImg);
                //         URL.revokeObjectURL(url);
                //     },
                //     {
                //         crossOrigin: "anonymous",
                //     }
                // );
            };
        });
}

// 设置本地图像
function drawLocalImage(path, opt, callback) {
    let url = require(`@/assets/img/pz/${path}`);
    fabric.Image.fromURL(
        url,
        function (oImg) {
            oImg.set(opt);
            if (callback) callback(oImg);
        },
        {
            crossOrigin: "anonymous",
        }
    );
}

// 设置头像
async function drawAvatar(canvas, url, opt) {
    try {
        url = url.replace(/^http:\/\//i, "https://");
        const res = await axios.get(url, { responseType: "arraybuffer" });
        const base64 = Buffer.from(res.data, "binary").toString("base64");
        url = "data:image/png;base64," + base64;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;

        img.onload = function () {
            const oImg = new fabric.Image(img);
            oImg.set(opt);
            let scale = Math.min(68 / img.width, 68 / img.height);
            oImg.scale(scale / 2);
            canvas.add(oImg);
            canvas.sendToBack(oImg);
        };
    } catch (e) {}
}

// 渲染天赋
function drawTalent(canvas, pzcode, setting) {
    // 内容分组
    let len = pzcode.length; //项目数
    let group_len = Math.ceil(len / 2); //每一行画的个数
    // let row_up = pzcode.slice(0, group_len); //第一排
    // let row_down = pzcode.slice(group_len, len); //第二排

    // 坐标原点
    let start_x = setting.start_x;
    let start_y = setting.start_y;

    // 尺寸定义
    const icon_size = setting.icon_size; //图标大小
    const item_margin = 10; //项目间距
    const text_margin_top = 6; //文字与图片间距
    const text_size = 12; //文字尺寸
    const line_margin_top = 12; //行间距
    const basic_offsetY = 0; //Y轴基准偏移量
    const second_offsetY = icon_size + text_margin_top + text_size + line_margin_top; //第二行Y轴基准偏移量

    // 居中对齐
    const container_width = setting.box_width;
    let render_width = group_len * (icon_size + item_margin) - item_margin;
    let offsetX = (container_width - render_width) / 2;

    pzcode.forEach((item, i) => {
        let _offsetY = i >= group_len ? second_offsetY : 0; //最终Y轴偏移量
        let _i = i >= group_len ? i - group_len : i; //当前行所在索引
        drawIcon(
            item.icon,
            {
                left: start_x + _i * icon_size + _i * item_margin + offsetX,
                top: start_y + basic_offsetY + _offsetY,
                size: icon_size,
            },
            function (oImg) {
                canvas.add(oImg);
            }
        );
        drawCenterText(canvas, item.name && item.name.slice(0, 2), {
            fontSize: text_size,
            fill: "#fff",
            left: start_x + _i * (icon_size + item_margin) + offsetX,
            top: start_y + basic_offsetY + icon_size + text_margin_top + _offsetY,
            width: icon_size,
            height: text_size,
        });
    });
}

function drawTalent2(canvas, pzcode, setting) {
    // 内容分组
    pzcode = pzcode.filter((item) => item.id && item.level);
    let len = pzcode.length; //项目数
    let group_len = Math.ceil(len / 2);

    // 坐标原点
    let start_x = setting.start_x;
    let start_y = setting.start_y;

    // 尺寸定义
    const icon_size = setting.icon_size; //图标大小
    const item_margin = 10; //项目间距
    const text_margin_top = 6; //文字与图片间距
    const text_size = 12; //文字尺寸
    const line_margin_top = 12; //行间距
    const offsetY = icon_size + text_margin_top + text_size + line_margin_top; //Y轴基准偏移量

    // 居中对齐
    const container_width = setting.box_width;
    let render_width = group_len * (icon_size + item_margin) - item_margin;
    let offsetX = (container_width - render_width) / 2;

    pzcode.forEach((item, i) => {
        let _offsetY = offsetY * Math.floor(i / group_len); //最终Y轴偏移量
        let _i = Math.floor(i % group_len); //当前行所在索引
        drawIcon(
            item.icon,
            {
                left: start_x + _i * icon_size + _i * item_margin + offsetX,
                top: start_y + _offsetY,
                size: icon_size,
                client: "origin",
            },
            function (oImg) {
                canvas.add(oImg);
                canvas.sendToBack(oImg);
            }
        );
        drawText(canvas, item.name && item.name.slice(0, 2), {
            fontSize: text_size,
            fill: "#fff",
            left: start_x + _i * icon_size + _i * item_margin + offsetX + (icon_size - text_size) / 4,
            top: start_y + _offsetY + icon_size + text_margin_top,
        });
        drawText(canvas, String(item.level), {
            fontSize: 14,
            fill: "#00ff00",
            fontWeight: "bold",
            fontFamily: "Arial",
            // stroke : "#ffff00",showAttributeValue
            left: start_x + _i * icon_size + _i * item_margin + offsetX + icon_size,
            top: start_y + _offsetY,
            originX: "right",
        });
    });
}

// 构建十二格属性数据
import { overview_attrs } from "@/assets/data/pz/overview_attrs";

function buildAttributes(data) {
    let { client, mount, attrs } = data;
    // 属性
    let mountAttrs = [];
    if (client === "std") {
        // std
        mountAttrs = overview_attrs[mount]
            .filter((attr) => attr.key !== "hitPercent")
            .map((attr) => {
                attr.value = showAttributeValue(attr.key, attrs[attr.key]);
                return attr;
            });
    } else {
        // origin
        mountAttrs = overview_attrs[mount]
            .filter((attr) => attr.key !== "surplus")
            .map((attr) => {
                attr.key = attr.key;
                attr.value = showAttributeValue(attr.key, attrs[attr.key]);
                return attr;
            });
    }
    // console.log("mountAttrs", mountAttrs, attrs);
    return mountAttrs;
}

function drawAttributes(canvas, data, setting) {
    let start_x = setting.start_x; //起始横坐标
    let start_y = setting.start_y; //起始纵坐标
    const len = 4; // 每行个数
    const item_width = setting.item_width; // 元素宽度
    const item_height = setting.item_height; // 元素高度
    const item_margin = setting.item_margin; // 元素间隔
    const fz_number = setting.fz_number;
    const fz_desc = setting.fz_desc;
    const fz_percent = setting.fz_percent;

    data.forEach((item, i) => {
        let _i = Math.floor(i % len); // 当前行所在索引
        let offsetX = _i * item_width + _i * item_margin;
        let offsetY = Math.floor(i / len) * (item_height + item_margin);

        if (item.key.endsWith("Percent")) {
            let $number = drawCenterText(canvas, item.value, {
                fontSize: fz_number,
                fill: "#fff",
                left: offsetX + start_x - fz_percent / 2,
                top: offsetY + start_y + setting.number_add_top,
                fontFamily: "Calibri",
                // textBackgroundColor: "rgb(0,200,0)",
                width: item_width,
                height: item_height,
            });
            let number_width = $number.text.width;
            drawCenterText(canvas, "%", {
                fontSize: fz_percent,
                fill: "#fff",
                left: offsetX + start_x + number_width / 2,
                top: offsetY + start_y + setting.number_add_top + setting.percent_add_top,
                fontFamily: "Arial",
                // originX: "center",
                width: item_width,
                height: item_height,
            });
        } else {
            drawCenterText(canvas, item.value, {
                fontSize: fz_number,
                fill: "#fff",
                left: offsetX + start_x,
                top: offsetY + start_y + setting.number_add_top,
                fontFamily: "Calibri",
                // textBackgroundColor: "rgb(0,200,0)",
                width: item_width,
                height: item_height,
            });
        }

        drawCenterText(canvas, item.label, {
            fontSize: fz_desc,
            fill: "#fff",
            left: offsetX + start_x,
            top: offsetY + start_y + setting.desc_add_top,
            width: item_width,
            height: item_height,
        });
    });
}

// 装备数据构建
import { equip_attributes } from "@/assets/data/pz/equip_settings.js";
import equip_map from "@/assets/data/pz/equip_map.json";

function stringifyAttrs(attrs) {
    let str = "";
    attrs?.forEach((attr, i) => {
        str += equip_attributes[attr] + " ";
    });
    return str;
}

function buildEquipData(overview_equips) {
    // 准备重新排列
    const order = [
        "HAT",
        "JACKET",
        "BELT",
        "WRIST",
        "BOTTOMS",
        "SHOES",
        "NECKLACE",
        "PENDANT",
        "RING_1",
        "RING_2",
        "SECONDARY_WEAPON",
        "PRIMARY_WEAPON",
        "TERTIARY_WEAPON",
    ];
    // 提取关键数据
    let data = [];
    let raw = overview_equips;
    if (!raw) return;

    for (let item of order) {
        let equip = raw[item];

        // 如果部位不存在，除藏剑外，无重剑
        if (!equip || !equip.name) continue;

        // 五行石数据处理:排除空插槽
        let embedding = equip.embedding.map((item) => {
            if (!!~~item) return item;
        });
        if (!embedding.length) embedding = null;

        // 解析数据
        let _equip = {
            icon: equip.icon,
            quality: equip.quality,
            is_max_strength: equip.strength == equip.max_strength_level,
            is_special: equip.is_special,
            name: equip.name,
            strength: equip.strength,
            level: equip.level,
            attrs: stringifyAttrs(equip.attrs),
            position: equip_map[item]["label"],
            embedding: embedding,
            enchant: equip.enchant,
            enhance: equip.enhance,
            stone: equip.stone,
            stone_icon: equip.stone_icon,
        };

        data.push(_equip);
    }
    return data;
}

// 单个装备渲染
function drawEquip(canvas, equip, i, setting) {
    // 单元容器
    // ============================
    // 单个矩形容器
    const rect = new fabric.Rect({
        width: setting.equip_width, //单个装备宽度
        height: setting.equip_height, //单个装备高度
        // fill: getRandomRGBA(0.5), //测试定位色
        fill: "transparent",
    });
    // 组合全部元素
    let elements = new fabric.Group([rect], {
        top: i * setting.equip_height,
        left: 0,
    });

    // 装备图标
    // ============================
    // 装备图片
    drawIcon(equip.icon, setting.icon, function (oImg) {
        canvas.sendToBack(oImg);
        elements.add(oImg);
    });
    // 装备框
    let frame = `quality/${setting.mode}/4.png`;
    let frameMax = `quality/${setting.mode}/4-max.png`;
    let frameGolden = `quality/${setting.mode}/5.png`;
    let frame_url = equip.quality == 5 ? frameGolden : equip.is_max_strength ? frameMax : frame;
    drawLocalImage(frame_url, setting.icon, function (oImg) {
        canvas.bringToFront(oImg);
        elements.add(oImg);
    });
    // 稀有标注
    if (equip.is_special) {
        let sp_url = `quality/${setting.mode}/sp.png`;
        drawLocalImage(sp_url, setting.special, function (oImg) {
            canvas.bringToFront(oImg);
            elements.add(oImg);
        });
    }

    // 文字渲染
    // ============================
    // 名称
    let $name = new fabric.Text(
        equip.name.slice(0, 10) + ` (${equip.strength})`,
        Object.assign(getTextBasicPoint(setting.name.left, setting.name.top, setting), {
            fontSize: setting.name.fontSize,
            fontWeight: setting.name.fontWeight,
            fill: "#fff",
            lineHeight: 1,
        })
    );
    // 属性
    let $attr = new fabric.Text(
        `${equip.level} ${equip.attrs}`,
        Object.assign(getTextBasicPoint(setting.name.left, setting.attr.top, setting), {
            fill: "#eee",
            fontSize: setting.attr.fontSize,
            lineHeight: 1,
        })
    );
    // 部位
    if (setting.mode == "horizontal") {
        let $position = new fabric.Text(
            `${equip.position}`,
            Object.assign(getTextBasicPoint(260, setting.name.top, setting), {
                fill: "#fff",
                fontSize: setting.position.fontSize,
                lineHeight: 1,
            })
        );
        elements.add($position);
    }

    // 图文混排
    // ============================
    // 小附魔
    if (equip.enhance) {
        let $enhance = new fabric.Text(`${equip.enhance || ""}`, {
            fill: "#eee",
            fontSize: setting.attr.fontSize,
            originX: "left",
            originY: "top",
            left: setting.enhance.left + 5,
            top: -setting.equip_height * 0.5 + setting.name.top + setting.enhance.fontOffsetY,
            // fontFamily: "黑体",
        });
        let icon = `enhance/${setting.mode}/enhance.png`;
        drawLocalImage(icon, setting.enhance, function (oImg) {
            canvas.bringToFront(oImg);
            elements.add(oImg);
        });
        elements.add($enhance);
    }
    // 大附魔
    if (equip.enchant) {
        let $enchant = new fabric.Text(`${equip.enchant || ""}`, {
            fill: "#eee",
            fontSize: setting.attr.fontSize,
            originX: "left",
            originY: "top",
            left: setting.enhance.left + 5,
            top: -setting.equip_height * 0.5 + setting.name.top + setting.enchant.fontOffsetY,
            // fontFamily: "黑体",
        });
        let icon = `enhance/${setting.mode}/enchant.png`;
        drawLocalImage(icon, setting.enchant, function (oImg) {
            canvas.bringToFront(oImg);
            elements.add(oImg);
        });
        elements.add($enchant);
    }
    // 五行石
    if (equip.embedding) {
        equip.embedding.forEach((embedding, i) => {
            if (~~embedding) {
                let url = require(`@/assets/img/pz/embeddings/${setting.mode}/${embedding}.png`);
                fabric.Image.fromURL(url, function (oImg) {
                    oImg.set({
                        left:
                            -setting.equip_width * 0.5 +
                            setting.embedding.left +
                            i * (setting.embedding.size + setting.embedding.margin),
                        top: -setting.equip_height * 0.5 + setting.embedding.top,
                        originY: "top",
                        originX: "left",
                    });
                    canvas.bringToFront(oImg);
                    elements.add(oImg);
                });
            }
        });
    }
    // 五彩石
    if (equip.stone) {
        let $stone = new fabric.Text(`${equip.stone || ""}`, {
            fill: "#eee",
            fontSize: setting.attr.fontSize,
            originX: "left",
            originY: "top",
            left: setting.enhance.left + 5,
            top: -setting.equip_height * 0.5 + setting.name.top + setting.enchant.fontOffsetY,
            fontFamily: "黑体",
        });
        drawIcon(equip.stone_icon, setting.stone, function (oImg) {
            canvas.bringToFront(oImg);
            elements.add(oImg);
        });
        elements.add($stone);
    }

    bulkAddElements(elements, [$name, $attr]);

    return elements;
}

// 获取文字在组合中的基准坐标（常规参考系，默认使用中央参考系）
function getTextBasicPoint(x, y, setting) {
    return {
        originX: "left", //文字左侧与中心对齐
        left: x - setting.equip_width * 0.5,

        originY: "top", //文字顶部与中心对齐
        top: y - setting.equip_height * 0.5,
    };
}

// 组合批量添加元素
function bulkAddElements(elements, arr) {
    for (let item of arr) {
        elements.add(item);
    }
}

// 批量装备渲染
function drawEquips(canvas, overview_equips, setting) {
    // 构建数据
    let data = buildEquipData(overview_equips);

    // 遍历渲染
    let equips = [];
    data.forEach((item, i) => {
        // 单个装备渲染
        let equip = drawEquip(canvas, item, i, setting);
        equips.push(equip);
    });
    // 整体定位
    let group = new fabric.Group(equips, {
        left: setting.left,
        top: setting.top,
    });

    canvas.add(group);
}

import QRCode from "qrcode";

// 杂项信息
function drawMetas(canvas, setting) {
    // let rect = new fabric.Rect({ width: 1281, height: 80, fill: "#24292e", left: -1, top: 800, originY: "bottom" });
    // canvas.add(rect);
    // canvas.sendToBack(rect);

    // let line = new fabric.Line([0, 1280, 1280, 1280], { left: 0, top: 720, stroke: "#AFABAD" });
    // canvas.add(line);
    // canvas.bringToFront(line);

    // if (setting.mode == "vertical") {
    //     let rect = new fabric.Rect({ width: setting.canvas_width, height: 70, fill: "#000", left: -1, top: 3396, originY: "top" });
    //     canvas.add(rect);
    //     canvas.sendToBack(rect);
    // }

    drawText(canvas, setting.link.url, setting.link);
    drawText(canvas, setting.cpr.text, setting.cpr);
    if (setting.cpr_icon) {
        drawText(canvas, "©", setting.cpr_icon);
    }

    QRCode.toDataURL(setting.link.url, function (err, url) {
        fabric.Image.fromURL(url, function (oImg) {
            oImg.scale(setting.qrcode.scale);
            oImg.set(setting.qrcode);
            canvas.add(oImg);
        });
    });
}

// 导出信息
function exportData(canvas) {
    let data = canvas.toDataURL({
        format: "png",
        multiplier: 2,
    });
    return data;
}

export {
    drawBackground,
    drawMount,
    drawText,
    drawIcon,
    drawLocalImage,
    drawTalent,
    drawTalent2,
    drawAttributes,
    buildAttributes,
    drawCenterText,
    drawAvatar,
    drawEquips,
    drawMetas,
    exportData,
};
