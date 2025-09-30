import { Component } from '@angular/core';

@Component({
  selector: 'app-workspaces',
  standalone: false,
  templateUrl: './workspaces.component.html',
  styleUrl: './workspaces.component.css'
})
export class WorkspacesComponent {
workspaces = [
    { name: 'Work', subspaces: ['Project A', 'Project B'] },
    { name: 'Study', subspaces: ['SQL', 'Machine Learning'] }
  ];

  newWorkspace = '';

  addWorkspace() {
    if (this.newWorkspace.trim()) {
      this.workspaces.push({ name: this.newWorkspace, subspaces: [] });
      this.newWorkspace = '';
    }
  }
}
