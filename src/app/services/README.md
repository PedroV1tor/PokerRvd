# Services - PokerRvd

Esta pasta contém os serviços Angular que fazem a comunicação com o backend C#.

## PokerApiService

Service principal para consumir a API REST do backend.

### Configuração

1. **Adicione o HttpClient no app.config.ts:**

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()  // ← Adicione esta linha
  ]
};
```

### Uso Básico

#### 1. Importar o service no component

```typescript
import { Component, OnInit } from '@angular/core';
import { PokerApiService, Player, Game } from './services/poker-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  
  constructor(private pokerApi: PokerApiService) {}
  
  ngOnInit() {
    // Seu código aqui
  }
}
```

#### 2. Buscar dados

```typescript
// Listar jogadores
this.pokerApi.getPlayers().subscribe({
  next: (players) => {
    console.log('Jogadores:', players);
    this.players = players;
  },
  error: (error) => {
    console.error('Erro:', error.message);
  }
});

// Buscar um jogador específico
this.pokerApi.getPlayer(1).subscribe({
  next: (player) => console.log('Jogador:', player),
  error: (error) => console.error('Erro:', error.message)
});

// Listar mesas
this.pokerApi.getGames().subscribe({
  next: (games) => console.log('Mesas:', games),
  error: (error) => console.error('Erro:', error.message)
});
```

#### 3. Criar registros

```typescript
// Criar um novo jogador
const newPlayer = {
  name: 'João Silva',
  email: 'joao@poker.com',
  initialBalance: 1000
};

this.pokerApi.createPlayer(newPlayer).subscribe({
  next: (player) => {
    console.log('Jogador criado:', player);
    // Atualizar lista ou navegar para outra tela
  },
  error: (error) => {
    console.error('Erro ao criar jogador:', error.message);
  }
});

// Criar uma nova mesa
const newGame = {
  name: 'Mesa VIP',
  buyIn: 500,
  maxPlayers: 6
};

this.pokerApi.createGame(newGame).subscribe({
  next: (game) => console.log('Mesa criada:', game),
  error: (error) => console.error('Erro:', error.message)
});
```

#### 4. Atualizar registros

```typescript
// Atualizar saldo de um jogador
this.pokerApi.updatePlayer(1, { balance: 2000 }).subscribe({
  next: (player) => console.log('Jogador atualizado:', player),
  error: (error) => console.error('Erro:', error.message)
});
```

#### 5. Deletar registros

```typescript
// Remover um jogador (soft delete)
this.pokerApi.deletePlayer(1).subscribe({
  next: () => {
    console.log('Jogador removido com sucesso');
    // Atualizar lista
  },
  error: (error) => console.error('Erro:', error.message)
});
```

#### 6. Ações especiais

```typescript
// Jogador entrar em uma mesa
this.pokerApi.joinGame(1, 1).subscribe({
  next: (response) => console.log(response.message),
  error: (error) => console.error('Erro:', error.message)
});

// Verificar saúde da API
this.pokerApi.checkHealth().subscribe({
  next: (health) => console.log('API Status:', health),
  error: (error) => console.error('API offline:', error.message)
});
```

### Exemplo Completo de Component

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokerApiService, Player, Game } from './services/poker-api.service';

@Component({
  selector: 'app-poker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Sistema de Poker</h1>
      
      <div *ngIf="loading">Carregando...</div>
      
      <section>
        <h2>Jogadores</h2>
        <button (click)="loadPlayers()">Recarregar</button>
        <button (click)="createTestPlayer()">Criar Jogador Teste</button>
        
        <div class="list">
          <div *ngFor="let player of players" class="card">
            <h3>{{ player.name }}</h3>
            <p>{{ player.email }}</p>
            <p>Saldo: R$ {{ player.balance | number:'1.2-2' }}</p>
            <button (click)="deletePlayer(player.id)">Remover</button>
          </div>
        </div>
      </section>
      
      <section>
        <h2>Mesas</h2>
        <button (click)="loadGames()">Recarregar</button>
        
        <div class="list">
          <div *ngFor="let game of games" class="card">
            <h3>{{ game.name }}</h3>
            <p>Buy-in: R$ {{ game.buyIn | number:'1.2-2' }}</p>
            <p>Jogadores: {{ game.currentPlayers }}/{{ game.maxPlayers }}</p>
            <p>Status: {{ game.status }}</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .list { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
    button { margin: 5px; padding: 8px 15px; }
  `]
})
export class PokerComponent implements OnInit {
  players: Player[] = [];
  games: Game[] = [];
  loading = false;

