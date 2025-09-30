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
interface Task {
  id: number;
  title: string;
  dueDate: Date;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: 'work' | 'personal' | 'urgent' | 'other';
  subtasks?: { title: string; completed: boolean }[];
}

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
  tasks: Task[] = [];

  // Stats
  tasksDueToday = 0;
  overdueTasks = 0;
  completedTasks = 0;
  totalTasks = 0;

  // Upcoming
  upcomingTasks: Task[] = [];

  // Finance
  totalBalance = 4520.75;
  totalIncome = 6000;
  totalExpenses = 1480;
  totalSavings = this.totalIncome - this.totalExpenses;

  // Calendar
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    eventContent: (arg) => {
      // Render only a dot (color set via CSS className)
      return {
        html: `<div class="w-3 h-3 rounded-full ${arg.event.classNames.join(' ')} cursor-pointer"></div>`
      };
    },
    eventClick: (info) => {
      const task = this.tasks.find(t => t.id.toString() === info.event.id);
      if (task) this.selectedTask = task;
    },
    events: []
  };

  // Modals
  showAddTaskModal = false;
  selectedTask: Task | null = null;

  ngOnInit(): void {
    // Mock tasks
    this.tasks = [
      {
        id: 1,
        title: 'Finish Angular Dashboard',
        dueDate: new Date(),
        completed: false,
        category: 'work',
        subtasks: [
          { title: 'Setup Components', completed: true },
          { title: 'Connect API', completed: false }
        ]
      },
      {
        id: 2,
        title: 'Team Meeting',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        completed: false,
        category: 'work',
        subtasks: []
      },
      {
        id: 3,
        title: 'Pay Bills',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 2)),
        completed: false,
        category: 'personal',
        subtasks: [{ title: 'Electricity Bill', completed: false }]
      },
      {
        id: 4,
        title: 'Submit Report',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
        completed: true,
        category: 'urgent',
        subtasks: []
      }
    ];

    this.calculateStats();
    this.setUpcomingTasks();
    this.setCalendarEvents();
  }

  private calculateStats(): void {
    const today = new Date();
    this.tasksDueToday = this.tasks.filter(t =>
      t.dueDate.toDateString() === today.toDateString() && !t.completed
    ).length;

    this.overdueTasks = this.tasks.filter(t =>
      t.dueDate < today && !t.completed
    ).length;

    this.completedTasks = this.tasks.filter(t => t.completed).length;
    this.totalTasks = this.tasks.length;
  }

  private setUpcomingTasks(): void {
    const today = new Date();
    this.upcomingTasks = this.tasks
      .filter(t => t.dueDate >= today)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5);
  }

  private setCalendarEvents(): void {
    this.calendarOptions.events = this.tasks.map(t => ({
      id: t.id.toString(),
      title: t.title,
      start: t.dueDate,
      className: `custom-event ${t.category || 'other'}`
    }));
  }
 expandedTask: Task | null = null;

toggleExpand(task: Task) {
  this.expandedTask = this.expandedTask === task ? null : task;
}

// Called when any subtask changes
checkCompletion(task: Task) {
  if (task.subtasks && task.subtasks.every(s => s.completed)) {
    this.markTaskAsComplete(task);
  }
}

markTaskAsComplete(task: Task) {
  task.completed = true;
  console.log(`✅ Task "${task.title}" completed!`);

  // Remove it from upcoming list
  this.upcomingTasks = this.upcomingTasks.filter(t => t !== task);

  // Refresh stats + calendar
  this.calculateStats();
  this.setCalendarEvents();
}
}
