import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { 
  Comanda, 
  CreateComandaDto, 
  UpdateComandaDto, 
  DashboardStats,
  StatusComanda,
  TipoComanda
} from '../models/comanda.model';

@Injectable({
  providedIn: 'root'
})
export class ComandaService {
  private readonly apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // ==================== COMANDAS ====================
  
  getComandas(): Observable<Comanda[]> {
    return this.http.get<Comanda[]>(`${this.apiUrl}/comandas`);
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

  fecharComanda(id: number): Observable<Comanda | null> {
    return this.updateComanda(id, {
      status: StatusComanda.FECHADO
    });
  }

  deleteComanda(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/comandas/${id}`).pipe(
      map(() => true)
    );
  }

  // ==================== DASHBOARD ====================
  
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/comandas/stats`);
  }

  // ==================== PRODUTOS ====================
  
  adicionarProduto(comandaId: number, produtoId: number, quantidade: number): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/comandas/${comandaId}/produtos`, {
      produtoId,
      quantidade
    }).pipe(
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
