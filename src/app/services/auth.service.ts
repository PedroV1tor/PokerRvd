import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  LoginState 
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api/auth';
  private readonly TOKEN_KEY = 'poker_token';
  private readonly USER_KEY = 'poker_user';

  private authStateSubject = new BehaviorSubject<LoginState>({
    user: this.getUserFromStorage(),
    isAuthenticated: !!this.getToken(),
    token: this.getToken()
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // ==================== LOGIN ====================
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.user) {
            this.setSession(response.user, response.token);
            this.updateAuthState();
          }
        })
      );
  }

  // ==================== REGISTRO ====================
  
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.user) {
            this.setSession(response.user, response.token);
            this.updateAuthState();
          }
        })
      );
  }

  // ==================== LOGOUT ====================
  
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.authStateSubject.next({
      user: null,
      isAuthenticated: false,
      token: null
    });
    this.router.navigate(['/dashboard']);
  }

  // ==================== SESSION MANAGEMENT ====================
  
  private setSession(user: User, token?: string): void {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private updateAuthState(): void {
    this.authStateSubject.next({
      user: this.getUserFromStorage(),
      isAuthenticated: true,
      token: this.getToken()
    });
  }

  // ==================== GETTERS ====================
  
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.getUserFromStorage();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUserFromStorage();
    return !!token && !!user;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  isGerente(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'GERENTE' || user?.role === 'ADMIN';
  }

  // ==================== PERMISSÕES ====================
  
  hasPermissionComandas(): boolean {
    const user = this.getCurrentUser();
    // ADMIN tem acesso a tudo
    if (user?.role === 'ADMIN') return true;
    return user?.permissaoComandas || false;
  }

  hasPermissionTorneios(): boolean {
    const user = this.getCurrentUser();
    if (user?.role === 'ADMIN') return true;
    return user?.permissaoTorneios || false;
  }

  hasPermissionProdutos(): boolean {
    const user = this.getCurrentUser();
    if (user?.role === 'ADMIN') return true;
    return user?.permissaoProdutos || false;
  }

  hasPermissionFuncionarios(): boolean {
    const user = this.getCurrentUser();
    if (user?.role === 'ADMIN') return true;
    return user?.permissaoFuncionarios || false;
  }

  hasPermissionCaixas(): boolean {
    const user = this.getCurrentUser();
    if (user?.role === 'ADMIN') return true;
    return user?.permissaoCaixas || false;
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // ==================== VALIDAÇÕES ====================
  
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 6) {
      return { valid: false, message: 'A senha deve ter no mínimo 6 caracteres' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos um número' };
    }
    return { valid: true, message: 'Senha válida' };
  }
}
