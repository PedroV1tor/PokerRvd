import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComandaService } from '../../services/comanda.service';
import { TorneioService } from '../../services/torneio.service';
import { ProdutoService } from '../../services/produto.service';
import { Comanda, TipoComanda, StatusComanda, ItemComanda, FormaPagamentoValor } from '../../models/comanda.model';
import { Torneio } from '../../models/torneio.model';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-comanda-detalhes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comanda-detalhes.component.html',
  styleUrl: './comanda-detalhes.component.scss'
})
export class ComandaDetalhesComponent implements OnInit {
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

  StatusComanda = StatusComanda;
  TipoComanda = TipoComanda;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private comandaService: ComandaService,
    private torneioService: TorneioService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit() {
    this.comandaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.comandaId) {
      this.carregarComanda();
    }
    this.carregarProdutos();
  }

  carregarComanda() {
    this.loading = true;
    this.comandaService.getComanda(this.comandaId).subscribe({
      next: (comanda) => {
        if (comanda) {
          this.comanda = comanda;
          this.itens = comanda.itens || [];
          console.log('Itens carregados:', this.itens);
          
          // Carregar torneio se a comanda estiver vinculada a um
          if (comanda.torneioId) {
            this.carregarTorneio(comanda.torneioId);
          }
        } else {
          console.error('Comanda não encontrada');
          this.router.navigate(['/dashboard']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar comanda:', error);
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
      error: (error) => {
        console.error('Erro ao carregar torneio:', error);
      }
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
      alert('Digite um nome para as fichas');
      return;
    }

    if (!this.valorFichas || this.valorFichas <= 0) {
      alert('Digite um valor válido');
      return;
    }

    this.adicionarFichasDireto(this.nomeFichas.trim(), this.valorFichas);
  }

  adicionarFichasDireto(nome: string, valor: number) {
    if (!this.comanda) return;

    // Adicionar via API
    this.comandaService.adicionarFichas(this.comanda.id, nome, valor).subscribe({
      next: () => {
        alert(`${nome} de R$ ${valor.toFixed(2)} adicionado com sucesso!`);
        this.fecharModalFichas();
        this.carregarComanda();
      },
      error: (error) => {
        console.error(`Erro ao adicionar ${nome}:`, error);
        alert(`Erro ao adicionar ${nome}. Tente novamente.`);
      }
    });
  }

  removerItem(index: number) {
    if (confirm('Deseja realmente remover este item?')) {
      const item = this.itens[index];
      this.itens.splice(index, 1);
      
      // Atualizar valores
      if (item.produtoId === 0) {
        this.atualizarValorFichas();
      } else {
        this.atualizarValorBebidas();
      }
    }
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

  abrirModalFechar() {
    this.formasPagamento = [{ formaPagamento: 'Dinheiro', valor: 0 }];
    this.mostrarModalFechar = true;
  }

  fecharModalFechar() {
    this.mostrarModalFechar = false;
    this.formasPagamento = [];
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
    return Math.abs(this.somaFormasPagamento - this.valorTotal) < 0.01;
  }

  fecharComanda() {
    if (!this.comanda) return;

    const comFormas = this.formasPagamento.filter(f => f.valor > 0 && (f.formaPagamento?.trim() ?? '') !== '');
    if (comFormas.length === 0) {
      alert('Informe pelo menos uma forma de pagamento com valor maior que zero.');
      return;
    }
    if (!this.totalBateComFormas) {
      alert(`A soma das formas de pagamento (R$ ${this.somaFormasPagamento.toFixed(2)}) deve ser igual ao total da comanda (R$ ${this.valorTotal.toFixed(2)}).`);
      return;
    }

    this.comandaService.fecharComanda(this.comandaId, { formasPagamento: comFormas }).subscribe({
      next: () => {
        alert('Comanda fechada com sucesso!');
        this.fecharModalFechar();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erro ao fechar comanda:', error);
        alert(error.error?.message || error.error || 'Erro ao fechar comanda. Tente novamente.');
      }
    });
  }

  carregarProdutos() {
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos.filter(p => p.ativo);
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
      }
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
      alert('Selecione um produto e quantidade válidos');
      return;
    }

    this.comandaService.adicionarProduto(this.comandaId, this.produtoSelecionadoId, this.quantidadeProduto).subscribe({
      next: () => {
        alert('Bebida adicionada com sucesso!');
        this.fecharModalBebida();
        this.carregarComanda();
      },
      error: (error) => {
        console.error('Erro ao adicionar bebida:', error);
        alert('Erro ao adicionar bebida. Tente novamente.');
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
