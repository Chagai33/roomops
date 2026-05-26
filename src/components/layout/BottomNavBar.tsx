import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const BottomNavBar: React.FC = () => {
  const { t } = useAppStore();
  const pathname = window.location.pathname;

  const NavItem = ({ path, icon, label, isActive }: { path: string, icon: string, label: string, isActive: boolean }) => (
    <a href={path} className={`flex flex-col items-center justify-center px-4 py-1 active:scale-90 transition-transform duration-200 ${
      isActive 
        ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-xl' 
        : 'text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed'
    }`}>
      <span className="material-symbols-outlined text-xl mb-1" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
        {icon}
      </span>
      <span className="font-label-sm text-label-sm mt-1">{label}</span>
    </a>
  );

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md shadow-[0px_-2px_10px_rgba(30,41,59,0.04)] pb-safe">
      <div className="flex justify-around items-center py-3 px-4">
        <NavItem path="/" icon="dashboard" label={t.app.dashboard} isActive={pathname === '/'} />
        <NavItem path="/rooms" icon="meeting_room" label={t.app.rooms} isActive={pathname.startsWith('/rooms')} />
        <NavItem path="/inventory" icon="inventory_2" label={t.app.inventory} isActive={pathname === '/inventory'} />
        <NavItem path="/admin" icon="admin_panel_settings" label={t.app.admin} isActive={pathname === '/admin'} />
      </div>
    </nav>
  );
};
