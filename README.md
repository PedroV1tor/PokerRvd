# 🃏 PokerRvd - Sistema de Gerenciamento de Poker

Sistema completo para gerenciamento de poker club com controle de **comandas**, **fichas** e **bebidas**.

Desenvolvido com **Angular 18** (frontend) e **C# ASP.NET Core 8** (backend).

## 📸 Preview

Interface moderna com tema **verde neon** e **fundo escuro**, ideal para ambientes de poker club.

## 🚀 Início Rápido

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/PokerRvd.git
cd PokerRvd
```

### 2. Instalar Dependências

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

**Backend:**
```bash
cd backend/PokerRvd.Api
dotnet restore
cd ../..
```

### 3. Executar

**Opção A: Script Automatizado (Recomendado)**

Windows:
```powershell
.\start-all.ps1
```

Linux/Mac:
```bash
chmod +x start-all.sh
./start-all.sh
```

**Opção B: Manual (2 terminais)**

Terminal 1 - Backend:
```bash
cd backend/PokerRvd.Api
dotnet run
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### 4. Acessar

- **Frontend**: http://localhost:4200
- **API Backend**: http://localhost:5000
- **Swagger Docs**: http://localhost:5000/swagger

## 📂 Estrutura do Projeto

```
PokerRvd/
├── frontend/                    # 🎨 Frontend Angular 18
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # Componentes reutilizáveis
│   │   │   ├── models/          # Interfaces TypeScript
│   │   │   ├── services/        # Serviços Angular
│   │   │   └── ...
│   │   ├── styles.scss          # Estilos globais
│   │   └── index.html
│   ├── package.json
│   ├── angular.json
│   └── README.md
│
├── backend/                     # 🔧 Backend C# ASP.NET Core 8
│   └── PokerRvd.Api/
│       ├── Controllers/         # API REST Controllers
│       ├── Models/              # Modelos de dados
│       ├── DTOs/                # Data Transfer Objects
│       ├── Services/            # Lógica de negócio
│       ├── Data/                # DbContext
│       ├── Program.cs
│       └── README.md
│
├── start-all.ps1                # Script Windows
├── start-all.sh                 # Script Linux/Mac
├── .gitignore
├── README.md                    # Este arquivo
├── COMO_EXECUTAR.md             # Guia detalhado de execução
└── INTEGRACAO_ANGULAR_CSHARP.md # Guia de integração
```

## ✨ Funcionalidades

### 🎮 Gerenciamento de Comandas
- ✅ Criar, editar e fechar comandas
- ✅ Visualização em cards modernos
- ✅ Busca por jogador ou comanda
- ✅ Filtros por tipo (Torneio, Cash, Bar)
- ✅ Status em tempo real (Ativo/Fechado)

### 💰 Controle Financeiro
- ✅ Controle de fichas por comanda
- ✅ Controle de bebidas e consumo
- ✅ Cálculo automático de totais
- ✅ Dashboard com estatísticas
- ✅ Faturamento total em destaque

### 🎲 Recursos Adicionais
- ✅ Gerenciamento de jogadores
- ✅ Gerenciamento de mesas
- ✅ Controle de produtos/bebidas
- ✅ Sistema de estoque básico
- ✅ API REST completa

### 🎨 Interface
- ✅ Design moderno com tema verde neon
- ✅ Responsivo (Mobile, Tablet, Desktop)
- ✅ Animações suaves
- ✅ UX intuitiva

## 🛠️ Tecnologias

### Frontend
- **Angular 18** - Framework web
- **TypeScript 5.5** - Linguagem
- **SCSS** - Estilização
- **RxJS 7.8** - Programação reativa
- **Angular SSR** - Server-Side Rendering

### Backend
- **C# / .NET 8** - Framework
- **ASP.NET Core Web API** - API REST
- **Entity Framework Core** - ORM
- **Swagger/OpenAPI** - Documentação
- **InMemory Database** - Banco em memória (dev)

