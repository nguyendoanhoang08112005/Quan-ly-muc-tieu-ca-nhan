import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './routes/Dashboard';
import Goals from './routes/Goals';
import TaskBoard from './components/TaskBoard';
import Sidebar from './components/Sidebar';
import Home from './routes/Home';

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
          path="/dashboard"
          element={
            <ProtectedShell>
              <Dashboard />
            </ProtectedShell>
          } 
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
          path="/tasks"
          element={
            <ProtectedShell>
              <TaskBoard />
            </ProtectedShell>
          } 
        />

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
