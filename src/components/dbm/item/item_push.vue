<template>
    <div class="m-item-push-box" @click.stop>
        <!-- <el-tooltip
            class="item"
            effect="dark"
            content="添加到指定云数据"
            placement="top"
        >
            <el-button
                class="u-cloud"
                type="primary"
                :size="size"
                icon="el-icon-shopping-cart-2"
                @click.stop="open"
                >云数据</el-button
            >
        </el-tooltip> -->
        <el-dialog
            class="m-item-push-dialog"
            title="添加到云数据"
            :visible.sync="visible"
        >
            <el-select
                v-model="id"
                placeholder="请选择要加入的云数据"
                class="u-select"
                filterable
            >
                <el-option
                    v-for="item in datalist"
                    :key="item.ID"
                    :label="label(item)"
                    :value="item.ID"
                >
                </el-option>
            </el-select>
            <p class="u-tip" v-if="!datalist.length" @click="qc"><i class="el-icon-info"></i> 还没有云数据，点击<b>快速创建</b></p>

            <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="push">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { pushData,ovData,addData } from "@/service/dbm/data.js";
export default {
    name: "item_push",
    props: ["item", "size"],
    data: function() {
        return {
            visible: false,
            id: "",
            datalist: [],
        };
    },
    computed: {
        data: function() {
            return this.item;
        },
    },
    methods: {
        open: function() {
            this.visible = true;
            ovData().then((res) => {
                this.datalist = res.data.data.list
            })
        },
        close: function() {
            this.visible = false;
        },
        push: function() {
            if (!this.id || !this.data.ID || !this.data._type) {
                this.$message.error("必填参数不能为空");
                return;
            }
            pushData(this.id, this.data.ID, this.data._type).then((res) => {
                this.$message({
                    message: "添加成功",
                    type: "success",
                });
                this.close();
            });
        },
        label: function(item) {
            return `${item.title.slice(0, 15)}`;
        },
        qc : function (){
            addData({title:'临时云数据'}).then((res) => {
                let id = res.data.data
                this.datalist.push({
                    ID : id,
                    title : '临时云数据'
                })
                this.id = id
            })
        }
    },
    mounted: function() {
    },
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/dbm/item_push.less";
</style>
