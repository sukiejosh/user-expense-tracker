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
                </div>
            </div>
        </section>

        <div class="container">
            <div class="overflow-hidden w-full mb-8">
                <div class="flex flex-row justify-between mx-4 mt-4 mb-2 pb-2 ">
                    <h5 class="text-3xl font-hairline flex-1 flex items-center">
                        <span class="block mr-2">{{ __('Overview') }}</span>
                    </h5>
                </div>

                <div class="entries mb-8">
                    <div class="flex flex-col items-center">
                        <div class="flex flex-col justify-center bg-o5-grey-lighter block border-b border-o5-grey-light  px-4 py-3 block w-full">
                            <div class="flex flex-row items-center relative">
                                <div class="text-xl flex-1">
                                    <div class="">{{ __('Remaining') }}</div>
                                </div>

                                <h5 class="text-2xl font-light" :class="'text-' + remainingType">{{ remainingBalance | yen }}</h5>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-row justify-between w-full">
                    <span class="font-thin text-xl pb-2 px-4 block mt-4">{{ __('Income') }}</span>
                    <span class="font-thin text-2xl pb-2 px-4 block mt-4 text-income">{{ totalIncome | yen }}</span>
                </div>

                <div class="entries mb-4">
                    <div class="flex flex-col items-center" v-for="(amount, category) in groupedEntries.income">
                        <div class="flex flex-col justify-center bg-o5-grey-lighter block border-b border-o5-grey-light  px-4 py-3 block w-full">
                            <div class="flex flex-row items-center relative">
                                <div class="text-sm flex-1">
                                    <div class="">{{ category }}</div>
                                </div>

                                <h5 class="text-base font-light">{{ amount | yen }}</h5>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-row justify-between w-full">
                    <span class="font-thin text-xl pb-2 px-4 block mt-4">{{ __('Expenses') }}</span>
                    <span class="font-thin text-2xl pb-2 px-4 block mt-4 text-expense">{{ totalExpense | yen }}</span>
                </div>

                <div class="entries mb-8">
                    <div class="flex flex-col items-center" v-for="(amount, category) in groupedEntries.expenses">
                        <div class="flex flex-col justify-center bg-o5-grey-lighter block border-b border-o5-grey-light  px-4 py-3 block w-full">
                            <div class="flex flex-row items-center relative">
                                <div class="text-sm flex-1">
                                    <div class="">{{ category }}</div>
                                </div>

                                <h5 class="text-base font-light">{{ amount | yen }}</h5>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex';
    import {groupBy, reduce, mapValues} from 'lodash';

    export default {
        components: {
        },

        async created() {
            await this.getAccountStream();
            await this.getEntryStream(this.$route.params.accountId);
        },

        computed: {
            remainingType() {
                if(this.remainingBalance < 0) {
                    return 'expense';
                }

                return 'income';
            },

            groupedEntries() {
                let {expense: expenses, income} = groupBy(this.entries, (entry) => entry.type);
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

                return {expenses, income};
            },

            totalIncome() {
                let {income} = this.groupedEntries;
                return reduce(income, (total, amount) => Number(total) + Number(amount), 0)
            },

            account() {
                const filteredResult = this.accounts.filter(account => account.id === this.$route.params.accountId);

                return filteredResult.length > 0 ? filteredResult[0] : null;
            },

            totalExpense() {
                let {expenses} = this.groupedEntries;
                return reduce(expenses, (total, amount) => Number(total) + Number(amount), 0)
            },

            remainingBalance() {
                return this.totalIncome - this.totalExpense;
            },

            entries() {
                const entries = this.allEntries[this.$route.params.accountId] !== undefined
                    ? this.allEntries[this.$route.params.accountId]
                    : {};

                return [].concat.apply([], Object.values(entries));
            },

            ...mapState('entries', {
                allEntries: 'entries',
            }),
            ...mapState('accounts', [
                'accounts'
            ])
        },

        methods: {
            ...mapActions('entries', [
                'getEntryStream'
            ]),
            ...mapActions('accounts', [
                'getAccountStream',
            ])
        }
    }
</script>