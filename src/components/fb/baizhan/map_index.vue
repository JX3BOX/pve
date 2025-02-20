<template>
    <div class="p-map" v-loading="loading" ref="container">
        <el-button class="u-phone-download" icon="el-icon-download" @click="exportToImage">下载</el-button>
        <div class="m-boss-list" :class="list.length % 2 ? 'is-odd' : 'is-even'" ref="map" @click="cancelClick">
            <!-- <el-button class="u-download" icon="el-icon-download" @click="exportToImage"></el-button> -->
            <div
                class="u-step"
                :class="currentBoss.dwBossID ? 'has-info' : ''"
                v-for="(item, stepIndex) in list"
                :key="stepIndex"
            >
                <div
                    class="u-floor"
                    :class="[
                        floor.nEffectID ? 'is-effect' : '',
                        floor.dwBossID === currentBoss.dwBossID ? 'is-info' : '',
                        getCurrentStyle(floor, stepIndex * row + index + 1),
                    ]"
                    v-for="(floor, index) in item"
                    :key="index"
                    @click.stop="setBossHandler(stepIndex * row + index + 1)"
                >
                    <div class="u-floor-content">
                        <div class="u-index" :class="floor.nEffectID && 'u-effect'">
                            {{ stepIndex * row + index + 1 }}
                        </div>
                        <div class="u-img">
                            <img :src="getBossAvatar(floor.dwBossID)" :alt="floor.bossName || '未知'" />
                        </div>
                        <div class="u-name" :class="currentBossName === floor.bossName && 'is-current'">
                            {{ floor.bossName }}
                        </div>
                        <div
                            v-if="
                                getEffectInfo(effects, floor.nEffectID, 'tags').length ||
                                getEffectInfo(effects, floor.nEffectID, 'reward')
                            "
                            class="u-desc"
                        >
                            <div v-if="getEffectInfo(effects, floor.nEffectID, 'tags').length" class="u-sketch">
                                <div
                                    class="u-sketch-info"
                                    v-for="(tag, si) in getEffectInfo(effects, floor.nEffectID, 'tags')"
                                    :key="si"
                                >
                                    {{ tag }}
                                </div>
                            </div>
                            <div v-if="getEffectInfo(effects, floor.nEffectID, 'reward')" class="u-coin">
                                <img class="u-coin-img" src="@/assets/img/fb/baizhan/coin.svg" svg-inline />
                                <span>{{ getEffectInfo(effects, floor.nEffectID, "reward") }}</span>
                            </div>
                        </div>
                        <!-- <div v-if="floor.nEffectID" class="u-icon">
                            <img :src="getEffectInfo(effects, floor.nEffectID)" />
                        </div> -->
                    </div>
                    <i class="u-info-icon el-icon-arrow-up"></i>
                    <i class="u-info-icon el-icon-arrow-down"></i>
                </div>
            </div>
        </div>
        <!-- <img :src="canvas" alt="" /> -->
    </div>
</template>

