<template>
    <fold-block
        class="m-pkg-mark__wrapper"
        name="type"
        desc="场景标记"
        icon="el-icon-map-location"
        :fold="false"
        :fixed="true"
    >
        <div class="m-pkg-mark">
            <table>
                <thead>
                    <tr>
                        <!-- <th class="u-op-column"></th> -->
                        <th>#</th>
                        <th>X 坐标</th>
                        <th>Y 坐标</th>
                        <th>Z 坐标</th>
                        <th>备注</th>
                        <!-- <th>图片</th> -->
                        <th class="u-op-column"></th>
                    </tr>
                </thead>
                <draggable
                    handle=".u-drag-arrow"
                    tag="tbody"
                    v-model="mark_data"
                    animation="200"
                    @start="drag = true"
                    @end="drag = false"
                >
                    <tr v-for="(item, index) in mark_data" :key="index">
                        <!-- <td>
                            <div class="u-table-ops">
                                <i class="u-drag-arrow el-icon-rank"></i>
                            </div>
                        </td> -->
                        <td>{{ Number(index) + 1 }}</td>
                        <td>
                            <el-input size="mini" v-model.number="item.x" placeholder="X 坐标"></el-input>
                        </td>
                        <td>
                            <el-input size="mini" v-model.number="item.y" placeholder="Y 坐标"></el-input>
                        </td>
                        <td>
                            <el-input size="mini" v-model.number="item.z" placeholder="Z 坐标"></el-input>
                        </td>
                        <td>
                            <el-input size="mini" v-model="item.remark" placeholder="备注"></el-input>
                        </td>
                        <!-- <td>
                            <el-upload
                                :action="API"
                                with-credentials
                                class="avatar-uploader"
                                :show-file-list="false"
                                :before-upload="beforeImgUpload"
                                :on-success="onUploadSuccess(index)"
                            >
                                <img v-if="item.img" :src="item.img" style="width: 48px; height: 48px" />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </td> -->
                        <td
                            ><el-button
                                class="u-btn-close"
                                icon="el-icon-close"
                                type="text"
                                @click="onRemoveItem(index)"
                            ></el-button
                        ></td>
                    </tr>
                </draggable>
            </table>
            <el-button
                class="u-add"
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="onAddItem"
                :disabled="mark_data.length >= 10"
                >增加标点</el-button
            >
        </div>
    </fold-block>
</template>

<script>
import FoldBlock from "@/components/dbm/common/fold_block.vue";
import { mapState } from "vuex";
// import User from "@jx3box/jx3box-common/js/user";
import { defaultMark } from "@/assets/data/dbm/default_mark.js";
import draggable from "vuedraggable";
import { __cms } from "@jx3box/jx3box-common/data/jx3box.json";

const API_Root = process.env.NODE_ENV === "production" ? __cms : "/";
const API = API_Root + "api/cms/upload";

export default {
    name: "PkgMark",
    components: { FoldBlock, draggable },
    data: () => ({
        drag: false,
        file: {},
        mark_data: [{ ...defaultMark }],

        API,
    }),
    computed: {
        ...mapState({
            pkg: "pkg",
            store_mark_data: "mark_data",
        }),
    },
    watch: {
        mark_data: {
            deep: true,
            handler(val) {
                if (!this.drag) {
                    this.$store.commit("SET_MARK_DATA", val);
                }
            },
        },
        store_mark_data: {
            deep: true,
            handler(val) {
                if (!this.drag) {
                    this.mark_data = val;
                }
            },
        },
    },
    methods: {
        onRemoveItem(index) {
            this.mark_data.splice(index, 1);
        },
        onAddItem() {
            this.mark_data.push({ ...defaultMark });
        },
        beforeImgUpload(file) {
            if (!file.type.includes("image")) {
                this.$message.error("上传文件必须是图片");
                return false;
            }
            return true;
        },
        onUploadSuccess(index) {
            return (e) => {
                const url = e.data[0];
                this.mark_data[index].img = url;
            };
        },
    },
};
</script>

<style lang="less">
@table-row-height: 38px;
.m-pkg-mark {
    table {
        width: 100%;
        border-collapse: collapse;
    }
    thead {
        top: -11px;
        position: sticky;
        z-index: 2;
    }
    tr {
        .pr;
        height: @table-row-height;
    }
    th {
        .fz(14px);
        .bold;
    }
    td {
        .fz(12px);
    }
    td,
    th {
        padding: 5px 10px;
        .x;
    }
    .u-add {
        .mt(10px);
    }
    .u-table-ops {
        .flex;
        justify-content: center;
        gap: 10px;
        .el-button {
            margin: 0;
            padding: 0;
        }
        .u-btn-top {
            transform: rotate(180deg);
        }
        .u-drag-arrow {
            .mt(2px);
            color: #0366d6;
            cursor: move;
        }
    }
}
</style>
