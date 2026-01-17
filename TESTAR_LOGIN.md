# 🔐 Como Testar o Sistema de Login

## 🚀 Passo a Passo

### 1. Pare os Servidores (se estiverem rodando)
Pressione `Ctrl+C` nos terminais

### 2. Execute o Backend
```powershell
cd backend\PokerRvd.Api
dotnet run
```

Aguarde até ver:
```
Now listening on: http://localhost:5000
```

### 3. Execute o Frontend
```powershell
# Na raiz do projeto
npm start
```

Aguarde até ver:
```
➜  Local:   http://localhost:4200/
```

### 4. Acesse o Sistema

Abra o navegador em: **http://localhost:4200**

O sistema irá **redirecionar automaticamente para o login** pois a rota está protegida!

## 🔑 Credenciais de Teste

### Administrador (Acesso Total)
- **Email**: `admin@pokerrvd.com`
- **Senha**: `Admin123`

### Gerente
- **Email**: `gerente@pokerrvd.com`
- **Senha**: `Senha123`

### Atendente
- **Email**: `atendente@pokerrvd.com`
- **Senha**: `Senha123`

## ✅ Testando Login

1. **Acesse**: http://localhost:4200
   - Deve redirecionar para `/login`

2. **Faça Login com Admin**:
   - Email: `admin@pokerrvd.com`
   - Senha: `Admin123`
   - Clique em "Entrar"

3. **Resultado Esperado**:
   - ✅ Redireciona para página principal
   - ✅ Mostra comandas e dashboard
   - ✅ Navbar exibe avatar com iniciais "A"
   - ✅ Nome "Administrador" aparece no menu
   - ✅ Role "ADMIN" visível no dropdown

## ✅ Testando Cadastro

1. **Na tela de login**, clique em "Cadastre-se aqui"

2. **Preencha o formulário**:
   - Nome: Seu Nome Completo
   - Email: seuemail@teste.com
   - Senha: MinhaSenh@123 (observe a barra de força)
   - Confirmar Senha: MinhaSenh@123
   - ✅ Aceitar termos

3. **Clique em "Criar Conta"**

4. **Resultado Esperado**:
   - ✅ Mensagem de sucesso
   - ✅ Login automático
   - ✅ Redireciona para dashboard
   - ✅ Usuário aparece na navbar

## ✅ Testando Logout

1. **Na navbar**, clique no seu avatar/nome

2. **Menu dropdown abre** mostrando:
   - Nome do usuário
   - Role (função)
   - Botão "Sair"

3. **Clique em "Sair"**

4. **Confirme a ação**

5. **Resultado Esperado**:
   - ✅ Redireciona para `/login`
   - ✅ Dados são limpos do localStorage
   - ✅ Tentativa de acessar `/` redireciona novamente para login

## ✅ Testando Proteção de Rota

1. **Faça logout** (se estiver logado)

2. **Tente acessar diretamente**: http://localhost:4200

3. **Resultado Esperado**:
   - ✅ Redireciona automaticamente para `/login`
   - ✅ Mostra tela de login

4. **Faça login novamente**

5. **Resultado Esperado**:
   - ✅ Acesso permitido
   - ✅ Sistema funciona normalmente

## 🎨 Recursos Visuais para Testar

### Tela de Login
- ✅ Logo R♦D POKER CLUB
- ✅ Campos com ícones (📧 🔒)
- ✅ Checkbox "Lembrar-me"
- ✅ Link "Esqueceu a senha?"
- ✅ Botão verde neon "Entrar"
- ✅ Link para cadastro
- ✅ Símbolos de cartas flutuando no fundo

### Tela de Cadastro
- ✅ Logo R♦D POKER CLUB
- ✅ Campos com ícones (👤 📧 🔒 🔑)
- ✅ Barra de força da senha
  - Vermelho: Fraca
  - Amarelo: Média
  - Verde: Forte
- ✅ Checkbox de termos
- ✅ Botão verde neon "Criar Conta"
- ✅ Link para login
- ✅ Chips de poker animados no fundo

