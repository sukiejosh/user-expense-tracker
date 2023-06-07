<template>
    <portal to="loading" >
        <transition name="fadeInDown">
            <div class="relative z-20 flex justify-center items-center bg-white w-full p-4 pb-3 shadow" v-if="show">
                <div class="flex justify-center items-center h-full w-full">
                    <LoadingAnimation></LoadingAnimation>
                </div>
            </div>
        </transition>
    </portal>
</template>

<script>
    import LoadingAnimation from './Loading/LoadingAnimation.vue'

    export default {
        props: {
            busy: {}
        },

        components: {
            LoadingAnimation
        },

        data: () => ({
            forceClose: false
        }),

        computed: {
            show() {
                return this.busy && ! this.forceClose;
            }
        },

        methods: {
            close() {
                this.$emit('closed')
            }
        }
    }
</script>