import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ComandaService } from '../../services/comanda.service';
import { CaixaService } from '../../services/caixa.service';
import { ToastService } from '../../services/toast.service';
import { Comanda, DashboardStats, StatusComanda, TipoComanda } from '../../models/comanda.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;

  let comandaServiceSpy: jasmine.SpyObj<ComandaService>;
  let caixaServiceSpy: jasmine.SpyObj<CaixaService>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    comandaServiceSpy = jasmine.createSpyObj('ComandaService', [
      'getComandas',
      'getDashboardStats',
      'createComanda',
      'updateComanda',
      'filtrarComandas',
    ]);
    caixaServiceSpy = jasmine.createSpyObj('CaixaService', ['getCaixaAberto']);
    toastSpy = jasmine.createSpyObj('ToastService', ['error', 'success', 'warning']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: ComandaService, useValue: comandaServiceSpy },
        { provide: CaixaService, useValue: caixaServiceSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar comandas e stats ao iniciar', () => {
    const caixaMock = { id: 1 };
    const comandasMock: Comanda[] = [
      {
        id: 1,
        jogadorNome: 'Jogador 1',
        mesa: 'Mesa 1',
        tipo: TipoComanda.CASH,
        valorFichas: 100,
        valorBebidas: 0,
        valorTotal: 100,
        status: StatusComanda.ATIVO,
        dataAbertura: new Date(),
        caixaId: 1,
      } as Comanda,
      {
        id: 2,
        jogadorNome: 'Jogador 2',
        mesa: 'Mesa 2',
        tipo: TipoComanda.CASH,
        valorFichas: 0,
        valorBebidas: 50,
        valorTotal: 50,
        status: StatusComanda.FECHADO,
        dataAbertura: new Date(),
        caixaId: 1,
      } as Comanda,
    ];
    const statsMock: DashboardStats = {
      comandasAbertas: 1,
      totalFichas: 100,
      totalBebidas: 0,
      faturamentoTotal: 100,
    };

    caixaServiceSpy.getCaixaAberto.and.returnValue(of(caixaMock as any));
    comandaServiceSpy.getComandas.and.returnValue(of(comandasMock));
    comandaServiceSpy.getDashboardStats.and.returnValue(of(statsMock));
    // filtrarComandas apenas devolve o array recebido
    comandaServiceSpy.filtrarComandas.and.callFake(
      (lista: Comanda[]) => lista,
    );

    const fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // dispara ngOnInit -> carregarDados

    expect(component.loading).toBeFalse();
    expect(component.comandas.length).toBe(1); // apenas ATIVO
    expect(component.comandasFechadas.length).toBe(1); // apenas FECHADO
    expect(component.stats).toEqual(statsMock);
    expect(comandaServiceSpy.getComandas).toHaveBeenCalledWith(1);
    expect(comandaServiceSpy.getDashboardStats).toHaveBeenCalledWith(1);
  });

  it('deve calcular o valor total das comandas filtradas', () => {
    component.comandasFiltradas = [
      {
        id: 1,
        jogadorNome: 'A',
        mesa: '1',
        tipo: TipoComanda.CASH,
        valorFichas: 50,
        valorBebidas: 10,
        valorTotal: 60,
        status: StatusComanda.ATIVO,
        dataAbertura: new Date(),
      } as Comanda,
      {
        id: 2,
        jogadorNome: 'B',
        mesa: '2',
        tipo: TipoComanda.BAR,
        valorFichas: 0,
        valorBebidas: 40,
        valorTotal: 40,
        status: StatusComanda.ATIVO,
        dataAbertura: new Date(),
      } as Comanda,
    ];

    const total = component.calcularValorTotal();
    expect(total).toBe('100.00');
  });
});