  constructor(private pokerApi: PokerApiService) {}

  ngOnInit() {
    this.loadPlayers();
    this.loadGames();
  }

  loadPlayers() {
    this.loading = true;
    this.pokerApi.getPlayers().subscribe({
      next: (players) => {
        this.players = players;
        this.loading = false;
      },
      error: (error) => {
        console.error(error.message);
        this.loading = false;
      }
    });
  }

  loadGames() {
    this.pokerApi.getGames().subscribe({
      next: (games) => this.games = games,
      error: (error) => console.error(error.message)
    });
  }

  createTestPlayer() {
    const newPlayer = {
      name: `Jogador ${Date.now()}`,
      email: `jogador${Date.now()}@poker.com`,
      initialBalance: 1000
    };

    this.pokerApi.createPlayer(newPlayer).subscribe({
      next: () => this.loadPlayers(),
      error: (error) => console.error(error.message)
    });
  }

  deletePlayer(id: number) {
    if (confirm('Deseja realmente remover este jogador?')) {
      this.pokerApi.deletePlayer(id).subscribe({
        next: () => this.loadPlayers(),
        error: (error) => console.error(error.message)
      });
    }
  }
}
```

## Tratamento de Erros

O service possui tratamento automático de erros que:

1. Detecta erros de conexão (API offline)
2. Identifica erros HTTP (404, 400, 500, etc.)
3. Retorna mensagens amigáveis
4. Registra erros no console

Todos os erros são propagados através de `Observable<never>` e podem ser capturados no `error` callback do `subscribe()`.

## Tipos TypeScript

Todas as interfaces estão definidas no próprio arquivo do service:

- `Player` - Dados de um jogador
- `CreatePlayerDto` - Dados para criar jogador
- `UpdatePlayerDto` - Dados para atualizar jogador
- `Game` - Resumo de uma mesa
- `GameDetails` - Detalhes completos de uma mesa
- `CreateGameDto` - Dados para criar mesa
- `HealthStatus` - Status da API

## Configuração da URL da API

Por padrão, a URL da API é `http://localhost:5000/api`.

Para usar uma URL diferente em produção, você pode:

1. Usar variáveis de ambiente
2. Criar um arquivo de configuração
3. Alterar diretamente no service

### Exemplo com variáveis de ambiente:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.meusite.com/api'
};

// No service:
import { environment } from '../environments/environment';

export class PokerApiService {
  private readonly apiUrl = environment.apiUrl;
  // ...
}
```

## Dicas

1. **Sempre faça unsubscribe**: Use `takeUntil()` ou `async pipe` para evitar memory leaks
2. **Use loading states**: Mostre feedback visual enquanto carrega dados
3. **Trate erros**: Sempre tenha um callback `error` nos subscribes
4. **Cache quando possível**: Para dados que não mudam frequentemente
5. **Teste a API primeiro**: Use Swagger para garantir que os endpoints funcionam

## Testando a API

Antes de implementar no Angular, teste os endpoints:

1. Execute o backend: `cd Backend/PokerRvd.Api && dotnet run`
2. Abra o Swagger: http://localhost:5000/swagger
3. Teste cada endpoint manualmente
4. Verifique os dados retornados

## Próximos Passos

- [ ] Adicionar autenticação (JWT)
- [ ] Implementar cache local
- [ ] Adicionar retry automático
- [ ] Implementar interceptors HTTP
- [ ] Adicionar loading global
- [ ] Implementar WebSockets para tempo real
