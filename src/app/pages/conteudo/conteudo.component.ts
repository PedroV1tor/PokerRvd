import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ConteudoService } from '../../services/conteudo.service';
import { TorneioService } from '../../services/torneio.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { Postagem, TorneioDoDia } from '../../models/conteudo.model';
import { StatusTorneio, Torneio } from '../../models/torneio.model';

interface FormPostagem {
  id: number | null;
  titulo: string;
  conteudo: string;
  imagemUrl: string | null;
}

interface FormTorneio {
  id: number | null;
  torneioId: number | null;
  titulo: string;
  modalidade: string;
  inicio: string;
  fim: string;
  buyIn: number | null;
  garantido: number | null;
  descricao: string;
  imagemUrl: string | null;
  publicado: boolean;
}

@Component({
  selector: 'app-conteudo',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './conteudo.component.html',
  styleUrl: './conteudo.component.scss'
})
export class ConteudoComponent implements OnInit {
  aba: 'postagens' | 'torneio' = 'postagens';
  loading = false;
  salvando = false;
  enviandoImagem = false;

  postagens: Postagem[] = [];
  torneiosDoDia: TorneioDoDia[] = [];
  torneiosCadastrados: Torneio[] = [];

  formPostagem: FormPostagem | null = null;
  formTorneio: FormTorneio | null = null;

  constructor(
    private conteudo: ConteudoService,
    private torneioService: TorneioService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;
    this.conteudo.getPostagens().subscribe({
      next: postagens => {
        this.postagens = postagens;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.toast.error(this.mensagemErro(err, 'Erro ao carregar postagens'));
      }
    });
    this.conteudo.getTorneiosDoDia().subscribe({
      next: torneios => (this.torneiosDoDia = torneios),
      error: err => this.toast.error(this.mensagemErro(err, 'Erro ao carregar torneios do dia'))
    });
    this.torneioService.getTorneios().subscribe({
      next: torneios => {
        this.torneiosCadastrados = torneios.filter(
          t => t.status === StatusTorneio.AGUARDANDO || t.status === StatusTorneio.EM_ANDAMENTO
        );
      },
      error: () => (this.torneiosCadastrados = [])
    });
  }

  // ==================== POSTAGENS ====================

  novaPostagem(): void {
    this.formPostagem = { id: null, titulo: '', conteudo: '', imagemUrl: null };
  }

  editarPostagem(postagem: Postagem): void {
    this.formPostagem = {
      id: postagem.id,
      titulo: postagem.titulo,
      conteudo: postagem.conteudo,
      imagemUrl: postagem.imagemUrl ?? null
    };
  }

