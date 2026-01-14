
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-vip-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" [attr.stroke]="isActive() ? 'currentColor' : 'gray'" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l-3 3m5 0l-3-3m0 0l-2 2m5-2v5M7.5 7.5h9M3 17l3-3m0 0l3 3m-3-3h3m2 0h3m-3 0v-3" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VipIconComponent {
  isActive = input<boolean>(false);
}
