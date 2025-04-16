import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvw9gtAhQ3G-fEbQ33uR5ZVtqhLGOj9W4",
  authDomain: "calories-counting-app.firebaseapp.com",
  projectId: "calories-counting-app",
  storageBucket: "calories-counting-app.appspot.com",
  messagingSenderId: "527501806965",
  appId: "1:527501806965:web:278133b4086f018846573c",
  measurementId: "G-E2XEHYEGNV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// User profile interface
export interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
  fitnessGoal?: "cutting" | "bulking" | "maintenance";
  caloriesGoal?: number;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  setupCompleted?: boolean;
}

// Authentication functions
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// User profile functions
export const createUserProfile = async (
  user: User,
  profileData: Partial<UserProfile>,
) => {
  try {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || undefined,
      displayName: user.displayName || undefined,
      setupCompleted: false,
      ...profileData,
    };

    await setDoc(doc(db, "users", user.uid), userProfile);
    return userProfile;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (
  userId: string,
): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>,
) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, profileData);
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateUserDisplayName = async (
  user: User,
  displayName: string,
) => {
  try {
    await updateProfile(user, { displayName });
    return true;
  } catch (error) {
    throw error;
  }
};

export { auth, db };
