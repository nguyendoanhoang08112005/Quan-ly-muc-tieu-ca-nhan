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
      className={`flex-shrink-0 w-[340px] bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 transition-all ${
        isOver ? 'ring-2 ring-purple-400 shadow-lg' : ''
      }`}
    >
      {/* Column Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${color} shadow-sm`}></div>
            <Icon className="w-5 h-5 text-gray-500" />
            <h3 className="font-bold text-gray-800 text-sm">
              {title}
            </h3>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
              {tasks.length}
            </span>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="p-4 space-y-3 min-h-[500px] max-h-[calc(100vh-350px)] overflow-y-auto">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {/* Add Task Button */}
        <button
          onClick={onAddTask}
          className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl flex items-center justify-center space-x-2 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-all"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="font-medium">Thêm task</span>
        </button>
      </div>
    </div>
  );
};

export default TaskColumn;
