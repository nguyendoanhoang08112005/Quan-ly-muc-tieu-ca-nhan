import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { dashboardApi } from '../lib/api/dashboardApi';
import { DashboardSummaryResponse } from '../features/dashboard/types';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const todayLabel = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      try {
        const data = await dashboardApi.summary();
        setDashboard(data);
        setError('');
      } catch (loadError: any) {
        setError(loadError?.response?.data?.message ?? 'Khong tai duoc dashboard.');
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const summary = dashboard?.summary ?? {
      active_goals: 0,
      completed_goals: 0,
      tasks_today: 0,
      overdue_tasks: 0,
    };

    return [
      { label: 'Goal dang active', value: summary.active_goals, icon: TrophyIcon },
      { label: 'Goal hoan thanh', value: summary.completed_goals, icon: CheckCircleIcon },
      { label: 'Task hom nay', value: summary.tasks_today, icon: ClipboardDocumentListIcon },
      { label: 'Task qua han', value: summary.overdue_tasks, icon: ExclamationTriangleIcon },
    ];
  }, [dashboard]);

  const activeGoals = dashboard?.active_goals ?? [];
  const upcomingTasks = dashboard?.upcoming_tasks ?? [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fef3c7,_transparent_22%),radial-gradient(circle_at_85%_12%,_#dbeafe,_transparent_28%),#fafaf9]">
      <div className="border-b-4 border-black bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{todayLabel}</div>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight">Tong quan ca nhan</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-300">
            {user?.name ? `${user.name}, ` : ''}day la dashboard MVP lay du lieu that tu backend,
            khong con dung mock data.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {error ? (
          <div className="mb-6 rounded-[2rem] border border-red-200 bg-white px-6 py-5 text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="border-2 border-black bg-white p-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{stat.label}</div>
                  <Icon className="h-6 w-6 stroke-2 text-black" />
                </div>
                <div className="mt-6 text-4xl font-black text-black">{stat.value}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr,1fr]">
          <section className="border-2 border-black bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">Goal dang lam</h2>
              <button
                onClick={() => navigate('/goals')}
                className="text-xs font-bold uppercase tracking-[0.2em] text-black hover:underline"
              >
                Mo danh sach
              </button>
            </div>

            {loading ? (
              <div className="mt-6 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-28 animate-pulse border border-gray-200 bg-stone-50" />
                ))}
              </div>
            ) : activeGoals.length > 0 ? (
              <div className="mt-6 space-y-4">
                {activeGoals.map((goal) => (
                  <Link
                    key={goal.id}
                    to={`/goals/${goal.id}`}
                    className="block border border-gray-200 p-4 transition hover:border-black"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-bold text-black">{goal.title}</div>
                        <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                          Han {goal.target_date} • {goal.milestones_count ?? 0} milestone • {goal.tasks_count ?? 0} task
                        </div>
                      </div>
                      <div className="text-xl font-black text-black">{Math.round(goal.progress)}%</div>
                    </div>
                    <div className="mt-4 h-2 bg-gray-200">
                      <div className="h-full bg-black" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 border border-dashed border-gray-300 px-5 py-8 text-sm text-gray-500">
                Chua co goal active. Tao goal moi de dashboard bat dau co so lieu.
              </div>
            )}
          </section>

          <div className="space-y-6">
            <section className="border-2 border-black bg-white p-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">Thao tac nhanh</h2>
              <div className="mt-6 grid gap-3">
                <button
                  onClick={() => navigate('/goals')}
                  className="border-2 border-black bg-black px-4 py-4 text-left text-sm font-bold uppercase tracking-wider text-white hover:bg-gray-800"
                >
                  Mo danh sach goal
                </button>
                <button
                  onClick={() => navigate('/goals/new')}
                  className="border-2 border-black px-4 py-4 text-left text-sm font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white"
                >
                  Tao goal moi
                </button>
              </div>
            </section>

            <section className="border-2 border-black bg-white p-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">Task sap den han</h2>
              {loading ? (
                <div className="mt-6 space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-16 animate-pulse rounded-2xl bg-stone-50" />
                  ))}
                </div>
              ) : upcomingTasks.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-bold text-black">{task.title}</div>
                          <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                            {task.goal?.title ?? 'Khong ro goal'}
                            {task.milestone?.title ? ` • ${task.milestone.title}` : ''}
                          </div>
                        </div>
                        <div className="text-right text-xs font-semibold text-gray-500">
                          {task.due_at ? new Date(task.due_at).toLocaleString('vi-VN') : 'Chua dat han'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 border border-dashed border-gray-300 px-5 py-8 text-sm text-gray-500">
                  Chua co task sap den han trong 7 ngay toi.
                </div>
              )}
            </section>

            <section className="border-2 border-black bg-stone-100 p-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">Goc nhin MVP</h2>
              <div className="mt-6 space-y-3 text-sm font-medium text-gray-700">
                <div>Card summary hien so lieu that tu goals va tasks cua user hien tai.</div>
                <div>Section ben tren uu tien task can xu ly som va goal dang theo duoi.</div>
                <div>Chua them bieu do, report hay widget phuc tap khi summary con dang o giai doan MVP.</div>
              </div>
            </section>
          </div>
        </div>

        {!loading && dashboard && dashboard.summary.active_goals === 0 && dashboard.summary.tasks_today === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-10 text-center shadow-sm">
            <div className="text-2xl font-black text-stone-950">Dashboard dang trong</div>
            <p className="mt-2 text-sm text-stone-500">
              Khi ban tao goal, milestone va task, dashboard se bat dau phan anh tien do that.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/goals/new')}>Tao goal dau tien</Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
