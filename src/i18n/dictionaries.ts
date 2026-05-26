export type Language = 'he' | 'en';

export const dictionaries = {
  he: {
    app: {
      name: 'RoomOps',
      dashboard: 'Dashboard',
      rooms: 'חדרים',
      inventory: 'מלאי',
      admin: 'ניהול',
    },
    dashboard: {
      greeting: 'בוקר טוב',
      overview: 'סקירת מצב כללית ל',
      occupancy: 'תפוסה',
      newTask: 'משימה חדשה',
      readyRooms: 'חדרים מוכנים',
      cleaningNow: 'בניקוי כעת',
      inMaintenance: 'בתחזוקה',
      completedToday: 'הושלם היום',
      floorStatus: 'סטטוס קומות',
      all: 'הכל',
      urgentTasks: 'משימות דחופות',
      criticalInventory: 'מלאי קריטי',
      laundryStatus: 'סטטוס כביסה',
      statusReady: 'מוכן לאכלוס',
      statusCleaning: 'בניקוי',
      statusMaintenance: 'תקלה / דחוף',
      statusAlmostReady: 'כמעט מוכן',
      floor: 'קומה'
    },
    room: {
      suite: 'סוויטה',
      highPriority: 'דחוף',
      progress: 'התקדמות',
      checklist: 'רשימת מטלות',
      completedOutOf: 'מתוך',
      completed: 'הושלמו',
      notes: 'הערות צוות',
      addNotePlaceholder: 'הוסף הערות לגבי החדר...',
      finishCleaning: 'סיום ניקיון',
    },
    auth: {
      login: 'התחברות',
      email: 'אימייל',
      password: 'סיסמה',
      submit: 'היכנס',
      error: 'שגיאה בהתחברות. בדוק את הפרטים ונסה שוב.',
      logout: 'התנתק',
    }
  },
  en: {
    app: {
      name: 'RoomOps',
      dashboard: 'Dashboard',
      rooms: 'Rooms',
      inventory: 'Inventory',
      admin: 'Admin',
    },
    dashboard: {
      greeting: 'Good morning',
      overview: 'General overview for',
      occupancy: 'occupancy',
      newTask: 'New Task',
      readyRooms: 'Ready Rooms',
      cleaningNow: 'Cleaning',
      inMaintenance: 'Maintenance',
      completedToday: 'Completed Today',
      floorStatus: 'Floor Status',
      all: 'All',
      urgentTasks: 'Urgent Tasks',
      criticalInventory: 'Critical Inventory',
      laundryStatus: 'Laundry Status',
      statusReady: 'Ready',
      statusCleaning: 'Cleaning',
      statusMaintenance: 'Maintenance / Urgent',
      statusAlmostReady: 'Almost Ready',
      floor: 'Floor'
    },
    room: {
      suite: 'Suite',
      highPriority: 'High Priority',
      progress: 'Progress',
      checklist: 'Checklist',
      completedOutOf: 'out of',
      completed: 'completed',
      notes: 'Staff Notes',
      addNotePlaceholder: 'Add notes about the room...',
      finishCleaning: 'Finish Cleaning',
    },
    auth: {
      login: 'Login',
      email: 'Email',
      password: 'Password',
      submit: 'Sign In',
      error: 'Login failed. Check your credentials and try again.',
      logout: 'Logout',
    }
  }
};

export type Dictionary = typeof dictionaries['he'];
