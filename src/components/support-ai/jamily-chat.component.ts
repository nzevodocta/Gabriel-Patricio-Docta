
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Define and export message structure
export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-jamily-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jamily-chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JamilyChatComponent {
  // Inputs
  history = input.required<ChatMessage[]>();
  isLoading = input<boolean>(false);
  error = input<string | null>(null);

  // Outputs
  messageSent = output<string>();

  // Local state
  userInput = signal('');

  submitMessage() {
    const message = this.userInput().trim();
    if (message && !this.isLoading()) {
      this.messageSent.emit(message);
      this.userInput.set('');
    }
  }
}
