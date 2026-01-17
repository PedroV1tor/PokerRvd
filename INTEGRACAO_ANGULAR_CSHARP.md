# 🔗 Guia de Integração Angular + C# ASP.NET Core

Este documento explica como o frontend Angular e o backend C# trabalham juntos no projeto PokerRvd.

## 📂 Estrutura do Projeto

```
PokerRvd/
├── Backend/               # Backend C# ASP.NET Core
│   └── PokerRvd.Api/     # Projeto da API
├── src/                   # Frontend Angular
├── angular.json           # Configuração do Angular
├── package.json           # Dependências do Node.js
└── server.ts              # Servidor SSR do Angular
```

## 🚀 Como Rodar o Projeto Completo

### Método 1: Manualmente (Recomendado para Desenvolvimento)

#### 1. Iniciar o Backend (Terminal 1)
```bash
cd Backend/PokerRvd.Api
dotnet run
```
✅ Backend rodando em: http://localhost:5000

#### 2. Iniciar o Frontend (Terminal 2)
```bash
npm start
# ou
ng serve
```
✅ Frontend rodando em: http://localhost:4200

### Método 2: Scripts Automatizados (PowerShell - Windows)

Crie um arquivo `start-all.ps1` na raiz do projeto:

```powershell
# start-all.ps1

# Inicia o Backend em uma nova janela
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend\PokerRvd.Api; dotnet run"

# Aguarda 5 segundos para o backend inicializar
Start-Sleep -Seconds 5

# Inicia o Frontend em uma nova janela
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host "✅ Backend e Frontend iniciados!"
Write-Host "Backend: http://localhost:5000/swagger"
Write-Host "Frontend: http://localhost:4200"
```

Execute:
```bash
.\start-all.ps1
```

### Método 3: Scripts Automatizados (Bash - Linux/Mac)

Crie um arquivo `start-all.sh` na raiz do projeto:

```bash
#!/bin/bash

# start-all.sh

# Inicia o Backend em background
cd Backend/PokerRvd.Api
dotnet run &
BACKEND_PID=$!

# Volta para o diretório raiz
cd ../..

# Aguarda 5 segundos
sleep 5

# Inicia o Frontend
npm start

# Mata o processo do backend quando o frontend for encerrado
kill $BACKEND_PID
```

Torne executável e execute:
```bash
chmod +x start-all.sh
./start-all.sh
```

## 🔌 Consumindo a API no Angular

### 1. Criar um Service no Angular

Crie um arquivo `src/app/services/poker-api.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Player {
  id: number;
  name: string;
  email: string;
  balance: number;
  isActive: boolean;
}

export interface Game {
  id: number;
  name: string;
  buyIn: number;
  maxPlayers: number;
  status: string;
  currentPlayers: number;
}

@Injectable({
  providedIn: 'root'
})
export class PokerApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // Players
  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${id}`);
  }

  createPlayer(player: Partial<Player>): Observable<Player> {
    return this.http.post<Player>(`${this.apiUrl}/players`, player);
  }

  updatePlayer(id: number, player: Partial<Player>): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/players/${id}`, player);
  }

  deletePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/players/${id}`);
  }

  // Games
  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/games`);
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/games/${id}`);
  }

  createGame(game: Partial<Game>): Observable<Game> {
    return this.http.post<Game>(`${this.apiUrl}/games`, game);
  }

  joinGame(gameId: number, playerId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/games/${gameId}/join/${playerId}`, {});
  }
}
```

### 2. Registrar o HttpClient

Em `src/app/app.config.ts`, adicione:

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

### 3. Usar o Service em um Component

Exemplo em `src/app/app.component.ts`:

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokerApiService, Player, Game } from './services/poker-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  players: Player[] = [];
  games: Game[] = [];
  loading = false;

  constructor(private pokerApi: PokerApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // Buscar jogadores
    this.pokerApi.getPlayers().subscribe({
      next: (players) => {
        this.players = players;
        console.log('Jogadores:', players);
      },
      error: (error) => {
        console.error('Erro ao buscar jogadores:', error);
      }
    });

    // Buscar mesas
    this.pokerApi.getGames().subscribe({
      next: (games) => {
        this.games = games;
        this.loading = false;
        console.log('Mesas:', games);
      },
      error: (error) => {
        console.error('Erro ao buscar mesas:', error);
        this.loading = false;
      }
    });
  }

  createPlayer() {
    const newPlayer = {
      name: 'Novo Jogador',
      email: 'novo@poker.com',
      initialBalance: 1000
    };

    this.pokerApi.createPlayer(newPlayer).subscribe({
      next: (player) => {
        console.log('Jogador criado:', player);
        this.loadData(); // Recarrega a lista
      },
      error: (error) => {
        console.error('Erro ao criar jogador:', error);
      }
    });
  }
}
```

### 4. Atualizar o Template HTML

Em `src/app/app.component.html`:

```html
<div class="container">
  <h1>PokerRvd - Sistema de Poker</h1>

  <div *ngIf="loading">Carregando...</div>

  <section class="players-section">
    <h2>Jogadores</h2>
    <button (click)="createPlayer()">Adicionar Jogador</button>
    
    <div class="players-list">
      <div *ngFor="let player of players" class="player-card">
        <h3>{{ player.name }}</h3>
        <p>Email: {{ player.email }}</p>
        <p>Saldo: R$ {{ player.balance | number:'1.2-2' }}</p>
      </div>
    </div>
  </section>

  <section class="games-section">
    <h2>Mesas de Poker</h2>
    
    <div class="games-list">
      <div *ngFor="let game of games" class="game-card">
        <h3>{{ game.name }}</h3>
        <p>Buy-in: R$ {{ game.buyIn | number:'1.2-2' }}</p>
        <p>Jogadores: {{ game.currentPlayers }}/{{ game.maxPlayers }}</p>
        <p>Status: {{ game.status }}</p>
      </div>
    </div>
  </section>
