import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TorneioService } from '../../services/torneio.service';
import { Torneio, CreateTorneioDto, StatusTorneio } from '../../models/torneio.model';

@Component({
  selector: 'app-torneios',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './torneios.component.html',
  styleUrl: './torneios.component.scss'
})
export class TorneiosComponent implements OnInit {
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
    valorAddOn: 0
  };

  // Filtros
  filtroStatus: StatusTorneio | 'TODOS' = 'TODOS';
  StatusTorneio = StatusTorneio;

  constructor(
    private torneioService: TorneioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarTorneios();
  }

  carregarTorneios() {
    this.loading = true;
    this.torneioService.getTorneios().subscribe({
      next: (torneios) => {
        this.torneios = torneios;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar torneios:', error);
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
      valorAddOn: 0
    };
  }

  criarTorneio() {
    // Validações
    if (!this.novoTorneio.nome.trim()) {
      alert('Por favor, preencha o nome do torneio');
      return;
    }

    if (this.novoTorneio.valorBuyIn <= 0) {
      alert('O valor do Buy-in deve ser maior que zero');
      return;
    }

    this.loading = true;
    this.torneioService.createTorneio(this.novoTorneio).subscribe({
      next: (torneio) => {
        console.log('Torneio criado:', torneio);
        this.carregarTorneios();
        this.fecharModalCriar();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao criar torneio:', error);
        alert('Erro ao criar torneio. Tente novamente.');
        this.loading = false;
      }
    });
  }

  editarTorneio(id: number) {
    // TODO: Implementar edição
    console.log('Editar torneio:', id);
  }

  deletarTorneio(id: number) {
    const torneio = this.torneios.find(t => t.id === id);
    if (!torneio) return;

    if (confirm(`Deseja realmente excluir o torneio "${torneio.nome}"?`)) {
      this.torneioService.deleteTorneio(id).subscribe({
        next: () => {
          this.carregarTorneios();
        },
        error: (error) => {
          console.error('Erro ao deletar torneio:', error);
          alert('Erro ao deletar torneio. Tente novamente.');
        }
      });
    }
  }

  iniciarTorneio(id: number) {
    if (confirm('Deseja iniciar este torneio?')) {
      this.torneioService.iniciarTorneio(id).subscribe({
        next: () => {
          this.carregarTorneios();
        },
        error: (error) => {
          console.error('Erro ao iniciar torneio:', error);
        }
      });
    }
  }

  finalizarTorneio(id: number) {
    if (confirm('Deseja finalizar este torneio?')) {
      this.torneioService.finalizarTorneio(id).subscribe({
        next: () => {
          this.carregarTorneios();
        },
        error: (error) => {
          console.error('Erro ao finalizar torneio:', error);
        }
      });
    }
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
}
