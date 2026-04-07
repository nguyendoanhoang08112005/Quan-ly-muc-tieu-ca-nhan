import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Task } from './TaskBoard';

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    high: 'bg-red-600 text-white',
    medium: 'bg-yellow-500 text-black',
    low: 'bg-green-600 text-white',
  };

  const priorityLabels = {
    high: 'CAO',
    medium: 'TB',
    low: 'THAP',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group cursor-grab border-2 border-black bg-white p-4 transition-all hover:shadow-xl active:cursor-grabbing ${
        isDragging ? 'opacity-50 shadow-2xl ring-4 ring-black' : ''
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <h4 className="flex-1 pr-2 text-sm font-bold uppercase tracking-wide text-black">{task.title}</h4>
        <button className="p-1 text-black opacity-0 transition-all hover:bg-black hover:text-white group-hover:opacity-100">
          <EllipsisVerticalIcon className="h-4 w-4 stroke-2" />
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        {task.priority && (
          <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
        )}

        {task.dueDate && (
          <span className="flex items-center bg-gray-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-black">
            <CalendarIcon className="mr-1.5 h-3.5 w-3.5 stroke-2" />
            {task.dueDate}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t-2 border-black pt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <span className="truncate">{task.goal ? `Muc tieu: ${task.goal}` : 'Chua gan muc tieu'}</span>
        <span>Keo tha</span>
      </div>
    </div>
  );
};

export default TaskCard;
