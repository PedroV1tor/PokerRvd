# 🚀 Início Rápido - PokerRvd

Guia rápido para colocar o projeto funcionando em **5 minutos**!

## ✅ Pré-requisitos

Você precisa ter instalado:
- **Node.js 18+** → https://nodejs.org/
- **.NET 8.0 SDK** → https://dotnet.microsoft.com/download/dotnet/8.0

## 📦 Passo 1: Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
# Instalar dependências do Frontend (Angular)
npm install

# Restaurar dependências do Backend (C#)
cd Backend/PokerRvd.Api
dotnet restore
cd ../..
```

## 🏃 Passo 2: Executar o Projeto

### Opção A: Script Automatizado (Recomendado)

#### Windows:
```powershell
.\start-all.ps1
```

#### Linux/Mac:
```bash
chmod +x start-all.sh
./start-all.sh
```

### Opção B: Manual (2 terminais)

**Terminal 1 - Backend:**
```bash
cd Backend/PokerRvd.Api
dotnet run
```

**Terminal 2 - Frontend:**
```bash
npm start
```

## 🎉 Passo 3: Acessar a Aplicação

Após alguns segundos, acesse:

- **📱 Frontend**: http://localhost:4200
- **🔧 API Backend**: http://localhost:5000
- **📚 Swagger Docs**: http://localhost:5000/swagger

## 🧪 Passo 4: Testar a API

### Via Swagger (Interface Gráfica)

1. Abra http://localhost:5000/swagger
2. Clique em `GET /api/health`
3. Clique em "Try it out"
4. Clique em "Execute"
5. Você verá o status da API ✅

### Via Navegador

Simplesmente acesse no navegador:
- http://localhost:5000/api/health
- http://localhost:5000/api/players
- http://localhost:5000/api/games

### Via curl (Terminal)

```bash
# Health check
curl http://localhost:5000/api/health

# Listar jogadores
curl http://localhost:5000/api/players

# Listar mesas
curl http://localhost:5000/api/games

# Criar um jogador
curl -X POST http://localhost:5000/api/players \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@poker.com","initialBalance":1000}'
```

## 💡 Integrando Frontend com Backend

### 1. Atualizar app.config.ts

Adicione o `HttpClient` em `src/app/app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';  // ← Adicione
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()  // ← Adicione esta linha
  ]
};
```

### 2. Usar o Service no Component

Atualize `src/app/app.component.ts`:

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PokerApiService, Player, Game } from './services/poker-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'PokerRvd';
  players: Player[] = [];
  games: Game[] = [];
  loading = false;
  error = '';

  constructor(private pokerApi: PokerApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = '';

    // Buscar jogadores
    this.pokerApi.getPlayers().subscribe({
      next: (players) => {
        this.players = players;
        console.log('✅ Jogadores carregados:', players);
      },
      error: (error) => {
        this.error = error.message;
        console.error('❌ Erro ao buscar jogadores:', error.message);
      }
    });

    // Buscar mesas
    this.pokerApi.getGames().subscribe({
      next: (games) => {
        this.games = games;
        this.loading = false;
        console.log('✅ Mesas carregadas:', games);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('❌ Erro ao buscar mesas:', error.message);
      }
    });
  }

  createPlayer() {
    const newPlayer = {
      name: 'Jogador Teste',
      email: 'teste@poker.com',
      initialBalance: 1000
    };

    this.pokerApi.createPlayer(newPlayer).subscribe({
      next: (player) => {
        console.log('✅ Jogador criado:', player);
        this.loadData(); // Recarrega os dados
      },
      error: (error) => {
        console.error('❌ Erro ao criar jogador:', error.message);
      }
    });
  }
}
```

### 3. Atualizar o Template HTML

Atualize `src/app/app.component.html`:

