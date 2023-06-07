<template>
    <div class="container mx-auto">
        <div v-if="hasEntries" class="w-full overflow-hidden mb-8">
            <div class="flex flex-row justify-between mx-4 mt-4">
                <h5 class="text-xs font-light flex-1 flex items-center">
                    <span class="block uppercase">{{ __(':something Filter', {something: __('Month')}) }}</span>
                </h5>

                <h5 class="text-xs font-light self-end">
                    <span class="block uppercase" v-if="remainingBalance">{{ __('Remaining') }}</span>
                </h5>
            </div>

            <div class="flex flex-row justify-between mx-4 mb-4 pb-2 ">
                <h5 class="text-3xl font-hairline flex-1 flex items-center cursor-pointer"
                    @click="showDateSelectionMenu = ! showDateSelectionMenu">
                    <span class="block mr-2">{{ title }}</span>
                    <svg class="block fill-current h-8 w-8 mt-2 toggle" :class="{'reverse': showDateSelectionMenu}"
                         viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>
                        <path d="M0-.75h24v24H0z" fill="none"/>
                    </svg>
                </h5>

                <h5 class="text-3xl font-hairline self-end">
                    <span class="block" v-if="remainingBalance">{{ remainingBalance | yen }}</span>
                </h5>
            </div>

            <div v-if="showDateSelectionMenu" class="h-full flex flex-col mx-4">
                <a v-if="filteredBy" href="#" @click.prevent="filterWith(null)"
                   class="text-3xl font-hairline flex items-center no-underline text-grey-dark pb-2 mb-2">
                    {{ __('All entries') }}
            </a>
                <a v-show="filteredBy !== month" v-for="month in availableMonths" href="#"
                   @click.prevent="filterWith(month)"
                   class="text-3xl font-hairline flex items-center no-underline text-grey-dark pb-2 mb-2">{{ month |
                onlyYearAndMonth }}</a>
            </div>

            <EntriesOfTheDay v-if="! showDateSelectionMenu" :entries="filteredEntries[day]" :day="day"
                             v-for="(day, idx) in filteredDays" :key="idx"></EntriesOfTheDay>
        </div>

        <div class="flex flex-col justify-center items-center w-full p-6" v-show="! hasEntries">
            <p class="text-center text-2xl font-light">{{ __('Add your first entry!') }}</p>

            <a @click.prevent="$emit('showNewEntryScreen')" :title="__('Add Entry')" class="flex justify-between items-center bg-expense p-4 mt-8 text-white no-underline">
                <svg class="fill-current text-white w-4 h-4" viewBox="0 0 24 24" preserverAspectRatio="true"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>

                <span class="ml-4 mr-2">{{ __('New Entry') }}</span>
            </a>
        </div>
    </div>
</template>

<script>
    import {Timestamp} from '../../app/firestore';
    import {DateTime} from 'luxon';
    import {pickBy, reduce, uniqBy} from 'lodash';
    import EntriesOfTheDay from './EntriesOfTheDay.vue';
    import {mapActions, mapState} from 'vuex';

    export default {
        components: {
            EntriesOfTheDay
        },

        data: () => ({
            filteredBy: null,
            showDateSelectionMenu: false
        }),

        async created() {
            await this.getEntryStream(this.$route.params.id);
        },

        async beforeRouteUpdate(to, from, next) {
            await this.getEntryStream(to.params.id);
            next();
        },

        computed: {
            ...mapState('entries', {
                allEntries: 'entries'
            }),

            entries() {
                return this.allEntries[this.$route.params.id] !== undefined
                    ? this.allEntries[this.$route.params.id]
                    : {};
            },

            hasEntries() {
                return this.entries && Object.keys(this.entries).length > 0;
            },

            availableDays() {
                return Object.keys(this.entries).sort().reverse();
            },

            availableMonths() {
                if (!this.allEntries.hasOwnProperty(this.$route.params.id)) {
                    return [];
                }

                return uniqBy(
                    this.availableDays.map(date => new Date(DateTime.fromISO(date).toFormat('yyyy-MM'))),
                    (date) => date.getTime()
                );
            },

            title() {
                if (this.filteredBy) {
                    return DateTime.fromISO(this.filteredBy.toISOString()).
                        toLocaleString({year: 'numeric', month: 'long'});
                }
                return this.__('All entries');
            },

            filteredDays() {
                if (this.filteredBy) {
                    let filter = DateTime.fromISO(this.filteredBy.toISOString()).toFormat('yyyy-MM');
                    return pickBy(this.availableDays, (date) => (new RegExp(`^${filter}`, 'g')).test(date));
                }

                return this.availableDays;
            },

            filteredEntries() {
                if (this.filteredBy) {
                    let filter = DateTime.fromISO(this.filteredBy.toISOString()).toFormat('yyyy-MM');
                    return pickBy(this.entries, (_, date) => (new RegExp(`^${filter}`, 'g')).test(date));
                }

                return this.entries;
            },

            remainingBalance() {
                return reduce([].concat.apply([], Object.values(this.entries)), (result, entry) => {
                    if (entry.type === 'income') {
                        return Number(result) + Number(entry.amount);
                    }

                    return Number(result) - Number(entry.amount);
                }, 0);
            }
        },

        methods: {
            ...mapActions('entries', [
                'getEntryStream'
            ]),

            filterWith(date = null) {
                this.filteredBy = date;
                this.showDateSelectionMenu = false;
            }
        }
    }
</script>