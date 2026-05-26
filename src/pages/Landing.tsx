import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const Landing: React.FC = () => {
  const { t } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="bento-card max-w-2xl w-full flex flex-col items-center text-center p-8 md:p-12">
        <div className="w-20 h-20 bg-surface-container-high rounded-2xl flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-5xl">grid_view</span>
        </div>
        
        <h1 className="font-display-lg text-display-lg text-primary mb-4 tracking-tight">
          RoomOps
        </h1>
        
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-lg mx-auto">
          מערכת ניהול חכמה ומהירה לצוותי ניקיון ותחזוקה בבתי מלון ודירות נופש. עקוב אחר מוכנות החדרים, מלאי ציוד, ומשימות בזמן אמת.
        </p>

        <div className="flex flex-col sm:flex-row w-full max-w-md gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="flex-1 bg-surface-container-high text-primary font-headline-md text-headline-md py-4 rounded-xl hover:bg-surface-variant transition-colors"
          >
            {t.auth?.login || 'התחברות'}
          </button>
          
          <button 
            onClick={() => navigate('/signup')}
            className="flex-1 bg-primary text-on-primary font-headline-md text-headline-md py-4 rounded-xl hover:opacity-90 transition-opacity"
          >
            הרשמה
          </button>
        </div>
      </div>
    </div>
  );
};
