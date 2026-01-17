# 📋 Instruções para Executar o Projeto PokerRvd

## 🔴 IMPORTANTE: Estrutura Reorganizada

O projeto agora está organizado com pastas separadas:

```
PokerRvd/
├── frontend/          # 🎨 Código Angular
├── backend/           # 🔧 Código C# ASP.NET Core
├── start-all.ps1      # Script Windows
├── start-all.sh       # Script Linux/Mac
└── README.md
```

## 🚀 Como Executar

### Opção 1: Script Automatizado (MAIS FÁCIL)

#### Windows
```powershell
.\start-all.ps1
```

#### Linux/Mac
```bash
chmod +x start-all.sh
./start-all.sh
```

### Opção 2: Manual

#### Backend (Terminal 1)
```bash
cd backend/PokerRvd.Api
dotnet restore
dotnet run
```

✅ Backend rodará em:
- http://localhost:5000
- http://localhost:5000/swagger

#### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

✅ Frontend rodará em:
- http://localhost:4200

## ⚠️ Problemas Resolvidos

### 1. Erro `HasColumnType` no Backend
**Problema**: InMemory Database não suporta `HasColumnType`
**Solução**: Removidas configurações específicas de SQL Server

### 2. Erro `document is not defined` no Frontend
**Problema**: SSR tentando acessar `document` no servidor
**Solução**: Removido `provideClientHydration()` e ajustado para usar `withFetch()`

## 📦 Primeira Execução

Se é a primeira vez executando:

```bash
# 1. Instalar dependências do Frontend
cd frontend
npm install
cd ..

# 2. Restaurar dependências do Backend
cd backend/PokerRvd.Api
dotnet restore
cd ../..

# 3. Executar o script
# Windows:
.\start-all.ps1
# Linux/Mac:
./start-all.sh
```

## 🧪 Testar se está funcionando

1. **Backend**: Acesse http://localhost:5000/api/health
   - Deve retornar: `{"status":"healthy",...}`

2. **Frontend**: Acesse http://localhost:4200
   - Deve mostrar a interface do PokerRvd

3. **Swagger**: Acesse http://localhost:5000/swagger
   - Deve mostrar a documentação interativa da API

## 🔧 Desenvolvimento

### Hot Reload
Ambos suportam hot reload:
- **Frontend**: Mudanças em `.ts`, `.html`, `.scss` recarregam automaticamente
- **Backend**: Use `dotnet watch run` para hot reload

### Portas Padrão
- **Frontend**: 4200
- **Backend**: 5000 (HTTP) / 5001 (HTTPS)
- **Swagger**: 5000/swagger

## 🐛 Troubleshooting

### Porta já em uso
```bash
# Windows - matar processo na porta 5000
netstat -ano | findstr :5000
taskkill /PID [numero_do_PID] /F

# Linux/Mac - matar processo na porta 5000
lsof -ti:5000 | xargs kill -9
```

### Limpar e reinstalar

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Backend:**
```bash
cd backend/PokerRvd.Api
dotnet clean
dotnet restore
dotnet build
```

### Erro CORS
Verifique se `http://localhost:4200` está nas origens permitidas em:
`backend/PokerRvd.Api/Program.cs`

## 📚 Documentação Completa

- [README.md](./README.md) - Visão geral
- [frontend/README.md](./frontend/README.md) - Documentação do frontend
- [backend/README.md](./backend/README.md) - Documentação do backend
- [COMO_EXECUTAR.md](./COMO_EXECUTAR.md) - Guia completo

## ✅ Checklist de Execução

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] .NET 8.0 SDK instalado (`dotnet --version`)
- [ ] Dependências do frontend instaladas (`cd frontend && npm install`)
- [ ] Dependências do backend restauradas (`cd backend/PokerRvd.Api && dotnet restore`)
- [ ] Backend rodando (porta 5000)
- [ ] Frontend rodando (porta 4200)
- [ ] Teste: http://localhost:5000/api/health retorna OK
- [ ] Teste: http://localhost:4200 mostra interface

---

**Dúvidas?** Consulte a documentação completa ou abra uma issue no GitHub.
