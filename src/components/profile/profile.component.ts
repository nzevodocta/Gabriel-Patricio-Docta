import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  userService = inject(UserService);
  currentUser = this.userService.currentUser;
  
  activeSection = signal<'vincular' | 'sacar' | null>(null);

  // Form signals for linking account
  fullName = signal(this.currentUser()?.fullName ?? '');
  iban = signal(this.currentUser()?.iban ?? '');
  withdrawalPin = signal('');
  
  // Form signals for withdrawal
  withdrawAmount = signal<number | null>(null);
  withdrawPinConfirm = signal('');
  
  infoSaved = signal(false);
  withdrawMessage = signal<{ type: 'success' | 'error', text: string } | null>(null);
  showForgotPinMessage = signal(false);

  toggleSection(section: 'vincular' | 'sacar') {
    if (this.activeSection() === section) {
      this.activeSection.set(null);
    } else {
      this.activeSection.set(section);
      // Reset states when switching sections
      this.showForgotPinMessage.set(false);
      this.withdrawMessage.set(null);
    }
  }
  
  saveAccountInfo() {
    this.userService.updateUserInfo(this.fullName(), this.iban(), this.withdrawalPin());
    this.infoSaved.set(true);
    setTimeout(() => this.infoSaved.set(false), 3000);
  }

  requestWithdrawal() {
    this.withdrawMessage.set(null);
    if (!this.withdrawAmount() || !this.withdrawPinConfirm()) {
      this.withdrawMessage.set({ type: 'error', text: 'Por favor, preencha todos os campos de saque.' });
      return;
    }
    const result = this.userService.withdraw(this.withdrawAmount()!, this.withdrawPinConfirm());
    this.withdrawMessage.set({
      type: result.success ? 'success' : 'error',
      text: result.message
    });

    if (result.success) {
        this.withdrawAmount.set(null);
        this.withdrawPinConfirm.set('');
    }
    setTimeout(() => this.withdrawMessage.set(null), 5000);
  }

  forgotWithdrawalPin() {
    this.showForgotPinMessage.set(true);
  }

  logout() {
    this.userService.logout();
  }
}