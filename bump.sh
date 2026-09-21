#!/bin/sh
# Обновляет ?v= у style.css / offers.js / app.js в index.html, чтобы браузеры не брали старые файлы из кэша.
# Запускать перед деплоем: ./bump.sh && npx wrangler deploy
cd "$(dirname "$0")"
V=$(date +%Y%m%d%H%M)
sed -i '' -E "s#(style\.css|offers\.js|app\.js)(\?v=[0-9]+)?\"#\1?v=$V\"#g" index.html
echo "version: $V"
