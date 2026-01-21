import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CaixaService } from '../../services/caixa.service';
import { CaixaDetailsDto, StatusCaixa, TipoMovimentacao, FecharCaixaDto, CreateMovimentacaoDto } from '../../models/caixa.model';

@Component({
  selector: 'app-caixa-detalhes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caixa-detalhes.component.html',
  styleUrl: './caixa-detalhes.component.scss'
})
export class CaixaDetalhesComponent implements OnInit {
  caixa: CaixaDetailsDto | null = null;
  loading = false;
  caixaId: number = 0;

  // Modal de fechar caixa
  mostrarModalFechar = false;
  saldoFinal: number = 0;
  observacoesFechamento: string = '';

  // Modal de adicionar movimentação
  mostrarModalMovimentacao = false;
  tipoMovimentacao: TipoMovimentacao = TipoMovimentacao.ENTRADA;
  categoriaMovimentacao: string = '';
  descricaoMovimentacao: string = '';
  valorMovimentacao: number = 0;

  StatusCaixa = StatusCaixa;
  TipoMovimentacao = TipoMovimentacao;

  categorias = ['Fichas', 'Bebidas', 'Comidas', 'Despesas', 'Outros'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caixaService: CaixaService
  ) {}

  ngOnInit() {
    this.caixaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.caixaId) {
      this.carregarCaixa();
    }
  }

  carregarCaixa() {
    this.loading = true;
    this.caixaService.getCaixa(this.caixaId).subscribe({
      next: (caixa) => {
        this.caixa = caixa;
        this.saldoFinal = this.getSaldoEsperado();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar caixa:', error);
        alert('Erro ao carregar caixa');
        this.router.navigate(['/caixas']);
        this.loading = false;
      }
    });
  }

  abrirModalFechar() {
    this.mostrarModalFechar = true;
    this.saldoFinal = this.getSaldoEsperado();
    this.observacoesFechamento = '';
  }

  fecharModalFechar() {
    this.mostrarModalFechar = false;
  }

  fecharCaixa() {
    if (!this.caixa) return;

    const dto: FecharCaixaDto = {
      saldoFinal: this.saldoFinal,
      observacoesFechamento: this.observacoesFechamento || undefined
    };

    this.caixaService.fecharCaixa(this.caixaId, dto).subscribe({
      next: () => {
        alert('Caixa fechado com sucesso!');
        this.fecharModalFechar();
        this.carregarCaixa();
      },
      error: (error) => {
        console.error('Erro ao fechar caixa:', error);
        alert(error.error || 'Erro ao fechar caixa. Tente novamente.');
      }
    });
  }

  abrirModalMovimentacao() {
    this.mostrarModalMovimentacao = true;
    this.tipoMovimentacao = TipoMovimentacao.ENTRADA;
    this.categoriaMovimentacao = 'Fichas';
    this.descricaoMovimentacao = '';
    this.valorMovimentacao = 0;
  }

  fecharModalMovimentacao() {
    this.mostrarModalMovimentacao = false;
  }

  adicionarMovimentacao() {
    if (!this.caixa) return;

    if (!this.categoriaMovimentacao || !this.descricaoMovimentacao || this.valorMovimentacao <= 0) {
      alert('Preencha todos os campos corretamente');
      return;
    }

    const dto: CreateMovimentacaoDto = {
      tipo: this.tipoMovimentacao,
      categoria: this.categoriaMovimentacao,
      descricao: this.descricaoMovimentacao,
      valor: this.valorMovimentacao
    };

    this.caixaService.addMovimentacao(this.caixaId, dto).subscribe({
      next: () => {
        alert('Movimentação adicionada com sucesso!');
        this.fecharModalMovimentacao();
        this.carregarCaixa();
      },
      error: (error) => {
        console.error('Erro ao adicionar movimentação:', error);
        alert('Erro ao adicionar movimentação. Tente novamente.');
      }
    });
  }

  voltar() {
    this.router.navigate(['/caixas']);
  }

  getSaldoEsperado(): number {
    if (!this.caixa) return 0;
    return this.caixa.saldoInicial + this.caixa.totalEntradas - this.caixa.totalSaidas;
  }

  getDiferenca(): number {
    if (!this.caixa || !this.caixa.saldoFinal) return 0;
    return this.caixa.saldoFinal - this.getSaldoEsperado();
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
}
