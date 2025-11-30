import { afterNextRender, Component, inject, OnInit, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { TaskServices } from '../../../services/task.service';
import { itask } from '../../../utils/task';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskComponent } from '../../../component/task/task.component';
import { ThemeServices } from '../../../services/theme.service';

@Component({
  selector: 'task-ui',
  imports: [TaskComponent, UpperCasePipe],
  templateUrl: 'taskui.html',
  styleUrl: 'taskui.css',
})
export class TaskUI implements OnInit {
  private nullTask: string =
    "You haven't add anything yet, to do so you have you go on Add Piece page.";
  private mainList: string[] = [
    'edit task',
    'emergency task',
    'base value',
    'completed task',
    'exit',
  ];

  protected readonly headLine = signal<string>('All Task Will be listed here');
  protected readonly body = signal<string>(this.nullTask);

  protected listCtrl = signal<string[]>([]);

  taskServices = inject<TaskServices>(TaskServices);
  themeServies = inject<ThemeServices>(ThemeServices);

  isSettingOpen = signal<boolean>(false);
  showItemCtx = signal<boolean>(true);

  currentTheme = toSignal(this.themeServies.themeResolver, { initialValue: null });
  taskTracker = signal<itask[]>([]);

  constructor(private title: Title) {
    this.listCtrl.set(this.mainList);

    afterNextRender(() => {
      this.taskServices.getAllTask();
      this.themeServies.getTheme();
    });
  }
  ngOnInit(): void {
    this.title.setTitle('All Tasks | art ');
    this.taskServices.showCaseTracker.subscribe((val: itask[]) => {
      this.taskTracker.set(val);
      return val;
    });
  }
  // events
  menuSetting(): void {
    this.isSettingOpen.set(!this.isSettingOpen());
  }
  selectMenu(menus: string): void {
    switch (menus) {
      case 'edit task':
        this.showItemCtx.set(!this.showItemCtx());
        this.listCtrl.set(this.mainList);
        break;
      case 'emergency task':
        this.isSettingOpen.set(false);
        this.taskTracker.update((task: itask[]) => {
          this.title.setTitle('Important task');
          return task.filter((res) => {
            return res.isPriority !== false;
          });
        });
        this.listCtrl.update((value: string[]) => {
          return value.filter((res: string) => {
            return res !== 'emergency task';
          });
        });
        if (this.taskTracker().length == 0) {
          this.body.set("There's no emegency task. Please reload to see all of your task");
        }
        break;
      case 'completed task':
        this.taskTracker.update((done: itask[]) => {
          this.title.setTitle('Finished task');
          return done.filter((resTask: itask) => {
            return resTask.timeCount == 0;
          });
        });
        if (this.taskTracker().length == 0) {
          this.body.set('No Task is marked as completed. Please reload to see all of your task');
        }
        this.listCtrl.update((list: string[]) => {
          return list.filter((newList: string) => {
            return newList !== 'completed task';
          });
        });
        break;
      case 'base value':
        this.taskTracker.set(this.taskServices.getAllTask());
        this.listCtrl.set(this.mainList);
        this.body.set(this.nullTask);
        break;
      case 'close menu':
        this.isSettingOpen.set(false);
        this.body.set(this.nullTask);
        this.showItemCtx.set(false);
        break;
      default:
        this.body.set(this.nullTask);
        this.isSettingOpen.set(false);
        break;
    }
    this.isSettingOpen.set(false);
  }
  removeTaskValue(target: itask): void {
    this.taskServices.removeTask(target);
  }
  updateTaskPriority(target: itask): void {
    this.showItemCtx.set(!this.showItemCtx());
    this.taskServices.updateEmergency(target);
  }
  updateTime(currentItem: itask, currentTime: number): void {
    this.taskServices.updateTime(currentItem, currentTime);
  }

  // class logic
  protected themeClass(): Array<string> {
    const mainClass: string = this.currentTheme() == null ? '' : this.currentTheme() ?? '';

    return ['section', mainClass];
  }
  protected menuClass(): Array<string> {
    const menuCls: string = this.isSettingOpen() ? 'opn-mdl' : '';
    return ['all-list', menuCls];
  }
}
