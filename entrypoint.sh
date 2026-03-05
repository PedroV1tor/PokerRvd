#!/bin/sh
set -e

# Gera config.json a partir de variáveis de ambiente (Railway, Docker)
if [ -n "$API_URL" ] || [ -n "$HUB_URL" ]; then
  API="${API_URL:-http://localhost:5000/api}"
  HUB="${HUB_URL:-http://localhost:5000/hubs/poker}"
  echo "{\"apiUrl\":\"$API\",\"hubUrl\":\"$HUB\"}" > /usr/share/nginx/html/config.json
fi

exec nginx -g "daemon off;"
