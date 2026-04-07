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
  ArrowPathIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import TaskCard from './TaskCard';
import TaskColumn from './TaskColumn';

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  goal?: string;
  dueDate?: string;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Ra danh sach module can giu lai',
    status: 'todo',
    priority: 'high',
    goal: 'Don scope repo',
    dueDate: '07/04',
  },
  {
    id: '2',
    title: 'Chuyen task board ve ngon ngu ca nhan',
    status: 'in_progress',
    priority: 'high',
    goal: 'Don scope repo',
    dueDate: '08/04',
  },
  {
    id: '3',
    title: 'Chot scope cho Goal API',
    status: 'todo',
    priority: 'medium',
    goal: 'CRUD muc tieu',
    dueDate: '09/04',
  },
  {
    id: '4',
    title: 'Loai bo product va man hinh demo cu',
    status: 'completed',
    priority: 'medium',
    goal: 'Don scope repo',
    dueDate: '07/04',
  },
  {
    id: '5',
    title: 'Xac dinh tasks gan muc tieu thay vi project',
    status: 'in_progress',
    priority: 'low',
    goal: 'Thiet ke domain',
    dueDate: '10/04',
  },
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
    { id: 'todo', title: 'Can lam', color: 'bg-red-600', icon: ClipboardDocumentListIcon },
    { id: 'in_progress', title: 'Dang lam', color: 'bg-blue-600', icon: ArrowPathIcon },
    { id: 'completed', title: 'Hoan thanh', color: 'bg-green-600', icon: CheckCircleIcon },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((item) => item.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    setTasks((previousTasks) =>
      previousTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  };

  const getTasksByStatus = (status: Task['status']) => tasks.filter((task) => task.status === status);

  const handleAddTask = (status: Task['status']) => {
    setTasks((previousTasks) => [
      ...previousTasks,
      {
        id: `task-${Date.now()}`,
        title: 'Viec can lam moi',
        status,
        priority: 'medium',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b-4 border-black bg-black px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="flex items-start gap-4">
              <TableCellsIcon className="h-10 w-10 stroke-2" />
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Task board toi gian</div>
                <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">Viec can lam theo muc tieu</h1>
                <p className="mt-2 max-w-2xl text-sm text-gray-300">
                  Buoc 1 chi giu board ca nhan co ban. Khong con project, sprint, calendar hay timeline.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAddTask('todo')}
              className="flex items-center gap-2 bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-black hover:bg-gray-200"
            >
              <PlusIcon className="h-5 w-5 stroke-2" />
              <span>Them viec can lam</span>
            </button>
          </div>
        </div>
      </header>

      <div className="border-b-2 border-black bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
          Keo tha task qua 3 trang thai: can lam, dang lam, hoan thanh.
        </div>
      </div>

      <div className="px-6 py-6">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
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
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="border-2 border-black bg-white p-4 opacity-90">
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
