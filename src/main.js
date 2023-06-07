import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import PortalVue from 'portal-vue';
import '@/helpers/filters';
import './i18n';

Vue.config.productionTip = false;

Vue.use(PortalVue);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
