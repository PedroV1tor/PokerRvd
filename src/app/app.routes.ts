import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'cadastro',
    component: CadastroComponent
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'torneios',
    loadComponent: () => import('./pages/torneios/torneios.component').then(m => m.TorneiosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'produtos',
    loadComponent: () => import('./pages/produtos/produtos.component').then(m => m.ProdutosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'comanda/:id',
    loadComponent: () => import('./pages/comanda-detalhes/comanda-detalhes.component').then(m => m.ComandaDetalhesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'caixas',
    loadComponent: () => import('./pages/caixas/caixas.component').then(m => m.CaixasComponent),
    canActivate: [authGuard]
  },
  {
    path: 'caixa/:id',
    loadComponent: () => import('./pages/caixa-detalhes/caixa-detalhes.component').then(m => m.CaixaDetalhesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'funcionarios',
    loadComponent: () => import('./pages/funcionarios/funcionarios.component').then(m => m.FuncionariosComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
