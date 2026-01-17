import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Torneio, CreateTorneioDto, UpdateTorneioDto, StatusTorneio } from '../models/torneio.model';

@Injectable({
  providedIn: 'root'
})
export class TorneioService {
  private readonly apiUrl = 'http://localhost:5000/api';
  
  // Estado local para torneios (simulação)
  private torneiosSubject = new BehaviorSubject<Torneio[]>(this.getMockTorneios());
  public torneios$ = this.torneiosSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ==================== TORNEIOS ====================
  
  getTorneios(): Observable<Torneio[]> {
    // TODO: Integrar com backend
    // return this.http.get<Torneio[]>(`${this.apiUrl}/torneios`);
    return this.torneios$;
  }

  getTorneio(id: number): Observable<Torneio | undefined> {
    // TODO: Integrar com backend
    // return this.http.get<Torneio>(`${this.apiUrl}/torneios/${id}`);
    const torneios = this.torneiosSubject.value;
    return new Observable(observer => {
      observer.next(torneios.find(t => t.id === id));
      observer.complete();
    });
  }

  createTorneio(torneio: CreateTorneioDto): Observable<Torneio> {
    // TODO: Integrar com backend
    // return this.http.post<Torneio>(`${this.apiUrl}/torneios`, torneio);
    
    const torneios = this.torneiosSubject.value;
    const novoTorneio: Torneio = {
      id: Math.max(...torneios.map(t => t.id), 0) + 1,
      nome: torneio.nome,
      valorBuyIn: torneio.valorBuyIn,
      valorRebuySimples: torneio.valorRebuySimples,
      valorRebuyDuplo: torneio.valorRebuyDuplo,
      valorAddOn: torneio.valorAddOn,
      status: StatusTorneio.AGUARDANDO,
      dataInicio: new Date(),
      participantes: 0,
      premioTotal: 0
    };
    
    this.torneiosSubject.next([...torneios, novoTorneio]);
    
    return new Observable(observer => {
      observer.next(novoTorneio);
      observer.complete();
    });
  }

  updateTorneio(id: number, torneio: UpdateTorneioDto): Observable<Torneio> {
    // TODO: Integrar com backend
    // return this.http.put<Torneio>(`${this.apiUrl}/torneios/${id}`, torneio);
    
    const torneios = this.torneiosSubject.value;
    const index = torneios.findIndex(t => t.id === id);
    
    if (index !== -1) {
      torneios[index] = { ...torneios[index], ...torneio };
      this.torneiosSubject.next([...torneios]);
      
      return new Observable(observer => {
        observer.next(torneios[index]);
        observer.complete();
      });
    }
    
    throw new Error('Torneio não encontrado');
  }

  deleteTorneio(id: number): Observable<void> {
    // TODO: Integrar com backend
    // return this.http.delete<void>(`${this.apiUrl}/torneios/${id}`);
    
    const torneios = this.torneiosSubject.value;
    const novosTorneios = torneios.filter(t => t.id !== id);
    this.torneiosSubject.next(novosTorneios);
    
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  iniciarTorneio(id: number): Observable<Torneio> {
    return this.updateTorneio(id, { status: StatusTorneio.EM_ANDAMENTO });
  }

  finalizarTorneio(id: number): Observable<Torneio> {
    return this.updateTorneio(id, { status: StatusTorneio.FINALIZADO });
  }

  cancelarTorneio(id: number): Observable<Torneio> {
    return this.updateTorneio(id, { status: StatusTorneio.CANCELADO });
  }

  // ==================== MOCK DATA ====================
  
  private getMockTorneios(): Torneio[] {
    return [
      {
        id: 1,
        nome: 'Torneio Texas Hold\'em - Sexta',
        valorBuyIn: 100.00,
        valorRebuySimples: 50.00,
        valorRebuyDuplo: 100.00,
        valorAddOn: 80.00,
        status: StatusTorneio.EM_ANDAMENTO,
        dataInicio: new Date('2026-01-17T19:00:00'),
        participantes: 24,
        premioTotal: 2400.00
      },
      {
        id: 2,
        nome: 'Torneio Sábado - Super Stack',
        valorBuyIn: 150.00,
        valorRebuySimples: 75.00,
        valorRebuyDuplo: 150.00,
        valorAddOn: 100.00,
        status: StatusTorneio.AGUARDANDO,
        dataInicio: new Date('2026-01-18T20:00:00'),
        participantes: 0,
        premioTotal: 0
      },
      {
        id: 3,
        nome: 'Torneio Domingo - Deep Stack',
        valorBuyIn: 200.00,
        valorRebuySimples: 100.00,
        valorRebuyDuplo: 200.00,
        valorAddOn: 150.00,
        status: StatusTorneio.AGUARDANDO,
        dataInicio: new Date('2026-01-19T18:00:00'),
        participantes: 0,
        premioTotal: 0
      },
      {
        id: 4,
        nome: 'Torneio Especial - Janeiro',
        valorBuyIn: 250.00,
        valorRebuySimples: 125.00,
        valorRebuyDuplo: 250.00,
        valorAddOn: 200.00,
        status: StatusTorneio.FINALIZADO,
        dataInicio: new Date('2026-01-10T19:00:00'),
        dataFim: new Date('2026-01-11T02:30:00'),
        participantes: 48,
        premioTotal: 12000.00
      }
    ];
  }
}
