export interface User {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
  ativo: boolean;
  dataCadastro: Date;
  permissaoComandas?: boolean;
  permissaoTorneios?: boolean;
  permissaoProdutos?: boolean;
  permissaoFuncionarios?: boolean;
  permissaoCaixas?: boolean;
  permissaoConferencia?: boolean;
  permissaoConteudo?: boolean;
  permissaoFecharComanda?: boolean;
  permissaoRemoverItemComanda?: boolean;
  permissaoAdicionarEstoque?: boolean;
  permissaoCadastrarProduto?: boolean;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  ATENDENTE = 'ATENDENTE'
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message: string;
}

export interface LoginState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
