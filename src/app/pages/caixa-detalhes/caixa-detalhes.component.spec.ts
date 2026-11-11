import { AuthService } from '../../services/auth.service';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CaixaDetalhesComponent } from './caixa-detalhes.component';
import { CaixaService } from '../../services/caixa.service';
import { ComandaService } from '../../services/comanda.service';
import { ToastService } from '../../services/toast.service';
import { TorneioService } from '../../services/torneio.service';
import { SignalrService } from '../../services/signalr.service';
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
  let torneioServiceSpy: jasmine.SpyObj<TorneioService>;
  let signalrServiceSpy: jasmine.SpyObj<SignalrService>;

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
    torneioServiceSpy = jasmine.createSpyObj('TorneioService', ['getTorneios']);
    signalrServiceSpy = jasmine.createSpyObj('SignalrService', ['connect', 'disconnect']);

    // Set up onEvent as observable since it is used in ngOnInit
    Object.defineProperty(signalrServiceSpy, 'onEvent', { value: of() });

    caixaServiceSpy.getCaixa.and.returnValue(of(caixaMock));
    comandaServiceSpy.getComandas.and.returnValue(of([] as Comanda[]));
    torneioServiceSpy.getTorneios.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [CaixaDetalhesComponent],
      providers: [
        { provide: CaixaService, useValue: caixaServiceSpy },
        { provide: ComandaService, useValue: comandaServiceSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', { pode: true, hasPermissionComandas: true }) },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TorneioService, useValue: torneioServiceSpy },
        { provide: SignalrService, useValue: signalrServiceSpy },
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
      valorRestante: 100,
    } as Comanda;
    component.formasPagamentoQuitar = [{ formaPagamento: 'Dinheiro', valor: 100 }];

    expect(component.totalBateComFormasQuitar).toBeTrue();
  });

  // ===============================================================
  // TESTES DE MOVIMENTAÇÕES CRÍTICAS: Premiação e Pgto Funcionários
  // ===============================================================

  describe('Categorias críticas (Premiação e Pgto Funcionários)', () => {

    it('deve conter a categoria "Pgto Funcionários" na lista de categorias', () => {
      expect(component.categorias).toContain('Pgto Funcionários');
    });

    it('deve conter a categoria "Premiação" na lista de categorias', () => {
      expect(component.categorias).toContain('Premiação');
    });

    // --- onCategoriaChange ---

    it('onCategoriaChange deve forçar tipo SAIDA ao selecionar Premiação', () => {
      component.tipoMovimentacao = TipoMovimentacao.ENTRADA;
      component.categoriaMovimentacao = 'Premiação';

      component.onCategoriaChange();

      expect(component.tipoMovimentacao).toBe(TipoMovimentacao.SAIDA);
    });

    it('onCategoriaChange deve forçar tipo SAIDA ao selecionar Pgto Funcionários', () => {
      component.tipoMovimentacao = TipoMovimentacao.ENTRADA;
      component.categoriaMovimentacao = 'Pgto Funcionários';

      component.onCategoriaChange();

      expect(component.tipoMovimentacao).toBe(TipoMovimentacao.SAIDA);
    });

    it('onCategoriaChange NÃO deve alterar tipo ao selecionar Fichas', () => {
      component.tipoMovimentacao = TipoMovimentacao.ENTRADA;
      component.categoriaMovimentacao = 'Fichas';

      component.onCategoriaChange();

      expect(component.tipoMovimentacao).toBe(TipoMovimentacao.ENTRADA);
    });

    // --- onTipoChange ---

    it('onTipoChange deve mudar categoria de Premiação para Fichas ao trocar para ENTRADA', () => {
      component.categoriaMovimentacao = 'Premiação';
      component.tipoMovimentacao = TipoMovimentacao.ENTRADA;

      component.onTipoChange();

      expect(component.categoriaMovimentacao).toBe('Fichas');
    });

    it('onTipoChange deve mudar categoria de Pgto Funcionários para Fichas ao trocar para ENTRADA', () => {
      component.categoriaMovimentacao = 'Pgto Funcionários';
      component.tipoMovimentacao = TipoMovimentacao.ENTRADA;

      component.onTipoChange();

      expect(component.categoriaMovimentacao).toBe('Fichas');
    });

    it('onTipoChange NÃO deve mudar categoria se tipo for SAIDA', () => {
      component.categoriaMovimentacao = 'Premiação';
      component.tipoMovimentacao = TipoMovimentacao.SAIDA;

      component.onTipoChange();

      expect(component.categoriaMovimentacao).toBe('Premiação');
    });

    it('onTipoChange NÃO deve mudar categoria "Fichas" ao trocar para ENTRADA', () => {
      component.categoriaMovimentacao = 'Fichas';
      component.tipoMovimentacao = TipoMovimentacao.ENTRADA;

      component.onTipoChange();

      expect(component.categoriaMovimentacao).toBe('Fichas');
    });

    // --- Validação: torneio obrigatório ---

    it('Premiação deve exigir torneio selecionado e mostrar warning se não houver', () => {
      component.categoriaMovimentacao = 'Premiação';
      component.descricaoMovimentacao = 'Premiação 1° lugar';
      component.valorMovimentacao = 1000;
      component.tipoMovimentacao = TipoMovimentacao.SAIDA;
      component.torneioSelecionadoId = null;

      component.adicionarMovimentacao();

      expect(toastSpy.warning).toHaveBeenCalledWith('Selecione um torneio em andamento');
      expect(caixaServiceSpy.addMovimentacao).not.toHaveBeenCalled();
    });

    it('Pgto Funcionários deve exigir torneio selecionado e mostrar warning se não houver', () => {
      component.categoriaMovimentacao = 'Pgto Funcionários';
      component.descricaoMovimentacao = 'Pagamento dealer';
      component.valorMovimentacao = 200;
      component.tipoMovimentacao = TipoMovimentacao.SAIDA;
      component.torneioSelecionadoId = null;

      component.adicionarMovimentacao();

      expect(toastSpy.warning).toHaveBeenCalledWith('Selecione um torneio em andamento');
      expect(caixaServiceSpy.addMovimentacao).not.toHaveBeenCalled();
    });

    // --- Validação: forçar tipo saída ---

    it('Premiação deve barrar se tipo não for SAIDA', () => {
      component.categoriaMovimentacao = 'Premiação';
      component.descricaoMovimentacao = 'Premiação 1° lugar';
      component.valorMovimentacao = 1000;
      component.tipoMovimentacao = TipoMovimentacao.ENTRADA;
      component.torneioSelecionadoId = 5;

      component.adicionarMovimentacao();

      expect(toastSpy.warning).toHaveBeenCalledWith('Movimentações de Premiação devem ser do tipo Saída');
      expect(caixaServiceSpy.addMovimentacao).not.toHaveBeenCalled();
    });

    it('Pgto Funcionários deve barrar se tipo não for SAIDA', () => {
      component.categoriaMovimentacao = 'Pgto Funcionários';
      component.descricaoMovimentacao = 'Pagamento dealer';
      component.valorMovimentacao = 200;
      component.tipoMovimentacao = TipoMovimentacao.ENTRADA;
      component.torneioSelecionadoId = 5;

      component.adicionarMovimentacao();

      expect(toastSpy.warning).toHaveBeenCalledWith('Movimentações de Pgto Funcionários devem ser do tipo Saída');
      expect(caixaServiceSpy.addMovimentacao).not.toHaveBeenCalled();
    });

    // --- Requisição válida: DTO com torneioId ---

    it('Premiação válida deve enviar DTO com torneioId correto', () => {
      caixaServiceSpy.addMovimentacao.and.returnValue(of({}));

      component.categoriaMovimentacao = 'Premiação';
      component.descricaoMovimentacao = 'Premiação 1° lugar';
      component.valorMovimentacao = 1000;
      component.tipoMovimentacao = TipoMovimentacao.SAIDA;
      component.torneioSelecionadoId = 7;

      component.adicionarMovimentacao();

      expect(caixaServiceSpy.addMovimentacao).toHaveBeenCalledWith(1, {
        tipo: TipoMovimentacao.SAIDA,
        categoria: 'Premiação',
        descricao: 'Premiação 1° lugar',
        valor: 1000,
        torneioId: 7
      });
    });

    it('Pgto Funcionários válida deve enviar DTO com torneioId correto', () => {
      caixaServiceSpy.addMovimentacao.and.returnValue(of({}));

      component.categoriaMovimentacao = 'Pgto Funcionários';
      component.descricaoMovimentacao = 'Pagamento dealer noturno';
      component.valorMovimentacao = 300;
      component.tipoMovimentacao = TipoMovimentacao.SAIDA;
      component.torneioSelecionadoId = 12;

      component.adicionarMovimentacao();

      expect(caixaServiceSpy.addMovimentacao).toHaveBeenCalledWith(1, {
        tipo: TipoMovimentacao.SAIDA,
        categoria: 'Pgto Funcionários',
        descricao: 'Pagamento dealer noturno',
        valor: 300,
        torneioId: 12
      });
    });

    // --- Categoria normal NÃO deve incluir torneioId ---

    it('Categoria "Fichas" NÃO deve incluir torneioId no DTO', () => {
      caixaServiceSpy.addMovimentacao.and.returnValue(of({}));

      component.categoriaMovimentacao = 'Fichas';
      component.descricaoMovimentacao = 'Venda de fichas';
      component.valorMovimentacao = 500;
      component.tipoMovimentacao = TipoMovimentacao.ENTRADA;
      component.torneioSelecionadoId = 99; // Mesmo com valor, não deve usar

      component.adicionarMovimentacao();

      expect(caixaServiceSpy.addMovimentacao).toHaveBeenCalledWith(1, {
        tipo: TipoMovimentacao.ENTRADA,
        categoria: 'Fichas',
        descricao: 'Venda de fichas',
        valor: 500,
        torneioId: undefined
      });
    });

    it('Categoria "Despesas" NÃO deve incluir torneioId no DTO', () => {
      caixaServiceSpy.addMovimentacao.and.returnValue(of({}));

      component.categoriaMovimentacao = 'Despesas';
      component.descricaoMovimentacao = 'Compra de materiais';
      component.valorMovimentacao = 150;
      component.tipoMovimentacao = TipoMovimentacao.SAIDA;

      component.adicionarMovimentacao();

      expect(caixaServiceSpy.addMovimentacao).toHaveBeenCalledWith(1, {
        tipo: TipoMovimentacao.SAIDA,
        categoria: 'Despesas',
        descricao: 'Compra de materiais',
        valor: 150,
        torneioId: undefined
      });
    });

    // --- Validação de valor ---

    it('deve barrar movimentação com valor zero', () => {
      component.categoriaMovimentacao = 'Pgto Funcionários';
      component.descricaoMovimentacao = 'Pagamento dealer';
      component.valorMovimentacao = 0;
      component.tipoMovimentacao = TipoMovimentacao.SAIDA;
      component.torneioSelecionadoId = 5;

      component.adicionarMovimentacao();

      expect(toastSpy.warning).toHaveBeenCalledWith('Preencha todos os campos corretamente');
      expect(caixaServiceSpy.addMovimentacao).not.toHaveBeenCalled();
    });

    it('deve barrar movimentação com valor negativo', () => {
      component.categoriaMovimentacao = 'Premiação';
      component.descricaoMovimentacao = 'Premiação';
      component.valorMovimentacao = -100;
      component.tipoMovimentacao = TipoMovimentacao.SAIDA;
      component.torneioSelecionadoId = 5;

      component.adicionarMovimentacao();

      expect(toastSpy.warning).toHaveBeenCalledWith('Preencha todos os campos corretamente');
      expect(caixaServiceSpy.addMovimentacao).not.toHaveBeenCalled();
    });

    it('deve barrar movimentação sem descrição', () => {
      component.categoriaMovimentacao = 'Pgto Funcionários';
      component.descricaoMovimentacao = '';
      component.valorMovimentacao = 200;
      component.tipoMovimentacao = TipoMovimentacao.SAIDA;
      component.torneioSelecionadoId = 5;

      component.adicionarMovimentacao();

      expect(toastSpy.warning).toHaveBeenCalledWith('Preencha todos os campos corretamente');
      expect(caixaServiceSpy.addMovimentacao).not.toHaveBeenCalled();
    });
  });

  // ===============================================================
  // TESTES DE CÁLCULOS DO CAIXA COM MOVIMENTAÇÕES CRÍTICAS
  // ===============================================================

  describe('Cálculos do caixa com movimentações críticas', () => {

    it('getSaldoEsperado deve refletir entradas e saídas (incluindo Premiação/Pgto Funcs)', () => {
      if (!component.caixa) { fail('caixa não carregada'); return; }

      // Simula cenário real: 200 saldo, 800 entradas, 400 saídas (Premiação + Pgto)
      component.caixa.saldoInicial = 200;
      component.caixa.totalEntradas = 800;
      component.caixa.totalSaidas = 400; // inclui 250 Premiação + 150 Pgto Func

      expect(component.getSaldoEsperado()).toBe(600); // 200 + 800 - 400
    });

    it('getDiferenca deve calcular corretamente com saídas de premiação/pgto', () => {
      if (!component.caixa) { fail('caixa não carregada'); return; }

      component.caixa.saldoInicial = 100;
      component.caixa.totalEntradas = 1000;
      component.caixa.totalSaidas = 500; // ex: Premiação 300 + Pgto Func 200
      component.caixa.saldoFinal = 580;

      // Saldo esperado = 100 + 1000 - 500 = 600
      // Diferença = 580 - 600 = -20
      expect(component.getDiferenca()).toBe(-20);
    });

    it('getResumoSaidas deve agrupar corretamente Premiação e Pgto Funcionários', () => {
      if (!component.caixa) { fail('caixa não carregada'); return; }

      component.caixa.movimentacoes = [
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Premiação', valor: 500, descricao: '1° lugar' } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Premiação', valor: 300, descricao: '2° lugar' } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Pgto Funcionários', valor: 200, descricao: 'Dealer' } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Pgto Funcionários', valor: 150, descricao: 'Floor' } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Despesas', valor: 50, descricao: 'Materiais' } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.ENTRADA, categoria: 'Fichas', valor: 1000, descricao: 'Fichas' } as MovimentacaoCaixa,
      ];

      const resumo = component.getResumoSaidas();

      // Deve ter 3 categorias de saída
      expect(resumo.length).toBe(3);

      const premiacao = resumo.find(r => r.categoria === 'Premiação');
      expect(premiacao).toBeDefined();
      expect(premiacao!.quantidade).toBe(2);
      expect(premiacao!.total).toBe(800); // 500 + 300

      const pgtoFunc = resumo.find(r => r.categoria === 'Pgto Funcionários');
      expect(pgtoFunc).toBeDefined();
      expect(pgtoFunc!.quantidade).toBe(2);
      expect(pgtoFunc!.total).toBe(350); // 200 + 150

      const despesas = resumo.find(r => r.categoria === 'Despesas');
      expect(despesas).toBeDefined();
      expect(despesas!.quantidade).toBe(1);
      expect(despesas!.total).toBe(50);
    });

    it('getResumoSaidas NÃO deve incluir movimentações de ENTRADA', () => {
      if (!component.caixa) { fail('caixa não carregada'); return; }

      component.caixa.movimentacoes = [
        { tipo: TipoMovimentacao.ENTRADA, categoria: 'Fichas', valor: 1000, descricao: 'Fichas' } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Premiação', valor: 500, descricao: '1° lugar' } as MovimentacaoCaixa,
      ];

      const resumo = component.getResumoSaidas();

      expect(resumo.length).toBe(1);
      expect(resumo[0].categoria).toBe('Premiação');
    });

    it('getMovimentacoesFiltradas com aba "saidas" deve incluir Premiação e Pgto Funcionários', () => {
      if (!component.caixa) { fail('caixa não carregada'); return; }

      component.caixa.movimentacoes = [
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Premiação', valor: 500 } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Pgto Funcionários', valor: 200 } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.ENTRADA, categoria: 'Fichas', valor: 1000 } as MovimentacaoCaixa,
      ];
      component.abaAtiva = 'saidas';

      const filtradas = component.getMovimentacoesFiltradas();

      expect(filtradas.length).toBe(2);
      expect(filtradas.every(m => m.tipo === TipoMovimentacao.SAIDA)).toBeTrue();
    });

    it('getMovimentacoesFiltradas com aba "todas" deve incluir tudo', () => {
      if (!component.caixa) { fail('caixa não carregada'); return; }

      component.caixa.movimentacoes = [
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Premiação', valor: 500 } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Pgto Funcionários', valor: 200 } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.ENTRADA, categoria: 'Fichas', valor: 1000 } as MovimentacaoCaixa,
      ];
      component.abaAtiva = 'todas';

      const filtradas = component.getMovimentacoesFiltradas();

      expect(filtradas.length).toBe(3);
    });
  });

  // ===============================================================
  // TESTES DE EDGE CASES
  // ===============================================================

  describe('Edge cases de movimentações críticas', () => {

    it('saldo esperado deve ser zero quando tudo se anula', () => {
      if (!component.caixa) { fail('caixa não carregada'); return; }

      component.caixa.saldoInicial = 0;
      component.caixa.totalEntradas = 1000;
      component.caixa.totalSaidas = 1000; // Premiação + Pgto Func = total saídas

      expect(component.getSaldoEsperado()).toBe(0);
    });

    it('deve lidar com caixa sem movimentações para getResumoSaidas', () => {
      if (!component.caixa) { fail('caixa não carregada'); return; }

      component.caixa.movimentacoes = [];

      const resumo = component.getResumoSaidas();
      expect(resumo.length).toBe(0);
    });

    it('deve lidar com caixa null para getSaldoEsperado', () => {
      component.caixa = null;
      expect(component.getSaldoEsperado()).toBe(0);
    });

    it('deve lidar com caixa null para getDiferenca', () => {
      component.caixa = null;
      expect(component.getDiferenca()).toBe(0);
    });

    it('deve lidar com movimentacoes null/undefined', () => {
      if (!component.caixa) { fail('caixa não carregada'); return; }
      component.caixa.movimentacoes = null as any;

      const resumo = component.getResumoSaidas();
      expect(resumo.length).toBe(0);
    });

    it('Premiação com valor decimal (centavos) deve funcionar corretamente', () => {
      caixaServiceSpy.addMovimentacao.and.returnValue(of({}));

      component.categoriaMovimentacao = 'Premiação';
      component.descricaoMovimentacao = 'Premiação 3° lugar';
      component.valorMovimentacao = 150.75;
      component.tipoMovimentacao = TipoMovimentacao.SAIDA;
      component.torneioSelecionadoId = 3;

      component.adicionarMovimentacao();

      expect(caixaServiceSpy.addMovimentacao).toHaveBeenCalledWith(1, {
        tipo: TipoMovimentacao.SAIDA,
        categoria: 'Premiação',
        descricao: 'Premiação 3° lugar',
        valor: 150.75,
        torneioId: 3
      });
    });

    it('Pgto Funcionários com valor decimal (centavos) deve funcionar corretamente', () => {
      caixaServiceSpy.addMovimentacao.and.returnValue(of({}));

      component.categoriaMovimentacao = 'Pgto Funcionários';
      component.descricaoMovimentacao = 'Dealer hora extra';
      component.valorMovimentacao = 99.99;
      component.tipoMovimentacao = TipoMovimentacao.SAIDA;
      component.torneioSelecionadoId = 8;

      component.adicionarMovimentacao();

      expect(caixaServiceSpy.addMovimentacao).toHaveBeenCalledWith(1, {
        tipo: TipoMovimentacao.SAIDA,
        categoria: 'Pgto Funcionários',
        descricao: 'Dealer hora extra',
        valor: 99.99,
        torneioId: 8
      });
    });

    it('múltiplas movimentações de categorias diferentes devem totalizar corretamente no resumo', () => {
      if (!component.caixa) { fail('caixa não carregada'); return; }

      component.caixa.movimentacoes = [
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Premiação', valor: 1000, descricao: '1°' } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Premiação', valor: 500, descricao: '2°' } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Premiação', valor: 250, descricao: '3°' } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Pgto Funcionários', valor: 300, descricao: 'Dealer 1' } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Pgto Funcionários', valor: 200, descricao: 'Dealer 2' } as MovimentacaoCaixa,
        { tipo: TipoMovimentacao.SAIDA, categoria: 'Pgto Funcionários', valor: 100, descricao: 'Floor' } as MovimentacaoCaixa,
      ];

      const resumo = component.getResumoSaidas();

      const premiacao = resumo.find(r => r.categoria === 'Premiação');
      const pgtoFunc = resumo.find(r => r.categoria === 'Pgto Funcionários');

      expect(premiacao!.total).toBe(1750); // 1000 + 500 + 250
      expect(premiacao!.quantidade).toBe(3);
      expect(pgtoFunc!.total).toBe(600); // 300 + 200 + 100
      expect(pgtoFunc!.quantidade).toBe(3);

      // Total geral de saídas
      const totalSaidas = resumo.reduce((sum, r) => sum + r.total, 0);
      expect(totalSaidas).toBe(2350); // 1750 + 600
    });
  });
});

