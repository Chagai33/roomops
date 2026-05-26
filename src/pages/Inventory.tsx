import React, { useState } from 'react';
import { usePropertyStore } from '../store/usePropertyStore';
import type { InventoryItem } from '../store/usePropertyStore';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';

export const Inventory: React.FC = () => {
  const { t } = useAppStore();
  const { inventory, updateInventory } = usePropertyStore();
  const { profile } = useAuthStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [editMin, setEditMin] = useState<number>(0);

  const isAdmin = profile?.role === 'ADMIN';

  const handleEdit = (item: InventoryItem) => {
    if (!isAdmin) return;
    setEditingId(item.id);
    setEditStock(item.currentStock);
    setEditMin(item.minRequired);
  };

  const handleSave = (id: string) => {
    updateInventory(id, editMin, editStock);
    setEditingId(null);
  };

  return (
    <div className="bento-card">
      <h2 className="font-display-lg text-display-lg text-primary mb-6">{t.app.inventory}</h2>
      
      <div className="flex flex-col gap-4">
        {inventory.map(item => {
          const isCritical = item.currentStock < item.minRequired;
          const isEditing = editingId === item.id;

          return (
            <div key={item.id} className="p-4 rounded-xl border border-surface-variant bg-surface-container-lowest flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${isCritical ? 'bg-error-container text-error' : 'bg-surface-container-high text-primary'}`}>
                  <span className="material-symbols-outlined">inventory</span>
                </div>
                <div>
                  <h4 className="font-body-lg text-body-lg text-primary font-semibold">{item.name}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">{item.category}</p>
                </div>
              </div>

              {isEditing ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-on-surface-variant">Stock</label>
                    <input 
                      type="number" 
                      value={editStock} 
                      onChange={e => setEditStock(Number(e.target.value))}
                      className="w-20 p-2 border border-surface-variant rounded outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-on-surface-variant">Min Req</label>
                    <input 
                      type="number" 
                      value={editMin} 
                      onChange={e => setEditMin(Number(e.target.value))}
                      className="w-20 p-2 border border-surface-variant rounded outline-none"
                    />
                  </div>
                  <button onClick={() => handleSave(item.id)} className="bg-primary text-on-primary p-2 rounded-lg mt-4">
                    <span className="material-symbols-outlined">save</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Current Stock</p>
                    <p className={`font-headline-md text-headline-md ${isCritical ? 'text-error' : 'text-primary'}`}>{item.currentStock}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Min Required</p>
                    <p className="font-headline-md text-headline-md text-primary">{item.minRequired}</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleEdit(item)} className="text-secondary hover:bg-surface-container-low p-2 rounded-full transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
