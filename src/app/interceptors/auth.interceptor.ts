import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Envia o token em toda chamada e encerra a sessão quando a API não o aceita mais. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const autenticada = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(autenticada).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token && !req.url.endsWith('/auth/login')) {
        auth.logout();
      }
      return throwError(() => error);
    })
  );
};
