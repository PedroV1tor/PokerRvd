#!/bin/sh
set -e

# Porta (Railway usa PORT; padrão 80)
PORT="${PORT:-80}"
# Garantir que PORT é numérico (evita sed quebrado)
case "$PORT" in
  ''|*[!0-9]*) PORT=80 ;;
esac

# Remove config padrão do nginx e gera a nossa
rm -f /etc/nginx/conf.d/default.conf
sed "s/__PORT__/$PORT/" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Testa se a config do nginx é válida
nginx -t

# Gera config.json (sempre, para o Angular)
API="${API_URL:-http://localhost:5000/api}"
HUB="${HUB_URL:-http://localhost:5000/hubs/poker}"
echo "{\"apiUrl\":\"$API\",\"hubUrl\":\"$HUB\"}" > /usr/share/nginx/html/config.json

exec nginx -g "daemon off;"
