import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ComandaCardComponent } from '../../components/comanda-card/comanda-card.component';
import { NovaComandaModalComponent } from '../../components/nova-comanda-modal/nova-comanda-modal.component';
import { DashboardStatsComponent } from '../../components/dashboard-stats/dashboard-stats.component';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ComandaService } from '../../services/comanda.service';
import { CaixaService } from '../../services/caixa.service';
import { SignalrService } from '../../services/signalr.service';
import { ToastService } from '../../services/toast.service';
import { Comanda, CreateComandaDto, DashboardStats, TipoComanda, StatusComanda } from '../../models/comanda.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    ComandaCardComponent,
    NovaComandaModalComponent,
    DashboardStatsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  title = 'PokerRvd';
  comandas: Comanda[] = [];
  comandasFiltradas: Comanda[] = [];
  comandasFechadas: Comanda[] = [];
  comandasFechadasFiltradas: Comanda[] = [];
  stats: DashboardStats | null = null;
  
  // Filtros
  buscaTexto = '';
  filtroAtivo: TipoComanda = TipoComanda.TODOS;
  TipoComanda = TipoComanda;
  
  // Modal
  mostrarModalNovaComanda = false;
  
  // UI
  mostrarComandasFechadas = false;

  // Loading
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private comandaService: ComandaService,
    private caixaService: CaixaService,
    private signalr: SignalrService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.carregarDados();
    const eventos = ['ComandaCriada', 'ComandaAtualizada', 'ComandaFechada', 'ComandaRemovida', 'CaixaAberto', 'CaixaFechado'];
    this.signalr.onEvent.pipe(
      filter(e => eventos.includes(e.evento)),
      takeUntil(this.destroy$)
    ).subscribe(() => this.carregarDados());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarDados() {
    this.loading = true;

    // Primeiro busca o caixa aberto; só exibe comandas e stats desse caixa
    this.caixaService.getCaixaAberto().subscribe({
      next: (caixaAberto) => {
        const caixaId = caixaAberto.id;
        this.comandaService.getComandas(caixaId).subscribe({
          next: (comandas) => {
            const doCaixa = (c: Comanda) => c.caixaId == null || c.caixaId === caixaId;
            this.comandas = comandas.filter(c =>
              c.status === StatusComanda.ATIVO && doCaixa(c)
            );
            this.comandasFechadas = comandas.filter(c =>
              c.status === StatusComanda.FECHADO && doCaixa(c)
            );
            this.aplicarFiltros();
            this.loading = false;
          },
          error: () => {
            this.comandas = [];
            this.comandasFechadas = [];
            this.aplicarFiltros();
            this.loading = false;
          }
        });
        this.comandaService.getDashboardStats(caixaId).subscribe({
          next: (stats) => { this.stats = stats; },
          error: () => {
            this.stats = null;
          }
        });
      },
      error: () => {
        // Sem caixa aberto: dashboard vazio
        this.comandas = [];
        this.comandasFechadas = [];
        this.aplicarFiltros();
        this.stats = null;
        this.loading = false;
      }
    });
  }

  aplicarFiltros() {
    this.comandasFiltradas = this.comandaService.filtrarComandas(
      this.comandas,
      this.filtroAtivo,
      this.buscaTexto
    );
    this.comandasFechadasFiltradas = this.comandaService.filtrarComandas(
      this.comandasFechadas,
      this.filtroAtivo,
      this.buscaTexto
    );
  }

  onBuscaChange() {
    this.aplicarFiltros();
  }

  setFiltro(filtro: TipoComanda) {
    this.filtroAtivo = filtro;
    this.aplicarFiltros();
  }

  abrirModalNovaComanda() {
    this.mostrarModalNovaComanda = true;
  }

  fecharModalNovaComanda() {
    this.mostrarModalNovaComanda = false;
  }

  criarComanda(comanda: CreateComandaDto) {
    this.comandaService.createComanda(comanda).subscribe({
      next: () => {
        this.carregarDados();
      },
      error: (error) => {
        let msg: string;
        if (typeof error.error === 'object' && error.error?.message) {
          msg = error.error.message;
        } else if (typeof error.error === 'string' && error.error) {
          msg = error.error;
        } else {
          msg = error.error?.title || error.message || 'Verifique se o backend está rodando e se a coluna CaixaId existe na tabela Comandas (rode AddCaixaId_Manual.sql).';
        }
        this.toast.error('Erro ao criar comanda: ' + msg);
      }
    });
  }

  toggleStatusComanda(id: number) {
    const comanda = this.comandas.find(c => c.id === id) ?? this.comandasFechadas.find(c => c.id === id);
    if (!comanda) return;

    const novoStatus = comanda.status === StatusComanda.ATIVO
      ? StatusComanda.FECHADO
      : StatusComanda.ATIVO;

    this.comandaService.updateComanda(id, { status: novoStatus }).subscribe({
      next: () => {
        this.carregarDados();
      },
      error: () => {}
    });
  }

  verDetalhesComanda(id: number) {
    this.router.navigate(['/comanda', id]);
  }

  calcularValorTotal(): string {
    const total = this.comandasFiltradas.reduce((sum, comanda) => sum + comanda.valorTotal, 0);
    return total.toFixed(2);
  }
}
