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
  protected readonly headLine = signal<string>('All Task Will be listed here');
  protected readonly body = signal<string>(
    "You haven't add anything yet, to do so you have you go on Add Piece page."
  );

  protected listCtrl = signal<string[]>([]);

  taskServices = inject<TaskServices>(TaskServices);
  themeServies = inject<ThemeServices>(ThemeServices);

  isSettingOpen = signal<boolean>(false);
  showItemCtx = signal<boolean>(true);

  currentTheme = toSignal(this.themeServies.themeResolver, { initialValue: null });
  taskTracker = signal<itask[]>([]);

  constructor(private title: Title) {
    this.listCtrl.set(['edit task', 'sort task', 'exit']);
    this.taskServices.showCaseTracker.subscribe((value: itask[]) => {
      this.taskTracker.set(value);
    });

    afterNextRender(() => {
      this.themeServies.getTheme();
      this.taskServices.getAllTask();
    });
  }
  ngOnInit(): void {
    this.title.setTitle('All Tasks | art ');
  }

  // events
  menuSetting(): void {
    this.isSettingOpen.set(!this.isSettingOpen());
  }
  selectMenu(menus: string): void {
    switch (menus) {
      case 'edit task':
        this.showItemCtx.set(!this.showItemCtx());
        break;
      default:
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
