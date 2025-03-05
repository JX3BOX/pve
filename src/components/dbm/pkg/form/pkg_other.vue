<template>
    <fold-block class="m-pkg-extend" name="other" desc="其它设置" icon="el-icon-setting" :fold="false">
            <el-form-item label="评论开关">
                <div class="m-comment">
                    <el-switch
                        active-color="#13ce66"
                        :active-value="0"
                        :inactive-value="1"
                        v-model="pkg.comment"
                    ></el-switch>
                    <el-checkbox :true-label="1" :false-label="0" v-model="pkg.comment_visible"
                        >仅自己可见</el-checkbox
                    >
                </div>
            </el-form-item>
            <el-form-item label="礼物开关">
                <el-switch
                    active-color="#13ce66"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="pkg.allow_gift"
                ></el-switch>
            </el-form-item>
    </fold-block>
</template>

<script>
import { mapState } from "vuex";
import FoldBlock from "@/components/dbm/common/fold_block.vue";
export default {
    name: "PkgExtend",
    components: { FoldBlock },
    data() {
        return {
        };
    },
    computed: {
        ...mapState({
            pkg: "pkg",
        }),
    },
    methods: {
    }
};
</script>
