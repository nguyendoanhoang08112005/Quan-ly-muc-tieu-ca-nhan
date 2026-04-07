import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/layout/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Goals from './routes/Goals';
import Sidebar from './components/layout/Sidebar';
import Home from './routes/Home';
import GoalCreate from './routes/GoalCreate';
import GoalDetail from './routes/GoalDetail';

const ProtectedShell = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <div className="flex min-h-screen overflow-hidden bg-stone-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  </ProtectedRoute>
);

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const showPublicNavigation = !['/dashboard', '/goals', '/tasks'].some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {showPublicNavigation && <Navigation />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/goals" replace />} />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/goals" replace />}
        />

        <Route
          path="/goals"
          element={
            <ProtectedShell>
              <Goals />
            </ProtectedShell>
          }
        />

        <Route
          path="/goals/new"
          element={
            <ProtectedShell>
              <GoalCreate />
            </ProtectedShell>
          }
        />

        <Route
          path="/goals/:goalId"
          element={
            <ProtectedShell>
              <GoalDetail />
            </ProtectedShell>
          }
        />

        <Route path="/dashboard" element={<Navigate to={user ? '/goals' : '/login'} replace />} />
        <Route path="/tasks" element={<Navigate to={user ? '/goals' : '/login'} replace />} />

        <Route path="*" element={<Navigate to={user ? '/goals' : '/'} replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
