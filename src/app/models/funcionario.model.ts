import { Permissoes } from './permissoes.model';

export interface Funcionario extends Permissoes {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  role: string;
  ativo: boolean;
  dataCadastro: string;
  ultimoAcesso?: string;
}

export interface CreateFuncionarioDto extends Permissoes {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  role: string;
}

export interface UpdateFuncionarioDto extends Permissoes {
  nome: string;
  cpf: string;
  email: string;
  role: string;
  ativo: boolean;
  novaSenha?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  ATENDENTE = 'ATENDENTE'
}
