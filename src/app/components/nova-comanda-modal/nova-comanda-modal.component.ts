import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateComandaDto, TipoComanda } from '../../models/comanda.model';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TorneioService } from '../../services/torneio.service';
import { SignalrService } from '../../services/signalr.service';
import { Torneio, StatusTorneio } from '../../models/torneio.model';

@Component({
  selector: 'app-nova-comanda-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Nova Comanda</h2>
          <button class="btn-close" (click)="onClose()">×</button>
        </div>

        <form (ngSubmit)="onSubmit()" class="modal-form">
          <div class="form-group">
            <label for="jogadorNome">Nome do Jogador</label>
            <input
              type="text"
              id="jogadorNome"
              [(ngModel)]="formData.jogadorNome"
              name="jogadorNome"
              placeholder="Digite o nome do jogador"
              required
            />
          </div>

          <div class="form-group">
            <label for="mesa">Mesa</label>
            <input
              type="text"
              id="mesa"
              [(ngModel)]="formData.mesa"
              name="mesa"
              placeholder="Ex: Mesa 1, Bar"
              required
            />
          </div>

          <div class="form-group">
            <label for="tipo">Tipo de Comanda</label>
            <select
              id="tipo"
              [(ngModel)]="formData.tipo"
              name="tipo"
              (ngModelChange)="onTipoChange()"
              required
            >
              <option [value]="TipoComanda.CASH">Cash Game</option>
              <option [value]="TipoComanda.BAR">Bar</option>
              <optgroup label="Torneios em Andamento" *ngIf="torneiosEmAndamento.length > 0">
                <option 
                  *ngFor="let torneio of torneiosEmAndamento" 
                  [value]="'TORNEIO_' + torneio.id">
                  {{ torneio.nome }}
                </option>
              </optgroup>
            </select>
          </div>

          <div class="form-group" *ngIf="torneioSelecionado">
            <div class="torneio-info">
              <div class="info-badge">
                <span class="badge-label">Buy-in:</span>
                <span class="badge-value">R$ {{ torneioSelecionado.valorBuyIn.toFixed(2) }}</span>
              </div>
              <div class="info-badge" *ngIf="torneioSelecionado.valorRebuySimples > 0">
                <span class="badge-label">Re-buy Simples:</span>
                <span class="badge-value">R$ {{ torneioSelecionado.valorRebuySimples.toFixed(2) }}</span>
              </div>
              <div class="info-badge" *ngIf="torneioSelecionado.valorRebuyDuplo > 0">
                <span class="badge-label">Re-buy Duplo:</span>
                <span class="badge-value">R$ {{ torneioSelecionado.valorRebuyDuplo.toFixed(2) }}</span>
              </div>
              <div class="info-badge" *ngIf="torneioSelecionado.valorAddOn > 0">
                <span class="badge-label">Add-on:</span>
                <span class="badge-value">R$ {{ torneioSelecionado.valorAddOn.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="form-group" *ngIf="!torneioSelecionado">
            <label for="valorFichas">Valor Inicial em Fichas (opcional)</label>
            <input
              type="number"
              id="valorFichas"
              [(ngModel)]="formData.valorFichas"
              name="valorFichas"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancelar" (click)="onClose()">
              Cancelar
            </button>
            <button type="submit" class="btn-criar" [disabled]="!isFormValid() || isSaving">
              {{ isSaving ? 'Criando...' : 'Criar Comanda' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
      border: 2px solid #00FF00;
      border-radius: 16px;
      padding: 2rem;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 255, 0, 0.3);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        transform: translateY(50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .modal-header h2 {
      margin: 0;
      color: #00FF00;
      font-size: 1.8rem;
    }

    .btn-close {
      background: none;
      border: none;
      color: #00FF00;
      font-size: 2rem;
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .btn-close:hover {
      background-color: rgba(255, 0, 0, 0.2);
      color: #ff4444;
      transform: rotate(90deg);
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      color: #00FF00;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group select {
      background-color: #000;
      border: 2px solid #333;
      color: #fff;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #00FF00;
      box-shadow: 0 0 0 3px rgba(0, 255, 0, 0.1);
    }

    .form-group input::placeholder {
      color: #666;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .btn-cancelar,
    .btn-criar {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-cancelar {
      background-color: transparent;
      color: #fff;
      border: 2px solid #666;
    }

    .btn-cancelar:hover {
      border-color: #ff4444;
      color: #ff4444;
    }

    .btn-criar {
      background-color: #00FF00;
      color: #000;
    }

    .btn-criar:hover:not(:disabled) {
      background-color: #00DD00;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 0, 0.4);
    }

    .btn-criar:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .torneio-info {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(0, 255, 0, 0.05);
      border: 1px solid rgba(0, 255, 0, 0.2);
      border-radius: 8px;
    }

    .info-badge {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.5rem 0.75rem;
      background: #000;
      border: 1px solid #333;
      border-radius: 6px;
    }

    .badge-label {
      color: #999;
      font-size: 0.75rem;
    }

    .badge-value {
      color: #00FF00;
      font-weight: bold;
      font-size: 0.9rem;
    }

    optgroup {
      background: #000;
      color: #00FF00;
      font-weight: bold;
      padding: 0.5rem;
    }

    optgroup option {
      color: #fff;
      font-weight: normal;
      padding: 0.5rem;
    }

    @media (max-width: 768px) {
      .modal-content {
        width: 95%;
        padding: 1.5rem;
      }

      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class NovaComandaModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() isSaving = false;
  @Output() close = new EventEmitter<void>();
  @Output() criar = new EventEmitter<CreateComandaDto>();

  TipoComanda = TipoComanda;
  torneiosEmAndamento: Torneio[] = [];
  torneioSelecionado: Torneio | null = null;

  formData: CreateComandaDto = {
    jogadorNome: '',
    mesa: '',
    tipo: TipoComanda.CASH,
    valorFichas: 0
  };

  private destroy$ = new Subject<void>();

  constructor(
    private torneioService: TorneioService,
    private signalr: SignalrService
  ) {}

  ngOnInit() {
    this.carregarTorneiosEmAndamento();
    this.signalr.onEvent.pipe(
      filter(e => ['TorneioCriado', 'TorneioAtualizado'].includes(e.evento)),
      takeUntil(this.destroy$)
    ).subscribe(() => this.carregarTorneiosEmAndamento());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && changes['isOpen'].currentValue) {
      this.carregarTorneiosEmAndamento();
    }
  }

  carregarTorneiosEmAndamento() {
    this.torneioService.getTorneios().subscribe({
      next: (torneios) => {
        this.torneiosEmAndamento = torneios.filter(
          t => t.status === StatusTorneio.EM_ANDAMENTO
        );
      },
      error: () => {}
    });
  }

  onTipoChange() {
    const tipoValue = this.formData.tipo as string;
    
    if (tipoValue.startsWith('TORNEIO_')) {
      const torneioId = parseInt(tipoValue.replace('TORNEIO_', ''));
      this.torneioSelecionado = this.torneiosEmAndamento.find(t => t.id === torneioId) || null;
      
      if (this.torneioSelecionado) {
        this.formData.torneioId = this.torneioSelecionado.id;
        this.formData.torneioNome = this.torneioSelecionado.nome;
        this.formData.valorFichas = this.torneioSelecionado.valorBuyIn;
      }
    } else {
      this.torneioSelecionado = null;
      this.formData.torneioId = undefined;
      this.formData.torneioNome = undefined;
      this.formData.valorFichas = 0;
    }
  }

  isFormValid(): boolean {
    return this.formData.jogadorNome.trim().length > 0 &&
           this.formData.mesa.trim().length > 0;
  }

  onSubmit() {
    if (this.isFormValid()) {
      // Normalizar o tipo para TORNEIO se for um torneio específico e garantir valor do buy-in
      const comandaData = { ...this.formData };
      if ((comandaData.tipo as string).startsWith('TORNEIO_')) {
        comandaData.tipo = TipoComanda.TORNEIO;
        // Garantir que o buy-in seja enviado para o backend adicionar como item na comanda
        comandaData.valorFichas = this.torneioSelecionado?.valorBuyIn ?? comandaData.valorFichas ?? 0;
      }

      this.criar.emit(comandaData);
      this.resetForm();
      this.onClose();
    }
  }

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      jogadorNome: '',
      mesa: '',
      tipo: TipoComanda.CASH,
      valorFichas: 0
    };
    this.torneioSelecionado = null;
  }
}
