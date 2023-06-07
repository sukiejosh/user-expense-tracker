import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyCGQpN-5AO2TIbkOsOYrjErmJFHdIgfKyI",
    authDomain: "expense-tracker-demo-1.firebaseapp.com",
    databaseURL: "https://expense-tracker-demo-1.firebaseio.com",
    projectId: "expense-tracker-demo-1",
});

export default firebase;