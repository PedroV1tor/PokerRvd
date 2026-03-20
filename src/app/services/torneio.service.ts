import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Torneio, CreateTorneioDto, UpdateTorneioDto, StatusTorneio, TorneioStats } from '../models/torneio.model';

@Injectable({
  providedIn: 'root'
})
export class TorneioService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private get apiUrl(): string {
    return `${this.config.apiUrl}/torneios`;
  }

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

  getEstatisticas(id: number): Observable<TorneioStats> {
    return this.http.get<TorneioStats>(`${this.apiUrl}/${id}/stats`);
  }
}
