#!/bin/sh
set -e

# Porta (Railway usa PORT; padrão 80)
PORT="${PORT:-80}"
sed "s/__PORT__/$PORT/" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Gera config.json a partir de variáveis de ambiente (Railway, Docker)
if [ -n "$API_URL" ] || [ -n "$HUB_URL" ]; then
  API="${API_URL:-http://localhost:5000/api}"
  HUB="${HUB_URL:-http://localhost:5000/hubs/poker}"
  echo "{\"apiUrl\":\"$API\",\"hubUrl\":\"$HUB\"}" > /usr/share/nginx/html/config.json
fi

exec nginx -g "daemon off;"
