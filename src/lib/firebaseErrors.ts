export const translateFirebaseError = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'כתובת האימייל הזו כבר נמצאת בשימוש במערכת.';
    case 'auth/invalid-email':
      return 'כתובת האימייל אינה תקינה.';
    case 'auth/operation-not-allowed':
      return 'התחברות לא מאופשרת כרגע (פנה לתמיכה).';
    case 'auth/weak-password':
      return 'הסיסמה חלשה מדי. אנא בחר סיסמה עם 6 תווים לפחות.';
    case 'auth/user-disabled':
      return 'חשבון זה נחסם. אנא פנה למנהל המערכת.';
    case 'auth/user-not-found':
      return 'לא נמצא משתמש עם אימייל זה.';
    case 'auth/wrong-password':
      return 'הסיסמה שגויה. נסה שוב.';
    case 'auth/invalid-credential':
      return 'פרטי ההתחברות שגויים. ודא שהאימייל והסיסמה נכונים.';
    case 'auth/configuration-not-found':
      return 'שגיאת הגדרות (Auth Provider Disabled). אנא הפעל את אפשרות האימייל והסיסמה ב-Firebase Console.';
    default:
      return 'התרחשה שגיאה בלתי צפויה. נסה שוב מאוחר יותר.';
  }
};
