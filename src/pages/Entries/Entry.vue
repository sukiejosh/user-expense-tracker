<template>
    <div class="flex flex-col items-center">
        <div class="bg-o5-grey-lighter block border-b border-o5-grey-light flex flex-col justify-center p-4 w-full"
             @click="$router.push({name: 'Edit Entry', params: {id: entry.id}})">
            <div class="flex flex-row items-center relative">
                <div class="flex-1">
                    <div :class="{'pb-2': entry.description}">{{ entry.category }}</div>
                    <div v-if="entry.description" class="text-grey text-sm">{{ entry.description }}</div>
                </div>

                <h5 class="text-2xl font-light"
                    :class="{'text-expense': entry.type === 'expense', 'text-income': entry.type === 'income'}">
                    {{ entry.type === 'expense' ? '- ' : ''}}{{ entry.amount | yen }}
                </h5>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},

        props: {
            entry: {
                type: Object,
                required: true
            }
        },

        data: () => ({
            editEntryModalOpen: false,
        }),

        computed: {},

        methods: {}
    }
</script>