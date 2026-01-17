export interface Torneio {
  id: number;
  nome: string;
  valorBuyIn: number;
  valorRebuySimples: number;
  valorRebuyDuplo: number;
  valorAddOn: number;
  status: StatusTorneio;
  dataInicio?: Date;
  dataFim?: Date;
  participantes?: number;
  premioTotal?: number;
}

export enum StatusTorneio {
  AGUARDANDO = 'AGUARDANDO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO'
}

export interface CreateTorneioDto {
  nome: string;
  valorBuyIn: number;
  valorRebuySimples: number;
  valorRebuyDuplo: number;
  valorAddOn: number;
}

export interface UpdateTorneioDto {
  nome?: string;
  valorBuyIn?: number;
  valorRebuySimples?: number;
  valorRebuyDuplo?: number;
  valorAddOn?: number;
  status?: StatusTorneio;
}
