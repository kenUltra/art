import { afterNextRender, AfterViewInit, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ThemeServices } from '../../../services/theme.service';
import { TaskServices } from '../../../services/task.service';
import { itask, iTaskResp } from '../../../utils/task';

@Component({
  selector: 'task-control',
  imports: [ReactiveFormsModule],
  templateUrl: 'taskcontrol.html',
  styleUrl: 'taskcontrol.css',
})
export class TaskControl implements AfterViewInit {
  formBuilber = inject<FormBuilder>(FormBuilder);
  taskResponse = signal<{ isCorrect: boolean | null; message: string }>({
    isCorrect: null,
    message: '',
  });
  private themeServices = inject<ThemeServices>(ThemeServices);
  private taskServices = inject<TaskServices>(TaskServices);

  windowScheme = signal<string>('');

  taskData = this.formBuilber.group({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', []),
    timeCount: new FormControl<number | string>('', [Validators.min(1), Validators.required]),
    isPriority: new FormControl<boolean>(false, []),
  });
  constructor(private title: Title) {
    this.title.setTitle('Add Tasks | art');
    afterNextRender(() => {
      this.themeServices.themeResolver.subscribe((value) => {
        this.windowScheme.set(value);
        return value;
      });
    });
  }
  ngAfterViewInit(): void {
    this.taskData.valueChanges.subscribe((value) => {
      if (value.title == '' || value.title == undefined) {
        this.taskResponse.set({ isCorrect: false, message: "Don't leave the title block empty" });
        return;
      }
      if (
        value.timeCount !== null &&
        value.timeCount !== undefined &&
        typeof value.timeCount !== 'string'
      ) {
        value.timeCount <= 0 || value.timeCount > 120
          ? this.taskResponse.set({
              isCorrect: false,
              message: 'Only inset value between 1 to 120, on dealine box',
            })
          : this.taskResponse.set({
              isCorrect: null,
              message: '',
            });
      }
    });
  }
  createTask(event: SubmitEvent): void {
    if (event.submitter?.role == 'checkbox') {
      return;
    }
    const newUUId: number =
      this.taskServices.getAllTask().length == 0
        ? 1
        : this.taskServices.getAllTask()[this.taskServices.getAllTask().length - 1].uuid + 1;

    const timeTask = (): number => {
      const main = this.taskData.value.timeCount;
      if (main == undefined || main == null) {
        return 0;
      }
      if (typeof main == 'string') {
        return 1;
      }
      return main;
    };

    const finalValue: itask = {
      uuid: newUUId,
      title: this.taskData.value.title ?? '',
      description: this.taskData.value.description ?? '',
      isPriority: this.taskData.value.isPriority ?? false,
      timeCount: timeTask(),
    };

    const response: iTaskResp = this.taskServices.createTask(finalValue);

    this.taskResponse.set(response);

    /*
    this.taskData.setValue({
      title: '',
      description: '',
      isPriority: null,
      timeCount: '',
    });
    */
  }

  // class
  taskMesgClas(): Array<string> {
    const value: string =
      this.taskResponse().isCorrect == null
        ? ''
        : this.taskResponse().isCorrect
        ? 'crt-db'
        : 'err-db';
    return ['msg-content', value];
  }
}
