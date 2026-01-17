#!/bin/bash

# Script para iniciar Backend (C#) e Frontend (Angular) simultaneamente
# Bash Script para Linux/Mac

echo "🚀 Iniciando PokerRvd - Backend e Frontend"
echo "========================================="
echo ""

# Verifica se o .NET está instalado
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK não encontrado!"
    echo "Por favor, instale o .NET 8.0 SDK de: https://dotnet.microsoft.com/download"
    exit 1
fi

DOTNET_VERSION=$(dotnet --version)
echo "✅ .NET SDK detectado: $DOTNET_VERSION"

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "Por favor, instale o Node.js de: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js detectado: $NODE_VERSION"
echo ""

# Função para limpar processos ao encerrar
cleanup() {
    echo ""
    echo "🛑 Encerrando aplicações..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

# Inicia o Backend
echo "🔧 Iniciando Backend C# (ASP.NET Core)..."
cd backend/PokerRvd.Api
dotnet run > ../../backend.log 2>&1 &
BACKEND_PID=$!
cd ../..

# Aguarda o backend inicializar
echo "⏳ Aguardando backend inicializar (5 segundos)..."
sleep 5

# Verifica se o backend está rodando
if ! ps -p $BACKEND_PID > /dev/null; then
    echo "❌ Erro ao iniciar o backend!"
    echo "Verifique o arquivo backend.log para mais detalhes"
    exit 1
fi

echo "✅ Backend iniciado (PID: $BACKEND_PID)"

# Inicia o Frontend (da raiz, pois os arquivos estão lá)
echo "🎨 Iniciando Frontend Angular..."
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

# Aguarda o frontend inicializar
echo "⏳ Aguardando frontend inicializar..."
sleep 10

# Verifica se o frontend está rodando
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo "❌ Erro ao iniciar o frontend!"
    echo "Verifique o arquivo frontend.log para mais detalhes"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"
echo ""
echo "========================================="
echo "✅ Aplicações iniciadas com sucesso!"
echo ""
echo "📍 URLs Disponíveis:"
echo "   Backend API:     http://localhost:5000"
echo "   Swagger Docs:    http://localhost:5000/swagger"
echo "   Frontend:        http://localhost:4200"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "💡 Pressione Ctrl+C para parar ambas as aplicações"
echo ""

# Mantém o script rodando
wait
