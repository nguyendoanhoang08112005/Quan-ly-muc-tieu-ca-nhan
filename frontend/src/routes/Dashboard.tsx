import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const todayLabel = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const stats = [
    { label: 'Tong muc tieu', value: 3, icon: TrophyIcon },
    { label: 'Dang theo duoi', value: 2, icon: ClockIcon },
    { label: 'Da hoan thanh', value: 1, icon: CheckCircleIcon },
    { label: 'Viec can lam', value: 5, icon: ClipboardDocumentListIcon },
  ];

  const currentGoals = [
    { title: 'Hoan thanh buoc 1 don scope repo', progress: 80, deadline: '10/04/2026' },
    { title: 'Xay flow CRUD muc tieu ca nhan', progress: 35, deadline: '15/04/2026' },
    { title: 'Chot cau truc tasks gan voi goals', progress: 20, deadline: '18/04/2026' },
  ];

  const focusTasks = [
    'Loai bo toan bo dau vet product va demo routes',
    'Chuyen task board ve ngon ngu viec can lam ca nhan',
    'Chot module nao giu, module nao tam bo qua',
  ];

  const scopeNotes = [
    'Dashboard nay chi la tong quan co ban, khong phai khu report.',
    'Chua lam habit, report, calendar hay chat.',
    'Huong nghiep vu hien tai la auth -> goals -> tasks.',
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b-4 border-black bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{todayLabel}</div>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight">Tong quan ca nhan</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-300">
            {user?.name ? `${user.name}, ` : ''}
            day la man tong hop toi gian de giu repo tap trung vao muc tieu ca nhan.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
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

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <section className="border-2 border-black bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">Muc tieu dang theo duoi</h2>
              <button
                onClick={() => navigate('/goals')}
                className="text-xs font-bold uppercase tracking-[0.2em] text-black hover:underline"
              >
                Mo danh sach
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {currentGoals.map((goal) => (
                <div key={goal.title} className="border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-bold text-black">{goal.title}</div>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Han {goal.deadline}
                      </div>
                    </div>
                    <div className="text-xl font-black text-black">{goal.progress}%</div>
                  </div>
                  <div className="mt-4 h-2 bg-gray-200">
                    <div className="h-full bg-black" style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className="border-2 border-black bg-white p-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">Thao tac nhanh</h2>
              <div className="mt-6 grid gap-3">
                <button
                  onClick={() => navigate('/goals')}
                  className="border-2 border-black bg-black px-4 py-4 text-left text-sm font-bold uppercase tracking-wider text-white hover:bg-gray-800"
                >
                  Mo module muc tieu
                </button>
                <button
                  onClick={() => navigate('/tasks')}
                  className="border-2 border-black px-4 py-4 text-left text-sm font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white"
                >
                  Xem viec can lam
                </button>
              </div>
            </section>

            <section className="border-2 border-black bg-white p-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">Uu tien hien tai</h2>
              <div className="mt-6 space-y-3">
                {focusTasks.map((task) => (
                  <div key={task} className="border-l-4 border-black pl-4 text-sm font-medium text-gray-700">
                    {task}
                  </div>
                ))}
              </div>
            </section>

            <section className="border-2 border-black bg-stone-100 p-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">Pham vi buoc 1</h2>
              <div className="mt-6 space-y-3">
                {scopeNotes.map((note) => (
                  <div key={note} className="text-sm font-medium text-gray-700">
                    {note}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
