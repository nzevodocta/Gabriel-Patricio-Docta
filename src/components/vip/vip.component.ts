
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Plan, UserService } from '../../services/user.service';

@Component({
  selector: 'app-vip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VipComponent {
  userService = inject(UserService);
  currentUser = this.userService.currentUser;

  activationStatus = signal<{ type: 'success' | 'error', message: string } | null>(null);

  plans: Plan[] = [
    { name: 'Nivia', level: 'Nivia', cost: 100, dailyIncome: 10, duration: 4 },
    { name: 'Estiloso', level: 'Estiloso', cost: 20000, dailyIncome: 660 },
    { name: 'Plano Baza', level: 'Plano Baza', cost: 30000, dailyIncome: 968 },
    { name: 'Nível 1', level: 'Nível 1', cost: 50000, dailyIncome: 1650 },
    { name: 'VP1', level: 'VP1', cost: 100000, dailyIncome: 3300 },
    { name: 'VP2', level: 'VP2', cost: 150000, dailyIncome: 4998 },
    { name: 'VP3', level: 'VP3', cost: 200000, dailyIncome: 6720 },
    { name: 'VP4', level: 'VP4', cost: 250000, dailyIncome: 8400 },
    { name: 'VP B1', level: 'VP B1', cost: 300000, dailyIncome: 10080 },
    { name: 'VP Boss', level: 'VP Boss', cost: 400000, dailyIncome: 13300 },
    { name: 'VP Boss 2', level: 'VP Boss 2', cost: 600000, dailyIncome: 19997 },
    { name: 'VP Boss 3', level: 'VP Boss 3', cost: 800000, dailyIncome: 26669 },
  ];
  
  activeTab = 'monthly';

  currentUserPlanIndex = computed(() => {
    const currentVipLevel = this.currentUser()?.vipLevel;
    if (!currentVipLevel || currentVipLevel === 'Nenhum') return -1;
    return this.plans.findIndex(p => p.level === currentVipLevel);
  });

  isPlanDisabled(planIndex: number): boolean {
    return planIndex <= this.currentUserPlanIndex();
  }

  activate(plan: Plan) {
    const result = this.userService.activateVip(plan);
    this.activationStatus.set({
      type: result.success ? 'success' : 'error',
      message: result.message
    });

    setTimeout(() => this.activationStatus.set(null), 3000);
  }

  getMonthlyIncome(dailyIncome: number): number {
    return dailyIncome * 30;
  }

  getAnnualIncome(dailyIncome: number): number {
    return dailyIncome * 365;
  }
}
