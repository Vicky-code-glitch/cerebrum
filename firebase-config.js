/*
INSTRUCTIONS TO SET UP FIREBASE:

1. Go to https://console.firebase.google.com/
2. Create your project
3. Add a Web App
4. Copy your firebaseConfig below
5. Enable Authentication + Firestore
*/

// Your Firebase config from the console
const firebaseConfig = {
    apiKey: "AIzaSyBZd_W81jLgKNyQ25vH6Iy6FQ-KLE_RCr4",
    authDomain: "quiz-app-firebase-6b357.firebaseapp.com",
    projectId: "quiz-app-firebase-6b357",
    storageBucket: "quiz-app-firebase-6b357.firebasestorage.app",
    messagingSenderId: "483659465930",
    appId: "1:483659465930:web:859130139e434a3d12e033",
    measurementId: "G-M65HL8QL08"
};

// ----------------------------------------------------
// INITIALIZE SERVICES
// ----------------------------------------------------
let app;
try {
    // Check if Firebase is already initialized
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully");
    } else {
        console.log("Firebase already initialized");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
// ----------------------------------------------------
// INITIALIZE SERVICES
// ----------------------------------------------------
// Export everything
export {
    app,
    auth,
    db,
    googleProvider
};
