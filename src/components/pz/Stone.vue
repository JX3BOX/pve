<template>
    <div class="m-pz-stone">
        <div class="u-active-stone" v-if="activeStone">
            <span class="u-stone-icon">
                <img :src="activeStone.icon | iconLink" :alt="activeStone.Name" />
            </span>
            <span class="u-stone-name" :class="'stoneLevel-' + activeStone.stone_level">{{ activeStone.Name }}</span>
            <el-button class="u-clear" icon="el-icon-delete" size="small" type="text" @click="reset"></el-button>
        </div>

        <el-button @click="showDialog" size="small" :disabled="!equip">
            <i class="el-icon-house"></i> 选择五彩石
        </el-button>
        <el-dialog :visible.sync="visible" title="五彩石选择" custom-class="m-pz-stone-dialog" append-to-body>
            <div class="m-pz-stone-container">
                <div class="m-stone-form">
                    <!-- 表单 -->
                    <el-form label-position="left" label-width="100px">
                        <h2 class="u-title">
                            <i class="el-icon-s-operation"></i> 指定匹配
                            <el-checkbox class="u-match" v-model="matchMount" size="mini">匹配心法</el-checkbox>
                        </h2>
                        <el-form-item label="第一属性">
                            <el-select v-model="form.t1" clearable filterable size="small">
                                <el-option
                                    v-for="t1 in stoneOptions.t1box"
                                    :key="t1.value"
                                    :value="t1.value"
                                    :label="t1.label + ' (' + t1.remark + ') '"
                                    v-show="!matchMount || (matchMount && checkQuickStoneVisible(t1))"
                                >
                                    <div class="m-stone-select-option">
                                        <b class="u-label">{{ t1.label }}</b>
                                        <span class="u-remark">({{ t1.remark }})</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="第二属性">
                            <el-select v-model="form.t2" clearable filterable size="small">
                                <el-option
                                    v-for="t2 in stoneOptions.t2box"
                                    :key="t2.value"
                                    :value="t2.value"
                                    :label="t2.label + ' (' + t2.remark + ') '"
                                    v-show="!matchMount || (matchMount && checkQuickStoneVisible(t2))"
                                >
                                    <div class="m-stone-select-option">
                                        <b class="u-label">{{ t2.label }}</b>
                                        <span class="u-remark">({{ t2.remark }})</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="第三属性">
                            <el-select v-model="form.t3" clearable filterable size="small">
                                <el-option
                                    v-for="t3 in stoneOptions.t3box"
                                    :key="t3.value"
                                    :value="t3.value"
                                    :label="t3.label + ' (' + t3.remark + ') '"
                                    v-show="!matchMount || (matchMount && checkQuickStoneVisible(t3))"
                                >
                                    <div class="m-stone-select-option">
                                        <b class="u-label">{{ t3.label }}</b>
                                        <span class="u-remark">({{ t3.remark }})</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>

                    <!-- 快捷 -->
                    <div class="m-stone-qkmode">
                        <h2 class="u-title"><i class="el-icon-s-operation"></i> 快捷组合</h2>
                        <el-checkbox-group v-model="attrs" :max="3">
                            <div v-for="(item, i) in stone_label" :key="'stone_attr' + i">
                                <div v-if="item.value == 'placeholder'" class="u-placeholder"></div>
                                <el-checkbox
                                    v-else
                                    class="u-stone-qkitem"
                                    v-show="checkQuickStoneVisible(item)"
                                    :label="item.value"
                                    >{{ item.remark }}</el-checkbox
                                >
                            </div>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="m-stone-list" v-loading="loading">
                    <h2 class="u-title"><i class="el-icon-position"></i> 五彩石选择</h2>
                    <el-radio-group v-model="form.level" size="small">
                        <el-radio-button size="small" v-for="level in levels" :label="level.value" :key="level.value">{{
                            level.label
                        }}</el-radio-button>
                    </el-radio-group>
                    <el-input placeholder="请输入内容" v-model="form.search" class="u-search" size="small">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <div class="u-box">
                        <div class="u-list" v-if="stonesList.length">
                            <div class="u-item" v-for="stone in stonesList" :key="stone.ID">
                                <StoneItem
                                    :key="stone.ID"
                                    :stone="stone"
                                    @click.native="stoneClick(stone)"
                                    @cancelSelect="cancelSelect"
                                    :selectedStone="selectedStone"
                                >
                                    <span class="u-stone-remark">{{ showStoneRemark(stone._Attrs) }}</span>
                                </StoneItem>
                            </div>
                        </div>
                        <el-pagination
                            class="u-pages"
                            small
                            layout="prev, pager, next,total"
                            :total="total"
                            :hide-on-single-page="true"
                            :current-page.sync="page"
                        ></el-pagination>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import stone_box from "@/assets/data/pz/stone_box.json";
