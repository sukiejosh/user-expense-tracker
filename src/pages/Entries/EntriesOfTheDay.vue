<template>
    <div class="">
        <div class="flex flex-row justify-between w-full">
            <span v-if="hasTitle" class="font-thin text-sm pb-2 px-4 block mt-4">{{ title }}</span>
            <span v-if="! hasTitle" class="font-thin text-sm pb-2 px-4 block mt-4">{{ day | date }}</span>
            <span class="font-thin text-sm pb-2 px-4 block mt-4">{{ flow | yen }}</span>
        </div>

        <div class="entries">
            <Entry :entry="entry" v-for="entry in entries" :key="entry.id"></Entry>
        </div>
    </div>
</template>

<script>
    import { isEmpty, groupBy, sumBy } from 'lodash'
    import Entry from './Entry.vue'

    export default {
        props: {
            day: {},
            title: {
                required: false
            },
            entries: {}
        },

        components: {
            Entry
        },

        computed: {
            flow() {
                let entries = groupBy(this.entries, 'type');
                let expenses = sumBy(entries.expense, 'amount');
                let income = sumBy(entries.income, 'amount');

                return income - expenses;
            },

            hasTitle() {
                return ! isEmpty(this.title);
            }
        },

        methods: {
        }
    }
</script>
