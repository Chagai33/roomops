import React, { useState } from 'react';
import { usePropertyStore } from '../store/usePropertyStore';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { PropertiesSetup } from '../components/admin/PropertiesSetup';
import { RoomsSetup } from '../components/admin/RoomsSetup';
import { InventorySetup } from '../components/admin/InventorySetup';
import { LaundrySetup } from '../components/admin/LaundrySetup';
import { StaffSetup } from '../components/admin/StaffSetup';

type AdminTab = 'PROPERTIES' | 'ROOMS' | 'INVENTORY' | 'LAUNDRY' | 'STAFF' | 'EXPORT';

export const Admin: React.FC = () => {
  const { t } = useAppStore();
  const { rooms, inventory, floorTasks } = usePropertyStore();
  const { profile } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('ROOMS');

  const isAdmin = profile?.role === 'ADMIN';

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    
    csvContent += "Rooms Report\n";
    csvContent += "Room ID,Room Number,Floor,Status,Progress\n";
    rooms.forEach(r => {
      csvContent += `${r.id},${r.roomNumber},${r.floorNumber},${r.status},${r.progressPercentage}%\n`;
    });
    csvContent += "\n";

    csvContent += "Inventory Report\n";
    csvContent += "Item,Category,Current Stock,Min Required\n";
    inventory.forEach(i => {
      csvContent += `${i.name},${i.category},${i.currentStock},${i.minRequired}\n`;
    });
    csvContent += "\n";

    csvContent += "Floor Tasks Report\n";
    csvContent += "Task ID,Floor,Equipment,Reported By\n";
    floorTasks.forEach(ft => {
      csvContent += `${ft.id},${ft.floorNumber},${ft.equipmentName},${ft.reportedBy}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `roomops_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAdmin) {
    return <div className="p-8 text-center font-headline-md text-error">אין לך הרשאות ניהול למסך זה.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bento-card">
        <h2 className="font-display-lg text-display-lg text-primary mb-6">הגדרות וניהול מערכת (Admin)</h2>
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2 border-b border-surface-variant no-scrollbar">
          <button 
            onClick={() => setActiveTab('PROPERTIES')}
            className={`px-4 py-2 font-headline-sm whitespace-nowrap rounded-t-lg transition-colors ${activeTab === 'PROPERTIES' ? 'bg-primary-container text-on-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            נכסים (בתים)
          </button>
          <button 
            onClick={() => setActiveTab('ROOMS')}
            className={`px-4 py-2 font-headline-sm whitespace-nowrap rounded-t-lg transition-colors ${activeTab === 'ROOMS' ? 'bg-primary-container text-on-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            חדרים וקומות
          </button>
          <button 
            onClick={() => setActiveTab('INVENTORY')}
            className={`px-4 py-2 font-headline-sm whitespace-nowrap rounded-t-lg transition-colors ${activeTab === 'INVENTORY' ? 'bg-primary-container text-on-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            קטלוג מלאי
          </button>
          <button 
            onClick={() => setActiveTab('LAUNDRY')}
            className={`px-4 py-2 font-headline-sm whitespace-nowrap rounded-t-lg transition-colors ${activeTab === 'LAUNDRY' ? 'bg-primary-container text-on-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            מכונות כביסה
          </button>
          <button 
            onClick={() => setActiveTab('STAFF')}
            className={`px-4 py-2 font-headline-sm whitespace-nowrap rounded-t-lg transition-colors ${activeTab === 'STAFF' ? 'bg-primary-container text-on-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            צוות (הזמנות)
          </button>
          <button 
            onClick={() => setActiveTab('EXPORT')}
            className={`px-4 py-2 font-headline-sm whitespace-nowrap rounded-t-lg transition-colors ${activeTab === 'EXPORT' ? 'bg-primary-container text-on-primary-container border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            ייצוא נתונים
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'PROPERTIES' && <PropertiesSetup />}
          {activeTab === 'ROOMS' && <RoomsSetup />}
          {activeTab === 'INVENTORY' && <InventorySetup />}
          {activeTab === 'LAUNDRY' && <LaundrySetup />}
          {activeTab === 'STAFF' && <StaffSetup />}
          
          {activeTab === 'EXPORT' && (
            <div className="bg-surface-container-low p-6 rounded-xl border border-surface-variant max-w-md">
              <h3 className="font-headline-md text-headline-md text-primary mb-4">ייצוא נתונים (CSV)</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                הורד תמונת מצב מלאה של כל החדרים, המלאי והמשימות לאקסל.
              </p>
              <button 
                onClick={handleExportCSV}
                className="bg-secondary text-on-secondary px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full"
              >
                <span className="material-symbols-outlined">download</span>
                הורד CSV
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
