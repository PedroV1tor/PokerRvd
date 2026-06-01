import { Component, OnInit, HostListener } from '@angular/core';
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
        <button type="button" class="logo" (click)="irParaComandas()" aria-label="Voltar para Comandas">
          <img src="/logo_poker-Photoroom.png" alt="RVD Poker Club" class="logo-img" />
        </button>

        <button 
          class="mobile-menu-toggle" 
          (click)="toggleMobileMenu()"
          [class.active]="showMobileMenu"
          aria-label="Toggle menu">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        
        <div class="nav-menu" [class.mobile-open]="showMobileMenu">
          <button 
            *ngIf="hasPermissionComandas()"
            class="nav-item" 
            [class.active]="activeMenu === 'comandas'"
            (click)="setActiveMenu('comandas')">
            Comandas
          </button>
          <button 
            *ngIf="hasPermissionTorneios()"
            class="nav-item"
            [class.active]="activeMenu === 'torneios'"
            (click)="setActiveMenu('torneios')">
            Torneios
          </button>
          <button 
            *ngIf="hasPermissionProdutos()"
            class="nav-item"
            [class.active]="activeMenu === 'produtos'"
            (click)="setActiveMenu('produtos')">
            Produtos
          </button>
          <button 
            *ngIf="hasPermissionFuncionarios()"
            class="nav-item"
            [class.active]="activeMenu === 'funcionarios'"
            (click)="setActiveMenu('funcionarios')">
            Funcionários
          </button>
          <button 
            *ngIf="hasPermissionCaixas()"
            class="nav-item"
            [class.active]="activeMenu === 'caixas'"
            (click)="setActiveMenu('caixas')">
            Caixas
          </button>
          <button 
            *ngIf="hasPermissionConferencia()"
            class="nav-item"
            [class.active]="activeMenu === 'conferencia'"
            (click)="setActiveMenu('conferencia')">
            Conferência
          </button>
        </div>

        <div class="user-menu">
          <div class="user-info" (click)="toggleUserMenu()">
            <div class="user-avatar">{{ getUserInitials() }}</div>
            <span class="user-name">{{ currentUser?.nome || 'Usuário' }}</span>
            <span class="dropdown-arrow">▼</span>
            <!-- Versão simples de logout para mobile: só a palavra "Sair" ao lado do avatar -->
            <button 
              *ngIf="showUserMenu"
              type="button"
              class="user-logout-inline"
              (click)="abrirModalSair(); $event.stopPropagation()">
              Sair
            </button>
          </div>

          <div class="user-dropdown" *ngIf="showUserMenu">
            <div class="user-dropdown-header">
              <strong>{{ currentUser?.nome }}</strong>
              <span class="user-role">{{ currentUser?.role }}</span>
            </div>
            <div class="user-dropdown-divider"></div>
            <button class="dropdown-item" (click)="abrirModalSair()">
              <span class="icon">🚪</span>
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Modal confirmar saída -->
    <div class="logout-modal-overlay" *ngIf="showLogoutModal" (click)="fecharModalSair()">
      <div class="logout-modal" (click)="$event.stopPropagation()">
        <p class="logout-modal-texto">Deseja realmente sair?</p>
        <div class="logout-modal-botoes">
          <button type="button" class="logout-btn-cancelar" (click)="fecharModalSair()">Cancelar</button>
          <button type="button" class="logout-btn-sair" (click)="confirmarLogout()">Sair</button>
        </div>
      </div>
    </div>
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
      background: transparent;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }

    .logo:hover {
      opacity: 0.9;
    }

    .logo-img {
      height: 60px;
      width: auto;
      object-fit: contain;
      display: block;
    }

    .mobile-menu-toggle {
      display: none;
      background: transparent;
      border: 2px solid #00FF00;
      border-radius: 8px;
      padding: 0.5rem;
      cursor: pointer;
      width: 44px;
      height: 44px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      transition: all 0.3s ease;
      z-index: 1001;
    }

    .mobile-menu-toggle:hover {
      background-color: rgba(0, 255, 0, 0.1);
    }

    .mobile-menu-toggle.active {
      background-color: rgba(0, 255, 0, 0.2);
    }

    .hamburger-line {
      width: 24px;
      height: 3px;
      background-color: #00FF00;
      border-radius: 2px;
      transition: all 0.3s ease;
      display: block;
    }

    .mobile-menu-toggle.active .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translate(7px, 7px);
    }

    .mobile-menu-toggle.active .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-toggle.active .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
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
        max-height: 0;
      }
      to {
        opacity: 1;
        transform: translateY(0);
        max-height: 500px;
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

    /* Botão de logout inline (usado em mobile) */
    .user-logout-inline {
      display: none;
      background: none;
      border: none;
      color: #ff4444;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 999px;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .user-logout-inline:hover {
      background-color: rgba(255, 68, 68, 0.1);
      color: #ff6666;
    }

    @media (max-width: 992px) {
      .navbar {
        padding: 0.875rem;
        overflow-x: hidden;
      }

      .navbar-container {
        max-width: 100%;
        overflow-x: hidden;
        flex-direction: column;
        gap: 0;
        position: relative;
      }

      .logo {
        width: 100%;
        margin-bottom: 0.75rem;
      }

      .mobile-menu-toggle {
        display: flex;
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
      }

      .user-menu {
        position: absolute;
        right: 3.5rem;
        top: 0.5rem;
      }

      .nav-menu {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 0.75rem 0.5rem;
      }

      .navbar-container {
        gap: 0;
        max-width: 100%;
      }

      .logo {
        width: auto;
        margin-bottom: 0.75rem;
        margin-right: auto;
      }

      .mobile-menu-toggle {
        right: 0.4rem;
        top: 0.4rem;
      }

      .user-menu {
        right: 3rem;
        top: 0.4rem;
      }

      .logo {
        padding: 0.3rem 0.65rem;
      }

      .logo-img {
        height: 40px;
      }

      .mobile-menu-toggle {
        width: 40px;
        height: 40px;
        padding: 0.4rem;
      }

      .hamburger-line {
        width: 22px;
        height: 2.5px;
      }

      .nav-menu {
        display: none;
        flex-direction: column;
        width: 100%;
        gap: 0.5rem;
        padding-top: 0;
        border-top: none;
        margin-top: 0;
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;
      }

      .nav-menu.mobile-open {
        display: flex;
        max-height: 500px;
        padding-top: 1rem;
        margin-top: 0.75rem;
        border-top: 2px solid rgba(0, 255, 0, 0.2);
        opacity: 1;
        animation: slideDown 0.3s ease;
      }

      .nav-item {
        width: 100%;
        padding: 0.875rem 1rem;
        font-size: 0.95rem;
        text-align: left;
        border-radius: 8px;
        justify-content: flex-start;
      }

      .user-name {
        display: none;
      }

      .user-info {
        padding: 0.4rem 0.8rem;
      }
    }

    @media (max-width: 480px) {
      .navbar {
        padding: 0.65rem 0.4rem;
      }

      .logo {
        padding: 0.25rem 0.5rem;
        margin-bottom: 0.65rem;
      }

      .mobile-menu-toggle {
        right: 0.3rem;
        top: 0.3rem;
      }

      .user-menu {
        right: 2.8rem;
        top: 0.3rem;
      }

      .logo-img {
        height: 36px;
      }

      .mobile-menu-toggle {
        width: 38px;
        height: 38px;
        padding: 0.35rem;
      }

      .hamburger-line {
        width: 20px;
        height: 2px;
      }

      .nav-menu {
        gap: 0.4rem;
      }

      .nav-item {
        padding: 0.8rem 1rem;
        font-size: 0.9rem;
      }

      .user-avatar {
        width: 30px;
        height: 30px;
        font-size: 0.8rem;
      }

      .user-info {
        padding: 0.35rem 0.7rem;
      }

      /* Em telas pequenas, esconder dropdown flutuante e usar só o botão "Sair" inline */
      .user-dropdown {
        display: none;
      }

      .user-logout-inline {
        display: inline-flex;
        align-items: center;
      }

      .user-dropdown {
        min-width: 180px;
        max-width: calc(100vw - 1rem);
      }
    }

    .logout-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .logout-modal {
      background: #1a1a1a;
      border: 1px solid #00FF00;
      border-radius: 8px;
      padding: 1.5rem 2rem;
      min-width: 280px;
      text-align: center;
    }

    .logout-modal-texto {
      margin: 0 0 1.5rem 0;
      color: #fff;
      font-size: 1.1rem;
    }

    .logout-modal-botoes {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .logout-btn-cancelar,
    .logout-btn-sair {
      padding: 0.6rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .logout-btn-cancelar {
      background: transparent;
      color: #999;
      border: 1px solid #333;
    }

    .logout-btn-cancelar:hover {
      color: #fff;
      border-color: #555;
    }

    .logout-btn-sair {
      background: #00FF00;
      color: #0a0a0a;
      border: 1px solid #00FF00;
    }

    .logout-btn-sair:hover {
      opacity: 0.9;
    }
  `]
})
export class NavbarComponent implements OnInit {
  activeMenu = 'comandas';
  currentUser: User | null = null;
  showUserMenu = false;
  showMobileMenu = false;
  showLogoutModal = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.authState$.subscribe(state => {
      this.currentUser = state.user;
    });
    this.detectarMenuAtivo();
  }

  detectarMenuAtivo() {
    const url = this.router.url || '';
    if (url.includes('/torneios')) {
      this.activeMenu = 'torneios';
    } else if (url.includes('/produtos')) {
      this.activeMenu = 'produtos';
    } else if (url.includes('/funcionarios')) {
      this.activeMenu = 'funcionarios';
    } else if (url.includes('/caixas') || url.includes('/caixa/')) {
      this.activeMenu = 'caixas';
    } else if (url.includes('/conferencia')) {
      this.activeMenu = 'conferencia';
    } else {
      this.activeMenu = 'comandas';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const navbar = target.closest('.navbar');
    const toggleButton = target.closest('.mobile-menu-toggle');
    
    // Se clicou fora da navbar e o menu está aberto, fecha
    if (!navbar && this.showMobileMenu) {
      this.showMobileMenu = false;
    }
    
    // Se clicou no botão toggle, não faz nada (o toggle já trata)
    if (toggleButton) {
      return;
    }
  }

  irParaComandas(): void {
    this.setActiveMenu('comandas');
  }

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
    this.showMobileMenu = false; // Fecha o menu mobile ao clicar
    
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
      case 'funcionarios':
        this.router.navigate(['/funcionarios']);
        break;
      case 'caixas':
        this.router.navigate(['/caixas']);
        break;
      case 'conferencia':
        this.router.navigate(['/conferencia']);
        break;
    }
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    // Fecha o menu mobile quando abre o menu do usuário
    if (this.showUserMenu) {
      this.showMobileMenu = false;
    }
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

  abrirModalSair(): void {
    this.showUserMenu = false;
    this.showLogoutModal = true;
  }

  fecharModalSair(): void {
    this.showLogoutModal = false;
  }

  confirmarLogout(): void {
    this.showLogoutModal = false;
    this.authService.logout();
  }

  // ==================== PERMISSÕES ====================
  
  hasPermissionComandas(): boolean {
    return this.authService.hasPermissionComandas();
  }

  hasPermissionTorneios(): boolean {
    return this.authService.hasPermissionTorneios();
  }

  hasPermissionProdutos(): boolean {
    return this.authService.hasPermissionProdutos();
  }

  hasPermissionFuncionarios(): boolean {
    return this.authService.hasPermissionFuncionarios();
  }

  hasPermissionCaixas(): boolean {
    return this.authService.hasPermissionCaixas();
  }

  hasPermissionConferencia(): boolean {
    return this.authService.hasPermissionConferencia();
  }
}
