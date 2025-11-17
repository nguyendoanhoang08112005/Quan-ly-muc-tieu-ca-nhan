import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CalendarIcon,
  ChartBarIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'complete';
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Thiết kế giao diện trang chủ', status: 'todo', priority: 'high', assignee: 'John', dueDate: 'Nov 10' },
  { id: '2', title: 'Xây dựng API Backend', status: 'in_progress', priority: 'high', assignee: 'Sarah', dueDate: 'Nov 8' },
  { id: '3', title: 'Viết unit tests', status: 'todo', priority: 'medium', assignee: 'Mike', dueDate: 'Nov 15' },
  { id: '4', title: 'Review code và merge PR', status: 'complete', priority: 'low', assignee: 'Anna', dueDate: 'Nov 5' },
  { id: '5', title: 'Tối ưu hiệu suất database', status: 'in_progress', priority: 'medium', assignee: 'John', dueDate: 'Nov 12' },
];

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: 'todo', title: 'TO DO', color: 'bg-red-600', icon: ClipboardDocumentListIcon },
    { id: 'in_progress', title: 'IN PROGRESS', color: 'bg-blue-600', icon: ArrowPathIcon },
    { id: 'complete', title: 'COMPLETE', color: 'bg-green-600', icon: CheckCircleIcon },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleAddTask = (status: Task['status']) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      status,
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Black Background */}
      <header className="bg-black text-white border-b-4 border-black px-6 py-6 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TableCellsIcon className="w-10 h-10 stroke-2" />
            <div>
              <h1 className="text-3xl font-black tracking-tight uppercase">Quản lý dự án</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-wider">
                  Sprint 1
                </span>
                <span className="text-gray-400 text-xs uppercase tracking-wider">
                  {tasks.length} Tasks
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2.5 border-2 border-white hover:bg-white hover:text-black transition-all">
              <MagnifyingGlassIcon className="w-5 h-5 stroke-2" />
            </button>
            <button className="px-6 py-2.5 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-all flex items-center space-x-2">
              <PlusIcon className="w-5 h-5 stroke-2" />
              <span>Task mới</span>
            </button>
            <button className="p-2.5 border-2 border-white hover:bg-white hover:text-black transition-all relative">
              <BellIcon className="w-5 h-5 stroke-2" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub Header with Views */}
      <div className="bg-gray-50 border-b-2 border-black px-6">
        <div className="flex items-center space-x-2 py-4">
          <button className="px-5 py-2.5 text-sm font-bold bg-black text-white border-2 border-black uppercase tracking-wider flex items-center space-x-2">
            <Squares2X2Icon className="w-5 h-5 stroke-2" />
            <span>Board</span>
          </button>
          <button className="px-5 py-2.5 text-sm font-bold text-black border-2 border-black hover:bg-black hover:text-white transition-all uppercase tracking-wider flex items-center space-x-2">
            <ListBulletIcon className="w-5 h-5 stroke-2" />
            <span>List</span>
          </button>
          <button className="px-5 py-2.5 text-sm font-bold text-black border-2 border-black hover:bg-black hover:text-white transition-all uppercase tracking-wider flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 stroke-2" />
            <span>Calendar</span>
          </button>
          <button className="px-5 py-2.5 text-sm font-bold text-black border-2 border-black hover:bg-black hover:text-white transition-all uppercase tracking-wider flex items-center space-x-2">
            <ChartBarIcon className="w-5 h-5 stroke-2" />
            <span>Timeline</span>
          </button>
        </div>
      </div>

      {/* Task Board */}
      <div className="p-6 bg-gray-50">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                icon={column.icon}
                tasks={getTasksByStatus(column.id as Task['status'])}
                onAddTask={() => handleAddTask(column.id as Task['status'])}
              />
            ))}
            
            {/* Add Group Button */}
            <button className="flex-shrink-0 w-[320px] h-16 flex items-center justify-center text-black hover:bg-black hover:text-white border-2 border-dashed border-black transition-all font-bold uppercase tracking-wider">
              <PlusIcon className="w-5 h-5 mr-2 stroke-2" />
              <span>Cột mới</span>
            </button>
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="bg-white p-4 border-2 border-black opacity-90">
                <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default TaskBoard;
