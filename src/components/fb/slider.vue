<template>
    <div class="m-fb-slider" v-if="slider">
        <!-- <el-carousel
            v-if="data && data.length"
            trigger="click"
            height="140px"
            indicator-position="none"
            :interval="6000"
        >
            <el-carousel-item v-for="(item, i) in data" :key="i">
                <a :href="item.link" rel="noopener noreferrer" target="_blank"
                    ><img :src="item.img"
                /></a>
            </el-carousel-item>
        </el-carousel>-->
        <a :href="slider.link" rel="noopener noreferrer" target="_blank">
            <img :src="slider.img" />
        </a>
    </div>
</template>

<script>
import { getNews } from "@/service/fb/sidebar";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "",
    props: [],
    data: function () {
        return {
            data: [],
        };
    },
    computed: {
        slider: function () {
            return this.data && this.data.length && this.data[0];
        },
    },
    methods: {},
    mounted: function () {
        getNews("team").then((data) => {
            data.forEach((item) => {
                item.img = resolveImagePath(item.img);
            });
            this.data = data;
        });
    },
    components: {},
};
</script>
