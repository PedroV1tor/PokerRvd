import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CaixaService } from '../../services/caixa.service';
import { ComandaService } from '../../services/comanda.service';
import { SignalrService } from '../../services/signalr.service';
import { ToastService } from '../../services/toast.service';
import { CaixaDetailsDto, StatusCaixa, TipoMovimentacao, FecharCaixaDto, CreateMovimentacaoDto } from '../../models/caixa.model';
import { Comanda, StatusComanda, FormaPagamentoValor, FecharComandaDto } from '../../models/comanda.model';

@Component({
  selector: 'app-caixa-detalhes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caixa-detalhes.component.html',
  styleUrl: './caixa-detalhes.component.scss'
})
export class CaixaDetalhesComponent implements OnInit, OnDestroy {
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

  // Modal de nova categoria
  mostrarModalNovaCategoria = false;
  novaCategoria: string = '';

  StatusCaixa = StatusCaixa;
  TipoMovimentacao = TipoMovimentacao;

  categorias = ['Fichas', 'Bebidas', 'Comidas', 'Despesas', 'Outros'];

  // Controle de abas
  abaAtiva: 'todas' | 'entradas' | 'saidas' | 'resumo' | 'pendentes' = 'todas';

  // Verificação de comandas abertas (pendentes deste caixa)
  comandasAbertas: Comanda[] = [];
  valorPendente: number = 0;
  mostrarAvisoComandas: boolean = false;

  // Modal Quitar pendência
  mostrarModalQuitarPendencia = false;
  comandaSelecionadaQuitar: Comanda | null = null;
  formasPagamentoQuitar: FormaPagamentoValor[] = [];
  descontoFecharQuitar = 0;
  formasPagamentoOpcoes = ['Dinheiro', 'PIX', 'Cartão Débito', 'Cartão Crédito', 'Outro'];
  salvandoQuitar = false;

