# Script para iniciar Backend (C#) e Frontend (Angular) simultaneamente
# PowerShell Script para Windows

Write-Host "🚀 Iniciando PokerRvd - Backend e Frontend" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Verifica se o .NET está instalado
$dotnetVersion = dotnet --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ .NET SDK não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o .NET 8.0 SDK de: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ .NET SDK detectado: $dotnetVersion" -ForegroundColor Green

# Verifica se o Node.js está instalado
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Node.js de: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Inicia o Backend em uma nova janela do PowerShell
Write-Host "🔧 Iniciando Backend C# (ASP.NET Core)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$PSScriptRoot\backend\PokerRvd.Api'; Write-Host '🔥 Backend - PokerRvd API' -ForegroundColor Magenta; Write-Host ''; dotnet run"
)

# Aguarda alguns segundos para o backend inicializar
Write-Host "⏳ Aguardando backend inicializar (5 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Inicia o Frontend em uma nova janela do PowerShell (da raiz, pois os arquivos estão lá)
Write-Host "🎨 Iniciando Frontend Angular..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$PSScriptRoot'; Write-Host '🎨 Frontend - Angular' -ForegroundColor Blue; Write-Host ''; npm start"
)

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "✅ Aplicações iniciadas com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs Disponíveis:" -ForegroundColor White
Write-Host "   Backend API:     http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Swagger Docs:    http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "   Frontend:        http://localhost:4200" -ForegroundColor Blue
Write-Host ""
Write-Host "💡 Dica: Para parar, feche as janelas do PowerShell que abriram" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pressione qualquer tecla para fechar esta janela..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
