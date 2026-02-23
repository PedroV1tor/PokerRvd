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
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <img src="/logo_poker-Photoroom.png" alt="RVD Poker Club" class="logo-img" />
          </div>
          <h2>Bem-vindo de volta!</h2>
          <p>Entre com suas credenciais para acessar o sistema</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">
              <span class="icon">📧</span>
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
            />
            <span class="error-message" *ngIf="emailError">{{ emailError }}</span>
          </div>

          <div class="form-group">
            <label for="senha">
              <span class="icon">🔒</span>
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
            />
            <span class="error-message" *ngIf="senhaError">{{ senhaError }}</span>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
              <span>Lembrar-me</span>
            </label>
            <a href="#" class="forgot-password">Esqueceu a senha?</a>
          </div>

          <div class="error-alert" *ngIf="errorMessage">
            <span class="icon">⚠️</span>
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="btn-login"
            [disabled]="loading"
            [class.loading]="loading">
            <span *ngIf="!loading">Entrar</span>
            <span *ngIf="loading">Entrando...</span>
          </button>
        </form>
      </div>

      <div class="login-background">
        <div class="poker-card card-1">♠</div>
        <div class="poker-card card-2">♥</div>
        <div class="poker-card card-3">♦</div>
        <div class="poker-card card-4">♣</div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .poker-card {
      position: absolute;
      font-size: 10rem;
      color: rgba(0, 255, 0, 0.05);
      animation: float 20s infinite;
    }

    .card-1 { top: 10%; left: 10%; animation-delay: 0s; }
    .card-2 { top: 20%; right: 15%; animation-delay: 5s; }
    .card-3 { bottom: 20%; left: 15%; animation-delay: 10s; }
    .card-4 { bottom: 10%; right: 10%; animation-delay: 15s; }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-50px) rotate(10deg); }
    }

    .login-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
      border: 2px solid #00FF00;
      border-radius: 20px;
      padding: 3rem;
      max-width: 450px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 255, 0, 0.3);
      position: relative;
      z-index: 1;
      animation: slideUp 0.5s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      margin-bottom: 1.5rem;
    }

    .logo-img {
      height: 56px;
      width: auto;
      object-fit: contain;
      display: block;
    }

    .login-header h2 {
      margin: 0 0 0.5rem 0;
      color: #fff;
      font-size: 1.8rem;
    }

    .login-header p {
      margin: 0;
      color: #999;
      font-size: 0.95rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      color: #00FF00;
      font-weight: bold;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-group .icon {
      font-size: 1.2rem;
    }

    .form-group input {
      background-color: #000;
      border: 2px solid #333;
      color: #fff;
      padding: 0.9rem 1.2rem;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #00FF00;
      box-shadow: 0 0 0 3px rgba(0, 255, 0, 0.1);
    }

    .form-group input.error {
      border-color: #ff4444;
    }

    .form-group input::placeholder {
      color: #666;
    }

    .error-message {
      color: #ff4444;
      font-size: 0.85rem;
      margin-top: -0.25rem;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #999;
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
      cursor: pointer;
    }

    .forgot-password {
      color: #00FF00;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .forgot-password:hover {
      color: #00DD00;
      text-decoration: underline;
    }

    .error-alert {
      background-color: rgba(255, 68, 68, 0.1);
      border: 2px solid #ff4444;
      color: #ff4444;
      padding: 1rem;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
    }

    .error-alert .icon {
      font-size: 1.5rem;
    }

    .btn-login {
      background-color: #00FF00;
      color: #000;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: bold;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 0.5rem;
    }

    .btn-login:hover:not(:disabled) {
      background-color: #00DD00;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 255, 0, 0.4);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-login.loading {
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    @media (max-width: 768px) {
      .login-card {
        padding: 2rem;
      }

      .poker-card {
        font-size: 6rem;
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
  ) {}

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
