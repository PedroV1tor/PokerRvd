import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="cadastro-container">
      <div class="cadastro-card">
        <div class="cadastro-header">
          <div class="logo">
            <img src="/logo_poker-Photoroom.png" alt="RVD Poker Club" class="logo-img" />
          </div>
          <h2>Criar Nova Conta</h2>
          <p>Preencha os dados abaixo para se cadastrar</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="cadastro-form">
          <div class="form-group">
            <label for="nome">
              <span class="icon">👤</span>
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              [(ngModel)]="userData.nome"
              name="nome"
              placeholder="Seu nome completo"
              required
              [class.error]="nomeError"
            />
            <span class="error-message" *ngIf="nomeError">{{ nomeError }}</span>
          </div>

          <div class="form-group">
            <label for="email">
              <span class="icon">📧</span>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              [(ngModel)]="userData.email"
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
              [(ngModel)]="userData.senha"
              name="senha"
              placeholder="••••••••"
              required
              [class.error]="senhaError"
              (input)="checkPasswordStrength()"
            />
            <span class="error-message" *ngIf="senhaError">{{ senhaError }}</span>
            
            <!-- Indicador de força da senha -->
            <div class="password-strength" *ngIf="userData.senha">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  [style.width.%]="passwordStrength"
                  [class.weak]="passwordStrength < 50"
                  [class.medium]="passwordStrength >= 50 && passwordStrength < 80"
                  [class.strong]="passwordStrength >= 80">
                </div>
              </div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmarSenha">
              <span class="icon">🔑</span>
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmarSenha"
              [(ngModel)]="userData.confirmarSenha"
              name="confirmarSenha"
              placeholder="••••••••"
              required
              [class.error]="confirmarSenhaError"
            />
            <span class="error-message" *ngIf="confirmarSenhaError">{{ confirmarSenhaError }}</span>
          </div>

          <div class="form-check">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="acceptTerms" 
                name="acceptTerms"
                required
              />
              <span>
                Eu concordo com os 
                <a href="#" class="link-terms">Termos de Uso</a> e 
                <a href="#" class="link-terms">Política de Privacidade</a>
              </span>
            </label>
            <span class="error-message" *ngIf="termsError">{{ termsError }}</span>
          </div>

          <div class="error-alert" *ngIf="errorMessage">
            <span class="icon">⚠️</span>
            {{ errorMessage }}
          </div>

          <div class="success-alert" *ngIf="successMessage">
            <span class="icon">✅</span>
            {{ successMessage }}
          </div>

          <button 
            type="submit" 
            class="btn-cadastro"
            [disabled]="loading"
            [class.loading]="loading">
            <span *ngIf="!loading">Criar Conta</span>
            <span *ngIf="loading">Criando conta...</span>
          </button>
        </form>

        <div class="cadastro-footer">
          <p>
            Já tem uma conta?
            <a routerLink="/login" class="link-login">Faça login aqui</a>
          </p>
        </div>
      </div>

      <div class="cadastro-background">
        <div class="poker-chip chip-1">💰</div>
        <div class="poker-chip chip-2">🎰</div>
        <div class="poker-chip chip-3">🃏</div>
      </div>
    </div>
  `,
  styles: [`
    .cadastro-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .cadastro-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .poker-chip {
      position: absolute;
      font-size: 8rem;
      opacity: 0.03;
      animation: rotate 30s infinite linear;
    }

    .chip-1 { top: 15%; left: 10%; }
    .chip-2 { top: 60%; right: 15%; animation-delay: 10s; }
    .chip-3 { bottom: 20%; left: 20%; animation-delay: 20s; }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .cadastro-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
      border: 2px solid #00FF00;
      border-radius: 20px;
      padding: 3rem;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 255, 0, 0.3);
      position: relative;
      z-index: 1;
      animation: slideUp 0.5s ease;
      max-height: 90vh;
      overflow-y: auto;
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

    .cadastro-header {
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

    .cadastro-header h2 {
      margin: 0 0 0.5rem 0;
      color: #fff;
      font-size: 1.8rem;
    }

    .cadastro-header p {
      margin: 0;
      color: #999;
      font-size: 0.95rem;
    }

    .cadastro-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
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
      padding: 0.85rem 1.1rem;
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
    }

    .password-strength {
      margin-top: 0.5rem;
    }

    .strength-bar {
      height: 6px;
      background-color: #333;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;
    }

    .strength-fill.weak {
      background-color: #ff4444;
    }

    .strength-fill.medium {
      background-color: #FFD700;
    }

    .strength-fill.strong {
      background-color: #00FF00;
    }

    .strength-text {
      font-size: 0.85rem;
      color: #999;
    }

    .form-check {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      color: #999;
      cursor: pointer;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .checkbox-label input[type="checkbox"] {
      cursor: pointer;
      margin-top: 0.25rem;
    }

    .link-terms {
      color: #00FF00;
      text-decoration: none;
    }

    .link-terms:hover {
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

    .success-alert {
      background-color: rgba(0, 255, 0, 0.1);
      border: 2px solid #00FF00;
      color: #00FF00;
      padding: 1rem;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
    }

    .error-alert .icon,
    .success-alert .icon {
      font-size: 1.5rem;
    }

    .btn-cadastro {
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

    .btn-cadastro:hover:not(:disabled) {
      background-color: #00DD00;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 255, 0, 0.4);
    }

    .btn-cadastro:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-cadastro.loading {
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .cadastro-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #333;
    }

    .cadastro-footer p {
      margin: 0;
      color: #999;
      font-size: 0.95rem;
    }

    .link-login {
      color: #00FF00;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s ease;
    }

    .link-login:hover {
      color: #00DD00;
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .cadastro-card {
        padding: 2rem;
      }
    }
  `]
})
export class CadastroComponent {
  userData: RegisterRequest = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  };

  acceptTerms = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  nomeError = '';
  emailError = '';
  senhaError = '';
  confirmarSenhaError = '';
  termsError = '';

  passwordStrength = 0;
  passwordStrengthText = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  checkPasswordStrength(): void {
    const senha = this.userData.senha;
    let strength = 0;

    if (senha.length >= 6) strength += 20;
    if (senha.length >= 8) strength += 20;
    if (/[a-z]/.test(senha)) strength += 20;
    if (/[A-Z]/.test(senha)) strength += 20;
    if (/[0-9]/.test(senha)) strength += 10;
    if (/[^a-zA-Z0-9]/.test(senha)) strength += 10;

    this.passwordStrength = strength;

    if (strength < 40) {
      this.passwordStrengthText = 'Senha fraca';
    } else if (strength < 70) {
      this.passwordStrengthText = 'Senha média';
    } else {
      this.passwordStrengthText = 'Senha forte';
    }
  }

  onSubmit(): void {
    this.clearErrors();

    // Validações
    if (!this.userData.nome || this.userData.nome.trim().length < 3) {
      this.nomeError = 'Nome deve ter no mínimo 3 caracteres';
      return;
    }

    if (!this.userData.email) {
      this.emailError = 'E-mail é obrigatório';
      return;
    }

    if (!this.authService.validateEmail(this.userData.email)) {
      this.emailError = 'E-mail inválido';
      return;
    }

    const passwordValidation = this.authService.validatePassword(this.userData.senha);
    if (!passwordValidation.valid) {
      this.senhaError = passwordValidation.message;
      return;
    }

    if (this.userData.senha !== this.userData.confirmarSenha) {
      this.confirmarSenhaError = 'As senhas não coincidem';
      return;
    }

    if (!this.acceptTerms) {
      this.termsError = 'Você deve aceitar os termos de uso';
      return;
    }

    // Cadastro
    this.loading = true;
    this.authService.register(this.userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Cadastro realizado com sucesso! Redirecionando...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erro ao criar conta. Tente novamente.';
        console.error('Erro no cadastro:', error);
      }
    });
  }

  private clearErrors(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.nomeError = '';
    this.emailError = '';
    this.senhaError = '';
    this.confirmarSenhaError = '';
    this.termsError = '';
  }
}
