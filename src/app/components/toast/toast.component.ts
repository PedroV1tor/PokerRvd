import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastMessage, ToastType } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="toast" class="toast" [class]="'toast-' + toast.type" (click)="dismiss()">
      <span class="toast-icon">{{ getIcon(toast.type) }}</span>
      <span class="toast-message">{{ toast.message }}</span>
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 1rem;
      right: 1rem;
      min-width: 280px;
      max-width: 90vw;
      padding: 1rem 1.25rem;
      border-radius: 8px;
      border: 1px solid;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease;
      cursor: pointer;
    }
    .toast-success {
      background: #0a2a0a;
      border-color: #00FF00;
      color: #00FF00;
    }
    .toast-error {
      background: #2a0a0a;
      border-color: #e74c3c;
      color: #e74c3c;
    }
    .toast-info {
      background: #0a1a2a;
      border-color: #3498db;
      color: #3498db;
    }
    .toast-warning {
      background: #2a2a0a;
      border-color: #f1c40f;
      color: #f1c40f;
    }
    .toast-icon { font-size: 1.25rem; }
    .toast-message { flex: 1; font-size: 0.95rem; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent implements OnDestroy {
  toast: ToastMessage | null = null;
  private sub?: Subscription;

  constructor(private toastService: ToastService) {
    this.sub = this.toastService.toast$.subscribe(t => this.toast = t);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  getIcon(type: ToastType): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '!';
      default: return 'i';
    }
  }

  dismiss(): void {
    this.toastService.dismiss();
  }
}
