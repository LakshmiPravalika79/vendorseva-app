// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// This new interface explicitly defines the properties we expect
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  userType?: 'vendor' | 'supplier';
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser: User | null) => {
      if (authUser) {
        const userDocRef = doc(db, 'users', authUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as DocumentData;
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            userType: userData.userType,
          });
        } else {
          // Handle case where user exists in Auth but not Firestore (optional)
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
