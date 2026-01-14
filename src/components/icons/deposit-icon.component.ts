
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-deposit-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" [attr.stroke]="isActive() ? 'currentColor' : 'gray'" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositIconComponent {
  isActive = input<boolean>(false);
}
