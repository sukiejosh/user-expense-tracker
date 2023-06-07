import firebase from './firebase';

const firestore = firebase.firestore();

firestore.settings({
    timestampsInSnapshots: true
});

firestore.enablePersistence();

export const FieldValue = firebase.firestore.FieldValue;
export const Timestamp = firebase.firestore.Timestamp;

export default firestore;