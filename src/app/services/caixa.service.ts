import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { 
  Caixa, 
  CaixaDto, 
  CaixaDetailsDto, 
  CreateCaixaDto, 
  FecharCaixaDto,
  CreateMovimentacaoDto
} from '../models/caixa.model';

@Injectable({
  providedIn: 'root'
})
export class CaixaService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private get apiUrl(): string {
    return `${this.config.apiUrl}/caixas`;
  }

  getCaixas(): Observable<CaixaDto[]> {
    return this.http.get<CaixaDto[]>(this.apiUrl);
  }

  getCaixa(id: number): Observable<CaixaDetailsDto> {
    return this.http.get<CaixaDetailsDto>(`${this.apiUrl}/${id}`);
  }

  getCaixaAberto(): Observable<CaixaDto> {
    return this.http.get<CaixaDto>(`${this.apiUrl}/aberto`);
  }

  abrirCaixa(dto: CreateCaixaDto): Observable<CaixaDto> {
    return this.http.post<CaixaDto>(`${this.apiUrl}/abrir`, dto);
  }

  fecharCaixa(id: number, dto: FecharCaixaDto): Observable<CaixaDto> {
    return this.http.post<CaixaDto>(`${this.apiUrl}/${id}/fechar`, dto);
  }

  addMovimentacao(caixaId: number, dto: CreateMovimentacaoDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/${caixaId}/movimentacoes`, dto);
  }
}
