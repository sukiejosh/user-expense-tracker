/**
 * @typedef {Object} Auth
 * @property {firebase.auth.Auth} auth
 * @property {firebase.auth.AuthProvider} provider
 * @property {firebase.User|null} [user]
 */
import firebase from '../app/firebase';
import store from '../store';
import {LOGIN, LOGOUT, SET_PREFERENCES} from '../store/auth/mutations';

export class Auth {
    /**
     * @param {FirebaseNamespace} firebase
     */
    constructor(firebase) {
        this.auth = firebase.auth();
        this.provider = new firebase.auth.GoogleAuthProvider();
    }

    /**
     * @returns {firebase.auth.User}
     */
    get user() {
        return this.auth.currentUser;
    }

    /**
     * @returns {Promise.<firebase.auth.User>}
     */
    async login() {
        return await this.auth.signInWithPopup(this.provider);
    }

    /**
     * @returns {Promise.<void>}
     */
    async loginRequest() {
        return await this.auth.signInWithRedirect(this.provider);
    }

    /**
     * @returns {Promise.<firebase.auth.User>}
     */
    async loginResult() {
        return await this.auth.getRedirectResult()
    }

    /**
     * @returns {Promise.<void>}
     */
    async logout() {
        return await this.auth.signOut();
    }
}

firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
        store.commit(`auth/${LOGIN}`, user);
        await store.dispatch(`auth/${SET_PREFERENCES}`);
    } else {
        await store.dispatch(`auth/${LOGOUT}`);
    }
});

export default new Auth(firebase);