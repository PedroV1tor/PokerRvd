import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="login-container">
      <!-- Subtle background pattern -->
      <div class="login-bg-pattern">
        <div class="bg-line bg-line-1"></div>
        <div class="bg-line bg-line-2"></div>
        <div class="bg-line bg-line-3"></div>
        <div class="bg-glow"></div>
      </div>

      <div class="login-card">
        <!-- Header -->
        <div class="login-header">
          <div class="logo">
            <img src="/logo_poker-Photoroom.png" alt="RVD Poker Club" class="logo-img" />
          </div>
          <div class="header-divider"></div>
          <p class="header-subtitle">Acesse sua conta</p>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="3"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              [(ngModel)]="credentials.email"
              name="email"
              placeholder="seu@email.com"
              required
              [class.error]="emailError"
              autocomplete="email"
            />
            <span class="error-message" *ngIf="emailError">{{ emailError }}</span>
          </div>

          <div class="form-group">
            <label for="senha">
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
                <circle cx="12" cy="16" r="1"/>
              </svg>
              Senha
            </label>
            <input
              type="password"
              id="senha"
              [(ngModel)]="credentials.senha"
              name="senha"
              placeholder="••••••••"
              required
              [class.error]="senhaError"
              autocomplete="current-password"
            />
            <span class="error-message" *ngIf="senhaError">{{ senhaError }}</span>
          </div>

          <div class="error-alert" *ngIf="errorMessage">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="btn-login"
            [disabled]="loading"
            [class.loading]="loading">
            <span class="btn-content" *ngIf="!loading">
              Entrar
              <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
            <span class="btn-loading" *ngIf="loading">
              <span class="spinner-sm"></span>
              Entrando...
            </span>
          </button>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(160deg, #0d0d0d 0%, #141414 50%, #0f0f0f 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    /* ── Background pattern ── */
    .login-bg-pattern {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .bg-line {
      position: absolute;
      width: 1px;
      height: 100%;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(0, 255, 0, 0.06) 50%,
        transparent 100%
      );
    }
    .bg-line-1 { left: 20%; }
    .bg-line-2 { left: 50%; }
    .bg-line-3 { left: 80%; }

    .bg-glow {
      position: absolute;
      top: -30%;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(0, 255, 0, 0.06) 0%, transparent 70%);
      border-radius: 50%;
    }

    /* ── Card ── */
    .login-card {
      background: linear-gradient(145deg, #1c1c1c 0%, #161616 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 3rem 2.5rem;
      max-width: 420px;
      width: 100%;
      position: relative;
      z-index: 1;
      animation: cardReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow:
        0 0 0 1px rgba(0, 255, 0, 0.06),
        0 20px 50px rgba(0, 0, 0, 0.4),
        0 0 100px rgba(0, 255, 0, 0.04);
    }

    @keyframes cardReveal {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* ── Header ── */
    .login-header {
      text-align: center;
      margin-bottom: 2.25rem;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    .logo-img {
      height: 52px;
      width: auto;
      object-fit: contain;
      display: block;
      filter: brightness(1);
    }

    .header-divider {
      width: 40px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 0, 0.5), transparent);
      margin: 0 auto 1rem;
    }

    .header-subtitle {
      margin: 0;
      color: #999;
      font-size: 0.875rem;
      font-weight: 400;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    /* ── Form ── */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .form-group label {
      color: #aaa;
      font-weight: 500;
      font-size: 0.8rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: color 0.3s ease;
    }

    .field-icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }

    .form-group input {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #f0f0f0;
      padding: 0.85rem 1rem;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.25s ease;
      font-family: inherit;
    }

    .form-group input:focus {
      outline: none;
      border-color: rgba(0, 255, 0, 0.45);
      background: rgba(0, 255, 0, 0.04);
      box-shadow: 0 0 0 3px rgba(0, 255, 0, 0.08);
    }

    .form-group:focus-within label {
      color: rgba(0, 255, 0, 0.85);
    }

    .form-group input.error {
      border-color: rgba(255, 68, 68, 0.5);
      background: rgba(255, 68, 68, 0.02);
    }

    .form-group input::placeholder {
      color: #666;
      font-weight: 300;
    }

    /* ── Error messages ── */
    .error-message {
      color: #e74c3c;
      font-size: 0.8rem;
      font-weight: 400;
    }

    .error-alert {
      background: rgba(231, 76, 60, 0.06);
      border: 1px solid rgba(231, 76, 60, 0.2);
      color: #e74c3c;
      padding: 0.85rem 1rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.85rem;
      font-weight: 400;
      line-height: 1.4;
    }

    .alert-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    /* ── Button ── */
    .btn-login {
      background: linear-gradient(135deg, #00e600 0%, #00cc00 100%);
      color: #000;
      border: none;
      padding: 0.9rem 1.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.25s ease;
      margin-top: 0.75rem;
      letter-spacing: 0.02em;
      position: relative;
      overflow: hidden;
    }

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-arrow {
      width: 16px;
      height: 16px;
      transition: transform 0.25s ease;
    }

    .btn-login:hover:not(:disabled) {
      background: linear-gradient(135deg, #00ff00 0%, #00dd00 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 255, 0, 0.2);
    }

    .btn-login:hover:not(:disabled) .btn-arrow {
      transform: translateX(3px);
    }

    .btn-login:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 255, 0, 0.15);
    }

    .btn-login:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(0, 0, 0, 0.2);
      border-top-color: #000;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .login-container {
        padding: 1.5rem;
      }

      .login-card {
        padding: 2.25rem 1.75rem;
      }
    }

    @media (max-width: 400px) {
      .login-card {
        padding: 2rem 1.25rem;
        border-radius: 12px;
      }
    }
  `]
})
export class LoginComponent {
    credentials: LoginRequest = {
        email: '',
        senha: ''
    };

    rememberMe = false;
    loading = false;
    errorMessage = '';
    emailError = '';
    senhaError = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onSubmit(): void {
        this.errorMessage = '';
        this.emailError = '';
        this.senhaError = '';

        // Validações
        if (!this.credentials.email) {
            this.emailError = 'E-mail é obrigatório';
            return;
        }

        if (!this.authService.validateEmail(this.credentials.email)) {
            this.emailError = 'E-mail inválido';
            return;
        }

        if (!this.credentials.senha) {
            this.senhaError = 'Senha é obrigatória';
            return;
        }

        if (this.credentials.senha.length < 6) {
            this.senhaError = 'Senha deve ter no mínimo 6 caracteres';
            return;
        }

        // Login
        this.loading = true;
        this.authService.login(this.credentials).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.loading = false;
                const body = error.error;
                if (body && typeof body === 'object' && body.message) {
                    this.errorMessage = body.message;
                } else if (typeof body === 'string' && body) {
                    this.errorMessage = body;
                } else {
                    this.errorMessage = error.status === 0
                        ? 'Não foi possível conectar ao servidor. Verifique se a API está rodando.'
                        : 'Erro ao fazer login. Verifique suas credenciais.';
                }
            }
        });
    }
}
