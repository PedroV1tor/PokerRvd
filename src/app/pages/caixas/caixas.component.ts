import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CaixaService } from '../../services/caixa.service';
import { ToastService } from '../../services/toast.service';
import { CaixaDto, StatusCaixa, CreateCaixaDto } from '../../models/caixa.model';

@Component({
  selector: 'app-caixas',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './caixas.component.html',
  styleUrl: './caixas.component.scss'
})
export class CaixasComponent implements OnInit {
  caixas: CaixaDto[] = [];
  caixaAberto: CaixaDto | null = null;
  loading = false;
  mostrarModalAbrirCaixa = false;
  
  // Dados do formulário de abertura
  saldoInicial: number = 0;
  observacoesAbertura: string = '';

  StatusCaixa = StatusCaixa;

  constructor(
    private caixaService: CaixaService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.carregarCaixas();
    this.verificarCaixaAberto();
  }

  carregarCaixas() {
    this.loading = true;
    this.caixaService.getCaixas().subscribe({
      next: (caixas) => {
        this.caixas = caixas;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  verificarCaixaAberto() {
    this.caixaService.getCaixaAberto().subscribe({
      next: (caixa) => {
        this.caixaAberto = caixa;
      },
      error: () => {
        this.caixaAberto = null;
      }
    });
  }

  abrirModalAbrirCaixa() {
    this.mostrarModalAbrirCaixa = true;
    this.saldoInicial = 0;
    this.observacoesAbertura = '';
  }

  fecharModalAbrirCaixa() {
    this.mostrarModalAbrirCaixa = false;
  }

  abrirCaixa() {
    if (this.saldoInicial < 0) {
      this.toast.warning('Saldo inicial não pode ser negativo');
      return;
    }

    const dto: CreateCaixaDto = {
      saldoInicial: this.saldoInicial,
      observacoesAbertura: this.observacoesAbertura || undefined
    };

    this.caixaService.abrirCaixa(dto).subscribe({
      next: () => {
        this.toast.success('Caixa aberto com sucesso!');
        this.fecharModalAbrirCaixa();
        this.carregarCaixas();
        this.verificarCaixaAberto();
      },
      error: (error) => {
        this.toast.error(error.error || 'Erro ao abrir caixa. Tente novamente.');
      }
    });
  }

  verDetalhesCaixa(id: number) {
    this.router.navigate(['/caixa', id]);
  }

  formatarData(data: Date | string): string {
    const date = new Date(data);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatarDataHora(data: Date | string): string {
    const date = new Date(data);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatarHora(data: Date | string): string {
    const date = new Date(data);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getSaldoFinalCalculado(caixa: CaixaDto): number {
    return caixa.saldoInicial + caixa.totalEntradas - caixa.totalSaidas;
  }
}
