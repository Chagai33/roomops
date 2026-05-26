import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { usePropertyStore } from '../../store/usePropertyStore';

export const PropertiesSetup: React.FC = () => {
  const { profile, createProperty } = useAuthStore();
  const { activePropertyId, setActiveProperty } = usePropertyStore();
  
  const [newPropName, setNewPropName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      await createProperty(newPropName.trim());
      setNewPropName('');
    } catch (err: any) {
      console.error(err);
      setError('שגיאה ביצירת נכס');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-container-low p-6 rounded-xl border border-surface-variant">
        <h3 className="font-headline-md text-headline-md text-primary mb-2">הוספת נכס חדש</h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          צור סביבת עבודה נפרדת לחלוטין (למשל מלון נוסף). כל חדר ומלאי יהיו נפרדים.
        </p>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">שם הנכס</label>
            <input 
              type="text" 
              required
              value={newPropName}
              onChange={e => setNewPropName(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
              placeholder="לדוגמה: מלון בוטיק צפון"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading || !newPropName.trim()}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'יוצר...' : 'הוסף נכס'}
          </button>
        </form>
      </div>

      <div className="bg-surface-container-low p-6 rounded-xl border border-surface-variant">
        <h3 className="font-headline-md text-headline-md text-primary mb-4">הנכסים שלך</h3>
        <ul className="flex flex-col gap-2">
          {profile?.propertyIds.map(pid => (
            <li key={pid} className={`p-4 rounded-lg border ${activePropertyId === pid ? 'border-primary bg-primary-container/20' : 'border-surface-variant bg-surface-container-lowest'} flex justify-between items-center`}>
              <span className="font-body-lg text-body-lg font-semibold">{pid === activePropertyId ? 'נכס פעיל כעת' : `מזהה נכס: ${pid.substring(0, 8)}...`}</span>
              {activePropertyId !== pid && (
                <button 
                  onClick={() => setActiveProperty(pid)}
                  className="text-primary font-label-md hover:underline"
                >
                  עבור לנכס זה
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
