<template>
    <div class="m-maps">
        <div class="m-maps-pic" v-if="!mapId">
            <dragWrap :data="scale" @change="wrapScaleChange">
                <div class="m-map__world">
                    <template v-for="(item, id) in maps">
                        <div
                            class="u-map"
                            v-if="!(item.szDisplayName.includes('战乱') || item.szDisplayName.includes('乱世'))"
                            :key="id"
                            :style="`left:${item.Left || 0}px;top:${item.Top || 0}px`"
                            @click="showChild(item, id)"
                            @touchstart="showChild(item, id)"
                        >
                            <div
                                class="u-map-city_name"
                                :style="{
                                    transform: `scale(${worldMapTextScale})`,
                                }"
                            >
                                <img
                                    class="u-item_bg"
                                    :style="{
                                        opacity: visible && selectMapOptions.actId == id ? 1 : 0,
                                    }"
                                    :src="getIcon('newworldmap_03_10')"
                                />
                                <span class="u-item_text">{{ item.szDisplayName }}</span>
                            </div>
                            <!-- 暂时无用图标 -->
                            <img class="u-map-city_img" :src="item.szButtonShowImg" draggable="false" />
                        </div>
                    </template>
                    <img
                        class="u-img"
                        :src="map"
                        @click="visible = false"
                        @touchstart="visible = false"
                        alt="世界地图"
                    />
                    <img class="u-traffic" :src="traffic" alt="交通路线" />
                </div>
            </dragWrap>

            <!-- 世界地图选择弹框 -->
            <div
                class="m-select-box"
                :class="{
                    'm-select-box__hide': !visible,
                }"
            >
                <div class="m-select__item">
                    <div class="u-item-title">
                        <img class="u-img" :src="getIcon('newworldmap_03_39')" />
                        <span class="u-text">周边城镇</span>
                    </div>
                    <div class="m-select-arrow-box" v-if="selectMapCityOptions.maxCurrent">
                        <img
                            v-if="selectMapCityOptions.current != 1"
                            @click="selectMapChange('after', 'city')"
                            class="u-item-arrow u-item-arrow_left"
                            :src="getIcon('newworldmap_03_29')"
                        />
                        <img
                            v-else
                            class="u-item-arrow u-item-arrow_left u-item-arrow_dis"
                            :src="getIcon('newworldmap_03_31')"
                        />
                    </div>
                    <div class="u-item-option">
                        <template v-for="(item, index) in selectMap.city">
                            <div
                                v-if="index >= selectMapCityOptions.after && index < selectMapCityOptions.before"
                                class="u-item"
                                :key="index"
                                @click="showMap(item)"
                                :style="{
                                    backgroundImage: `url(${getIcon('newworldmap_03_33')})`,
                                }"
                            >
                                <img class="u-img" :src="item.szButtonShowImg" />
                                <span class="u-text">{{ item.szShowName || item.szComment }}</span>
                            </div>
                        </template>
                    </div>
                    <div class="m-select-arrow-box" v-if="selectMapCityOptions.maxCurrent">
                        <img
                            v-if="selectMapCityOptions.current != selectMapCityOptions.maxCurrent"
                            @click="selectMapChange('before', 'city')"
                            class="u-item-arrow u-item-right"
                            :src="getIcon('newworldmap_03_25')"
                        />
                        <img
                            v-else
                            class="u-item-arrow u-item-right u-item-arrow_dis"
                            :src="getIcon('newworldmap_03_28')"
                        />
                    </div>
                </div>
                <div class="m-select__item" v-if="selectMap.fb.length">
                    <div class="u-item-title">
                        <img class="u-img" :src="getIcon('newworldmap_03_39')" />
                        <span class="u-text">周边秘境</span>
                    </div>
                    <div class="m-select-arrow-box" v-if="selectMapOptions.maxCurrent">
                        <img
                            v-if="selectMapOptions.current != 1"
                            @click="selectMapChange('after', 'fb')"
                            class="u-item-arrow u-item-arrow_left"
                            :src="getIcon('newworldmap_03_29')"
                        />
                        <img
                            v-else
                            class="u-item-arrow u-item-arrow_left u-item-arrow_dis"
                            :src="getIcon('newworldmap_03_31')"
                        />
                    </div>
                    <div class="u-item-option">
                        <template v-for="(item, index) in selectMap.fb">
                            <div
                                v-if="index >= selectMapOptions.after && index < selectMapOptions.before"
                                class="u-item"
                                :key="index"
                                @click="showMap(item)"
                                :style="{
                                    backgroundImage: `url(${getIcon('newworldmap_03_33')})`,
                                }"
                            >
                                <img class="u-img" :src="item.szButtonShowImg" />
                                <span class="u-text">{{ item.szShowName || item.szComment }}</span>
                            </div>
                        </template>
                    </div>
                    <div class="m-select-arrow-box" v-if="selectMapOptions.maxCurrent">
                        <img
                            v-if="selectMapOptions.current != selectMapOptions.maxCurrent"
                            @click="selectMapChange('before', 'fb')"
                            class="u-item-arrow u-item-right"
                            :src="getIcon('newworldmap_03_25')"
                        />
                        <img
                            v-else
                            class="u-item-arrow u-item-right u-item-arrow_dis"
                            :src="getIcon('newworldmap_03_28')"
                        />
                    </div>
                </div>
            </div>
            <!-- 世界地图资源展示 -->
            <div
                class="m-resource-box"
                :class="{
                    'm-resource-box__hide': !visible,
                }"
                v-if="selectMap.city.length"
            >
                <template v-for="(val, key) in natural[selectMap.city[0].dwMapID]">
                    <div class="m-resource__item" :key="key">
                        <div class="u-item__title">
                            <span>{{ key }}</span>
                        </div>
                        <div class="u-item__list" v-for="(item, index) in val" :key="index">
                            <span>{{ item }}</span>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="m-map-other" v-else>
            <img class="m-map-other_img" :src="currentMap" />
        </div>
        <div class="m-toolbar">
            <h1 class="m-maps__title">{{ title }}</h1>
            <el-input size="small" v-model="search" clearable>
                <template slot="prepend">地图</template>
            </el-input>
            <div class="u-world-map" @click="changeWorldMap">世界地图</div>
            <div :class="[{ mapId }, 'm-mapList']">
                <div
                    v-for="item in showList"
                    :key="item.ID"
                    :label="item.MapName"
                    :value="item.ID"
                    @click="changeMap(item.ID)"
                    :class="['u-item', { active: item.ID == mapId }]"
                >
                    {{ item.MapName }}
                </div>
            </div>
        </div>

        <!-- 移动端查看所有地图信息 -->
        <div class="m-mobile-layout">
            <div class="m-mobile-header">
                <h1 class="m-mobile_maps__title">{{ title }}</h1>
                <div @click="mobileMapListDrawer = true" class="m-drawer_open">
                    所有地图
                    <i class="el-icon-search el-icon--right"></i>
                </div>
            </div>
            <div class="m-mobile-toolbar">
                <el-drawer title="所有地图" :visible.sync="mobileMapListDrawer">
                    <div class="m-m-drawer-body">
                        <el-input size="small" v-model="search" clearable>
                            <template slot="prepend">地图</template>
                        </el-input>
                        <div
                            class="m-m-drawer-map m-m-item"
                            @click="
                                mobileMapListDrawer = false;
                                changeWorldMap();
                            "
                        >
                            世界地图
                        </div>
                        <div :class="[{ mapId }, 'm-m-mapList']">
                            <div
                                v-for="item in mapsList"
                                :key="item.ID"
                                :label="item.MapName"
                                :value="item.ID"
                                @click="
                                    mobileMapListDrawer = false;
                                    changeMap(item.ID);
                                "
                                :class="['m-m-item', { active: item.ID == mapId }]"
                            >
                                {{ item.MapName }}
                            </div>
                        </div>
                    </div>
                </el-drawer>
            </div>
        </div>
    </div>
