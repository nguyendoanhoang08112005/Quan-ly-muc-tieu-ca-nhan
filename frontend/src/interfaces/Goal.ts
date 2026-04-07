export interface Goal {
    id: number;
    title: string;
    description: string;
    goal_type: 'short_term' | 'mid_term' | 'long_term';
    start_date: string;
    target_date: string;
    due_date: string;
    note: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'critical';
    progress: number;
    tasks_count?: number;
    milestones_count?: number;
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
