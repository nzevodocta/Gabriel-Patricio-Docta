import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './deposit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositComponent {
  selectedFile = signal<File | null>(null);
  uploadStatus = signal<'idle' | 'success' | 'error'>('idle');
  fileName = signal('');

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);
      this.fileName.set(file.name);
      this.uploadStatus.set('idle');
    }
  }

  submitReceipt(): void {
    if (!this.selectedFile()) {
      this.uploadStatus.set('error');
      setTimeout(() => this.uploadStatus.set('idle'), 3000);
      return;
    }
    
    // Mock upload
    this.uploadStatus.set('success');
    this.fileName.set('');
    this.selectedFile.set(null);
    // Em uma aplicação real, seria necessário limpar o valor do input de ficheiro aqui.
    
    setTimeout(() => {
      this.uploadStatus.set('idle');
    }, 3000);
  }
}