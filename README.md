# Matveev Group

Официальный сайт группы проектов **Matveev Group** (Дмитрий Матвеев, Омск): Loopera, Decksy, Triphoy.

- Продакшен: https://matveev-group.ru
- Репозиторий: https://github.com/TriphoyFLX/matveev-group

## Локальная разработка

```bash
npm install
npm run dev
```

## Деплой (GitHub → VPS)

```bash
git add -A && git commit -m "..." && git push origin main
export SSHPASS='...'   # при необходимости
./scripts/deploy.sh
```

На сервере проект лежит в `/var/www/matveev-group`, nginx отдаёт `dist/`. Другие сайты на VPS не затрагиваются.
