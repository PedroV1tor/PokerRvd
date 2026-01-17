# 🎮 Como Executar o Sistema PokerRvd

Guia completo para executar o sistema de gerenciamento de poker com Angular + C#.

## 📋 Requisitos

- **Node.js 18+** e npm
- **.NET 8.0 SDK**
- PowerShell (Windows) ou Bash (Linux/Mac)

## 🚀 Execução Rápida (Método Recomendado)

### Windows
```powershell
.\start-all.ps1
```

### Linux/Mac
```bash
chmod +x start-all.sh
./start-all.sh
```

Este script irá:
1. ✅ Verificar se Node.js e .NET estão instalados
2. ✅ Iniciar o backend C# na porta 5000
3. ✅ Iniciar o frontend Angular na porta 4200
4. ✅ Abrir automaticamente as URLs relevantes

## 🔧 Execução Manual

### Passo 1: Instalar Dependências

```bash
# Frontend
npm install

# Backend
cd Backend/PokerRvd.Api
dotnet restore
cd ../..
```

### Passo 2: Executar Backend (Terminal 1)

```bash
cd Backend/PokerRvd.Api
dotnet run
```

**Backend estará disponível em:**
- API: http://localhost:5000
- Swagger: http://localhost:5000/swagger

### Passo 3: Executar Frontend (Terminal 2)

```bash
npm start
```

**Frontend estará disponível em:**
- Aplicação: http://localhost:4200

## 📱 Acessando a Aplicação

Após executar, você verá:

