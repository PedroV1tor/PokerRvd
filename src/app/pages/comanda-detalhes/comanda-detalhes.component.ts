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
import { Comanda, TipoComanda, StatusComanda, ItemComanda, FormaPagamentoValor } from '../../models/comanda.model';
import { Torneio } from '../../models/torneio.model';
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

  // Modal de fechar comanda (formas de pagamento)
  mostrarModalFechar = false;
  formasPagamento: FormaPagamentoValor[] = [];
  formasPagamentoOpcoes = ['Dinheiro', 'PIX', 'Cartão Débito', 'Cartão Crédito', 'Outro'];
  descontoFechar = 0; // Desconto em R$ ao fechar a comanda

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
    if (!this.comanda) return;

    // Adicionar via API
    this.comandaService.adicionarFichas(this.comanda.id, nome, valor).subscribe({
      next: () => {
        this.toast.success(`${nome} de R$ ${valor.toFixed(2)} adicionado com sucesso!`);
        this.fecharModalFichas();
        this.carregarComanda();
      },
      error: () => {
        this.toast.error(`Erro ao adicionar ${nome}. Tente novamente.`);
      }
    });
  }

  removerItem(index: number) {
    this.confirm.confirm({ message: 'Deseja realmente remover este item?', confirmText: 'Remover' }).then(ok => {
      if (!ok) return;
      const item = this.itens[index];
      this.itens.splice(index, 1);
      if (item.produtoId === 0) {
        this.atualizarValorFichas();
      } else {
        this.atualizarValorBebidas();
      }
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

  get valorComDesconto(): number {
    const d = this.descontoFechar || 0;
    const total = this.valorTotal;
    if (d <= 0) return total;
    if (d >= total) return 0;
    return total - d;
  }

  abrirModalFechar() {
    this.descontoFechar = 0;
    // Pré-preenche com o total da comanda para o usuário confirmar ou alterar (ex.: dividir em várias formas)
    this.formasPagamento = [{ formaPagamento: 'Dinheiro', valor: this.valorTotal }];
    this.mostrarModalFechar = true;
  }

  fecharModalFechar() {
    this.mostrarModalFechar = false;
    this.formasPagamento = [];
    this.descontoFechar = 0;
  }

  aplicarDescontoNoTotal() {
    // Atualiza o valor único das formas para refletir o total com desconto
    const v = this.valorComDesconto;
    if (this.formasPagamento.length === 1) {
      this.formasPagamento[0].valor = v;
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
    return Math.abs(this.somaFormasPagamento - this.valorComDesconto) < 0.01;
  }

  // ==================== PERMISSÕES DE AÇÃO ====================

  get podeFecharComanda(): boolean {
    return this.auth.hasPermissionFecharComanda();
  }

  get podeRemoverItem(): boolean {
    return this.auth.hasPermissionRemoverItemComanda();
  }

  fecharComanda() {
    if (!this.comanda) return;

    const comFormas = this.formasPagamento.filter(f => f.valor > 0 && (f.formaPagamento?.trim() ?? '') !== '');
    if (comFormas.length === 0) {
      this.toast.warning('Informe pelo menos uma forma de pagamento com valor maior que zero.');
      return;
    }
    if (!this.totalBateComFormas) {
      this.toast.warning(`A soma das formas de pagamento (R$ ${this.somaFormasPagamento.toFixed(2)}) deve ser igual ao valor a receber (R$ ${this.valorComDesconto.toFixed(2)}).`);
      return;
    }

    const desconto = Number(this.descontoFechar) || 0;
    this.comandaService.fecharComanda(this.comandaId, { formasPagamento: comFormas, desconto }).subscribe({
      next: () => {
        this.toast.success('Comanda fechada com sucesso!');
        this.fecharModalFechar();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
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

  carregarProdutos() {
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos.filter(p => p.ativo);
      },
      error: () => {}
    });
  }

  abrirModalBebida() {
    this.mostrarModalBebida = true;
    this.produtoSelecionadoId = this.produtos.length > 0 ? this.produtos[0].id : null;
    this.quantidadeProduto = 1;
  }

  fecharModalBebida() {
    this.mostrarModalBebida = false;
    this.produtoSelecionadoId = null;
    this.quantidadeProduto = 1;
  }

  adicionarBebida() {
    if (!this.produtoSelecionadoId || this.quantidadeProduto < 1) {
      this.toast.warning('Selecione um produto e quantidade válidos');
      return;
    }

    this.comandaService.adicionarProduto(this.comandaId, this.produtoSelecionadoId, this.quantidadeProduto).subscribe({
      next: () => {
        this.toast.success('Bebida adicionada com sucesso!');
        this.fecharModalBebida();
        this.carregarComanda();
      },
      error: () => {
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
