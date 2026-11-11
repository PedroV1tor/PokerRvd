import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ConferenciaComponent } from './conferencia.component';
import { ConferenciaService } from '../../services/conferencia.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { AuthService } from '../../services/auth.service';
import { Conferencia } from '../../models/conferencia.model';

describe('ConferenciaComponent', () => {
  let component: ConferenciaComponent;
  let fixture: ComponentFixture<ConferenciaComponent>;
  let serviceSpy: jasmine.SpyObj<ConferenciaService>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let confirmSpy: jasmine.SpyObj<ConfirmService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('ConferenciaService', ['getConferencias', 'createConferencia', 'updateConferencia', 'deleteConferencia']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error', 'warning', 'info']);
    confirmSpy = jasmine.createSpyObj('ConfirmService', ['confirm']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['pode', 'hasPermissionConferencia']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Default spy configurations
    authServiceSpy.pode.and.returnValue(true);
    authServiceSpy.hasPermissionConferencia.and.returnValue(true);
    serviceSpy.getConferencias.and.returnValue(of([] as Conferencia[]));

    await TestBed.configureTestingModule({
      imports: [ConferenciaComponent, HttpClientTestingModule],
      providers: [
        { provide: ConferenciaService, useValue: serviceSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: ConfirmService, useValue: confirmSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConferenciaComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('deve bloquear acesso e redirecionar para dashboard se o usuário não tiver permissão', () => {
    authServiceSpy.hasPermissionConferencia.and.returnValue(false);
    
    component.ngOnInit();

    expect(toastSpy.error).toHaveBeenCalledWith('Você não tem permissão para acessar esta página.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(serviceSpy.getConferencias).not.toHaveBeenCalled();
  });

  it('deve carregar os lançamentos se o usuário tiver permissão', () => {
    const mockConferencias: Conferencia[] = [
      {
        id: 1,
        dia: '2026-05-21T00:00:00Z',
        rake: 1000,
        caixinhas: 100,
        bonus: 50,
        defesas: 20,
        despesasPagas: 30,
        percas: 10,
        saldoDia: 990,
        pgtoCartao: 500,
        aReceber: 300,
        saldoConta: 200,
        totalCreditos: 1000,
        diferenca: 10
      }
    ];

    serviceSpy.getConferencias.and.returnValue(of(mockConferencias));
    
    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.conferencias).toEqual(mockConferencias);
    expect(serviceSpy.getConferencias).toHaveBeenCalled();
  });

  it('deve calcular SaldoDia, TotalCreditos e Diferenca corretamente', () => {
    const mockItem: Conferencia = {
      id: 1,
      dia: '2026-05-21T00:00:00Z',
      rake: 1500,
      caixinhas: 200,
      bonus: 100,
      defesas: 50,
      despesasPagas: 80,
      percas: 20,
      saldoDia: 0,
      pgtoCartao: 600,
      aReceber: 400,
      saldoConta: 500,
      totalCreditos: 0,
      diferenca: 0
    };

    component.calcularCampos(mockItem);

    // SaldoDia = (1500 + 200) - 100 - 50 - 80 - 20 = 1700 - 250 = 1450
    expect(mockItem.saldoDia).toBe(1450);
    // TotalCreditos = 600 + 400 + 500 = 1500
    expect(mockItem.totalCreditos).toBe(1500);
    // Diferenca = 1500 - 1450 = 50
    expect(mockItem.diferenca).toBe(50);
  });

  it('deve tratar valores nulos ou vazios como zero nos cálculos', () => {
    const mockItem: Conferencia = {
      id: 1,
      dia: '2026-05-21T00:00:00Z',
      rake: null as any,
      caixinhas: 100,
      bonus: null as any,
      defesas: null as any,
      despesasPagas: 50,
      percas: null as any,
      saldoDia: 0,
      pgtoCartao: null as any,
      aReceber: 300,
      saldoConta: null as any,
      totalCreditos: 0,
      diferenca: 0
    };

    component.calcularCampos(mockItem);

    // SaldoDia = (0 + 100) - 0 - 0 - 50 - 0 = 50
    expect(mockItem.saldoDia).toBe(50);
    // TotalCreditos = 0 + 300 + 0 = 300
    expect(mockItem.totalCreditos).toBe(300);
    // Diferenca = 300 - 50 = 250
    expect(mockItem.diferenca).toBe(250);
  });

  it('deve registrar alterações e calcular campos no onFieldChange', () => {
    const mockItem: Conferencia = {
      id: 99,
      dia: '2026-05-21T00:00:00Z',
      rake: 100,
      caixinhas: 10,
      bonus: 5,
      defesas: 5,
      despesasPagas: 5,
      percas: 5,
      saldoDia: 0,
      pgtoCartao: 50,
      aReceber: 50,
      saldoConta: 50,
      totalCreditos: 0,
      diferenca: 0
    };

    component.onFieldChange(mockItem);

    expect(mockItem.saldoDia).toBe(90);
    expect(mockItem.totalCreditos).toBe(150);
    expect(mockItem.diferenca).toBe(60);
    expect(component.isDirty(99)).toBeTrue();
  });

  it('deve tratar erro ao carregar conferências', () => {
    serviceSpy.getConferencias.and.returnValue(throwError(() => new Error('Erro na API')));
    component.carregarConferencias();
    expect(toastSpy.error).toHaveBeenCalledWith('Erro ao carregar dados de conferência.');
    expect(component.loading).toBeFalse();
  });

  it('deve criar novo lançamento com sucesso', () => {
    serviceSpy.createConferencia.and.returnValue(of({} as Conferencia));
    spyOn(component, 'carregarConferencias');
    component.saving = false;

    component.novoLancamento();

    expect(component.saving).toBeFalse();
    expect(toastSpy.success).toHaveBeenCalledWith('Novo lançamento criado com sucesso!');
    expect(component.carregarConferencias).toHaveBeenCalled();
  });

  it('deve tratar erro ao criar novo lançamento', () => {
    serviceSpy.createConferencia.and.returnValue(throwError(() => new Error('Erro na API')));
    component.saving = false;

    component.novoLancamento();

    expect(component.saving).toBeFalse();
    expect(toastSpy.error).toHaveBeenCalledWith('Erro ao criar novo lançamento.');
  });

  it('deve ignorar novo lançamento se já estiver salvando', () => {
    component.saving = true;
    component.novoLancamento();
    expect(serviceSpy.createConferencia).not.toHaveBeenCalled();
  });

  it('deve atualizar data no onDiaChange', () => {
    const mockItem: Conferencia = { id: 1, dia: '2026-05-21T00:00:00Z' } as Conferencia;
    component.onDiaChange(mockItem, '2026-05-25');
    
    expect(mockItem.dia).toBe(new Date('2026-05-25T12:00:00').toISOString());
    expect(component.isDirty(1)).toBeTrue();
  });

  it('deve ignorar data vazia no onDiaChange', () => {
    const mockItem: Conferencia = { id: 1, dia: '2026-05-21T00:00:00Z' } as Conferencia;
    component.onDiaChange(mockItem, '');
    
    expect(mockItem.dia).toBe('2026-05-21T00:00:00Z');
    expect(component.isDirty(1)).toBeFalse();
  });

  it('deve alertar se tentar salvar sem alterações', () => {
    component.dirtyIds.clear();
    component.salvar();
    expect(toastSpy.info).toHaveBeenCalledWith('Nenhuma alteração para salvar.');
    expect(component.saving).toBeFalse();
  });

  it('deve salvar registros modificados sequencialmente com sucesso', () => {
    component.dirtyIds.clear();
    component.dirtyIds.add(1);
    component.dirtyIds.add(2);

    const item1 = { id: 1, dia: '2026-05-21T00:00:00Z', rake: 100 } as Conferencia;
    const item2 = { id: 2, dia: '2026-05-22T00:00:00Z', rake: 200 } as Conferencia;
    component.conferencias = [item1, item2];

    serviceSpy.updateConferencia.and.returnValue(of({} as Conferencia));
    spyOn(component, 'carregarConferencias');
    component.saving = false;

    component.salvar();

    expect(serviceSpy.updateConferencia).toHaveBeenCalledTimes(2);
    expect(toastSpy.success).toHaveBeenCalledWith('Todas as alterações (2) foram salvas.');
    expect(component.carregarConferencias).toHaveBeenCalled();
    expect(component.saving).toBeFalse();
  });

  it('deve reportar erros se salvar algum registro falhar', () => {
    component.dirtyIds.clear();
    component.dirtyIds.add(1);
    component.dirtyIds.add(2);

    const item1 = { id: 1, dia: '2026-05-21T00:00:00Z', rake: 100 } as Conferencia;
    const item2 = { id: 2, dia: '2026-05-22T00:00:00Z', rake: 200 } as Conferencia;
    component.conferencias = [item1, item2];

    serviceSpy.updateConferencia.withArgs(1, jasmine.any(Object)).and.returnValue(of({} as Conferencia));
    serviceSpy.updateConferencia.withArgs(2, jasmine.any(Object)).and.returnValue(throwError(() => new Error('API Error')));
    spyOn(component, 'carregarConferencias');
    component.saving = false;

    component.salvar();

    expect(serviceSpy.updateConferencia).toHaveBeenCalledTimes(2);
    expect(toastSpy.warning).toHaveBeenCalledWith('1 alterações salvas, mas 1 falharam.');
    expect(component.carregarConferencias).toHaveBeenCalled();
    expect(component.saving).toBeFalse();
  });

  it('deve excluir lançamento se confirmado com sucesso', (done) => {
    const item = { id: 10, dia: '2026-05-21T00:00:00Z' } as Conferencia;
    confirmSpy.confirm.and.returnValue(Promise.resolve(true));
    serviceSpy.deleteConferencia.and.returnValue(of(void 0));
    spyOn(component, 'carregarConferencias');

    component.excluirConferencia(item);

    fixture.whenStable().then(() => {
      expect(serviceSpy.deleteConferencia).toHaveBeenCalledWith(10);
      expect(toastSpy.success).toHaveBeenCalledWith('Lançamento excluído com sucesso.');
      expect(component.carregarConferencias).toHaveBeenCalled();
      expect(component.saving).toBeFalse();
      done();
    });
  });

  it('deve ignorar exclusão se cancelado pelo usuário', (done) => {
    const item = { id: 10, dia: '2026-05-21T00:00:00Z' } as Conferencia;
    confirmSpy.confirm.and.returnValue(Promise.resolve(false));

    component.excluirConferencia(item);

    fixture.whenStable().then(() => {
      expect(serviceSpy.deleteConferencia).not.toHaveBeenCalled();
      done();
    });
  });

  it('deve tratar erro na exclusão', (done) => {
    const item = { id: 10, dia: '2026-05-21T00:00:00Z' } as Conferencia;
    confirmSpy.confirm.and.returnValue(Promise.resolve(true));
    serviceSpy.deleteConferencia.and.returnValue(throwError(() => new Error('Error')));

    component.excluirConferencia(item);

    fixture.whenStable().then(() => {
      expect(toastSpy.error).toHaveBeenCalledWith('Erro ao excluir o lançamento.');
      expect(component.saving).toBeFalse();
      done();
    });
  });

  it('deve formatar data de input e data de exibição corretamente', () => {
    expect(component.formatarDataInput('2026-05-21T15:30:00Z')).toBe('2026-05-21');
    expect(component.formatarDataInput('')).toBe('');

    expect(component.formatarData('2026-05-21T00:00:00Z')).toBe('21/05/2026');
    expect(component.formatarData('')).toBe('');
  });

  it('deve navegar para dashboard ao voltar', () => {
    component.voltar();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
