import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  // Fix: Explicitly typed the injected Location service to resolve the type inference issue.
  private readonly location: Location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
