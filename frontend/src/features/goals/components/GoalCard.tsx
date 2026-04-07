import { Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon, FlagIcon } from '@heroicons/react/24/outline';
import { Goal } from '../types';

const statusLabels: Record<Goal['status'], string> = {
  not_started: 'Chua bat dau',
  in_progress: 'Dang thuc hien',
  completed: 'Hoan thanh',
  paused: 'Tam dung',
  cancelled: 'Da huy',
};

const priorityLabels: Record<Goal['priority'], string> = {
  low: 'Thap',
  medium: 'Trung binh',
  high: 'Cao',
  critical: 'Rat cao',
};

interface GoalCardProps {
  goal: Goal;
}

const GoalCard = ({ goal }: GoalCardProps) => (
  <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-600">
          {goal.goal_type.replace('_', ' ')}
        </div>
        <h3 className="mt-4 text-2xl font-black tracking-tight text-stone-950">{goal.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">{goal.description}</p>
      </div>

      <div className="rounded-2xl bg-amber-50 px-3 py-2 text-right">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Progress</div>
        <div className="text-2xl font-black text-amber-900">{Math.round(goal.progress)}%</div>
      </div>
    </div>

    <div className="mt-5 h-2 rounded-full bg-stone-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
        style={{ width: `${Math.min(goal.progress, 100)}%` }}
      />
    </div>

    <div className="mt-5 grid gap-3 text-sm text-stone-600 sm:grid-cols-2">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        <span>Han muc tieu: {goal.target_date}</span>
      </div>
      <div className="flex items-center gap-2">
        <FlagIcon className="h-4 w-4" />
        <span>
          {priorityLabels[goal.priority]} • {statusLabels[goal.status]}
        </span>
      </div>
      <div>Milestone: {goal.milestones_count ?? goal.milestones?.length ?? 0}</div>
      <div>Task: {goal.tasks_count ?? 0}</div>
    </div>

    <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-5">
      <span className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
        Flow active
      </span>
      <Link
        to={`/goals/${goal.id}`}
        className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
      >
        Xem chi tiet
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  </article>
);

export default GoalCard;
