import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <span class="logo-text">R♦D</span>
          <span class="logo-subtitle">POKER CLUB</span>
        </div>
        
        <div class="nav-menu">
          <button 
            class="nav-item" 
            [class.active]="activeMenu === 'comandas'"
            (click)="setActiveMenu('comandas')">
            Comandas
          </button>
          <button 
            class="nav-item"
            [class.active]="activeMenu === 'torneios'"
            (click)="setActiveMenu('torneios')">
            Torneios
          </button>
          <button 
            class="nav-item"
            [class.active]="activeMenu === 'produtos'"
            (click)="setActiveMenu('produtos')">
            Produtos
          </button>
          <button 
            class="nav-item"
            [class.active]="activeMenu === 'caixas'"
            (click)="setActiveMenu('caixas')">
            Caixas
          </button>
        </div>

        <div class="user-menu">
          <div class="user-info" (click)="toggleUserMenu()">
            <div class="user-avatar">{{ getUserInitials() }}</div>
            <span class="user-name">{{ currentUser?.nome || 'Usuário' }}</span>
            <span class="dropdown-arrow">▼</span>
          </div>

          <div class="user-dropdown" *ngIf="showUserMenu">
            <div class="user-dropdown-header">
              <strong>{{ currentUser?.nome }}</strong>
              <span class="user-role">{{ currentUser?.role }}</span>
            </div>
            <div class="user-dropdown-divider"></div>
            <button class="dropdown-item" (click)="onLogout()">
              <span class="icon">🚪</span>
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #000;
      padding: 1rem 2rem;
      border-bottom: 2px solid #00FF00;
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 2px solid #00FF00;
      border-radius: 8px;
    }

    .logo-text {
      font-size: 1.8rem;
      font-weight: bold;
      color: #00FF00;
      letter-spacing: 2px;
    }

    .logo-subtitle {
      font-size: 0.9rem;
      color: #00FF00;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .nav-menu {
      display: flex;
      gap: 1rem;
      flex: 1;
    }

    .nav-item {
      background: none;
      border: none;
      color: #fff;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .nav-item:hover {
      background-color: rgba(0, 255, 0, 0.1);
      color: #00FF00;
    }

    .nav-item.active {
      background-color: #00FF00;
      color: #000;
    }

    .user-menu {
      position: relative;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      border: 2px solid #333;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .user-info:hover {
      border-color: #00FF00;
      background-color: rgba(0, 255, 0, 0.1);
    }

    .user-avatar {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00FF00 0%, #00AA00 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.9rem;
      color: #000;
    }

    .user-name {
      color: #fff;
      font-weight: 500;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-arrow {
      color: #00FF00;
      font-size: 0.7rem;
      transition: transform 0.3s ease;
    }

    .user-info:hover .dropdown-arrow {
      transform: rotate(180deg);
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
      border: 2px solid #00FF00;
      border-radius: 12px;
      min-width: 220px;
      box-shadow: 0 8px 24px rgba(0, 255, 0, 0.3);
      z-index: 1000;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .user-dropdown-header {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .user-dropdown-header strong {
      color: #fff;
      font-size: 1rem;
    }

    .user-role {
      color: #00FF00;
      font-size: 0.85rem;
      text-transform: uppercase;
    }

    .user-dropdown-divider {
      height: 1px;
      background-color: #333;
    }

    .dropdown-item {
      width: 100%;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      color: #fff;
      text-align: left;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.95rem;
    }

    .dropdown-item:hover {
      background-color: rgba(255, 68, 68, 0.1);
      color: #ff4444;
    }

    .dropdown-item .icon {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .navbar-container {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-menu {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }

      .nav-item {
        flex: 1;
        min-width: 120px;
      }

      .user-name {
        display: none;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  activeMenu = 'comandas';
  currentUser: User | null = null;
  showUserMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.authState$.subscribe(state => {
      this.currentUser = state.user;
    });
  }

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
    
    // Navegar para a página correspondente
    switch (menu) {
      case 'comandas':
        this.router.navigate(['/dashboard']);
        break;
      case 'torneios':
        this.router.navigate(['/torneios']);
        break;
      case 'produtos':
        this.router.navigate(['/produtos']);
        break;
      case 'caixas':
        this.router.navigate(['/caixas']);
        break;
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  getUserInitials(): string {
    if (!this.currentUser?.nome) return 'U';
    return this.currentUser.nome
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  onLogout() {
    this.showUserMenu = false; // Fecha o menu
    if (confirm('Deseja realmente sair?')) {
      this.authService.logout(); // Já redireciona para /login
    }
  }
}
