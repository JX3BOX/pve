<template>
    <div class="u-drop-item" v-if="data">
        <div class="u-drop-item-header">
            <img
                v-if="data.Icon && data.Icon.FileName"
                class="u-item-icon"
                :src="data.Icon.FileName"
            />
            <img v-else class="u-item-icon" src="@/assets/img/null.png" />
            <span>{{data.Name}}</span>
        </div>
        <div class="u-drop-item-info" v-if="type == 'weapons' || type == 'armors'">
            <div class="u-drop-item-meta" v-if="data.DetailType">{{data.DetailType}}类</div>
            <div class="u-drop-item-meta" v-if="data.Base1Type && (type == 'weapons')">
                {{data.Base1Type.Attrib.GeneratedBase}}-{{~~data.Base1Type.Base1Max + ~~data.Base2Type.Base2Max}}
            </div>
            <div class="u-drop-item-meta" v-if="data.Base1Type && (type == 'armors')" >
                {{data.Base1Type.Attrib.GeneratedBase}}
            </div>
            <div class="u-drop-item-meta" v-if="data.Base2Type && (type == 'armors')" >
                {{data.Base2Type.Attrib.GeneratedBase}}
            </div>

            <div class="u-drop-item-meta" v-if="data.Base3Type">
                {{data.Base3Type.Attrib.GeneratedBase}}
            </div>
            <div class="u-drop-item-meta isprop" v-for="(prop,i) in data.ModifyType" :key="i">
                {{prop.Attrib.GeneratedMagic}}
            </div>
            <div class="u-drop-item-meta" v-if="data.Level">需要等级{{data.Level}}</div>
            <div class="u-drop-item-meta isscore" v-if="data.Quality">品质等级{{data.Quality}}</div>
            <div class="u-drop-item-meta">适用门派:{{data.BelongForce}}</div>
        </div>
        <div class="u-drop-item-info" v-if="type == 'others'">
            <div class="u-drop-item-meta isprewrap" v-if="data.Descs">{{data.Descs | formatDesc}}</div>
            <div class="u-drop-item-meta isprop" v-if="data.Type">类型:{{data.Type}}</div>
            <div class="u-drop-item-meta isscore" v-if="data.UIID">UUID:{{data.UIID}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "drop_item",
    props: ["data","type"],
    data: function() {
        return {};
    },
    computed: {},
    methods: {},
    filters : {
        formatDesc : function (val){
            let str = val.join('')
            str = str.replace(/\\/g,'')
            str = str.replace('n','\n')
            return str
        }
    },
    mounted: function() {},
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/fb/drop_item.less";
</style>
