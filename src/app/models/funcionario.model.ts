export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  role: string;
  ativo: boolean;
  dataCadastro: string;
  ultimoAcesso?: string;
  permissaoComandas: boolean;
  permissaoTorneios: boolean;
  permissaoProdutos: boolean;
  permissaoFuncionarios: boolean;
  permissaoCaixas: boolean;
  permissaoConferencia: boolean;
  permissaoFecharComanda: boolean;
  permissaoRemoverItemComanda: boolean;
  permissaoAdicionarEstoque: boolean;
  permissaoCadastrarProduto: boolean;
}

export interface CreateFuncionarioDto {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  role: string;
  permissaoComandas: boolean;
  permissaoTorneios: boolean;
  permissaoProdutos: boolean;
  permissaoFuncionarios: boolean;
  permissaoCaixas: boolean;
  permissaoConferencia: boolean;
  permissaoFecharComanda: boolean;
  permissaoRemoverItemComanda: boolean;
  permissaoAdicionarEstoque: boolean;
  permissaoCadastrarProduto: boolean;
}

export interface UpdateFuncionarioDto {
  nome: string;
  cpf: string;
  email: string;
  role: string;
  ativo: boolean;
  permissaoComandas: boolean;
  permissaoTorneios: boolean;
  permissaoProdutos: boolean;
  permissaoFuncionarios: boolean;
  permissaoCaixas: boolean;
  permissaoConferencia: boolean;
  permissaoFecharComanda: boolean;
  permissaoRemoverItemComanda: boolean;
  permissaoAdicionarEstoque: boolean;
  permissaoCadastrarProduto: boolean;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  ATENDENTE = 'ATENDENTE'
}
