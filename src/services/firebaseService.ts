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
    if (!user || !user.uid) {
      console.error("Invalid user object provided to createUserProfile:", user);
      throw new Error("Invalid user object");
    }

    // Create a sanitized profile object with default values
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || undefined,
      displayName: user.displayName || undefined,
      setupCompleted: false,
      fitnessGoal: "maintenance",
      caloriesGoal: 2000,
      macros: {
        protein: 120,
        carbs: 200,
        fat: 65,
      },
    };

    // Safely merge in provided profile data
    if (profileData.displayName)
      userProfile.displayName = profileData.displayName;
    if (profileData.email) userProfile.email = profileData.email;
    if (profileData.fitnessGoal)
      userProfile.fitnessGoal = profileData.fitnessGoal;
    if (profileData.caloriesGoal)
      userProfile.caloriesGoal = profileData.caloriesGoal;
    if (profileData.setupCompleted !== undefined)
      userProfile.setupCompleted = profileData.setupCompleted;

    // Handle macros object separately
    if (profileData.macros) {
      userProfile.macros = {
        protein:
          Number(profileData.macros.protein) || userProfile.macros!.protein,
        carbs: Number(profileData.macros.carbs) || userProfile.macros!.carbs,
        fat: Number(profileData.macros.fat) || userProfile.macros!.fat,
      };
    }

    console.log("Creating user profile with data:", userProfile);

    // Check if document already exists
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log("Document already exists, updating instead of creating");
      await updateDoc(userRef, userProfile);
    } else {
      await setDoc(userRef, userProfile);
    }

    return userProfile;
  } catch (error: any) {
    console.error("Error creating user profile:", error);
    console.error("Error details:", error.code, error.message);
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
    // Validate userId
    if (!userId || typeof userId !== "string") {
      console.error("Invalid userId provided to updateUserProfile:", userId);
      throw new Error("Invalid user ID");
    }

    // Sanitize and validate profileData
    const sanitizedData: Partial<UserProfile> = {};

    // Only copy valid fields to avoid sending invalid data to Firestore
    if (profileData.displayName !== undefined)
      sanitizedData.displayName = profileData.displayName;
    if (profileData.email !== undefined)
      sanitizedData.email = profileData.email;
    if (profileData.fitnessGoal !== undefined)
      sanitizedData.fitnessGoal = profileData.fitnessGoal;
    if (profileData.caloriesGoal !== undefined)
      sanitizedData.caloriesGoal = profileData.caloriesGoal;
    if (profileData.setupCompleted !== undefined)
      sanitizedData.setupCompleted = profileData.setupCompleted;

    // Handle macros object separately to ensure it has the correct structure
    if (profileData.macros) {
      sanitizedData.macros = {
        protein: Number(profileData.macros.protein) || 0,
        carbs: Number(profileData.macros.carbs) || 0,
        fat: Number(profileData.macros.fat) || 0,
      };
    }

    console.log("Updating user profile with data:", sanitizedData);

    // Check if document exists before updating
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      console.log("Document does not exist, creating instead of updating");
      await setDoc(userRef, sanitizedData);
    } else {
      await updateDoc(userRef, sanitizedData);
    }

    return true;
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    console.error("Error details:", error.code, error.message);
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
