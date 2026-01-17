import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStats } from '../../models/comanda.model';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-stats" *ngIf="stats">
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <p class="stat-label">Comandas Abertas</p>
          <p class="stat-value">{{ stats.comandasAbertas }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🎲</div>
        <div class="stat-content">
          <p class="stat-label">Total em Fichas</p>
          <p class="stat-value">R$ {{ stats.totalFichas.toFixed(2) }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🍺</div>
        <div class="stat-content">
          <p class="stat-label">Total em Bebidas</p>
          <p class="stat-value">R$ {{ stats.totalBebidas.toFixed(2) }}</p>
        </div>
      </div>

      <div class="stat-card featured">
        <div class="stat-icon">💵</div>
        <div class="stat-content">
          <p class="stat-label">Faturamento Total</p>
          <p class="stat-value-large">R$ {{ stats.faturamentoTotal.toFixed(2) }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .stat-card {
      background: #fff;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .stat-card.featured {
      background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
      border: 3px solid #00FF00;
      box-shadow: 0 8px 24px rgba(0, 255, 0, 0.3);
    }

    .stat-card.featured:hover {
      box-shadow: 0 12px 32px rgba(0, 255, 0, 0.4);
    }

    .stat-icon {
      font-size: 3rem;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 255, 0, 0.1);
      border-radius: 12px;
    }

    .stat-card.featured .stat-icon {
      background: rgba(0, 255, 0, 0.2);
    }

    .stat-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-label {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .stat-card.featured .stat-label {
      color: #00FF00;
    }

    .stat-value {
      margin: 0;
      color: #000;
      font-size: 1.8rem;
      font-weight: bold;
    }

    .stat-card.featured .stat-value {
      color: #fff;
    }

    .stat-value-large {
      margin: 0;
      color: #00FF00;
      font-size: 2.2rem;
      font-weight: bold;
      text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    }

    @media (max-width: 768px) {
      .dashboard-stats {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .stat-icon {
        font-size: 2rem;
        width: 50px;
        height: 50px;
      }

      .stat-value,
      .stat-value-large {
        font-size: 1.5rem;
      }
    }
  `]
})
export class DashboardStatsComponent {
  @Input() stats: DashboardStats | null = null;
}
