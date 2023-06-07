import {SET_ACCOUNT_STREAM_UNSUBSCRIBER, ADD_ACCOUNT, UPDATE_ACCOUNT, REMOVE_ACCOUNT} from './mutations';
import firestore, {FieldValue} from '@/app/firestore';
import {orderBy, remove} from 'lodash';
import firebase from '@/app/firebase';

const state = {
    accounts: [],
    accountStreamUnsubscriber: null
};

const getters = {
    accounts: ({accounts}) => accounts
};

const actions = {
    async getAccountStream({commit, state}) {
        const user = firebase.auth().currentUser;
        const ref = firestore.collection('users').
            doc(user.uid).
            collection('accounts').
            where('uid', '==', user.uid).
            orderBy('name', 'asc');

        if (state.accountStreamUnsubscriber) {
            return;
        }

        const accountStreamUnsubscriber = await ref.onSnapshot(snap => {
            snap.docChanges().forEach(async(change) => {
                if (change.type === 'added') {
                    commit(ADD_ACCOUNT, {id: change.doc.id, ...change.doc.data()});
                }

                if (change.type === 'modified') {
                    commit(UPDATE_ACCOUNT, {id: change.doc.id, ...change.doc.data()});
                }

                if (change.type === 'removed') {
                    commit(REMOVE_ACCOUNT, {id: change.doc.id, ...change.doc.data()});
                }
            });
        });

        commit(SET_ACCOUNT_STREAM_UNSUBSCRIBER, accountStreamUnsubscriber);
    },
    async addAccount({}, {name, type}) {
        const user = firebase.auth().currentUser;
        const ref = firestore.collection('users').doc(user.uid).collection('accounts').doc(name);

        try {
            await ref.set({
                name,
                type,
                uid: user.uid,
                updatedAt: FieldValue.serverTimestamp()
            }, {merge: true});
        } catch (error) {
            throw error;
        }
    },
    async updateAccount({}, {currentAccount, updatedAccount}) {
        const user = firebase.auth().currentUser;
        const currentRef = firestore.collection('users').doc(user.uid).collection('accounts').doc(currentAccount.name);

        const {name, type} = updatedAccount;

        if (currentAccount.name !== updatedAccount.name) {
            const updatedRef = firestore.collection('users').
                doc(user.uid).
                collection('accounts').
                doc(updatedAccount.name);
            const currentEntries = await firestore.collection('entries').
                where('accountId', '==', name).
                where('uid', '==', user.uid).
                get();

            await updatedRef.set({
                name,
                type,
                uid: user.uid,
                updatedAt: FieldValue.serverTimestamp()
            });

            await currentEntries.docs.forEach(async entryDoc => {
                const {accountId, updatedAt, ...entry} = entryDoc.data();
                await entryDoc.ref.set(
                    {accountId: updatedAccount.name, ...entry, updatedAt: FieldValue.serverTimestamp()}, {merge: true});
            });

            await currentRef.delete();

            return;
        }

        await currentRef.update({
            name,
            type,
            uid: user.uid,
            updatedAt: FieldValue.serverTimestamp()
        });
    },
    async removeAccount({}, {name}) {
        const user = firebase.auth().currentUser;
        const ref = firestore.collection('users').doc(user.uid).collection('accounts').doc(name);
        const entriesRef = firestore.collection('entries').where('accountId', '==', name).where('uid', '==', user.uid);

        const entries = await entriesRef.get();

        if (entries.empty) {
            try {
                await ref.delete();
            } catch (error) {
                throw error;
            }
        } else {
            throw new Error('You cannot remove an account with entries. Please remove all entries first.');
        }
    },
};

const mutations = {
    [SET_ACCOUNT_STREAM_UNSUBSCRIBER](state, unsubscriber) {
        state.accountStreamUnsubscriber = unsubscriber;
    },
    [ADD_ACCOUNT](state, account) {
        state.accounts.push(account);
        state.accounts = orderBy(state.accounts, a => a.name, ['asc']);
    },
    [UPDATE_ACCOUNT](state, account) {
        const index = state.accounts.findIndex(a => a.id === account.id);

        if (index === -1) {
            state.accounts.push(account);
        } else {
            state.accounts[index] = account;
        }

        state.accounts = orderBy(state.accounts, a => a.name, ['asc']);
    },
    [REMOVE_ACCOUNT](state, account) {
        remove(state.accounts, a => a.id === account.id);

        state.accounts = orderBy(state.accounts, a => a.name, ['asc']);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};