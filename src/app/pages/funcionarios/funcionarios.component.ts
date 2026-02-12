import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FuncionarioService } from '../../services/funcionario.service';
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
    permissaoCaixas: false
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
    permissaoCaixas: false
  };

  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'GERENTE', label: 'Gerente' },
    { value: 'ATENDENTE', label: 'Atendente' }
  ];

  constructor(private funcionarioService: FuncionarioService) {}

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
      error: (error) => {
        console.error('Erro ao carregar funcionários:', error);
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
      permissaoCaixas: false
    };
  }

  criarFuncionario(): void {
    if (!this.isFormValid()) return;

    this.funcionarioService.createFuncionario(this.novoFuncionario).subscribe({
      next: () => {
        alert('Funcionário cadastrado com sucesso!');
        this.fecharModal();
        this.carregarFuncionarios();
      },
      error: (error) => {
        console.error('Erro ao criar funcionário:', error);
        alert(error.error || 'Erro ao criar funcionário');
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
      permissaoCaixas: funcionario.permissaoCaixas
    };
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
      permissaoCaixas: this.funcionarioEditando.permissaoCaixas
    }).subscribe({
      next: () => {
        if (mudouStatus) {
          this.filtroStatus = this.funcionarioEditando.ativo ? 'ATIVO' : 'INATIVO';
          alert(`Funcionário ${this.funcionarioEditando.ativo ? 'ativado' : 'desativado'} com sucesso!`);
        } else {
          alert('Funcionário atualizado com sucesso!');
        }
        this.fecharModalEdicao();
        this.carregarFuncionarios();
      },
      error: (error) => {
        console.error('Erro ao atualizar funcionário:', error);
        alert(error.error || 'Erro ao atualizar funcionário');
      }
    });
  }

  deletarFuncionario(id: number): void {
    if (!confirm('Deseja realmente desativar este funcionário?')) return;

    this.funcionarioService.deleteFuncionario(id).subscribe({
      next: () => {
        alert('Funcionário desativado com sucesso!');
        this.carregarFuncionarios();
      },
      error: (error) => {
        console.error('Erro ao deletar funcionário:', error);
        alert('Erro ao deletar funcionário');
      }
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
}
