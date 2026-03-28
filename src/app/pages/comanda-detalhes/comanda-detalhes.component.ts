import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ComandaService } from '../../services/comanda.service';
import { SignalrService } from '../../services/signalr.service';
import { TorneioService } from '../../services/torneio.service';
import { ProdutoService } from '../../services/produto.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { Comanda, TipoComanda, StatusComanda, ItemComanda, FormaPagamentoValor, UpdateComandaDto, PagamentoParcialDto } from '../../models/comanda.model';
import { Torneio, StatusTorneio } from '../../models/torneio.model';
import { Produto } from '../../models/produto.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-comanda-detalhes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comanda-detalhes.component.html',
  styleUrl: './comanda-detalhes.component.scss'
})
export class ComandaDetalhesComponent implements OnInit, OnDestroy {
  comanda: Comanda | null | undefined = null;
  torneio: Torneio | null = null;
  itens: ItemComanda[] = [];
  loading = false;
  comandaId: number = 0;

  // Modal de bebida
  mostrarModalBebida = false;
  produtos: Produto[] = [];
  produtoSelecionadoId: number | null = null;
  quantidadeProduto = 1;

  // Modal de fichas (usado para Fichas, Buy-in, Re-buy, Add-on)
  mostrarModalFichas = false;
  valorFichas: number = 0;
  nomeFichas: string = 'Fichas';
  tipoFichaAtual: 'Fichas' | 'Buy-in' | 'Re-buy Simples' | 'Re-buy Duplo' | 'Add-on' = 'Fichas';

  // Edição inline de mesa
  editandoMesa = false;
  mesaEditando = '';

  // Modal de alterar tipo da comanda
  mostrarModalAlterarTipo = false;
  novoTipo: TipoComanda = TipoComanda.BAR;
  torneioSelecionadoId: number | null = null;
  torneiosDisponiveis: Torneio[] = [];

  // Modal de fechar comanda (formas de pagamento)
  mostrarModalFechar = false;
  formasPagamento: FormaPagamentoValor[] = [];
  formasPagamentoOpcoes = ['Dinheiro', 'PIX', 'Cartão Débito', 'Cartão Crédito', 'Outro'];
  descontoFechar = 0;
  taxaFechar = 0;

  // Modal de pagamento parcial
  mostrarModalParcial = false;
  formasPagamentoParcial: FormaPagamentoValor[] = [];
  valorBaseParcial = 0;   // Valor da comanda que o jogador quer pagar agora
  descontoParcial = 0;
  taxaParcial = 0;

  isSaving = false;