```html
<div style="padding: 20px; max-width: 1200px; margin: 0 auto; font-family: Arial, sans-serif;">
  <h1 style="text-align: center; color: #333;">🃏 {{ title }}</h1>
  
  <div style="text-align: center; margin: 20px 0;">
    <button (click)="loadData()" 
            style="padding: 10px 20px; margin: 5px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
      🔄 Recarregar Dados
    </button>
    <button (click)="createPlayer()" 
            style="padding: 10px 20px; margin: 5px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
      ➕ Criar Jogador Teste
    </button>
  </div>

  <div *ngIf="loading" style="text-align: center; color: #666;">
    ⏳ Carregando...
  </div>

  <div *ngIf="error" style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 4px; margin: 20px 0;">
    ❌ Erro: {{ error }}
  </div>

  <section style="margin-top: 40px;">
    <h2 style="color: #555;">👥 Jogadores ({{ players.length }})</h2>
    
    <div *ngIf="players.length === 0" style="color: #999; text-align: center; padding: 20px;">
      Nenhum jogador encontrado. Clique em "Criar Jogador Teste" para adicionar um.
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
      <div *ngFor="let player of players" 
           style="background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; color: #333;">{{ player.name }}</h3>
        <p style="margin: 5px 0; color: #666;">📧 {{ player.email }}</p>
        <p style="margin: 5px 0; color: #4CAF50; font-weight: bold;">💰 R$ {{ player.balance | number:'1.2-2' }}</p>
        <p style="margin: 5px 0; color: #999; font-size: 12px;">
          Status: {{ player.isActive ? '✅ Ativo' : '❌ Inativo' }}
        </p>
      </div>
    </div>
  </section>

  <section style="margin-top: 40px;">
    <h2 style="color: #555;">🎲 Mesas de Poker ({{ games.length }})</h2>
    
    <div *ngIf="games.length === 0" style="color: #999; text-align: center; padding: 20px;">
      Nenhuma mesa disponível no momento.
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
      <div *ngFor="let game of games" 
           style="background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; color: #333;">{{ game.name }}</h3>
        <p style="margin: 5px 0; color: #666;">💵 Buy-in: R$ {{ game.buyIn | number:'1.2-2' }}</p>
        <p style="margin: 5px 0; color: #666;">👥 Jogadores: {{ game.currentPlayers }}/{{ game.maxPlayers }}</p>
        <p style="margin: 5px 0; color: #999; font-size: 12px;">
          📊 Status: {{ game.status }}
        </p>
      </div>
    </div>
  </section>

  <footer style="margin-top: 60px; padding: 20px; text-align: center; color: #999; border-top: 1px solid #ddd;">
    <p>💻 Desenvolvido com Angular 18 + C# ASP.NET Core 8</p>
    <p style="font-size: 12px;">
      <a href="http://localhost:5000/swagger" target="_blank" style="color: #2196F3;">📚 Documentação da API (Swagger)</a>
    </p>
  </footer>
</div>

<router-outlet />
```

## 🎯 Resultado Esperado

Depois de seguir esses passos, você deve ver:

1. ✅ Lista de 2 jogadores (dados de seed)
2. ✅ Lista de 1 mesa (dados de seed)
3. ✅ Botão "Criar Jogador Teste" funcionando
4. ✅ Botão "Recarregar Dados" funcionando

## 🐛 Problemas Comuns

### "Não foi possível conectar ao servidor"

**Solução**: Certifique-se de que o backend está rodando:
```bash
cd Backend/PokerRvd.Api
dotnet run
```

### "Porta 5000 já está em uso"

**Solução**: Mate o processo na porta 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [número_do_PID] /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### "npm install falha"

**Solução**: Limpe o cache e tente novamente:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### "dotnet: command not found"

**Solução**: Instale o .NET SDK:
- https://dotnet.microsoft.com/download/dotnet/8.0

### Erro de CORS

**Solução**: Verifique se o backend está configurado corretamente em `Backend/PokerRvd.Api/Program.cs`.
A URL do Angular (`http://localhost:4200`) deve estar na lista de origens permitidas.

## 📚 Próximos Passos

Agora que tudo está funcionando, você pode:

1. 📖 Ler a documentação completa: `README.md`
2. 🔗 Entender a integração: `INTEGRACAO_ANGULAR_CSHARP.md`
3. 🎨 Customizar o frontend
4. 🔧 Adicionar novos endpoints no backend
5. 🚀 Implementar funcionalidades de poker

## 🆘 Precisa de Ajuda?

- Consulte o `README.md` principal
- Veja a documentação do backend: `Backend/README.md`
- Acesse o Swagger: http://localhost:5000/swagger
- Leia o guia de integração: `INTEGRACAO_ANGULAR_CSHARP.md`

---

**Boa sorte com seu projeto! 🎉**
