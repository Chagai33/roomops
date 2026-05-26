import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { useAuthStore } from './store/useAuthStore';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/AuthPage';
import { Join } from './pages/Join';
import { Dashboard } from './pages/Dashboard';
import { RoomDetails } from './pages/RoomDetails';
import { Admin } from './pages/Admin';
import { Inventory } from './pages/Inventory';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-surface">טוען...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

// Root route: Shows Dashboard if logged in, Landing if not.
const RootRoute = () => {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-surface">טוען...</div>;
  
  if (user) {
    return (
      <AppLayout>
        <Dashboard />
      </AppLayout>
    );
  }
  
  return <Landing />;
};

function App() {
  const { language, isRtl } = useAppStore();
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/login" element={<AuthPage initialMode="LOGIN" />} />
        <Route path="/signup" element={<AuthPage initialMode="SIGNUP" />} />
        <Route path="/join/:inviteId" element={<Join />} />
        
        {/* App Routes (Authenticated) */}
        <Route path="/rooms" element={
          <ProtectedRoute><AppLayout><Navigate to="/" replace /></AppLayout></ProtectedRoute>
        } />
        <Route path="/rooms/:roomId" element={
          <ProtectedRoute><AppLayout><RoomDetails /></AppLayout></ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute><AppLayout><Inventory /></AppLayout></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute><AppLayout><Admin /></AppLayout></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
