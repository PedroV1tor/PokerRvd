export interface Caixa {
  id: number;
  dataAbertura: Date;
  dataFechamento?: Date;
  status: StatusCaixa;
  saldoInicial: number;
  saldoFinal?: number;
  totalEntradas: number;
  totalSaidas: number;
  usuarioAbertura: string;
  usuarioFechamento?: string;
  observacoesAbertura?: string;
  observacoesFechamento?: string;
  movimentacoes: MovimentacaoCaixa[];
}

export interface MovimentacaoCaixa {
  id: number;
  caixaId: number;
  dataHora: Date;
  tipo: TipoMovimentacao;
  categoria: string;
  descricao: string;
  valor: number;
  comandaId?: number;
  comandaNome?: string;
  usuarioNome: string;
}

export enum StatusCaixa {
  ABERTO = 'ABERTO',
  FECHADO = 'FECHADO'
}

export enum TipoMovimentacao {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA'
}

export interface CreateCaixaDto {
  saldoInicial: number;
  observacoesAbertura?: string;
}

export interface FecharCaixaDto {
  saldoFinal: number;
  observacoesFechamento?: string;
}

export interface CreateMovimentacaoDto {
  tipo: TipoMovimentacao;
  categoria: string;
  descricao: string;
  valor: number;
  comandaId?: number;
}

export interface CaixaDto {
  id: number;
  dataAbertura: string;
  dataFechamento?: string;
  status: StatusCaixa;
  saldoInicial: number;
  saldoFinal?: number;
  totalEntradas: number;
  totalSaidas: number;
  usuarioAbertura: string;
  usuarioFechamento?: string;
  observacoesAbertura?: string;
  observacoesFechamento?: string;
}

export interface CaixaDetailsDto extends CaixaDto {
  movimentacoes: MovimentacaoCaixa[];
}
