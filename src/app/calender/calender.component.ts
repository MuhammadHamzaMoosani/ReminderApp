import { Component, HostListener } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for drag/drop & clicks
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-calender',
  standalone: false,
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css'
})
export class CalenderComponent {
 tasksDueToday = 3;
  overdueTasks = 1;
  completedTasks = 5;
  today=new Date();
  color='#28a745'; // Tailwind colors
  priorityColors: Record<string, string> = {
  high: '#dc3545',    // red
  medium: '#ffc107',  // yellow
  low: '#28a745'      // green
};
 // ✅ State for modals
  showAddTaskModal = false;
  selectedTask: any = null;
  unsavedChanges = false;
priority='';
 newTask: any = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'low',
    subtasks: []
  };


setColor=this.color || this.priorityColors[this.priority] || '#ffc107' ; // default gray

    calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

  // ✅ Static events (replace later with API data)
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    eventDisplay: 'block',

     eventTimeFormat: { // 👈 format control
    hour: '2-digit',
    minute: '2-digit',
    meridiem: true,  // true = am/pm, false = 24h
    omitZeroMinute: false
  },
  eventContent: (arg) => {
    const isMobile = window.innerWidth < 768; // check screen width
    if (isMobile) {
      // 👇 just show a dot
      return { html: `<div class="w-2 h-2 rounded-full ${this.setColor}"></div>` };
    }
    else {
      const startTime = arg.event.start
        ? new Date(arg.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';
      const endTime = arg.event.end
        ? new Date(arg.event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';
      const type = arg.event.extendedProps['type'] as string || '';

      // Always render inside a container so it wraps properly
      return {
        html: `
          <div class="custom-event-container ${type || ''}">
            <span class="title">${arg.event.title}</span>
            ${endTime ? `<span class="time">(${startTime} - ${endTime})</span>` : ''}
          </div>
        `
      };
    }
  },
  windowResize: () => {
    // 👇 force FullCalendar to rerender events
    this.calendarOptions.events = [...this.calendarOptions.events as any[]];
  },

    selectable: true,
    editable: true,
   eventClick: (info) => {
      this.openTaskDetail(info.event.title);
    },
     // 👇 NEW: handle blank date clicks
    dateClick: (info) => {
    this.openAddTaskModal(info.date);
    },
    eventDrop: () => {
      this.unsavedChanges = true;
    },
    eventResize: () => {
      this.unsavedChanges = true;
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [
      { title: 'Team Meeting', date: '2025-09-30', backgroundColor: '#10b981', // green
    borderColor: '#065f46',
    textColor: '#fff' },
      { title: 'Project Deadline', date: '2025-10-02', backgroundColor:"#10b981"}, // red},
      { title: 'Doctor Appointment', start: '2025-10-05T14:00:00' },
      { title: 'Birthday Party', start: '2025-10-07T19:00:00' },
    { title: 'Project Deadline', start: '2025-10-02T09:00:00', end: '2025-10-02T17:00:00' ,  backgroundColor: '#FF0000' },// apply your own CSS
    
    { title: 'Team Meeting', date: '2025-09-30', className: 'urgent', extendedProps: { type: 'urgent' } }
  
  ]
  };
 addNewSubtask() {
    this.newTask.subtasks.push({ title: '', completed: false });
  }

  removeNewSubtask(index: number) {
    this.newTask.subtasks.splice(index, 1);
  }

  saveNewTask() {
    if (this.newTask.title.trim()) {
      alert(`Task "${this.newTask.title}" added!`);
      this.newTask = { title: '', description: '', dueDate: '', priority: 'low', subtasks: [] };
      this.showAddTaskModal = false;
    }
  }

  saveCalendarChanges() {
    this.unsavedChanges = false;
    alert('Calendar changes saved!');
  }
   openTaskDetail(title: string) {
    // Dummy data for demo
    this.selectedTask = {
      title,
      dueDate: '2025-10-02',
      priority: 'High',
      subtasks: [
        { title: 'Subtask 1' },
        { title: 'Subtask 2' }
      ]
    };
  }
openAddTaskModal(date: Date) {
  if(this.today.toDateString() > date.toDateString()){
    alert("Cannot set task2 in the past");
    return;
  }
  this.newTask.dueDate = date.toISOString().substring(0, 10); // yyyy-MM-dd for input[type=date]
  this.showAddTaskModal = true;
}
  // ✅ Warn if unsaved changes
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.unsavedChanges) {
      $event.preventDefault();
      $event.returnValue = true;
    }
  }

}
