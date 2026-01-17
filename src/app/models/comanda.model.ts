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
  status: StatusComanda;
  dataAbertura: Date;
  dataFechamento?: Date;
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
  mesa: string;
  tipo: TipoComanda;
  torneioId?: number;
  torneioNome?: string;
  valorFichas?: number;
}

export interface UpdateComandaDto {
  valorFichas?: number;
  valorBebidas?: number;
  status?: StatusComanda;
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
