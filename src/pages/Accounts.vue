<template>
    <div class="flex flex-col items-start justify-start relative z-10">
        <section class="w-full p-4 relative z-10 shadow bg-white">
            <div class="container mx-auto flex justify-between items-center">
                <h2 class="text-3xl font-hairline flex-1">
                    {{ __('Accounts') }}
                    </h2>

                <a class="block h-6 w-6 cursor-pointer" :title="__('Add')" @click.prevent="$router.push({name: 'Add Account'})">
                    <svg class="fill-current h-6 w-6 text-grey hover:text-grey-dark"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-9h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V9a1 1 0 0 1 2 0v2z"/>
                    </svg>
                </a>
            </div>
        </section>

        <div class="container mx-auto">
            <div v-if="accounts.length > 0">
                <template v-for="(account, idx) in accounts">
                    <div class="p-4 flex justify-between items-center w-full h-full text-xl font-light text-grey-darkest pointer-events-auto cursor-pointer" @click="$router.push({name: 'View Account', params: {id: account.id}})">
                        <img class="rounded-full h-16 w-16 border-2 border-grey-light mr-4" :src="`/static/img/account-${account.type}.png`"/>

                        <div class="flex-1 flex flex-col justify-center items-start">
                            <span>{{ account.name }}</span>
                            <span class="text-sm text-grey-dark">{{ __(account.type) }}</span>
                        </div>

                        <a class="block h-6 w-6 cursor-pointer" :title="__('View Account')">
                            <svg class="fill-current h-6 w-6 text-grey hover:text-grey-dark"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M9.3 8.7a1 1 0 0 1 1.4-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4l3.29-3.3-3.3-3.3z"/>
                            </svg>
                        </a>
                    </div>

                    <hr class="w-1/3 border-t-2" v-if="accounts.length - 1 !== idx">
                </template>

            </div>

            <div class="p-4" v-else>
                {{ __('No accounts yet') }}
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';

    export default {
        computed: {
            ...mapState('accounts', [
                'accounts'
            ])
        },

        watch: {
            accounts(to, from) {
                if(to.length > 0) {
                    to.forEach(async (account) => {
                        await this.getEntryStream(account.id);
                    })
                }
            }
        },

        async created() {
            await this.getAccountStream();
        },

        methods: {
            ...mapActions('entries', [
                'getEntryStream'
            ]),
            ...mapActions('accounts', [
                'getAccountStream',
            ]),
        }
    }
</script>