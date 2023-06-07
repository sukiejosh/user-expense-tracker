import { SET_ENTRY_STREAM_UNSUBSCRIBER, ADD_ENTRY, UPDATE_ENTRY, REMOVE_ENTRY } from './mutations'
import firestore, {FieldValue, Timestamp} from '@/app/firestore';
import {orderBy, remove} from 'lodash';
import firebase from '@/app/firebase';
import {DateTime} from 'luxon';
import Vue from 'vue';



const state = {
    entries: {},
    entryStreamUnsubscribers: {},
};

const getters = {
    entries: ({entries}) => entries
};

const actions = {
    async getEntryStream({commit, state}, accountId) {
        const user = firebase.auth().currentUser;
        const ref = firestore.collection('entries').
            where('uid', '==', user.uid).
            where('accountId', '==', accountId).
            orderBy('enteredAt', 'desc');

        if (state.entryStreamUnsubscribers.hasOwnProperty(accountId)) {
            return;
        }

        const entryStreamUnsubscriber = await ref.onSnapshot(snap => {
            snap.docChanges().forEach(async(change) => {
                if (change.type === 'added') {
                    commit(ADD_ENTRY, {id: change.doc.id, ...change.doc.data()});
                }

                if (change.type === 'modified') {
                    commit(UPDATE_ENTRY, {id: change.doc.id, ...change.doc.data()});
                }

                if (change.type === 'removed') {
                    commit(REMOVE_ENTRY, {id: change.doc.id, ...change.doc.data()});
                }
            });
        });

        commit(SET_ENTRY_STREAM_UNSUBSCRIBER, {accountId, entryStreamUnsubscriber});
    },
    async addEntry({}, {accountId, amount, category, description, enteredAt, type}) {
        const user = firebase.auth().currentUser;
        const entryRef = firestore.collection('entries').doc();
        const entry = {
            uid: user.uid,
            amount: Number(amount),
            updatedAt: FieldValue.serverTimestamp(),
            type,
            accountId,
            category,
            description,
            enteredAt
        };
        const batch = firestore.batch();

        if(! category) {
            throw new Error('You cannot add an entry without a category.');
        }

        const categoryId = `${user.uid}:${category}`;
        const categoryRef = firestore.collection('categories').doc(categoryId);

        batch.set(categoryRef, {
            name: category,
            uid: user.uid,
            updatedAt: FieldValue.serverTimestamp()
        }, {merge: true});

        if (description) {
            const descriptionRef = categoryRef.collection('descriptions').doc(description);

            batch.set(descriptionRef, {
                content: description,
                uid: user.uid,
                updatedAt: FieldValue.serverTimestamp()
            }, {merge: true});
        }

        batch.set(entryRef, entry, {merge: true});

        try {
            await batch.commit();
        } catch (error) {
            throw error;
        }
    },
    async updateEntry({}, {currentEntry, updatedEntry}) {
        const user = firebase.auth().currentUser;
        let {id: currentId, enteredAt: currentEnteredAt} = currentEntry;
        const currentRef = firestore.collection('entries').doc(currentId);
        const batch = firestore.batch();

        const { category, description } = updatedEntry;

        if(! category) {
            throw new Error('You cannot add an entry without a category.');
        }

        const categoryId = `${user.uid}:${category}`;
        const categoryRef = firestore.collection('categories').doc(categoryId);

        batch.set(categoryRef, {
            name: category,
            uid: user.uid,
            updatedAt: FieldValue.serverTimestamp()
        }, {merge: true});

        if (description) {
            const descriptionRef = categoryRef.collection('descriptions').doc(description);

            batch.set(descriptionRef, {
                content: description,
                uid: user.uid,
                updatedAt: FieldValue.serverTimestamp()
            }, {merge: true});
        }

        const entry = {
            uid: user.uid,
            amount: Number(updatedEntry.amount),
            updatedAt: FieldValue.serverTimestamp(),
            type: updatedEntry.type,
            accountId: updatedEntry.accountId,
            category: category,
            description: description,
            enteredAt: updatedEntry.enteredAt
        };

        if(currentEnteredAt.hasOwnProperty('seconds')) {
            currentEnteredAt = new Timestamp(currentEnteredAt.seconds, currentEnteredAt.nanoseconds).toDate();
        }

        const currentGroupId = DateTime.fromISO(currentEnteredAt.toISOString()).toISODate();
        const updatedGroupId = DateTime.fromISO(updatedEntry.enteredAt.toISOString()).toISODate();

        if (currentGroupId !== updatedGroupId) {
            const updatedRef = firestore.collection('entries').doc();

            batch.set(updatedRef, entry, {merge: true});
            batch.delete(currentRef);
        } else {
            batch.update(currentRef, entry);
        }

        try {
            await batch.commit();
        } catch (error) {
            throw error;
        }
    },
    async removeEntry({}, {id, uid}) {
        const user = firebase.auth().currentUser;

        if(user.uid !== uid) {
            throw new Error('You cannot remove an entry of another user.');
        }

        const ref = firestore.collection('entries').doc(id);
            try {
                await ref.delete();
            } catch (error) {
                throw error;
            }
    },
};

