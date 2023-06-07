import {LOGIN_REQUEST, LOGIN_RESULT, LOGIN, LOGOUT, SET_PREFERENCES, UPDATE_PREFERENCES} from './mutations';
import Auth from '../../auth';
import firestore, {FieldValue} from '../../app/firestore';

const state = {
    loggedIn: false,
    profile: {},
    preferences: {}
};

const getters = {
    loggedIn: ({loggedIn}) => loggedIn,
    profile: ({profile}) => profile,
    preferences: ({preferences}) => preferences
};

const actions = {
    async [LOGIN_REQUEST]() {
        try {
            await Auth.loginRequest();
        } catch (error) {
            console.log(error);
        }
    },

    async [LOGIN_RESULT]() {
        try {
            let result = await Auth.loginResult();
        } catch (error) {
            console.log(error);
        }
    },

    async [LOGIN]({commit}) {
        try {
            const {user} = await Auth.login();

            commit(LOGIN, user);
        } catch (error) {
            console.log(error);
        }
    },

    async [LOGOUT]({commit}) {
        await Auth.logout();
        commit(LOGOUT);
    },

    async [SET_PREFERENCES]({commit, getters}) {
        let userData = await firestore.collection('users').doc(Auth.user.uid).get();
        let preferences = {
            language: 'en',
            currency: 'JPY'
        };

        if (!userData.exists) {
            await user.ref.set({
                ...getters.profile,
                preferences,
                updatedAt: FieldValue.serverTimestamp()
            });
        }

        if (userData.exists && userData.data().hasOwnProperty('preferences')) {
            preferences = userData.data().preferences;
        }

        commit(SET_PREFERENCES, {preferences});
    },

    async [UPDATE_PREFERENCES]({commit, getters}, preferences) {
        let userRef = await firestore.collection('users').doc(Auth.user.uid);

        await userRef.set({
            ...getters.profile,
            preferences,
            updatedAt: FieldValue.serverTimestamp()
        }, {merge: true});

        commit(UPDATE_PREFERENCES, { preferences });
    }
};

const mutations = {
    [LOGIN](state, user) {
        state.loggedIn = true;

        state.profile = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            picture: user.photoURL,
            phone: user.phoneNumber
        };
    },

    [LOGOUT](state) {
        state.loggedIn = false;
        state.profile = {};
        state.preferences = {};
    },

    [SET_PREFERENCES](state, {preferences}) {
        state.preferences = preferences;
    },

    [UPDATE_PREFERENCES](state, {preferences}) {
        state.preferences = preferences;
    }

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};