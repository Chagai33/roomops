import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { usePropertyStore } from '../store/usePropertyStore';
import { StatusPill } from '../components/ui/StatusPill';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { t } = useAppStore();
  const { rooms, floorTasks, inventory } = usePropertyStore();
  const navigate = useNavigate();

  const readyRooms = rooms.filter(r => r.status === 'READY').length;
  const cleaningRooms = rooms.filter(r => r.status === 'CLEANING').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'MAINTENANCE' || r.status === 'UNAVAILABLE').length;
  
  const completedTodayPercentage = rooms.length ? Math.round((readyRooms / rooms.length) * 100) : 0;
  
  const criticalInventory = inventory.filter(i => i.currentStock < i.minRequired);

  return (
    <>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary mb-2">{t.dashboard.greeting}, Admin</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{t.dashboard.overview} {new Date().toLocaleDateString('he-IL')}. 85% {t.dashboard.occupancy}.</p>
        </div>
        <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 h-fit">
          <span className="material-symbols-outlined">add</span>
          {t.dashboard.newTask}
        </button>
      </div>

      <div className="bento-grid">
        {/* Quick Stats Row */}
        <div className="col-span-4 md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
          <div className="bento-card flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-surface-container-low rounded-lg text-primary">
                <span className="material-symbols-outlined">meeting_room</span>
              </div>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{t.dashboard.readyRooms}</p>
              <p className="font-headline-lg text-headline-lg text-primary">{readyRooms}</p>
            </div>
          </div>
          
          <div className="bento-card flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-surface-container-low rounded-lg text-primary">
                <span className="material-symbols-outlined">cleaning_services</span>
              </div>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{t.dashboard.cleaningNow}</p>
              <p className="font-headline-lg text-headline-lg text-primary">{cleaningRooms}</p>
            </div>
          </div>
          
          <div className="bento-card flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-error-container rounded-lg text-error">
                <span className="material-symbols-outlined">build</span>
              </div>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{t.dashboard.inMaintenance}</p>
              <p className="font-headline-lg text-headline-lg text-primary">{maintenanceRooms}</p>
            </div>
          </div>
          
          <div className="bento-card flex flex-col justify-between bg-primary text-on-primary border-none">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary-container rounded-lg text-on-primary">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-primary-fixed-dim mb-1">{t.dashboard.completedToday}</p>
              <p className="font-headline-lg text-headline-lg">{completedTodayPercentage}%</p>
              <div className="bg-primary-container h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-secondary-fixed h-full rounded-full" style={{ width: `${completedTodayPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Status Grid */}
        <div className="col-span-4 md:col-span-8 bento-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-primary">{t.dashboard.floorStatus}</h3>
            <button className="text-secondary font-label-md text-label-md flex items-center gap-1">
              {t.dashboard.all}
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rooms.map(room => (
              <div 
                key={room.id}
                onClick={() => navigate(`/rooms/${room.id}`)}
                className="p-4 rounded-xl border border-surface-variant hover:bg-surface-container-low transition-colors flex justify-between items-center cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-headline-md ${room.status === 'MAINTENANCE' ? 'bg-error-container text-error' : 'bg-surface-container-high text-primary'}`}>
                    {room.floorNumber}
                  </div>
                  <div>
                    <h4 className="font-body-lg text-body-lg text-primary font-semibold">{t.dashboard.floor} {room.floorNumber} - {room.roomNumber}</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {room.notes || `${room.progressPercentage}% completed`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusPill status={room.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 md:col-span-4 flex flex-col gap-4 md:gap-6">
          {/* Urgent Tasks */}
          <div className="bento-card border-l-4 border-l-secondary">
            <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary">assignment_late</span>
              {t.dashboard.urgentTasks}
            </h3>
            <ul className="flex flex-col gap-3">
              {floorTasks.map(task => (
                <li key={task.id} className="flex items-start gap-3 p-3 bg-surface-container-lowest rounded-lg">
                  <div className="mt-1 w-2 h-2 rounded-full bg-error"></div>
                  <div>
                    <p className="font-body-md text-body-md font-semibold text-primary">{task.equipmentName}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{task.reportedBy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Critical Inventory */}
          <div className="bento-card bg-surface-container-highest">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-error">warning</span>
              <h3 className="font-headline-md text-headline-md text-primary">{t.dashboard.criticalInventory}</h3>
            </div>
            {criticalInventory.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface-container-low rounded-md">
                    <span className="material-symbols-outlined text-primary text-sm">inventory</span>
                  </div>
                  <span className="font-body-md text-body-md text-primary">{item.name}</span>
                </div>
                <span className="font-body-md text-body-md text-error font-bold">{item.currentStock} / {item.minRequired}</span>
              </div>
            ))}
          </div>

          {/* Laundry Tracker */}
          <div className="bento-card">
            <h3 className="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">local_laundry_service</span>
              {t.dashboard.laundryStatus}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {usePropertyStore().laundry.map(machine => {
                const isRunning = machine.status !== 'IDLE';
                
                let timeText = 'פנוי';
                if (isRunning && machine.expectedReadyAt) {
                  const diffMins = Math.max(0, Math.round((machine.expectedReadyAt.getTime() - Date.now()) / 60000));
                  timeText = `${diffMins} דק'`;
                }

                return (
                  <div key={machine.id} className="p-3 bg-surface-container-low rounded-xl text-center">
                    <span className={`material-symbols-outlined mb-1 ${isRunning ? 'text-secondary animate-spin-slow' : 'text-outline-variant'}`}>
                      {isRunning ? 'settings_motion_mode' : 'done_all'}
                    </span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{machine.name}</p>
                    <p className="font-headline-md text-headline-md text-primary mt-1">{timeText}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

