import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Comanda, StatusComanda } from '../../models/comanda.model';

@Component({
  selector: 'app-comanda-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="comanda-card" [class.fechado]="comanda.status === 'FECHADO'" (dblclick)="onVerDetalhes()">
      <div class="card-header">
        <div class="jogador-info">
          <div class="avatar" [class.tipo-torneio]="comanda.tipo === 'TORNEIO'" 
               [class.tipo-cash]="comanda.tipo === 'CASH'"
               [class.tipo-bar]="comanda.tipo === 'BAR'">
            <span>{{ getInitials(comanda.jogadorNome) }}</span>
          </div>
          <div class="nome-mesa">
            <h3 class="jogador-nome">{{ comanda.jogadorNome }}</h3>
            <p class="mesa-info">
              <span class="tipo-badge">{{ getTipoBadge(comanda.tipo) }}</span>
            </p>
            <p class="torneio-nome" *ngIf="comanda.torneioNome">
              🏆 {{ comanda.torneioNome }}
            </p>
          </div>
        </div>

        <div class="card-right">
          <div class="valor-container">
            <span class="moeda">R$</span>
            <span class="valor">{{ getValorExibir(comanda).toFixed(2) }}</span>
          </div>

          <button 
            class="btn-status"
            [class.ativo]="comanda.status === 'ATIVO'"
            [class.fechado]="comanda.status === 'FECHADO'"
            (click)="onToggleStatus(); $event.stopPropagation()">
            {{ comanda.status === 'ATIVO' ? '✅ Ativo' : '⭕ Fechado' }}
          </button>
        </div>
      </div>

      <button
        type="button"
        class="btn-bebida-card"
        *ngIf="comanda.status === 'ATIVO'"
        (click)="onAdicionarBebida(); $event.stopPropagation()">
        <span>Adicionar  Bebida</span>
      </button>

      <button class="btn-ver-comanda" (click)="onVerDetalhes(); $event.stopPropagation()">
        <span>📋</span>
        Ver comanda completa
      </button>
    </div>
  `,
  styles: [`
    .comanda-card {
      background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
      border: 2px solid #333;
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .comanda-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .comanda-card:hover::before {
      opacity: 1;
    }

    .comanda-card:hover {
      border-color: #00ff88;
      box-shadow: 0 8px 32px rgba(0, 255, 136, 0.2);
      transform: translateY(-4px);
    }

    .comanda-card.fechado {
      opacity: 0.6;
      border-color: #555;
    }

    .comanda-card.fechado::before {
      background: #666;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .jogador-info {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      flex: 1;
    }

    .avatar {
      width: 56px;
      height: 56px;
      min-width: 56px;
      border-radius: 12px;
      background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.3rem;
      color: #000;
      border: 3px solid rgba(0, 255, 136, 0.3);
      transition: all 0.3s ease;
    }

    .avatar.tipo-torneio {
      background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
      border-color: rgba(255, 215, 0, 0.3);
    }

    .avatar.tipo-cash {
      background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
      border-color: rgba(0, 255, 136, 0.3);
    }

    .avatar.tipo-bar {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
      border-color: rgba(255, 107, 107, 0.3);
    }

    .comanda-card:hover .avatar {
      transform: scale(1.05);
    }

    .nome-mesa {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .jogador-nome {
      margin: 0;
      color: #fff;
      font-size: 1.2rem;
      font-weight: bold;
      line-height: 1.2;
    }

    .mesa-info {
      margin: 0;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .mesa-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      background: rgba(0, 255, 136, 0.1);
      border: 1px solid rgba(0, 255, 136, 0.3);
      border-radius: 20px;
      color: #00ff88;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .tipo-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      color: #fff;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .torneio-nome {
      margin: 0;
      color: #ffd700;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .card-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.75rem;
    }

    .valor-container {
      background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 100px;
      box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
    }

    .moeda {
      font-size: 0.75rem;
      font-weight: bold;
      opacity: 0.8;
    }

    .valor {
      font-size: 1.3rem;
      font-weight: bold;
    }

    .btn-status {
      padding: 0.5rem 1.25rem;
      border: none;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .btn-status.ativo {
      background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      box-shadow: 0 2px 8px rgba(0, 255, 136, 0.3);
    }

    .btn-status.fechado {
      background: #555;
      color: #fff;
    }

    .btn-status:hover {
      transform: scale(1.05);
    }

    .btn-bebida-card {
      width: 100%;
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border: 2px solid #ff6b6b;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.95rem;
      background: rgba(255, 107, 107, 0.12);
      color: #ffb3b3;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-bebida-card:hover {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
      color: #fff;
      border-color: #ff8787;
      transform: translateY(-2px);
      box-shadow: 0 4px 14px rgba(255, 107, 107, 0.35);
    }

    .btn-bebida-icon {
      font-size: 1.1rem;
    }

    .btn-ver-comanda {
      width: 100%;
      margin-top: 0.65rem;
      padding: 0.875rem;
      border: 2px solid #00ff88;
      border-radius: 10px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      background: transparent;
      color: #00ff88;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-ver-comanda:hover {
      background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
      color: #000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 136, 0.4);
    }

    @media (max-width: 768px) {
      .card-header {
        flex-direction: column;
        align-items: stretch;
      }

      .card-right {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
  `]
})
export class ComandaCardComponent {
  @Input() comanda!: Comanda;
  @Output() toggleStatus = new EventEmitter<number>();
  @Output() verDetalhes = new EventEmitter<number>();
  /** Abre fluxo rápido de adicionar bebida/comida sem ir à tela da comanda */
  @Output() adicionarBebida = new EventEmitter<number>();

  constructor(private router: Router) {}

  getInitials(nome: string): string {
    return nome
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getTipoBadge(tipo: string): string {
    const badges: { [key: string]: string } = {
      'TORNEIO': '🏆 Torneio',
      'CASH': '💵 Cash',
      'BAR': '🍺 Bar'
    };
    return badges[tipo] || tipo;
  }

  getValorExibir(comanda: Comanda): number {
    if (comanda.status === StatusComanda.FECHADO) {
      return comanda.valorTotal;
    }
    return comanda.valorPago > 0 ? comanda.valorRestante : comanda.valorTotal;
  }

  onToggleStatus() {
    this.toggleStatus.emit(this.comanda.id);
  }

  onVerDetalhes() {
    this.router.navigate(['/comanda', this.comanda.id]);
  }

  onAdicionarBebida() {
    this.adicionarBebida.emit(this.comanda.id);
  }
}
