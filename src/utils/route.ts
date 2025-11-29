import { Routes } from '@angular/router';

import { HomePage } from '../path/home/home';
import { authGuard } from '../guard/auth-guard';
import { logGuard } from '../guard/log-guard';
import { UserPath } from '../path/user/user';
import { SettingPath } from '../path/setting/setting';
import { Error } from '../path/error/error.component';
import { FeedsPage } from '../path/feeds/feeds';
import { WorkPath } from '../path/work/work';
import { Login } from '../path/login/login';
import { SignPath } from '../path/sign/sign';
import { TaskUI } from '../path/tasks/ui/taskui';
import { TaskControl } from '../path/tasks/controls/taskcontrol';
import { AuthPath } from '../path/auth/auth';

export const pageRoute: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Art inc',
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'chores',
    redirectTo: 'task',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
    canActivate: [logGuard],
  },
  {
    path: 'create-accont',
    redirectTo: 'sign-up',
    pathMatch: 'full',
  },
  {
    path: 'sign-up',
    component: SignPath,
    canActivate: [logGuard],
  },
  {
    path: 'task',
    component: TaskUI,
  },
  {
    path: 'add-task',
    redirectTo: 'show-case',
    pathMatch: 'full',
  },
  {
    path: 'show-case',
    component: TaskControl,
  },
  {
    path: 'profile',
    redirectTo: 'user-content',
    pathMatch: 'full',
  },
  {
    path: 'user-content',
    component: AuthPath,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: UserPath,
      },
      {
        path: 'post',
        redirectTo: 'message',
        pathMatch: 'full',
      },
      {
        path: 'employee',
        redirectTo: 'work',
        pathMatch: 'full',
      },
      {
        path: 'work',
        component: WorkPath,
      },
      {
        path: 'message',
        component: FeedsPage,
      },
      {
        path: 'setting',
        component: SettingPath,
      },
    ],
  },
  {
    path: '**',
    component: Error,
  },
];
