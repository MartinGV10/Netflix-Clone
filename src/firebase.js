import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBiTg1jnZnsA40QMUlVm4uAq6f7_-wGmrU",
    authDomain: "netflix-clone-36967.firebaseapp.com",
    projectId: "netflix-clone-36967",
    storageBucket: "netflix-clone-36967.firebasestorage.app",
    messagingSenderId: "1089202822368",
    appId: "1:1089202822368:web:eb46b401f283fc1b408485"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { auth, db };
