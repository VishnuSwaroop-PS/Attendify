// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnVKcA3tG7VFZs7ma-hHbbpDf0oNq-Q80",
  authDomain: "smart-attendance-2ce78.firebaseapp.com",
  projectId: "smart-attendance-2ce78",
  storageBucket: "smart-attendance-2ce78.appspot.com",
  messagingSenderId: "478277801915",
  appId: "1:478277801915:web:df01b6110123738370d69e",
  measurementId: "G-4X72RLQ1C6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

export { firestore };