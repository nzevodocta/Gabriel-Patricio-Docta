import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  userService = inject(UserService);
  router = inject(Router);

  step = signal<'find' | 'reset'>('find');
  identifier = signal(''); // Phone or email
  newPin = signal('');
  confirmNewPin = signal('');
  error = signal('');
  successMessage = signal('');

  findUser() {
    this.error.set('');
    if (!this.identifier()) {
      this.error.set('Por favor, insira o seu número de telefone ou email.');
      return;
    }
    const user = this.userService.findUserByPhoneOrEmail(this.identifier());
    if (user) {
      this.step.set('reset');
    } else {
      this.error.set('Nenhum utilizador encontrado com este telefone ou email.');
    }
  }

  resetPassword() {
    this.error.set('');
    this.successMessage.set('');

    if (!this.newPin() || !this.confirmNewPin()) {
      this.error.set('Por favor, preencha todos os campos.');
      return;
    }

    if (this.newPin() !== this.confirmNewPin()) {
      this.error.set('Os PINs não coincidem.');
      return;
    }

    const result = this.userService.resetPassword(this.identifier(), this.newPin());
    if (result.success) {
      this.successMessage.set(result.message + ' Você será redirecionado para o login em 3 segundos.');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    } else {
      this.error.set(result.message);
    }
  }
}
