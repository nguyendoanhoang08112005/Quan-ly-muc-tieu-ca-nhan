import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  TrophyIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/goals', label: 'Mục tiêu', icon: TrophyIcon },
    { path: '/tasks', label: 'Dự án', icon: ClipboardDocumentListIcon },
    { path: '/reports', label: 'Báo cáo', icon: ChartBarIcon },
    { path: '/calendar', label: 'Lịch', icon: ClockIcon },
    { path: '/chat', label: 'Tin nhắn', icon: ChatBubbleLeftIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white border-r-4 border-black h-screen flex flex-col transition-all duration-300`}>
      {/* Logo Header */}
      <div className="p-6 border-b-4 border-black">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center font-black text-xl text-white">
                M
              </div>
              <div>
                <span className="font-black text-lg uppercase tracking-tight">MyGoals</span>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Workspace</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-black flex items-center justify-center font-black text-xl text-white">
              M
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        {!isCollapsed ? (
          <>
            {/* Quick Actions */}
            <div className="mb-6">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 transition-all font-bold uppercase tracking-wider text-sm shadow-lg">
                <PlusIcon className="w-5 h-5 stroke-2" />
                <span>Tạo mới</span>
              </button>
            </div>

            {/* Main Menu */}
            <div className="space-y-1 mb-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 transition-all font-bold uppercase tracking-wider text-xs ${
                      active
                        ? 'bg-black text-white'
                        : 'text-black hover:bg-gray-100 border-2 border-transparent hover:border-black'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-2" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Projects Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between px-4 py-2 text-black text-xs uppercase tracking-widest font-black">
                <span>Dự án gần đây</span>
                <button className="hover:bg-black hover:text-white p-1 transition-all">
                  <PlusIcon className="w-4 h-4 stroke-2" />
                </button>
              </div>
              <div className="space-y-1 mt-2">
                <button className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black hover:text-white transition-all text-xs font-bold group">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-600"></div>
                    <span>Website Redesign</span>
                  </div>
                  <span className="text-xs bg-red-600 text-white px-2 py-1 font-bold">5</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black hover:text-white transition-all text-xs font-bold group">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600"></div>
                    <span>Mobile App</span>
                  </div>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 font-bold">3</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black hover:text-white transition-all text-xs font-bold group">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500"></div>
                    <span>Marketing Campaign</span>
                  </div>
                  <span className="text-xs bg-yellow-500 text-black px-2 py-1 font-bold">8</span>
                </button>
              </div>
            </div>

            {/* Stats Widget */}
            <div className="border-2 border-black p-4 bg-gray-50">
              <div className="text-xs uppercase tracking-widest font-black text-gray-500 mb-3">
                Tuần này
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold">Tasks hoàn thành</span>
                  <span className="text-lg font-black text-green-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold">Giờ làm việc</span>
                  <span className="text-lg font-black text-blue-600">28h</span>
                </div>
                <div className="w-full h-2 bg-gray-200">
                  <div className="h-full bg-gradient-to-r from-green-600 via-blue-600 to-red-600" style={{ width: '75%' }}></div>
                </div>
                <div className="text-xs text-gray-500 font-bold">75% hoàn thành</div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full p-3 transition-all flex justify-center ${
                    active
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-2" />
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="border-t-4 border-black">
        {!isCollapsed ? (
          <>
            {/* Notifications */}
            <div className="px-4 py-3 border-b-2 border-black flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-all">
              <div className="flex items-center space-x-3">
                <BellIcon className="w-5 h-5 stroke-2" />
                <span className="text-xs font-bold uppercase tracking-wider">Thông báo</span>
              </div>
              <span className="w-6 h-6 bg-red-600 text-white text-xs font-black flex items-center justify-center">
                3
              </span>
            </div>

            {/* Settings */}
            <div className="px-4 py-3 border-b-2 border-black flex items-center space-x-3 hover:bg-gray-50 cursor-pointer transition-all">
              <Cog6ToothIcon className="w-5 h-5 stroke-2" />
              <span className="text-xs font-bold uppercase tracking-wider">Cài đặt</span>
            </div>

            {/* User Profile */}
            <div className="p-4">
              <button 
                onClick={() => navigate('/profile')}
                className="w-full flex items-center justify-between px-4 py-3 bg-black text-white hover:bg-gray-800 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white text-black flex items-center justify-center text-sm font-black relative">
                    M
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-black border-2 border-white"></div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black uppercase tracking-wider">My Account</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Online</div>
                  </div>
                </div>
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-2 p-4">
            <button className="w-full p-3 hover:bg-gray-100 transition-all flex justify-center relative">
              <BellIcon className="w-6 h-6 stroke-2" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-black"></span>
            </button>
            <button className="w-full p-3 hover:bg-gray-100 transition-all flex justify-center">
              <Cog6ToothIcon className="w-6 h-6 stroke-2" />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="w-full p-3 bg-black text-white hover:bg-gray-800 transition-all flex justify-center"
            >
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center text-sm font-black">
                M
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute bottom-8 -right-4 bg-black hover:bg-gray-800 p-2 border-4 border-white shadow-xl transition-all z-20"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-4 h-4 text-white stroke-[3]" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4 text-white stroke-[3]" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
