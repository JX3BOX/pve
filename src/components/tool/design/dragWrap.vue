<template>
    <div
        class="p-map"
        ref="container"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @touchstart.prevent="startDrag"
        @touchmove.prevent="drag"
        @touchend.prevent="stopDrag"
        @touchcancel.prevent="stopDrag"
    >
        <div
            class="m-list"
            ref="map"
            :style="{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? '' : '0.5s all',
            }"
            @click="preventClick"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "dragWrap",
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            scale: 1,

            isDragging: false,
            startPosition: { x: 0, y: 0 },
            offset: { x: 0, y: 0 },
            position: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            lastPosition: { x: 0, y: 0 },
            lastTime: 0,
            dampingFactor: 0.9, // 越小速度衰减的越快
            momentumMultiplier: 0, // 根据鼠标移动的距离动态计算惯性效果的远近
            containerBounds: null,
            isIpad: window.innerWidth < 1133 ? true : false,
        };
    },
    watch: {
        data: {
            handler({ x, y, scale }) {
                if (x) {
                    this.position.x = x;
                    this.position.y = y;
                    this.scale = scale;
                }
            },
            deep: true,
            immediate: true,
        },
    },
    mounted() {
        this.$nextTick(() => {
            const map = this.$refs.map;
            map.addEventListener("wheel", this.handleScroll);

            this.containerBounds = this.$refs.container.getBoundingClientRect();
            window.addEventListener("resize", this.updateContainerBounds);

            const imgs = document.getElementsByTagName("img");
            [...imgs].forEach((img) => {
                img.addEventListener("dragstart", (event) => {
                    event.preventDefault();
                });
            });
        });
    },
    methods: {
        startDrag(event) {
            this.isDragging = true;
            if (this.isIpad) {
                this.startPosition.x = event.changedTouches[0].clientX;
                this.startPosition.y = event.changedTouches[0].clientY;
            } else {
                this.startPosition.x = event.clientX;
                this.startPosition.y = event.clientY;
            }
            this.offset.x = this.startPosition.x - this.position.x;
            this.offset.y = this.startPosition.y - this.position.y;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.lastTime = Date.now();
            this.lastPosition.x = this.startPosition.x;
            this.lastPosition.y = this.startPosition.y;
        },
        drag(event) {
            if (this.isDragging) {
                const currentTime = Date.now();
                const deltaTime = currentTime - this.lastTime;
                let clientX, clientY;
                if (this.isIpad) {
                    clientX = event.changedTouches[0].clientX;
                    clientY = event.changedTouches[0].clientY;
                } else {
                    clientX = event.clientX;
                    clientY = event.clientY;
                }
                this.velocity.x = (clientX - this.lastPosition.x) / deltaTime;
                this.velocity.y = (clientY - this.lastPosition.y) / deltaTime;
                this.position.x = clientX - this.offset.x;
                this.position.y = clientY - this.offset.y;
                this.lastTime = currentTime;
                this.lastPosition.x = clientX;
                this.lastPosition.y = clientY;
                this.updateMomentumMultiplier(clientX, clientY);
            }
        },
        stopDrag(event) {
            this.isDragging = false;
            this.applyMomentum();
        },
        updateMomentumMultiplier(currentX, currentY) {
            const distance = Math.sqrt(
                Math.pow(currentX - this.startPosition.x, 2) + Math.pow(currentY - this.startPosition.y, 2)
            );
            this.momentumMultiplier = distance * 0.01;
        },
        applyMomentum() {
            const momentumAnimation = () => {
                this.position.x += this.velocity.x * this.momentumMultiplier;
                this.position.y += this.velocity.y * this.momentumMultiplier;

                if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
                    this.velocity.x *= this.dampingFactor;
                    this.velocity.y *= this.dampingFactor;
                    requestAnimationFrame(momentumAnimation);
                }
            };

            requestAnimationFrame(momentumAnimation);
        },
        updateContainerBounds() {
            this.containerBounds = this.$refs.container.getBoundingClientRect();
        },
        preventClick(event) {
            if (this.isDragging) {
                event.stopPropagation();
            }
        },

        handleScroll(event) {
            const delta = event.deltaY || event.detail || event.wheelDelta;

            let scaleNum = 0.05;
            if (delta < 0) {
                // 向上滚动，放大元素
                this.scale += scaleNum;
                if (this.scale > 1) {
                    this.scale = 1;
                }
            } else {
                // 向下滚动，缩小元素
                this.scale -= scaleNum;
                if (this.scale < 0.35) {
                    this.scale = 0.35;
                }
            }
            this.$emit("change", this.scale);
            event.preventDefault();
        },
    },

    beforeDestroy() {
        window.removeEventListener("wheel", this.handleScroll);
        window.removeEventListener("resize", this.updateContainerBounds);
    },
};
</script>