<script>
import { mapState } from "vuex";
import { arr1to2, isPhone, isQQ, isWeChat } from "@/utils";
// import { getWeekStartDate, getWeekEndDate } from "@/utils/dateFormat";
import { getEffectInfo } from "@/assets/js/baizhan";
import { cloneDeep } from "lodash";
import html2canvas from "html2canvas";
import { moment } from "@jx3box/jx3box-common/js/moment";
import { effectsFilter } from "@/assets/data/fb/baizhan_effects.js";
export default {
    name: "BaizhanMap",
    inject: ["__imgRoot"],
    data() {
        return {
            loading: false,
            data: [],
            point: {
                level: 1,
                boss: "",
                effect: 0,
            },
            scale: 1,
        };
    },
    computed: {
        ...mapState({
            step: (state) => state.baizhan.step,
            row: (state) => state.baizhan.row,
            bosses: (state) => state.baizhan.bosses,
            effects: (state) => state.baizhan.effects,
            maps: (state) => state.baizhan.maps,
            currentBoss: (state) => state.baizhan.currentBoss,
            currentBossName: (state) => state.baizhan.currentBossName,
            currentEffect: (state) => state.baizhan.currentEffect,
            downLoading: (state) => state.baizhan.downLoading,
            mapFilterInit: (state) => state.baizhan.mapFilterInit,
        }),
        currentEffectIds() {
            return this.currentEffect?.ids || [];
        },
        list() {
            const data = cloneDeep(this.data);
            return arr1to2(data, this.row);
        },
        update_moment() {
            return moment(this.$store.state.baizhan.map.updated_at);
        },
        duration() {
            return {
                start: this.update_moment.startOf("week").format("MM/DD"),
                end: this.update_moment.endOf("week").format("MM/DD"),
            };
        },
        initQuery() {
            return {
                maps: this.maps,
                index: ~~this.$route.query?.floor,
            };
        },
    },
    watch: {
        maps: {
            immediate: true,
            deep: true,
            handler(list) {
                if (!list.length) return false;
                this.setData(list);
            },
        },
        downLoading(bol) {
            if (bol) {
                this.exportToImage();
            }
        },
        initQuery: {
            immediate: true,
            deep: true,
            handler(query) {
                const i = query.index;
                const maps = query.maps;
                if (i > 0 && maps.length && i <= maps.length) {
                    const boss = maps[i - 1];
                    this.setBoss(boss, i);
                }
            },
        },
    },
    methods: {
        getCurrentStyle(floor, index) {
            const indexes = [10, 20, 30, 40, 50, 60];
            if (this.mapFilterInit === "init") {
                return indexes.includes(index) || effectsFilter[0].ids.includes(floor.nEffectID) ? "is-current" : "";
            } else {
                if (this.currentBossName && this.currentEffectIds.length) {
                    return (this.currentBossName === "精英首领"
                        ? indexes.includes(index)
                        : this.currentBossName === floor.bossName) && this.currentEffectIds.includes(floor.nEffectID)
                        ? "is-current"
                        : "";
                }
                return (
                    (!this.currentBossName && this.currentEffectIds.includes(floor.nEffectID) ? "is-current" : "") ||
                    (!this.currentEffectIds.length &&
                    (this.currentBossName === "精英首领"
                        ? indexes.includes(index)
                        : this.currentBossName === floor.bossName)
                        ? "is-current"
                        : "")
                );
            }
        },
        isPhone,
        cancelClick(event) {
            this.$store.commit("baizhan/setState", {
                key: "currentBoss",
                val: {},
            });
            return this.$router.push({ query: {} });
        },
        getBossAvatar(id) {
            const avatar = this.bosses.find((item) => item.id === id)?.avatar || `${this.__imgRoot}fbcdpanel02_51.png`;
            return avatar;
        },
        getEffectInfo,
        setBossHandler(i) {
            if (i === this.initQuery.index) {
                // this.$store.dispatch("baizhan/setInit", {});
                this.$store.commit("baizhan/setState", {
                    key: "currentBoss",
                    val: {},
                });
                return this.$router.push({ query: {} });
            }
            this.$router.push({ query: { floor: i } });
        },
        setBoss(floor, i) {
            let val = floor;
            if (floor.dwBossID === this.currentBoss?.dwBossID) {
                console.log(123);
                val = {};
            } else {
                val = Object.assign(floor, {
                    floor: i,
                });
            }
            // this.$store.dispatch("baizhan/setInit", val);
            this.$store.commit("baizhan/setState", {
                key: "currentBoss",
                val,
            });
        },
        setData(data) {
            const total = this.step * this.row;
            const point = cloneDeep(this.point);
            if (!data || data.length < total) {
                const list = new Array(total).fill(point);
                this.data = list;
            } else {
                this.data = data;
            }
            // this.currentFloor = this.data[0];
        },
        exportToImage() {
            if (isPhone() && (isWeChat() || isQQ())) {
                return this.$message({
                    message: "请在游览器中打开",
                    type: "warning",
                });
            }
            const map = this.$refs.map;
            this.loading = true;
            html2canvas(map, {
                useCORS: true,
                width: map.offsetWidth,
                height: map.offsetHeight,
                scale: 2,
            })
                .then((canvas) => {
                    this.createWatermark().then((waterCanvas) => {
                        const newCanvas = document.createElement("canvas");
                        const newCtx = newCanvas.getContext("2d");
                        newCanvas.width = map.offsetWidth * 2;
                        newCanvas.height = map.offsetHeight * 2;
                        newCtx.drawImage(canvas, 0, 0);
                        newCtx.drawImage(waterCanvas, 0, 0);
                        // this.canvas = newCanvas.toDataURL();
                        // 创建一个虚拟链接
                        const link = document.createElement("a");
                        link.href = newCanvas.toDataURL(); // 将 Canvas 转换为 Data URL
                        link.download = `魔盒百战${this.duration.start}至${this.duration.end}.png`; // 下载文件的名称

                        link.addEventListener("click", () => {
                            setTimeout(() => {
                                URL.revokeObjectURL(link.href); // 删除链接的资源
                            }, 100); // 延迟删除以确保下载完成

                            link.removeEventListener("click", () => {}); // 移除事件监听器
                            document.body.removeChild(link);
                        });
                        document.body.appendChild(link);
                        link.click();
                        this.loading = false;
                        this.$store.commit("baizhan/setState", {
                            key: "downLoading",
                            val: false,
                        });
                    });
                })
                .catch((error) => {
                    this.loading = false;
                    this.$store.commit("baizhan/setState", {
                        key: "downLoading",
                        val: false,
                    });
                    console.error("导出图片出错:", error);
                });
        },
        createWatermark() {
            return new Promise((resolve) => {
                const map = this.$refs.map;
                const canvas = document.createElement("canvas");
                canvas.width = map.offsetWidth * 2;
                canvas.height = map.offsetHeight * 2;
                const ctx = canvas.getContext("2d");

                // 绘制顶部文字
                ctx.font = `bold 48px Arial`;
                ctx.fillStyle = "#deddd3";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center"; // 设置居中对齐

                const topTxt = `百战异闻录 ${this.duration.start} 至 ${this.duration.end}`;
                const topTxtX = canvas.width / 2; // 居中位置
                const topTxtY = 30 * 1.5; // 垂直位置
                ctx.fillText(topTxt, topTxtX, topTxtY);

                const bottomTxt = "魔盒·百战查询 https://www.jx3box.com/fb/baizhan";
                ctx.font = `bold 30px Arial`;
                const txtBottomWidth = ctx.measureText(bottomTxt).width;
                const bottomTxtX = canvas.width - txtBottomWidth / 2 - 30 * 2;
                const bottomTxtY = canvas.height - topTxtY; // 垂直位置
                ctx.fillText(bottomTxt, bottomTxtX, bottomTxtY);

                // 绘制文字水印
                // const txt = "JX3BOX";
                const txt = "";
                const txtHeight = canvas.height / 6;
                const txtWidth = ctx.measureText(txt).width;
                const txtRepeat = Math.ceil(canvas.width / (txtWidth + 20)) * 2; // 添加间隔距离
                const txtRows = Math.ceil(canvas.height / (txtHeight + 20)) * 2; // 添加间隔距离
                ctx.font = `bold 12px Arial`;
                ctx.fillStyle = "#deddd31a";
                ctx.transform(1, 0.5, -0.5, 1, 0, -canvas.height / 2);
                for (let i = 0; i < txtRows; i++) {
                    for (let j = 0; j < txtRepeat; j++) {
                        const x = j * (txtWidth + 20); // 添加间隔距离
                        const y = i * (txtHeight + 20); // 添加间隔距离
                        ctx.fillText(txt, x, y);
                    }
                }

                // 加载本地图片
                const image = new Image();
                image.src = require("@/assets/img/fb/logo.svg");
                image.crossOrigin = "";
                image.onload = () => {
                    // 创建临时canvas用于处理图片
                    const imageSize = 30 * 2;
                    const tempCanvas = document.createElement("canvas");
                    tempCanvas.width = imageSize;
                    tempCanvas.height = imageSize;
                    const tempCtx = tempCanvas.getContext("2d");
                    tempCtx.drawImage(image, 0, 0, imageSize, imageSize);

                    // 获取图片的ImageData对象
                    const imageData = tempCtx.getImageData(0, 0, imageSize, imageSize);

                    // 修改图片颜色
                    const pixels = imageData.data;
                    for (let i = 0; i < pixels.length; i += 4) {
                        // 修改RGBA颜色值
                        pixels[i] = 255 - pixels[i]; // R
                        pixels[i + 1] = 255 - pixels[i + 1]; // G
                        pixels[i + 2] = 255 - pixels[i + 2]; // B
                    }

                    // 将修改后的ImageData对象绘制到canvas中
                    const textWidth = ctx.measureText(topTxt).width * 2; // 顶部文字的宽度
                    const padding = 10; // 图片与文字之间的间距
                    const imageX = topTxtX - textWidth - imageSize - padding;
                    ctx.putImageData(imageData, imageX, 15);

                    resolve(canvas);
                };
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/fb/baizhan/map.less";
</style>
