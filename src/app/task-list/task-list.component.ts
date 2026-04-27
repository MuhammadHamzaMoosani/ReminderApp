import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface Subtask {
  title: string;
  completed: boolean;
}

interface Task {
  id: number;  // ✅ Added ID for navigation
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  subtasks: Subtask[];
  showMenu?: boolean; // ✅ for per-task 3-dot menu
  ShowSubtasks?: boolean; // for toggling subtask visibility
}

interface Workspace {
  name: string;
  tasks: Task[];
  showMenu: boolean;
  editing: boolean;
}

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  animations: [
    // Animate container expand/collapse
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('300ms ease-in', style({ height: '0px', opacity: 0 }))
      ])
    ]),

    // Animate each subtask item
    trigger('subtaskAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class TaskListComponent implements OnDestroy, OnInit {
  constructor(private router: Router) {}
  private routerSub!: Subscription;

  collapsed = false;
  showCalendar = false;
  showAddTaskModal = false;


  // ✅ Workspaces with sample tasks
  workspaces: Workspace[] = [
    {
      name: 'Personal',
      tasks: [
        {
          id: 1,
          title: 'Finish Angular Project',
          description: 'Complete components and API connections',
          dueDate: '2025-10-02',
          priority: 'high',
          subtasks: [
            { title: 'Setup Components', completed: true },
            { title: 'Connect API', completed: false },
            { title: 'Write Tests', completed: false }
          ],
          showMenu: false
        }
      ],
      showMenu: false,
      editing: false
    },
    { name: 'Work', tasks: [], showMenu: false, editing: false },
    { name: 'Finance', tasks: [], showMenu: false, editing: false }
  ];

  // ✅ Track active workspace
  activeWorkspace: Workspace | null = this.workspaces[0];

  newTask: Task = {
    id: Date.now(),
    title: '',
    description: '',
    dueDate: '',
    priority: 'low',
    subtasks: []
  };

  ngOnInit() {
    // Always start with modal closed
    this.showAddTaskModal = false;

    // Listen to route changes
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (!event.urlAfterRedirects.includes('tasks')) {
          this.showAddTaskModal = false;
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  // ✅ Close ALL menus if clicked outside
  @HostListener('document:click', ['$event'])
  closeMenus(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Close workspace menus
    if (!target.closest('.workspace-menu')) {
      this.workspaces.forEach(ws => (ws.showMenu = false));
    }

    // Close task menus
    if (!target.closest('.task-menu')) {
      this.workspaces.forEach(ws =>
        ws.tasks.forEach(t => (t.showMenu = false))
      );
    }
  }

  // ✅ Workspace Functions
  setActiveWorkspace(ws: Workspace) {
    this.activeWorkspace = ws;
  }

  toggleMenu(ws: Workspace) {
    this.workspaces.forEach(w => (w.showMenu = false));
    ws.showMenu = !ws.showMenu;
  }

  addWorkspace() {
    this.workspaces.push({
      name: 'New Workspace',
      tasks: [],
      showMenu: false,
      editing: true
    });
  }

  editWorkspace(ws: Workspace) {
    ws.editing = true;
    ws.showMenu = false;
  }

  stopEditing(ws: Workspace) {
    ws.editing = false;
    if (!ws.name.trim()) {
      this.removeWorkspace(ws);
    }
  }

  removeWorkspace(ws: Workspace) {
    this.workspaces = this.workspaces.filter(w => w !== ws);
    if (this.activeWorkspace === ws) {
      this.activeWorkspace = this.workspaces.length ? this.workspaces[0] : null;
    }
  }

  // ✅ Task Functions
  getProgress(task: Task): number {
    if (!task.subtasks.length) return 0;
    const completed = task.subtasks.filter(s => s.completed).length;
    return (completed / task.subtasks.length) * 100;
  }

  addNewSubtask() {
    this.newTask.subtasks.push({ title: '', completed: false });
  }

  removeNewSubtask(index: number) {
    this.newTask.subtasks.splice(index, 1);
  }

  saveNewTask() {
    if (this.newTask.title.trim() && this.activeWorkspace) {
      const newTaskWithId = { ...this.newTask, id: Date.now(), showMenu: false, ShowSubtasks: false };
      this.activeWorkspace.tasks.push(newTaskWithId);
      this.newTask = {
        id: Date.now(),
        title: '',
        description: '',
        dueDate: '',
        priority: 'low',
        subtasks: []
      };
      this.closeAddTaskModal();
    }
  }

  // ✅ Modal Functions
  openAddTaskModal() {
    this.showAddTaskModal = true;
  }

  closeAddTaskModal() {
    this.showAddTaskModal = false;
  }

  // ✅ Calendar toggle
  toggleCalendar() {
    this.showAddTaskModal = false; // close modal before navigating
    this.showCalendar = !this.showCalendar;
    this.router.navigate(['/calendar']);
  }

  // ✅ Task Menu
  toggleTaskMenu(task: Task) {
    if (!this.activeWorkspace) return;
    this.activeWorkspace.tasks.forEach(t => {
      if (t !== task) t.showMenu = false;
    });
    task.showMenu = !task.showMenu;
  }

  // Navigate to task details page
  editTask(task: Task) {
    task.showMenu = false;
    this.router.navigate(['/task-details', task.id], { state: { task } });
  }

  // Delete task
  deleteTask(task: Task) {
    if (this.activeWorkspace) {
      this.activeWorkspace.tasks = this.activeWorkspace.tasks.filter(
        t => t !== task
      );
    }
    task.showMenu = false;
  }
  toggleSubtasks(task: Task) {
  task.ShowSubtasks = !task.ShowSubtasks;
}
}