### Navbar com Usuário
- ✅ Avatar circular verde com iniciais
- ✅ Nome do usuário
- ✅ Seta dropdown
- ✅ Hover: borda verde neon
- ✅ Menu dropdown animado
- ✅ Botão sair em vermelho

## 🧪 Testando Validações

### No Login
1. Tente login com email vazio
   - ❌ "E-mail é obrigatório"

2. Email inválido: `teste@invalido`
   - ❌ "E-mail inválido"

3. Senha muito curta: `123`
   - ❌ "Senha deve ter no mínimo 6 caracteres"

4. Email/senha errados
   - ❌ "E-mail ou senha incorretos"

### No Cadastro
1. Nome muito curto: `Jo`
   - ❌ "Nome deve ter no mínimo 3 caracteres"

2. Email já existe: `admin@pokerrvd.com`
   - ❌ "E-mail já cadastrado"

3. Senha fraca: `abc123`
   - 🟡 Barra amarela "Senha média"
   - Sugestão visual de melhorar

4. Senhas diferentes
   - ❌ "As senhas não coincidem"

5. Termos não aceitos
   - ❌ "Você deve aceitar os termos de uso"

## 🔍 Verificar no Console

Abra o **DevTools (F12)** → Aba **Console**

### Ao fazer login com sucesso:
```
✅ Login realizado com sucesso! {user: {...}, token: "...", message: "..."}
```

### Ao criar conta:
```
✅ Cadastro realizado com sucesso!
```

### No localStorage (Aba Application → Local Storage):
```
poker_token: "base64_token..."
poker_user: {"id":1,"nome":"...","email":"...","role":"ADMIN",...}
```

## 📡 Testando a API Diretamente

### Via Swagger
1. Acesse: http://localhost:5000/swagger
2. Expanda `/api/auth/login`
3. Clique "Try it out"
4. Cole:
```json
{
  "email": "admin@pokerrvd.com",
  "senha": "Admin123"
}
```
5. Execute
6. Deve retornar status **200 OK** com dados do usuário

### Via curl
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pokerrvd.com","senha":"Admin123"}'

# Cadastro
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome":"Novo Usuario",
    "email":"novo@teste.com",
    "senha":"Senha123",
    "confirmarSenha":"Senha123"
  }'
```

## 🎯 Fluxo Completo de Teste

1. ✅ Inicie backend e frontend
2. ✅ Acesse http://localhost:4200
3. ✅ Redireciona para login
4. ✅ Teste validações (campos vazios, email inválido)
5. ✅ Faça login com admin
6. ✅ Veja comandas e dashboard
7. ✅ Clique no avatar do usuário
8. ✅ Veja menu dropdown com nome e role
9. ✅ Clique em Sair
10. ✅ Confirme
11. ✅ Volta para login
12. ✅ Clique em "Cadastre-se aqui"
13. ✅ Preencha formulário de cadastro
14. ✅ Veja indicador de força da senha
15. ✅ Crie conta
16. ✅ Login automático
17. ✅ Acesso ao sistema

## 🐛 Problemas Comuns

### "E-mail ou senha incorretos"
- Verifique se está usando as credenciais corretas
- Email: `admin@pokerrvd.com`
- Senha: `Admin123` (com A maiúsculo e 1)

### Não redireciona após login
- Abra console (F12)
- Verifique erros
- Confirme que backend está rodando

### "Erro interno do servidor"
- Backend não está rodando
- Execute: `cd backend\PokerRvd.Api && dotnet run`

### Validações não aparecem
- Limpe cache do navegador
- Force refresh: Ctrl+F5

## ✅ Sistema Funcionando Se:

- ✅ Login redireciona para dashboard
- ✅ Cadastro cria usuário e faz login
- ✅ Logout limpa sessão
- ✅ Rota protegida redireciona para login
- ✅ Avatar mostra iniciais corretas
- ✅ Nome e role aparecem no menu
- ✅ Validações funcionam
- ✅ Design verde neon está aplicado

---

**Tudo funcionando? Você tem um sistema de autenticação completo!** 🎉

Para dúvidas, consulte: **[LOGIN_CADASTRO_README.md](./LOGIN_CADASTRO_README.md)**
