import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmOptions {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  resolve: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private readonly confirmSubject = new BehaviorSubject<ConfirmOptions | null>(null);
  public readonly confirm$ = this.confirmSubject.asObservable();

  confirm(options: {
    message: string;
    title?: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.confirmSubject.next({
        message: options.message,
        title: options.title ?? 'Confirmação',
        confirmText: options.confirmText ?? 'Confirmar',
        cancelText: options.cancelText ?? 'Cancelar',
        resolve
      });
    });
  }

  close(confirmed: boolean): void {
    const current = this.confirmSubject.value;
    if (current) {
      current.resolve(confirmed);
      this.confirmSubject.next(null);
    }
  }
}
