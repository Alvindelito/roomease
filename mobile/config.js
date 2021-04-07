import * as firebase from "firebase";


export const firebaseConfig = {
  apiKey: "AIzaSyB39_WTaelBOmzs6U0fk6p1VNCXqdyPEGg",
  authDomain: "roomease-4b67e.firebaseapp.com",
  databaseURL: "https://roomease-4b67e.firebaseio.com",
  projectId: "roomease-4b67e",
  storageBucket: "roomease-4b67e.appspot.com",
  messagingSenderId: "550405659559",
  appId: "1:550405659559:web:ede2a9cdfa9d02e1417482",
  measurementId: "G-M4JP4QY5VV"
};

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
