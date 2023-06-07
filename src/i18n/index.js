import translations from './translations';
import {forEach} from 'lodash';
import store from '../store';
import Vue from 'vue';

export function __(key, replace) {
    let defaultLang = this ? this.$options.language : 'en';
    let lang = store.getters['language'];

    let i18n = translations.hasOwnProperty(lang) ? translations[lang] : translations[defaultLang];

    let translation = i18n.hasOwnProperty(key) ? i18n[key] : key;

    forEach(replace, (value, key) => {
        translation = translation.replace(':' + key, value);
    });

    return translation;
}

Vue.mixin({
    language: 'en',
    methods: {
        __(key, replace) {
            return __(key, replace);
        }
    }
});

export default __;