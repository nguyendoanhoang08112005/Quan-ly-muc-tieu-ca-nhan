import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              My App
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Đã đăng nhập
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/goals" 
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Goals
                </Link>
                <Link 
                  to="/tasks" 
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Tasks
                </Link>
                <span className="text-gray-700">Xin chào, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              // Chưa đăng nhập
              <>
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Trang chủ
                </Link>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;