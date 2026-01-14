import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Icon Components
import { HomeIconComponent } from '../icons/home-icon.component';
import { TasksIconComponent } from '../icons/tasks-icon.component';
import { VipIconComponent } from '../icons/vip-icon.component';
import { DepositIconComponent } from '../icons/deposit-icon.component';
import { ProfileIconComponent } from '../icons/profile-icon.component';
import { SupportIconComponent } from '../icons/support-icon.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HomeIconComponent,
    TasksIconComponent,
    VipIconComponent,
    DepositIconComponent,
    ProfileIconComponent,
    SupportIconComponent
  ],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  router = inject(Router);
  navItems = [
    { path: '/app/home', label: 'Inicial', icon: 'home' },
    { path: '/app/tasks', label: 'Tarefas', icon: 'tasks' },
    { path: '/app/vip', label: 'VIP', icon: 'vip' },
    { path: '/app/support-ai', label: 'Suporte', icon: 'support' },
    { path: '/app/deposit', label: 'Depósito', icon: 'deposit' },
    { path: '/app/profile', label: 'Perfil', icon: 'profile' },
  ];

  isRouteActive(path: string): boolean {
    return this.router.isActive(path, true);
  }
}