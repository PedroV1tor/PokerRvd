import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TorneioService } from '../../services/torneio.service';
import { SignalrService } from '../../services/signalr.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmService } from '../../services/confirm.service';
import { Torneio, CreateTorneioDto, StatusTorneio, TorneioStats } from '../../models/torneio.model';

@Component({
  selector: 'app-torneios',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './torneios.component.html',
  styleUrl: './torneios.component.scss'
})
export class TorneiosComponent implements OnInit, OnDestroy {
  torneios: Torneio[] = [];
  torneiosFiltrados: Torneio[] = [];
  loading = false;

  // Modal criar torneio
  mostrarModalCriar = false;
  novoTorneio: CreateTorneioDto = {
    nome: '',
    valorBuyIn: 0,
    valorRebuySimples: 0,
    valorRebuyDuplo: 0,
    valorRebuyTriplo: 0,
    valorAddOn: 0,
    valorAddOnDuplo: 0,
    valorBuyIn2: 0
  };

  // Modal de estatísticas
  mostrarModalStats = false;
  statsCarregando = false;
  torneioStats: TorneioStats | null = null;

  // Filtros
  filtroStatus: StatusTorneio | 'TODOS' = 'TODOS';
  StatusTorneio = StatusTorneio;

  private destroy$ = new Subject<void>();

  constructor(
    private torneioService: TorneioService,
    private signalr: SignalrService,
    private router: Router,
    private toast: ToastService,
    private confirm: ConfirmService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.carregarTorneios();
    this.signalr.onEvent.pipe(
      filter(e => ['TorneioCriado', 'TorneioAtualizado', 'TorneioRemovido'].includes(e.evento)),
      takeUntil(this.destroy$)
    ).subscribe(() => this.carregarTorneios());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarTorneios() {
    this.loading = true;
    this.torneioService.getTorneios().subscribe({
      next: (torneios) => {
        this.torneios = torneios;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  aplicarFiltros() {
    if (this.filtroStatus === 'TODOS') {
      this.torneiosFiltrados = [...this.torneios];
    } else {
      this.torneiosFiltrados = this.torneios.filter(t => t.status === this.filtroStatus);
    }
  }

  setFiltro(status: StatusTorneio | 'TODOS') {
    this.filtroStatus = status;
    this.aplicarFiltros();
  }

  abrirModalCriar() {
    this.mostrarModalCriar = true;
    this.resetarFormulario();
  }

  fecharModalCriar() {
    this.mostrarModalCriar = false;
    this.resetarFormulario();
  }

  resetarFormulario() {
    this.novoTorneio = {
      nome: '',
      valorBuyIn: 0,
      valorRebuySimples: 0,
      valorRebuyDuplo: 0,
      valorRebuyTriplo: 0,
      valorAddOn: 0,
      valorAddOnDuplo: 0,
      valorBuyIn2: 0
    };
  }

  criarTorneio() {
    if (!this.novoTorneio.nome.trim()) {
      this.toast.warning('Por favor, preencha o nome do torneio');
      return;
    }

    if (this.novoTorneio.valorBuyIn <= 0) {
      this.toast.warning('O valor do Buy-in deve ser maior que zero');
      return;
    }

    this.loading = true;
    this.torneioService.createTorneio(this.novoTorneio).subscribe({
      next: () => {
        this.carregarTorneios();
        this.fecharModalCriar();
        this.loading = false;
      },
      error: () => {
        this.toast.error('Erro ao criar torneio. Tente novamente.');
        this.loading = false;
      }
    });
  }

  editarTorneio(_id: number) {
    // TODO: Implementar edição
  }

  deletarTorneio(id: number) {
    const torneio = this.torneios.find(t => t.id === id);
    if (!torneio) return;

    this.confirm.confirm({ message: `Deseja realmente excluir o torneio "${torneio.nome}"?`, confirmText: 'Excluir' }).then(ok => {
      if (!ok) return;
      this.torneioService.deleteTorneio(id).subscribe({
        next: () => this.carregarTorneios(),
        error: () => this.toast.error('Erro ao deletar torneio. Tente novamente.')
      });
    });
  }

  iniciarTorneio(id: number) {
    this.confirm.confirm({ message: 'Deseja iniciar este torneio?', confirmText: 'Iniciar' }).then(ok => {
      if (!ok) return;
      this.torneioService.iniciarTorneio(id).subscribe({
        next: () => this.carregarTorneios(),
        error: () => {}
      });
    });
  }

  finalizarTorneio(id: number) {
    this.confirm.confirm({ message: 'Deseja finalizar este torneio?', confirmText: 'Finalizar' }).then(ok => {
      if (!ok) return;
      this.torneioService.finalizarTorneio(id).subscribe({
        next: () => this.carregarTorneios(),
        error: () => {}
      });
    });
  }

  getStatusLabel(status: StatusTorneio): string {
    switch (status) {
      case StatusTorneio.AGUARDANDO: return 'Aguardando';
      case StatusTorneio.EM_ANDAMENTO: return 'Em Andamento';
      case StatusTorneio.FINALIZADO: return 'Finalizado';
      case StatusTorneio.CANCELADO: return 'Cancelado';
      default: return '';
    }
  }

  getStatusClass(status: StatusTorneio): string {
    switch (status) {
      case StatusTorneio.AGUARDANDO: return 'status-aguardando';
      case StatusTorneio.EM_ANDAMENTO: return 'status-andamento';
      case StatusTorneio.FINALIZADO: return 'status-finalizado';
      case StatusTorneio.CANCELADO: return 'status-cancelado';
      default: return '';
    }
  }

  formatarData(data: Date | undefined): string {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatarValor(valor: number): string {
    return `R$ ${valor.toFixed(2)}`;
  }

  abrirStats(torneio: Torneio) {
    this.mostrarModalStats = true;
    this.torneioStats = null;
    this.statsCarregando = true;
    this.torneioService.getEstatisticas(torneio.id).subscribe({
      next: (stats) => {
        this.torneioStats = stats;
        this.statsCarregando = false;
      },
      error: () => {
        this.toast.error('Erro ao carregar estatísticas do torneio.');
        this.statsCarregando = false;
        this.mostrarModalStats = false;
      }
    });
  }

  fecharModalStats() {
    this.mostrarModalStats = false;
    this.torneioStats = null;
  }
}
