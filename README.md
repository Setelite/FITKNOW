# FITKNOW

Мобильное веб-приложение для планирования тренировок, питания и личных записей.

## Функции

- Светлая и тёмная тема
- Редактируемые разделы и отметки выполнения
- Загрузка программы тренировок и данных из файлов
- Сохранение данных в памяти браузера и экспорт резервной копии
- Адаптация под экран iPhone, иконка и автономный режим после первого открытия

> Данные пользователя сохраняются в браузере текущего устройства, не синхронизируются между устройствами автоматически. Для переноса используйте экспорт/импорт.

## Публичная ссылка

После публикации через GitHub Pages: **https://setelite.github.io/FITKNOW/**

Чтобы включить Pages в настройках репозитория:

1. **Settings → General → Danger Zone → Change repository visibility → Make public** (только если вы хотите открыть исходный код всем).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. **Branch: main, Folder: /(root) → Save**.
4. Подождите завершения публикации и откройте URL выше.

На iPhone: откройте опубликованный сайт в Safari → кнопка «Поделиться» → «На экран Домой».

## Структура

- `index.html` — приложение
- `manifest.webmanifest` — настройки установки
- `icon.svg` — иконка
- `sw.js` — кеширование для повторного открытия без сети

Никакие API-ключи и персональные медицинские данные не должны добавляться в общедоступный репозиторий.

## FITKNOW 3D Sticker Pack (NEON V4)

The user-approved promo sticker pack has 14 transparent PNG icons. App code on `main` attempts to load them from `./stickers3d/<name>.png` first, and falls back to `https://gornostaevmarketing.ru/fitknow/assets/stickers/<name>.png`. The pre-existing SVG illustrations remain as the last fallback until the PNG assets are uploaded.

Upload the contents of **`GitHub_загрузить_в_репозиторий/stickers3d/`** from the FITKNOW NEON V4 release archive into **`stickers3d/`** at the root of this repository. Do not rename the files. Once the binary images are committed, the app can load the approved sticker artwork directly from its own origin, including after installation as a PWA.

The landing-page archive is published separately to the `/fitknow/` folder on the site host; site deployment and GitHub Pages activation are not automated by this repo.
