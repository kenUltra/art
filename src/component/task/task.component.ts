import {
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { formatTime, itask, iTime, taskIconPath } from '../../utils/task';
import { ThemeServices } from '../../services/theme.service';
import { TaskDirective } from '../../directive/task.directive';

import { NotificationCenter } from '../../utils/notification';

@Component({
  selector: 'task-app',
  imports: [TaskDirective],
  templateUrl: 'task.component.html',
  styleUrl: 'task.component.css',
})
export class TaskComponent implements OnInit, OnDestroy {
  protected readonly oneSecond: number = 1000;
  protected readonly playIcon: string = taskIconPath;

  private themeServices = inject<ThemeServices>(ThemeServices);

  currentTheme = toSignal(this.themeServices.themeResolver, { initialValue: null });

  taskData = input.required<itask>();
  locationTask = input.required<string>();
  isControlhiden = input.required<boolean>();

  removeTask = output<itask>();
  updateTaskPriority = output<itask>();
  updateTimer = output<number>();

  timer = signal<iTime>({
    hour: ''.padStart(2, '0'),
    min: ''.padStart(2, '0'),
    sec: ''.padStart(2, '0'),
  });
  initialSecond = signal<number>(0);
  isCountingDown = signal<boolean>(false);

  private timeref: any;

  constructor() {
    effect(() => {
      if (!this.isCountingDown()) {
        this.startTimeout();
        this.clearTimeout();
      }
    });
  }
  ngOnDestroy(): void {
    this.clearTimeout();
  }

  ngOnInit(): void {
    this.timer.set(formatTime(this.taskData().timeCount));
    this.initialSecond.set(this.taskData().timeCount * 60);
  }
  // event
  toggleControl(): void {
    this.isCountingDown.set(!this.isCountingDown());
    this.isCountingDown() ? this.startTimeout() : this.clearTimeout();
    this.updateTimer.emit(this.initialSecond());
  }
  removeTaskEvent(): void {
    this.removeTask.emit(this.taskData());
  }
  updateTaskEvent(): void {
    this.updateTaskPriority.emit(this.taskData());
  }

  // time function
  private startTimeout(): void {
    this.timeref = setTimeout(() => {
      const remainingSecond: number = this.initialSecond();
      if (remainingSecond > 0) {
        this.initialSecond.update((value: number) => value - 1);
        this.timer.set(formatTime(remainingSecond / 60));
      }
      if (remainingSecond == 0) {
        this.isCountingDown.set(false);
        NotificationCenter(
          'Congrass Task done',
          'The task: ' + this.taskData().title + ". don't forget other tasks",
          undefined,
          '/chores'
        );
      }

      this.isCountingDown() ? this.startTimeout() : this.clearTimeout();
    }, this.oneSecond);
  }
  private clearTimeout(): void {
    if (this.timeref) {
      clearTimeout(this.timeref);
      this.timeref = null;
    }
  }
  // class ui
  protected playClass(): Array<string> {
    const ctrlVisibility: string = this.isCountingDown() ? 'pz-ctrl' : 'py-ctrl';
    return ['btn-wp', ctrlVisibility];
  }
  protected showLine(): Array<string> {
    const lineClass: string = this.locationTask();
    return ['mask-ui', lineClass];
  }
  protected showControlLn(): Array<string> {
    const settingCls: string = this.isControlhiden() ? '' : 'opn-bsx-tx';
    return ['cg-task', settingCls];
  }
  protected taskFinishedCls(): Array<string> {
    const changedClass: string = this.initialSecond() == 0 ? 'shw-lg' : '';
    return ['lgt-fs', changedClass];
  }
}
