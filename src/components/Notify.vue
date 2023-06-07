<template>
    <portal to="notify" >
        <transition name="fadeInDown" class="">
            <section class="bg-white relative z-30 bg-grey-lightest flex justify-center items-center shadow" v-if="show">
                <div class="flex flex justify-start items-center bg-white w-full sm:shadow-md p-4">

                    <div class="flex flex-col flex-1 justify-start items-start">
                        <h3 class="text-lg font-thin pb-2" v-if="title">{{ __(title) }}</h3>
                        <p class="block text-sm">{{ __(message) }}</p>
                    </div>

                    <button class="flex bg-grey-lighter p-2 mr-4" @click="retryAction()" v-if="retry" :title="__('Retry')">
                        <svg class="fill-current h-6 w-6 text-grey-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M5.41 16H18a2 2 0 0 0 2-2 1 1 0 0 1 2 0 4 4 0 0 1-4 4H5.41l2.3 2.3a1 1 0 0 1-1.42 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.42 1.4L5.4 16zM6 8a2 2 0 0 0-2 2 1 1 0 0 1-2 0 4 4 0 0 1 4-4h12.59l-2.3-2.3a1 1 0 1 1 1.42-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.42-1.4L18.6 8H6z"/>
                        </svg>
                    </button>

                    <button class="bg-grey-lighter p-2" @click="show = false" :title="__('Dismiss')">
                        <svg class="fill-current h-6 w-6 text-grey-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M16.24 14.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 0 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12l2.83 2.83z"/>
                        </svg>
                    </button>
                </div>
            </section>
            </transition>
        </portal>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'info'
            },
            message: {
                type: String,
                required: true
            },
            retry: {
                type: Boolean,
                default: false
            },
            duration: {
                type: Number,
                default: 80000
            }
        },

        data: () => ({
            show: true
        }),

        computed: {
            title() {
                if(this.type === 'error') return 'Error';

                return null;
            }
        },

        mounted() {
            setTimeout(() => {
                this.dismiss()
            }, this.duration);
        },

        methods: {
            dismiss() {
                this.show = false;
                this.$emit('dismiss');
            },
            retryAction() {
                this.$emit('retry');
                this.show = false;
            }
        }
    }
</script>