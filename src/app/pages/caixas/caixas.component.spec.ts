import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { CaixasComponent } from './caixas.component';
import { CaixaService } from '../../services/caixa.service';
import { ToastService } from '../../services/toast.service';
import { CaixaDto, StatusCaixa } from '../../models/caixa.model';

describe('CaixasComponent', () => {
  let component: CaixasComponent;
  let caixaServiceSpy: jasmine.SpyObj<CaixaService>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    caixaServiceSpy = jasmine.createSpyObj('CaixaService', ['getCaixas', 'getCaixaAberto', 'abrirCaixa']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error', 'warning']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    caixaServiceSpy.getCaixas.and.returnValue(of([] as CaixaDto[]));
    caixaServiceSpy.getCaixaAberto.and.returnValue(of(null as unknown as CaixaDto));

    await TestBed.configureTestingModule({
      imports: [CaixasComponent, HttpClientTestingModule],
      providers: [
        { provide: CaixaService, useValue: caixaServiceSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CaixasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar caixas e verificar caixa aberto ao iniciar', () => {
    const caixasMock: CaixaDto[] = [
      {
        id: 1,
        dataAbertura: '2026-02-23T10:00:00Z',
        status: StatusCaixa.FECHADO,
        saldoInicial: 100,
        totalEntradas: 500,
        totalSaidas: 300,
        usuarioAbertura: 'Admin',
      } as CaixaDto,
    ];
    const caixaAbertoMock = {
      id: 2,
      dataAbertura: '2026-02-23T14:00:00Z',
      status: StatusCaixa.ABERTO,
      saldoInicial: 200,
      totalEntradas: 0,
      totalSaidas: 0,
      usuarioAbertura: 'Admin',
    } as CaixaDto;

    caixaServiceSpy.getCaixas.and.returnValue(of(caixasMock));
    caixaServiceSpy.getCaixaAberto.and.returnValue(of(caixaAbertoMock));

    const fixture = TestBed.createComponent(CaixasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.caixas).toEqual(caixasMock);
    expect(component.caixaAberto).toEqual(caixaAbertoMock);
    expect(caixaServiceSpy.getCaixas).toHaveBeenCalled();
    expect(caixaServiceSpy.getCaixaAberto).toHaveBeenCalled();
  });

  it('deve abrir modal de abrir caixa e resetar formulário', () => {
    component.saldoInicial = 999;
    component.observacoesAbertura = 'teste';
    component.abrirModalAbrirCaixa();

    expect(component.mostrarModalAbrirCaixa).toBeTrue();
    expect(component.saldoInicial).toBe(0);
    expect(component.observacoesAbertura).toBe('');
  });

  it('deve fechar modal de abrir caixa', () => {
    component.mostrarModalAbrirCaixa = true;
    component.fecharModalAbrirCaixa();

    expect(component.mostrarModalAbrirCaixa).toBeFalse();
  });

  it('deve exibir warning se saldo inicial for negativo ao abrir caixa', () => {
    component.saldoInicial = -10;
    component.abrirCaixa();

    expect(toastSpy.warning).toHaveBeenCalledWith('Saldo inicial não pode ser negativo');
    expect(caixaServiceSpy.abrirCaixa).not.toHaveBeenCalled();
  });

  it('deve chamar abrirCaixa no service quando saldo inicial válido', () => {
    component.saldoInicial = 100;
    component.observacoesAbertura = 'Observação teste';
    caixaServiceSpy.abrirCaixa.and.returnValue(of({} as CaixaDto));

    component.abrirCaixa();

    expect(caixaServiceSpy.abrirCaixa).toHaveBeenCalledWith({
      saldoInicial: 100,
      observacoesAbertura: 'Observação teste',
      usuarioNome: undefined,
    });
  });

  it('deve navegar para detalhes do caixa ao clicar em ver', () => {
    component.verDetalhesCaixa(5);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/caixa', 5]);
  });

  it('deve calcular saldo final: saldoInicial + entradas - saídas', () => {
    const caixa: CaixaDto = {
      id: 1,
      saldoInicial: 100,
      totalEntradas: 500,
      totalSaidas: 200,
    } as CaixaDto;

    const saldo = component.getSaldoFinalCalculado(caixa);

    expect(saldo).toBe(400);
  });

  it('deve formatar data corretamente', () => {
    const data = new Date('2026-02-23T14:30:00Z');
    const resultado = component.formatarData(data);

    expect(resultado).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(resultado).toMatch(/\d{2}:\d{2}/);
  });
});
