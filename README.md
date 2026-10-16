# CYBERCORE

Русскоязычный коммерческий лендинг компьютерного клуба на Next.js App Router. Проект содержит адаптивный интерфейс, интерактивные тарифы, FAQ и галерею, а также безопасно отключаемую форму заявки с доставкой через Resend.

Сейчас репозиторий готов к локальной проверке и закрытому предварительному просмотру. Контакты, цены, оснащение и изображения помечены как черновые. Индексация и приём реальных заявок по умолчанию отключены.

## Требования

- Node.js 24 или новее;
- npm 11 или совместимая версия;
- Chromium для Playwright E2E;
- для отправки заявок — аккаунт Resend с подтверждённым доменом;
- для публичного размещения — хостинг и тариф, разрешающие коммерческое использование.

Проверить версии:

```bash
node --version
npm --version
```

## Локальный запуск

```bash
git clone https://github.com/NikAbram/cybercore.git
cd cybercore
npm ci
copy .env.example .env.local
npm run dev
```

Откройте `http://localhost:3000`.

В PowerShell вместо `copy` можно выполнить:

```powershell
Copy-Item .env.example .env.local
```

`.env.local` и другие локальные `.env*` исключены из Git. Не добавляйте реальные ключи и адреса получателей в репозиторий.

## Команды

| Команда                | Назначение                   |
| ---------------------- | ---------------------------- |
| `npm run dev`          | локальный Next.js dev server |
| `npm run build`        | production-сборка            |
| `npm run start`        | запуск production-сборки     |
| `npm run lint`         | ESLint                       |
| `npm run typecheck`    | проверка TypeScript          |
| `npm run format:check` | проверка Prettier            |
| `npm run test`         | Vitest/Testing Library       |
| `npm run test:e2e`     | Playwright E2E в Chromium    |

Полный локальный gate перед публикацией:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run build
npm run test:e2e
npm audit --omit=dev
```

## Переменные окружения

Актуальный шаблон находится в `.env.example`.

| Переменная                      | Пример для закрытого preview  | Назначение                                                                     |
| ------------------------------- | ----------------------------- | ------------------------------------------------------------------------------ |
| `APP_ORIGIN`                    | `https://preview.example.com` | точный origin, разрешённый для `POST /api/booking`                             |
| `SITE_URL`                      | `https://cybercore.example`   | канонический HTTPS-origin; резервный `.example` не включает публикацию         |
| `SITE_PUBLISHED`                | `false`                       | включает canonical, индексацию и sitemap только вместе с допустимым `SITE_URL` |
| `BOOKING_FORM_ENABLED`          | `false`                       | разрешает показ рабочей формы только при готовности всех остальных условий     |
| `BOOKING_PRIVACY_URL`           | `https://example.com/privacy` | утверждённая HTTPS-ссылка на политику либо локальный путь вида `/privacy`      |
| `BOOKING_RATE_LIMIT_CONFIGURED` | `false`                       | подтверждение, что внешнее ограничение частоты действительно настроено         |
| `RESEND_API_KEY`                | пусто                         | серверный ключ Resend                                                          |
| `BOOKING_EMAIL_FROM`            | пусто                         | подтверждённый отправитель, например `CYBERCORE <booking@example.com>`         |
| `BOOKING_EMAIL_TO`              | пусто                         | адрес администратора                                                           |

Секретные значения не должны иметь префикс `NEXT_PUBLIC_`: такие переменные Next.js встраивает в браузерный bundle.

### Безопасные состояния

- Если `SITE_PUBLISHED` не равен `true` или `SITE_URL` не является допустимым HTTPS-origin, страница получает `noindex`, а `robots.txt` — `Disallow: /`.
- Форма работает только когда включён `BOOKING_FORM_ENABLED`, задана утверждённая политика, заполнены все почтовые настройки и подтверждён внешний rate limit.
- Если конфигурация неполна, UI сообщает, что онлайн-заявки не принимаются, а API возвращает `503`.
- Успех показывается только после ответа Resend с идентификатором письма. Отправка заявки не означает автоматическое бронирование.

## Замена чернового контента

Перед публичным запуском замените и подтвердите данные в следующих файлах:

| Данные                                        | Файл                                             |
| --------------------------------------------- | ------------------------------------------------ |
| контакты, город, адрес, часы, социальные сети | `src/data/site.ts`                               |
| игровые зоны, оснащение и вместимость         | `src/data/zones.ts`                              |
| почасовые и пакетные тарифы                   | `src/data/pricing.ts`                            |
| турниры и ссылки регистрации                  | `src/data/tournaments.ts`                        |
| hero и галерея                                | `src/data/media.ts` и `public/images/cybercore/` |
| FAQ                                           | `src/data/faq.ts`                                |
| правила даты, времени, длительности и мест    | `src/lib/booking/rules.ts`                       |

Для подтверждённых значений заменяйте внутренний `status: 'draft'` на `status: 'confirmed'` после проверки источника. Не добавляйте карту до подтверждения адреса и регистрацию на турнир без рабочего обработчика или ссылки.

