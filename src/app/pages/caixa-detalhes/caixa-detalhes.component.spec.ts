import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CaixaDetalhesComponent } from './caixa-detalhes.component';
import { CaixaService } from '../../services/caixa.service';
import { ComandaService } from '../../services/comanda.service';
import { ToastService } from '../../services/toast.service';
import {
  CaixaDetailsDto,
  StatusCaixa,
  TipoMovimentacao,
  MovimentacaoCaixa,
} from '../../models/caixa.model';
import { Comanda, StatusComanda, TipoComanda } from '../../models/comanda.model';

describe('CaixaDetalhesComponent', () => {
  let component: CaixaDetalhesComponent;
  let caixaServiceSpy: jasmine.SpyObj<CaixaService>;
  let comandaServiceSpy: jasmine.SpyObj<ComandaService>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: (key: string) => (key === 'id' ? '1' : null),
      },
    },
  } as Partial<ActivatedRoute>;

  const caixaMock: CaixaDetailsDto = {
    id: 1,
    dataAbertura: '2026-02-23T10:00:00Z',
    status: StatusCaixa.ABERTO,
    saldoInicial: 200,
    totalEntradas: 500,
    totalSaidas: 200,
    usuarioAbertura: 'Admin',
    movimentacoes: [
      {
        id: 1,
        caixaId: 1,
        dataHora: new Date(),
        tipo: TipoMovimentacao.ENTRADA,
        categoria: 'Fichas',
        descricao: 'Fechamento comanda',
        valor: 100,
        usuarioNome: 'Admin',
      } as MovimentacaoCaixa,
    ],
  };

  beforeEach(async () => {
    caixaServiceSpy = jasmine.createSpyObj('CaixaService', [
      'getCaixa',
      'fecharCaixa',
      'addMovimentacao',
    ]);
    comandaServiceSpy = jasmine.createSpyObj('ComandaService', [
      'getComandas',
      'fecharComanda',
    ]);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error', 'warning']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    caixaServiceSpy.getCaixa.and.returnValue(of(caixaMock));
    comandaServiceSpy.getComandas.and.returnValue(of([] as Comanda[]));

    await TestBed.configureTestingModule({
      imports: [CaixaDetalhesComponent],
      providers: [
        { provide: CaixaService, useValue: caixaServiceSpy },
        { provide: ComandaService, useValue: comandaServiceSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CaixaDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar caixa ao iniciar', () => {
    expect(caixaServiceSpy.getCaixa).toHaveBeenCalledWith(1);
    expect(component.caixa).toBeTruthy();
    expect(component.caixa?.id).toBe(1);
    expect(component.caixa?.movimentacoes).toBeDefined();
  });

  it('deve calcular saldo esperado: saldoInicial + entradas - saídas', () => {
    if (!component.caixa) {
      fail('caixa não carregada');
      return;
    }
    component.caixa.saldoInicial = 100;
    component.caixa.totalEntradas = 300;
    component.caixa.totalSaidas = 50;

    const saldo = component.getSaldoEsperado();

    expect(saldo).toBe(350);
  });

  it('deve calcular diferença entre saldo final informado e saldo esperado', () => {
    if (!component.caixa) {
      fail('caixa não carregada');
      return;
    }
    component.caixa.saldoInicial = 100;
    component.caixa.totalEntradas = 200;
    component.caixa.totalSaidas = 50;
    component.caixa.saldoFinal = 260;

    const diff = component.getDiferenca();

    expect(diff).toBe(10); // 260 - 250 = 10
  });

  it('deve filtrar movimentações por aba entradas', () => {
    if (!component.caixa) {
      fail('caixa não carregada');
      return;
    }
    component.caixa.movimentacoes = [
      { tipo: TipoMovimentacao.ENTRADA, valor: 100 } as MovimentacaoCaixa,
      { tipo: TipoMovimentacao.SAIDA, valor: 50 } as MovimentacaoCaixa,
    ];
    component.abaAtiva = 'entradas';

    const filtradas = component.getMovimentacoesFiltradas();

    expect(filtradas.length).toBe(1);
    expect(filtradas[0].tipo).toBe(TipoMovimentacao.ENTRADA);
  });

  it('deve filtrar movimentações por aba saídas', () => {
    if (!component.caixa) {
      fail('caixa não carregada');
      return;
    }
    component.caixa.movimentacoes = [
      { tipo: TipoMovimentacao.ENTRADA, valor: 100 } as MovimentacaoCaixa,
      { tipo: TipoMovimentacao.SAIDA, valor: 50 } as MovimentacaoCaixa,
    ];
    component.abaAtiva = 'saidas';

    const filtradas = component.getMovimentacoesFiltradas();

    expect(filtradas.length).toBe(1);
    expect(filtradas[0].tipo).toBe(TipoMovimentacao.SAIDA);
  });

  it('deve abrir modal de fechar caixa com saldo esperado pré-preenchido', () => {
    if (!component.caixa) {
      fail('caixa não carregada');
      return;
    }
    component.caixa.saldoInicial = 100;
    component.caixa.totalEntradas = 50;
    component.caixa.totalSaidas = 30;

    component.abrirModalFechar();

    expect(component.mostrarModalFechar).toBeTrue();
    expect(component.saldoFinal).toBe(120); // 100 + 50 - 30
  });

  it('deve abrir modal de movimentação com valores padrão', () => {
    component.abrirModalMovimentacao();

    expect(component.mostrarModalMovimentacao).toBeTrue();
    expect(component.tipoMovimentacao).toBe(TipoMovimentacao.ENTRADA);
    expect(component.categoriaMovimentacao).toBe('Fichas');
    expect(component.descricaoMovimentacao).toBe('');
    expect(component.valorMovimentacao).toBe(0);
  });

  it('deve exibir warning ao criar categoria vazia', () => {
    component.novaCategoria = '';
    component.criarCategoria();

    expect(toastSpy.warning).toHaveBeenCalledWith('Digite um nome para a categoria');
  });

  it('deve exibir warning ao criar categoria que já existe', () => {
    component.novaCategoria = 'Fichas';
    component.criarCategoria();

    expect(toastSpy.warning).toHaveBeenCalledWith('Esta categoria já existe');
  });

  it('deve adicionar nova categoria quando válida', () => {
    component.novaCategoria = 'Nova Categoria';
    component.criarCategoria();

    expect(component.categorias).toContain('Nova Categoria');
    expect(component.categoriaMovimentacao).toBe('Nova Categoria');
    expect(component.mostrarModalNovaCategoria).toBeFalse();
  });

  it('deve exibir warning ao adicionar movimentação com campos inválidos', () => {
    if (!component.caixa) {
      fail('caixa não carregada');
      return;
    }
    component.categoriaMovimentacao = '';
    component.descricaoMovimentacao = '';
    component.valorMovimentacao = 0;

    component.adicionarMovimentacao();

    expect(toastSpy.warning).toHaveBeenCalledWith('Preencha todos os campos corretamente');
    expect(caixaServiceSpy.addMovimentacao).not.toHaveBeenCalled();
  });

  it('deve navegar para caixas ao voltar', () => {
    component.voltar();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/caixas']);
  });

  it('somaFormasPagamentoQuitar deve somar valores das formas', () => {
    component.formasPagamentoQuitar = [
      { formaPagamento: 'Dinheiro', valor: 50 },
      { formaPagamento: 'PIX', valor: 30 },
    ];

    expect(component.somaFormasPagamentoQuitar).toBe(80);
  });

  it('totalBateComFormasQuitar deve retornar true quando soma igual ao total da comanda', () => {
    component.comandaSelecionadaQuitar = {
      id: 1,
      jogadorNome: 'Teste',
      mesa: '1',
      tipo: TipoComanda.CASH,
      valorTotal: 100,
    } as Comanda;
    component.formasPagamentoQuitar = [{ formaPagamento: 'Dinheiro', valor: 100 }];

    expect(component.totalBateComFormasQuitar).toBeTrue();
  });
});
