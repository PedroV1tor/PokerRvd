# 🔐 Sistema de Login e Cadastro - PokerRvd

Sistema completo de autenticação implementado com Angular 18 + C# ASP.NET Core 8.

## ✅ Funcionalidades Implementadas

### Frontend (Angular)

1. **Tela de Login** (`/login`)
   - Formulário com email e senha
   - Validação de campos
   - Checkbox "Lembrar-me"
   - Link para cadastro
   - Design moderno com tema verde neon
   - Animações e feedback visual

2. **Tela de Cadastro** (`/cadastro`)
   - Formulário completo (nome, email, senha, confirmar senha)
   - Indicador visual de força da senha
   - Validações em tempo real
   - Checkbox de aceite de termos
   - Link para login
   - Design responsivo

3. **Auth Guard**
   - Proteção de rotas privadas
   - Redirecionamento automático para login
   - Suporte a diferentes níveis de acesso (Admin, Gerente, Atendente)

4. **Auth Service**
   - Gerenciamento de sessão
   - Storage de token e usuário no localStorage
   - Observable para estado de autenticação
   - Métodos de validação de email e senha

5. **Navbar Atualizada**
   - Menu do usuário com avatar
   - Exibição do nome e role
   - Botão de logout
   - Dropdown animado

### Backend (C# ASP.NET Core)

1. **Models**
   - `Usuario`: Model completo com roles (ADMIN, GERENTE, ATENDENTE)
   - `UserRole`: Enum para controle de permissões

2. **DTOs**
   - `LoginRequest`: Email e senha
   - `RegisterRequest`: Dados completos de cadastro
   - `UserDto`: Dados do usuário sem senha
   - `AuthResponse`: Resposta com usuário, token e mensagem

3. **AuthService**
   - Login com verificação de senha (hash SHA256)
   - Registro de novos usuários
   - Validação de email único
   - Geração de token simples (pronto para JWT)
   - Hash de senhas com salt

4. **AuthController** (`/api/auth`)
   - `POST /api/auth/login` - Fazer login
   - `POST /api/auth/register` - Criar conta
   - `GET /api/auth/check-email/{email}` - Verificar email
   - `GET /api/auth/me/{id}` - Obter dados do usuário

5. **Database**
   - Tabela `Usuarios` no DbContext
   - Seed data com 3 usuários padrão

## 🔑 Usuários Padrão

### Administrador
- **Email**: `admin@pokerrvd.com`
- **Senha**: `Admin123`
- **Role**: ADMIN

### Gerente
- **Email**: `gerente@pokerrvd.com`
- **Senha**: `Senha123`
- **Role**: GERENTE

### Atendente
- **Email**: `atendente@pokerrvd.com`
- **Senha**: `Senha123`
- **Role**: ATENDENTE

## 🚀 Como Usar

### 1. Executar Backend

```bash
cd Backend/PokerRvd.Api
dotnet run
```

### 2. Executar Frontend

```bash
npm start
```

### 3. Acessar

- **Login**: http://localhost:4200/login
- **Cadastro**: http://localhost:4200/cadastro
- **Sistema**: http://localhost:4200 (redireciona para login se não autenticado)

## 🎯 Fluxo de Autenticação

### Login
1. Usuário acessa `/login`
2. Preenche email e senha
3. Clica em "Entrar"
4. Frontend envia `POST /api/auth/login`
5. Backend valida credenciais
6. Retorna usuário e token
7. Frontend salva no localStorage
8. Redireciona para página principal

### Cadastro
1. Usuário acessa `/cadastro`
2. Preenche formulário completo
3. Sistema valida força da senha
4. Clica em "Criar Conta"
5. Frontend envia `POST /api/auth/register`
6. Backend cria usuário no banco
7. Retorna usuário e token
8. Frontend autentica automaticamente
9. Redireciona para página principal

### Proteção de Rotas
1. Usuário tenta acessar rota protegida
2. `authGuard` verifica se está autenticado
3. Se não, redireciona para `/login`
4. Se sim, permite acesso

### Logout
1. Usuário clica no menu do usuário
2. Clica em "Sair"
3. Confirma ação
4. `AuthService.logout()` limpa localStorage
5. Redireciona para `/login`

