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
    { id: 'todo', title: 'TO DO', color: 'bg-gray-400', icon: ClipboardDocumentListIcon },
    { id: 'in_progress', title: 'IN PROGRESS', color: 'bg-blue-500', icon: ArrowPathIcon },
    { id: 'complete', title: 'COMPLETE', color: 'bg-green-500', icon: CheckCircleIcon },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Dự án</h1>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              Sprint 1
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 rounded-lg flex items-center space-x-2 shadow-md hover:shadow-lg transition-all">
              <PlusIcon className="w-4 h-4" />
              <span>Thêm Task</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <BellIcon className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub Header with Views */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50 px-8">
        <div className="flex items-center space-x-2 py-3">
          <button className="px-4 py-2 text-sm font-medium bg-white text-purple-600 border border-purple-200 rounded-lg shadow-sm flex items-center space-x-2">
            <Squares2X2Icon className="w-4 h-4" />
            <span>Board</span>
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 rounded-lg transition-colors flex items-center space-x-2">
            <ListBulletIcon className="w-4 h-4" />
            <span>List</span>
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 rounded-lg transition-colors flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar</span>
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 rounded-lg transition-colors flex items-center space-x-2">
            <TableCellsIcon className="w-4 h-4" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Task Board */}
      <div className="p-8">
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
            <button className="flex-shrink-0 w-[320px] h-16 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all">
              <PlusIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Thêm cột mới</span>
            </button>
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="bg-white p-4 rounded-lg shadow-lg opacity-90">
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
