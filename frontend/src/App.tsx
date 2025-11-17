import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './routes/Dashboard';
import Goals from './routes/Goals';
import TaskBoard from './components/TaskBoard';
import Sidebar from './components/Sidebar';
import Home from './routes/Home';
import './App.css';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      {/* Navigation sẽ hiển thị trên tất cả các trang */}
      <Navigation />
      
      <Routes>
        {/* Trang chủ - ai cũng xem được */}
        <Route path="/" element={<Home />} />
        
        {/* Login/Register - chỉ hiển thị khi chưa đăng nhập */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Dashboard />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Dashboard />} 
        />

        {/* Các trang protected - cần đăng nhập */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                  <Dashboard />
                </div>
              </div>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/goals" 
          element={
            <ProtectedRoute>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                  <Goals />
                </div>
              </div>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                  <TaskBoard />
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;