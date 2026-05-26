import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc, writeBatch, updateDoc, arrayUnion } from 'firebase/firestore';
import { usePropertyStore } from './usePropertyStore';

export type UserRole = 'ADMIN' | 'STAFF';

export interface UserProfile {
  uid: string;
  role: UserRole;
  propertyIds: string[];
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  
  initialize: () => void;
  logout: () => Promise<void>;
  signUpNewAdmin: (email: string, pass: string, propertyName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  createProperty: (propertyName: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,

  
  initialize: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          let profile: UserProfile;
          if (docSnap.exists()) {
            profile = docSnap.data() as UserProfile;
          } else {
            profile = { uid: firebaseUser.uid, role: 'STAFF', propertyIds: [] };
          }
          
          set({ user: firebaseUser, profile, isLoading: false });
          
          if (profile.propertyIds.length > 0) {
            usePropertyStore.getState().setActiveProperty(profile.propertyIds[0]);
          }
        } catch (error) {
          console.error("Failed to load user profile:", error);
          set({ user: firebaseUser, profile: null, isLoading: false });
        }
      } else {
        set({ user: null, profile: null, isLoading: false });
        usePropertyStore.getState().setActiveProperty('');
      }
    });
  },

  
  logout: async () => {
    await signOut(auth);
    set({ user: null, profile: null });
  },

  signUpNewAdmin: async (email, pass, propertyName) => {
    // 1. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    // 2. Create Property
    const propertyRef = await addDoc(collection(db, 'properties'), {
      name: propertyName,
      createdAt: new Date()
    });

    // 3. Initialize default data (Batch write)
    const batch = writeBatch(db);
    
    // Default Inventory
    const defaultInventory = [
      { name: 'קפסולות קפה', category: 'SUPPLIES', currentStock: 0, minRequired: 50 },
      { name: 'סבון נוזלי', category: 'SUPPLIES', currentStock: 0, minRequired: 20 },
      { name: 'מגבות גוף', category: 'TOWELS', currentStock: 0, minRequired: 40 },
    ];
    defaultInventory.forEach(item => {
      const invRef = doc(collection(db, `properties/${propertyRef.id}/inventory`));
      batch.set(invRef, item);
    });

    // Dummy Floor to prevent null errors
    const floorRef = doc(collection(db, `properties/${propertyRef.id}/floors`));
    batch.set(floorRef, { floorNumber: 1, equipment: {} });

    await batch.commit();

    // 4. Create User Profile
    const profileRef = doc(db, 'users', user.uid);
    const profile: UserProfile = {
      uid: user.uid,
      role: 'ADMIN',
      propertyIds: [propertyRef.id]
    };
    await setDoc(profileRef, profile);

    set({ user, profile, isLoading: false });
    usePropertyStore.getState().setActiveProperty(propertyRef.id);
  },

  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },

  createProperty: async (propertyName) => {
    const { user, profile } = get();
    if (!user || !profile) throw new Error('Not logged in');

    // 1. Create Property
    const propertyRef = await addDoc(collection(db, 'properties'), {
      name: propertyName,
      createdAt: new Date()
    });

    // 2. Initialize default data
    const batch = writeBatch(db);
    
    const defaultInventory = [
      { name: 'קפסולות קפה', category: 'SUPPLIES', currentStock: 0, minRequired: 50 },
      { name: 'סבון נוזלי', category: 'SUPPLIES', currentStock: 0, minRequired: 20 },
      { name: 'מגבות גוף', category: 'TOWELS', currentStock: 0, minRequired: 40 },
    ];
    defaultInventory.forEach(item => {
      const invRef = doc(collection(db, `properties/${propertyRef.id}/inventory`));
      batch.set(invRef, item);
    });

    const floorRef = doc(collection(db, `properties/${propertyRef.id}/floors`));
    batch.set(floorRef, { floorNumber: 1, equipment: {} });

    await batch.commit();

    // 3. Update User Profile
    const profileRef = doc(db, 'users', user.uid);
    await updateDoc(profileRef, {
      propertyIds: arrayUnion(propertyRef.id)
    });

    // Update local profile state
    set({ profile: { ...profile, propertyIds: [...profile.propertyIds, propertyRef.id] } });
    
    // Switch to new property
    usePropertyStore.getState().setActiveProperty(propertyRef.id);
  }
}));
