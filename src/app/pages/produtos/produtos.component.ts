import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Produto, CreateProdutoDto } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { AuthService } from '../../services/auth.service';
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
  filtroStatus: 'TODOS' | 'ATIVO' | 'INATIVO' = 'TODOS';
  showModal: boolean = false;
  showModalEdicao: boolean = false;
  showModalEstoque: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;

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

  estoqueAdd: {
    produtoId: number | null;
    quantidade: number;
  } = {
    produtoId: null,
    quantidade: 1
  };

  unidadesVenda: string[] = ['Unidade', 'Caixa', 'Litro', 'Kg', 'Porção', 'Pack'];

  constructor(
    private produtoService: ProdutoService,
    private toast: ToastService,
    private confirm: ConfirmService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.isLoading = true;
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.filtrarProdutos(); // Aplicar filtros após carregar
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  filtrarProdutos(): void {
    const term = this.searchTerm.toLowerCase();
    let resultado = this.produtos;

    // Filtro por status
    if (this.filtroStatus === 'ATIVO') {
      resultado = resultado.filter(p => p.ativo === true);
    } else if (this.filtroStatus === 'INATIVO') {
      resultado = resultado.filter(p => p.ativo === false);
    }

    // Filtro por texto
    if (term) {
      resultado = resultado.filter(p =>
        p.nome.toLowerCase().includes(term) ||
        p.unidadeVenda.toLowerCase().includes(term)
      );
    }

    this.filteredProdutos = resultado;
  }

  setFiltroStatus(filtro: 'TODOS' | 'ATIVO' | 'INATIVO'): void {
    this.filtroStatus = filtro;
    this.filtrarProdutos();
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
    if (!this.isFormValid() || this.isSaving) return;

    this.isSaving = true;
    this.produtoService.createProduto(this.novoProduto).subscribe({
      next: () => {
        this.isSaving = false;
        this.carregarProdutos();
        this.fecharModal();
        this.toast.success('Produto criado com sucesso!');
      },
      error: () => {
        this.isSaving = false;
        this.toast.error('Erro ao criar produto. Tente novamente.');
      }
    });
  }

  deletarProduto(id: number): void {
    this.confirm.confirm({ message: 'Tem certeza que deseja deletar este produto?', confirmText: 'Deletar' }).then(ok => {
      if (!ok) return;
      this.produtoService.deleteProduto(id).subscribe({
        next: () => {
          this.carregarProdutos();
          this.toast.success('Produto deletado com sucesso!');
        },
        error: () => {
          this.toast.error('Erro ao deletar produto. Tente novamente.');
        }
      });
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
      this.toast.warning('Por favor, preencha todos os campos obrigatórios!');
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

    const statusAlterado = this.produtos.find(p => p.id === this.produtoEditando.id)?.ativo !== this.produtoEditando.ativo;

    this.produtoService.updateProduto(this.produtoEditando.id, updateDto).subscribe({
      next: () => {
        // Se o status foi alterado, muda o filtro para mostrar o produto
        if (statusAlterado) {
          if (this.produtoEditando.ativo) {
            this.filtroStatus = 'ATIVO';
          } else {
            this.filtroStatus = 'INATIVO';
          }
        }
        
        this.carregarProdutos();
        this.fecharModalEdicao();
        
        const statusMsg = this.produtoEditando.ativo ? 'ativado' : 'desativado';
        this.toast.success(`Produto ${statusAlterado ? statusMsg : 'atualizado'} com sucesso!`);
      },
      error: () => {
        this.toast.error('Erro ao atualizar produto. Tente novamente.');
      }
    });
  }

  calcularMargem(produto: Produto): number {
    if (produto.valorCusto === 0) return 0;
    return ((produto.valorComercial - produto.valorCusto) / produto.valorCusto) * 100;
  }

  // Modal de Adicionar Estoque
  abrirModalEstoque(): void {
    // Recarregar produtos antes de abrir o modal para ter dados atualizados
    if (this.produtos.length === 0) {
      this.carregarProdutos();
    }
    this.resetarFormEstoque();
    this.showModalEstoque = true;
  }

  fecharModalEstoque(): void {
    this.showModalEstoque = false;
    this.resetarFormEstoque();
  }

  resetarFormEstoque(): void {
    this.estoqueAdd = {
      produtoId: null,
      quantidade: 1
    };
  }

  onProdutoEstoqueChange(): void {
    // Método chamado quando o produto é selecionado ou quantidade é alterada
  }

  getEstoqueAtual(): number {
    if (!this.estoqueAdd.produtoId) return 0;
    // Converter para number para garantir comparação correta
    const produtoId = Number(this.estoqueAdd.produtoId);
    const produto = this.produtos.find(p => p.id === produtoId);
    return produto ? produto.quantidadeEstoque : 0;
  }

  getNovoEstoque(): number {
    return this.getEstoqueAtual() + (Number(this.estoqueAdd.quantidade) || 0);
  }

  isFormEstoqueValid(): boolean {
    return this.estoqueAdd.produtoId !== null && 
           Number(this.estoqueAdd.quantidade) > 0;
  }

  adicionarEstoque(): void {
    if (!this.isFormEstoqueValid() || this.isSaving) return;

    const produtoId = Number(this.estoqueAdd.produtoId);
    const produto = this.produtos.find(p => p.id === produtoId);

    if (!produto) {
      this.toast.error('Produto não encontrado!');
      return;
    }

    const quantidadeAdicionar = Number(this.estoqueAdd.quantidade);
    const novoEstoque = produto.quantidadeEstoque + quantidadeAdicionar;

    const updateDto = {
      nome: produto.nome,
      valorCusto: produto.valorCusto,
      valorComercial: produto.valorComercial,
      quantidadeEstoque: novoEstoque,
      unidadeVenda: produto.unidadeVenda,
      ativo: produto.ativo
    };

    this.isSaving = true;
    this.produtoService.updateProduto(produto.id, updateDto).subscribe({
      next: () => {
        this.isSaving = false;
        this.carregarProdutos();
        this.fecharModalEstoque();
        this.toast.success(`Estoque atualizado! ${produto.nome}: ${produto.quantidadeEstoque} → ${novoEstoque}`);
      },
      error: () => {
        this.isSaving = false;
        this.toast.error('Erro ao adicionar estoque. Tente novamente.');
      }
    });
  }
}
