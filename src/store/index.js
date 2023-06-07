import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import accounts from './accounts';
import entries from './entries';
import categories from './categories';
import {LOGOUT} from './auth/mutations';
import {RESET, SET_LANGUAGE, SET_CURRENCY} from './mutations';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        auth,
        accounts,
        entries,
        categories
    },

    strict: true,

    state: {
        language: 'en',
        currency: 'JPY'
    },

    getters: {
        language: ({language}) => language,
        currency: ({currency}) => currency
    },

    actions: {
        [SET_LANGUAGE]({commit, getters}) {
            commit(SET_LANGUAGE, getters['auth/preferences']);
        },
        [SET_CURRENCY]({commit, getters}) {
            commit(SET_CURRENCY, getters['auth/preferences']);
        }
    },

    mutations: {
        [RESET](state) {
            state = {};
        },

        [SET_LANGUAGE](state, {language}) {
            state.language = language;
        },

        [SET_CURRENCY](state, {currency = 'JPY'}) {
            state.currency = currency;
        },
    }
});

store.subscribeAction(({type}) => {
    if (type === `auth/${LOGOUT}`) {
        store.commit(RESET);
    }
});

export default store;