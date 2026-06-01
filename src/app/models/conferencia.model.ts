export interface Conferencia {
  id: number;
  dia: string;
  rake: number;
  caixinhas: number;
  bonus: number;
  defesas: number;
  despesasPagas: number;
  percas: number;
  saldoDia: number;
  pgtoCartao: number;
  aReceber: number;
  saldoConta: number;
  totalCreditos: number;
  diferenca: number;
  observacao?: string;
}

export interface CreateConferenciaDto {
  dia: string;
  rake: number;
  caixinhas: number;
  bonus: number;
  defesas: number;
  despesasPagas: number;
  percas: number;
  pgtoCartao: number;
  aReceber: number;
  saldoConta: number;
  observacao?: string;
}

export interface UpdateConferenciaDto {
  dia?: string;
  rake?: number;
  caixinhas?: number;
  bonus?: number;
  defesas?: number;
  despesasPagas?: number;
  percas?: number;
  pgtoCartao?: number;
  aReceber?: number;
  saldoConta?: number;
  observacao?: string;
}
