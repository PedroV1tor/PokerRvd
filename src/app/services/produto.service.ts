import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Produto, CreateProdutoDto, UpdateProdutoDto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private get apiUrl(): string {
    return this.config.apiUrl;
  }

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/produtos`);
  }

  getProduto(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/produtos/${id}`);
  }

  createProduto(produto: CreateProdutoDto): Observable<Produto> {
    return this.http.post<Produto>(`${this.apiUrl}/produtos`, produto);
  }

  updateProduto(id: number, produto: UpdateProdutoDto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/produtos/${id}`, produto);
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/produtos/${id}`);
  }

  atualizarEstoque(id: number, quantidade: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/produtos/${id}/estoque`, quantidade);
  }
}
