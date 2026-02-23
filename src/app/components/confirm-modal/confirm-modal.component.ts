import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ConfirmService, ConfirmOptions } from '../../services/confirm.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm-overlay" *ngIf="options" (click)="cancel()">
      <div class="confirm-modal" (click)="$event.stopPropagation()">
        <h3 class="confirm-title">{{ options.title }}</h3>
        <p class="confirm-message">{{ options.message }}</p>
        <div class="confirm-actions">
          <button type="button" class="confirm-btn-cancel" (click)="cancel()">
            {{ options.cancelText }}
          </button>
          <button type="button" class="confirm-btn-ok" (click)="confirm()">
            {{ options.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .confirm-modal {
      background: #1a1a1a;
      border: 1px solid #00FF00;
      border-radius: 8px;
      padding: 1.5rem 2rem;
      min-width: 320px;
      max-width: 90vw;
    }
    .confirm-title {
      margin: 0 0 1rem 0;
      color: #fff;
      font-size: 1.2rem;
    }
    .confirm-message {
      margin: 0 0 1.5rem 0;
      color: #ccc;
      font-size: 1rem;
    }
    .confirm-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
    .confirm-btn-cancel,
    .confirm-btn-ok {
      padding: 0.6rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .confirm-btn-cancel {
      background: transparent;
      color: #999;
      border: 1px solid #333;
    }
    .confirm-btn-cancel:hover {
      color: #fff;
      border-color: #555;
    }
    .confirm-btn-ok {
      background: #00FF00;
      color: #0a0a0a;
      border: 1px solid #00FF00;
    }
    .confirm-btn-ok:hover {
      opacity: 0.9;
    }
  `]
})
export class ConfirmModalComponent implements OnDestroy {
  options: ConfirmOptions | null = null;
  private sub?: Subscription;

  constructor(private confirmService: ConfirmService) {
    this.sub = this.confirmService.confirm$.subscribe(o => this.options = o);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  confirm(): void {
    this.confirmService.close(true);
  }

  cancel(): void {
    this.confirmService.close(false);
  }
}
