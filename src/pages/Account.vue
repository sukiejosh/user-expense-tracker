<template>
    <div class="flex flex-col items-start justify-start relative z-10">
        <section class="w-full relative z-10 shadow bg-white" v-if="account">
            <div class="container mx-auto">
                <div class="p-4 flex justify-between items-center w-full h-full text-xl font-light text-grey-darkest">
                    <img class="rounded-full h-16 w-16 border-2 border-grey-light mr-4"
                         :src="`/static/img/account-${account.type}.png`"/>

                    <div class="flex-1 flex flex-col justify-center items-start">
                        <span>{{ account.name }}</span>
                        <span class="text-sm text-grey-dark">{{ __(account.type) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <a class="block w-6 h-6 cursor-pointer mr-2" @click="remove(account)" aria-label="Delete Account" v-if="! hasEntries && ! showNewEntryScreen">
                            <svg class="w-6 h-6 fill-current text-expense opacity-80" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/>
                                <path fill="none" d="M0 0h24v24H0V0z"/>
                            </svg>
                        </a>

                        <transition name="rotateIn">

                        <a key="openAdd" class="block h-6 w-6 cursor-pointer" :title="__('New Entry')" @click.prevent="showNewEntryScreen = true" v-if="! showNewEntryScreen">
                                <svg class="fill-current h-6 w-6 text-grey hover:text-grey-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-9h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V9a1 1 0 0 1 2 0v2z"/>
                                </svg>
                            </a>
                        </transition>
                        <transition name="rotateIn">
                            <a key="closeAdd" class="block h-8 w-8 cursor-pointer" :title="__('Close')" @click.prevent="showNewEntryScreen = false" v-if="showNewEntryScreen">
                                <svg class="fill-current h-8 w-8 text-grey hover:text-grey-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M4.93 19.07A10 10 0 1 1 19.07 4.93 10 10 0 0 1 4.93 19.07zm1.41-1.41A8 8 0 1 0 17.66 6.34 8 8 0 0 0 6.34 17.66zM13.41 12l1.42 1.41a1 1 0 1 1-1.42 1.42L12 13.4l-1.41 1.42a1 1 0 1 1-1.42-1.42L10.6 12l-1.42-1.41a1 1 0 1 1 1.42-1.42L12 10.6l1.41-1.42a1 1 0 1 1 1.42 1.42L13.4 12z"/>
                                </svg>
                            </a>
                        </transition>
                    </div>
                </div>
            </div>
        </section>

        <portal-target name="edit-entry"></portal-target>

        <transition name="slideInDownOutUp">
            <NewEntryScreen :account="account" @close="showNewEntryScreen = false" v-if="showNewEntryScreen"></NewEntryScreen>
        </transition>

        <Entries v-if="! showNewEntryScreen" @showNewEntryScreen="showNewEntryScreen = true"></Entries>
        <Notify type="error" :message="error.message" :show="error" @dismiss="error = null" v-if="error"></Notify>
        <Loading :busy="removing"></Loading>

    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import Entries from './Entries/Entries.vue';
    import NewEntryScreen from './Entries/NewEntryScreen.vue';
    import Notify from '../components/Notify';
    import Loading from '../components/Loading.vue';

    export default {
        components: {
            Entries,
            Notify,
            Loading,
            NewEntryScreen
        },

        data: () => ({
            showNewEntryScreen: false,
            removing: false,
            error: null
        }),

        computed: {
            ...mapState('entries', [
                'entries'
            ]),
            ...mapState('accounts', [
                'accounts',
            ]),
            account() {
                const filteredResult = this.accounts.filter(account => account.id === this.$route.params.id);

                return filteredResult.length > 0 ? filteredResult[0] : null;
            },

            hasEntries() {
                return this.entries[this.account.name] && Object.keys(this.entries[this.account.name]).length > 0;
            },
        },

        async created() {
            await this.getAccountStream();
            await this.getEntryStream(this.$route.params.id);
        },

        async beforeRouteUpdate(to, from, next) {
            await this.getAccountStream();
            await this.getEntryStream(to.params.id);
            next();
        },

        methods: {
            ...mapActions('entries', [
                'getEntryStream',
            ]),
            ...mapActions('accounts', [
                'getAccountStream',
                'removeAccount'
            ]),
            async remove(account) {
                this.removing = true;

                try {
                    await this.removeAccount(account);
                    this.removing = false;
                    this.$router.replace({name: 'Home'});
                }  catch (error) {
                    console.log(error);
                    this.error = error;
                    this.removing = false;
                }
            },
        }
    }
</script>