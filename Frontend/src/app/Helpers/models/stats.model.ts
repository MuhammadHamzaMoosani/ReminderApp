export interface SubtaskStats {
  total: number;
  completed: number;
  pending: number;
}

export interface Stats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  subtasks: SubtaskStats;
}