const mutations = {
    [SET_ENTRY_STREAM_UNSUBSCRIBER](state, {accountId, entryStreamUnsubscriber}) {
        if (!state.entries.hasOwnProperty(accountId)) {
            state.entries = {
                [accountId]: {},
                ...state.entries
            };
        }

        state.entryStreamUnsubscribers[accountId] = entryStreamUnsubscriber;
    },
    [ADD_ENTRY](state, entry) {
        if (!state.entries.hasOwnProperty(entry.accountId)) {
            state.entries = {
                [entry.accountId]: {},
                ...state.entries
            };
        }

        const enteredAt = new Timestamp(entry.enteredAt.seconds, entry.enteredAt.nanoseconds).toDate();
        let groupId = DateTime.fromISO(enteredAt.toISOString()).toISODate();

        if (!state.entries[entry.accountId].hasOwnProperty(groupId)) {
            Vue.set(state.entries[entry.accountId], groupId, []);
        }

        state.entries[entry.accountId][groupId].push(entry);

        state.entries[entry.accountId][groupId] = orderBy(state.entries[entry.accountId][groupId],
            e => e.enteredAt.seconds, ['desc']);
    },
    [UPDATE_ENTRY](state, entry) {
        /**
         * We will always delete an entry and create a new one if
         * enteredAt changed, so update will only ever be called when no dates
         * have changed.
         */
        if (!state.entries.hasOwnProperty(entry.accountId)) {
            state.entries = {
                [entry.accountId]: {},
                ...state.entries
            };
        }

        const enteredAt = new Timestamp(entry.enteredAt.seconds, entry.enteredAt.nanoseconds).toDate();
        let groupId = DateTime.fromISO(enteredAt.toISOString()).toISODate();

        if (!state.entries[entry.accountId].hasOwnProperty(groupId)) {
            Vue.set(state.entries[entry.accountId], groupId, []);
        }

        const index = state.entries[entry.accountId][groupId].findIndex(e => e.id === entry.id);

        if (index === -1) {
            state.entries[entry.accountId][groupId].push(entry);
        } else {
            state.entries[entry.accountId][groupId][index] = entry;
        }

        state.entries[entry.accountId][groupId] = orderBy(state.entries[entry.accountId][groupId],
            e => e.enteredAt.seconds, ['desc']);
    },
    [REMOVE_ENTRY](state, entry) {
        if (!state.entries.hasOwnProperty(entry.accountId)) {
            state.entries = {
                [entry.accountId]: {},
                ...state.entries
            };
        }

        const enteredAt = new Timestamp(entry.enteredAt.seconds, entry.enteredAt.nanoseconds).toDate();
        let groupId = DateTime.fromISO(enteredAt.toISOString()).toISODate();

        if (!state.entries[entry.accountId].hasOwnProperty(groupId)) {
            Vue.set(state.entries[entry.accountId], groupId, []);
        }

        remove(state.entries[entry.accountId][groupId], e => e.id === entry.id);

        if(state.entries[entry.accountId][groupId].length > 0) {
            state.entries[entry.accountId][groupId] = orderBy(state.entries[entry.accountId][groupId],
                e => e.enteredAt.seconds, ['desc']);
        } else {
            delete state.entries[entry.accountId][groupId];
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};