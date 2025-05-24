// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS6tV9g9PcMwu7b2cWLALv7rIHhWDV4Y0",
  authDomain: "to-do-app-e5315.firebaseapp.com",
  projectId: "to-do-app-e5315",
  storageBucket: "to-do-app-e5315.firebasestorage.app",
  messagingSenderId: "270271463458",
  appId: "1:270271463458:web:66930022942168b16d4a7b",
  measurementId: "G-RDRHM12PBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable authentication emulator in development
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export { auth, db };
export default app;
