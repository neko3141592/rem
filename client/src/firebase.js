import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA2fX-Jq852E0q4h3iVqNS3RLarslv0NoA",
    authDomain: "rem-docs-11385.firebaseapp.com",
    projectId: "rem-docs-11385",
    storageBucket: "rem-docs-11385.firebasestorage.app",
    messagingSenderId: "460425669353",
    appId: "1:460425669353:web:15044669e396ba7497de78",
    measurementId: "G-789758SN3Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};