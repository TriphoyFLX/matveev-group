#!/usr/bin/env bash
# Запускается на VPS после git pull
set -euo pipefail

APP_DIR="/var/www/matveev-group"
cd "$APP_DIR"

echo "→ git pull..."
git fetch origin main
git reset --hard origin/main

echo "→ npm ci && build..."
npm ci
npm run build

echo "→ nginx reload..."
nginx -t
systemctl reload nginx

echo "✓ matveev-group.ru deployed ($(git rev-parse --short HEAD))"