</div>
```

### 5. Adicionar Estilos

Em `src/app/app.component.scss`:

```scss
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: #555;
  margin: 20px 0;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #45a049;
  }
}

.players-list, .games-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.player-card, .game-card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h3 {
    margin-top: 0;
    color: #333;
  }

  p {
    margin: 5px 0;
    color: #666;
  }
}
```

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente (Opcional)

Crie `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

E `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://sua-api-producao.com/api'
};
```

Atualize o service para usar:

```typescript
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokerApiService {
  private apiUrl = environment.apiUrl;
  // ...
}
```

## 🧪 Testando a Integração

### 1. Teste via Swagger
1. Abra http://localhost:5000/swagger
2. Teste os endpoints manualmente
3. Verifique se retornam dados corretamente

### 2. Teste via Angular
1. Abra http://localhost:4200
2. Abra o DevTools (F12)
3. Vá para a aba Network
4. Observe as requisições para a API
5. Verifique se não há erros de CORS

### 3. Teste Manual
```bash
# Testar Health Check
curl http://localhost:5000/api/health

# Testar listagem de jogadores
curl http://localhost:5000/api/players

# Testar criação de jogador
curl -X POST http://localhost:5000/api/players \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@poker.com","initialBalance":1000}'
```

## 🐛 Solução de Problemas Comuns

### Erro de CORS
```
Access to XMLHttpRequest at 'http://localhost:5000/api/players' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Solução**: Verifique se o CORS está configurado corretamente em `Program.cs`

### Backend não responde
1. Verifique se o backend está rodando (Terminal 1)
2. Teste o health check: http://localhost:5000/api/health
3. Verifique as portas no `launchSettings.json`

### Frontend não conecta ao backend
1. Verifique a URL da API no service Angular
2. Confirme que ambos estão rodando
3. Verifique o console do navegador (F12)

## 📦 Deploy

### Backend
```bash
cd Backend/PokerRvd.Api
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
npm run build
# Arquivos em dist/poker-rvd/browser
```

## 📚 Recursos Adicionais

- [Documentação ASP.NET Core](https://docs.microsoft.com/aspnet/core)
- [Documentação Angular HttpClient](https://angular.io/guide/http)
- [CORS no ASP.NET Core](https://docs.microsoft.com/aspnet/core/security/cors)

## ✅ Checklist de Integração

- [ ] Backend rodando na porta 5000
- [ ] Frontend rodando na porta 4200
- [ ] CORS configurado no backend
- [ ] HttpClient configurado no Angular
- [ ] Service criado para consumir a API
- [ ] Testes básicos realizados
- [ ] Erros de console verificados

---

**Pronto!** Agora você tem um projeto fullstack Angular + C# totalmente funcional! 🎉
