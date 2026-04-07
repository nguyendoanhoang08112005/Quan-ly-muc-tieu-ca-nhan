import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="border-b-2 border-black bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to={user ? '/goals' : '/'}
              className="text-lg font-black uppercase tracking-tight text-black"
            >
              Muc tieu ca nhan
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-bold uppercase text-gray-700 hover:text-black">
                  Tong quan
                </Link>
                <Link to="/goals" className="text-sm font-bold uppercase text-gray-700 hover:text-black">
                  Muc tieu
                </Link>
                <Link to="/tasks" className="text-sm font-bold uppercase text-gray-700 hover:text-black">
                  Viec can lam
                </Link>
                <span className="text-sm text-gray-700">Xin chao, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-black px-4 py-2 text-sm font-bold uppercase text-white hover:bg-gray-800"
                >
                  Dang xuat
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="text-sm font-bold uppercase text-gray-700 hover:text-black">
                  Gioi thieu
                </Link>
                <Link to="/login" className="text-sm font-bold uppercase text-gray-700 hover:text-black">
                  Dang nhap
                </Link>
                <Link
                  to="/register"
                  className="bg-black px-4 py-2 text-sm font-bold uppercase text-white hover:bg-gray-800"
                >
                  Tao tai khoan
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
