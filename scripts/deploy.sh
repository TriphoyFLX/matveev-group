#!/usr/bin/env bash
# Локально: пуш в GitHub + деплой на VPS (не трогает decksy, larptubex и др.)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="root@193.176.79.126"
APP_DIR="/var/www/matveev-group"

cd "$ROOT"

echo "→ Build check..."
npm run build

if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
  echo "⚠ Есть незакоммиченные изменения. Сначала: git add -A && git commit && git push"
  exit 1
fi

echo "→ Push origin main..."
git push origin main

SSH_CMD="ssh -o StrictHostKeyChecking=accept-new"
if [[ -n "${SSHPASS:-}" ]]; then
  SSH_CMD="sshpass -e ssh -o StrictHostKeyChecking=accept-new"
fi

echo "→ Deploy on server..."
$SSH_CMD "$HOST" "bash $APP_DIR/scripts/server-deploy.sh"

echo "✓ https://matveev-group.ru"
