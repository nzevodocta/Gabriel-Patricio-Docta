import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleGenAI } from '@google/genai';
import { UserService } from '../../services/user.service';
import { JamilyChatComponent, ChatMessage } from './jamily-chat.component';

@Component({
  selector: 'app-support-ai',
  standalone: true,
  imports: [CommonModule, JamilyChatComponent],
  templateUrl: './support-ai.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportAiComponent {
  userService = inject(UserService);
  currentUser = this.userService.currentUser;

  // State signals
  chatHistory = signal<ChatMessage[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  private ai: GoogleGenAI;

  constructor() {
    // IMPORTANT: API_KEY is read from environment variables
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    // Initial message from Jamily
    this.chatHistory.set([{
      sender: 'ai',
      text: `Olá, ${this.currentUser()?.fullName || 'Utilizador'}! Eu sou a JAMILY, a sua assistente de IA. Como posso ajudar-te hoje sobre a plataforma TRADE LUDE 80?`
    }]);
  }

  async sendMessage(messageText: string) {
    if (this.isLoading()) {
      return;
    }

    // Add user message to history
    this.chatHistory.update(history => [...history, { sender: 'user', text: messageText }]);
    this.isLoading.set(true);
    this.error.set(null);

    try {
      // Use system instruction to set the AI's persona and context
      const systemInstruction = `És a JAMILY, uma assistente de IA amigável e prestável para o site de investimentos TRADE LUDE 80. O teu objetivo é responder a perguntas sobre a plataforma, como planos VIP, depósitos, saques e tarefas. Responde sempre em Português (Portugal). Mantém as respostas concisas e fáceis de entender.`;
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: messageText,
        config: {
          systemInstruction: systemInstruction,
        }
      });
      
      const aiResponseText = response.text;

      // Add AI response to history
      this.chatHistory.update(history => [...history, { sender: 'ai', text: aiResponseText }]);

    } catch (e) {
      console.error('Gemini API error:', e);
      const errorMessage = 'Desculpe, ocorreu um erro ao comunicar com a IA. Por favor, tente novamente mais tarde.';
      this.error.set(errorMessage);
      this.chatHistory.update(history => [...history, { sender: 'ai', text: errorMessage }]);
    } finally {
      this.isLoading.set(false);
    }
  }
}