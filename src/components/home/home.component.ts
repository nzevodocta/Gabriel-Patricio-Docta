import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

interface VipTask {
  level: string;
  cost: number;
  dailyIncome: number;
  monthlyIncome: number;
  annualIncome: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  userService = inject(UserService);
  location = inject(Location);
  currentUser = this.userService.currentUser;
  
  copyCodeStatus = signal(false);
  copyLinkStatus = signal(false);

  invitationLink = computed(() => {
    const code = this.currentUser()?.invitationCode;
    if (!code) return '';
    // The app uses hash location strategy, so the link needs a '#'
    return `${window.location.origin}${window.location.pathname}#/i/${code}`;
  });

  vipTasks: VipTask[] = [
    { level: 'Estiloso', cost: 20000, dailyIncome: 660, monthlyIncome: 19800, annualIncome: 240900 },
    { level: 'Plano Baza', cost: 30000, dailyIncome: 968, monthlyIncome: 29040, annualIncome: 353320 },
    { level: 'Nível 1', cost: 50000, dailyIncome: 1650, monthlyIncome: 49500, annualIncome: 602250 },
    { level: 'VP1', cost: 100000, dailyIncome: 3300, monthlyIncome: 99000, annualIncome: 1204500 },
    { level: 'VP2', cost: 150000, dailyIncome: 4998, monthlyIncome: 149940, annualIncome: 1824270 },
    { level: 'VP3', cost: 200000, dailyIncome: 6720, monthlyIncome: 201600, annualIncome: 2452800 },
    { level: 'VP4', cost: 250000, dailyIncome: 8400, monthlyIncome: 252000, annualIncome: 3066000 },
    { level: 'VP B1', cost: 300000, dailyIncome: 10080, monthlyIncome: 302400, annualIncome: 3679200 },
    { level: 'VP Boss', cost: 400000, dailyIncome: 13300, monthlyIncome: 399000, annualIncome: 4854500 },
    { level: 'VP Boss 2', cost: 600000, dailyIncome: 19997, monthlyIncome: 599910, annualIncome: 7298905 },
    { level: 'VP Boss 3', cost: 800000, dailyIncome: 26669, monthlyIncome: 800070, annualIncome: 9734185 },
  ];

  copyInviteCode() {
    const code = this.currentUser()?.invitationCode;
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        this.copyCodeStatus.set(true);
        setTimeout(() => this.copyCodeStatus.set(false), 2000);
      }).catch(err => {
        console.error('Falha ao copiar o código: ', err);
      });
    }
  }

  copyInviteLink() {
    const link = this.invitationLink();
    if (link) {
      navigator.clipboard.writeText(link).then(() => {
        this.copyLinkStatus.set(true);
        setTimeout(() => this.copyLinkStatus.set(false), 2000);
      }).catch(err => {
        console.error('Falha ao copiar o link: ', err);
      });
    }
  }

  shareByEmail() {
    const user = this.currentUser();
    if (!user || !user.invitationCode) return;

    const inviteCode = user.invitationCode;
    const registrationUrl = this.invitationLink();
    
    const subject = "Convite para se juntar à TRADE LUDE 80";
    const body = `Olá,\n\nEstou a convidar-te para te juntares à TRADE LUDE 80, uma plataforma de investimento. Usa o meu código de convite para te registares e ganhares um bônus!\n\nCódigo de Convite: ${inviteCode}\n\nOu clica no link abaixo para te registares:\n${registrationUrl}\n\nObrigado!`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  }

  playWelcomeSound() {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Olá, meu nome é Trade LUDE 80, seja bem vindo no meu Site");
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Seu navegador não suporta a síntese de voz.");
    }
  }

  goBack(): void {
    this.location.back();
  }
}