import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Funcionario, CreateFuncionarioDto, UpdateFuncionarioDto } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private get apiUrl(): string {
    return `${this.config.apiUrl}/funcionarios`;
  }

  getFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl);
  }

  getFuncionario(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${id}`);
  }

  createFuncionario(funcionario: CreateFuncionarioDto): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.apiUrl, funcionario);
  }

  updateFuncionario(id: number, funcionario: UpdateFuncionarioDto): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.apiUrl}/${id}`, funcionario);
  }

  deleteFuncionario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkCpf(cpf: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-cpf/${cpf}`);
  }

  checkEmail(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-email/${email}`);
  }
}
