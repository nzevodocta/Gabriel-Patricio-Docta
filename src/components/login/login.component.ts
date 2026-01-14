import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  userService = inject(UserService);
  router = inject(Router);

  phone = '';
  pin = '';
  error = signal('');

  login() {
    this.error.set('');
    if (!this.phone || !this.pin) {
      this.error.set('Por favor, preencha todos os campos.');
      return;
    }
    const success = this.userService.login(this.phone, this.pin);
    if (!success) {
      this.error.set('Utilizador ou PIN inválido.');
    }
  }
}