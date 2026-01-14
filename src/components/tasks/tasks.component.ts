import { ChangeDetectionStrategy, Component, computed, signal, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnDestroy {
  userService = inject(UserService);

  clicks = signal(0);
  maxClicks = 35;
  
  private checkIfTaskIsAlreadyCompleted(): boolean {
      const user = this.userService.currentUser();
      const today = new Date().toISOString().split('T')[0];
      return !!user?.tasksCompletedDate && user.tasksCompletedDate === today;
  }
  
  taskCompleted = signal(this.checkIfTaskIsAlreadyCompleted());
  completionMessage = signal(this.checkIfTaskIsAlreadyCompleted() ? "Tarefa de hoje já concluída." : '');

  completed = computed(() => this.clicks() >= this.maxClicks || this.taskCompleted());
  showEffect = signal(false);

  isWaiting = signal(false);
  countdown = signal(0);
  private countdownInterval: ReturnType<typeof setInterval> | undefined;

  handleClick() {
    if (this.completed() || this.isWaiting()) {
      return;
    }

    this.clicks.update(c => c + 1);
    this.showEffect.set(true);
    setTimeout(() => this.showEffect.set(false), 300); // duration of the effect

    if (this.clicks() >= this.maxClicks) {
        const result = this.userService.completeDailyTask();
        this.taskCompleted.set(result.success);
        this.completionMessage.set(result.message);
    } else if (!this.completed()) {
      this.startCooldown();
    }
  }

  startCooldown() {
    this.isWaiting.set(true);
    this.countdown.set(5);
    
    this.countdownInterval = setInterval(() => {
      this.countdown.update(c => {
        if (c > 1) {
          return c - 1;
        } else {
          if (this.countdownInterval) clearInterval(this.countdownInterval);
          this.isWaiting.set(false);
          return 0;
        }
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}