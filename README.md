# AiMarketPlace - Маркетплейс AI моделей

Микросервисная платформа для продажи и покупки AI моделей с полным функционалом маркетплейса.

## Назначение

AiMarketPlace - это комплексная платформа, которая позволяет разработчикам продавать свои AI модели, а покупателям - находить и приобретать готовые решения. Платформа включает в себя управление продуктами, платежи, отзывы, поиск, чат и другие функции современного маркетплейса.

## Архитектура

Проект построен на микросервисной архитектуре с разделением на backend и frontend:

### Backend (Микросервисы)

#### Java сервисы (Spring Boot 3.5.3)
- **AnalyticsService** - сбор и анализ метрик использования AI моделей
- **UserService** - управление пользователями и профилями
- **OrderService** - обработка заказов на покупку AI моделей
- **PaymentService** - обработка платежей и транзакций
- **ProductService** - управление каталогом AI моделей
- **LoggingService** - централизованное логирование

#### Node.js сервисы (Express 4.16.1)
- **ApiGateway** - единая точка входа для всех API запросов
- **ChatService** - обработка сообщений между пользователями
- **FileService** - загрузка и управление файлами AI моделей
- **ModelExecutionService** - выполнение и тестирование AI моделей
- **NotificationService** - отправка уведомлений пользователям
- **ReviewService** - управление отзывами и рейтингами
- **SearchService** - поиск по каталогу AI моделей

### Frontend

- **Vue.js 3.5.17** приложение с TypeScript
- **Quasar 2.18.1** - UI фреймворк
- **Vite 7.0.0** для сборки
- **Pinia 3.0.3** для управления состоянием
- **Vue Router 4.5.1** для навигации
- **Vitest** для unit тестов
- **Playwright** для e2e тестов

## Технологический стек

### Backend
- **Java 21** + Spring Boot 3.5.3 (для Java сервисов)
- **Node.js** + Express 4.16.1 (для Node.js сервисов)
- **PostgreSQL** (предположительно для хранения данных)
- **Redis** (для кеширования, если используется)

### Frontend
- **Vue.js 3.5.17**
- **Quasar 2.18.1** (UI компоненты)
- **TypeScript 5.8.0**
- **Vite 7.0.0**
- **Pinia 3.0.3** (state management)
- **Vue Router 4.5.1**

## Структура проекта

```
AiMarketPlace/
├── backend/                    # Backend микросервисы
│   ├── AnalyticsService/       # Java - аналитика
│   ├── ApiGateway/            # Node.js - API Gateway
│   ├── ChatService/           # Node.js - чат
│   ├── FileService/           # Node.js - файлы
│   ├── LoggingService/        # Java - логирование
│   ├── ModelExecutionService/  # Node.js - выполнение моделей
│   ├── NotificationService/   # Node.js - уведомления
│   ├── OrderService/          # Java - заказы
│   ├── PaymentService/        # Java - платежи
│   ├── ProductService/        # Java - продукты
│   ├── ReviewService/         # Node.js - отзывы
│   ├── SearchService/         # Node.js - поиск
│   └── UserService/           # Java - пользователи
└── frontend/                   # Frontend приложение
    └── my-vue-app/            # Vue.js приложение
```

## Основной функционал

### Для продавцов
- Загрузка и публикация AI моделей
- Управление каталогом продуктов
- Обработка заказов
- Получение платежей
- Коммуникация с покупателями через чат
- Просмотр отзывов и рейтингов

### Для покупателей
- Поиск и просмотр AI моделей
- Фильтрация и сортировка продуктов
- Покупка AI моделей
- Тестирование моделей перед покупкой
- Оставление отзывов и рейтингов
- Чат с продавцами

### Системные функции
- Аналитика использования и продаж
- Централизованное логирование
- Уведомления о событиях
- Управление файлами и загрузками
- API Gateway для маршрутизации

## Запуск проекта

### Backend сервисы

#### Java сервисы
```bash
cd backend/[ServiceName]
./mvnw spring-boot:run
```

#### Node.js сервисы
```bash
cd backend/[ServiceName]
npm install
npm start
```

### Frontend
```bash
cd frontend/my-vue-app
npm install
npm run dev          # Запуск dev сервера
npm run build        # Сборка для production
npm run test:unit    # Unit тесты
npm run test:e2e     # E2E тесты
```

## Документация

Каждый микросервис имеет свой README.md с подробным описанием:
- Назначение сервиса
- Технологический стек
- Структура проекта
- Основной функционал

## Микросервисы

Подробная документация по каждому сервису находится в соответствующих директориях:
- [AnalyticsService](backend/AnalyticsService/README.md)
- [UserService](backend/UserService/README.md)
- [OrderService](backend/OrderService/README.md)
- [PaymentService](backend/PaymentService/README.md)
- [ProductService](backend/ProductService/README.md)
- [LoggingService](backend/LoggingService/README.md)
- [ApiGateway](backend/ApiGateway/README.md)
- [ChatService](backend/ChatService/README.md)
- [FileService](backend/FileService/README.md)
- [ModelExecutionService](backend/ModelExecutionService/README.md)
- [NotificationService](backend/NotificationService/README.md)
- [ReviewService](backend/ReviewService/README.md)
- [SearchService](backend/SearchService/README.md)
