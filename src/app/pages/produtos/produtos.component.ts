import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Produto, CreateProdutoDto } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  filteredProdutos: Produto[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  showModalEdicao: boolean = false;
  isLoading: boolean = false;

  novoProduto: CreateProdutoDto = {
    nome: '',
    valorCusto: 0,
    valorComercial: 0,
    quantidadeEstoque: 0,
    unidadeVenda: 'Unidade'
  };

  produtoEditando: any = {
    id: 0,
    nome: '',
    valorCusto: 0,
    valorComercial: 0,
    quantidadeEstoque: 0,
    unidadeVenda: 'Unidade',
    ativo: true
  };

  unidadesVenda: string[] = ['Unidade', 'Caixa', 'Litro', 'Kg', 'Porção', 'Pack'];

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.isLoading = true;
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.filteredProdutos = produtos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.isLoading = false;
      }
    });
  }

  filtrarProdutos(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProdutos = this.produtos.filter(p =>
      p.nome.toLowerCase().includes(term) ||
      p.unidadeVenda.toLowerCase().includes(term)
    );
  }

  abrirModal(): void {
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.resetarForm();
  }

  resetarForm(): void {
    this.novoProduto = {
      nome: '',
      valorCusto: 0,
      valorComercial: 0,
      quantidadeEstoque: 0,
      unidadeVenda: 'Unidade'
    };
  }

  isFormValid(): boolean {
    return this.novoProduto.nome.trim() !== '' &&
           this.novoProduto.valorComercial > 0 &&
           this.novoProduto.quantidadeEstoque >= 0;
  }

  criarProduto(): void {
    if (!this.isFormValid()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    this.produtoService.createProduto(this.novoProduto).subscribe({
      next: (produto) => {
        console.log('Produto criado:', produto);
        this.carregarProdutos();
        this.fecharModal();
        alert('Produto criado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao criar produto:', error);
        alert('Erro ao criar produto. Tente novamente.');
      }
    });
  }

  deletarProduto(id: number): void {
    if (!confirm('Tem certeza que deseja deletar este produto?')) {
      return;
    }

    this.produtoService.deleteProduto(id).subscribe({
      next: () => {
        this.carregarProdutos();
        alert('Produto deletado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao deletar produto:', error);
        alert('Erro ao deletar produto. Tente novamente.');
      }
    });
  }

  abrirModalEdicao(produto: Produto): void {
    this.produtoEditando = {
      id: produto.id,
      nome: produto.nome,
      valorCusto: produto.valorCusto,
      valorComercial: produto.valorComercial,
      quantidadeEstoque: produto.quantidadeEstoque,
      unidadeVenda: produto.unidadeVenda,
      ativo: produto.ativo
    };
    this.showModalEdicao = true;
  }

  fecharModalEdicao(): void {
    this.showModalEdicao = false;
  }

  isFormEdicaoValid(): boolean {
    return this.produtoEditando.nome.trim() !== '' &&
           this.produtoEditando.valorComercial > 0 &&
           this.produtoEditando.quantidadeEstoque >= 0;
  }

  salvarEdicao(): void {
    if (!this.isFormEdicaoValid()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const updateDto = {
      nome: this.produtoEditando.nome,
      valorCusto: this.produtoEditando.valorCusto,
      valorComercial: this.produtoEditando.valorComercial,
      quantidadeEstoque: this.produtoEditando.quantidadeEstoque,
      unidadeVenda: this.produtoEditando.unidadeVenda,
      ativo: this.produtoEditando.ativo
    };

    this.produtoService.updateProduto(this.produtoEditando.id, updateDto).subscribe({
      next: () => {
        this.carregarProdutos();
        this.fecharModalEdicao();
        alert('Produto atualizado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao atualizar produto:', error);
        alert('Erro ao atualizar produto. Tente novamente.');
      }
    });
  }

  calcularMargem(produto: Produto): number {
    if (produto.valorCusto === 0) return 0;
    return ((produto.valorComercial - produto.valorCusto) / produto.valorCusto) * 100;
  }
}