## 📡 API Endpoints

### Comandas
```
GET    /api/comandas              # Lista todas
GET    /api/comandas/{id}         # Por ID
POST   /api/comandas              # Criar
PUT    /api/comandas/{id}         # Atualizar
POST   /api/comandas/{id}/fechar  # Fechar
DELETE /api/comandas/{id}         # Deletar
POST   /api/comandas/{id}/itens   # Adicionar produto
GET    /api/comandas/stats        # Estatísticas
```

### Players & Games
```
GET/POST/PUT/DELETE /api/players  # CRUD Jogadores
GET/POST           /api/games    # CRUD Mesas
```

## 🎯 Casos de Uso

1. **Abrir Comanda**: Jogador chega, cria comanda, adiciona fichas
2. **Consumo**: Durante o jogo, adiciona bebidas à comanda
3. **Controle**: Dashboard mostra totais em tempo real
4. **Fechamento**: Ao final, fecha comanda e visualiza total
5. **Relatórios**: Consulta histórico e estatísticas

## 🧪 Testes

**Frontend:**
```bash
cd frontend
npm test
```

**Backend:**
```bash
cd backend/PokerRvd.Api
dotnet test
```

## 📦 Build para Produção

**Frontend:**
```bash
cd frontend
npm run build
# Arquivos em: dist/poker-rvd/browser
```

**Backend:**
```bash
cd backend/PokerRvd.Api
dotnet publish -c Release -o ./publish
```

## 🔒 Segurança

Para produção, considere:
- Implementar autenticação JWT
- Configurar HTTPS
- Adicionar rate limiting
- Validação de entrada
- Logging estruturado
- Backup de dados

## 📚 Documentação Adicional

- **[frontend/README.md](frontend/README.md)** - Documentação do frontend
- **[backend/README.md](backend/README.md)** - Documentação do backend
- **[COMO_EXECUTAR.md](COMO_EXECUTAR.md)** - Guia detalhado de execução
- **[INTEGRACAO_ANGULAR_CSHARP.md](INTEGRACAO_ANGULAR_CSHARP.md)** - Guia de integração
- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Início rápido

## 🐛 Problemas Comuns

### Backend não inicia
```bash
cd backend/PokerRvd.Api
dotnet clean
dotnet restore
dotnet build
dotnet run
```

### Frontend não inicia
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### CORS Error
Verifique se `http://localhost:4200` está nas origens permitidas em `backend/PokerRvd.Api/Program.cs`

## 📝 TODO / Roadmap

- [ ] Autenticação JWT
- [ ] WebSockets para tempo real
- [ ] Sistema de chat
- [ ] Histórico de transações
- [ ] Relatórios avançados
- [ ] Integração com impressora
- [ ] App mobile (Ionic/React Native)
- [ ] Modo offline
- [ ] Multi-tenancy

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no GitHub.

---

**Desenvolvido com ❤️ por [Seu Nome]**

**Stack:** Angular 18 + C# ASP.NET Core 8

**Versão:** 1.0.0

**Data:** Janeiro 2026

---

## 🌟 Screenshots

### Dashboard Principal
Interface com listagem de comandas, busca e filtros

### Card de Comanda
Design moderno com avatar, valores e ações

### Modal Nova Comanda
Formulário completo para criar comandas

### Dashboard Stats
Painel com estatísticas em tempo real

---

## ⚡ Performance

- **Frontend**: Build otimizado com Angular 18
- **Backend**: API RESTful com Entity Framework
- **Hot Reload**: Desenvolvimento ágil em ambos
- **Responsivo**: Interface adaptável a qualquer tela

## 🎓 Aprendizado

Este projeto demonstra:
- Arquitetura frontend/backend separada
- API RESTful com documentação Swagger
- Componentização no Angular
- Services e Dependency Injection
- RxJS e programação reativa
- Entity Framework Code First
- CORS e integração cross-origin
- Responsividade e UX moderna

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**
