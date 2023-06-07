import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Auth from '@/auth';
import Settings from '@/pages/Settings';
import Account from '@/pages/Account';
import NewAccount from '@/pages/NewAccount';
import NewEntry from '@/pages/NewEntry';
import EditEntry from '@/pages/EditEntry';
import Overviews from '@/pages/Overviews';
import Overview from '@/pages/Overview';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    linkExactActiveClass: 'active',

    routes: [
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/add',
            name: 'Add Entry',
            component: NewEntry,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/overviews',
            name: 'Overviews',
            component: Overviews,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/overviews/:accountId',
            name: 'View Overview',
            component: Overview,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/accounts/add',
            name: 'Add Account',
            component: NewAccount,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/accounts/:id',
            name: 'View Account',
            component: Account,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/entries/:id/edit',
            name: 'Edit Entry',
            component: EditEntry,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/settings',
            name: 'Settings',
            component: Settings,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                hideAppLayout: true
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    let currentUser = Auth.user;
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !currentUser) next('/login');
    else next();

    next();
});

export default router;