export type StatusPostagem = 'RASCUNHO' | 'PUBLICADO';

export interface Postagem {
  id: number;
  titulo: string;
  conteudo: string;
  imagemUrl?: string | null;
  status: StatusPostagem;
  dataPublicacao?: string | null;
  dataCadastro: string;
  dataAtualizacao?: string | null;
}

export interface SalvarPostagemDto {
  titulo: string;
  conteudo: string;
  imagemUrl?: string | null;
}

export interface TorneioDoDia {
  id: number;
  titulo: string;
  modalidade: string;
  inicio: string;
  fim: string;
  buyIn?: number | null;
  garantido?: number | null;
  descricao?: string | null;
  imagemUrl?: string | null;
  publicado: boolean;
  torneioId?: number | null;
}

export interface SalvarTorneioDoDiaDto {
  titulo: string;
  modalidade: string;
  inicio: string;
  fim: string;
  buyIn?: number | null;
  garantido?: number | null;
  descricao?: string | null;
  imagemUrl?: string | null;
  publicado: boolean;
  torneioId?: number | null;
}
