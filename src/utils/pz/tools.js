import colors from "@jx3box/jx3box-data/data/xf/colors.json";
import mount_equip from "@jx3box/jx3box-data/data/xf/mount_equip.json";

const copyText = (text, message, ctx) => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            ctx.$notify({
                type: "success",
                title: "复制成功",
                message,
            });
            ctx.hasCopy = true;
        });
    } else {
        const copyDom = document.createElement("textarea");
        copyDom.value = text;
        document.body.appendChild(copyDom);
        copyDom.style.top = "-999999999px";
        copyDom.style.left = "-9999999999px";

        copyDom.select();

        const success = document.execCommand("copy");

        if (success) {
            ctx.$notify({
                type: "success",
                title: "复制成功",
                message,
            });
            ctx.hasCopy = true;
        }

        document.body.removeChild(copyDom);
    }
};

function getRandomRGBA(opacity = 1) {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},${opacity})`;
}

function showAttributeValue(key, val) {
    if (val) {
        if (key.endsWith("Percent")) {
            return (val * 100).toFixed(2); // + "%";
        }
        if (key === "life" && val > 100000) {
            return (val / 10000).toFixed(2) + "w";
        }
        return String(val);
    } else {
        return "0";
    }
}

// hex2rgb
function hexToRgb(hex) {
    let rgb = [];
    for (let i = 1; i < 7; i += 2) {
        rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
    }
    return rgb;
}

function getMountColor(mount){
    return colors.colors_by_school_name[mount_equip[mount]?.school_name];
}

const removeEmpty = (obj) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
            newObj[key] = obj[key];
        }
    });
    return newObj;
}

export { copyText, getRandomRGBA, showAttributeValue, hexToRgb, getMountColor, removeEmpty };
