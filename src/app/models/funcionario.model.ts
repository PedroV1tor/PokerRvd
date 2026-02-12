export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  role: string;
  ativo: boolean;
  dataCadastro: string;
  ultimoAcesso?: string;
}

export interface CreateFuncionarioDto {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  role: string;
}

export interface UpdateFuncionarioDto {
  nome: string;
  cpf: string;
  email: string;
  role: string;
  ativo: boolean;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  ATENDENTE = 'ATENDENTE'
}
