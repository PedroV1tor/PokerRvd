# 🚀 EXECUTAR AGORA - PokerRvd

## ✅ Erros Corrigidos!

### 1. ❌ Backend - Erro `HasColumnType` 
✅ **CORRIGIDO**: Removidas configurações incompatíveis com InMemory Database

### 2. ❌ Frontend - Erro `document is not defined`
✅ **CORRIGIDO**: Removido `provideClientHydration()` que causava problemas no SSR

## 🚀 Execute Agora

### No Terminal do Backend:
```bash
cd backend/PokerRvd.Api
dotnet run
```

### No Terminal do Frontend:
```bash
# Se ainda estiver na raiz do projeto
cd frontend
npm start

# OU se já estiver no diretório raiz
npm start
```

## ⚠️ IMPORTANTE

Os arquivos do frontend estão na pasta raiz E na pasta `frontend/`.

Para simplificar, você tem duas opções:

### Opção 1: Mover tudo para frontend/
```bash
# No PowerShell (Windows)
Move-Item -Path src -Destination frontend/
Move-Item -Path public -Destination frontend/
Move-Item -Path angular.json -Destination frontend/
Move-Item -Path tsconfig*.json -Destination frontend/
Move-Item -Path server.ts -Destination frontend/
Move-Item -Path package.json frontend/
Move-Item -Path package-lock.json frontend/
```

### Opção 2: Manter a Estrutura Atual

Se preferir manter como está (arquivos do Angular na raiz):

**Execute assim:**

Terminal 1 - Backend:
```bash
cd backend/PokerRvd.Api
dotnet run
```

Terminal 2 - Frontend:
```bash
npm install
npm start
```

## ✅ Correções Aplicadas

### 1. **Backend** - Erro `HasColumnType`
- ❌ **Problema**: InMemory Database não suporta `HasColumnType("decimal(18,2)")`
- ✅ **Solução**: Removidas configurações `HasColumnType` do `PokerDbContext.cs`

### 2. **Frontend** - Erro SSR `document is not defined`
**Problema**: Server-Side Rendering tentando acessar `document`
**Solução**: Removido `provideClientHydration()` e ajustado `provideHttpClient` para usar `withFetch()`

## 🔄 Próximos Passos

1. **Pare os processos em execução** (Ctrl+C nos terminais)

2. **Execute novamente**:

**Opção 1 - Backend (Terminal 1):**
```bash
cd backend/PokerRvd.Api
dotnet run
```

**Opção 2 - Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

Ou use o script:
```powershell
.\start-all.ps1
```

## ✅ Correções Aplicadas:

### ✅ Backend (Terminal 1)
- **Problema**: `HasColumnType` não disponível no InMemory Database
- **Solução**: Removidas configurações `HasColumnType()` específicas de SQL Server
- **Arquivo**: `Backend/PokerRvd.Api/Data/PokerDbContext.cs`

### ✅ Frontend (Terminal 2)
- **Problema**: SSR tentando acessar `document` no servidor
- **Solução**: Removido `provideClientHydration()` e adicionado `withFetch()`
- **Arquivo**: `src/app/app.config.ts`

## 🔄 Próximos Passos

Agora execute novamente:

**Terminal 1 - Backend:**
```bash
cd backend/PokerRvd.Api
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Ou use o script:
```powershell
.\start-all.ps1
```

## ✅ O que foi corrigido:

1. ✅ **Backend**: Removidas configurações `HasColumnType` que não funcionam com InMemory Database
2. ✅ **Frontend**: Removido `provideClientHydration()` que causava erro de SSR
3. ✅ Adicionado `withFetch()` no HttpClient para melhor compatibilidade
4. ✅ Criado `INSTRUCOES_EXECUCAO.md` com guia completo

## 🎯 Próximos Passos:

1. **No terminal do backend**, execute:
```bash
cd backend/PokerRvd.Api
dotnet run
```

2. **No outro terminal**, execute:
```bash
cd frontend
npm start
```

3. Acesse:
   - Frontend: http://localhost:4200
   - Swagger: http://localhost:5000/swagger

Os erros foram corrigidos! 🎉