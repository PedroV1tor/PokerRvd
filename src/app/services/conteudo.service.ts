import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Postagem, SalvarPostagemDto, SalvarTorneioDoDiaDto, TorneioDoDia } from '../models/conteudo.model';

@Injectable({
  providedIn: 'root'
})
export class ConteudoService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private get apiUrl(): string {
    return `${this.config.apiUrl}/conteudo`;
  }

  getPostagens(): Observable<Postagem[]> {
    return this.http.get<Postagem[]>(`${this.apiUrl}/postagens`);
  }

  createPostagem(dto: SalvarPostagemDto): Observable<Postagem> {
    return this.http.post<Postagem>(`${this.apiUrl}/postagens`, dto);
  }

  updatePostagem(id: number, dto: SalvarPostagemDto): Observable<Postagem> {
    return this.http.put<Postagem>(`${this.apiUrl}/postagens/${id}`, dto);
  }

  deletePostagem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/postagens/${id}`);
  }

  publicarPostagem(id: number): Observable<Postagem> {
    return this.http.post<Postagem>(`${this.apiUrl}/postagens/${id}/publicar`, {});
  }

  despublicarPostagem(id: number): Observable<Postagem> {
    return this.http.post<Postagem>(`${this.apiUrl}/postagens/${id}/despublicar`, {});
  }

  getTorneiosDoDia(): Observable<TorneioDoDia[]> {
    return this.http.get<TorneioDoDia[]>(`${this.apiUrl}/torneios-do-dia`);
  }

  createTorneioDoDia(dto: SalvarTorneioDoDiaDto): Observable<TorneioDoDia> {
    return this.http.post<TorneioDoDia>(`${this.apiUrl}/torneios-do-dia`, dto);
  }

  updateTorneioDoDia(id: number, dto: SalvarTorneioDoDiaDto): Observable<TorneioDoDia> {
    return this.http.put<TorneioDoDia>(`${this.apiUrl}/torneios-do-dia/${id}`, dto);
  }

  deleteTorneioDoDia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/torneios-do-dia/${id}`);
  }

  enviarImagem(arquivo: File): Observable<{ url: string }> {
    const form = new FormData();
    form.append('arquivo', arquivo);
    return this.http.post<{ url: string }>(`${this.apiUrl}/imagens`, form);
  }
}
