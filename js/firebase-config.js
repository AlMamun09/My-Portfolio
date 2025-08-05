// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Add retry logic for Firebase connection
const MAX_RETRIES = 3;
let retryCount = 0;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbWrbzYCy0FuaUoeEsoRLoG-TatB7OHNk",
  authDomain: "my-portfolio-website-92e1c.firebaseapp.com",
  projectId: "my-portfolio-website-92e1c",
  storageBucket: "my-portfolio-website-92e1c.firebasestorage.app",
  messagingSenderId: "354586288037",
  appId: "1:354586288037:web:93fc0c45a649b2378d124c"
};

// Initialize Firebase with retry logic
let app, auth, db;

function initializeFirebase() {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
    retryCount = 0; // Reset retry count on success
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying Firebase initialization (${retryCount}/${MAX_RETRIES})...`);
      setTimeout(initializeFirebase, 2000); // Retry after 2 seconds
    } else {
      console.error('Max retries reached. Could not initialize Firebase.');
    }
    return false;
  }
}

initializeFirebase();

// Function to test database connection
async function testDatabaseConnection() {
  try {
    if (!db) {
      console.error('Database instance is null');
      return false;
    }
    
    console.log('Testing Firestore connection...');
    const testCollection = collection(db, 'projects');
    const testQuery = query(testCollection, limit(1));
    
    // Try to get a document
    const testSnapshot = await getDocs(testQuery);
    console.log('Firestore connection test result:', !testSnapshot.empty ? 'Success' : 'No documents found');
    console.log('Documents count:', testSnapshot.size);
    
    return true;
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return false;
  }
}

// Export the initialized services
export { app, auth, db, signInWithEmailAndPassword, signOut, onAuthStateChanged, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot, orderBy, limit };