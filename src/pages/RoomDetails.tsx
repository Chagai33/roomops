import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePropertyStore } from '../store/usePropertyStore';
import { useAppStore } from '../store/useAppStore';

export const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { t } = useAppStore();
  const { rooms, toggleChecklistItem, updateRoomStatus } = usePropertyStore();
  
  const room = rooms.find(r => r.id === roomId);
  const [notes, setNotes] = useState(room?.notes || '');

  if (!room) {
    return <div>Room not found</div>;
  }

  const checklistEntries = Object.entries(room.checklist);
  const totalItems = checklistEntries.length;
  const completedItems = checklistEntries.filter(([_, item]) => item.isCompleted).length;

  const handleFinish = () => {
    updateRoomStatus(room.id, 'READY');
    navigate('/');
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm rounded-full">
              {t.room.suite}
            </span>
            {room.status === 'MAINTENANCE' && (
              <span className="px-3 py-1 bg-error-container text-on-error-container font-label-sm text-label-sm rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">priority_high</span> {t.room.highPriority}
              </span>
            )}
          </div>
          <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary tracking-tight">
            {t.dashboard.floor} {room.floorNumber} - {room.roomNumber}
          </h2>
        </div>
        
        {/* Progress Indicator */}
        <div className="w-full md:w-64 bg-surface-container-lowest bento-shadow rounded-[24px] p-6 border border-surface-variant">
          <div className="flex justify-between items-center mb-3">
            <span className="font-label-md text-label-md text-on-surface-variant">{t.room.progress}</span>
            <span className="font-headline-md text-headline-md text-secondary">{room.progressPercentage}%</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-3 overflow-hidden">
            <div 
              className="bg-secondary h-3 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${room.progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap md:gap-gutter">
        {/* Checklist */}
        <div className="col-span-1 md:col-span-8 bg-surface-container-lowest rounded-[24px] p-6 md:p-8 bento-shadow border border-surface-variant flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">checklist</span> {t.room.checklist}
            </h3>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {completedItems} {t.room.completedOutOf} {totalItems} {t.room.completed}
            </span>
          </div>
          
          <div className="flex flex-col gap-2">
            {checklistEntries.map(([key, item]) => (
              <label 
                key={key} 
                className={`premium-checkbox-wrapper flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors border ${
                  item.isCompleted ? 'bg-surface-bright border-transparent' : 'border-surface-variant hover:border-secondary-fixed'
                }`}
              >
                <div className="premium-checkbox relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={item.isCompleted}
                    onChange={() => toggleChecklistItem(room.id, key)} 
                  />
                  <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors ${
                    item.isCompleted ? 'bg-secondary border-secondary' : 'border-outline'
                  }`}>
                    {item.isCompleted && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <span className={`font-body-lg text-body-lg text-on-surface block ${item.isCompleted ? 'line-through opacity-70' : ''}`}>
                    {item.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notes & Actions */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-bento-gap md:gap-gutter">
          <div className="bg-surface-container-lowest rounded-[24px] p-6 bento-shadow border border-surface-variant flex-grow flex flex-col">
            <h3 className="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">edit_note</span> {t.room.notes}
            </h3>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full flex-grow bg-surface-container-low border-none rounded-xl p-4 font-body-md text-body-md text-on-surface resize-none outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-colors min-h-[150px]" 
              placeholder={t.room.addNotePlaceholder}
            />
          </div>
          
          <button 
            onClick={handleFinish}
            disabled={room.progressPercentage < 100}
            className={`w-full font-headline-md text-headline-md py-5 rounded-[16px] flex items-center justify-center gap-3 transition-all ${
              room.progressPercentage === 100 
                ? 'bg-primary text-on-primary bento-shadow-hover cursor-pointer' 
                : 'bg-surface-variant text-on-surface-variant cursor-not-allowed opacity-70'
            }`}
          >
            <span className="material-symbols-outlined">done_all</span>
            <span>{t.room.finishCleaning}</span>
          </button>
        </div>
      </div>
    </>
  );
};
