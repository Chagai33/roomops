import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { translateFirebaseError } from '../lib/firebaseErrors';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

export const AuthPage: React.FC<{ initialMode?: AuthMode }> = ({ initialMode = 'LOGIN' }) => {
  const { t } = useAppStore();
  const { signUpNewAdmin, resetPassword, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [propertyName, setPropertyName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength logic (simple length check)
  const getPasswordStrength = () => {
    if (!password) return 0;
    if (password.length < 6) return 1; // Weak
    if (password.length < 10) return 2; // Medium
    return 3; // Strong
  };
  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (mode === 'LOGIN') {
        await signInWithEmailAndPassword(auth, email, password);
        // Router will redirect due to auth state change
      } else if (mode === 'SIGNUP') {
        await signUpNewAdmin(email, password, propertyName);
        // Router will redirect
      } else if (mode === 'FORGOT_PASSWORD') {
        await resetPassword(email);
        setSuccessMsg('נשלח אליך אימייל לאיפוס סיסמה (בדוק גם בתיקיית הספאם).');
        setMode('LOGIN');
      }
    } catch (err: any) {
      console.error(err);
      setError(translateFirebaseError(err.code || ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="bento-card w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <div className="flex flex-col items-center gap-3 mb-8 justify-center">
          <span className="material-symbols-outlined text-primary font-bold text-5xl">
            {mode === 'LOGIN' ? 'login' : mode === 'SIGNUP' ? 'domain_add' : 'lock_reset'}
          </span>
          <h1 className="font-display-lg text-headline-lg text-primary text-center">
            {mode === 'LOGIN' ? 'התחברות' : mode === 'SIGNUP' ? 'יצירת סביבת עבודה' : 'איפוס סיסמה'}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-center">
            {mode === 'LOGIN' ? 'הזן את פרטיך כדי להיכנס למערכת' : 
             mode === 'SIGNUP' ? 'הרשמה מהירה למנהלים' : 
             'הזן את כתובת האימייל שלך לקבלת לינק לאיפוס'}
          </p>
        </div>

        {/* Tab Switcher */}
        {mode !== 'FORGOT_PASSWORD' && (
          <div className="flex bg-surface-container-low p-1 rounded-xl mb-6">
            <button 
              type="button"
              onClick={() => { setMode('LOGIN'); setError(null); }}
              className={`flex-1 py-2 font-headline-sm text-headline-sm rounded-lg transition-colors ${mode === 'LOGIN' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              התחברות
            </button>
            <button 
              type="button"
              onClick={() => { setMode('SIGNUP'); setError(null); }}
              className={`flex-1 py-2 font-headline-sm text-headline-sm rounded-lg transition-colors ${mode === 'SIGNUP' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              הרשמה
            </button>
          </div>
        )}

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 font-body-md text-body-md text-center flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-primary-container text-on-primary-container p-4 rounded-xl mb-6 font-body-md text-body-md text-center flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'SIGNUP' && (
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                שם הנכס / המלון
              </label>
              <input 
                type="text" 
                required
                value={propertyName}
                onChange={e => setPropertyName(e.target.value)}
                className="w-full bg-surface-container-low border border-surface-variant rounded-xl p-3 font-body-md text-body-md focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-colors"
                placeholder="למשל: מלון בוטיק כרמל"
              />
            </div>
          )}

          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
              {t.auth.email}
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border border-surface-variant rounded-xl p-3 font-body-md text-body-md focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-colors"
              dir="ltr"
              placeholder="name@example.com"
            />
          </div>

          {mode !== 'FORGOT_PASSWORD' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-label-md text-label-md text-on-surface-variant">
                  {t.auth.password}
                </label>
                {mode === 'LOGIN' && (
                  <button 
                    type="button" 
                    onClick={() => { setMode('FORGOT_PASSWORD'); setError(null); setSuccessMsg(null); }}
                    className="text-primary font-label-sm text-label-sm hover:underline"
                  >
                    שכחתי סיסמה
                  </button>
                )}
              </div>
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-surface-variant rounded-xl p-3 font-body-md text-body-md focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-colors"
                dir="ltr"
                placeholder="••••••••"
              />
              
              {/* Password Strength Indicator (Signup Only) */}
              {mode === 'SIGNUP' && password.length > 0 && (
                <div className="mt-2 flex gap-1 h-1.5 rounded-full overflow-hidden bg-surface-container-highest">
                  <div className={`h-full flex-1 ${strength >= 1 ? 'bg-error' : 'bg-transparent'}`}></div>
                  <div className={`h-full flex-1 ${strength >= 2 ? 'bg-secondary' : 'bg-transparent'}`}></div>
                  <div className={`h-full flex-1 ${strength >= 3 ? 'bg-primary' : 'bg-transparent'}`}></div>
                </div>
              )}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading || (mode === 'SIGNUP' && strength < 1)}
            className="w-full bg-primary text-on-primary font-headline-md text-headline-md py-4 rounded-xl mt-4 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading && <span className="material-symbols-outlined animate-spin-slow">refresh</span>}
            {isLoading ? 'טוען...' : 
             mode === 'LOGIN' ? 'התחבר למערכת' : 
             mode === 'SIGNUP' ? 'צור חשבון' : 
             'שלח לינק איפוס'}
          </button>
        </form>

        {mode === 'FORGOT_PASSWORD' && (
          <button 
            type="button" 
            onClick={() => setMode('LOGIN')}
            className="w-full mt-4 text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            חזור להתחברות
          </button>
        )}
        
        {/* Navigation back to landing */}
        <button 
            type="button" 
            onClick={() => navigate('/')}
            className="w-full mt-8 text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors flex items-center justify-center gap-1 opacity-70"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            חזור לעמוד הראשי
        </button>
      </div>
    </div>
  );
};
