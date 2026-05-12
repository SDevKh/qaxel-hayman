import { doc, setDoc } from 'firebase/firestore';

import { db } from '../firebase';

export async function createUserProfile(params: {
  email: string;
  fullName?: string;
}) {
  const { email, fullName } = params;
  const userRef = doc(db, 'users', email);

  await setDoc(
    userRef,
    {
      email,
      fullName: fullName || null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

