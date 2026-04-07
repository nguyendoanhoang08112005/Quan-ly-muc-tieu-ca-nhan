import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PlusIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import MilestoneCard from '../features/milestones/components/MilestoneCard';
import MilestoneForm from '../features/milestones/components/MilestoneForm';
import TaskForm from '../features/tasks/components/TaskForm';
import { Goal, GoalMilestone } from '../features/goals/types';
import { goalsApi } from '../lib/api/goalsApi';
import { milestonesApi } from '../lib/api/milestonesApi';
import { tasksApi } from '../lib/api/tasksApi';

const GoalDetail = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [taskModalMilestone, setTaskModalMilestone] = useState<GoalMilestone | null>(null);

  const fetchGoal = useCallback(async () => {
    if (!goalId) {
      setError('Khong tim thay goal.');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await goalsApi.get(Number(goalId));
      setGoal(data);
      setError('');
    } catch (loadError: any) {
      setError(loadError?.response?.data?.message ?? 'Khong tai duoc chi tiet goal.');
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    void fetchGoal();
  }, [fetchGoal]);

  const stats = useMemo(() => {
    const milestones = goal?.milestones ?? [];
    const tasks = milestones.flatMap((milestone) => milestone.tasks ?? []);

    return {
      milestones: milestones.length,
      tasks: tasks.length,
      completedTasks: tasks.filter((task) => task.status === 'completed').length,
    };
  }, [goal]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="rounded-full border-4 border-stone-200 border-t-stone-900 p-6 animate-spin" />
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-red-200 bg-white p-8 shadow-sm">
          <div className="text-lg font-bold text-red-700">{error || 'Khong co du lieu goal.'}</div>
          <div className="mt-5">
            <Button onClick={() => navigate('/goals')} variant="secondary">
              Quay lai danh sach goal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fef3c7,_transparent_20%),radial-gradient(circle_at_80%_0%,_#dbeafe,_transparent_24%),#fafaf9] px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] border border-stone-200 bg-white/90 p-8 shadow-xl backdrop-blur">
          <button
            onClick={() => navigate('/goals')}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Quay lai goals
          </button>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
                Goal detail
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-stone-950">{goal.title}</h1>
              <p className="mt-4 text-sm leading-7 text-stone-600">{goal.description}</p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-600">
                <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                  {goal.goal_type.replace('_', ' ')}
                </span>
                <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold">{goal.status}</span>
                <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold">
                  Uu tien {goal.priority}
                </span>
                <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold">
                  Han {goal.target_date}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:w-[420px] lg:grid-cols-1">
              <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">Progress</div>
                <div className="mt-2 text-4xl font-black">{Math.round(goal.progress)}%</div>
              </div>
              <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:grid-cols-2">
                <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">Milestone</div>
                  <div className="mt-2 text-3xl font-black text-stone-950">{stats.milestones}</div>
                </div>
                <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">Task xong</div>
                  <div className="mt-2 text-3xl font-black text-stone-950">
                    {stats.completedTasks}/{stats.tasks}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {goal.note ? (
            <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
              {goal.note}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">Flow chinh</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">Milestone va task theo goal</h2>
          </div>
          <Button onClick={() => setMilestoneModalOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Them milestone
          </Button>
        </div>

        {goal.milestones && goal.milestones.length > 0 ? (
          <div className="space-y-6">
            {goal.milestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                onCompleteTask={async (taskId) => {
                  await tasksApi.complete(taskId);
                  await fetchGoal();
                }}
                onCreateTask={(selectedMilestone) => setTaskModalMilestone(selectedMilestone)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
            <RectangleGroupIcon className="mx-auto h-12 w-12 text-stone-300" />
            <h3 className="mt-4 text-2xl font-black text-stone-950">Goal nay chua co milestone</h3>
            <p className="mt-2 text-sm text-stone-500">
              Hay them milestone dau tien de bat dau chia nho muc tieu thanh cac buoc ro rang.
            </p>
            <div className="mt-6">
              <Button onClick={() => setMilestoneModalOpen(true)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Tao milestone dau tien
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        description={`Goal: ${goal.title}`}
        onClose={() => setMilestoneModalOpen(false)}
        open={milestoneModalOpen}
        title="Them milestone"
      >
        <MilestoneForm
          onCancel={() => setMilestoneModalOpen(false)}
          onSubmit={async (payload) => {
            await milestonesApi.create(goal.id, payload);
            setMilestoneModalOpen(false);
            await fetchGoal();
          }}
        />
      </Modal>

      <Modal
        description={taskModalMilestone ? `Milestone: ${taskModalMilestone.title}` : undefined}
        onClose={() => setTaskModalMilestone(null)}
        open={Boolean(taskModalMilestone)}
        title="Them task"
      >
        {taskModalMilestone ? (
          <TaskForm
            onCancel={() => setTaskModalMilestone(null)}
            onSubmit={async (payload) => {
              await tasksApi.create(taskModalMilestone.id, payload);
              setTaskModalMilestone(null);
              await fetchGoal();
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
};

export default GoalDetail;
