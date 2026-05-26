import React, { useState } from 'react';
import { usePropertyStore } from '../../store/usePropertyStore';

export const InventorySetup: React.FC = () => {
  const { inventory, addInventoryItem, deleteInventoryItem } = usePropertyStore();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'LINEN' | 'TOWELS' | 'SUPPLIES'>('SUPPLIES');
  const [minRequired, setMinRequired] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    
    try {
      await addInventoryItem({
        name,
        category,
        minRequired,
        currentStock: 0
      });
      setName('');
      setMinRequired(10);
    } catch (err) {
      console.error(err);
      alert('שגיאה בהוספת פריט למלאי');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryName = (cat: string) => {
    switch(cat) {
      case 'LINEN': return 'מצעים';
      case 'TOWELS': return 'מגבות';
      case 'SUPPLIES': return 'ציוד שוטף';
      default: return cat;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-container-low p-6 rounded-xl border border-surface-variant">
        <h3 className="font-headline-md text-headline-md text-primary mb-4">יצירת פריט מלאי חדש לקטלוג</h3>
        <form onSubmit={handleAddItem} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">שם הפריט</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
              placeholder="לדוגמה: נייר טואלט"
            />
          </div>
          <div className="w-40">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">קטגוריה</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="SUPPLIES">ציוד שוטף</option>
              <option value="TOWELS">מגבות</option>
              <option value="LINEN">מצעים</option>
            </select>
          </div>
          <div className="w-32">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">דרישת מינימום</label>
            <input 
              type="number" 
              required
              value={minRequired}
              onChange={e => setMinRequired(Number(e.target.value))}
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting || !name}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
          >
            {isSubmitting ? 'מוסיף...' : 'הוסף לקטלוג'}
          </button>
        </form>
      </div>

      <div className="bg-surface-container-low p-6 rounded-xl border border-surface-variant">
        <h3 className="font-headline-md text-headline-md text-primary mb-4">קטלוג המלאי הקיים</h3>
        
        {inventory.length === 0 ? (
          <p className="text-on-surface-variant text-center py-4">אין פריטי מלאי. הוסף פריט ראשון.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map(item => (
              <div key={item.id} className="bg-surface-container-lowest p-4 rounded-xl border border-surface-variant flex justify-between items-center group">
                <div>
                  <h4 className="font-body-lg text-primary font-bold">{item.name}</h4>
                  <p className="font-body-sm text-on-surface-variant">{getCategoryName(item.category)} • מינימום: {item.minRequired}</p>
                </div>
                <button 
                  onClick={async () => {
                    if (confirm(`למחוק את ${item.name} מקטלוג המלאי?`)) {
                      await deleteInventoryItem(item.id);
                    }
                  }}
                  className="text-error opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-error-container rounded-lg"
                  title="מחק פריט"
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