1. **Frontend (http://localhost:4200)**
   - Interface principal do sistema
   - Gerenciamento de comandas
   - Dashboard com estatísticas em tempo real

2. **Swagger API (http://localhost:5000/swagger)**
   - Documentação interativa da API
   - Testar endpoints diretamente
   - Ver modelos de dados

## 🎯 Funcionalidades Disponíveis

### Na Interface (Frontend)

1. **Barra de Navegação Superior**
   - Logo R♦D POKER CLUB
   - Menu: Comandas, Torneios, Produtos, Relatórios
   - Botão "Nova Comanda"

2. **Busca e Filtros**
   - Campo de busca por jogador ou comanda
   - Filtros: Todas, Torneio, Cash, Bar

3. **Cards de Comandas**
   - Visualização de comandas ativas e fechadas
   - Avatar do jogador (iniciais)
   - Nome, mesa e tipo da comanda
   - Valores em fichas e bebidas
   - Status (ATIVO/FECHADO)
   - Menu dropdown com opções

4. **Dashboard de Estatísticas**
   - 💰 Comandas Abertas
   - 🎲 Total em Fichas
   - 🍺 Total em Bebidas
   - 💵 Faturamento Total (destaque verde neon)

5. **Modal Nova Comanda**
   - Nome do jogador
   - Mesa
   - Tipo (Torneio/Cash/Bar)
   - Valor inicial em fichas

### Na API (Backend)

#### Comandas
```
GET    /api/comandas           - Lista todas as comandas
GET    /api/comandas/{id}      - Obtém uma comanda específica
POST   /api/comandas           - Cria nova comanda
PUT    /api/comandas/{id}      - Atualiza comanda
POST   /api/comandas/{id}/fechar - Fecha uma comanda
DELETE /api/comandas/{id}      - Remove comanda
POST   /api/comandas/{id}/itens - Adiciona produto à comanda
GET    /api/comandas/stats     - Estatísticas do dashboard
```

#### Players
```
GET    /api/players            - Lista jogadores
POST   /api/players            - Cria jogador
PUT    /api/players/{id}       - Atualiza jogador
DELETE /api/players/{id}       - Remove jogador
```

#### Games
```
GET    /api/games              - Lista mesas
POST   /api/games              - Cria mesa
POST   /api/games/{gameId}/join/{playerId} - Jogador entra na mesa
```

## 🧪 Testando o Sistema

### 1. Testar API via Swagger

1. Acesse http://localhost:5000/swagger
2. Expanda `/api/comandas`
3. Clique em `GET /api/comandas`
4. Clique em "Try it out"
5. Clique em "Execute"
6. Veja a lista de comandas mock

### 2. Testar Frontend

1. Acesse http://localhost:4200
2. Você verá 3 comandas ativas (João, Maria, Pedro)
3. E 1 comanda fechada (Ana)
4. Clique em "+ Nova Comanda"
5. Preencha os dados e crie
6. Veja a nova comanda aparecer na lista

### 3. Testar Filtros

1. Digite "João" na busca → Verá apenas João Silva
2. Clique no filtro "Torneio" → Verá comandas de torneio
3. Clique no filtro "Bar" → Verá apenas comandas do bar

### 4. Testar Card de Comanda

1. Clique no botão ▼ de uma comanda
2. Verá os detalhes expandidos
3. Clique em "+ Adicionar Bebida"
4. O valor de bebidas aumentará R$ 10,00
5. O faturamento total no dashboard será atualizado

## 📊 Dados Mock Iniciais

O sistema vem com dados de exemplo:

### Comandas
- **João Silva** - Mesa 5 - Torneio - R$ 332,00 (Fichas) - ATIVO
- **Maria Santos** - Mesa 2 - Cash - R$ 555,00 (Fichas) - ATIVO
- **Pedro Costa** - Bar - Bar - R$ 61,00 (Bebidas) - ATIVO
- **Ana Oliveira** - Mesa 3 - Torneio - R$ 220,90 (Fichas) - FECHADO

### Produtos (Backend)
- Cerveja - R$ 10,00
- Refrigerante - R$ 7,00
- Água - R$ 5,00
- Porção de Batata - R$ 25,00
- Sanduíche - R$ 15,00

## 🎨 Tema e Cores

O sistema usa um tema **verde neon (#00FF00)** com fundo preto:

- **Background**: Gradiente preto (#0a0a0a → #1a1a1a)
- **Primária**: Verde neon #00FF00
- **Texto**: Branco #FFFFFF
- **Bordas**: Cinza escuro #333333
- **Cards**: Gradiente escuro com borda

## 🔄 Hot Reload

Ambos frontend e backend suportam hot reload:

- **Frontend**: Salve qualquer arquivo `.ts`, `.html`, `.scss` e veja as mudanças instantaneamente
- **Backend**: Use `dotnet watch run` para hot reload do backend

Para habilitar watch no backend:
```bash
cd Backend/PokerRvd.Api
dotnet watch run
```

## 🐛 Solução de Problemas

### Erro: "Porta 5000 já em uso"

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [número_do_PID] /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Erro: "Não foi possível conectar ao servidor"

1. Verifique se o backend está rodando
2. Acesse http://localhost:5000/api/health
3. Deve retornar `{"status":"healthy"}`

### Erro: "CORS Policy"

1. Verifique `Backend/PokerRvd.Api/Program.cs`
2. Confirme que `http://localhost:4200` está na lista de origens permitidas

### Frontend não carrega dados

1. Abra DevTools (F12)
2. Vá para Network
3. Veja se há erros nas requisições
4. Verifique o console por erros JavaScript

### Backend retorna 500

1. Veja os logs no terminal do backend
2. Acesse o Swagger e teste os endpoints
3. Verifique se o DbContext está configurado corretamente

## 📝 Variáveis de Ambiente

### Frontend
Atualmente usa URL hardcoded. Para usar variáveis de ambiente:

Crie `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

### Backend
Edite `Backend/PokerRvd.Api/appsettings.json`:
```json
{
  "ApiSettings": {
    "Port": 5000,
    "AllowedOrigins": ["http://localhost:4200"]
  }
}
```

## 🚢 Build para Produção

### Frontend
```bash
npm run build
# Arquivos em: dist/poker-rvd/browser
```

### Backend
```bash
cd Backend/PokerRvd.Api
dotnet publish -c Release -o ./publish
```

## 📚 Documentação Adicional

- **[README.md](./README.md)** - Visão geral do projeto
- **[INTEGRACAO_ANGULAR_CSHARP.md](./INTEGRACAO_ANGULAR_CSHARP.md)** - Guia de integração
- **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** - Início rápido
- **[Backend/README.md](./Backend/README.md)** - Documentação do backend

## 🆘 Ajuda

Se ainda tiver problemas:

1. Verifique os logs nos terminais
2. Teste a API via Swagger primeiro
3. Use as ferramentas de desenvolvedor do navegador (F12)
4. Confirme que portas 4200 e 5000 estão livres

---

**Desenvolvido com ❤️ usando Angular 18 + C# ASP.NET Core 8**

Versão: 1.0.0 | Janeiro 2026