  get valorComDescontoQuitar(): number {
    if (!this.comandaSelecionadaQuitar) return 0;
    const total = this.comandaSelecionadaQuitar.valorTotal;
    const d = this.descontoFecharQuitar || 0;
    if (d >= total) return 0;
    return total - d;
  }

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caixaService: CaixaService,
    private comandaService: ComandaService,
    private signalr: SignalrService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.caixaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.caixaId) {
      this.carregarCaixa();
    }
    this.signalr.onEvent.pipe(
      filter(e => {
        if (e.evento === 'ComandaFechada') return true;
        if (e.evento === 'MovimentacaoAdicionada') {
          const p = e.payload as { caixaId?: number } | undefined;
          return !p || p.caixaId === this.caixaId;
        }
        return false;
      }),
      takeUntil(this.destroy$)
    ).subscribe(() => this.carregarCaixa());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarCaixa() {
    this.loading = true;
    this.caixaService.getCaixa(this.caixaId).subscribe({
      next: (caixa) => {
        // Garante que movimentacoes seja sempre um array (evita erro se API retornar null)
        this.caixa = {
          ...caixa,
          movimentacoes: Array.isArray(caixa.movimentacoes) ? caixa.movimentacoes : []
        };
        this.saldoFinal = this.getSaldoEsperado();
        this.loading = false;
        // Carregar pendentes deste caixa (aberto ou fechado) para a aba Pendentes
        this.verificarComandasAbertas();
      },
      error: (error) => {
        const msg = typeof error.error === 'object' && error.error?.message
          ? error.error.message
          : typeof error.error === 'string'
            ? error.error
            : (error.status === 0 ? 'Verifique se o backend está rodando.' : 'Erro ao carregar caixa.');
        this.toast.error(msg);
        this.router.navigate(['/caixas']);
        this.loading = false;
      }
    });
  }

  abrirModalFechar() {
    // Verificar comandas abertas antes de abrir o modal
    this.verificarComandasAbertas();
    this.mostrarModalFechar = true;
    this.saldoFinal = this.getSaldoEsperado();
    this.observacoesFechamento = '';
  }

  verificarComandasAbertas() {
    if (!this.caixaId || this.caixaId <= 0) {
      this.comandasAbertas = [];
      this.valorPendente = 0;
      this.mostrarAvisoComandas = false;
      return;
    }
    this.comandaService.getComandas(this.caixaId).subscribe({
      next: (comandas) => {
        this.comandasAbertas = comandas.filter(c => c.status === StatusComanda.ATIVO);
        this.valorPendente = this.comandasAbertas.reduce((total, c) => total + c.valorTotal, 0);
        this.mostrarAvisoComandas = this.comandasAbertas.length > 0;
      },
      error: () => {
        this.comandasAbertas = [];
        this.valorPendente = 0;
        this.mostrarAvisoComandas = false;
      }
    });
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
        this.toast.success('Caixa fechado com sucesso!');
        this.fecharModalFechar();
        this.carregarCaixa();
      },
      error: (error) => {
        this.toast.error(error.error || 'Erro ao fechar caixa. Tente novamente.');
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

  abrirModalNovaCategoria() {
    this.mostrarModalNovaCategoria = true;
    this.novaCategoria = '';
  }

  fecharModalNovaCategoria() {
    this.mostrarModalNovaCategoria = false;
    this.novaCategoria = '';
  }

  criarCategoria() {
    if (!this.novaCategoria || this.novaCategoria.trim() === '') {
      this.toast.warning('Digite um nome para a categoria');
      return;
    }

    const categoriaTrimmed = this.novaCategoria.trim();
    if (this.categorias.includes(categoriaTrimmed)) {
      this.toast.warning('Esta categoria já existe');
      return;
    }

    // Adicionar a nova categoria à lista
    this.categorias.push(categoriaTrimmed);
    
    // Selecionar a nova categoria automaticamente
    this.categoriaMovimentacao = categoriaTrimmed;
    
    // Fechar o modal
    this.fecharModalNovaCategoria();
  }

  adicionarMovimentacao() {
    if (!this.caixa) return;

    if (!this.categoriaMovimentacao || !this.descricaoMovimentacao || this.valorMovimentacao <= 0) {
      this.toast.warning('Preencha todos os campos corretamente');
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
        this.toast.success('Movimentação adicionada com sucesso!');
        this.fecharModalMovimentacao();
        this.carregarCaixa();
      },
      error: () => {
        this.toast.error('Erro ao adicionar movimentação. Tente novamente.');
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

  selecionarAba(aba: 'todas' | 'entradas' | 'saidas' | 'resumo' | 'pendentes') {
    this.abaAtiva = aba;
    if (aba === 'pendentes') {
      this.verificarComandasAbertas();
    }
  }

  abrirModalQuitarPendencia(comanda: Comanda) {
    this.comandaSelecionadaQuitar = comanda;
    this.descontoFecharQuitar = 0;
    this.formasPagamentoQuitar = [{ formaPagamento: 'Dinheiro', valor: comanda.valorTotal }];
    this.mostrarModalQuitarPendencia = true;
  }

  fecharModalQuitarPendencia() {
    this.mostrarModalQuitarPendencia = false;
    this.comandaSelecionadaQuitar = null;
    this.formasPagamentoQuitar = [];
    this.descontoFecharQuitar = 0;
  }

  aplicarDescontoNoTotalQuitar() {
    const v = this.valorComDescontoQuitar;
    if (this.formasPagamentoQuitar.length === 1) {
      this.formasPagamentoQuitar[0].valor = v;
    }
  }

  adicionarFormaQuitar() {
    this.formasPagamentoQuitar.push({ formaPagamento: 'Dinheiro', valor: 0 });
  }

  removerFormaQuitar(index: number) {
    if (this.formasPagamentoQuitar.length > 1) {
      this.formasPagamentoQuitar.splice(index, 1);
    }
  }

  get somaFormasPagamentoQuitar(): number {
    return this.formasPagamentoQuitar.reduce((s, f) => s + (f.valor || 0), 0);
  }

  get totalBateComFormasQuitar(): boolean {
    if (!this.comandaSelecionadaQuitar) return false;
    return Math.abs(this.somaFormasPagamentoQuitar - this.valorComDescontoQuitar) < 0.01;
  }

  quitarPendencia() {
    if (!this.comandaSelecionadaQuitar || !this.totalBateComFormasQuitar) return;
    const comFormas = this.formasPagamentoQuitar.filter(f => f.valor > 0 && (f.formaPagamento?.trim() ?? '') !== '');
    if (comFormas.length === 0) return;
    const desconto = Number(this.descontoFecharQuitar) || 0;
    const dto: FecharComandaDto = { formasPagamento: comFormas, desconto };
    this.salvandoQuitar = true;
    this.comandaService.fecharComanda(this.comandaSelecionadaQuitar.id, dto).subscribe({
      next: () => {
        this.salvandoQuitar = false;
        this.fecharModalQuitarPendencia();
        this.verificarComandasAbertas();
      },
      error: (err) => {
        this.salvandoQuitar = false;
        const msg = typeof err.error === 'object' && err.error?.message ? err.error.message : err.message || 'Erro ao quitar.';
        this.toast.error(msg);
      }
    });
  }

  getMovimentacoesFiltradas() {
    if (!this.caixa) return [];
    const movs = this.caixa.movimentacoes ?? [];
    if (this.abaAtiva === 'entradas') {
      return movs.filter(m => m.tipo === TipoMovimentacao.ENTRADA);
    } else if (this.abaAtiva === 'saidas') {
      return movs.filter(m => m.tipo === TipoMovimentacao.SAIDA);
    }
    return movs;
  }

  getResumoEntradas() {
    if (!this.caixa) return [];
    const movs = this.caixa.movimentacoes ?? [];
    const entradas = movs.filter(m => m.tipo === TipoMovimentacao.ENTRADA);
    return this.agruparMovimentacoes(entradas);
  }

  getResumoSaidas() {
    if (!this.caixa) return [];
    const movs = this.caixa.movimentacoes ?? [];
    const saidas = movs.filter(m => m.tipo === TipoMovimentacao.SAIDA);
    return this.agruparMovimentacoes(saidas);
  }

  /** Resumo de entradas agrupado por forma de pagamento (fechamento de comandas) */
  getResumoPorFormaPagamento(): { formaPagamento: string; quantidade: number; total: number }[] {
    if (!this.caixa) return [];
    const movs = this.caixa.movimentacoes ?? [];
    const entradas = movs.filter(
      m => m.tipo === TipoMovimentacao.ENTRADA && m.formaPagamento && String(m.formaPagamento).trim() !== ''
    );
    const grupos = new Map<string, { quantidade: number; total: number }>();
    
    entradas.forEach(mov => {
      const forma = String(mov.formaPagamento).trim();
      if (grupos.has(forma)) {
        const g = grupos.get(forma)!;
        g.quantidade++;
        g.total += mov.valor;
      } else {
        grupos.set(forma, { quantidade: 1, total: mov.valor });
      }
    });
    
    return Array.from(grupos.entries())
      .map(([formaPagamento, { quantidade, total }]) => ({ formaPagamento, quantidade, total }))
      .sort((a, b) => b.total - a.total);
  }

  private agruparMovimentacoes(movimentacoes: any[]) {
    const grupos = new Map<string, { categoria: string; descricao: string; quantidade: number; total: number }>();
    
    movimentacoes.forEach(mov => {
      const chave = `${mov.categoria}|${mov.descricao}`;
      
      if (grupos.has(chave)) {
        const grupo = grupos.get(chave)!;
        grupo.quantidade++;
        grupo.total += mov.valor;
      } else {
        grupos.set(chave, {
          categoria: mov.categoria,
          descricao: mov.descricao,
          quantidade: 1,
          total: mov.valor
        });
      }
    });
    
    return Array.from(grupos.values()).sort((a, b) => b.total - a.total);
  }
}
