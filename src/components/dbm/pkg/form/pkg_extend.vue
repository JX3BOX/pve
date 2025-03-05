<template>
    <fold-block class="m-pkg-basic" name="extend" desc="扩展信息" icon="el-icon-collection-tag" :fold="false">
        <el-form-item label="公告" prop="notice">
            <el-input type="textarea" v-model="pkg.notice" :rows="4" placeholder="补充的重要内容"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tags" v-if="!isTarget && !isMark">
            <el-checkbox-group v-model="pkg.pkg_tag">
                <el-checkbox v-for="item in tags" :label="item" :key="item"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="标签" prop="tags" v-if="isTarget" class="m-pkg-app-item">
            <div class="w-select">
                <div class="u-select-label">门派</div>
                <el-select
                    class="u-select"
                    v-model="school"
                    placeholder="选择门派"
                    style="width: 252px; margin-right: 20px"
                    size="large"
                    clearable
                    multiple
                    popper-class="u-select__popper"
                    :collapse-tags="true"
                    filterable
                    @change="onTagChange"
                >
                    <el-option v-for="(item, index) in schoolid" :key="index" :label="item" :value="item">
                        <div class="u-select-item">
                            <img :src="showSchoolIcon(index)" class="u-select-icon" alt="" />
                            {{ item }}
                        </div>
                    </el-option>
                </el-select>
            </div>
            <div class="w-select">
                <div class="u-select-label">心法</div>
                <el-select
                    class="u-select"
                    v-model="xf"
                    placeholder="选择心法"
                    style="width: 252px"
                    size="large"
                    clearable
                    multiple
                    popper-class="u-select__popper"
                    :collapse-tags="true"
                    filterable
                    @change="onTagChange"
                >
                    <el-option v-for="(item, index) in xfid" :key="index" :label="item" :value="item">
                        <div class="u-select-item">
                            <img :src="showMountIcon(index)" class="u-select-icon" alt="" />
                            {{ item }}
                        </div>
                    </el-option>
                </el-select>
            </div>
        </el-form-item>
        <el-form-item label="地图" props="tags" v-if="isMark" class="m-pkg-map">
            <el-select
                v-model="map"
                filterable
                placeholder="请选择"
                clearable
                @change="onMapChange"
                multiple
                :collapse-tags="true"
                style="width: 320px"
            >
                <template v-for="index in mapKeys">
                    <el-option
                        :key="index"
                        v-if="index > 0 && ['DUNGEON', 'RAID'].includes(mapType[index])"
                        :label="mapIndex[index] + '(' + index + ')'"
                        :value="index"
                    >
                        <span class="u-label">{{ mapIndex[index] }}</span>
                        <span class="u-value">{{ index }}</span>
                    </el-option>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <el-input
                v-model="pkg.remark"
                size="large"
                placeholder="输入备注"
                show-word-limit
                :maxlength="30"
            ></el-input>
            <el-tooltip
                class="item"
                popper-class="u-name__tooltip"
                effect="dark"
                :content="tips.remark"
                placement="top"
            >
                <span class="u-desc"><i class="el-icon-question"></i></span>
            </el-tooltip>
        </el-form-item>
        <Tinymce v-model="pkg.desc" :attachmentEnable="true" :resourceEnable="true" />
    </fold-block>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { mapState } from "vuex";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import schoolid from "@jx3box/jx3box-data/data/xf/schoolid.json";
import { showMountIcon, showSchoolIcon } from "@jx3box/jx3box-common/js/utils";

//components
import FoldBlock from "@/components/dbm/common/fold_block.vue";
import Tinymce from "@jx3box/jx3box-editor/src/Tinymce";
export default {
    name: "PkgBasic",
    components: { FoldBlock, Tinymce },
    data() {
        return {
            tags: [],
            tips: {
                remark: "仅作为备注和搜索条件。",
            },

            school: [],
            schoolid,

            xf: [],
            xfid,

            map: [],
        };
    },
    computed: {
        ...mapState({
            pkg: "pkg",
            store_target_tags: "target_tags",
            store_mark_tags: "mark_map",

            mapKeys: "mapKeys",
            mapIndex: "mapIndex",
            mapType: "mapTypeIndex",
        }),
        user() {
            return User.getInfo();
        },
        isTarget() {
            return this.$route.name.includes("target");
        },
        isMark() {
            return this.$route.name.includes("mark");
        },
        target_tags() {
            return this.xf.concat(this.school);
        },
    },
    watch: {
        store_target_tags: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val?.length && this.isTarget) {
                    this.school = val.filter((item) => Object.values(schoolid).includes(item));
                    this.xf = val.filter((item) => Object.values(xfid).includes(item));
                }
            },
        },
        store_mark_tags: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val?.length && this.isMark) {
                    this.map = val;
                }
            },
        },
    },
    mounted() {
        !this.isTarget && this.loadTags();
    },
    methods: {
        showMountIcon,
        showSchoolIcon,
        loadTags() {
            try {
                const tags = sessionStorage.getItem("dbm_tags");
                if (tags) {
                    this.tags = tags.split(",");
                } else {
                    getBreadcrumb("dbm_tags").then((res) => {
                        sessionStorage.setItem("dbm_tags", res);
                        this.tags = res.split(",");
                    });
                }
            } catch (error) {
                console.log(error);
                this.tags = [];
            }
        },
        getAppContent() {
            return {
                school: this.school,
                xf: this.xf,
            };
        },
        onTagChange() {
            this.$store.commit("SET_TARGET_TAGS", this.target_tags);
        },
        onMapChange() {
            this.$store.commit("SET_MARK_MAP", this.map);
        },
    },
};
</script>

<style lang="less">
.m-pkg-app-item {
    .el-form-item__content {
        .flex;
        align-items: center;
    }
}
.u-select__popper {
    .u-select-item {
        .flex;
        align-items: center;
    }
    .u-select-icon {
        .size(28px);
        margin-right: 4px;
    }
}
</style>
