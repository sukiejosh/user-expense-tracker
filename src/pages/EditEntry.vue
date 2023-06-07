<template>
    <transition name="slideInDownOutUp">
        <div class="bg-bubble flex flex-col items-start justify-start relative z-10" v-if="entry">
            <section class="w-full relative z-10 shadow bg-white">
                <div class="container mx-auto">
                    <div class="p-4 flex justify-between items-center w-full h-full text-xl font-light text-grey-darkest">
                        <div class="flex-1 flex justify-start items-center">
                            <a class="block h-6 w-6 cursor-pointer" :title="__('Close')" @click.prevent="$router.back()">
                                <svg class="fill-current h-6 w-6 text-grey hover:text-grey-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M4.93 19.07A10 10 0 1 1 19.07 4.93 10 10 0 0 1 4.93 19.07zm1.41-1.41A8 8 0 1 0 17.66 6.34 8 8 0 0 0 6.34 17.66zM13.41 12l1.42 1.41a1 1 0 1 1-1.42 1.42L12 13.4l-1.41 1.42a1 1 0 1 1-1.42-1.42L10.6 12l-1.42-1.41a1 1 0 1 1 1.42-1.42L12 10.6l1.41-1.42a1 1 0 1 1 1.42 1.42L13.4 12z"/>
                                </svg>
                            </a>

                            <h2 class="text-2xl text-grey-dark font-hairline flex-1 flex items-center px-4">{{ __('Edit :entryType', {entryType: __(form.type)}) }}</h2>
                        </div>
                        <button type="button" class="w-6 h-6 flex" @click="remove(entry)" aria-label="Delete">
                            <svg class="w-6 h-6 fill-current text-expense opacity-80" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/>
                                <path fill="none" d="M0 0h24v24H0V0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            <div class="container mx-auto">
                <div class="flex flex-row justify-between w-full text-xl">
                    <button type="button" class="w-1/2 p-4" :class="form.type === 'expense' ? 'bg-expense text-grey-lightest' : 'bg-grey-light text-grey-dark'" @click.prevent="form.type = 'expense'">
                        {{ __('expense') }}
                </button>
                    <button type="button" class="w-1/2 p-4" :class="form.type === 'income' ? 'bg-income text-grey-lightest' : 'bg-grey-light text-grey-dark'" @click.prevent="form.type = 'income'">
                        {{ __('income') }}
                </button>
                </div>

                <form class="w-full p-6 flex flex-col justify-start items-center" @submit.prevent="update(entry, form)">

                    <div class="w-full flex flex-wrap -mx-3 mb-3 relative">
                        <div class="w-full px-3">
                            <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-account">
                                {{ __('Account') }}
                        </label>
                            <multiselect id="grid-account" class=""
                                         :selectLabel="__('Choose Account')" label="name"
                                         :selectedLabel="__('Selected')" :deselectLabel="__('Remove Account')"
                                         v-model="selectedAccount" :options="accounts" :allow-empty="false" track-by="name"
                                         :placeholder="__('Account')" openDirection="below" @input="chooseAccount"
                            ></multiselect>
                        </div>
                    </div>

                    <hr class="w-1/3 border-t mb-3" />

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

                    <div class="w-full flex flex-wrap -mx-3 mb-3 relative">
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

                    <button type="submit" class="w-1/2 bg-expense text-white p-3" :disabled="busy">
                        {{ __('Update') }}
                </button>
                </form>
                <Loading :busy="busy"></Loading>
                <Notify type="error" :message="error.message" :show="error" v-if="error" @dismiss="error = null"></Notify>
            </div>
        </div>
    </transition>
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
    import {mapActions, mapState} from 'vuex';
    import firebase from '@/app/firebase';
    import firestore, {FieldValue, Timestamp} from '@/app/firestore';
    import Multiselect from 'vue-multiselect';
    import {isEmpty, filter} from 'lodash';
    import {DateTime} from 'luxon';
    import Loading from '../components/Loading.vue';
    import Notify from '../components/Notify.vue';

    export default {
        components: {
            Notify,
            Loading,
            Multiselect
        },

        data: () => ({
            entry: {},
            form: {
                accountId: '',
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
            selectedAccount: null,
            busy: false,
            error: null
        }),

        watch: {
            selectedDate(newDate, old) {
                this.form.enteredAt = new Date(newDate);
            }
        },

        computed: {
            ...mapState('entries', [
                'entries'
            ]),
            ...mapState('accounts', [
                'accounts',
            ]),
            ...mapState('categories', [
                'categories',
            ]),
            account() {
                const filteredResult = this.accounts.filter(account => account.id === this.entry.accountId);
                return filteredResult.length > 0 ? filteredResult[0] : null;
            },
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

        async created() {
            await this.getAccountStream();
            await this.getCategoryStream();
            const entry = await this.getEntry(this.$route.params.id);

            this.assignFormData(entry);
        },

        async beforeRouteUpdate(to, from, next) {
            await this.getAccountStream();
            await this.getCategoryStream();
            const entry = await this.getEntry(this.$route.params.id);

            this.assignFormData(entry);
            next();
        },

        methods: {
            ...mapActions('entries', [
                'updateEntry',
                'removeEntry'
            ]),
            ...mapActions('accounts', [
                'getAccountStream'
            ]),
            ...mapActions('categories', [
                'getCategoryStream',
            ]),
            assignFormData({ ...entry}) {
                const enteredAt = new Timestamp(entry.enteredAt.seconds, entry.enteredAt.nanoseconds).toDate();
                let date = DateTime.fromISO(enteredAt.toISOString());

                this.form.id = entry.id;
                this.form.uid = entry.uid;
                this.form.type = entry.type;
                this.form.amount = entry.amount;
                this.form.category = entry.category;
                this.form.description = entry.description;
                this.form.enteredAt = enteredAt;
                this.form.accountId = this.account.id;

                this.selectedAccount = this.account;
                this.selectedCategory = entry.category;
                this.selectedDescription = entry.description;
                this.selectedDate = date.toISODate() + 'T' + date.toFormat('HH:mm');
            },

            async getEntry(entryId) {
                const entryRef = firestore.collection('entries').doc(entryId);

                try {
                    let entryData = await entryRef.get();
                    this.entry = {id: entryData.id, ...entryData.data()};
                    return this.entry;
                } catch (error) {
                    console.log(error)
                }

                return {};
            },

            async update(currentEntry, updatedEntry) {
                if (isEmpty(updatedEntry.category)) {
                    this.error = new Error('You cannot add an entry without a category.');
                    return;
                }

                this.busy = true;

                try {
                    await this.updateEntry({currentEntry, updatedEntry});
                    this.busy = false;
                    this.$router.back();
                } catch (error) {
                    console.log(error);
                    this.error = error;
                    this.busy = false;
                }
            },

            async remove(entry) {
                this.busy = true;

                try {
                    await this.removeEntry(entry);
                    this.busy = false;
                    this.$router.back();
                }  catch (error) {
                    console.log(error);
                    this.error = error;
                    this.busy = false;
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
            chooseAccount(account) {
                if (account) {
                    this.selectedAccount = account;
                    this.form.accountId = this.selectedAccount.name;
                }
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