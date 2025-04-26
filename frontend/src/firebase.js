import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCwIPWFzPXhKenHMhIS-eMiN4cPbECqcVE",
  authDomain: "slateworks-9b562.firebaseapp.com",
  projectId: "slateworks-9b562",
  storageBucket: "slateworks-9b562.appspot.com",
  messagingSenderId: "879528630918",
  appId: "1:879528630918:web:d6397655d42910079ecf07",
  measurementId: "G-RC1VCBL8XN"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app); 

export { auth, db, storage }; 

