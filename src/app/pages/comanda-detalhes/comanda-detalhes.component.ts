import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComandaService } from '../../services/comanda.service';
import { TorneioService } from '../../services/torneio.service';
import { Comanda, TipoComanda, StatusComanda } from '../../models/comanda.model';
import { Torneio } from '../../models/torneio.model';

interface ItemComanda {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
}

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
    private torneioService: TorneioService
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
          this.carregarItens();
          
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

  carregarItens() {
    // Simulação dos itens da comanda
    // Em produção, viria de uma API específica
    this.itens = [
      {
        id: 1,
        produtoId: 1,
        produtoNome: 'Buy-in Inicial',
        quantidade: 1,
        valorUnitario: this.comanda?.valorFichas || 0,
        valorTotal: this.comanda?.valorFichas || 0
      }
    ];
  }

  carregarProdutos() {
    // Carregar lista de produtos/bebidas disponíveis
    // Simulação - em produção viria de uma API
    this.produtos = [
      { id: 1, nome: 'Cerveja', preco: 10.00, categoria: 'BEBIDA' },
      { id: 2, nome: 'Refrigerante', preco: 7.00, categoria: 'BEBIDA' },
      { id: 3, nome: 'Água', preco: 5.00, categoria: 'BEBIDA' },
      { id: 4, nome: 'Porção de Batata', preco: 25.00, categoria: 'COMIDA' },
      { id: 5, nome: 'Sanduíche', preco: 15.00, categoria: 'COMIDA' }
    ];
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

    const novoItem: ItemComanda = {
      id: this.itens.length + 1,
      produtoId: 0,
      produtoNome: 'Buy-in',
      quantidade: 1,
      valorUnitario: valorNumerico,
      valorTotal: valorNumerico
    };
    
    this.itens.push(novoItem);
    this.atualizarValorFichas();
    
    // Mostrar mensagem de confirmação
    if (this.torneio) {
      alert(`Buy-in adicionado: R$ ${valorNumerico.toFixed(2)}`);
    }
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

    const novoItem: ItemComanda = {
      id: this.itens.length + 1,
      produtoId: 0,
      produtoNome: 'Re-buy Simples',
      quantidade: 1,
      valorUnitario: valorNumerico,
      valorTotal: valorNumerico
    };
    
    this.itens.push(novoItem);
    this.atualizarValorFichas();
    
    // Mostrar mensagem de confirmação
    if (this.torneio) {
      alert(`Re-buy Simples adicionado: R$ ${valorNumerico.toFixed(2)}`);
    }
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

    const novoItem: ItemComanda = {
      id: this.itens.length + 1,
      produtoId: 0,
      produtoNome: 'Re-buy Duplo',
      quantidade: 1,
      valorUnitario: valorNumerico,
      valorTotal: valorNumerico
    };
    
    this.itens.push(novoItem);
    this.atualizarValorFichas();
    
    // Mostrar mensagem de confirmação
    if (this.torneio) {
      alert(`Re-buy Duplo adicionado: R$ ${valorNumerico.toFixed(2)}`);
    }
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

    const novoItem: ItemComanda = {
      id: this.itens.length + 1,
      produtoId: 0,
      produtoNome: 'Add-on',
      quantidade: 1,
      valorUnitario: valorNumerico,
      valorTotal: valorNumerico
    };
    
    this.itens.push(novoItem);
    this.atualizarValorFichas();
    
    // Mostrar mensagem de confirmação
    if (this.torneio) {
      alert(`Add-on adicionado: R$ ${valorNumerico.toFixed(2)}`);
    }
  }

  abrirModalBebida() {
    this.mostrarModalBebida = true;
    this.produtoSelecionadoId = this.produtos.length > 0 ? this.produtos[0].id : 0;
    this.quantidadeProduto = 1;
  }

  fecharModalBebida() {
    this.mostrarModalBebida = false;
  }

  adicionarBebida() {
    const produto = this.produtos.find(p => p.id === this.produtoSelecionadoId);
    if (produto && this.quantidadeProduto > 0) {
      const novoItem: ItemComanda = {
        id: this.itens.length + 1,
        produtoId: produto.id,
        produtoNome: produto.nome,
        quantidade: this.quantidadeProduto,
        valorUnitario: produto.preco,
        valorTotal: produto.preco * this.quantidadeProduto
      };
      this.itens.push(novoItem);
      this.atualizarValorBebidas();
      this.fecharModalBebida();
    }
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
      this.comandaService.updateComanda(this.comandaId, { 
        status: StatusComanda.FECHADO 
      }).subscribe({
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
