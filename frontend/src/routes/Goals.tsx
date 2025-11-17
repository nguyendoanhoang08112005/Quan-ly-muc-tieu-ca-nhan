import { useState } from 'react';
import {
  TrophyIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import GoalList from '../components/GoalList';
import CreateGoal from '../components/CreateGoal';

const Goals = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'completed'>('all');

  const stats = {
    total: 12,
    inProgress: 5,
    completed: 7,
    thisWeek: 3,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Black Background */}
      <div className="bg-black text-white py-8 px-6 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <TrophyIcon className="w-12 h-12 stroke-2" />
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
                  Mục tiêu cá nhân
                </h1>
                <p className="text-gray-400 mt-1 text-sm">Quản lý và theo dõi mục tiêu của bạn</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5 stroke-2" />
              Tạo mục tiêu
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Tổng số', value: stats.total, color: 'text-black' },
              { label: 'Đang thực hiện', value: stats.inProgress, color: 'text-blue-600' },
              { label: 'Hoàn thành', value: stats.completed, color: 'text-green-600' },
              { label: 'Tuần này', value: stats.thisWeek, color: 'text-red-600' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-black ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-200 py-4 px-6 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="TÌM KIẾM MỤC TIÊU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-black focus:outline-none text-sm font-semibold uppercase placeholder:text-gray-400"
              />
            </div>

            {/* View Mode & Filter */}
            <div className="flex items-center gap-3">
              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2.5 border-2 border-black text-sm font-bold uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                <option value="all">TẤT CẢ</option>
                <option value="in_progress">ĐANG LÀM</option>
                <option value="completed">HOÀN THÀNH</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border-2 border-black">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5 stroke-2" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-all border-l-2 border-black ${
                    viewMode === 'list'
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5 stroke-2" />
                </button>
              </div>

              {/* Stats Button */}
              <button className="p-2.5 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ChartBarIcon className="w-5 h-5 stroke-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <GoalList />
      </div>

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CreateGoal />
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;