import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvdlyXv1L9Mkb18ij3cNngzX_EA2aPmws",
  authDomain: "mobiluygulamaprojesi-dd70a.firebaseapp.com",
  databaseURL: "https://mobiluygulamaprojesi-dd70a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mobiluygulamaprojesi-dd70a",
  storageBucket: "mobiluygulamaprojesi-dd70a.firebasestorage.app",
  messagingSenderId: "644416957523",
  appId: "1:644416957523:web:d42608460b44c1c2b6eaa6",
  measurementId: "G-EYB01TR4GE",
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Authentication modülünü dışa aktar
const auth = getAuth(app);

export { auth };