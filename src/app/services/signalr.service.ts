import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

/** Eventos emitidos pelo backend via SignalR */
export type PokerEvent =
  | 'ComandaCriada'
  | 'ComandaAtualizada'
  | 'ComandaFechada'
  | 'ComandaRemovida'
  | 'CaixaAberto'
  | 'CaixaFechado'
  | 'MovimentacaoAdicionada'
  | 'TorneioCriado'
  | 'TorneioAtualizado'
  | 'TorneioRemovido';

@Injectable({
  providedIn: 'root'
})
export class SignalrService implements OnDestroy {
  private hubUrl = 'http://localhost:5000/hubs/poker';
  private connection: signalR.HubConnection | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  /** Subject que emite { evento, payload } quando o servidor envia uma mensagem */
  private readonly eventSubject = new Subject<{ evento: PokerEvent; payload: unknown }>();
  readonly onEvent = this.eventSubject.asObservable();

  /** Subject que emite true quando conectado, false quando desconectado */
  private readonly statusSubject = new Subject<boolean>();
  readonly onStatus = this.statusSubject.asObservable();

  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        withCredentials: true,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.connection.onreconnecting(() => {
      this.statusSubject.next(false);
    });

    this.connection.onreconnected(() => {
      this.statusSubject.next(true);
    });

    this.connection.onclose((error?: Error) => {
      this.statusSubject.next(false);
      if (error) {
        console.warn('[SignalR] Conexão fechada:', error.message);
      }
      // Tenta reconectar após 5s se não for reconnect automático
      this.reconnectTimer = setTimeout(() => this.connect(), 5000);
    });

    // Registrar handlers para todos os eventos
    const eventos: PokerEvent[] = [
      'ComandaCriada', 'ComandaAtualizada', 'ComandaFechada', 'ComandaRemovida',
      'CaixaAberto', 'CaixaFechado', 'MovimentacaoAdicionada',
      'TorneioCriado', 'TorneioAtualizado', 'TorneioRemovido'
    ];

    for (const evento of eventos) {
      this.connection.on(evento, (payload?: unknown) => {
        this.eventSubject.next({ evento, payload });
      });
    }

    try {
      await this.connection.start();
      this.statusSubject.next(true);
    } catch (err) {
      console.warn('[SignalR] Falha ao conectar:', err);
      this.statusSubject.next(false);
      this.reconnectTimer = setTimeout(() => this.connect(), 5000);
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.connection?.stop().catch(() => {});
    this.connection = null;
    this.statusSubject.next(false);
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.eventSubject.complete();
    this.statusSubject.complete();
  }
}
