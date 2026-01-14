import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'i/:inviteCode',
    loadComponent: () => import('./components/invite/invite.component').then(m => m.InviteComponent),
  },
  {
    path: 'app',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
      { path: 'tasks', loadComponent: () => import('./components/tasks/tasks.component').then(m => m.TasksComponent) },
      { path: 'vip', loadComponent: () => import('./components/vip/vip.component').then(m => m.VipComponent) },
      { path: 'support-ai', loadComponent: () => import('./components/support-ai/support-ai.component').then(m => m.SupportAiComponent) },
      { path: 'deposit', loadComponent: () => import('./components/deposit/deposit.component').then(m => m.DepositComponent) },
      { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'drawer', loadComponent: () => import('./components/drawer/drawer.component').then(m => m.DrawerComponent) },
      { path: 'invited-users', loadComponent: () => import('./components/invited-users/invited-users.component').then(m => m.InvitedUsersComponent) },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];