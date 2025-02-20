<template>
    <div class="u-skill-item">
        <el-popover
            class="u-skill-popover"
            placement="right-start"
            trigger="hover"
            :visible-arrow="false"
            :popper-class="`u-skill__popup__${source.nColor}`"
        >
            <template slot="reference">
                <div
                    class="u-skill-icon"
                    :class="[!!~~data.IsPassiveSkill ? 'is-passive' : '', `u-skill-icon__${source.nColor}`]"
                >
                    <img :src="iconLink(iconId || data.IconID, client)" @click.stop="getUrl(data.SkillID)" />
                </div>
            </template>
            <jx3-skill :data="data"></jx3-skill>
        </el-popover>
        <div v-if="source.szSkillName" class="u-item-name">
            {{ source.szSkillName }}
        </div>
        <!-- <a
            v-if="source.extra && source.extra.link"
            :title="`${source.szSkillName}攻略`"
            :href="source.extra.link"
            target="_blank"
            class="u-item-link"
        >
            <i class="el-icon-link"></i>
        </a> -->
    </div>
</template>

<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
// import { getSkill } from "@/service/baizhan.js";
import Jx3Skill from "./Skill.vue";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "SkillIcon",
    props: {
        source: {
            type: Object,
            required: true,
        },
    },
    components: {
        Jx3Skill,
    },
    watch: {
        source: {
            immediate: true,
            deep: true,
            handler(source) {
                this.data = source.Skill;
                if (source?.ParsedSkill?.desc) {
                    this.data.Desc = source.ParsedSkill.desc.replace(/\\n/g, "<br />");
                }
                // let { client, id, level } = this.params;
                // // 读取本地数据
                // const cache = sessionStorage.getItem(`skill-${client}-${id}-${level}`);
                // if (cache) {
                //     this.data = JSON.parse(cache);
                //     // 没有缓存则发起请求获取数据
                // } else {
                //     const data = source?.InSkill || {};
                //     if (data.IconID) {
                //         // 将数据放入 sessionStorage
                //         sessionStorage.setItem(`skill-${client}-${id}-${level}`, JSON.stringify(data));
                //     } else {
                //         id &&
                //             getSkill(this.params).then((res) => {
                //                 let newData = res.data?.list?.[0] || {};
                //                 this.data = newData;
                //                 // 将数据放入 sessionStorage
                //                 sessionStorage.setItem(`skill-${client}-${id}-${level}`, JSON.stringify(newData));
                //             });
                //     }
                // }
            },
        },
    },
    computed: {
        iconId() {
            return ~~this.source?.InSkill?.IconID || 0;
        },
        id() {
            return ~~this.source?.dwInSkillID || 0;
        },
        level() {
            return ~~this.source?.InSkill?.level || 0;
        },
        params: function () {
            return { client: this.client, id: this.id, level: this.level };
        },
    },
    data() {
        return {
            client: "std",
            data: {},
        };
    },
    methods: {
        iconLink,
        getUrl(id) {
            const domain = process.env.NODE_ENV === "development" ? __Root : location.origin + "/";
            const url = domain + `app/database/?type=skill&query=${id}`;
            window.open(url, "_blank");
        },
    },
};
</script>
