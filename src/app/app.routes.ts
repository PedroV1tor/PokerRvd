import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'torneios',
    loadComponent: () => import('./pages/torneios/torneios.component').then(m => m.TorneiosComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'torneios' }
  },
  {
    path: 'produtos',
    loadComponent: () => import('./pages/produtos/produtos.component').then(m => m.ProdutosComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'produtos' }
  },
  {
    path: 'comanda/:id',
    loadComponent: () => import('./pages/comanda-detalhes/comanda-detalhes.component').then(m => m.ComandaDetalhesComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'comandas' }
  },
  {
    path: 'caixas',
    loadComponent: () => import('./pages/caixas/caixas.component').then(m => m.CaixasComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'caixas' }
  },
  {
    path: 'caixa/:id',
    loadComponent: () => import('./pages/caixa-detalhes/caixa-detalhes.component').then(m => m.CaixaDetalhesComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'caixas' }
  },
  {
    path: 'conferencia',
    loadComponent: () => import('./pages/conferencia/conferencia.component').then(m => m.ConferenciaComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'conferencia' }
  },
  {
    path: 'conteudo',
    loadComponent: () => import('./pages/conteudo/conteudo.component').then(m => m.ConteudoComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'conteudo' }
  },
  {
    path: 'funcionarios',
    loadComponent: () => import('./pages/funcionarios/funcionarios.component').then(m => m.FuncionariosComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permission: 'funcionarios' }
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
