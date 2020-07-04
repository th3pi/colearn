import * as firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyCQ1ofiNqi57YO9TNi8zzljikkobALP1RE",
    authDomain: "co-learn-a05d9.firebaseapp.com",
    databaseURL: "https://co-learn-a05d9.firebaseio.com",
    projectId: "co-learn-a05d9",
    storageBucket: "co-learn-a05d9.appspot.com",
    messagingSenderId: "159948318731",
    appId: "1:159948318731:web:29bf2c7d4016fae29b3f0e",
    measurementId: "G-HWLQMHVY9K",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebaseApp.firestore();

export const auth = firebase.auth();
