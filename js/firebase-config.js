// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot, orderBy, limit, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

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
let app, auth, db, storage;

// Configure CORS for Firebase Storage
async function configureCORS() {
  try {
    // Set CORS configuration for Firebase Storage
    // This is typically done on the server side or through Firebase Console
    // Here we're logging instructions for the developer
    console.log('CORS Configuration Note: To properly configure CORS for Firebase Storage:');
    console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
    console.log('2. Select your Firebase project');
    console.log('3. Navigate to Storage > Settings > CORS configuration');
    console.log('4. Add the following CORS configuration:');
    console.log(`[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]`);
    console.log('For production, replace "*" with your specific domain(s)');
    
    return true;
  } catch (error) {
    console.error('Error logging CORS configuration instructions:', error);
    return false;
  }
}

function initializeFirebase() {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Log CORS configuration instructions
    configureCORS();
    
    // Enable offline persistence with unlimited cache size
    enableIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
      .then(() => {
        console.log('Offline persistence enabled successfully');
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled in one tab at a time
          console.warn('Offline persistence failed: Multiple tabs open');
          // Try multi-tab persistence instead
          return enableMultiTabIndexedDbPersistence(db);
        } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the features required for persistence
          console.warn('Offline persistence is not supported by this browser');
        } else {
          console.error('Error enabling offline persistence:', err);
        }
      });
    
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

// Firebase Storage Security Rules Information
function logStorageSecurityRulesInfo() {
  console.log('Firebase Storage Security Rules Information:');
  console.log('To configure proper security rules for project image uploads:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
  console.log('2. Select your project');
  console.log('3. Navigate to Storage > Rules');
  console.log('4. Update the rules to allow authenticated users to upload to project-images/:');
  console.log(`
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read;
    }
    
    // Allow authenticated users to upload to project-images/
    match /project-images/{imageId} {
      allow write: if request.auth != null 
                    && request.resource.size < 2 * 1024 * 1024 
                    && request.resource.contentType.matches('image/.*');
    }
  }
}
`);
  console.log('These rules allow:');
  console.log('- Public read access to all files');
  console.log('- Only authenticated users can upload to project-images/');
  console.log('- Uploads are limited to 2MB');
  console.log('- Only image files are allowed');
}

// Call the function to log security rules info
logStorageSecurityRulesInfo();

// Export the initialized services
export { 
  app, 
  auth, 
  db, 
  storage,
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  ref,
  uploadBytes,
  getDownloadURL
};