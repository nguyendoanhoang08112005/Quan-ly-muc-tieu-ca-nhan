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
    high: 'bg-red-600 text-white',
    medium: 'bg-yellow-500 text-black',
    low: 'bg-green-600 text-white',
  };

  const priorityLabels = {
    high: 'CAO',
    medium: 'TB',
    low: 'THẤP',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group bg-white border-2 border-black p-4 hover:shadow-xl transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-2xl ring-4 ring-black opacity-50' : ''
      }`}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-bold text-black flex-1 leading-relaxed pr-2 uppercase tracking-wide">
          {task.title}
        </h4>
        <button className="opacity-0 group-hover:opacity-100 text-black hover:bg-black hover:text-white p-1 transition-all">
          <EllipsisVerticalIcon className="w-4 h-4 stroke-2" />
        </button>
      </div>

      {/* Task Meta */}
      <div className="flex items-center flex-wrap gap-2 mb-3">
        {task.priority && (
          <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
        )}
        {task.dueDate && (
          <span className="flex items-center text-black bg-gray-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
            <CalendarIcon className="w-3.5 h-3.5 mr-1.5 stroke-2" />
            {task.dueDate}
          </span>
        )}
      </div>

      {/* Task Footer */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-black">
        <div className="flex items-center space-x-2">
          {/* Assignee Avatar */}
          {task.assignee && (
            <div className="relative">
              <div className="w-7 h-7 bg-black flex items-center justify-center text-white text-xs font-bold">
                {task.assignee.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-white border-2 border-black"></div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1.5 text-black">
          {/* Comment Icon */}
          <button className="p-1.5 hover:bg-black hover:text-white transition-all">
            <ChatBubbleLeftIcon className="w-4 h-4 stroke-2" />
          </button>
          
          {/* Attachment Icon */}
          <button className="p-1.5 hover:bg-black hover:text-white transition-all">
            <PaperClipIcon className="w-4 h-4 stroke-2" />
          </button>
          
          {/* Checklist Icon */}
          <button className="p-1.5 hover:bg-black hover:text-white transition-all">
            <ClipboardDocumentCheckIcon className="w-4 h-4 stroke-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
