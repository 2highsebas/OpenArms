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
export const signup = async (email, password, displayName = "", username = "") => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    // Save username to Firestore if provided
    if (username && userCredential.user) {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        displayName: displayName || "",
        email: userCredential.user.email,
        createdAt: new Date().toISOString(),
      }, { merge: true });
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

// Google login - INSTANT, non-blocking
export const loginWithGoogle = async (rememberMe = false) => {
  try {
    const provider = new GoogleAuthProvider();

    // Persistence should be set WITHOUT blocking login flow
    setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
      .catch((e) => console.warn("Persistence not set before login:", e));

    // 🚀 Do NOT wait for persistence, popup will still work
    return await signInWithPopup(auth, provider);

  } catch (error) {
    throw error;
  }
};

// Check if user has username (non-blocking, with timeout)
export const checkUserHasUsername = async (userId) => {
  return new Promise(async (resolve) => {
    const timeout = setTimeout(() => {
      console.warn("Firestore username check timeout → treating as new user");
      resolve(false);
    }, 2000);

    try {
      const snap = await getDoc(doc(db, "users", userId));
      clearTimeout(timeout);

      resolve(snap.exists() && !!snap.data().username);
    } catch (e) {
      clearTimeout(timeout);
      resolve(false);
    }
  });
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

// Save username to Firestore (non-blocking, fast)
export const saveUsername = async (userId, username, displayName = "", email = "") => {
  if (!username) throw new Error("Username is required");

  const currentUser = auth.currentUser;

  // 1️⃣ Always write to /users – this is the important part (awaited)
  await setDoc(
    doc(db, "users", userId),
    {
      username,
      displayName: displayName || currentUser?.displayName || "",
      email: email || currentUser?.email || "",
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  // 2️⃣ Fire-and-forget username reservation – don't block UI on this
  setDoc(
    doc(db, "usernames", username),
    {
      uid: userId,
      claimedAt: Date.now(),
    },
    { merge: false }
  ).catch((err) => {
    console.warn("Failed to reserve username (non-blocking):", err?.message || err);
  });
};

// Get username from Firestore (with timeout)
export const getUsername = async (userId) => {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Username fetch timeout"));
    }, 3000);

    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      clearTimeout(timeout);
      
      if (userDoc.exists()) {
        resolve(userDoc.data()?.username || null);
      } else {
        resolve(null);
      }
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
};

// Get user profile (displayName and username) from Firestore
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        username: data?.username || null,
        displayName: data?.displayName || null,
        email: data?.email || null,
      };
    }
    return { username: null, displayName: null, email: null };
  } catch (error) {
    throw error;
  }
};

// Check if username is available (fast, uses username directory)
export const isUsernameAvailable = async (username) => {
  if (!username) return false;

  try {
    const ref = doc(db, "usernames", username);
    const snap = await getDoc(ref);

    return !snap.exists();
  } catch {
    return false;
  }
};
