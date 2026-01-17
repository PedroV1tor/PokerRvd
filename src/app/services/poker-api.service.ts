import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaces para os dados da API
export interface Player {
  id: number;
  name: string;
  email: string;
  balance: number;
  isActive: boolean;
}

export interface CreatePlayerDto {
  name: string;
  email: string;
  initialBalance: number;
}

export interface UpdatePlayerDto {
  name?: string;
  balance?: number;
  isActive?: boolean;
}

export interface Game {
  id: number;
  name: string;
  buyIn: number;
  maxPlayers: number;
  status: string;
  currentPlayers: number;
}

export interface GameDetails {
  id: number;
  name: string;
  buyIn: number;
  maxPlayers: number;
  status: string;
  players: Player[];
}

export interface CreateGameDto {
  name: string;
  buyIn: number;
  maxPlayers: number;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

@Injectable({
  providedIn: 'root'
})
export class PokerApiService {
  private readonly apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // ==================== HEALTH CHECK ====================
  
  /**
   * Verifica se a API está funcionando
   */
  checkHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(`${this.apiUrl}/health`)
      .pipe(catchError(this.handleError));
  }

  // ==================== PLAYERS ====================
  
  /**
   * Obtém todos os jogadores ativos
   */
  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtém um jogador específico por ID
   */
  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Cria um novo jogador
   */
  createPlayer(player: CreatePlayerDto): Observable<Player> {
    return this.http.post<Player>(`${this.apiUrl}/players`, player)
      .pipe(catchError(this.handleError));
  }

  /**
   * Atualiza um jogador existente
   */
  updatePlayer(id: number, player: UpdatePlayerDto): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/players/${id}`, player)
      .pipe(catchError(this.handleError));
  }

  /**
   * Remove um jogador (soft delete)
   */
  deletePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/players/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ==================== GAMES ====================
  
  /**
   * Obtém todas as mesas de jogo
   */
  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/games`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtém detalhes de uma mesa específica
   */
  getGame(id: number): Observable<GameDetails> {
    return this.http.get<GameDetails>(`${this.apiUrl}/games/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Cria uma nova mesa de jogo
   */
  createGame(game: CreateGameDto): Observable<Game> {
    return this.http.post<Game>(`${this.apiUrl}/games`, game)
      .pipe(catchError(this.handleError));
  }

  /**
   * Permite que um jogador entre em uma mesa
   */
  joinGame(gameId: number, playerId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/games/${gameId}/join/${playerId}`, {})
      .pipe(catchError(this.handleError));
  }

  // ==================== ERROR HANDLING ====================
  
  /**
   * Manipula erros de requisições HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      if (error.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se a API está rodando.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso não encontrado.';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Requisição inválida.';
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor.';
      } else {
        errorMessage = `Erro ${error.status}: ${error.error?.message || error.message}`;
      }
    }
    
    console.error('Erro na API:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
