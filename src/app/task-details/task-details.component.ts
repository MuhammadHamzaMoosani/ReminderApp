import { Component } from '@angular/core';

@Component({
  selector: 'app-task-details',
  standalone: false,
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {
task = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    subtasks: [{ title: '', completed: false }]
  };

  addSubtask() {
    this.task.subtasks.push({ title: '', completed: false });
  }

  removeSubtask(index: number) {
    this.task.subtasks.splice(index, 1);
  }
}
