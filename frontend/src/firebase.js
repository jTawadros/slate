import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCwIPWFzPXhKenHMhIS-eMiN4cPbECqcVE",
  authDomain: "slateworks-9b562.firebaseapp.com",
  projectId: "slateworks-9b562",
  storageBucket: "slateworks-9b562.firebasestorage.app",
  messagingSenderId: "879528630918",
  appId: "1:879528630918:web:d6397655d42910079ecf07",
  measurementId: "G-RC1VCBL8XN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
