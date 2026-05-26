import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { usePropertyStore } from '../../store/usePropertyStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';

export const TopAppBar: React.FC = () => {
  const { t } = useAppStore();
  const { profile, logout } = useAuthStore();
  const { activePropertyId, setActiveProperty } = usePropertyStore();
  const navigate = useNavigate();

  const [properties, setProperties] = useState<{ id: string, name: string }[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!profile || profile.propertyIds.length === 0) return;
      const loaded: { id: string, name: string }[] = [];
      for (const pid of profile.propertyIds) {
        try {
          const snap = await getDoc(doc(db, 'properties', pid));
          if (snap.exists()) {
            loaded.push({ id: pid, name: snap.data().name || 'נכס ללא שם' });
          }
        } catch (e) {
          console.error(e);
        }
      }
      setProperties(loaded);
    };
    fetchProperties();
  }, [profile]);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-16 w-full">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary font-bold text-2xl">grid_view</span>
          {properties.length > 1 ? (
            <select 
              value={activePropertyId || ''}
              onChange={(e) => setActiveProperty(e.target.value)}
              className="font-headline-md text-headline-md font-bold tracking-tight text-primary bg-transparent outline-none cursor-pointer border border-transparent hover:border-surface-variant rounded-md px-1"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          ) : (
            <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-primary">
              {properties.length === 1 ? properties[0].name : t.app.name}
            </h1>
          )}
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-secondary font-bold hover:opacity-80 transition-opacity active:scale-95 duration-200" href="/">{t.app.dashboard}</a>
          <a className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 duration-200" href="/rooms">{t.app.rooms}</a>
          <a className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 duration-200" href="/inventory">{t.app.inventory}</a>
          {profile?.role === 'ADMIN' && (
            <a className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 duration-200" href="/admin">{t.app.admin}</a>
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          <button onClick={() => { logout(); navigate('/login'); }} className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border-2 border-surface-variant flex items-center justify-center hover:bg-error-container transition-colors group cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-error">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
