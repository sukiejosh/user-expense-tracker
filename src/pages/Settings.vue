<template>
    <div class="flex flex-col items-start justify-start">
        <section class="bg-white w-full p-4 relative z-10 shadow">
            <UserBox :profile="profile" :logout="logout"></UserBox>
        </section>

        <div class="container mx-auto">
            <h2 class="text-3xl font-hairline flex-1 flex items-center p-4">
                {{ __('Settings') }}
            </h2>

            <form class="w-full p-6 flex flex-col justify-start items-center" @submit.prevent="update(newPreferences)">
                <div class="w-full flex flex-wrap -mx-3 mb-3 relative">
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-language">
                            {{ __('Language') }}
                        </label>
                        <select v-model="newPreferences.language" class="block appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3" id="grid-language">
                            <option value="en">{{ __('English') }}</option>
                            <option value="ja">{{ __('Japanese') }}</option>
                        </select>
                    </div>

                    <div class="pointer-events-none absolute pin-y pin-r flex items-center px-6 pt-3 text-grey-darker">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>

                <div class="w-full flex flex-wrap -mx-3 mb-3 relative">
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-account">
                            {{ __('Currency') }}
                        </label>
                        <select v-model="newPreferences.currency" class="block appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3" id="grid-account">
                            <option :value="code" v-for="(currency, code) in currencies">{{ currency.code }} - {{ currency.name }}</option>
                        </select>
                    </div>

                    <div class="pointer-events-none absolute pin-y pin-r flex items-center px-6 pt-3 text-grey-darker">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>

                <div class="w-full flex flex-wrap -mx-3 mb-3 relative">
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-account">
                            {{ __('Default Account') }}
                        </label>
                        <select v-model="newPreferences.defaultAccount" class="block appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3" id="grid-account">
                            <option :value="account.name" v-for="account in accounts">{{ account.name }}</option>
                        </select>
                    </div>

                    <div class="pointer-events-none absolute pin-y pin-r flex items-center px-6 pt-3 text-grey-darker">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>

                <hr class="w-1/3 border-t mb-3" />

                <button type="submit" class="w-1/2 bg-expense text-white p-3" :disabled="updating">
                    {{ __('Save') }}
                </button>

            </form>
        </div>


        <Notify type="error" :message="error.message" :show="error" v-if="error" :retry="true" @retry="update(newPreferences)"></Notify>
        <Loading :busy="updating"></Loading>
    </div>
</template>

<script>
    import {LOGOUT, UPDATE_PREFERENCES} from '../store/auth/mutations';
    import {mapActions, mapGetters, mapState} from 'vuex';
    import Notify from '../components/Notify';
    import Loading from '../components/Loading.vue';
    import UserBox from '../components/UserBox.vue';
    import Currencies from '../helpers/currencies'

    export default {
        components: {
            Notify,
            Loading,
            UserBox
        },

        data: () => ({
            updating: false,
            error: null,
            newPreferences: {
                language: 'en',
                currency: 'JPY',
                defaultAccount: null
            },
            currencies: Currencies
        }),

        computed: {
            ...mapGetters('auth', [
                'preferences', 'profile'
            ]),
            ...mapState('accounts', [
                'accounts'
            ])
        },

        watch: {
            preferences(to, from) {
                this.newPreferences = {...to};
            }
        },

        async mounted() {
            await this.getAccountStream();
            this.newPreferences = {...this.preferences};
        },

        methods: {
            ...mapActions('auth', {
                updatePreferences: UPDATE_PREFERENCES,
                logout: LOGOUT
            }),

            ...mapActions('accounts', [
                'getAccountStream'
            ]),

            async update(preferences) {
                this.updating = true;
                this.error = null;

                try {
                    await this.updatePreferences(preferences);
                } catch (error) {
                    console.log(error);
                    this.error = error;
                } finally {
                    this.updating = false;
                }
            }
        }
    }
</script>