import stone_label from "@/assets/data/pz/stone_label.json";
import stone_attrs from "@/assets/data/pz/stone_attrs.json";
import { getStones } from "@/service/pz/game";
import { mapGetters } from "vuex";
import StoneItem from "./StoneItem.vue";
export default {
    name: "Stone",
    components: {
        StoneItem,
    },
    data() {
        return {
            // 弹窗
            visible: false,
            loading: false,
            form: {
                t1: "",
                t2: "",
                t3: "",
                search: "",
                level: 6,
            },
            levels: [
                {
                    label: "壹级",
                    value: 1,
                },
                {
                    label: "贰级",
                    value: 2,
                },
                {
                    label: "叁级",
                    value: 3,
                },
                {
                    label: "肆级",
                    value: 4,
                },
                {
                    label: "伍级",
                    value: 5,
                },
                {
                    label: "陆级",
                    value: 6,
                },
            ],

            // 本地
            selectedStone: "",
            activeStone: "",
            matchMount: true,

            // 自由组合
            attrs: [],

            // 结果
            stonesList: [],
            total: 0,
            page: 1,
            per: 8,
        };
    },
    computed: {
        ...mapGetters(["schema_client", "activeEquip", "equip", "mount"]),
        stoneOptions: function () {
            return stone_box[this.schema_client];
        },
        query: function () {
            let _query = {
                ...this.form,
                client: this.schema_client,
                page: this.page,
                per: this.per,
            };
            if (this.attrs.length) {
                _query.attrs = this.attrs.join(",");
            }
            return _query;
        },
        stone: function () {
            return this.$store.state.snapshot?.[this.activeEquip]?.stone;
        },
        stone_label: function () {
            return this.schema_client == "origin" ? stone_label["origin"] : stone_label["std"];
        },
    },
    watch: {
        query: {
            deep: true,
            handler() {
                this.loadStones();
            },
        },
        stone: {
            deep: true,
            immediate: true,
            handler(val) {
                this.activeStone = val;
            },
        },
    },
    methods: {
        checkQuickStoneVisible: function (item) {
            return !item.mounts?.length || item.mounts.includes(~~this.mount);
        },
        showDialog: function () {
            this.visible = true;
        },
        showStoneRemark: function (attrs) {
            let str = "";
            for (let attr of attrs) {
                if (stone_attrs[attr]) {
                    str += stone_attrs[attr] + "·";
                }
            }
            return str.slice(0, -1);
        },
        loadStones: function () {
            this.loading = true;
            getStones(this.query)
                .then((res) => {
                    this.stonesList = res.data?.list;
                    this.total = res.data?.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        stoneClick: function (stone) {
            this.selectedStone = stone;
        },
        cancelSelect: function () {
            this.selectedStone = "";
        },
        confirm: function () {
            // 本地UI
            this.activeStone = this.selectedStone;
            this.visible = false;
            // 修改方案&快照
            this.$store.commit("Sync", {
                prop: "stone",
                data: {
                    content: this.activeStone.ID,
                    snapshot: this.activeStone,
                },
            });
        },
        reset: function () {
            this.activeStone = "";
            // 修改方案&快照
            this.$store.commit("Sync", {
                prop: "stone",
                data: {
                    content: "",
                    snapshot: "",
                },
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/pz/stone.less";
</style>
