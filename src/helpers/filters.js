import Vue from 'vue';
import {DateTime, Settings} from 'luxon';
import store from '../store';

store.watch(({language}) => language, (toLanguage, fromLanguage) => {
    Settings.defaultLocale = toLanguage;
});

Vue.filter('date', value => {
    return DateTime.fromFormat(value, 'yyyy-L-d').toLocaleString({year: 'numeric', month: 'long', day: 'numeric'});
});

Vue.filter('yen', value => {
    return new Intl.NumberFormat(store.getters.language, {
        style: 'currency',
        currency: store.getters.currency
    }).format(value);
});

Vue.filter('onlyYearAndMonth', value => {
    return DateTime.fromISO(value.toISOString()).toLocaleString({year: 'numeric', month: 'long'});
});