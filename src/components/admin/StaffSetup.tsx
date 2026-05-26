import React, { useState } from 'react';
import { usePropertyStore } from '../../store/usePropertyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const StaffSetup: React.FC = () => {
  const { activePropertyId } = usePropertyStore();
  const { profile } = useAuthStore();
  
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInvite = async () => {
    if (!activePropertyId) return;
    setIsGenerating(true);
    try {
      // 72 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 72);

      const inviteRef = await addDoc(collection(db, 'invites'), {
        propertyId: activePropertyId,
        role: 'STAFF',
        expiresAt,
        used: false,
        createdBy: profile?.uid,
        createdAt: serverTimestamp()
      });

      const url = `${window.location.origin}/join/${inviteRef.id}`;
      setInviteLink(url);
    } catch (err) {
      console.error('Failed to generate invite', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      alert('הלינק הועתק בהצלחה!');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-container-low p-6 rounded-xl border border-surface-variant">
        <h3 className="font-headline-md text-headline-md text-primary mb-4">ניהול צוות (הזמנות)</h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          צור לינק הזמנה ייחודי לאנשי צוות שיוכלו לגשת לנכס זה. הלינק יהיה בתוקף ל-72 שעות.
        </p>
        
        {inviteLink ? (
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-surface-container-lowest border border-surface-variant rounded-lg font-body-sm text-body-sm break-all" dir="ltr">
              {inviteLink}
            </div>
            <button 
              onClick={copyToClipboard}
              className="bg-primary text-on-primary px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">content_copy</span>
              העתק לינק
            </button>
          </div>
        ) : (
          <button 
            onClick={handleGenerateInvite}
            disabled={isGenerating}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">{isGenerating ? 'refresh' : 'person_add'}</span>
            {isGenerating ? 'מייצר לינק...' : 'צור לינק הזמנה'}
          </button>
        )}
      </div>
    </div>
  );
};
