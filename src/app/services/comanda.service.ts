import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ConfigService } from './config.service';
import { 
  Comanda, 
  CreateComandaDto, 
  UpdateComandaDto, 
  DashboardStats,
  StatusComanda,
  TipoComanda,
  FecharComandaDto
} from '../models/comanda.model';

@Injectable({
  providedIn: 'root'
})
export class ComandaService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private get apiUrl(): string {
    return this.config.apiUrl;
  }

  // ==================== COMANDAS ====================
  
  getComandas(caixaId?: number): Observable<Comanda[]> {
    const params = caixaId != null ? `?caixaId=${caixaId}` : '';
    return this.http.get<Comanda[]>(`${this.apiUrl}/comandas${params}`);
  }

  getComanda(id: number): Observable<Comanda | undefined> {
    return this.http.get<Comanda>(`${this.apiUrl}/comandas/${id}`).pipe(
      map(comanda => comanda)
    );
  }

  getComandaById(id: number): Observable<Comanda | undefined> {
    return this.getComanda(id);
  }

  createComanda(comanda: CreateComandaDto): Observable<Comanda> {
    return this.http.post<Comanda>(`${this.apiUrl}/comandas`, comanda);
  }

  updateComanda(id: number, update: UpdateComandaDto): Observable<Comanda | null> {
    return this.http.put<Comanda>(`${this.apiUrl}/comandas/${id}`, update);
  }

  fecharComanda(id: number, formasPagamento?: FecharComandaDto): Observable<Comanda | null> {
    return this.http.post(`${this.apiUrl}/comandas/${id}/fechar`, formasPagamento ?? {}, { responseType: 'text' }).pipe(
      map(text => (text ? JSON.parse(text) as Comanda : null))
    );
  }

  deleteComanda(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/comandas/${id}`).pipe(
      map(() => true)
    );
  }

  // ==================== DASHBOARD ====================
  
  getDashboardStats(caixaId?: number): Observable<DashboardStats> {
    const params = caixaId != null ? `?caixaId=${caixaId}` : '';
    return this.http.get<DashboardStats>(`${this.apiUrl}/comandas/stats${params}`);
  }

  // ==================== PRODUTOS E FICHAS ====================
  
  adicionarProduto(comandaId: number, produtoId: number, quantidade: number): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/comandas/${comandaId}/itens`, {
      produtoId,
      quantidade
    }).pipe(
      map(() => true)
    );
  }

  adicionarFichas(comandaId: number, nome: string, valor: number): Observable<boolean> {
    const body = { nome, valor };
    return this.http.post(`${this.apiUrl}/comandas/${comandaId}/fichas`, body).pipe(
      map(() => true)
    );
  }

  removerItem(comandaId: number, itemId: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/comandas/${comandaId}/itens/${itemId}`).pipe(
      map(() => true)
    );
  }

  // ==================== FILTROS (Local) ====================
  
  filtrarComandas(comandas: Comanda[], filtro: TipoComanda, busca: string): Comanda[] {
    let resultado = comandas;

    // Filtro por tipo
    if (filtro !== TipoComanda.TODOS) {
      resultado = resultado.filter(c => c.tipo === filtro);
    }

    // Filtro por busca
    if (busca.trim()) {
      const buscaLower = busca.toLowerCase();
      resultado = resultado.filter(c =>
        c.jogadorNome.toLowerCase().includes(buscaLower) ||
        c.mesa.toLowerCase().includes(buscaLower)
      );
    }

    return resultado;
  }
}
