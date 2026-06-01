import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FuncionarioService } from '../../services/funcionario.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { Funcionario, CreateFuncionarioDto, UpdateFuncionarioDto, UserRole } from '../../models/funcionario.model';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './funcionarios.component.html',
  styleUrl: './funcionarios.component.scss'
})
export class FuncionariosComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  filteredFuncionarios: Funcionario[] = [];
  isLoading = false;
  searchTerm = '';
  filtroStatus: 'TODOS' | 'ATIVO' | 'INATIVO' = 'TODOS';

  // Modal Novo Funcionário
  showModal = false;
  novoFuncionario: CreateFuncionarioDto = {
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    role: 'ATENDENTE',
    permissaoComandas: false,
    permissaoTorneios: false,
    permissaoProdutos: false,
    permissaoFuncionarios: false,
    permissaoCaixas: false,
    permissaoConferencia: false,
    permissaoFecharComanda: false,
    permissaoRemoverItemComanda: false,
    permissaoAdicionarEstoque: false,
    permissaoCadastrarProduto: false
  };

  // Modal Editar Funcionário
  showModalEdicao = false;
  funcionarioEditando: UpdateFuncionarioDto & { id: number } = {
    id: 0,
    nome: '',
    cpf: '',
    email: '',
    role: 'ATENDENTE',
    ativo: true,
    permissaoComandas: false,
    permissaoTorneios: false,
    permissaoProdutos: false,
    permissaoFuncionarios: false,
    permissaoCaixas: false,
    permissaoConferencia: false,
    permissaoFecharComanda: false,
    permissaoRemoverItemComanda: false,
    permissaoAdicionarEstoque: false,
    permissaoCadastrarProduto: false
  };

  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'GERENTE', label: 'Gerente' },
    { value: 'ATENDENTE', label: 'Atendente' }
  ];

  constructor(
    private funcionarioService: FuncionarioService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.isLoading = true;
    this.funcionarioService.getFuncionarios().subscribe({
      next: (funcionarios) => {
        this.funcionarios = funcionarios;
        this.filtrarFuncionarios();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  filtrarFuncionarios(): void {
    const term = this.searchTerm.toLowerCase();
    let resultado = this.funcionarios;

    // Filtro por status
    if (this.filtroStatus === 'ATIVO') {
      resultado = resultado.filter(f => f.ativo === true);
    } else if (this.filtroStatus === 'INATIVO') {
      resultado = resultado.filter(f => f.ativo === false);
    }

    // Filtro por texto
    if (term) {
      resultado = resultado.filter(f =>
        f.nome.toLowerCase().includes(term) ||
        f.cpf.includes(term) ||
        f.email.toLowerCase().includes(term)
      );
    }

    this.filteredFuncionarios = resultado;
  }

  setFiltroStatus(filtro: 'TODOS' | 'ATIVO' | 'INATIVO'): void {
    this.filtroStatus = filtro;
    this.filtrarFuncionarios();
  }

  onSearchChange(): void {
    this.filtrarFuncionarios();
  }

  abrirModal(): void {
    this.showModal = true;
    this.modalTab = 'conta';
    this.resetarForm();
  }

  fecharModal(): void {
    this.showModal = false;
    this.resetarForm();
  }

  resetarForm(): void {
    this.novoFuncionario = {
      nome: '',
      cpf: '',
      email: '',
      senha: '',
      role: 'ATENDENTE',
      permissaoComandas: false,
      permissaoTorneios: false,
      permissaoProdutos: false,
      permissaoFuncionarios: false,
      permissaoCaixas: false,
      permissaoConferencia: false,
      permissaoFecharComanda: false,
      permissaoRemoverItemComanda: false,
      permissaoAdicionarEstoque: false,
      permissaoCadastrarProduto: false
    };
  }

  criarFuncionario(): void {
    if (!this.isFormValid()) return;

    this.funcionarioService.createFuncionario(this.novoFuncionario).subscribe({
      next: () => {
        this.toast.success('Funcionário cadastrado com sucesso!');
        this.fecharModal();
        this.carregarFuncionarios();
      },
      error: (error) => {
        this.toast.error(error.error || 'Erro ao criar funcionário');
      }
    });
  }

  abrirModalEdicao(funcionario: Funcionario): void {
    this.funcionarioEditando = {
      id: funcionario.id,
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      email: funcionario.email,
      role: funcionario.role,
      ativo: funcionario.ativo,
      permissaoComandas: funcionario.permissaoComandas,
      permissaoTorneios: funcionario.permissaoTorneios,
      permissaoProdutos: funcionario.permissaoProdutos,
      permissaoFuncionarios: funcionario.permissaoFuncionarios,
      permissaoCaixas: funcionario.permissaoCaixas,
      permissaoConferencia: funcionario.permissaoConferencia,
      permissaoFecharComanda: funcionario.permissaoFecharComanda,
      permissaoRemoverItemComanda: funcionario.permissaoRemoverItemComanda,
      permissaoAdicionarEstoque: funcionario.permissaoAdicionarEstoque ?? false,
      permissaoCadastrarProduto: funcionario.permissaoCadastrarProduto ?? false
    };
    this.modalEdicaoTab = 'conta';
    this.showModalEdicao = true;
  }

  fecharModalEdicao(): void {
    this.showModalEdicao = false;
  }

  salvarEdicao(): void {
    if (!this.isFormEdicaoValid()) return;

    const antigoAtivo = this.funcionarios.find(f => f.id === this.funcionarioEditando.id)?.ativo;
    const mudouStatus = antigoAtivo !== this.funcionarioEditando.ativo;

    this.funcionarioService.updateFuncionario(this.funcionarioEditando.id, {
      nome: this.funcionarioEditando.nome,
      cpf: this.funcionarioEditando.cpf,
      email: this.funcionarioEditando.email,
      role: this.funcionarioEditando.role,
      ativo: this.funcionarioEditando.ativo,
      permissaoComandas: this.funcionarioEditando.permissaoComandas,
      permissaoTorneios: this.funcionarioEditando.permissaoTorneios,
      permissaoProdutos: this.funcionarioEditando.permissaoProdutos,
      permissaoFuncionarios: this.funcionarioEditando.permissaoFuncionarios,
      permissaoCaixas: this.funcionarioEditando.permissaoCaixas,
      permissaoConferencia: this.funcionarioEditando.permissaoConferencia,
      permissaoFecharComanda: this.funcionarioEditando.permissaoFecharComanda,
      permissaoRemoverItemComanda: this.funcionarioEditando.permissaoRemoverItemComanda,
      permissaoAdicionarEstoque: this.funcionarioEditando.permissaoAdicionarEstoque ?? false,
      permissaoCadastrarProduto: this.funcionarioEditando.permissaoCadastrarProduto ?? false
    }).subscribe({
      next: () => {
        if (mudouStatus) {
          this.filtroStatus = this.funcionarioEditando.ativo ? 'ATIVO' : 'INATIVO';
          this.toast.success(`Funcionário ${this.funcionarioEditando.ativo ? 'ativado' : 'desativado'} com sucesso!`);
        } else {
          this.toast.success('Funcionário atualizado com sucesso!');
        }
        this.fecharModalEdicao();
        this.carregarFuncionarios();
      },
      error: (error) => {
        this.toast.error(error.error || 'Erro ao atualizar funcionário');
      }
    });
  }

  deletarFuncionario(id: number): void {
    this.confirm.confirm({ message: 'Deseja realmente desativar este funcionário?', confirmText: 'Desativar' }).then(ok => {
      if (!ok) return;
      this.funcionarioService.deleteFuncionario(id).subscribe({
        next: () => {
          this.toast.success('Funcionário desativado com sucesso!');
          this.carregarFuncionarios();
        },
        error: () => {
          this.toast.error('Erro ao deletar funcionário');
        }
      });
    });
  }

  isFormValid(): boolean {
    return this.novoFuncionario.nome.trim() !== '' &&
           this.novoFuncionario.cpf.trim() !== '' &&
           this.novoFuncionario.email.trim() !== '' &&
           this.novoFuncionario.senha.trim() !== '' &&
           this.novoFuncionario.senha.length >= 6;
  }

  isFormEdicaoValid(): boolean {
    return this.funcionarioEditando.nome.trim() !== '' &&
           this.funcionarioEditando.cpf.trim() !== '' &&
           this.funcionarioEditando.email.trim() !== '';
  }

  formatarCpf(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  }

  getRoleLabel(role: string): string {
    const found = this.roles.find(r => r.value === role);
    return found ? found.label : role;
  }

  getFuncionariosAtivos(): number {
    return this.funcionarios.filter(f => f.ativo).length;
  }

  getFuncionariosInativos(): number {
    return this.funcionarios.filter(f => !f.ativo).length;
  }

  // --- Abas do modal ---
  modalTab: 'conta' | 'permissoes' = 'conta';
  modalEdicaoTab: 'conta' | 'permissoes' = 'conta';

  setModalTab(tab: 'conta' | 'permissoes'): void {
    this.modalTab = tab;
  }

  setModalEdicaoTab(tab: 'conta' | 'permissoes'): void {
    this.modalEdicaoTab = tab;
  }

  // --- Árvore de permissões (módulos e itens) ---
  moduloExpanded: Record<string, boolean> = {
    comandas: true,
    torneios: false,
    produtos: false,
    funcionarios: false,
    caixas: false
  };

  modulosPermissoes: { id: string; label: string; icon: string; children: { key: keyof Pick<CreateFuncionarioDto, 'permissaoComandas' | 'permissaoTorneios' | 'permissaoProdutos' | 'permissaoFuncionarios' | 'permissaoCaixas' | 'permissaoConferencia' | 'permissaoFecharComanda' | 'permissaoRemoverItemComanda' | 'permissaoAdicionarEstoque' | 'permissaoCadastrarProduto'>; label: string }[] }[] = [
    {
      id: 'comandas',
      label: 'Módulo Comandas',
      icon: '🎮',
      children: [
        { key: 'permissaoComandas', label: 'Comandas' },
        { key: 'permissaoFecharComanda', label: 'Fechar Comanda' },
        { key: 'permissaoRemoverItemComanda', label: 'Remover itens da comanda' }
      ]
    },
    { id: 'torneios', label: 'Módulo Torneios', icon: '🏆', children: [{ key: 'permissaoTorneios', label: 'Torneios' }] },
    {
      id: 'produtos',
      label: 'Módulo Produtos',
      icon: '📦',
      children: [
        { key: 'permissaoProdutos', label: 'Produtos' },
        { key: 'permissaoCadastrarProduto', label: 'Cadastrar produto' },
        { key: 'permissaoAdicionarEstoque', label: 'Adicionar estoque' }
      ]
    },
    { id: 'funcionarios', label: 'Módulo Funcionários', icon: '👥', children: [{ key: 'permissaoFuncionarios', label: 'Funcionários' }] },
    { id: 'caixas', label: 'Módulo Caixas', icon: '💰', children: [{ key: 'permissaoCaixas', label: 'Caixas' }, { key: 'permissaoConferencia', label: 'Conferência de Caixa' }] }
  ];

  toggleModuloExpand(id: string): void {
    this.moduloExpanded[id] = !this.moduloExpanded[id];
  }

  isModuloChecked(target: CreateFuncionarioDto | (UpdateFuncionarioDto & { id: number }), modulo: typeof this.modulosPermissoes[0]): boolean {
    return modulo.children.every(c => (target as unknown as Record<string, boolean>)[c.key] === true);
  }

  isModuloIndeterminate(target: CreateFuncionarioDto | (UpdateFuncionarioDto & { id: number }), modulo: typeof this.modulosPermissoes[0]): boolean {
    const checked = modulo.children.filter(c => (target as unknown as Record<string, boolean>)[c.key] === true).length;
    return checked > 0 && checked < modulo.children.length;
  }

  setModuloChecked(target: CreateFuncionarioDto | (UpdateFuncionarioDto & { id: number }), modulo: typeof this.modulosPermissoes[0], value: boolean): void {
    modulo.children.forEach(c => ((target as unknown as Record<string, boolean>)[c.key] = value));
  }

  /** Lê valor de permissão por chave (evita problema de binding com chave dinâmica). */
  getPermissao(target: CreateFuncionarioDto | (UpdateFuncionarioDto & { id: number }), key: string): boolean {
    return !!(target as unknown as Record<string, boolean>)[key];
  }

  /** Atualiza valor de permissão por chave. */
  setPermissao(target: CreateFuncionarioDto | (UpdateFuncionarioDto & { id: number }), key: string, value: boolean): void {
    (target as unknown as Record<string, boolean>)[key] = value;
  }
}
