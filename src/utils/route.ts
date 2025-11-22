import { Routes } from '@angular/router';

import { HomePage } from '../path/home/home';
import { authGuard } from '../guard/auth-guard';
import { logGuard } from '../guard/log-guard';
import { UserPath } from '../path/user/user';
import { SettingPath } from '../path/setting/setting';
import { Error } from '../path/error/error.component';
import { FeedsPage } from '../path/feeds/feeds';
import { WorkPath } from '../path/work/work';

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
    loadComponent: async () => {
      const location = await import('../path/login/login');
      return location.Login;
    },
    canActivate: [logGuard],
  },
  {
    path: 'create-accont',
    redirectTo: 'sign-up',
    pathMatch: 'full',
  },
  {
    path: 'sign-up',
    loadComponent: async () => {
      const signPath = await import('../path/sign/sign');
      return signPath.SignPath;
    },
    canActivate: [logGuard],
  },
  {
    path: 'task',
    loadComponent: async () => {
      const location = await import('../path/tasks/ui/taskui');
      return location.TaskUI;
    },
  },
  {
    path: 'add-task',
    redirectTo: 'show-case',
    pathMatch: 'full',
  },
  {
    path: 'show-case',
    loadComponent: async () => {
      const taskComponent = await import('../path/tasks/controls/taskcontrol');
      return taskComponent.TaskControl;
    },
  },
  {
    path: 'profile',
    redirectTo: 'user-content',
    pathMatch: 'full',
  },
  {
    path: 'user-content',
    loadComponent: async () => {
      const res = await import('../path/auth/auth');
      return res.AuthPath;
    },
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
