import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Torneio, CreateTorneioDto, UpdateTorneioDto, StatusTorneio } from '../models/torneio.model';

@Injectable({
  providedIn: 'root'
})
export class TorneioService {
  private readonly apiUrl = 'http://localhost:5000/api/torneios';

  constructor(private http: HttpClient) {}

  getTorneios(): Observable<Torneio[]> {
    return this.http.get<Torneio[]>(this.apiUrl);
  }

  getTorneio(id: number): Observable<Torneio | undefined> {
    return this.http.get<Torneio>(`${this.apiUrl}/${id}`);
  }

  createTorneio(torneio: CreateTorneioDto): Observable<Torneio> {
    return this.http.post<Torneio>(this.apiUrl, torneio);
  }

  updateTorneio(id: number, torneio: UpdateTorneioDto): Observable<Torneio> {
    return this.http.put<Torneio>(`${this.apiUrl}/${id}`, torneio);
  }

  deleteTorneio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  iniciarTorneio(id: number): Observable<Torneio> {
    return this.http.post<Torneio>(`${this.apiUrl}/${id}/iniciar`, {});
  }

  finalizarTorneio(id: number): Observable<Torneio> {
    return this.http.post<Torneio>(`${this.apiUrl}/${id}/finalizar`, {});
  }

  cancelarTorneio(id: number): Observable<Torneio> {
    return this.http.post<Torneio>(`${this.apiUrl}/${id}/cancelar`, {});
  }
}