Изображения сейчас являются материалами закрытой предварительной версии. До публичного запуска подтвердите права, замените их при необходимости и не выдавайте концептуальные интерьеры за фотографии реально существующего помещения без согласования.

## Настройка Resend

1. Добавьте и подтвердите домен отправителя в Resend.
2. Создайте серверный API key с минимально необходимыми правами.
3. Укажите `RESEND_API_KEY`, `BOOKING_EMAIL_FROM` и `BOOKING_EMAIL_TO` в секретах хостинга.
4. Опубликуйте утверждённую политику и задайте `BOOKING_PRIVACY_URL`.
5. Настройте внешний rate limit для `POST /api/booking` и только после проверки установите `BOOKING_RATE_LIMIT_CONFIGURED=true`.
6. Укажите точный HTTPS-origin размещённой версии в `APP_ORIGIN`.
7. Последним шагом установите `BOOKING_FORM_ENABLED=true` и создайте новый deployment.

После отправки тестовой заявки проверьте:

- письмо действительно пришло на `BOOKING_EMAIL_TO`;
- имя и телефон не попали в runtime/build-логи;
- UI сообщает только об отправке запроса администратору;
- при ошибке Resend пользователь не видит ложного подтверждения;
- повторные запросы ограничиваются правилом платформы.

## Rate limit / WAF

Для Vercel создайте правило rate limiting для `POST /api/booking`. Конкретные значения лимита согласуйте с ожидаемой нагрузкой; правило должно ограничивать частые запросы до приложения и возвращать `429` при превышении.

Honeypot и блокировка повторной отправки в браузере остаются дополнительными мерами и не заменяют rate limit. Не устанавливайте `BOOKING_RATE_LIMIT_CONFIGURED=true`, пока опубликованное правило не проверено реальными запросами.

Документация Vercel: [WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).

## Закрытый preview на Vercel

Vercel Hobby разрешён только для личного некоммерческого использования. Для этого коммерческого проекта сначала подтвердите Pro/Enterprise либо выберите другой допустимый хостинг. Не создавайте production deployment на Hobby.

Для preview используйте Vercel Authentication со Standard Protection: эта конфигурация защищает deployment URL и preview deployments. Не публикуйте shareable bypass-ссылку без отдельного решения.

Официальные источники:

- [Vercel Terms — Hobby Plan](https://vercel.com/legal/terms#4-hobby-plan)
- [Deployment Protection](https://vercel.com/docs/deployment-protection)
- [Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication)

После подтверждения тарифа и авторизации:

```bash
npx vercel@latest login
npx vercel@latest link
npx vercel@latest env ls
npx vercel@latest deploy
```

Для закрытого preview оставьте:

```dotenv
SITE_PUBLISHED=false
BOOKING_FORM_ENABLED=false
BOOKING_RATE_LIMIT_CONFIGURED=false
```

В настройках проекта откройте **Settings → Deployment Protection**, включите **Vercel Authentication** и выберите **Standard Protection**. Проверьте защиту до передачи ссылки заказчику.

Проверка защищённого deployment через CLI:

```bash
npx vercel@latest curl / --deployment <preview-url>
npx vercel@latest curl /robots.txt --deployment <preview-url>
npx vercel@latest logs --deployment <deployment-id> --level error
```

Ожидаемый результат для закрытой версии:

- `/` возвращает `200` после Vercel Authentication;
- присутствуют CSP, `X-Content-Type-Options`, `X-Frame-Options` и `Referrer-Policy`;
- metadata содержит `noindex`;
- `/robots.txt` содержит `Disallow: /`;
- онлайн-заявки выключены;
- в runtime-логах нет ошибок и персональных данных.

## Публичный запуск

Публичный запуск — отдельное решение после закрытого preview. Перед ним необходимо:

- подтвердить контакты, адрес, часы, тарифы, оснащение, изображения и события;
- утвердить политику, согласие и сведения об ответственном лице;
- подтвердить права на изображения;
- выбрать коммерческий тариф/хостинг;
- настроить домен, HTTPS, Resend и WAF;
- получить реальное тестовое письмо;
- повторить полный test/build/E2E gate на финальной конфигурации;
- установить подтверждённый `SITE_URL` и только затем `SITE_PUBLISHED=true`;
- повторно измерить Lighthouse после снятия `noindex`.

До выполнения всех условий не добавляйте `LocalBusiness`, карту, отзывы или рейтинги с неподтверждёнными сведениями.

## Архитектура

- основной контент — Server Components;
- клиентские компоненты используются только для интерактивных элементов;
- контакты, тарифы, зоны, FAQ, турниры и медиа хранятся отдельно от компонентов;
- `POST /api/booking` повторно валидирует данные через Zod, ограничивает размер JSON, проверяет Origin и не сохраняет заявки;
- почтовые секреты используются только в `src/lib/server/`;
- база данных, Prisma, CMS и отдельный backend в MVP отсутствуют.

Подробные требования находятся в `TECHNICAL_SPEC.md`, этапы и условия запуска — в `PLAN.md`.
