import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByt9KDIBnpexFh09mwcBM9Q16N4HzuNdA",
  authDomain: "fireshort-e4651.firebaseapp.com",
  projectId: "fireshort-e4651",
  storageBucket: "fireshort-e4651.appspot.com",
  messagingSenderId: "918733614574",
  appId: "1:918733614574:web:0327c33d341bcbf7bb32ff"
};


export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDb = myFirebase.firestore();
export const db = baseDb;