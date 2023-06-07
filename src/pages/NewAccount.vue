<template>
    <div class="flex flex-col items-start justify-start relative z-10">
        <section class="w-full relative z-10 shadow bg-white">
            <div class="container mx-auto">
                <div class="p-4 flex justify-between items-center w-full h-full text-xl font-light text-grey-darkest">
                    <h2 class="text-2xl text-grey-dark font-hairline flex-1 flex items-center">{{ __('Add Account')
                        }}</h2>
                </div>
            </div>
        </section>

        <div class="container mx-auto">
            <form class="w-full p-6 flex flex-col justify-start items-center" @submit.prevent="add(form)">
                <div class="w-full flex flex-wrap -mx-3 mb-3 relative">
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                               for="grid-name">
                            {{ __('Account Name') }}
                        </label>
                        <input type="text"  v-model="form.name"
                                class="block appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                                id="grid-name" required autofocus :placeholder="__('Account Name')" />
                    </div>
                </div>

                <div class="w-full flex flex-wrap -mx-3 mb-3 relative">
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                               for="grid-type">
                            {{ __('Account Type') }}
                        </label>
                        <select v-model="form.type"
                                class="block appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                                id="grid-type">
                            <option :value="type" v-for="type in types">{{ __(type) }}</option>
                        </select>
                    </div>

                    <div class="pointer-events-none absolute pin-y pin-r flex items-center px-6 pt-3 text-grey-darker">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                    </div>
                </div>

                <hr class="w-1/3 border-t mb-3"/>

                <button type="submit" class="w-1/2 bg-expense text-white p-3" :disabled="adding">
                    {{ __('Add') }}

                </button>

            </form>
        </div>


        <Notify type="error" :message="error.message" :show="error" @dismiss="error = null" v-if="error"></Notify>
        <Loading :busy="adding"></Loading>
    </div>
</template>

<script>
    import {isEmpty} from 'lodash';
    import {mapActions, mapGetters} from 'vuex';
    import Notify from '../components/Notify';
    import Loading from '../components/Loading.vue';

    export default {
        components: {
            Notify,
            Loading
        },

        data: () => ({
            adding: false,
            error: null,
            types: [
                'cash',
                'credit_card',
                'debit_card',
                'savings'
            ],
            form: {
                name: null,
                type: 'cash'
            }
        }),

        methods: {
            ...mapActions('accounts', [
                'addAccount'
            ]),

            async add({name, type}) {
                if (isEmpty(name)) {
                    this.error = new Error('You cannot add an account without a name');
                    return;
                }

                this.adding = true;
                this.error = null;

                try {
                    await this.addAccount({name, type});
                    this.$router.push({name: 'Home'});
                } catch (error) {
                    console.log(error);
                    this.error = error;
                } finally {
                    this.adding = false;
                }
            }
        }
    }
</script>