  StatusComanda = StatusComanda;
  TipoComanda = TipoComanda;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private comandaService: ComandaService,
    private torneioService: TorneioService,
    private produtoService: ProdutoService,
    private signalr: SignalrService,
    private toast: ToastService,
    private confirm: ConfirmService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.comandaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.comandaId) {
      this.carregarComanda();
    }
    this.carregarProdutos();
    this.signalr.onEvent.pipe(
      filter(e => e.evento === 'ComandaAtualizada'),
      filter(e => {
        const p = e.payload as { id?: number; comandaId?: number } | undefined;
        if (!p) return true;
        return p.id === this.comandaId || p.comandaId === this.comandaId;
      }),
      takeUntil(this.destroy$)
    ).subscribe(() => this.carregarComanda());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarComanda() {
    this.loading = true;
    this.torneio = null; // limpa torneio antes de recarregar
    this.comandaService.getComanda(this.comandaId).subscribe({
      next: (comanda) => {
        if (comanda) {
          this.comanda = comanda;
          this.itens = comanda.itens || [];
          if (comanda.torneioId) {
            this.carregarTorneio(comanda.torneioId);
          }
        } else {
          this.router.navigate(['/dashboard']);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  carregarTorneio(torneioId: number) {
    this.torneioService.getTorneio(torneioId).subscribe({
      next: (torneio) => {
        this.torneio = torneio || null;
      },
      error: () => {}
    });
  }

  adicionarBuyIn() {
    if (!this.comanda) return;

    // Se houver torneio vinculado, usar valor do torneio e adicionar diretamente
    if (this.torneio && this.torneio.valorBuyIn > 0) {
      this.adicionarFichasDireto('Buy-in', this.torneio.valorBuyIn);
    } else {
      // Caso contrário, abrir modal para digitar o valor
      this.tipoFichaAtual = 'Buy-in';
      this.nomeFichas = 'Buy-in';
      this.abrirModalFichas();
    }
  }

  adicionarRebuySimples() {
    if (!this.comanda) return;

    // Se houver torneio vinculado, usar valor do torneio e adicionar diretamente
    if (this.torneio && this.torneio.valorRebuySimples > 0) {
      this.adicionarFichasDireto('Re-buy Simples', this.torneio.valorRebuySimples);
    } else {
      // Caso contrário, abrir modal para digitar o valor
      this.tipoFichaAtual = 'Re-buy Simples';
      this.nomeFichas = 'Re-buy Simples';
      this.abrirModalFichas();
    }
  }

  adicionarRebuyDuplo() {
    if (!this.comanda) return;

    // Se houver torneio vinculado, usar valor do torneio e adicionar diretamente
    if (this.torneio && this.torneio.valorRebuyDuplo > 0) {
      this.adicionarFichasDireto('Re-buy Duplo', this.torneio.valorRebuyDuplo);
    } else {
      // Caso contrário, abrir modal para digitar o valor
      this.tipoFichaAtual = 'Re-buy Duplo';
      this.nomeFichas = 'Re-buy Duplo';
      this.abrirModalFichas();
    }
  }

  adicionarAddOn() {
    if (!this.comanda) return;

    // Se houver torneio vinculado, usar valor do torneio e adicionar diretamente
    if (this.torneio && this.torneio.valorAddOn > 0) {
      this.adicionarFichasDireto('Add-on', this.torneio.valorAddOn);
    } else {
      // Caso contrário, abrir modal para digitar o valor
      this.tipoFichaAtual = 'Add-on';
      this.nomeFichas = 'Add-on';
      this.abrirModalFichas();
    }
  }

  adicionarFichasCashGame() {
    this.tipoFichaAtual = 'Fichas';
    this.nomeFichas = 'Fichas';
    this.abrirModalFichas();
  }

  abrirModalFichas() {
    this.mostrarModalFichas = true;
    this.valorFichas = 0;
  }

  fecharModalFichas() {
    this.mostrarModalFichas = false;
    this.valorFichas = 0;
    this.nomeFichas = 'Fichas';
    this.tipoFichaAtual = 'Fichas';
  }

  confirmarAdicionarFichas() {
    if (!this.comanda) return;

    if (!this.nomeFichas || this.nomeFichas.trim() === '') {
      this.toast.warning('Digite um nome para as fichas');
      return;
    }

    if (!this.valorFichas || this.valorFichas <= 0) {
      this.toast.warning('Digite um valor válido');
      return;
    }

    this.adicionarFichasDireto(this.nomeFichas.trim(), this.valorFichas);
  }

  adicionarFichasDireto(nome: string, valor: number) {
    if (!this.comanda || this.isSaving) return;

    this.isSaving = true;
    this.comandaService.adicionarFichas(this.comanda.id, nome, valor).subscribe({
      next: () => {
        this.isSaving = false;
        this.toast.success(`${nome} de R$ ${valor.toFixed(2)} adicionado com sucesso!`);
        this.fecharModalFichas();
        this.carregarComanda();
      },
      error: () => {
        this.isSaving = false;
        this.toast.error(`Erro ao adicionar ${nome}. Tente novamente.`);
      }
    });
  }

  removerItem(index: number) {
    this.confirm.confirm({ message: 'Deseja realmente remover este item?', confirmText: 'Remover' }).then(ok => {
      if (!ok) return;
      const item = this.itens[index];
      this.comandaService.removerItem(this.comandaId, item.id).subscribe({
        next: () => {
          this.toast.success('Item removido com sucesso!');
          this.carregarComanda();
        },
        error: () => {
          this.toast.error('Erro ao remover item. Tente novamente.');
        }
      });
    });
  }

  atualizarValorFichas() {
    if (!this.comanda) return;
    
    const totalFichas = this.itens
      .filter(i => i.produtoId === 0)
      .reduce((sum, i) => sum + i.valorTotal, 0);
    
    this.comanda.valorFichas = totalFichas;
  }

  atualizarValorBebidas() {
    if (!this.comanda) return;
    
    const totalBebidas = this.itens
      .filter(i => i.produtoId > 0)
      .reduce((sum, i) => sum + i.valorTotal, 0);
    
    this.comanda.valorBebidas = totalBebidas;
  }

  get valorTotal(): number {
    if (!this.comanda) return 0;
    return this.comanda.valorFichas + this.comanda.valorBebidas;
  }

  get valorPago(): number {
    return this.comanda?.valorPago ?? 0;
  }

  get valorRestante(): number {
    return Math.max(0, this.valorTotal - this.valorPago);
  }

  get valorFinalFechar(): number {
    const d = this.descontoFechar || 0;
    const t = this.taxaFechar || 0;
    const base = this.valorRestante + t;
    const resultado = base - d;
    return resultado < 0 ? 0 : resultado;
  }

  /** @deprecated use valorFinalFechar */
  get valorComDesconto(): number {
    return this.valorFinalFechar;
  }

  // ==================== MODAL PAGAMENTO PARCIAL ====================

  /** Total efetivamente cobrado do jogador = base + taxa - desconto */
  get totalACobrarParcial(): number {
    const base = this.valorBaseParcial || 0;
    const t = this.taxaParcial || 0;
    const d = this.descontoParcial || 0;
    const resultado = base + t - d;
    return resultado < 0 ? 0 : resultado;
  }

  /** @deprecated use totalACobrarParcial */
  get valorComDescontoParcial(): number {
    return this.totalACobrarParcial;
  }

  get somaFormasParcial(): number {
    return this.formasPagamentoParcial.reduce((s, f) => s + (f.valor || 0), 0);
  }

  get parcialValido(): boolean {
    return this.somaFormasParcial > 0 && Math.abs(this.somaFormasParcial - this.totalACobrarParcial) < 0.01;
  }

  aplicarTaxaDescontoParcial() {
    if (this.formasPagamentoParcial.length === 1) {
      this.formasPagamentoParcial[0].valor = this.totalACobrarParcial;
    }
  }

  abrirModalParcial() {
    this.valorBaseParcial = 0;
    this.descontoParcial = 0;
    this.taxaParcial = 0;
    this.formasPagamentoParcial = [{ formaPagamento: 'Dinheiro', valor: 0 }];
    this.mostrarModalParcial = true;
  }

  fecharModalParcial() {
    this.mostrarModalParcial = false;
    this.formasPagamentoParcial = [];
    this.valorBaseParcial = 0;
    this.descontoParcial = 0;
    this.taxaParcial = 0;
  }

  adicionarFormaParcial() {
    this.formasPagamentoParcial.push({ formaPagamento: 'Dinheiro', valor: 0 });
  }

  removerFormaParcial(index: number) {
    if (this.formasPagamentoParcial.length > 1) {
      this.formasPagamentoParcial.splice(index, 1);
    }
  }

  confirmarPagamentoParcial() {
    if (!this.comanda || this.isSaving) return;

    const formasValidas = this.formasPagamentoParcial.filter(f => f.valor > 0 && (f.formaPagamento?.trim() ?? '') !== '');
    if (formasValidas.length === 0) {
      this.toast.warning('Informe pelo menos uma forma de pagamento com valor maior que zero.');
      return;
    }

    const soma = formasValidas.reduce((s, f) => s + f.valor, 0);
    if (Math.abs(soma - this.totalACobrarParcial) > 0.01) {
      this.toast.warning(`A soma dos pagamentos (R$ ${soma.toFixed(2)}) deve ser igual ao total a cobrar (R$ ${this.totalACobrarParcial.toFixed(2)}).`);
      return;
    }
    if ((this.valorBaseParcial || 0) > this.valorRestante + 0.01) {
      this.toast.warning(`O valor parcial (R$ ${this.valorBaseParcial.toFixed(2)}) não pode ser maior que o saldo em aberto (R$ ${this.valorRestante.toFixed(2)}).`);
      return;
    }

    const dto: PagamentoParcialDto = {
      formasPagamento: formasValidas,
      desconto: this.descontoParcial || 0,
      taxa: this.taxaParcial || 0
    };

    this.isSaving = true;
    this.comandaService.pagamentoParcial(this.comandaId, dto).subscribe({
      next: (comanda) => {
        this.isSaving = false;
        if (comanda) this.comanda = comanda;
        this.toast.success(`Pagamento de R$ ${soma.toFixed(2)} registrado! Restante: R$ ${(comanda?.valorRestante ?? 0).toFixed(2)}`);
        this.fecharModalParcial();
        this.carregarComanda();
      },
      error: (error) => {
        this.isSaving = false;
        let msg = 'Erro ao registrar pagamento. Tente novamente.';
        if (typeof error.error === 'string') {
          try {
            const body = JSON.parse(error.error);
            msg = body.message || error.error;
          } catch {
            msg = error.error;
          }
        } else {
          msg = error.error?.message || error.message || msg;
        }
        this.toast.error(msg);
      }
    });
  }

  abrirModalFechar() {
    this.descontoFechar = 0;
    this.taxaFechar = 0;
    const restante = this.valorRestante;
    this.formasPagamento = restante > 0
      ? [{ formaPagamento: 'Dinheiro', valor: restante }]
      : [{ formaPagamento: 'Dinheiro', valor: 0 }];
    this.mostrarModalFechar = true;
  }

  fecharModalFechar() {
    this.mostrarModalFechar = false;
    this.formasPagamento = [];
    this.descontoFechar = 0;
    this.taxaFechar = 0;
  }

  aplicarDescontoOuTaxaNoTotal() {
    if (this.formasPagamento.length === 1) {
      this.formasPagamento[0].valor = this.valorFinalFechar;
    }
  }

  adicionarFormaPagamento() {
    this.formasPagamento.push({ formaPagamento: 'Dinheiro', valor: 0 });
  }

  removerFormaPagamento(index: number) {
    if (this.formasPagamento.length > 1) {
      this.formasPagamento.splice(index, 1);
    }
  }

  get somaFormasPagamento(): number {
    return this.formasPagamento.reduce((s, f) => s + (f.valor || 0), 0);
  }

  get totalBateComFormas(): boolean {
    return Math.abs(this.somaFormasPagamento - this.valorFinalFechar) < 0.01;
  }

  // ==================== EDITAR MESA ====================

  iniciarEdicaoMesa() {
    this.mesaEditando = this.comanda?.mesa || '';
    this.editandoMesa = true;
  }

  cancelarEdicaoMesa() {
    this.editandoMesa = false;
    this.mesaEditando = '';
  }

  salvarMesa() {
    if (!this.comanda || this.isSaving) return;

    const novaMesa = this.mesaEditando.trim() || '';

    this.isSaving = true;
    this.comandaService.updateComanda(this.comandaId, {
      mesa: novaMesa || undefined,
      atualizarMesa: true
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.editandoMesa = false;
        // Atualiza imediatamente na tela sem aguardar o reload
        if (this.comanda) this.comanda.mesa = novaMesa;
        this.carregarComanda();
        this.toast.success('Mesa atualizada com sucesso!');
      },
      error: () => {
        this.isSaving = false;
        this.toast.error('Erro ao atualizar mesa.');
      }
    });
  }

  // ==================== ALTERAR TIPO ====================

  abrirModalAlterarTipo() {
    if (!this.comanda) return;
    this.novoTipo = this.comanda.tipo;
    this.torneioSelecionadoId = this.comanda.torneioId ?? null;
    this.torneioService.getTorneios().subscribe({
      next: (torneios) => {
        this.torneiosDisponiveis = torneios.filter(t => t.status === StatusTorneio.EM_ANDAMENTO || t.status === StatusTorneio.AGUARDANDO);
        this.mostrarModalAlterarTipo = true;
      },
      error: () => {
        this.torneiosDisponiveis = [];
        this.mostrarModalAlterarTipo = true;
      }
    });
  }

  fecharModalAlterarTipo() {
    this.mostrarModalAlterarTipo = false;
  }

  salvarAlteracaoTipo() {
    if (!this.comanda || this.isSaving) return;

    const torneio = this.novoTipo === TipoComanda.TORNEIO
      ? this.torneiosDisponiveis.find(t => t.id === Number(this.torneioSelecionadoId))
      : null;

    if (this.novoTipo === TipoComanda.TORNEIO && !torneio) {
      this.toast.warning('Selecione um torneio.');
      return;
    }

    this.isSaving = true;
    const dto: UpdateComandaDto = {
      tipo: this.novoTipo,
      torneioId: torneio?.id,
      torneioNome: torneio?.nome
    };

    this.comandaService.updateComanda(this.comandaId, dto).subscribe({
      next: () => {
        this.isSaving = false;
        this.fecharModalAlterarTipo();
        this.toast.success('Tipo da comanda alterado com sucesso!');
        this.carregarComanda();
      },
      error: () => {
        this.isSaving = false;
        this.toast.error('Erro ao alterar tipo da comanda.');
      }
    });
  }

  // ==================== PERMISSÕES DE AÇÃO ====================

  get podeFecharComanda(): boolean {
    return this.auth.hasPermissionFecharComanda();
  }

  get podeRemoverItem(): boolean {
    return this.auth.hasPermissionRemoverItemComanda();
  }

  fecharComanda() {
    if (!this.comanda || this.isSaving) return;

    const desconto = Number(this.descontoFechar) || 0;
    const taxa = Number(this.taxaFechar) || 0;
    const valorFinal = this.valorFinalFechar;

    // Comanda zerada: não precisa de forma de pagamento
    const comFormas = valorFinal <= 0
      ? []
      : this.formasPagamento.filter(f => f.valor > 0 && (f.formaPagamento?.trim() ?? '') !== '');

    if (valorFinal > 0 && comFormas.length === 0) {
      this.toast.warning('Informe pelo menos uma forma de pagamento com valor maior que zero.');
      return;
    }
    if (valorFinal > 0 && !this.totalBateComFormas) {
      this.toast.warning(`A soma das formas de pagamento (R$ ${this.somaFormasPagamento.toFixed(2)}) deve ser igual ao valor a receber (R$ ${this.valorFinalFechar.toFixed(2)}).`);
      return;
    }

    this.isSaving = true;
    this.comandaService.fecharComanda(this.comandaId, { formasPagamento: comFormas, desconto, taxa }).subscribe({
      next: () => {
        this.isSaving = false;
        this.toast.success('Comanda fechada com sucesso!');
        this.fecharModalFechar();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSaving = false;
        let msg = 'Erro ao fechar comanda. Tente novamente.';
        if (typeof error.error === 'string') {
          try {
            const body = JSON.parse(error.error);
            msg = body.message || error.error;
          } catch {
            msg = error.error;
          }
        } else {
          msg = error.error?.message || error.message || msg;
        }
        this.toast.error(msg);
      }
    });
  }

  carregarProdutos(onLoaded?: () => void) {
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos.filter(p => p.ativo);
        onLoaded?.();
      },
      error: () => {}
    });
  }

  abrirModalBebida() {
    this.carregarProdutos(() => {
      this.mostrarModalBebida = true;
      this.produtoSelecionadoId = this.produtos.length > 0 ? this.produtos[0].id : null;
      this.quantidadeProduto = 1;
    });
  }

  fecharModalBebida() {
    this.mostrarModalBebida = false;
    this.produtoSelecionadoId = null;
    this.quantidadeProduto = 1;
  }

  adicionarBebida() {
    if (!this.produtoSelecionadoId || this.quantidadeProduto < 1 || this.isSaving) return;

    this.isSaving = true;
    this.comandaService.adicionarProduto(this.comandaId, this.produtoSelecionadoId, this.quantidadeProduto).subscribe({
      next: () => {
        this.isSaving = false;
        this.toast.success('Bebida adicionada com sucesso!');
        this.fecharModalBebida();
        this.carregarComanda();
        this.carregarProdutos();
      },
      error: () => {
        this.isSaving = false;
        this.toast.error('Erro ao adicionar bebida. Tente novamente.');
      }
    });
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }

  getTipoLabel(tipo: TipoComanda): string {
    switch (tipo) {
      case TipoComanda.TORNEIO: return 'Torneio';
      case TipoComanda.CASH: return 'Cash Game';
      case TipoComanda.BAR: return 'Bar';
      default: return '';
    }
  }

  getTipoClass(tipo: TipoComanda): string {
    switch (tipo) {
      case TipoComanda.TORNEIO: return 'tipo-torneio';
      case TipoComanda.CASH: return 'tipo-cash';
      case TipoComanda.BAR: return 'tipo-bar';
      default: return '';
    }
  }
}
