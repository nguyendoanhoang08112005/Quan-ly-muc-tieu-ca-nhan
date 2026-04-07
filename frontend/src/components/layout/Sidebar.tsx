import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [{ path: '/goals', label: 'Muc tieu', icon: TrophyIcon }];

  const scopeNotes = [
    'Flow active: auth -> goals -> milestones -> tasks',
    'UI hien tai uu tien thao tac tao goal, milestone va task',
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={`relative ${isCollapsed ? 'w-20' : 'w-72'} min-h-screen border-r-4 border-black bg-white transition-all duration-300`}
    >
      <div className="border-b-4 border-black p-6">
        {!isCollapsed ? (
          <button className="flex items-center space-x-3 text-left" onClick={() => navigate('/goals')}>
            <div className="flex h-12 w-12 items-center justify-center bg-black text-xl font-black text-white">
              M
            </div>
            <div>
              <div className="text-lg font-black uppercase tracking-tight text-black">Muc tieu</div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Ca nhan</div>
            </div>
          </button>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center bg-black text-xl font-black text-white">
              M
            </div>
          </div>
        )}
      </div>

      <nav className="flex h-[calc(100vh-109px)] flex-col justify-between px-4 py-6">
        <div>
          {!isCollapsed && (
            <button
              onClick={() => navigate('/goals/new')}
              className="mb-6 flex w-full items-center justify-center gap-2 bg-black px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-gray-800"
            >
              <PlusIcon className="h-5 w-5 stroke-2" />
              <span>Tao goal</span>
            </button>
          )}

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    active
                      ? 'bg-black text-white'
                      : 'border-2 border-transparent text-black hover:border-black hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 stroke-2" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>

          {!isCollapsed && (
            <div className="mt-6 border-2 border-black bg-stone-50 p-4">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Flow chinh</div>
              <div className="mt-4 space-y-3">
                {scopeNotes.map((item) => (
                  <div key={item} className="border-l-4 border-black pl-3 text-xs font-semibold text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t-4 border-black pt-4">
          {!isCollapsed && user && (
            <div className="mb-4 px-2">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Tai khoan</div>
              <div className="mt-2 text-sm font-bold text-black">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex w-full items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white`}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 stroke-2" />
            {!isCollapsed && <span>Dang xuat</span>}
          </button>
        </div>
      </nav>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute bottom-8 -right-4 z-20 border-4 border-white bg-black p-2 shadow-xl transition-all hover:bg-gray-800"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-4 w-4 text-white stroke-[3]" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4 text-white stroke-[3]" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
