export interface Produto {
  id: number;
  nome: string;
  valorCusto: number;
  valorComercial: number;
  quantidadeEstoque: number;
  unidadeVenda: string;
  ativo: boolean;
  dataCadastro: Date;
}

export interface CreateProdutoDto {
  nome: string;
  valorCusto: number;
  valorComercial: number;
  quantidadeEstoque: number;
  unidadeVenda: string;
}

export interface UpdateProdutoDto {
  nome: string;
  valorCusto: number;
  valorComercial: number;
  quantidadeEstoque: number;
  unidadeVenda: string;
  ativo: boolean;
}
