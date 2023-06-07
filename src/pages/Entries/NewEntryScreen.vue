<template>
    <div class="container mx-auto">
        <div class="flex flex-row justify-between w-full text-xl">
            <button type="button" class="w-1/2 p-4" :class="form.type === 'expense' ? 'bg-expense text-grey-lightest' : 'bg-grey-light text-grey-dark'" @click.prevent="form.type = 'expense'">
                {{ __('Add :entryType', {entryType: __('expense')}) }}
            </button>
            <button type="button" class="w-1/2 p-4" :class="form.type === 'income' ? 'bg-income text-grey-lightest' : 'bg-grey-light text-grey-dark'" @click.prevent="form.type = 'income'">
                {{ __('Add :entryType', {entryType: __('income')}) }}
            </button>
        </div>

        <form class="w-full p-6 flex flex-col justify-start items-center" @submit.prevent="add(form)">

            <div class="w-full flex flex-wrap -mx-3 mb-3 relative">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-amount">
                        {{ __('Amount') }}
                    </label>

                    <div class="flex items-center bg-grey-lighter text-grey-darker border border-grey-lighter rounded">
                        <div class="pl-3 text-grey-darkest">¥</div>
                        <input type="number"
                               step="0.01"
                               :placeholder="__('Amount')"
                               v-model.number="form.amount"
                               id="grid-amount"
                               class="block appearance-none bg-transparent block w-full -ml-4 py-3 pl-6 pr-4"
                               autofocus
                               required
                        />
                    </div>
                </div>
            </div>

            <div class="w-full flex flex-wrap -mx-3 mb-3 relative">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-category">
                        {{ __('Category') }}
                    </label>
                    <multiselect id="grid-category" class="" :tagPlaceholder="__('Add New Category')"
                                 :selectLabel="__('Choose Category')"
                                 :selectedLabel="__('Selected')" :deselectLabel="__('Remove Category')"
                                 v-model="selectedCategory" :options="allCategories" :taggable="true"
                                 :placeholder="__('Category')" @tag="addCategory" openDirection="below"
                                 @input="chooseCategory"></multiselect>
                </div>
            </div>

            <div class="w-full flex flex-wrap -mx-3 mb-3 relative">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-description">
                        {{ __('Description') }}
                    </label>
                    <multiselect id="grid-description" class="" :tagPlaceholder="__('Add New Description')"
                                 :selectLabel="__('Choose Description')"
                                 :selectedLabel="__('Selected')" :deselectLabel="__('Remove Description')"
                                 v-model="selectedDescription" :options="descriptions" :taggable="true"
                                 :placeholder="__('Description')" @tag="addDescription" openDirection="below"
                                 @input="chooseDescription"></multiselect>
                </div>
            </div>

            <div class="w-full flex flex-wrap -mx-3 relative">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-on-date">
                        {{ __('On Date') }}
                    </label>
                    <input type="datetime-local"
                           :placeholder="__('On Date')"
                           v-model="selectedDate"
                           id="grid-on-date"
                           class="block appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                           required
                    />
                </div>
            </div>

            <hr class="w-1/3 border-t mb-3" />

            <button type="submit" class="w-1/2 bg-expense text-white p-3" :disabled="adding">
                {{ __('Add') }}
            </button>
        </form>
        <Loading :busy="adding"></Loading>
        <Notify type="error" :message="error.message" :show="error" v-if="error"></Notify>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
    .multiselect {
        background-color: #f1f5f8;
        border-radius: .25rem;
    }

    .multiselect__tags {
        border: 1px solid #f1f5f8;
        background-color: #f1f5f8;
        color: #606f7b;
        border-radius: .25rem;
        padding: .75rem 40px .75rem .75rem;
    }

    .multiselect__select {
        background-color: #f1f5f8;
        height: 46px;
        padding: .75rem .75rem;
    }

    .multiselect__select:before {
        color: #606f7b;
        border-color: #606f7b transparent transparent;
    }

    .multiselect__single {
        background-color: #f1f5f8;
        color: #606f7b;
        line-height: 1.15;
        padding-left: 0;
        margin-bottom: 0;
    }

    .multiselect__input {
        background-color: #f1f5f8;
        color: #606f7b;
        line-height: 1.15;
        padding-left: 0;
        margin-bottom: 0;
    }

    .multiselect__option--highlight {
        background: rgb(85, 197, 84);
    }

    .multiselect__option--highlight:after {
        background: rgb(85, 197, 84);
    }

    .multiselect__option--selected.multiselect__option--highlight {
        background: rgb(238, 27, 89);
    }

    .multiselect__option--selected.multiselect__option--highlight:after {
        background: rgb(238, 27, 89);
    }
</style>


<script>
    import Multiselect from 'vue-multiselect';
    import {mapActions, mapState} from 'vuex';
    import {isEmpty, filter} from 'lodash';
    import firebase from '@/app/firebase';
    import database from '@/app/firestore';
    import {DateTime} from 'luxon';
    import Loading from '../../components/Loading.vue';
    import Notify from '../../components/Notify.vue';

    export default {
        components: {
            Notify,
            Loading,
            Multiselect
        },

        props: {
            account: {
                required: true
            }
        },

        data: () => ({
            form: {
                uid: null,
                type: 'expense',
                amount: null,
                enteredAt: new Date,
                updatedAt: new Date,
                category: null,
                description: null
            },
            newCategories: [],
            newDescriptions: [],
            selectedDate: DateTime.local().toISODate() + 'T' + DateTime.local().toFormat('HH:mm'),
            selectedCategory: null,
            selectedDescription: null,
            adding: false,
            error: null
        }),

        watch: {
            selectedDate(newDate, old) {
                this.form.enteredAt = new Date(newDate);
            }
        },

        async created() {
            await this.getCategoryStream();
        },

        computed: {
            ...mapState('categories', [
                'categories'
            ]),
            allCategories() {
                return this.newCategories.concat(this.categories.map(category => category.name));
            },
            allDescriptions() {
                return this.descriptions.concat(this.newDescriptions);
            },
            descriptions() {
                let currentCategory = filter(this.categories, (category) => category.name === this.selectedCategory);

                if (currentCategory.length > 0) {
                    return currentCategory[0].hasOwnProperty('descriptions')
                        ? currentCategory[0].descriptions.map(description => description.content)
                        : [];
                }

                return [];
            }
        },

        methods: {
            ...mapActions('entries', [
                'addEntry',
            ]),
            ...mapActions('categories', [
                'getCategoryStream'
            ]),
            close() {
                this.$emit('close')
            },

            async add(entry) {
                if (isEmpty(entry.category)) {
                    this.error = new Error('You cannot add an entry without a category.');
                    return;
                }

                this.adding = true;

                try {
                    await this.addEntry({ accountId: this.account.name, ...entry});
                    this.close();
                } catch (error) {
                    console.log(error);
                } finally {
                    this.adding = false;
                }
            },

            addCategory(category) {
                this.newCategories.push(category);
                this.chooseCategory(category)
            },

            chooseCategory(category) {
                if (category) {
                    this.selectedCategory = category;
                    this.form.category = this.selectedCategory;
                }

                this.selectedDescription = null;
                this.form.description = null;
            },

            addDescription(description) {
                this.newDescriptions.push(description);
                this.chooseDescription(description);
            },

            chooseDescription(description) {
                if (description) {
                    this.selectedDescription = description;
                    this.form.description = this.selectedDescription;
                }
            },

        }

    }

</script>