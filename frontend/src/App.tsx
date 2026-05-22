import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Generator } from './pages/Generator';
import { SharedView } from './pages/SharedView';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
          <Route path="/share/:id" element={<SharedView />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/generator" element={<ProtectedRoute><Generator /></ProtectedRoute>} />

          <Route path="/*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;