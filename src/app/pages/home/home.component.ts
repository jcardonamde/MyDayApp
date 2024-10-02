
import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from './../../models/tasks.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  filter = signal<'all' | 'pending' | 'completed'>('all');
  // Computed calcula nuevos estados y genera una señal a partir de ese estado
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();

    if (filter === 'pending') {
      return tasks.filter(task => !task.completed);
    }

    if (filter === 'completed') {
      return tasks.filter(task => task.completed);
    }

    return tasks;
  })

  newTaskControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
    ]
  });

  injector = inject(Injector);

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }

    this.trackTasks();
  }

  trackTasks() {
    // El effect se usa como un tipo de tracker
    effect(() => {
      const tasks = this.tasks();
      console.log(tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, { injector: this.injector });
  }

  addNewTaskHandler() {
    if (this.newTaskControl.valid) {
      const value = this.newTaskControl.value.trim();

      // Evitar espacios vacios en el input
      if (value !== '') {
        this.addTask(value);
        this.newTaskControl.setValue('');
      }
    }
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    }
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.filter((_: any, position: number) => position !== index));
  }

  updateTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    })
  }

  updateTaskEditingMode(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            editing: true
          }
        }
        return {
          ...task,
          editing: false
        }
      })
    })
  }

  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update(prevState => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: input.value,
            editing: false
          }
        }
        return task;
      })
    })
  }

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }
}
