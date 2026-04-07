import { CheckCircleIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/ui/Button';
import { GoalTask } from '../../goals/types';

interface TaskItemProps {
  task: GoalTask;
  onComplete: (taskId: number) => Promise<void>;
}

const priorityTone: Record<GoalTask['priority'], string> = {
  low: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-orange-50 text-orange-700',
  critical: 'bg-red-50 text-red-700',
};

const statusLabel: Record<GoalTask['status'], string> = {
  not_started: 'Chua bat dau',
  in_progress: 'Dang thuc hien',
  completed: 'Hoan thanh',
  paused: 'Tam dung',
};

interface MetaItemProps {
  label: string;
}

const MetaItem = ({ label }: MetaItemProps) => (
  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">{label}</span>
);

const TaskItem = ({ onComplete, task }: TaskItemProps) => (
  <div className="rounded-3xl border border-stone-200 bg-stone-50 px-4 py-4">
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-base font-bold text-stone-950">{task.title}</h4>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityTone[task.priority]}`}>
            {task.priority}
          </span>
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-stone-500">
            {statusLabel[task.status]}
          </span>
          {task.is_focus ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
              <SparklesIcon className="h-3.5 w-3.5" />
              Focus
            </span>
          ) : null}
        </div>

        {task.description ? <p className="mt-2 text-sm leading-6 text-stone-600">{task.description}</p> : null}

        <div className="mt-3 flex flex-wrap gap-2">
          {task.due_at ? <MetaItem label={`Han: ${new Date(task.due_at).toLocaleString('vi-VN')}`} /> : null}
          {task.estimated_minutes ? <MetaItem label={`Du kien: ${task.estimated_minutes} phut`} /> : null}
          {task.completed_at ? <MetaItem label={`Xong: ${new Date(task.completed_at).toLocaleString('vi-VN')}`} /> : null}
        </div>
      </div>

      {task.status === 'completed' ? (
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          <CheckCircleIcon className="h-5 w-5" />
          Da hoan thanh
        </div>
      ) : (
        <Button className="md:min-w-[140px]" onClick={() => void onComplete(task.id)}>
          <ClockIcon className="mr-2 h-4 w-4" />
          Complete
        </Button>
      )}
    </div>
  </div>
);

export default TaskItem;
