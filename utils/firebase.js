// const firebase = require("firebase/app");
// import 'firebase/firestore'

// const config = {
//   apiKey: "AIzaSyBJeEYpd64-3HA7SJQMs5M69hbCwgEJlCQ",
//   authDomain: "yocodeclubs.firebaseapp.com",
//   projectId: "yocodeclubs",
//   storageBucket: "yocodeclubs.appspot.com",
//   messagingSenderId: "438609566476",
//   appId: "1:438609566476:web:b6fd89755106c0e45d4729"
// }

// export default function initFirebase() {
//     firebase.initializeApp(config)
//     console.log('fire connection is up and running')
// }


import * as firebase from 'firebase/firebase';
import 'firebase/firestore';

const clientCredentials = {
  apiKey: "AIzaSyBJeEYpd64-3HA7SJQMs5M69hbCwgEJlCQ",
  authDomain: "yocodeclubs.firebaseapp.com",
  projectId: "yocodeclubs",
  storageBucket: "yocodeclubs.appspot.com",
  messagingSenderId: "438609566476",
  appId: "1:438609566476:web:b6fd89755106c0e45d4729"
};

firebase.initializeApp(clientCredentials);

const firestore = firebase.firestore()

export default firestore;

