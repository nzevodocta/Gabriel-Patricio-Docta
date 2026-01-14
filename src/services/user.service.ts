import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface InvitedUser {
  phone: string;
  registrationDate: string;
  vipLevel: string;
  dailyIncome: number;
}

export interface User {
  id: number;
  phone: string;
  pin: string;
  email?: string;
  balance: number;
  invitationCode: string;
  vipLevel: string;
  dailyIncome: number;
  monthlyIncome: number;
  invitedUsers: InvitedUser[];
  fullName?: string;
  iban?: string;
  withdrawalPin?: string;
  tasksCompletedDate?: string;
}

// Plan interface for VIP levels
export interface Plan {
  name: string;
  level: string;
  cost: number;
  dailyIncome: number;
  duration?: number;
}


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USERS_KEY = 'trade_lude_users';
  private readonly CURRENT_USER_PHONE_KEY = 'trade_lude_current_user';

  private users = signal<User[]>([]);
  isAuthenticated = signal(false);
  currentUser = signal<User | null>(null);

  constructor(private router: Router) {
    // Load all users from storage
    const storedUsers = localStorage.getItem(this.USERS_KEY);
    if (storedUsers) {
      this.users.set(JSON.parse(storedUsers));
    }

    // Check for a logged-in user and restore session
    const currentUserPhone = localStorage.getItem(this.CURRENT_USER_PHONE_KEY);
    if (currentUserPhone) {
      const user = this.users().find(u => u.phone === currentUserPhone);
      if (user) {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      }
    }
  }

  private saveUsers() {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users()));
  }
  
  private updateCurrentUser(updatedUser: User) {
    this.currentUser.set(updatedUser);
    this.users.update(users => users.map(u => u.id === updatedUser.id ? updatedUser : u));
    this.saveUsers();
  }

  login(phone: string, pin: string): boolean {
    const user = this.users().find(u => u.phone === phone);
    if (user && user.pin === pin) {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        localStorage.setItem(this.CURRENT_USER_PHONE_KEY, phone);
        this.router.navigate(['/app/home']);
        return true;
    }
    return false;
  }
  
  register(phone: string, pin: string, email: string, inviteCode?: string): { success: boolean, message: string } {
    if (this.users().find(u => u.phone === phone)) {
      return { success: false, message: 'Este número de telefone já está registado.' };
    }
    if (email && this.users().find(u => u.email === email)) {
        return { success: false, message: 'Este email já está registado.' };
    }
    
    const userCount = this.users().length;
    let welcomeBonus = 1000;
    if (userCount === 0) { // First user
      welcomeBonus = 250000;
    } else if (userCount === 1) { // Second user
      welcomeBonus = 50000;
    }
    
    const newUser: User = {
      id: userCount + 1,
      phone: phone,
      pin: pin,
      email: email || undefined,
      balance: welcomeBonus,
      invitationCode: 'TRD' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      vipLevel: 'Nenhum',
      dailyIncome: 0,
      monthlyIncome: 0,
      invitedUsers: [],
    };
    
    // Handle invitation
    if (inviteCode) {
        const invitingUserIndex = this.users().findIndex(u => u.invitationCode === inviteCode);
        if (invitingUserIndex > -1) {
            const users = this.users();
            const invitingUser = users[invitingUserIndex];
            invitingUser.invitedUsers.push({
                phone: newUser.phone,
                registrationDate: new Date().toISOString().split('T')[0],
                vipLevel: newUser.vipLevel,
                dailyIncome: newUser.dailyIncome
            });
            invitingUser.balance += 4000; // Invitation bonus
            this.users.set(users);
        }
    }
    
    this.users.update(users => [...users, newUser]);
    this.saveUsers();
    
    this.login(phone, pin);
    
    return { success: true, message: 'Registo bem-sucedido!' };
  }

  logout() {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    localStorage.removeItem(this.CURRENT_USER_PHONE_KEY);
    this.router.navigate(['/login']);
  }

  updateUserInfo(fullName: string, iban: string, pin: string) {
    const user = this.currentUser();
    if (!user) return;
    
    const updatedUser = {
      ...user,
      fullName: fullName || user.fullName,
      iban: iban || user.iban,
      withdrawalPin: pin || user.withdrawalPin,
    };
    this.updateCurrentUser(updatedUser);
  }

  activateVip(plan: Plan): { success: boolean, message: string } {
    const user = this.currentUser();
    if (!user) {
        return { success: false, message: 'Usuário não encontrado.' };
    }

    if (user.balance < plan.cost) {
        return { success: false, message: 'Saldo insuficiente. Por favor, faça um depósito.' };
    }

    const updatedUser = {
        ...user,
        balance: user.balance - plan.cost,
        vipLevel: plan.level,
        dailyIncome: plan.dailyIncome,
        monthlyIncome: plan.dailyIncome * 30,
    };
    this.updateCurrentUser(updatedUser);

    return { success: true, message: `VIP ${plan.name} ativado com sucesso!` };
  }

  completeDailyTask(): { success: boolean, message: string } {
    const user = this.currentUser();
    if (!user) return { success: false, message: "Utilizador não encontrado." };

    const today = new Date().toISOString().split('T')[0];
    if (user.tasksCompletedDate === today) {
        return { success: false, message: "A tarefa diária já foi concluída hoje." };
    }
    
    if (user.dailyIncome <= 0) {
        return { success: false, message: "Nenhum plano VIP ativo para ganhar renda." };
    }

    const updatedUser: User = {
        ...user,
        balance: user.balance + user.dailyIncome,
        tasksCompletedDate: today,
    };
    
    this.updateCurrentUser(updatedUser);
    return { success: true, message: `Ganhou ${user.dailyIncome.toFixed(2)} Kz!` };
  }

  withdraw(amount: number, pin: string): { success: boolean, message: string } {
    const user = this.currentUser();
    if (!user) return { success: false, message: "Utilizador não encontrado." };
    if (!user.withdrawalPin) return { success: false, message: "Por favor, defina um PIN de saque primeiro." };
    if (user.withdrawalPin !== pin) return { success: false, message: "PIN de saque incorreto." };
    if (amount < 15) return { success: false, message: "O valor mínimo para saque é 15 Kz." };

    const fee = amount * 0.25;
    const totalDeduction = amount + fee;

    if (user.balance < totalDeduction) {
        return { success: false, message: `Saldo insuficiente. Necessário ${totalDeduction.toFixed(2)} Kz (incluindo taxa de ${fee.toFixed(2)} Kz).` };
    }

    const updatedUser: User = {
        ...user,
        balance: user.balance - totalDeduction
    };

    this.updateCurrentUser(updatedUser);
    return { success: true, message: `Saque de ${amount.toFixed(2)} Kz solicitado com sucesso. Saldo atualizado.` };
  }

  findUserByPhoneOrEmail(identifier: string): User | undefined {
    return this.users().find(u => u.phone === identifier || (u.email && u.email.toLowerCase() === identifier.toLowerCase()));
  }

  resetPassword(identifier: string, newPin: string): { success: boolean, message: string } {
    const userIndex = this.users().findIndex(u => u.phone === identifier || (u.email && u.email.toLowerCase() === identifier.toLowerCase()));
    
    if (userIndex === -1) {
      return { success: false, message: 'Utilizador não encontrado.' };
    }

    const updatedUsers = [...this.users()];
    updatedUsers[userIndex] = { ...updatedUsers[userIndex], pin: newPin };
    this.users.set(updatedUsers);

    this.saveUsers();
    
    return { success: true, message: 'Palavra-passe redefinida com sucesso.' };
  }
}