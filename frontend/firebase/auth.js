// firebase/auth.js
import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Email signup
export const signup = async (email, password, displayName = "") => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Email login
export const login = async (email, password, rememberMe = false) => {
  try {
    // Set persistence based on remember me
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};

// Google login
export const loginWithGoogle = async (rememberMe = false) => {
  try {
    // Set persistence based on remember me
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check if user has a username in Firestore with retry
    let userDoc;
    let needsUsername = true;
    
    try {
      userDoc = await getDoc(doc(db, "users", result.user.uid));
      needsUsername = !userDoc.exists() || !userDoc.data()?.username;
    } catch (firestoreError) {
      console.warn("Failed to check username, assuming new user:", firestoreError);
      // If Firestore fails, assume new user needs username
      needsUsername = true;
    }
    
    return { 
      ...result, 
      needsUsername 
    };
  } catch (error) {
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Password reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Save username to Firestore
export const saveUsername = async (userId, username) => {
  try {
    await setDoc(doc(db, "users", userId), {
      username,
      createdAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    throw error;
  }
};

// Get username from Firestore
export const getUsername = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data()?.username || null;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Check if username is available
export const isUsernameAvailable = async (username) => {
  try {
    // This is a simple check - in production you'd want a better approach
    // like using a separate collection for usernames
    return true; // Placeholder
  } catch (error) {
    throw error;
  }
};
