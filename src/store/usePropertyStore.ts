import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, doc, onSnapshot, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';

export type RoomStatus = 'READY' | 'CLEANING' | 'MAINTENANCE' | 'UNAVAILABLE';

export interface ChecklistItem {
  name: string;
  isCompleted: boolean;
}

export interface Room {
  id: string;
  roomNumber: string;
  floorNumber: number;
  status: RoomStatus;
  checklist: Record<string, ChecklistItem>;
  progressPercentage: number;
  notes: string;
  lastCleanedBy: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'LINEN' | 'TOWELS' | 'SUPPLIES';
  currentStock: number;
  minRequired: number;
}

export interface FloorTask {
  id: string;
  floorNumber: number;
  equipmentName: string;
  reportedAt: Date;
  reportedBy: string;
}

export interface LaundryMachine {
  id: string;
  name: string;
  type: 'WASHER' | 'DRYER';
  status: 'IDLE' | 'RUNNING' | 'HANGING' | 'DRYING';
  expectedReadyAt: Date | null;
}

interface PropertyState {
  activePropertyId: string | null;
  rooms: Room[];
  inventory: InventoryItem[];
  floorTasks: FloorTask[];
  laundry: LaundryMachine[];
  
  // Actions
  setActiveProperty: (id: string) => void;
  updateRoomStatus: (roomId: string, status: RoomStatus) => Promise<void>;
  toggleChecklistItem: (roomId: string, itemKey: string) => Promise<void>;
  updateInventory: (itemId: string, minRequired: number, currentStock: number) => Promise<void>;
  
  // CRUD
  addRoom: (roomData: Omit<Room, 'id'>) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
  addInventoryItem: (itemData: Omit<InventoryItem, 'id'>) => Promise<void>;
  deleteInventoryItem: (itemId: string) => Promise<void>;
  addLaundryMachine: (machineData: Omit<LaundryMachine, 'id'>) => Promise<void>;
  deleteLaundryMachine: (machineId: string) => Promise<void>;
}

let unsubRooms: (() => void) | null = null;
let unsubInventory: (() => void) | null = null;
let unsubFloors: (() => void) | null = null;
let unsubLaundry: (() => void) | null = null;

export const usePropertyStore = create<PropertyState>((set, get) => ({
  activePropertyId: null,
  rooms: [],
  inventory: [],
  floorTasks: [],
  laundry: [],
  
  setActiveProperty: (id) => {
    set({ activePropertyId: id });
    
    // Unsubscribe from previous property
    if (unsubRooms) unsubRooms();
    if (unsubInventory) unsubInventory();
    if (unsubFloors) unsubFloors();
    if (unsubLaundry) unsubLaundry();

    if (!id) return;

    // Rooms Subscription
    unsubRooms = onSnapshot(collection(db, `properties/${id}/rooms`), (snapshot) => {
      const rooms: Room[] = [];
      snapshot.forEach(doc => rooms.push({ id: doc.id, ...doc.data() } as Room));
      set({ rooms });
    });

    // Inventory Subscription
    unsubInventory = onSnapshot(collection(db, `properties/${id}/inventory`), (snapshot) => {
      const inventory: InventoryItem[] = [];
      snapshot.forEach(doc => inventory.push({ id: doc.id, ...doc.data() } as InventoryItem));
      set({ inventory });
    });

    // Floor Tasks Subscription
    unsubFloors = onSnapshot(collection(db, `properties/${id}/floors`), (snapshot) => {
      const floorTasks: FloorTask[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.equipment) {
          Object.entries(data.equipment).forEach(([key, eq]: [string, any]) => {
            if (eq.status === 'MISSING') {
              floorTasks.push({
                id: `${docSnap.id}_${key}`,
                floorNumber: data.floorNumber,
                equipmentName: eq.name,
                reportedAt: eq.reportedAt ? eq.reportedAt.toDate() : new Date(),
                reportedBy: eq.reportedBy || 'Staff'
              });
            }
          });
        }
      });
      set({ floorTasks });
    });

    // Laundry Subscription
    unsubLaundry = onSnapshot(collection(db, `properties/${id}/laundry`), (snapshot) => {
      const laundry: LaundryMachine[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        laundry.push({
          id: doc.id,
          name: data.name,
          type: data.type,
          status: data.status,
          expectedReadyAt: data.expectedReadyAt ? data.expectedReadyAt.toDate() : null
        });
      });
      set({ laundry });
    });
  },
  
  updateRoomStatus: async (roomId, status) => {
    const { activePropertyId } = get();
    if (!activePropertyId) return;
    
    const roomRef = doc(db, `properties/${activePropertyId}/rooms/${roomId}`);
    await updateDoc(roomRef, { status });
  },
  
  toggleChecklistItem: async (roomId, itemKey) => {
    const { activePropertyId, rooms } = get();
    if (!activePropertyId) return;
    
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const newChecklist = { ...room.checklist };
    if (newChecklist[itemKey]) {
      newChecklist[itemKey].isCompleted = !newChecklist[itemKey].isCompleted;
    }
    
    const total = Object.keys(newChecklist).length;
    const completed = Object.values(newChecklist).filter(i => i.isCompleted).length;
    const progressPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    const roomRef = doc(db, `properties/${activePropertyId}/rooms/${roomId}`);
    await updateDoc(roomRef, { 
      checklist: newChecklist,
      progressPercentage
    });
  },

  updateInventory: async (itemId, minRequired, currentStock) => {
    const { activePropertyId } = get();
    if (!activePropertyId) return;
    const inventoryRef = doc(db, `properties/${activePropertyId}/inventory/${itemId}`);
    await updateDoc(inventoryRef, { minRequired, currentStock });
  },

  addRoom: async (roomData) => {
    const { activePropertyId } = get();
    if (!activePropertyId) return;
    await addDoc(collection(db, `properties/${activePropertyId}/rooms`), roomData);
  },

  deleteRoom: async (roomId) => {
    const { activePropertyId } = get();
    if (!activePropertyId) return;
    await deleteDoc(doc(db, `properties/${activePropertyId}/rooms/${roomId}`));
  },

  addInventoryItem: async (itemData) => {
    const { activePropertyId } = get();
    if (!activePropertyId) return;
    await addDoc(collection(db, `properties/${activePropertyId}/inventory`), itemData);
  },

  deleteInventoryItem: async (itemId) => {
    const { activePropertyId } = get();
    if (!activePropertyId) return;
    await deleteDoc(doc(db, `properties/${activePropertyId}/inventory/${itemId}`));
  },

  addLaundryMachine: async (machineData) => {
    const { activePropertyId } = get();
    if (!activePropertyId) return;
    await addDoc(collection(db, `properties/${activePropertyId}/laundry`), machineData);
  },

  deleteLaundryMachine: async (machineId) => {
    const { activePropertyId } = get();
    if (!activePropertyId) return;
    await deleteDoc(doc(db, `properties/${activePropertyId}/laundry/${machineId}`));
  }
}));
