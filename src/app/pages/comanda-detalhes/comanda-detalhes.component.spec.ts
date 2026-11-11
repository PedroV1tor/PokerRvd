import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ComandaDetalhesComponent } from './comanda-detalhes.component';
import { ComandaService } from '../../services/comanda.service';
import { TorneioService } from '../../services/torneio.service';
import { ProdutoService } from '../../services/produto.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { AuthService } from '../../services/auth.service';
import { Comanda, ItemComanda, StatusComanda, TipoComanda } from '../../models/comanda.model';
import { Torneio } from '../../models/torneio.model';
import { Produto } from '../../models/produto.model';

describe('ComandaDetalhesComponent', () => {
  let component: ComandaDetalhesComponent;

  let comandaServiceSpy: jasmine.SpyObj<ComandaService>;
  let torneioServiceSpy: jasmine.SpyObj<TorneioService>;
  let produtoServiceSpy: jasmine.SpyObj<ProdutoService>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let confirmSpy: jasmine.SpyObj<ConfirmService>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: (key: string) => (key === 'id' ? '1' : null),
      },
    },
  } as Partial<ActivatedRoute>;

  beforeEach(async () => {
    comandaServiceSpy = jasmine.createSpyObj('ComandaService', [
      'getComanda',
      'adicionarFichas',
      'fecharComanda',
      'adicionarProduto',
    ]);
    torneioServiceSpy = jasmine.createSpyObj('TorneioService', ['getTorneio']);
    produtoServiceSpy = jasmine.createSpyObj('ProdutoService', ['getProdutos']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error', 'warning']);
    confirmSpy = jasmine.createSpyObj('ConfirmService', ['confirm']);
    authSpy = jasmine.createSpyObj('AuthService', [
      'pode',
      'hasPermissionFecharComanda',
      'hasPermissionRemoverItemComanda',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authSpy.pode.and.returnValue(true);
    authSpy.hasPermissionFecharComanda.and.returnValue(true);
    authSpy.hasPermissionRemoverItemComanda.and.returnValue(true);

    const comandaMock = {
      id: 1,
      jogadorNome: 'Jogador 1',
      mesa: 'Mesa 1',
      tipo: TipoComanda.CASH,
      valorFichas: 100,
      valorBebidas: 20,
      valorTotal: 120,
      status: StatusComanda.ATIVO,
      dataAbertura: new Date(),
      itens: [
        {
          id: 1,
          comandaId: 1,
          produtoId: 0,
          produtoNome: '',
          produto: {},
          quantidade: 1,
          valorUnitario: 100,
          valorTotal: 100,
        },
      ],
    } as unknown as Comanda;

    comandaServiceSpy.getComanda.and.returnValue(of(comandaMock));
    produtoServiceSpy.getProdutos.and.returnValue(of([] as Produto[]));
    torneioServiceSpy.getTorneio.and.returnValue(of({} as Torneio));

    await TestBed.configureTestingModule({
      imports: [ComandaDetalhesComponent],
      providers: [
        { provide: ComandaService, useValue: comandaServiceSpy },
        { provide: TorneioService, useValue: torneioServiceSpy },
        { provide: ProdutoService, useValue: produtoServiceSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: ConfirmService, useValue: confirmSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ComandaDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar comanda e itens ao iniciar', () => {
    expect(comandaServiceSpy.getComanda).toHaveBeenCalledWith(1);
    expect(component.comanda).toBeTruthy();
    expect(component.comanda?.id).toBe(1);
    expect(component.itens.length).toBe(1);
  });

  it('deve calcular valorTotal a partir de valorFichas e valorBebidas', () => {
    if (!component.comanda) {
      fail('comanda não carregada no teste');
      return;
    }
    component.comanda.valorFichas = 150;
    component.comanda.valorBebidas = 50;
    expect(component.valorTotal).toBe(200);
  });

  it('deve expor permissões de ação a partir do AuthService', () => {
    expect(component.podeFecharComanda).toBeTrue();
    expect(component.podeRemoverItem).toBeTrue();
    expect(authSpy.hasPermissionFecharComanda).toHaveBeenCalled();
    expect(authSpy.hasPermissionRemoverItemComanda).toHaveBeenCalled();
  });
});

