import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  userService = inject(UserService);
  route = inject(ActivatedRoute);

  phone = '';
  email = '';
  pin = '';
  confirmPin = '';
  inviteCode = '';
  error = signal('');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['inviteCode']) {
        this.inviteCode = params['inviteCode'];
      }
    });
  }

  register() {
    this.error.set('');
    if (!this.phone || !this.pin || !this.confirmPin) {
      this.error.set('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (this.pin !== this.confirmPin) {
      this.error.set('Os PINs não coincidem.');
      return;
    }
    const result = this.userService.register(this.phone, this.pin, this.email, this.inviteCode);
    if (!result.success) {
      this.error.set(result.message);
    }
  }
}