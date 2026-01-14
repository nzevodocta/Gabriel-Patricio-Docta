
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-invited-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './invited-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitedUsersComponent {
  userService = inject(UserService);
  invitedUsers = this.userService.currentUser()?.invitedUsers ?? [];
}
