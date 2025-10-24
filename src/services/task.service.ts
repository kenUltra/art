import { afterNextRender, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { itask, iTaskResp } from '../utils/task';
import { BrowserStorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TaskServices {
  private readonly chore: string = 'chores';

  showCaseTracker = new BehaviorSubject<itask[]>([]);

  browserStorage: BrowserStorageService = inject<BrowserStorageService>(BrowserStorageService);

  constructor() {
    afterNextRender(() => {
      this.getAllTask();
    });
  }

  getAllTask(): Array<itask> {
    const storage = this.browserStorage.get(this.chore);
    if (storage == '' || storage == null) {
      return [];
    }
    this.showCaseTracker.next(this.readStorage(storage));
    return this.showCaseTracker.getValue();
  }
  createTask(newTask: itask): iTaskResp {
    let task: itask[];
    const storage = this.browserStorage.get(this.chore);
    if (newTask.title == '') {
      return { isCorrect: false, message: 'Please add unic title' };
    }

    if (storage == '' || storage == null) {
      task = [newTask];
      this.browserStorage.set(this.chore, this.writeStorage(task));
      this.showCaseTracker.next(task);
      return { isCorrect: true, message: 'First task added' };
    }
    task = this.readStorage(storage);
    if (this.isTaskExist(task, newTask)) {
      return { isCorrect: false, message: 'The task is already creadted' };
    }
    task.push(newTask);
    this.browserStorage.set(this.chore, this.writeStorage(task));
    this.showCaseTracker.next(task);
    return { isCorrect: true, message: 'task created' };
  }
  removeTask(target: itask): void {
    const storedTask = this.browserStorage.get(this.chore);
    if (storedTask?.length == 0 || storedTask == null) {
      console.log('Internal error');
      return;
    }
    const oldtask: itask[] = this.readStorage(storedTask);
    const newTask = oldtask.filter((task: itask) => {
      return task.title !== target.title && task.uuid !== target.uuid;
    });

    this.browserStorage.set(this.chore, this.writeStorage(newTask));
    this.showCaseTracker.next(newTask);
  }
  updateTime(value: itask, currentTime: number): void {
    const currentStorage: string | null = this.browserStorage.get(this.chore);
    if (currentStorage == null) {
      console.error('Something went wrong');
      return;
    }
    const storedTask: itask[] = this.readStorage(currentStorage);
    if (storedTask.length == 0) {
      console.error('No content to update');
      return;
    }
    const updateTask: itask[] = storedTask.map((task: itask) => {
      return task.title == value.title
        ? { ...task, timeCount: this.backtoMinutes(currentTime) }
        : task;
    });
    this.browserStorage.set(this.chore, this.writeStorage(updateTask));
    this.showCaseTracker.next(updateTask);
  }
  updateEmergency(value: itask): void {
    const taskStored: string | null = this.browserStorage.get(this.chore);
    if (taskStored == null) {
      console.log('Your current requirest is denied');
      return;
    }
    const readTsk: itask[] = this.readStorage(taskStored);
    if (readTsk.length == 0) {
      console.log('There is no value to update');
      return;
    }
    const lastRs = readTsk.map((task: itask) => {
      return task.title == value.title ? { ...task, isPriority: !value.isPriority } : task;
    });
    this.browserStorage.set(this.chore, this.writeStorage(lastRs));
    this.showCaseTracker.next(readTsk);
    this.getAllTask();
  }

  private writeStorage(value: any): string {
    return JSON.stringify(value);
  }
  private readStorage(content: string) {
    return JSON.parse(content);
  }
  private isTaskExist(oldValue: itask[], newValue: itask): boolean {
    const response = oldValue.filter((value: itask) => {
      return value.title == newValue.title || value.uuid == newValue.uuid;
    });
    if (response.length !== 0) {
      return true;
    }
    return false;
  }
  private backtoMinutes(baseValue: number) {
    const minutes: number = baseValue / 60;
    return minutes;
  }
}
