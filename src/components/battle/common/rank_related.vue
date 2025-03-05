<template>
    <el-dialog :visible.sync="visible" title="关联天梯榜" @close="cancel">
        <el-form :model="form" label-width="80px">
            <el-form-item label="赛事">
                <el-select v-model="form.rank_id" class="u-select" clearable placeholder="请选择赛事" @clear="rankClear">
                    <el-option v-for="item in ranks" :key="item.ID" :value="item.ID" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="首领">
                <el-select v-model="form.boss_id" class="u-select" clearable placeholder="请选择首领" :disabled="!form.rank_id">
                    <el-option v-for="item in bossMap" :key="item.achievement_id" :value="item.achievement_id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="心法">
                <el-select v-model="form.mount_id" class="u-select" clearable>
                    <el-option v-for="(key, value) in xfid" :value="~~value" :label="key" :key="key">
                        <div class="u-mount-item">
                            <img class="u-item-avatar" :src="showAvatar(value)" />
                            <span>{{ key }}</span>
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel" :loading="btnLoading">取 消</el-button>
            <el-button type="primary" @click="confirm" :loading="btnLoading">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getRank, bindBattle } from "@/service/battle/team";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import xfid from "@jx3box/jx3box-data/data/xf/xfid.json";
import { cloneDeep } from "lodash";
export default {
    name: "rankRelated",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        data: {
            type: [Object, String],
            default: () => ({})
        },
    },
    data() {
        return {
            form: {
                rank_id: '',
                boss_id: '',
                mount_id: '',
            },
            ranks: [],
            visible: false,

            xfid,
            btnLoading: false,
        }
    },
    computed: {
        bossMap() {
            const rank = this.ranks.find(item => item.ID === this.form.rank_id);
            return rank ? rank.boss_map : [];
        }
    },
    watch: {
        value(val) {
            this.visible = val;
        },
        visible(val) {
            this.$emit('input', val);
            if (val) {
                this.getRanks();
                this.form.rank_id = this.data.rank_id || '';
                this.form.boss_id = this.data.boss_id || '';
                this.form.mount_id = this.data.mount_id || '';
            }
        }
    },
    methods: {
        getRanks() {
            try {
                const jbRanks = sessionStorage.getItem('jbRanks');
                if (jbRanks) {
                    this.ranks = JSON.parse(jbRanks);
                    return;
                } else {
                    const params = {
                        pageIndex: 1,
                        pageSize: 100,
                    }
                    getRank(params).then(res => {
                        this.ranks = res.data.data.list || [];
                        sessionStorage.setItem('jbRanks', JSON.stringify(this.ranks));
                    })
                }
            } catch(e) {
                console.log(e);
            }
        },
        showAvatar: function (mount, body_type) {
            return __imgPath + "image/xf/" + mount + ".png";
        },
        cancel() {
            this.form = this.$options.data().form;
            this.visible = false;
        },
        confirm() {
            this.btnLoading = true;
            const data = {
                rank_id: ~~this.form.rank_id,
                boss_id: ~~this.form.boss_id,
                mount_id: ~~this.form.mount_id,
            }
            bindBattle(this.data.id, data).then(res => {
                this.$message.success('关联成功');
                this.visible = false;
                const data = cloneDeep(this.data);
                data.rank_id = ~~this.form.rank_id;
                data.boss_id = ~~this.form.boss_id;
                data.mount_id = ~~this.form.mount_id;
                this.$store.commit('SET_CURRENT', data)
            }).catch(e => {
                this.$message.error(e.msg);
            }).finally(() => {
                this.btnLoading = false;
            })
        },
        // 清空rank
        rankClear() {
            this.form.boss_id = '';
        }
    },
}
</script>

<style lang="less" scoped>
.u-select {
    width: 100%;
}
.u-mount-item {
    display: flex;
    align-items: center;
    gap: 10px;
}
.u-item-avatar {
    .size(24px);
}
</style>
