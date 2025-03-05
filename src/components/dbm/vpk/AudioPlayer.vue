<template>
    <audio ref="audio"></audio>
</template>

<script>
export default {
    name: "AudioPlayer",
    props: {
        playSrc: {
            type: String,
            default: "",
        },
    },
    emits: ["ended"],
    data() {
        return {
            playing: false,
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.audio.addEventListener("ended", () => {
                this.playing = false;
                this.$emit("ended");
            });
        });
    },
    methods: {
        play(url) {
            this.$refs.audio.src = url;
            this.$refs.audio
                .play()
                .then(() => {
                    this.playing = true;
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        pause() {
            this.$refs.audio.pause();
            this.$emit("ended");
            this.playing = false;
        },
    },
};
</script>
