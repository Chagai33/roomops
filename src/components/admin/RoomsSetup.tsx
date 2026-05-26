import React, { useState } from 'react';
import { usePropertyStore } from '../../store/usePropertyStore';

export const RoomsSetup: React.FC = () => {
  const { rooms, addRoom, deleteRoom } = usePropertyStore();
  
  const [roomNumber, setRoomNumber] = useState('');
  const [floorNumber, setFloorNumber] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber) return;
    setIsSubmitting(true);
    
    try {
      await addRoom({
        roomNumber,
        floorNumber,
        status: 'READY',
        checklist: {},
        progressPercentage: 0,
        notes: '',
        lastCleanedBy: ''
      });
      setRoomNumber('');
    } catch (err) {
      console.error(err);
      alert('שגיאה בהוספת חדר');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group rooms by floor
  const roomsByFloor = rooms.reduce((acc, room) => {
    if (!acc[room.floorNumber]) acc[room.floorNumber] = [];
    acc[room.floorNumber].push(room);
    return acc;
  }, {} as Record<number, typeof rooms>);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-container-low p-6 rounded-xl border border-surface-variant">
        <h3 className="font-headline-md text-headline-md text-primary mb-4">הוספת חדר חדש</h3>
        <form onSubmit={handleAddRoom} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[150px]">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">מספר חדר / מזהה</label>
            <input 
              type="text" 
              required
              value={roomNumber}
              onChange={e => setRoomNumber(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
              placeholder="לדוגמה: 101"
            />
          </div>
          <div className="w-32">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">קומה</label>
            <input 
              type="number" 
              required
              value={floorNumber}
              onChange={e => setFloorNumber(Number(e.target.value))}
              className="w-full bg-surface-container-lowest border border-surface-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting || !roomNumber}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
          >
            {isSubmitting ? 'מוסיף...' : 'הוסף חדר'}
          </button>
        </form>
      </div>

      <div className="bg-surface-container-low p-6 rounded-xl border border-surface-variant">
        <h3 className="font-headline-md text-headline-md text-primary mb-4">רשימת החדרים בנכס</h3>
        
        {Object.keys(roomsByFloor).length === 0 ? (
          <p className="text-on-surface-variant text-center py-4">אין חדרים בנכס זה. הוסף חדר ראשון למעלה.</p>
        ) : (
          Object.entries(roomsByFloor).sort(([a],[b]) => Number(a) - Number(b)).map(([floor, floorRooms]) => (
            <div key={floor} className="mb-6 last:mb-0">
              <h4 className="font-body-lg text-body-lg font-bold border-b border-surface-variant pb-2 mb-3">קומה {floor}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {floorRooms.sort((a,b) => a.roomNumber.localeCompare(b.roomNumber)).map(room => (
                  <div key={room.id} className="bg-surface-container-lowest p-3 rounded-lg border border-surface-variant flex justify-between items-center group">
                    <span className="font-body-md text-primary font-semibold">{room.roomNumber}</span>
                    <button 
                      onClick={async () => {
                        if (confirm(`למחוק את חדר ${room.roomNumber}?`)) {
                          await deleteRoom(room.id);
                        }
                      }}
                      className="text-error opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-error-container rounded"
                      title="מחק חדר"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
