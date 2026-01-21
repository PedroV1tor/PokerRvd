import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Comanda, StatusComanda } from '../../models/comanda.model';

@Component({
  selector: 'app-comanda-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="comanda-card" [class.fechado]="comanda.status === 'FECHADO'">
      <div class="card-header">
        <div class="jogador-info">
          <div class="avatar">
            <span>{{ getInitials(comanda.jogadorNome) }}</span>
          </div>
          <div class="nome-mesa">
            <h3 class="jogador-nome">{{ comanda.jogadorNome }}</h3>
            <p class="mesa-tipo">
              {{ comanda.mesa }} - {{ comanda.torneioNome || comanda.tipo }}
            </p>
          </div>
        </div>

        <div class="card-actions">
          <div class="valor-container">
            <span class="moeda">R$</span>
            <span class="valor">{{ comanda.valorTotal.toFixed(2) }}</span>
          </div>

          <button 
            class="btn-status"
            [class.ativo]="comanda.status === 'ATIVO'"
            [class.fechado]="comanda.status === 'FECHADO'"
            (click)="onToggleStatus()">
            {{ comanda.status }}
          </button>

          <button class="btn-menu" (click)="onMenuClick()">
            ▼
          </button>
        </div>
      </div>

      <div class="card-detalhes" *ngIf="showDetalhes">
        <div class="detalhe-item">
          <span class="detalhe-label">Fichas:</span>
          <span class="detalhe-valor">R$ {{ comanda.valorFichas.toFixed(2) }}</span>
        </div>
        <div class="detalhe-item">
          <span class="detalhe-label">Bebidas:</span>
          <span class="detalhe-valor bebidas">R$ {{ comanda.valorBebidas.toFixed(2) }}</span>
        </div>
        <div class="card-actions-bottom">
          <button class="btn-ver-detalhes" (click)="onVerDetalhes()">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comanda-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
      border: 2px solid #333;
      border-radius: 12px;
      padding: 1.25rem;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .comanda-card:hover {
      border-color: #00FF00;
      box-shadow: 0 8px 24px rgba(0, 255, 0, 0.2);
      transform: translateY(-4px);
    }

    .comanda-card.fechado {
      opacity: 0.7;
      border-color: #666;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .jogador-info {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      flex: 1;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00FF00 0%, #00AA00 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.1rem;
      color: #000;
      border: 2px solid #00FF00;
    }

    .nome-mesa {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .jogador-nome {
      margin: 0;
      color: #fff;
      font-size: 1.1rem;
      font-weight: bold;
    }

    .mesa-tipo {
      margin: 0;
      color: #00FF00;
      font-size: 0.85rem;
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .valor-container {
      background-color: #00FF00;
      color: #000;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 90px;
    }

    .moeda {
      font-size: 0.75rem;
      font-weight: bold;
    }

    .valor {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .btn-status {
      padding: 0.45rem 1.1rem;
      border: none;
      border-radius: 18px;
      font-weight: bold;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-status.ativo {
      background-color: #00FF00;
      color: #000;
    }

    .btn-status.fechado {
      background-color: #666;
      color: #fff;
    }

    .btn-status:hover {
      transform: scale(1.05);
    }

    .btn-menu {
      background: none;
      border: 2px solid #00FF00;
      color: #00FF00;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1.1rem;
    }

    .btn-menu:hover {
      background-color: #00FF00;
      color: #000;
    }

    .card-detalhes {
      margin-top: 0.85rem;
      padding-top: 0.85rem;
      border-top: 1px solid #333;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .detalhe-item {
      display: flex;
      justify-content: space-between;
      color: #fff;
      font-size: 0.95rem;
    }

    .detalhe-label {
      color: #999;
      font-size: 0.9rem;
    }

    .detalhe-valor {
      font-weight: bold;
      color: #00FF00;
      font-size: 0.95rem;
    }

    .detalhe-valor.bebidas {
      color: #FFD700;
    }

    .card-actions-bottom {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .btn-ver-detalhes {
      width: 100%;
      padding: 0.55rem;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.85rem;
      background-color: transparent;
      color: #00FF00;
      border: 2px solid #00FF00;
    }

    .btn-ver-detalhes:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 255, 0, 0.3);
    }

    @media (max-width: 768px) {
      .card-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .card-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class ComandaCardComponent {
  @Input() comanda!: Comanda;
  @Output() toggleStatus = new EventEmitter<number>();
  @Output() verDetalhes = new EventEmitter<number>();

  showDetalhes = false;

  constructor(private router: Router) {}

  getInitials(nome: string): string {
    return nome
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  onToggleStatus() {
    this.toggleStatus.emit(this.comanda.id);
  }

  onMenuClick() {
    this.showDetalhes = !this.showDetalhes;
  }

  onVerDetalhes() {
    this.router.navigate(['/comanda', this.comanda.id]);
  }
}
