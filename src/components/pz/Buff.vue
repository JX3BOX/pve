<template>
    <div class="m-pz-buff">
        <el-divider class="u-div" content-position="left"> <i class="el-icon-magic-stick"></i> 增益 </el-divider>
        <el-form label-position="left" label-width="80px">
            <el-form-item label="战阶">
                <el-select size="small" v-model="level" @change="onLevelChange">
                    <el-option v-for="(item, index) in levels" :value="index" :label="index ? `第${item}阶` : item" :key="index">
                        {{ index ? `第${item}阶` : item }}
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
const levels = ["无", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四"]
export default {
    name: "Buff",
    data() {
        return {
            levels: levels,
            level: 0
        }
    },
    computed: {
        overview() {
            return this.$store.state.schema?.overview;
        }
    },
    watch: {
        overview: {
            handler(val) {
                this.level = val?.level || 0;
            },
            immediate: true
        }
    },
    methods: {
        onLevelChange() {
            this.$store.commit("SET_SCHEMA", {
                key: "overview",
                value: {
                    ...this.overview,
                    level: this.level
                },
            });
        }
    }
}
</script>
