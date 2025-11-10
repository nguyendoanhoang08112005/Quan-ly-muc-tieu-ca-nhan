import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  EllipsisVerticalIcon, 
  CalendarIcon, 
  ChatBubbleLeftIcon, 
  PaperClipIcon, 
  ClipboardDocumentCheckIcon 
} from '@heroicons/react/24/outline';
import { Task } from './TaskBoard';

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const priorityLabels = {
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-2xl ring-2 ring-purple-400 opacity-50' : ''
      }`}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-800 flex-1 leading-relaxed pr-2">
          {task.title}
        </h4>
        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
          <EllipsisVerticalIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Task Meta */}
      <div className="flex items-center flex-wrap gap-2 mb-3">
        {task.priority && (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${priorityColors[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
        )}
        {task.dueDate && (
          <span className="flex items-center text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg text-xs font-medium">
            <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
            {task.dueDate}
          </span>
        )}
      </div>

      {/* Task Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {/* Assignee Avatar */}
          {task.assignee && (
            <div className="relative">
              <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {task.assignee.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1.5 text-gray-400">
          {/* Comment Icon */}
          <button className="p-1.5 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
            <ChatBubbleLeftIcon className="w-4 h-4" />
          </button>
          
          {/* Attachment Icon */}
          <button className="p-1.5 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
            <PaperClipIcon className="w-4 h-4" />
          </button>
          
          {/* Checklist Icon */}
          <button className="p-1.5 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
            <ClipboardDocumentCheckIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
