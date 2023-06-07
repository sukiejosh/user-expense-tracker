import {SET_CATEGORY_STREAM_UNSUBSCRIBER, ADD_CATEGORY, UPDATE_CATEGORY, REMOVE_CATEGORY} from './mutations';
import firestore, {FieldValue} from '@/app/firestore';
import {orderBy, remove} from 'lodash';
import firebase from '@/app/firebase';

const state = {
    categories: [],
    categoryStreamUnsubscriber: null,
};

const getters = {
    categories: ({categories}) => categories
};

const actions = {
    async getCategoryStream({commit, state}) {
        const user = firebase.auth().currentUser;
        const ref = firestore.collection('categories').where('uid', '==', user.uid).orderBy('name', 'asc');

        if (state.categoryStreamUnsubscriber) {
            return;
        }

        const categoryStreamUnsubscriber = await ref.onSnapshot(async snap => {
            snap.docChanges().forEach(async change => {
                const descriptionsRef = change.doc.ref.collection('descriptions').
                    where('uid', '==', user.uid).
                    orderBy('content', 'asc');

                let descriptions = await descriptionsRef.get();

                if (!descriptions.empty) {
                    descriptions = descriptions.docs.map(d => ({id: d.id, ...d.data()}));
                } else {
                    descriptions = [];
                }

                if (change.type === 'added') {
                    commit(ADD_CATEGORY, {id: change.doc.id, ...change.doc.data(), descriptions});
                }

                if (change.type === 'modified') {
                    commit(UPDATE_CATEGORY, {id: change.doc.id, ...change.doc.data(), descriptions});
                }

                if (change.type === 'removed') {
                    commit(REMOVE_CATEGORY, {id: change.doc.id, ...change.doc.data(), descriptions});
                }
            });

        });

        commit(SET_CATEGORY_STREAM_UNSUBSCRIBER, categoryStreamUnsubscriber);

    },
    async addCategory({}, {name}) {
        const user = firebase.auth().currentUser;
        const doc = `${user.uid}:${name}`;
        const ref = firestore.collection('categories').doc(doc);

        try {
            await ref.set({
                name,
                uid: user.uid,
                updatedAt: FieldValue.serverTimestamp()
            }, {merge: true});
        } catch (error) {
            throw error;
        }
    },
    async addDescription({}, {categoryId, description}) {
        const user = firebase.auth().currentUser;
        const {content} = description;
        const ref = firestore.collection('categories').doc(categoryId).collection('descriptions').doc(content);

        try {
            await ref.set({
                content,
                uid: user.uid,
                updatedAt: FieldValue.serverTimestamp()
            }, {merge: true});
        } catch (error) {
            throw error;
        }
    },
    async updateCategory({}, {currentCategory, updatedCategory}) {
        const user = firebase.auth().currentUser;
        const currentDoc = `${user.uid}:${currentCategory.name}`;
        const currentRef = firestore.collection('categories').doc(currentDoc);
        const {name} = updatedCategory;

        if (currentCategory.name !== updatedCategory.name) {
            const updatedDoc = `${user.uid}:${updatedCategory.name}`;
            const updatedRef = firestore.collection('categories').doc(updatedDoc);
            const currentDescriptions = await currentRef.collection('descriptions').where('uid', '==', user.uid).get();

            await updatedRef.set({
                name,
                uid: user.uid,
                updatedAt: FieldValue.serverTimestamp()
            });

            currentDescriptions.docs.forEach(async description => {
                await updatedRef.collection('descriptions').doc(description.id).set(description.data());
                await currentRef.collection('descriptions').doc(description.id).delete();
            });

            await currentRef.delete();

            return;
        }

        await currentRef.update({
            name,
            uid: user.uid,
            updatedAt: FieldValue.serverTimestamp()
        });
    },
    async removeCategory({}, {id, uid, category}) {
        const user = firebase.auth().currentUser;
        const doc = `${user.uid}:${category.name}`;
        const ref = firestore.collection('categories').doc(doc);

        try {
            await ref.delete();
        } catch (error) {
            throw error;
        }
    },
};

const mutations = {
    [SET_CATEGORY_STREAM_UNSUBSCRIBER](state, unsubscriber) {
        state.categoryStreamUnsubscriber = unsubscriber;
    },
    [ADD_CATEGORY](state, category) {
        state.categories.push(category);
        state.categories = orderBy(state.categories, c => c.name, ['asc']);
    },
    [UPDATE_CATEGORY](state, category) {
        const index = state.categories.findIndex(c => c.id === category.id);

        if (index === -1) {
            state.categories.push(category);
        } else {
            state.categories[index] = category;
        }

        state.categories = orderBy(state.categories, c => c.name, ['asc']);
    },
    [REMOVE_CATEGORY](state, category) {
        remove(state.categories, c => c.id === category.id);

        state.categories = orderBy(state.categories, c => c.name, ['asc']);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};