# 🎨 Frontend - PokerRvd

Frontend da aplicação PokerRvd desenvolvido em **Angular 18**.

## 🚀 Como Executar

### Instalar Dependências
```bash
npm install
```

### Desenvolvimento
```bash
npm start
```
Aplicação rodará em: http://localhost:4200

### Build de Produção
```bash
npm run build
```
Arquivos gerados em: `dist/poker-rvd/browser`

## 📂 Estrutura

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── navbar/
│   │   │   ├── comanda-card/
│   │   │   ├── nova-comanda-modal/
│   │   │   └── dashboard-stats/
│   │   ├── models/              # Interfaces e tipos
│   │   │   └── comanda.model.ts
│   │   ├── services/            # Serviços Angular
│   │   │   ├── comanda.service.ts
│   │   │   └── poker-api.service.ts
│   │   ├── app.component.ts     # Componente principal
│   │   ├── app.config.ts        # Configuração do app
│   │   └── app.routes.ts        # Rotas
│   ├── index.html               # HTML principal
│   ├── main.ts                  # Entry point
│   └── styles.scss              # Estilos globais
├── public/                      # Arquivos estáticos
├── angular.json                 # Configuração Angular
├── package.json                 # Dependências
└── tsconfig.json                # Configuração TypeScript
```

## 🎨 Componentes

### Navbar
Menu superior com logo R♦D POKER CLUB e navegação.

### Comanda Card
Card individual de comanda com informações do jogador, valores e ações.

### Nova Comanda Modal
Modal para criar novas comandas com formulário validado.

### Dashboard Stats
Painel com estatísticas: comandas abertas, fichas, bebidas e faturamento.

## 🔧 Tecnologias

- **Angular 18** - Framework
- **TypeScript 5.5** - Linguagem
- **SCSS** - Estilização
- **RxJS 7.8** - Programação reativa
- **Angular SSR** - Server-Side Rendering

## 🌐 API Integration

O frontend se comunica com o backend C# através de:
- **Base URL**: `http://localhost:5000/api`
- **Service**: `poker-api.service.ts`
- **CORS**: Configurado no backend

## 🎨 Tema

- **Cores Primárias**: Verde Neon (#00FF00) e Preto (#0a0a0a)
- **Fonte**: Inter, Segoe UI
- **Estilo**: Dark theme com acentos neon

## 📱 Responsividade

- Desktop: Grid de 3 colunas
- Tablet: Grid de 2 colunas
- Mobile: Grid de 1 coluna

## 🧪 Testes

```bash
npm test
```

## 📝 Variáveis de Ambiente

Para configurar a URL da API, crie:

`src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

`src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://sua-api-producao.com/api'
};
```

## 🔥 Hot Reload

O Angular tem hot reload automático. Qualquer mudança em arquivos `.ts`, `.html` ou `.scss` será refletida automaticamente no navegador.

## 📚 Documentação

- [Angular Docs](https://angular.io/docs)
- [RxJS Docs](https://rxjs.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

**Desenvolvido com ❤️ usando Angular 18**
