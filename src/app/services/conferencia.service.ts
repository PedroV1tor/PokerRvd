import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Conferencia, CreateConferenciaDto, UpdateConferenciaDto } from '../models/conferencia.model';

@Injectable({
  providedIn: 'root'
})
export class ConferenciaService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private get apiUrl(): string {
    return `${this.config.apiUrl}/conferencias`;
  }

  getConferencias(): Observable<Conferencia[]> {
    return this.http.get<Conferencia[]>(this.apiUrl);
  }

  getConferencia(id: number): Observable<Conferencia> {
    return this.http.get<Conferencia>(`${this.apiUrl}/${id}`);
  }

  createConferencia(dto: CreateConferenciaDto): Observable<Conferencia> {
    return this.http.post<Conferencia>(this.apiUrl, dto);
  }

  updateConferencia(id: number, dto: UpdateConferenciaDto): Observable<Conferencia> {
    return this.http.put<Conferencia>(`${this.apiUrl}/${id}`, dto);
  }

  deleteConferencia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
