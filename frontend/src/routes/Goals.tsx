import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, TrophyIcon } from '@heroicons/react/24/outline';
import GoalCard from '../features/goals/components/GoalCard';
import { Goal } from '../features/goals/types';
import { goalsApi } from '../lib/api/goalsApi';
import Button from '../components/ui/Button';

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGoals = useCallback(async () => {
    setLoading(true);

    try {
      const data = await goalsApi.list();
      setGoals(data);
      setError('');
    } catch (loadError: any) {
      setError(loadError?.response?.data?.message ?? 'Khong tai duoc danh sach goal.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGoals();
  }, [loadGoals]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fef3c7,_transparent_24%),radial-gradient(circle_at_80%_10%,_#dbeafe,_transparent_28%),#fafaf9] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-stone-200 bg-white/90 p-8 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Goals list</div>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950">Muc tieu ca nhan cua ban</h1>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                Moi goal la mot diem neo. Tu day ban co the chia tiep thanh milestone, sau do moi milestone
                chua cac task can hoan thanh moi ngay.
              </p>
            </div>

            <Link to="/goals/new">
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Tao goal moi
              </Button>
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-[2rem] border border-red-200 bg-white px-6 py-5 text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-[2rem] bg-white shadow-sm" />
              ))}
            </div>
          ) : goals.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
              <TrophyIcon className="mx-auto h-12 w-12 text-stone-300" />
              <h2 className="mt-4 text-2xl font-black text-stone-950">Ban chua co goal nao</h2>
              <p className="mt-2 text-sm text-stone-500">
                Tao goal dau tien de bat dau flow chinh cua san pham: goal, milestone va task.
              </p>
              <div className="mt-6">
                <Link to="/goals/new">
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Tao goal dau tien
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;
