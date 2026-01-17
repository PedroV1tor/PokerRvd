import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComandaService } from '../../services/comanda.service';
import { TorneioService } from '../../services/torneio.service';
import { ProdutoService } from '../../services/produto.service';
import { Comanda, TipoComanda, StatusComanda, ItemComanda } from '../../models/comanda.model';
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
  produtos: Produto[] = [];
  loading = false;
  comandaId: number = 0;

  // Modal de adicionar item
  mostrarModalBebida = false;
  produtoSelecionadoId: number = 0;
  quantidadeProduto: number = 1;

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
      this.carregarProdutos();
    }
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

  // Método removido - itens agora vêm direto da API no carregarComanda()

  carregarProdutos() {
    // Carregar lista de produtos cadastrados da API
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos. Verifique se há produtos cadastrados.');
      }
    });
  }

  adicionarBuyIn() {
    if (!this.comanda) return;

    let valorNumerico: number;

    // Se houver torneio vinculado, usar valor do torneio
    if (this.torneio && this.torneio.valorBuyIn > 0) {
      valorNumerico = this.torneio.valorBuyIn;
    } else {
      // Caso contrário, perguntar o valor
      const valor = prompt('Digite o valor do Buy-in:');
      if (!valor) return;
      
      valorNumerico = parseFloat(valor);
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        alert('Valor inválido');
        return;
      }
    }

    // Adicionar via API
    console.log('Chamando adicionarFichas com:', { comandaId: this.comanda.id, nome: 'Buy-in', valor: valorNumerico });
    
    this.comandaService.adicionarFichas(this.comanda.id, 'Buy-in', valorNumerico).subscribe({
      next: () => {
        console.log('Buy-in adicionado com sucesso');
        alert(`Buy-in de R$ ${valorNumerico.toFixed(2)} adicionado!`);
        this.carregarComanda(); // Recarregar para atualizar itens e valores
      },
      error: (error) => {
        console.error('Erro completo ao adicionar Buy-in:', error);
        console.error('Status:', error.status);
        console.error('Mensagem:', error.message);
        console.error('Erro do servidor:', error.error);
        alert('Erro ao adicionar Buy-in. Tente novamente.');
      }
    });
  }

  adicionarRebuySimples() {
    if (!this.comanda) return;

    let valorNumerico: number;

    // Se houver torneio vinculado, usar valor do torneio
    if (this.torneio && this.torneio.valorRebuySimples > 0) {
      valorNumerico = this.torneio.valorRebuySimples;
    } else {
      // Caso contrário, perguntar o valor
      const valor = prompt('Digite o valor do Re-buy Simples:');
      if (!valor) return;
      
      valorNumerico = parseFloat(valor);
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        alert('Valor inválido');
        return;
      }
    }

    // Adicionar via API
    this.comandaService.adicionarFichas(this.comanda.id, 'Re-buy Simples', valorNumerico).subscribe({
      next: () => {
        alert(`Re-buy Simples de R$ ${valorNumerico.toFixed(2)} adicionado!`);
        this.carregarComanda();
      },
      error: (error) => {
        console.error('Erro ao adicionar Re-buy:', error);
        alert('Erro ao adicionar Re-buy. Tente novamente.');
      }
    });
  }

  adicionarRebuyDuplo() {
    if (!this.comanda) return;

    let valorNumerico: number;

    // Se houver torneio vinculado, usar valor do torneio
    if (this.torneio && this.torneio.valorRebuyDuplo > 0) {
      valorNumerico = this.torneio.valorRebuyDuplo;
    } else {
      // Caso contrário, perguntar o valor
      const valor = prompt('Digite o valor do Re-buy Duplo:');
      if (!valor) return;
      
      valorNumerico = parseFloat(valor);
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        alert('Valor inválido');
        return;
      }
    }

    // Adicionar via API
    this.comandaService.adicionarFichas(this.comanda.id, 'Re-buy Duplo', valorNumerico).subscribe({
      next: () => {
        alert(`Re-buy Duplo de R$ ${valorNumerico.toFixed(2)} adicionado!`);
        this.carregarComanda();
      },
      error: (error) => {
        console.error('Erro ao adicionar Re-buy Duplo:', error);
        alert('Erro ao adicionar Re-buy Duplo. Tente novamente.');
      }
    });
  }

  adicionarAddOn() {
    if (!this.comanda) return;

    let valorNumerico: number;

    // Se houver torneio vinculado, usar valor do torneio
    if (this.torneio && this.torneio.valorAddOn > 0) {
      valorNumerico = this.torneio.valorAddOn;
    } else {
      // Caso contrário, perguntar o valor
      const valor = prompt('Digite o valor do Add-on:');
      if (!valor) return;
      
      valorNumerico = parseFloat(valor);
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        alert('Valor inválido');
        return;
      }
    }

    // Adicionar via API
    this.comandaService.adicionarFichas(this.comanda.id, 'Add-on', valorNumerico).subscribe({
      next: () => {
        alert(`Add-on de R$ ${valorNumerico.toFixed(2)} adicionado!`);
        this.carregarComanda();
      },
      error: (error) => {
        console.error('Erro ao adicionar Add-on:', error);
        alert('Erro ao adicionar Add-on. Tente novamente.');
      }
    });
  }

  abrirModalBebida() {
    console.log('Abrindo modal - Produtos disponíveis:', this.produtos);
    this.mostrarModalBebida = true;
    this.produtoSelecionadoId = this.produtos.length > 0 ? this.produtos[0].id : 0;
    this.quantidadeProduto = 1;
    console.log('Produto pré-selecionado ID:', this.produtoSelecionadoId);
  }

  fecharModalBebida() {
    this.mostrarModalBebida = false;
  }

  adicionarBebida() {
    if (!this.comanda) return;

    // Converter para number pois o select retorna string
    const produtoId = Number(this.produtoSelecionadoId);
    const produto = this.produtos.find(p => p.id === produtoId);
    
    console.log('Produto selecionado ID:', this.produtoSelecionadoId, 'Convertido:', produtoId);
    console.log('Produto encontrado:', produto);
    console.log('Quantidade:', this.quantidadeProduto);
    
    if (!produto || this.quantidadeProduto <= 0) {
      alert('Selecione um produto e quantidade válida');
      return;
    }

    // Verificar estoque disponível
    if (produto.quantidadeEstoque < this.quantidadeProduto) {
      alert(`Estoque insuficiente! Disponível: ${produto.quantidadeEstoque} ${produto.unidadeVenda}`);
      return;
    }

    // Adicionar item à comanda via API
    const addItemDto = {
      produtoId: produto.id,
      quantidade: this.quantidadeProduto
    };

    this.comandaService.adicionarProduto(this.comanda.id, addItemDto.produtoId, addItemDto.quantidade).subscribe({
      next: () => {
        alert(`${produto.nome} adicionado com sucesso!`);
        this.carregarComanda(); // Recarregar comanda para atualizar valores
        this.carregarProdutos(); // Recarregar produtos para atualizar estoque disponível
        this.fecharModalBebida();
      },
      error: (error) => {
        console.error('Erro ao adicionar produto:', error);
        alert('Erro ao adicionar produto. Tente novamente.');
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

  fecharComanda() {
    if (!this.comanda) return;

    const confirmar = confirm(
      `Fechar comanda de ${this.comanda.jogadorNome}?\n\nTotal: R$ ${this.valorTotal.toFixed(2)}`
    );

    if (confirmar) {
      this.comandaService.fecharComanda(this.comandaId).subscribe({
        next: () => {
          alert('Comanda fechada com sucesso!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erro ao fechar comanda:', error);
          alert('Erro ao fechar comanda. Tente novamente.');
        }
      });
    }
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
