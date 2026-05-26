import React, { useState } from 'react';
import { usePropertyStore } from '../../store/usePropertyStore';

export const LaundrySetup: React.FC = () => {
  const { laundry, addLaundryMachine, deleteLaundryMachine } = usePropertyStore();
  
  const [name, setName] = useState('');
  const [type, setType] = useState<'WASHER' | 'DRYER'>('WASHER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    
    try {
      await addLaundryMachine({
        name,
        type,
        status: 'IDLE',
        expectedReadyAt: null
      });
      setName('');
    } catch (err) {
      console.error(err);
      alert('שגיאה בהוספת מכונה');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-container-low p-6 rounded-xl border border-surface-variant">
        <h3 className="font-headline-md text-headline-md text-primary mb-4">הוספת מכונת כביסה / מייבש</h3>
        <form onSubmit={handleAddMachine} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">שם המכונה (למשל "מכונה 1 - 10 ק״ג")</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="w-40">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">סוג</label>
            <select 
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="WASHER">מכונת כביסה</option>
              <option value="DRYER">מייבש</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting || !name}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
          >
            {isSubmitting ? 'מוסיף...' : 'הוסף מכונה'}
          </button>
        </form>
      </div>

      <div className="bg-surface-container-low p-6 rounded-xl border border-surface-variant">
        <h3 className="font-headline-md text-headline-md text-primary mb-4">המכונות בנכס</h3>
        
        {laundry.length === 0 ? (
          <p className="text-on-surface-variant text-center py-4">לא הוגדרו מכונות. הוסף מכונה ראשונה.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {laundry.map(machine => (
              <div key={machine.id} className="bg-surface-container-lowest p-4 rounded-xl border border-surface-variant flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface-container-low rounded-lg text-primary">
                    <span className="material-symbols-outlined">
                      {machine.type === 'WASHER' ? 'local_laundry_service' : 'heat'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-body-lg text-primary font-bold">{machine.name}</h4>
                    <p className="font-body-sm text-on-surface-variant">{machine.type === 'WASHER' ? 'מכונת כביסה' : 'מייבש'}</p>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    if (confirm(`למחוק את ${machine.name}?`)) {
                      await deleteLaundryMachine(machine.id);
                    }
                  }}
                  className="text-error opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-error-container rounded-lg"
                  title="מחק מכונה"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
