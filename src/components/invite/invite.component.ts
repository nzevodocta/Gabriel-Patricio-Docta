
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invite',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-primary-light p-4">
      <div class="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 text-center">
        <h1 class="text-2xl font-bold text-primary-dark dark:text-primary-light">A redirecionar...</h1>
        <p class="text-slate-500 dark:text-slate-400">Por favor, aguarde enquanto o preparamos para o registo.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InviteComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const inviteCode = this.route.snapshot.paramMap.get('inviteCode');
    if (inviteCode) {
      this.router.navigate(['/register'], { queryParams: { inviteCode } });
    } else {
      this.router.navigate(['/register']);
    }
  }
}
