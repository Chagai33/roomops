import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuthStore } from '../store/useAuthStore';
import type { UserProfile } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';

export const Join: React.FC = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { t } = useAppStore();

  const [inviteData, setInviteData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkInvite = async () => {
      if (!inviteId) return;
      try {
        const inviteRef = doc(db, 'invites', inviteId);
        const inviteSnap = await getDoc(inviteRef);

        if (!inviteSnap.exists()) {
          setError('לינק ההזמנה אינו קיים.');
          setIsLoading(false);
          return;
        }

        const data = inviteSnap.data();
        if (data.used) {
          setError('לינק זה כבר נוצל.');
          setIsLoading(false);
          return;
        }

        if (data.expiresAt.toDate() < new Date()) {
          setError('פג תוקפו של הלינק (עברו 72 שעות).');
          setIsLoading(false);
          return;
        }

        setInviteData({ id: inviteSnap.id, ...data });
      } catch (err) {
        console.error(err);
        setError('שגיאה בבדיקת ההזמנה.');
      } finally {
        setIsLoading(false);
      }
    };

    checkInvite();
  }, [inviteId]);

  const handleJoinExisting = async () => {
    if (!user || !profile || !inviteData) return;
    setIsLoading(true);
    try {
      // Add property to user profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        propertyIds: arrayUnion(inviteData.propertyId)
      });

      // Mark invite as used
      const inviteRef = doc(db, 'invites', inviteData.id);
      await updateDoc(inviteRef, { used: true });

      // Force reload auth store so active property updates
      window.location.href = '/'; 
    } catch (err) {
      console.error(err);
      setError('שגיאה בצירוף לנכס.');
      setIsLoading(false);
    }
  };

  const handleJoinNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData) return;
    setIsLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      
      const userProfile: UserProfile = {
        uid: userCred.user.uid,
        role: inviteData.role,
        propertyIds: [inviteData.propertyId]
      };
      
      await setDoc(doc(db, 'users', userCred.user.uid), userProfile);
      await updateDoc(doc(db, 'invites', inviteData.id), { used: true });
      
      window.location.href = '/';
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'שגיאה בהרשמה.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface">טוען הזמנה...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="bento-card w-full max-w-md border-t-4 border-t-secondary">
        <div className="flex flex-col items-center gap-3 mb-8 justify-center">
          <span className="material-symbols-outlined text-secondary font-bold text-4xl">mail</span>
          <h1 className="font-display-lg text-headline-lg text-primary text-center">
            הזמנה להצטרפות
          </h1>
        </div>

        {error ? (
          <div className="bg-error-container text-on-error-container p-6 rounded-xl font-body-md text-body-md text-center">
            {error}
            <button 
              onClick={() => navigate('/')}
              className="mt-4 bg-error text-on-error px-4 py-2 rounded-lg"
            >
              חזור לעמוד הראשי
            </button>
          </div>
        ) : (
          <>
            {user ? (
              <div className="flex flex-col items-center text-center gap-6">
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  אתה מחובר כ- <strong>{user.email}</strong>.
                  <br/> האם תרצה להצטרף לצוות הנכס החדש עם חשבון זה?
                </p>
                <button 
                  onClick={handleJoinExisting}
                  className="w-full bg-secondary text-on-secondary font-headline-md text-headline-md py-4 rounded-xl hover:opacity-90 transition-opacity"
                >
                  הצטרף עכשיו
                </button>
              </div>
            ) : (
              <form onSubmit={handleJoinNew} className="flex flex-col gap-4">
                <p className="font-body-md text-body-md text-on-surface-variant text-center mb-2">
                  צור חשבון כדי לקבל את ההזמנה.
                </p>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    {t.auth.email}
                  </label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-variant rounded-xl p-3 font-body-md text-body-md focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest outline-none transition-colors"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    {t.auth.password}
                  </label>
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-variant rounded-xl p-3 font-body-md text-body-md focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest outline-none transition-colors"
                    dir="ltr"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-secondary text-on-secondary font-headline-md text-headline-md py-4 rounded-xl mt-4 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  הרשמה כאיש צוות
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
