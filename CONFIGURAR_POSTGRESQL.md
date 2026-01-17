# 🐘 Como Conectar ao PostgreSQL

Este guia mostra como migrar o projeto do banco InMemory para PostgreSQL.

## ✅ Alterações Já Realizadas

1. ✅ Pacote `Npgsql.EntityFrameworkCore.PostgreSQL` instalado
2. ✅ Pacote `Microsoft.EntityFrameworkCore.Design` instalado (para migrations)
3. ✅ `Program.cs` atualizado para usar PostgreSQL
4. ✅ `PokerDbContext.cs` configurado com tipos de dados PostgreSQL
5. ✅ `appsettings.json` com connection string padrão

## 📋 Pré-requisitos

### 1. Instalar PostgreSQL

**Se você ainda não tem o PostgreSQL instalado:**

1. Baixe o PostgreSQL 16 ou superior: https://www.postgresql.org/download/windows/
2. Durante a instalação:
   - Defina a senha do usuário `postgres` (recomendado: `postgres`)
   - Porta padrão: `5432`
   - Locale: `Portuguese, Brazil`

**OU use Docker (recomendado):**

```powershell
docker run --name postgres-pokerrvd -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

### 2. Verificar se o PostgreSQL está rodando

```powershell
# Testar conexão
psql -U postgres -h localhost -p 5432
```

Se conectar com sucesso, digite `\q` para sair.

## 🔧 Configuração da Connection String

O arquivo `appsettings.json` já está configurado com:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=PokerRvdDb;Username=postgres;Password=postgres"
  }
}
```

**Se você usou senha diferente**, edite o arquivo:

```
Backend/PokerRvd.Api/appsettings.json
```

E altere `Password=postgres` para sua senha.

## 🚀 Passos para Aplicar as Migrations

### Passo 1: Parar o Backend

**No terminal onde o backend está rodando (Terminal 1):**

```powershell
# Pressione Ctrl+C para parar o backend
```

### Passo 2: Criar o Banco de Dados (Opcional)

O Entity Framework pode criar automaticamente, mas você pode criar manualmente:

```powershell
# Conectar ao PostgreSQL
psql -U postgres -h localhost -p 5432

# Dentro do psql, executar:
CREATE DATABASE "PokerRvdDb";

# Sair
\q
```

### Passo 3: Criar as Migrations

```powershell
cd "C:\Users\pedro vitor\Documents\PokerRvd\Backend\PokerRvd.Api"

# Criar a migration inicial
dotnet ef migrations add InitialCreate

# Aplicar as migrations ao banco
dotnet ef database update
```

### Passo 4: Reiniciar o Backend

```powershell
# Ainda no diretório Backend/PokerRvd.Api
dotnet run
```

## 🎯 Script Automatizado (Recomendado)

Criei um script que automatiza todo o processo. Basta executar:

```powershell
# Na raiz do projeto
.\setup-postgresql.ps1
```

Este script irá:
1. ✅ Verificar se o PostgreSQL está acessível
2. ✅ Criar o banco de dados (se não existir)
3. ✅ Criar e aplicar as migrations
4. ✅ Popular o banco com dados iniciais (seed data)

## 📊 Dados Iniciais (Seed Data)

Após aplicar as migrations, o banco será populado com:

### Usuários:
- **Admin**: admin@pokerrvd.com / Admin123
- **Gerente**: gerente@pokerrvd.com / Senha123
- **Atendente**: atendente@pokerrvd.com / Senha123

### Produtos:
- Cerveja (R$ 10,00)
- Refrigerante (R$ 7,00)
- Água (R$ 5,00)
- Porção de Batata (R$ 25,00)
- Sanduíche (R$ 15,00)

### Comandas de exemplo:
- 4 comandas (3 ativas, 1 fechada)

## 🔍 Verificar os Dados

```powershell
# Conectar ao PostgreSQL
psql -U postgres -h localhost -p 5432 -d PokerRvdDb

# Listar tabelas
\dt

# Ver usuários
SELECT "Id", "Nome", "Email", "Role" FROM "Usuarios";

# Ver produtos
SELECT "Id", "Nome", "Preco", "Categoria" FROM "Produtos";

# Ver comandas
SELECT "Id", "JogadorNome", "Mesa", "Tipo", "Status" FROM "Comandas";

# Sair
\q
```

## ❌ Problemas Comuns

### Erro: "password authentication failed"
- Verifique se a senha no `appsettings.json` está correta
- Tente resetar a senha do usuário postgres

### Erro: "could not connect to server"
- Verifique se o PostgreSQL está rodando:
  ```powershell
  # Windows
  Get-Service postgresql*
  
  # Se não estiver rodando, inicie:
  Start-Service postgresql-x64-16  # Ajuste a versão
  ```

### Erro: "database PokerRvdDb does not exist"
- O EF Core criará automaticamente se você der permissões
- Ou crie manualmente conforme o Passo 2

### Erro: "relation does not exist"
- As migrations não foram aplicadas
- Execute: `dotnet ef database update`

## 🔄 Recomeçar do Zero

Se precisar resetar o banco:

```powershell
cd "C:\Users\pedro vitor\Documents\PokerRvd\Backend\PokerRvd.Api"

# Remover o banco
dotnet ef database drop --force

# Recriar
dotnet ef database update
```

## 📝 Comandos Úteis do Entity Framework

```powershell
# Ver lista de migrations
dotnet ef migrations list

# Adicionar nova migration
dotnet ef migrations add NomeDaMigration

# Aplicar migrations
dotnet ef database update

# Reverter para migration específica
dotnet ef database update NomeDaMigration

# Remover última migration (se não aplicada)
dotnet ef migrations remove

# Gerar script SQL
dotnet ef migrations script

# Informações sobre o contexto
dotnet ef dbcontext info
```

## 🎉 Pronto!

Após seguir estes passos, seu sistema estará usando PostgreSQL! 🚀

Para voltar a usar o banco InMemory (desenvolvimento), basta alterar no `Program.cs`:

```csharp
// PostgreSQL
builder.Services.AddDbContext<PokerDbContext>(options =>
    options.UseNpgsql(connectionString));

// Para InMemory (trocar)
builder.Services.AddDbContext<PokerDbContext>(options =>
    options.UseInMemoryDatabase("PokerRvdDb"));
```