</template>

<script>
import { getWorldMap, getMaps } from "@/service/tool/maps.js";
import { extractTextContent } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import dragWrap from "./dragWrap.vue";
import { uniqBy, keyBy } from "lodash";
export default {
    name: "Map",
    components: { dragWrap },
    data() {
        return {
            loading: false,
            mapId: 0,
            city: [],
            fb: [],
            maps: [],
            mapsList: [],
            search: "",

            children: [],
            visible: false,
            scale: { x: -122, y: -1400, scale: 0.35 },

            selectMap: {
                city: [],
                fb: [],
            },
            selectMapOptions: {
                current: 1,
                maxCurrent: 0,
                after: 0,
                before: 0,
            },
            selectMapCityOptions: {
                current: 1,
                maxCurrent: 0,
                after: 0,
                before: 0,
            },
            mobileMapListDrawer: false,
            isPhone: window.innerWidth < 720 ? true : false,
            isIpad: window.innerWidth < 1133 ? true : false,
            natural: {},
            worldMapTextScale: 1,
        };
    },
    computed: {
        currentMap() {
            return `${__imgPath}map/maps/map_${this.mapId}_0.png`;
        },
        map() {
            return `${__imgPath}topic/pic/map.jpg`;
        },
        traffic() {
            return `${__imgPath}topic/pic/traffic.png`;
        },
        client() {
            return this.$store.state.client;
        },
        _search() {
            return {
                "no-page": 1,
                "field-no-null-only": "Tip",
                fields: "Tip,ID,MapName,MapType",
            };
        },
        showList() {
            return this.search ? this.mapsList.filter((item) => item.MapName.indexOf(this.search) > -1) : this.mapsList;
        },
        title() {
            return this.mapId ? this.mapsList.filter((item) => item.ID == this.mapId)[0].MapName : "世界地图";
        },
    },
    mounted() {
        this.load(true);
        this.wrapScaleChange(this.scale.scale);
    },
    methods: {
        changeMap(mapId) {
            this.visible = false;
            this.mapId = mapId || 0;
        },
        showMap({ dwMapID }) {
            this.changeMap(dwMapID);
        },
        changeWorldMap() {
            this.mapId = 0;
            this.search = "";
            this.scale = { ...this.$options.data().scale, map: Math.random() };
        },
        load(firstLoad) {
            this.loading = true;
            getWorldMap()
                .then((res) => {
                    const { zoning, city, copy } = res.data.data || [];
                    this.city = city || [];
                    this.fb = copy || [];
                    this.maps = zoning
                        .filter((item) => item.szDisplayName)
                        .map((item) => {
                            item.szButtonShowImg = this.getGoMapImg(item);
                            return item;
                        });
                })
                .finally(() => {
                    this.loading = true;
                });
            getMaps(this._search).then((res) => {
                const list = res.data.data.list || [];
                this.mapsList = list.reverse();
                list.length && this.trNatural(list);

                if (firstLoad && this.isPhone && this.mapsList.length) {
                    this.changeMap(this.mapsList[0].ID);
                }
            });
        },
        trNatural(data) {
            const list = keyBy(data, "ID");
            const result = {};
            for (const key in list) {
                if (list.hasOwnProperty(key)) {
                    // 将tips单独解析出来
                    let tip = extractTextContent(list[key]["Tip"])[0]?.text + "";
                    tip = tip.replace(/\\/g, "");
                    // 以折行分组
                    const _list = tip.split("n").filter(Boolean);
                    // // 找到对应的索引位置
                    const _result = {};
                    let mineralIndex = _list.indexOf("矿物：");
                    let herbIndex = _list.indexOf("草药：");
                    let grassIndex = _list.indexOf("牧草：");
                    // 根据索引截取数组
                    _result["矿物"] = _list.slice(mineralIndex + 1, herbIndex);
                    _result["草药"] =
                        grassIndex === -1 ? _list.slice(herbIndex + 1) : _list.slice(herbIndex + 1, grassIndex);
                    if (grassIndex !== -1) {
                        _result["牧草"] = _list.slice(grassIndex + 1);
                    }
                    // 将返回的数组替换tip
                    result[key] = _result;
                }
            }
            this.natural = result;
        },
        showChild({ szChildCityMaps, szChildCopyMaps, Left, Top }, itemIndex) {
            // 定位地图位置到当前选择位置
            if (this.isIpad) {
                this.scale = { x: 4920 - Left - 2550, y: 3456 - Top - 3150, scale: 1 };
            } else {
                this.scale = { x: 4920 - Left - 2444, y: 3456 - Top - 3150, scale: 1 };
            }
            this.wrapScaleChange(this.scale.scale);
            let city = [];
            let fb = [];
            if (szChildCityMaps && szChildCityMaps.length) {
                city = this.city.filter((item) => szChildCityMaps.includes(item.dwMapID));
            }
            if (szChildCopyMaps && szChildCopyMaps.length) {
                fb = this.fb.filter((item) => szChildCopyMaps.includes(item.dwMapID));
            }
            const children = city.concat(fb).filter((item) => item.szComment) || [];
            if (children.length) {
                this.children = uniqBy(children, "dwMapID");
                let newChildren = { city: [], fb: [] };
                children.forEach((item) => {
                    item.szButtonShowImg = this.getGoMapImg(item);
                    if ("szVersion" in item) {
                        newChildren.fb.push(item);
                    } else {
                        newChildren.city.push(item);
                    }
                });
                this.selectMap = newChildren;
                // 计算秘境是否可以左右切换
                const defaultNum = this.isIpad ? 4 : 6;
                let intervalValue = Math.max(defaultNum - this.selectMap.city.length, 1);
                // 处理 selectMapOptions
                if (this.selectMap.fb.length > intervalValue) {
                    this.selectMapOptions = {
                        current: 1,
                        maxCurrent: Math.ceil(this.selectMap.fb.length / intervalValue),
                        value: intervalValue,
                        after: 0,
                        before: intervalValue,
                    };
                } else {
                    this.selectMapOptions = {
                        after: 0,
                        before: this.selectMap.fb.length,
                        maxCurrent: 0,
                    };
                }
                // 处理 selectMapCityOptions
                const cityIntervalValue = Math.min(2, this.selectMap.city.length);
                if (this.selectMap.city.length > 2) {
                    this.selectMapCityOptions = {
                        current: 1,
                        maxCurrent: Math.ceil(this.selectMap.city.length / 2),
                        value: cityIntervalValue,
                        after: 0,
                        before: cityIntervalValue,
                    };
                } else {
                    this.selectMapCityOptions = {
                        after: 0,
                        before: this.selectMap.city.length,
                        maxCurrent: 0,
                    };
                }
                this.selectMapOptions.actId = itemIndex;
                this.visible = true;
            }
        },
        selectMapChange(type, from) {
            const optionsToUpdate = from === "city" ? this.selectMapCityOptions : this.selectMapOptions;
            if (type === "after") {
                optionsToUpdate.current--;
                optionsToUpdate.after -= optionsToUpdate.value;
                optionsToUpdate.before -= optionsToUpdate.value;
            } else if (type === "before") {
                optionsToUpdate.current++;
                optionsToUpdate.after += optionsToUpdate.value;
                optionsToUpdate.before += optionsToUpdate.value;
            }
        },
        wrapScaleChange(scale) {
            const A1 = 0.35;
            const B1 = 2.35;
            const A2 = 1;
            const B2 = 1;
            const m = (B2 - B1) / (A2 - A1);
            const b = B1 - m * A1;
            this.worldMapTextScale = m * (scale * 1) + b;
        },
        getGoMapImg(itemData) {
            let finalResult = "";
            if (itemData.szButtonImg.includes(".UITex")) {
                finalResult = itemData.szButtonImg
                    .substring(itemData.szButtonImg.indexOf("NewWorldMap"), itemData.szButtonImg.lastIndexOf(".UITex"))
                    .concat("_", itemData.nFrame);
            } else {
                finalResult = `NewWorldMap/fb/${itemData.szButtonImg}`;
            }
            const lowercaseString = finalResult.toLowerCase();
            return `${__imgPath}map2/std/${lowercaseString}.png`;
        },
        getIcon(key) {
            return `${__imgPath}map2/std/newworldmap/${key}.png`;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/tool/design/map.less";
</style>
