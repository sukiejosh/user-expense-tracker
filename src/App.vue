<template>
    <div v-if="! $route.meta.hideAppLayout">
        <AppHeader />

        <portal-target name="notify"></portal-target>
        <portal-target name="loading"></portal-target>

        <main class="main">
            <router-view></router-view>
        </main>

        <AppFooter />


    </div>
    <div class="h-full" v-else>
        <main class="h-full">
            <router-view></router-view>
        </main>
    </div>
</template>

<style src="@/assets/css/app.pcss" lang="postcss"></style>

<script>
    import {mapGetters} from 'vuex';

    import AppHeader from './components/AppHeader.vue';
    import AppFooter from './components/AppFooter.vue';
    import {SET_LANGUAGE, SET_CURRENCY} from './store/mutations';

    export default {
        components: {
            AppHeader,
            AppFooter
        },

        data: () => ({
           show: false,
        }),

        watch: {
            loggedIn(loggedIn) {
                if (!loggedIn) {
                    this.$router.push({name: 'Login'})
                }
            },

            async preferences(to, from) {
                if(to.hasOwnProperty('language')) {
                    await this.$store.dispatch(SET_LANGUAGE)
                }

                if(to.hasOwnProperty('currency')) {
                    await this.$store.dispatch(SET_CURRENCY)
                }
            }
        },

        computed: {
            ...mapGetters('auth', [
                'loggedIn', 'preferences'
            ])
        },
    }
</script>
