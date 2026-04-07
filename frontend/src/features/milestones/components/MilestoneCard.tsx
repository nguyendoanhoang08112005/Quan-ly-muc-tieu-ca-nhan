import { CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/ui/Button';
import { GoalMilestone } from '../../goals/types';
import TaskItem from '../../tasks/components/TaskItem';

interface MilestoneCardProps {
  milestone: GoalMilestone;
  onCreateTask: (milestone: GoalMilestone) => void;
  onCompleteTask: (taskId: number) => Promise<void>;
}

const statusLabel: Record<GoalMilestone['status'], string> = {
  not_started: 'Chua bat dau',
  in_progress: 'Dang thuc hien',
  completed: 'Hoan thanh',
  paused: 'Tam dung',
};

const MilestoneCard = ({ milestone, onCompleteTask, onCreateTask }: MilestoneCardProps) => (
  <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
          Milestone {milestone.sequence_no}
        </div>
        <h3 className="mt-4 text-2xl font-black tracking-tight text-stone-950">{milestone.title}</h3>
        {milestone.description ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{milestone.description}</p>
        ) : null}
      </div>

      <div className="rounded-3xl bg-stone-950 px-5 py-4 text-white">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">Progress</div>
        <div className="mt-2 text-3xl font-black">{Math.round(milestone.progress)}%</div>
      </div>
    </div>

    <div className="mt-5 h-2 rounded-full bg-stone-100">
      <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: `${Math.min(milestone.progress, 100)}%` }} />
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-stone-600">
      <span className="rounded-full bg-stone-100 px-3 py-1 font-medium">{statusLabel[milestone.status]}</span>
      <span className="inline-flex items-center gap-2">
        <CalendarDaysIcon className="h-4 w-4" />
        {milestone.target_date ?? 'Chua co ngay muc tieu'}
      </span>
      <span>{milestone.tasks_count ?? milestone.tasks?.length ?? 0} task</span>
    </div>

    {milestone.note ? <div className="mt-4 rounded-3xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{milestone.note}</div> : null}

    <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-5">
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">Task theo milestone</div>
      <Button onClick={() => onCreateTask(milestone)} variant="secondary">
        <PlusIcon className="mr-2 h-4 w-4" />
        Them task
      </Button>
    </div>

    <div className="mt-5 space-y-3">
      {milestone.tasks && milestone.tasks.length > 0 ? (
        milestone.tasks.map((task) => (
          <TaskItem key={task.id} onComplete={onCompleteTask} task={task} />
        ))
      ) : (
        <div className="rounded-3xl border border-dashed border-stone-200 px-4 py-5 text-sm text-stone-500">
          Milestone nay chua co task. Ban co the tao task dau tien ngay tai day.
        </div>
      )}
    </div>
  </section>
);

export default MilestoneCard;
