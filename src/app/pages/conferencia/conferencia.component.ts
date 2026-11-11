import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ConferenciaService } from '../../services/conferencia.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { AuthService } from '../../services/auth.service';
import { Conferencia, CreateConferenciaDto, UpdateConferenciaDto } from '../../models/conferencia.model';

@Component({
  selector: 'app-conferencia',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './conferencia.component.html',
  styleUrl: './conferencia.component.scss'
})
export class ConferenciaComponent implements OnInit {
  conferencias: Conferencia[] = [];
  loading = false;
  saving = false;
  dirtyIds = new Set<number>();
  editingIds = new Set<number>();
  expandedIds = new Set<number>();
  searchTerm = '';

  get conferenciasFiltradas(): Conferencia[] {
    if (!this.searchTerm.trim()) {
      return this.conferencias;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.conferencias.filter(item => {
      const obsMatch = item.observacao?.toLowerCase().includes(term);
      const dataFormatada = this.formatarData(item.dia).toLowerCase();
      const dateMatch = dataFormatada.includes(term);
      const dateRawMatch = item.dia?.toLowerCase().includes(term);
      return obsMatch || dateMatch || dateRawMatch;
    });
  }

  constructor(
    private service: ConferenciaService,
    private router: Router,
    private toast: ToastService,
    private confirm: ConfirmService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    if (!this.auth.hasPermissionConferencia()) {
      this.toast.error('Você não tem permissão para acessar esta página.');
      this.router.navigate(['/dashboard']);
      return;
    }
    this.carregarConferencias();
  }

  carregarConferencias() {
    this.loading = true;
    this.service.getConferencias().subscribe({
      next: (data) => {
        this.conferencias = data.sort((a, b) => new Date(b.dia).getTime() - new Date(a.dia).getTime());
        this.dirtyIds.clear();
        this.editingIds.clear();
        this.expandedIds.clear();
        this.loading = false;
      },
      error: (err) => {
        this.toast.error('Erro ao carregar dados de conferência.');
        this.loading = false;
      }
    });
  }

  novoLancamento() {
    if (this.saving) return;

    // Cria um ID temporário negativo para identificar que é novo
    const tempId = -Math.floor(Math.random() * 1000000);
    
    const novo: Conferencia = {
      id: tempId,
      dia: '', // Data em branco como solicitado
      rake: 0,
      caixinhas: 0,
      bonus: 0,
      defesas: 0,
      despesasPagas: 0,
      percas: 0,
      pgtoCartao: 0,
      aReceber: 0,
      saldoConta: 0,
      saldoDia: 0,
      totalCreditos: 0,
      diferenca: 0,
      observacao: ''
    };

    // Adiciona no topo da lista
    this.conferencias.unshift(novo);
    this.dirtyIds.add(tempId);
    this.editingIds.add(tempId);
    this.expandedIds.add(tempId);
    
    this.toast.info('Preencha os dados e clique em Salvar.');
  }

  onFieldChange(item: Conferencia) {
    this.calcularCampos(item);
    this.dirtyIds.add(item.id);
  }

  onDiaChange(item: Conferencia, diaString: string) {
    if (!diaString) {
      item.dia = '';
      this.dirtyIds.add(item.id);
      return;
    }
    const dataObj = new Date(diaString + 'T12:00:00');
    item.dia = dataObj.toISOString();
    this.dirtyIds.add(item.id);
  }

  calcularCampos(item: Conferencia) {
    // Recalcula Saldo do Dia
    item.saldoDia = (item.rake || 0) + (item.caixinhas || 0) - (item.bonus || 0) - (item.defesas || 0) - (item.despesasPagas || 0) - (item.percas || 0);
    // Recalcula Total de Créditos
    item.totalCreditos = (item.pgtoCartao || 0) + (item.aReceber || 0) + (item.saldoConta || 0);
    // Recalcula Diferença
    item.diferenca = item.totalCreditos - item.saldoDia;
  }

  salvar() {
    if (this.dirtyIds.size === 0) {
      this.toast.info('Nenhuma alteração para salvar.');
      return;
    }

    // Filtra apenas os registros modificados
    const modificados = this.conferencias.filter(c => this.dirtyIds.has(c.id));

    // Valida se algum registro modificado está sem data
    const semData = modificados.some(c => !c.dia);
    if (semData) {
      this.toast.warning('A data é obrigatória para todos os lançamentos.');
      return;
    }

    if (this.saving) return;
    this.saving = true;

    let salvas = 0;
    let erros = 0;

    const salvarProxima = (index: number) => {
      if (index >= modificados.length) {
        this.saving = false;
        if (erros === 0) {
          this.toast.success(`Todas as alterações (${salvas}) foram salvas.`);
        } else {
          this.toast.warning(`${salvas} alterações salvas, mas ${erros} falharam.`);
        }
        this.carregarConferencias();
        return;
      }

      const item = modificados[index];
      
      if (item.id < 0) {
        // Novo Lançamento
        if (!item.dia) {
          this.toast.error('A data é obrigatória para salvar um novo lançamento.');
          erros++;
          salvarProxima(index + 1);
          return;
        }

        const dto: CreateConferenciaDto = {
          dia: item.dia,
          rake: item.rake,
          caixinhas: item.caixinhas,
          bonus: item.bonus,
          defesas: item.defesas,
          despesasPagas: item.despesasPagas,
          percas: item.percas,
          pgtoCartao: item.pgtoCartao,
          aReceber: item.aReceber,
          saldoConta: item.saldoConta,
          observacao: item.observacao
        };

        this.service.createConferencia(dto).subscribe({
          next: () => {
            salvas++;
            salvarProxima(index + 1);
          },
          error: () => {
            erros++;
            salvarProxima(index + 1);
          }
        });
      } else {
        // Atualização de Lançamento Existente
        const dto: UpdateConferenciaDto = {
          dia: item.dia,
          rake: item.rake,
          caixinhas: item.caixinhas,
          bonus: item.bonus,
          defesas: item.defesas,
          despesasPagas: item.despesasPagas,
          percas: item.percas,
          pgtoCartao: item.pgtoCartao,
          aReceber: item.aReceber,
          saldoConta: item.saldoConta,
          observacao: item.observacao
        };

        this.service.updateConferencia(item.id, dto).subscribe({
          next: () => {
            salvas++;
            salvarProxima(index + 1);
          },
          error: () => {
            erros++;
            salvarProxima(index + 1);
          }
        });
      }
    };

    salvarProxima(0);
  }

  excluirConferencia(item: Conferencia) {
    const dataStr = item.dia ? this.formatarData(item.dia) : 'ainda não salvo';
    this.confirm.confirm({
      message: `Deseja realmente excluir o lançamento (${dataStr})?`,
      confirmText: 'Excluir'
    }).then(ok => {
      if (!ok) return;

      // Se for um item temporário (ainda não salvo)
      if (item.id < 0) {
        this.conferencias = this.conferencias.filter(c => c.id !== item.id);
        this.dirtyIds.delete(item.id);
        this.editingIds.delete(item.id);
        this.toast.success('Lançamento cancelado.');
        return;
      }

      this.saving = true;
      this.service.deleteConferencia(item.id).subscribe({
        next: () => {
          this.toast.success('Lançamento excluído com sucesso.');
          this.saving = false;
          this.carregarConferencias();
        },
        error: () => {
          this.toast.error('Erro ao excluir o lançamento.');
          this.saving = false;
        }
      });
    });
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }

  formatarDataInput(dataString: string): string {
    if (!dataString) return '';
    return dataString.substring(0, 10);
  }

  formatarData(dataString: string): string {
    if (!dataString) return '';
    const date = new Date(dataString);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  isDirty(id: number): boolean {
    return this.dirtyIds.has(id);
  }

  isEditing(id: number): boolean {
    return this.editingIds.has(id);
  }

  isExpanded(id: number): boolean {
    return this.expandedIds.has(id);
  }

  toggleExpand(id: number) {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id);
    } else {
      this.expandedIds.add(id);
    }
  }

  toggleEdit(item: Conferencia) {
    if (this.editingIds.has(item.id)) {
      this.editingIds.delete(item.id);
    } else {
      this.editingIds.add(item.id);
      // Se clicou para editar, expande o card automaticamente
      this.expandedIds.add(item.id);
    }
  }
}
