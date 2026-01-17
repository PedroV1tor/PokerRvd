# ===================================================================
# Script de Configuração do PostgreSQL para PokerRvd
# ===================================================================

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Setup PostgreSQL - PokerRvd" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Configurações
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_USER = "postgres"
$DB_NAME = "PokerRvdDb"
$BACKEND_PATH = "$PSScriptRoot\Backend\PokerRvd.Api"

# Função para verificar se o PostgreSQL está acessível
function Test-PostgreSQL {
    Write-Host "[1/5] Verificando conexão com PostgreSQL..." -ForegroundColor Yellow
    
    try {
        # Tentar conexão usando psql
        $env:PGPASSWORD = "postgres"
        $result = & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "SELECT version();" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ PostgreSQL está acessível!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ Não foi possível conectar ao PostgreSQL" -ForegroundColor Red
            Write-Host "  Erro: $result" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "✗ PostgreSQL não está instalado ou não está no PATH" -ForegroundColor Red
        Write-Host "  Por favor, instale o PostgreSQL ou adicione ao PATH" -ForegroundColor Yellow
        Write-Host "  Download: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
        return $false
    } finally {
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
}

# Função para criar o banco de dados
function New-Database {
    Write-Host "[2/5] Verificando/Criando banco de dados..." -ForegroundColor Yellow
    
    try {
        $env:PGPASSWORD = "postgres"
        
        # Verificar se o banco existe
        $dbExists = & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>&1
        
        if ($dbExists -eq "1") {
            Write-Host "✓ Banco de dados '$DB_NAME' já existe" -ForegroundColor Green
        } else {
            # Criar banco
            & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "CREATE DATABASE `"$DB_NAME`";" 2>&1 | Out-Null
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Banco de dados '$DB_NAME' criado com sucesso!" -ForegroundColor Green
            } else {
                Write-Host "✗ Erro ao criar banco de dados" -ForegroundColor Red
                return $false
            }
        }
        
        return $true
    } catch {
        Write-Host "✗ Erro ao verificar/criar banco: $_" -ForegroundColor Red
        return $false
    } finally {
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
}

# Função para criar as migrations
function New-Migrations {
    Write-Host "[3/5] Criando migrations..." -ForegroundColor Yellow
    
    Set-Location $BACKEND_PATH
    
    # Verificar se já existem migrations
    $migrationsFolder = Join-Path $BACKEND_PATH "Migrations"
    
    if (Test-Path $migrationsFolder) {
        Write-Host "✓ Migrations já existem" -ForegroundColor Green
        return $true
    }
    
    try {
        dotnet ef migrations add InitialCreate
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Migrations criadas com sucesso!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ Erro ao criar migrations" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "✗ Erro ao criar migrations: $_" -ForegroundColor Red
        return $false
    }
}

# Função para aplicar as migrations
function Update-Database {
    Write-Host "[4/5] Aplicando migrations ao banco de dados..." -ForegroundColor Yellow
    
    Set-Location $BACKEND_PATH
    
    try {
        dotnet ef database update
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Migrations aplicadas com sucesso!" -ForegroundColor Green
            Write-Host "✓ Banco populado com dados iniciais (seed data)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ Erro ao aplicar migrations" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "✗ Erro ao aplicar migrations: $_" -ForegroundColor Red
        return $false
    }
}

# Função para exibir informações finais
function Show-Summary {
    Write-Host "[5/5] Resumo da Configuração" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "  ✓ Configuração Concluída!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Informações do Banco:" -ForegroundColor White
    Write-Host "  Host:     $DB_HOST" -ForegroundColor Gray
    Write-Host "  Porta:    $DB_PORT" -ForegroundColor Gray
    Write-Host "  Banco:    $DB_NAME" -ForegroundColor Gray
    Write-Host "  Usuário:  $DB_USER" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Usuários Criados:" -ForegroundColor White
    Write-Host "  Admin:     admin@pokerrvd.com / Admin123" -ForegroundColor Gray
    Write-Host "  Gerente:   gerente@pokerrvd.com / Senha123" -ForegroundColor Gray
    Write-Host "  Atendente: atendente@pokerrvd.com / Senha123" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Próximos Passos:" -ForegroundColor White
    Write-Host "  1. Inicie o backend:" -ForegroundColor Gray
    Write-Host "     cd Backend\PokerRvd.Api" -ForegroundColor Cyan
    Write-Host "     dotnet run" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  2. Acesse o Swagger:" -ForegroundColor Gray
    Write-Host "     http://localhost:5000/swagger" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  3. Faça login no sistema:" -ForegroundColor Gray
    Write-Host "     http://localhost:4200/login" -ForegroundColor Cyan
    Write-Host ""
}

# ===================================================================
# Execução Principal
# ===================================================================

# Verificar se estamos no diretório correto
if (-not (Test-Path $BACKEND_PATH)) {
    Write-Host "✗ Erro: Diretório do backend não encontrado!" -ForegroundColor Red
    Write-Host "  Esperado: $BACKEND_PATH" -ForegroundColor Yellow
    Write-Host "  Execute este script a partir da raiz do projeto" -ForegroundColor Yellow
    exit 1
}

# Executar etapas
$success = $true

# 1. Testar PostgreSQL
if (-not (Test-PostgreSQL)) {
    $success = $false
    Write-Host ""
    Write-Host "ALTERNATIVA: Use Docker para PostgreSQL:" -ForegroundColor Yellow
    Write-Host "docker run --name postgres-pokerrvd -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16" -ForegroundColor Cyan
    exit 1
}

# 2. Criar banco
if ($success -and -not (New-Database)) {
    $success = $false
    exit 1
}

# 3. Criar migrations
if ($success -and -not (New-Migrations)) {
    $success = $false
    exit 1
}

# 4. Aplicar migrations
if ($success -and -not (Update-Database)) {
    $success = $false
    exit 1
}

# 5. Exibir resumo
if ($success) {
    Show-Summary
}

# Voltar ao diretório original
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
