<template>
    <div class="flex flex-col items-start justify-start relative z-10">
        <section class="w-full p-4 relative z-10 shadow bg-white">
            <div class="container mx-auto flex justify-between items-center">
                <h2 class="text-3xl font-hairline flex-1">
                    {{ __('Overview') }}
                </h2>
            </div>
        </section>

        <div class="container mx-auto">
            <div v-if="accounts.length > 0">
                <template v-for="(account, idx) in accounts">
                    <div class="p-4 flex justify-between items-center w-full h-full text-xl font-light text-grey-darkest pointer-events-auto cursor-pointer" @click="$router.push({name: 'View Overview', params: {accountId: account.id}})">
                        <img class="rounded-full h-16 w-16 border-2 border-grey-light mr-4" :src="`/static/img/account-${account.type}.png`"/>

                        <div class="flex-1 flex flex-col justify-center items-start">
                            <h3 class="flex items-baseline text-xl font-light">{{ account.name }}</h3>
                            <p class="text-base text-grey-darker mt-3 font-normal">
                                <span class="text-income">{{ totalIncome[account.id] | yen }}</span> ・ <span class="text-expense">{{ totalExpense[account.id] | yen}}</span>
                            </p>
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
                {{ __('No accounts to overview yet') }}
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import {groupBy, reduce, mapValues} from 'lodash';

    export default {
        computed: {
            ...mapState('entries', [
                'entries'
            ]),
            ...mapState('accounts', [
                'accounts',
            ]),
            groupedEntries() {
                const entries = {};

                for (let accountId in this.allEntries) {
                    let {expense: expenses, income} = groupBy(this.allEntries[accountId], (entry) => entry.type);

                    expenses = mapValues(groupBy(expenses, (expense) => expense.category), (entries) => {
                        return reduce(entries, (result, entry) => {
                            return Number(result) + Number(entry.amount);
                        }, 0)
                    });

                    income = mapValues(groupBy(income, (inc) => inc.category), (entries) => {
                        return reduce(entries, (result, entry) => {
                            return Number(result) + Number(entry.amount);
                        }, 0)
                    });

                    entries[accountId] = {expenses, income}
                }

                return entries;
            },

            totalIncome() {
                const entries = {};

                for (let accountId in this.groupedEntries) {
                    let {income} = this.groupedEntries[accountId];
                    entries[accountId] = reduce(income, (total, amount) => Number(total) + Number(amount), 0);
                }

                return entries;
            },

            allEntries() {
                return mapValues(this.entries, (entries) => {
                    return [].concat.apply([], Object.values(entries));
                });
            },

            totalExpense() {
                const entries = {};

                for (let accountId in this.groupedEntries) {
                    let {expenses} = this.groupedEntries[accountId];
                    entries[accountId] = reduce(expenses, (total, amount) => Number(total) + Number(amount), 0);
                }

                return entries;
            },
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
                'getAccountStream'
            ]),
        }
    }
</script>