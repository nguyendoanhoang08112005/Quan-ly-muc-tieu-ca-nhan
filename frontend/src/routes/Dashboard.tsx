import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  DocumentChartBarIcon,
  CogIcon,
  FireIcon,
  TrophyIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - sẽ thay bằng API thực tế
  const stats = {
    totalGoals: 12,
    inProgress: 5,
    completed: 7,
    tasksToday: 8,
  };

  const recentGoals = [
    { id: 1, title: 'Học React Advanced', progress: 75, status: 'in_progress', dueDate: '2024-12-31' },
    { id: 2, title: 'Tập gym 3 lần/tuần', progress: 60, status: 'in_progress', dueDate: '2024-12-15' },
    { id: 3, title: 'Đọc 2 cuốn sách/tháng', progress: 90, status: 'in_progress', dueDate: '2024-11-30' },
    { id: 4, title: 'Hoàn thành dự án', progress: 100, status: 'completed', dueDate: '2024-11-10' },
  ];

  const recentActivities = [
    { id: 1, action: 'Hoàn thành task', title: 'Design mockup', time: '2 giờ trước' },
    { id: 2, action: 'Tạo mục tiêu mới', title: 'Học TypeScript', time: '5 giờ trước' },
    { id: 3, action: 'Cập nhật tiến độ', title: 'Dự án website', time: 'Hôm qua' },
    { id: 4, action: 'Hoàn thành mục tiêu', title: 'Setup environment', time: '2 ngày trước' },
  ];

  const quickActions = [
    { 
      title: 'Tạo mục tiêu', 
      icon: TrophyIcon, 
      action: () => navigate('/goals'),
      color: 'hover:bg-yellow-500'
    },
    { 
      title: 'Thêm task', 
      icon: PlusCircleIcon, 
      action: () => navigate('/tasks'),
      color: 'hover:bg-blue-600'
    },
    { 
      title: 'Xem báo cáo', 
      icon: DocumentChartBarIcon, 
      action: () => navigate('/reports'),
      color: 'hover:bg-green-600'
    },
    { 
      title: 'Cài đặt', 
      icon: CogIcon, 
      action: () => navigate('/settings'),
      color: 'hover:bg-red-600'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                DASHBOARD
              </h1>
              <p className="text-gray-400 mt-2">Chào mừng trở lại! Hãy tiếp tục đạt mục tiêu của bạn.</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black">{currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">
                {stats.tasksToday} nhiệm vụ hôm nay
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Tổng mục tiêu', value: stats.totalGoals, icon: TrophyIcon, change: '+2 tuần này', color: 'text-yellow-500', hoverBg: 'hover:bg-yellow-500' },
            { label: 'Đang thực hiện', value: stats.inProgress, icon: BoltIcon, change: '5 đang active', color: 'text-blue-600', hoverBg: 'hover:bg-blue-600' },
            { label: 'Đã hoàn thành', value: stats.completed, icon: CheckCircleIcon, change: '58% hoàn thành', color: 'text-green-600', hoverBg: 'hover:bg-green-600' },
            { label: 'Tasks hôm nay', value: stats.tasksToday, icon: ClipboardDocumentListIcon, change: '3/8 đã xong', color: 'text-red-600', hoverBg: 'hover:bg-red-600' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-white border-2 border-black p-6 ${stat.hoverBg} hover:text-white transition-all group cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className={`w-10 h-10 stroke-2 ${stat.color} group-hover:text-white`} />
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-100">
                    {stat.label}
                  </div>
                </div>
                <div className="text-5xl font-black mb-2">{stat.value}</div>
                <div className="text-xs text-gray-500 group-hover:text-gray-100">{stat.change}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Goals - 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black uppercase tracking-tight">Mục tiêu gần đây</h2>
              <button
                onClick={() => navigate('/goals')}
                className="text-sm font-bold uppercase tracking-wider hover:underline"
              >
                Xem tất cả →
              </button>
            </div>

            <div className="space-y-4">
              {recentGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-white border border-gray-200 p-6 hover:border-black transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1 group-hover:underline">{goal.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1 uppercase tracking-wider">
                          {goal.status === 'completed' ? (
                            <>
                              <CheckCircleIcon className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 font-bold">Hoàn thành</span>
                            </>
                          ) : (
                            <>
                              <FireIcon className="w-4 h-4 text-red-600" />
                              <span className="text-red-600 font-bold">Đang thực hiện</span>
                            </>
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          Hạn: {goal.dueDate}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black">{goal.progress}%</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-2 bg-gray-100 overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 transition-all ${
                        goal.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Thao tác nhanh</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`bg-white border-2 border-black p-6 ${action.color} hover:text-white transition-all group text-center`}
                    >
                      <Icon className="w-10 h-10 mx-auto mb-3 stroke-2 group-hover:text-white" />
                      <div className="text-xs font-bold uppercase tracking-wider">{action.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Hoạt động</h2>
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const colors = [
                    'border-green-600',
                    'border-blue-600', 
                    'border-yellow-500',
                    'border-red-600'
                  ];
                  return (
                    <div key={activity.id} className={`bg-gray-50 p-4 border-l-4 ${colors[activity.id - 1]}`}>
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        {activity.action}
                      </div>
                      <div className="font-bold text-sm mb-1">{activity.title}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mt-12 bg-gray-50 p-8 border-2 border-black">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Tiến độ tuần này</h2>
          
          <div className="grid grid-cols-7 gap-4">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => {
              const completionRate = Math.floor(Math.random() * 100);
              const colors = [
                'bg-red-600',
                'bg-blue-600',
                'bg-green-600',
                'bg-yellow-500',
                'bg-red-600',
                'bg-blue-600',
                'bg-green-600'
              ];
              return (
                <div key={index} className="text-center">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    {day}
                  </div>
                  <div className="relative h-32 bg-white border-2 border-black flex items-end justify-center overflow-hidden">
                    <div
                      className={`absolute bottom-0 left-0 right-0 ${colors[index]} transition-all`}
                      style={{ height: `${completionRate}%` }}
                    />
                    <div className="relative z-10 text-xs font-bold mb-2 text-white mix-blend-difference">
                      {completionRate}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-12 bg-black text-white p-12 text-center">
          <div className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
            "IMPOSSIBLE IS NOTHING"
          </div>
          <div className="text-gray-400 uppercase tracking-widest text-sm">
            Tiếp tục phấn đấu và đạt được mục tiêu của bạn
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;