## 📁 Arquivos Criados/Modificados

### Frontend

**Models:**
- `src/app/models/auth.model.ts`

**Services:**
- `src/app/services/auth.service.ts`

**Components:**
- `src/app/components/login/login.component.ts`
- `src/app/components/cadastro/cadastro.component.ts`
- `src/app/components/navbar/navbar.component.ts` (modificado)

**Guards:**
- `src/app/guards/auth.guard.ts`

**Routes:**
- `src/app/app.routes.ts` (modificado)

### Backend

**Models:**
- `Backend/PokerRvd.Api/Models/Usuario.cs`

**DTOs:**
- `Backend/PokerRvd.Api/DTOs/AuthDto.cs`

**Services:**
- `Backend/PokerRvd.Api/Services/IAuthService.cs`
- `Backend/PokerRvd.Api/Services/AuthService.cs`

**Controllers:**
- `Backend/PokerRvd.Api/Controllers/AuthController.cs`

**Database:**
- `Backend/PokerRvd.Api/Data/PokerDbContext.cs` (modificado)
- `Backend/PokerRvd.Api/Program.cs` (modificado)

## 🔒 Segurança

### Implementado
- ✅ Hash de senhas com SHA256 + Salt
- ✅ Validação de email único
- ✅ Validação de força de senha
- ✅ Guard de autenticação nas rotas
- ✅ Verificação de usuário ativo
- ✅ Diferentes níveis de acesso (roles)

### Para Produção
- [ ] Implementar JWT (JSON Web Token)
- [ ] Adicionar refresh token
- [ ] HTTPS obrigatório
- [ ] Rate limiting
- [ ] Two-factor authentication (2FA)
- [ ] Logs de acesso
- [ ] Bloqueio após tentativas falhas
- [ ] Recuperação de senha

## 🎨 Design

### Cores
- **Primária**: Verde Neon (#00FF00)
- **Background**: Preto (#0a0a0a, #1a1a1a)
- **Erro**: Vermelho (#ff4444)
- **Sucesso**: Verde (#00FF00)
- **Texto**: Branco (#fff)

### Animações
- Slide up ao carregar
- Fade in para alerts
- Hover effects
- Loading states
- Dropdown animado

### Responsividade
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🧪 Testando

### Login Manual
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pokerrvd.com","senha":"Admin123"}'
```

### Registro Manual
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome":"Teste User",
    "email":"teste@email.com",
    "senha":"Senha123",
    "confirmarSenha":"Senha123"
  }'
```

### Verificar Email
```bash
curl http://localhost:5000/api/auth/check-email/admin@pokerrvd.com
```

## 📊 Validações

### Email
- Formato válido
- Único no sistema

### Senha
- Mínimo 6 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 número

### Nome
- Mínimo 3 caracteres

### Cadastro
- Confirmação de senha deve coincidir
- Aceite de termos obrigatório

## 🔄 Próximos Passos

1. **Implementar JWT**
   - Gerar token JWT no backend
   - Validar token nas requisições
   - Adicionar interceptor no Angular

2. **Recuperação de Senha**
   - Endpoint de reset
   - Envio de email
   - Token temporário

3. **Perfil do Usuário**
   - Editar dados
   - Trocar senha
   - Upload de foto

4. **Permissões Avançadas**
   - Gerenciamento de usuários (Admin)
   - Controle fino de acessos
   - Auditoria de ações

5. **Melhorias UX**
   - Remember me funcional
   - Login com Google/Facebook
   - Biometria (mobile)

## 📝 Notas

- O sistema usa autenticação simples com token base64
- Para produção, **SEMPRE** use JWT
- As senhas são hasheadas com SHA256 + Salt
- O token é salvo no localStorage
- O guard protege as rotas automaticamente

## 🆘 Troubleshooting

### Erro: Email já existe
**Solução**: Use outro email ou faça login

### Erro: Credenciais inválidas
**Solução**: Verifique email e senha

### Não redireciona após login
**Solução**: Verifique console do navegador (F12)

### Backend não responde
**Solução**: Verifique se está rodando na porta 5000

---

**Sistema de autenticação pronto para uso!** 🎉

**Desenvolvido com ❤️ usando Angular 18 + C# ASP.NET Core 8**
