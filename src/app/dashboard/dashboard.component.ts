import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { AuthService } from '../auth-service.service';
import { TaskService } from '../Helpers/task-service.service';
import { Workspace } from '../Helpers/models/workspaces.model';
import { Task } from '../Helpers/models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    // Expand/collapse for subtasks
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('collapsed <=> expanded', animate('250ms ease-in-out'))
    ]),

    // Fade out when task removed
    trigger('fadeRemove', [
      transition(':leave', [
        animate('250ms ease', style({ opacity: 0, transform: 'translateX(20px)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {

  // 🔹 Constructor & DI
  constructor(private taskService: TaskService, private auth: AuthService) {}

  // 🔹 State & Data
  workspaces: Workspace[] = [];
  activeWorkspace: Workspace | null = null;
  tasks: Task[] = [];
  upcomingTasks: Task[] = [];
  selectedTask: Task | null = null;
  expandedTask: Task | null = null;
  showAddTaskModal = false;

  // 🔹 Stats
  tasksDueToday = 0;
  overdueTasks = 0;
  completedTasks = 0;
  totalTasks = 0;

  // 🔹 Finance (demo placeholder)
  totalBalance = 4520.75;
  totalIncome = 6000;
  totalExpenses = 1480;
  totalSavings = this.totalIncome - this.totalExpenses;

  // 🔹 Calendar Config
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    eventContent: (arg) => {
      return {
        html: `<div class="w-3 h-3 rounded-full ${arg.event.classNames.join(' ')} cursor-pointer"></div>`
      };
    },
    eventClick: (info) => {
      const task = this.tasks.find(t => t._id?.toString() === info.event.id);
      if (task) this.selectedTask = task;
    },
    events: []
  };

  // 🔹 Lifecycle
  ngOnInit(): void {
    const userId = this.auth.getToken() ? this.parseUserIdFromToken() : null;
    if (!userId) return;

    // Load all workspaces
    this.taskService.getWorkspaces(userId).subscribe((workspaces: Workspace[]) => {
      if (workspaces && workspaces.length) {
        this.workspaces = workspaces;
        this.setActiveWorkspace(workspaces[0]); // default to first workspace
      }
    });

    // Load upcoming tasks (API)
    this.taskService.getUpcomingTasks(userId, 7).subscribe((tasks: Task[]) => {
      this.upcomingTasks = tasks;
    });
  }

  // 🔹 Active Workspace + Stats
  setActiveWorkspace(workspace: Workspace) {
    this.activeWorkspace = workspace;
    this.tasks = workspace.tasks || [];
    this.setCalendarEvents();

    // 🔥 fetch stats from backend
    this.taskService.getStats(workspace._id!).subscribe((stats) => {
      this.totalTasks = stats.totalTasks;
      this.completedTasks = stats.completedTasks;
      this.overdueTasks = stats.overdueTasks;
      this.tasksDueToday = stats.pendingTasks;
    });
  }

  // 🔹 Utilities
  private parseUserIdFromToken(): string | null {
    const token = this.auth.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id; // because we stored userId in JWT payload
    } catch {
      return null;
    }
  }

  // Manual fallback stats calc (still kept if you want local updates)
  private calculateStats(): void {
    const today = new Date();
    this.tasksDueToday = this.tasks.filter(
      t => new Date(t.deadline).toDateString() === today.toDateString() && !t.completed
    ).length;

    this.overdueTasks = this.tasks.filter(
      t => new Date(t.deadline) < today && !t.completed
    ).length;

    this.completedTasks = this.tasks.filter(t => t.completed).length;
    this.totalTasks = this.tasks.length;
  }

  // Manual upcoming calc (kept as fallback)
  private setUpcomingTasks(): void {
    const today = new Date();
    this.upcomingTasks = this.tasks
      .filter(t => new Date(t.deadline) >= today)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }

  private setCalendarEvents(): void {
    this.calendarOptions.events = this.tasks.map(t => ({
      id: t._id || '',
      title: t.title,
      start: new Date(t.deadline),
      className: `custom-event ${t.priority || 'other'}`
    }));
  }

  // 🔹 UI Actions
  toggleExpand(task: Task) {
    this.expandedTask = this.expandedTask === task ? null : task;
  }

  checkCompletion(task: Task) {
    if (task.subtasks && task.subtasks.every(s => s.completed)) {
      this.markTaskAsComplete(task);
    }
  }

  markTaskAsComplete(task: Task) {
    task.completed = true;
    console.log(`✅ Task "${task.title}" completed!`);

    this.upcomingTasks = this.upcomingTasks.filter(t => t !== task);

    // refresh stats locally for instant feedback
    this.calculateStats();
    this.setCalendarEvents();
  }
}
