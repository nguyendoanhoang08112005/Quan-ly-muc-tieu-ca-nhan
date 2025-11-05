export interface Goal {
    id: number;
    title: string;
    description: string;
    due_date: string;
    status: 'not_started' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    progress: number;
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: number;
    goal_id: number;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'completed';
    due_date: string;
    created_at: string;
    updated_at: string;
}