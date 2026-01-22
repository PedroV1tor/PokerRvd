import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ComandaCardComponent } from '../../components/comanda-card/comanda-card.component';
import { NovaComandaModalComponent } from '../../components/nova-comanda-modal/nova-comanda-modal.component';
import { DashboardStatsComponent } from '../../components/dashboard-stats/dashboard-stats.component';
import { ComandaService } from '../../services/comanda.service';
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
export class DashboardComponent implements OnInit {
  title = 'PokerRvd';
  comandas: Comanda[] = [];
  comandasFiltradas: Comanda[] = [];
  stats: DashboardStats | null = null;
  
  // Filtros
  buscaTexto = '';
  filtroAtivo: TipoComanda = TipoComanda.TODOS;
  TipoComanda = TipoComanda;
  
  // Modal
  mostrarModalNovaComanda = false;
  
  // Loading
  loading = false;

  constructor(
    private comandaService: ComandaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.loading = true;

    // Carregar apenas comandas ativas
    this.comandaService.getComandas().subscribe({
      next: (comandas) => {
        // Filtrar apenas comandas ativas
        this.comandas = comandas.filter(c => c.status === StatusComanda.ATIVO);
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar comandas:', error);
        this.loading = false;
      }
    });

    // Carregar estatísticas
    this.comandaService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
      }
    });
  }

  aplicarFiltros() {
    this.comandasFiltradas = this.comandaService.filtrarComandas(
      this.comandas,
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
    console.log('Enviando comanda:', JSON.stringify(comanda, null, 2));
    this.comandaService.createComanda(comanda).subscribe({
      next: (novaComanda) => {
        console.log('Comanda criada:', novaComanda);
        this.carregarDados();
      },
      error: (error) => {
        console.error('Erro ao criar comanda:', error);
        console.error('Detalhes do erro:', error.error);
        alert('Erro ao criar comanda: ' + (error.error?.title || error.message));
      }
    });
  }

  toggleStatusComanda(id: number) {
    const comanda = this.comandas.find(c => c.id === id);
    if (!comanda) return;

    const novoStatus = comanda.status === StatusComanda.ATIVO 
      ? StatusComanda.FECHADO 
      : StatusComanda.ATIVO;

    this.comandaService.updateComanda(id, { status: novoStatus }).subscribe({
      next: () => {
        this.carregarDados();
      },
      error: (error) => {
        console.error('Erro ao atualizar status:', error);
      }
    });
  }

  verDetalhesComanda(id: number) {
    this.router.navigate(['/comanda', id]);
  }
}
