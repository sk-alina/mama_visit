import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Note: These are public configuration values for Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCOx-zr49ITBIf1IVXOdyy97WPKFBJerIs",
  authDomain: "mamavisit1.firebaseapp.com",
  projectId: "mamavisit1",
  storageBucket: "mamavisit1.firebasestorage.app",
  messagingSenderId: "703346436628",
  appId: "1:703346436628:web:ae8d90d0a8208138511501"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
