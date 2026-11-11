import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  // Pega a permissão necessária da rota
  const requiredPermission = route.data['permission'] as string;

  // Se não especificou permissão, libera
  if (!requiredPermission) {
    return true;
  }

  // Verifica a permissão
  let hasPermission = false;

  switch (requiredPermission) {
    case 'comandas':
      hasPermission = authService.hasPermissionComandas();
      break;
    case 'torneios':
      hasPermission = authService.hasPermissionTorneios();
      break;
    case 'produtos':
      hasPermission = authService.hasPermissionProdutos();
      break;
    case 'funcionarios':
      hasPermission = authService.hasPermissionFuncionarios();
      break;
    case 'caixas':
      hasPermission = authService.hasPermissionCaixas();
      break;
    case 'conferencia':
      hasPermission = authService.hasPermissionConferencia();
      break;
    case 'conteudo':
      hasPermission = authService.hasPermissionConteudo();
      break;
    case 'comandaDetalhes':
      hasPermission = authService.pode('permissaoVerComanda');
      break;
    case 'caixaDetalhes':
      hasPermission = authService.pode('permissaoVerCaixa');
      break;
  }

  if (!hasPermission) {
    toast.error('Você não tem permissão para acessar esta página');
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
