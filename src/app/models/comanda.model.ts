export enum StatusComanda {
  ATIVO = 'ATIVO',
  FECHADO = 'FECHADO'
}

export enum TipoComanda {
  TODOS = 'TODOS',
  TORNEIO = 'TORNEIO',
  CASH = 'CASH',
  BAR = 'BAR'
}

export interface Comanda {
  id: number;
  jogadorNome: string;
  jogadorFoto?: string;
  mesa: string;
  tipo: TipoComanda;
  torneioId?: number;
  torneioNome?: string;
  valorFichas: number;
  valorBebidas: number;
  valorTotal: number;
  /** Soma dos pagamentos parciais já registrados */
  valorPago: number;
  /** Saldo em aberto: valorTotal - valorPago */
  valorRestante: number;
  status: StatusComanda;
  dataAbertura: Date;
  dataFechamento?: Date;
  caixaId?: number;
  itens?: ItemComanda[];
}

export interface ItemComanda {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface CreateComandaDto {
  jogadorNome: string;
  mesa?: string;
  tipo: TipoComanda;
  torneioId?: number;
  torneioNome?: string;
  valorFichas?: number;
}

export interface UpdateComandaDto {
  valorFichas?: number;
  valorBebidas?: number;
  status?: StatusComanda;
  tipo?: string;
  torneioId?: number;
  torneioNome?: string;
  mesa?: string;
  atualizarMesa?: boolean;
}

/** Forma de pagamento e valor ao fechar a comanda */
export interface FormaPagamentoValor {
  formaPagamento: string;
  valor: number;
}

/** DTO para fechar comanda informando as formas de pagamento e opcionalmente desconto/taxa */
export interface FecharComandaDto {
  formasPagamento: FormaPagamentoValor[];
  /** Desconto em reais (R$). Reduz o valor a receber. */
  desconto?: number;
  /** Taxa/acréscimo em reais (R$). Aumenta o valor a receber. */
  taxa?: number;
}

/** DTO para registrar um pagamento parcial sem fechar a comanda */
export interface PagamentoParcialDto {
  formasPagamento: FormaPagamentoValor[];
  /** Desconto em reais (R$) aplicado neste pagamento parcial. */
  desconto?: number;
  /** Taxa/acréscimo em reais (R$) aplicado neste pagamento parcial. */
  taxa?: number;
}

export interface DashboardStats {
  comandasAbertas: number;
  totalFichas: number;
  totalBebidas: number;
  faturamentoTotal: number;
}

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: 'BEBIDA' | 'COMIDA' | 'OUTROS';
  estoque: number;
}

export interface ItemComanda {
  id: number;
  comandaId: number;
  produtoId: number;
  produto: Produto;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}
