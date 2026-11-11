import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FuncionarioService } from '../../services/funcionario.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { Funcionario, CreateFuncionarioDto, UpdateFuncionarioDto } from '../../models/funcionario.model';
import { PermissaoKey, SECOES_PERMISSOES, copiarPermissoes } from '../../models/permissoes.model';

type PermissoesAlvo = CreateFuncionarioDto | (UpdateFuncionarioDto & { id: number });

interface ModuloPermissao {
  id: string;
  label: string;
  icon: string;
  children: { key: PermissaoKey; label: string }[];
}

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
    ...copiarPermissoes()
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
    ...copiarPermissoes()
  };

  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'GERENTE', label: 'Gerente' },
    { value: 'ATENDENTE', label: 'Atendente' }
  ];

  novaSenhaEdicao = '';

  constructor(
    private funcionarioService: FuncionarioService,
    private toast: ToastService,
    private confirm: ConfirmService,
    public auth: AuthService
  ) {}

  get podeAlterarSenha(): boolean {
    return this.auth.isAdmin();
  }

  /** Só ADMIN cria ou altera outro ADMIN (a API também recusa). */
  get rolesDisponiveis() {
    return this.auth.isAdmin() ? this.roles : this.roles.filter(r => r.value !== 'ADMIN');
  }

  podeGerenciar(funcionario: Funcionario): boolean {
    return this.auth.isAdmin() || funcionario.role !== 'ADMIN';
  }

  /** Sem ser ADMIN, só concede o que também possui; pode retirar o que o funcionário já tem. */
  podeConceder(target: PermissoesAlvo, key: PermissaoKey): boolean {
    return this.auth.isAdmin() || !!this.auth.getCurrentUser()?.[key] || target[key];
  }

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
      ...copiarPermissoes()
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
    this.novaSenhaEdicao = '';
    this.funcionarioEditando = {
      id: funcionario.id,
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      email: funcionario.email,
      role: funcionario.role,
      ativo: funcionario.ativo,
      ...copiarPermissoes(funcionario)
    };
    this.modalEdicaoTab = 'conta';
    this.showModalEdicao = true;
  }

  fecharModalEdicao(): void {
    this.showModalEdicao = false;
    this.novaSenhaEdicao = '';
  }

  salvarEdicao(): void {
    if (!this.isFormEdicaoValid()) return;

    if (this.novaSenhaEdicao && this.novaSenhaEdicao.length < 8) {
      this.toast.warning('A nova senha deve ter no mínimo 8 caracteres');
      return;
    }

    const antigoAtivo = this.funcionarios.find(f => f.id === this.funcionarioEditando.id)?.ativo;
    const mudouStatus = antigoAtivo !== this.funcionarioEditando.ativo;

    this.funcionarioService.updateFuncionario(this.funcionarioEditando.id, {
      nome: this.funcionarioEditando.nome,
      cpf: this.funcionarioEditando.cpf,
      email: this.funcionarioEditando.email,
      role: this.funcionarioEditando.role,
      ativo: this.funcionarioEditando.ativo,
      novaSenha: this.novaSenhaEdicao || undefined,
      ...copiarPermissoes(this.funcionarioEditando)
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

  // --- Árvore de permissões: uma entrada por seção do header ---
  moduloExpanded: Record<string, boolean> = { comandas: true };

  modulosPermissoes = SECOES_PERMISSOES.map(secao => ({
    id: secao.id,
    label: `Seção ${secao.label}`,
    icon: secao.icon,
    children: [
      { key: secao.secao as PermissaoKey, label: `Acessar ${secao.label}` },
      ...secao.acoes.map(acao => ({ key: acao.key as PermissaoKey, label: acao.label as string }))
    ]
  }));

  toggleModuloExpand(id: string): void {
    this.moduloExpanded[id] = !this.moduloExpanded[id];
  }

  isModuloChecked(target: PermissoesAlvo, modulo: ModuloPermissao): boolean {
    return modulo.children.every(c => target[c.key]);
  }

  isModuloIndeterminate(target: PermissoesAlvo, modulo: ModuloPermissao): boolean {
    const marcadas = modulo.children.filter(c => target[c.key]).length;
    return marcadas > 0 && marcadas < modulo.children.length;
  }

  setModuloChecked(target: PermissoesAlvo, modulo: ModuloPermissao, value: boolean): void {
    modulo.children
      .filter(c => this.podeConceder(target, c.key))
      .forEach(c => (target[c.key] = value));
  }

  getPermissao(target: PermissoesAlvo, key: PermissaoKey): boolean {
    return target[key];
  }

  setPermissao(target: PermissoesAlvo, key: PermissaoKey, value: boolean): void {
    target[key] = value;
  }
}
