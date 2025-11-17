import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PlusIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import TaskCard from './TaskCard';
import { Task } from './TaskBoard';

interface TaskColumnProps {
  id: string;
  title: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  tasks: Task[];
  onAddTask: () => void;
}

const TaskColumn = ({ id, title, color, icon: Icon, tasks, onAddTask }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-[340px] bg-white border-2 border-black transition-all ${
        isOver ? 'ring-4 ring-black ring-offset-2' : ''
      }`}
    >
      {/* Column Header */}
      <div className="p-5 border-b-2 border-black bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 ${color}`}></div>
            <Icon className="w-5 h-5 text-black stroke-2" />
            <h3 className="font-black text-black text-sm uppercase tracking-wider">
              {title}
            </h3>
            <span className="px-2.5 py-1 bg-black text-white text-xs font-bold">
              {tasks.length}
            </span>
          </div>
          <button className="p-1.5 hover:bg-black hover:text-white transition-all">
            <EllipsisVerticalIcon className="w-5 h-5 stroke-2" />
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="p-4 space-y-3 min-h-[500px] max-h-[calc(100vh-350px)] overflow-y-auto bg-white">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {/* Add Task Button */}
        <button
          onClick={onAddTask}
          className="w-full py-3 text-sm text-black font-bold hover:bg-black hover:text-white border-2 border-dashed border-black transition-all flex items-center justify-center space-x-2 uppercase tracking-wider"
        >
          <PlusIcon className="w-4 h-4 stroke-2" />
          <span>Thêm task</span>
        </button>
      </div>
    </div>
  );
};

export default TaskColumn;