  salvarPostagem(): void {
    const form = this.formPostagem;
    if (!form) return;

    if (!form.titulo.trim() || !form.conteudo.trim()) {
      this.toast.warning('Preencha o título e o texto da postagem');
      return;
    }

    const dto = { titulo: form.titulo, conteudo: form.conteudo, imagemUrl: form.imagemUrl };
    const requisicao = form.id
      ? this.conteudo.updatePostagem(form.id, dto)
      : this.conteudo.createPostagem(dto);

    this.salvando = true;
    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.formPostagem = null;
        this.toast.success(form.id ? 'Postagem atualizada' : 'Rascunho criado. Publique quando estiver pronto.');
        this.carregar();
      },
      error: err => {
        this.salvando = false;
        this.toast.error(this.mensagemErro(err, 'Erro ao salvar postagem'));
      }
    });
  }

  alternarPublicacao(postagem: Postagem): void {
    const publicada = postagem.status === 'PUBLICADO';
    const requisicao = publicada
      ? this.conteudo.despublicarPostagem(postagem.id)
      : this.conteudo.publicarPostagem(postagem.id);

    requisicao.subscribe({
      next: () => {
        this.toast.success(publicada ? 'Postagem retirada do site' : 'Postagem publicada. Aparece no site em até 1 minuto.');
        this.carregar();
      },
      error: err => this.toast.error(this.mensagemErro(err, 'Erro ao alterar publicação'))
    });
  }

  excluirPostagem(postagem: Postagem): void {
    this.confirm.confirm({ message: `Deseja realmente excluir "${postagem.titulo}"?`, confirmText: 'Excluir' }).then(ok => {
      if (!ok) return;
      this.conteudo.deletePostagem(postagem.id).subscribe({
        next: () => {
          this.toast.success('Postagem excluída');
          this.carregar();
        },
        error: err => this.toast.error(this.mensagemErro(err, 'Erro ao excluir postagem'))
      });
    });
  }

  // ==================== TORNEIO DO DIA ====================

  novoTorneioDoDia(): void {
    this.formTorneio = {
      id: null,
      torneioId: null,
      titulo: '',
      modalidade: "Texas Hold'em",
      inicio: '',
      fim: '',
      buyIn: null,
      garantido: null,
      descricao: '',
      imagemUrl: null,
      publicado: true
    };
  }

  editarTorneioDoDia(torneio: TorneioDoDia): void {
    this.formTorneio = {
      id: torneio.id,
      torneioId: torneio.torneioId ?? null,
      titulo: torneio.titulo,
      modalidade: torneio.modalidade,
      inicio: this.paraInputLocal(torneio.inicio),
      fim: this.paraInputLocal(torneio.fim),
      buyIn: torneio.buyIn ?? null,
      garantido: torneio.garantido ?? null,
      descricao: torneio.descricao ?? '',
      imagemUrl: torneio.imagemUrl ?? null,
      publicado: torneio.publicado
    };
  }

  /** Puxa nome e buy-in de um torneio já cadastrado. Os dados continuam editáveis. */
  aoSelecionarTorneio(torneioId: number | null): void {
    if (!this.formTorneio) return;
    this.formTorneio.torneioId = torneioId;

    const torneio = this.torneiosCadastrados.find(t => t.id === torneioId);
    if (torneio) {
      this.formTorneio.titulo = torneio.nome;
      this.formTorneio.buyIn = torneio.valorBuyIn;
    }
  }

  salvarTorneioDoDia(): void {
    const form = this.formTorneio;
    if (!form) return;

    if (!form.titulo.trim() || !form.modalidade.trim()) {
      this.toast.warning('Preencha o título e a modalidade');
      return;
    }
    if (!form.inicio || !form.fim) {
      this.toast.warning('Informe o horário de início e de fim');
      return;
    }

    const inicio = new Date(form.inicio);
    const fim = new Date(form.fim);
    if (fim <= inicio) {
      this.toast.warning('O fim deve ser depois do início');
      return;
    }

    const dto = {
      titulo: form.titulo,
      modalidade: form.modalidade,
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
      buyIn: form.buyIn,
      garantido: form.garantido,
      descricao: form.descricao,
      imagemUrl: form.imagemUrl,
      publicado: form.publicado,
      torneioId: form.torneioId
    };
    const requisicao = form.id
      ? this.conteudo.updateTorneioDoDia(form.id, dto)
      : this.conteudo.createTorneioDoDia(dto);

    this.salvando = true;
    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.formTorneio = null;
        this.toast.success('Torneio do dia salvo');
        this.carregar();
      },
      error: err => {
        this.salvando = false;
        this.toast.error(this.mensagemErro(err, 'Erro ao salvar torneio do dia'));
      }
    });
  }

  excluirTorneioDoDia(torneio: TorneioDoDia): void {
    this.confirm.confirm({ message: `Deseja realmente excluir "${torneio.titulo}"?`, confirmText: 'Excluir' }).then(ok => {
      if (!ok) return;
      this.conteudo.deleteTorneioDoDia(torneio.id).subscribe({
        next: () => {
          this.toast.success('Torneio do dia excluído');
          this.carregar();
        },
        error: err => this.toast.error(this.mensagemErro(err, 'Erro ao excluir torneio do dia'))
      });
    });
  }

  situacaoTorneio(torneio: TorneioDoDia): { texto: string; classe: string } {
    if (new Date(torneio.fim) <= new Date()) return { texto: 'Encerrado', classe: 'encerrado' };
    if (!torneio.publicado) return { texto: 'Oculto', classe: 'rascunho' };
    return { texto: 'Publicado', classe: 'publicado' };
  }

  // ==================== IMAGEM ====================

  selecionarImagem(evento: Event, destino: FormPostagem | FormTorneio): void {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    input.value = '';
    if (!arquivo) return;

    if (arquivo.size > 5 * 1024 * 1024) {
      this.toast.warning('A imagem deve ter no máximo 5 MB');
      return;
    }

    this.enviandoImagem = true;
    this.conteudo.enviarImagem(arquivo).subscribe({
      next: resposta => {
        this.enviandoImagem = false;
        destino.imagemUrl = resposta.url;
      },
      error: err => {
        this.enviandoImagem = false;
        this.toast.error(this.mensagemErro(err, 'Erro ao enviar imagem'));
      }
    });
  }

  // ==================== HELPERS ====================

  moeda(valor: number | null | undefined): string {
    return (valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  /** Converte o instante salvo para o formato do campo datetime-local, no horário de quem edita. */
  private paraInputLocal(valor: string): string {
    const data = new Date(valor);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${data.getFullYear()}-${p(data.getMonth() + 1)}-${p(data.getDate())}T${p(data.getHours())}:${p(data.getMinutes())}`;
  }

  private mensagemErro(err: HttpErrorResponse, padrao: string): string {
    return typeof err.error === 'string' && err.error ? err.error : padrao;
  }
}
