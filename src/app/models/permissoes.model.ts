/**
 * Uma permissão por botão, agrupadas pelas seções do header.
 * `secao` libera a tela; cada ação exige a seção e o próprio botão.
 * Para criar uma nova: adicionar aqui e em PermissoesBase/Permissoes (backend).
 */
export const SECOES_PERMISSOES = [
  {
    id: 'comandas',
    label: 'Comandas',
    icon: '🎮',
    secao: 'permissaoComandas',
    acoes: [
      { key: 'permissaoCriarComanda', label: 'Nova Comanda' },
      { key: 'permissaoAlterarStatusComanda', label: 'Alterar status (Ativo/Fechado)' },
      { key: 'permissaoVerComanda', label: 'Ver comanda completa' },
      { key: 'permissaoAdicionarBebidaComanda', label: 'Adicionar Bebida' },
      { key: 'permissaoBuyInComanda', label: 'Buy-in (inclui Buy-in 2)' },
      { key: 'permissaoRebuyComanda', label: 'Re-buy (Simples, Duplo e Triplo)' },
      { key: 'permissaoAddOnComanda', label: 'Add-on (inclui Duplo)' },
      { key: 'permissaoFichasComanda', label: 'Fichas (Cash Game)' },
      { key: 'permissaoRemoverItemComanda', label: 'Remover item' },
      { key: 'permissaoPagamentoParcialComanda', label: 'Pagamento Parcial' },
      { key: 'permissaoFecharComanda', label: 'Fechar Comanda' }
    ]
  },
  {
    id: 'torneios',
    label: 'Torneios',
    icon: '🏆',
    secao: 'permissaoTorneios',
    acoes: [
      { key: 'permissaoCriarTorneio', label: 'Novo Torneio' },
      { key: 'permissaoIniciarTorneio', label: 'Iniciar Torneio' },
      { key: 'permissaoFinalizarTorneio', label: 'Finalizar Torneio' },
      { key: 'permissaoExcluirTorneio', label: 'Excluir Torneio' }
    ]
  },
  {
    id: 'produtos',
    label: 'Produtos',
    icon: '📦',
    secao: 'permissaoProdutos',
    acoes: [
      { key: 'permissaoCadastrarProduto', label: 'Novo Produto' },
      { key: 'permissaoAdicionarEstoque', label: 'Adicionar Estoque' },
      { key: 'permissaoEditarProduto', label: 'Editar Produto' },
      { key: 'permissaoExcluirProduto', label: 'Excluir Produto' }
    ]
  },
  {
    id: 'funcionarios',
    label: 'Funcionários',
    icon: '👥',
    secao: 'permissaoFuncionarios',
    acoes: [
      { key: 'permissaoCriarFuncionario', label: 'Novo Funcionário' },
      { key: 'permissaoEditarFuncionario', label: 'Editar Funcionário' },
      { key: 'permissaoDesativarFuncionario', label: 'Desativar Funcionário' }
    ]
  },
  {
    id: 'caixas',
    label: 'Caixas',
    icon: '💰',
    secao: 'permissaoCaixas',
    acoes: [
      { key: 'permissaoAbrirCaixa', label: 'Abrir Caixa' },
      { key: 'permissaoVerCaixa', label: 'Ver Detalhes do Caixa' },
      { key: 'permissaoNovaMovimentacaoCaixa', label: 'Nova Movimentação' },
      { key: 'permissaoCriarCategoriaCaixa', label: 'Nova Categoria' },
      { key: 'permissaoFecharCaixa', label: 'Fechar Caixa' },
      { key: 'permissaoQuitarPendenciaCaixa', label: 'Quitar pendência' }
    ]
  },
  {
    id: 'conferencia',
    label: 'Conferência',
    icon: '🧾',
    secao: 'permissaoConferencia',
    acoes: [
      { key: 'permissaoNovaConferencia', label: 'Novo Lançamento' },
      { key: 'permissaoSalvarConferencia', label: 'Salvar' },
      { key: 'permissaoEditarConferencia', label: 'Alterar dados' },
      { key: 'permissaoExcluirConferencia', label: 'Excluir lançamento' }
    ]
  },
  {
    id: 'conteudo',
    label: 'Conteúdo',
    icon: '📣',
    secao: 'permissaoConteudo',
    acoes: [
      { key: 'permissaoNovaPostagem', label: 'Nova Postagem' },
      { key: 'permissaoEditarPostagem', label: 'Editar Postagem' },
      { key: 'permissaoPublicarPostagem', label: 'Publicar / Retirar do site' },
      { key: 'permissaoExcluirPostagem', label: 'Excluir Postagem' },
      { key: 'permissaoNovoTorneioAgenda', label: 'Novo Torneio na agenda' },
      { key: 'permissaoEditarTorneioAgenda', label: 'Editar Torneio da agenda' },
      { key: 'permissaoExcluirTorneioAgenda', label: 'Excluir Torneio da agenda' }
    ]
  }
] as const;

type Secao = (typeof SECOES_PERMISSOES)[number];

export type PermissaoSecaoKey = Secao['secao'];
export type PermissaoKey = PermissaoSecaoKey | Secao['acoes'][number]['key'];
export type Permissoes = Record<PermissaoKey, boolean>;

const SECAO_DA_ACAO = new Map<PermissaoKey, PermissaoSecaoKey>(
  SECOES_PERMISSOES.flatMap(s => s.acoes.map(a => [a.key, s.secao] as [PermissaoKey, PermissaoSecaoKey]))
);

export const TODAS_PERMISSOES: PermissaoKey[] = SECOES_PERMISSOES.flatMap(s => [s.secao, ...s.acoes.map(a => a.key)]);

/** Seção exigida junto com a ação; undefined quando a chave já é uma seção. */
export function secaoDaAcao(key: PermissaoKey): PermissaoSecaoKey | undefined {
  return SECAO_DA_ACAO.get(key);
}

export function copiarPermissoes(origem?: Partial<Permissoes>): Permissoes {
  return Object.fromEntries(TODAS_PERMISSOES.map(key => [key, !!origem?.[key]])) as Permissoes;
}
