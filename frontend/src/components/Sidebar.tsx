import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  FolderIcon, 
  ClipboardDocumentListIcon,
  BriefcaseIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen flex flex-col transition-all duration-300 shadow-xl`}>
      {/* Workspace Header */}
      <div className="p-5 border-b border-gray-700/50">
        {!isCollapsed && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                M
              </div>
              <div>
                <span className="font-bold text-base">My Workspace</span>
                <p className="text-xs text-gray-400">Sprint 1</p>
              </div>
            </div>
            <button className="hover:bg-gray-700 p-1 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
              M
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {!isCollapsed ? (
          <>
            {/* Home Section */}
            <div className="mb-2">
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors text-sm font-medium"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Trang chủ</span>
              </button>
            </div>

            {/* Favorites */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-4 py-2 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                <span>Yêu thích</span>
                <button className="hover:text-white">+</button>
              </div>
            </div>

            {/* Spaces */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-4 py-2 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                <span>Dự án</span>
              </div>
              <div className="space-y-1 mt-2">
                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 rounded-xl text-sm transition-colors">
                  <div className="flex items-center space-x-3">
                    <FolderIcon className="w-5 h-5 text-blue-400" />
                    <span>Team Projects</span>
                  </div>
                </button>
                
                {/* Projects */}
                <div className="ml-4 space-y-1">
                  <button 
                    onClick={() => navigate('/tasks')}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 bg-white/10 rounded-xl text-sm font-medium"
                  >
                    <ClipboardDocumentListIcon className="w-4 h-4 text-purple-400" />
                    <span>Quản lý Dự án</span>
                    <span className="ml-auto text-xs bg-purple-500 px-2 py-1 rounded-full">5</span>
                  </button>
                  <button 
                    onClick={() => navigate('/goals')}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-white/10 rounded-xl text-sm"
                  >
                    <ClipboardDocumentListIcon className="w-4 h-4 text-gray-400" />
                    <span>Mục tiêu cá nhân</span>
                    <span className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded-full">3</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Other Sections */}
            <div className="space-y-1">
              <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 rounded-xl text-sm transition-colors">
                <ChatBubbleLeftIcon className="w-5 h-5" />
                <span>Tin nhắn</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 rounded-xl text-sm transition-colors">
                <ClockIcon className="w-5 h-5" />
                <span>Lịch làm việc</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 rounded-xl text-sm transition-colors">
                <ChartBarIcon className="w-5 h-5" />
                <span>Báo cáo</span>
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <button className="w-full p-3 hover:bg-white/10 rounded-xl flex justify-center transition-colors">
              <HomeIcon className="w-5 h-5" />
            </button>
            <button className="w-full p-3 hover:bg-white/10 rounded-xl flex justify-center transition-colors">
              <FolderIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700/50">
        {!isCollapsed ? (
          <>
            {/* User Profile */}
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold relative">
                  M
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">My Account</div>
                  <div className="text-xs text-gray-400">Online</div>
                </div>
              </div>
            </button>
          </>
        ) : (
          <button className="w-full p-3 hover:bg-white/10 rounded-xl flex justify-center transition-colors">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
              M
            </div>
          </button>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute bottom-8 -right-4 bg-gray-800 hover:bg-gray-700 rounded-full p-2 border-2 border-gray-700 shadow-lg transition-colors z-20"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
};

export default Sidebar;
