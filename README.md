# Node.js Express Microservice Boilerplate

A production-grade, highly modular boilerplate for building scalable Node.js microservices. Strictly built according to SWP backend architecture conventions and developer standards defined in [`.agents/AGENTS.md`](.agents/AGENTS.md).

Built with **Express 5**, **Sequelize ORM (PostgreSQL)**, **RabbitMQ messaging (with Dead-Letter Queues)**, **SendGrid email service (with Handlebars templates)**, and **Firebase Cloud Messaging (FCM) push notifications**.

---

## 📜 Developer Rules & Coding Standards

All development in this repository MUST strictly follow the conventions documented in:
👉 **[`.agents/AGENTS.md`](.agents/AGENTS.md)**

---

## 🚀 Key Features & Capabilities

- **Standardized Response Architecture**: All endpoints adhere to a uniform response envelope (`{ status, message, data, error }`) powered by direct uppercase helper functions (`OK_RESPONSE`, `CREATED_RESPONSE`, `BAD_REQUEST_RESPONSE`, `NOT_FOUND_RESPONSE`, `SERVER_ERROR_RESPONSE`, etc.).
- **Centralized Message & Error Catalog**: Clean error and response code dictionary (`config/apiErrorCode.js`) eliminating hardcoded strings.
- **Sequelize ORM & Model Management**: Shared model attributes (`models.defaultAttributes`) providing consistent timestamps, UUIDs, soft deletes (`is_deleted`), and active flags (`is_active`).
- **In-Controller Joi Validations**: Input validation performed directly at the entry point of controller handlers using dedicated schema files.
- **Picture-Perfect Push Notifications (FCM)**:
  - Multi-platform push service supporting **iOS (APNs headers & badge)**, **Android (high-priority channels)**, and **WebPush**.
  - Multi-language template catalog (`config/pushMessages.js`) with dynamic `{{placeholder}}` token replacement.
  - Multi-strategy Firebase initialization (Service Account JSON file, individual env variables, or raw JSON string).
- **Picture-Perfect RabbitMQ Messaging**:
  - Connection singleton with auto-reconnect and complete topology assertion (Main Queues, Fanout Exchanges, and Dead-Letter Queues).
  - Durable message publisher and resilient consumer with **automatic exponential-backoff retries** (`2s, 4s, 8s...`) and DLQ routing.
- **Picture-Perfect SendGrid Email Service**:
  - Outbound email delivery with support for HTML, text, and pre-compiled **Handlebars** templates from `assets/templates/email/`.
  - Detailed unwrapping of SendGrid API error payloads for instant debugging.
- **Async Handling & Global Error Middleware**: Promise-based `asyncHandler` eliminating repetitive `try/catch` boilerplate, with safe error masking in production.
- **Standalone Migrations**: Manual PostgreSQL migration scripts (`migration.sql`) avoiding dangerous automatic schema migrations.
- **Security & Logging**: Helmet security headers, configurable CORS, rate limiting, and ANSI color-coded request/latency logging.

---

## 📁 Directory Structure

```
nodejs-express-boilerplate/
├── .agents/
│   └── AGENTS.md                   # Strict backend developer rules & coding standards
├── .env.example                    # Environment variable template
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier code formatting rules
├── Dockerfile                      # Production container image
├── docker-compose.yml              # Local development (App + Postgres + RabbitMQ)
├── migration.sql                   # Standalone manual PostgreSQL migration script
├── package.json                    # Dependencies & scripts
├── app.js                          # Main application entry point & lifecycle
├── config/
│   ├── envConfig.js                # Centralized environment variable validator
│   ├── constants/
│   │   ├── index.js                # System constants (roles, notification events, languages)
│   │   └── statusCodes.js          # HTTP Status Code constants
│   ├── models.js                   # Default model attributes (id, is_active, created_at, is_deleted, etc.)
│   ├── pushMessages.js             # Push notification multi-language template catalog
│   ├── apiErrorCode.js             # Coded error and response message catalog
│   ├── database.js                 # Database authentication & healthcheck
│   ├── datastores.js               # Database connection parameters
│   ├── sequelize.js                # Sequelize ORM instance & connection pool
│   ├── security.js                 # Helmet and CORS configuration
│   ├── rabbitmq.js                 # RabbitMQ connection manager & topology setup
│   ├── firebase.js                 # Firebase Admin / FCM multi-strategy initializer
│   ├── sendgrid.js                 # SendGrid mail client initializer
│   ├── bootstrap.js                # Background worker & subscriber bootloader
│   └── routes.js                   # Root router loader
├── api/
│   ├── controllers/
│   │   ├── HealthCheckController.js# /health controller
│   │   └── v1/
│   │       ├── SampleController.js # CRUD reference implementation
│   │       └── NotificationDemoController.js # Push/Email/Queue test controller
│   ├── routes/
│   │   ├── index.js                # Main router dispatcher (/health, /api/v1)
│   │   ├── HealthRoutes.js         # Healthcheck router
│   │   └── v1/
│   │       ├── index.js            # V1 router aggregation
│   │       ├── sample.routes.js    # Sample CRUD routes (/list, /view, /create, /update, /delete)
│   │       └── notification.routes.js # Notification test routes
│   ├── middlewares/
│   │   ├── errorHandler.js         # Centralized error handler with coded errors
│   │   └── rateLimiter.js          # Express rate limiting
│   ├── policies/
│   │   ├── isAuth.js               # JWT bearer token verification
│   │   └── isAdmin.js              # Admin role authorization
│   ├── services/
│   │   └── SampleService.js        # Business logic layer (Direct Arrow Functions)
│   ├── subscribers/
│   │   ├── index.js                # Subscriber registry
│   │   └── sampleSubscriber.js     # RabbitMQ worker example
│   ├── helpers/
│   │   ├── mail/
│   │   │   └── emailService.js     # SendGrid + Handlebars email helper
│   │   ├── push/
│   │   │   ├── pushNotificationService.js # FCM Push helper (iOS, Android, Web)
│   │   │   └── pushMessageResolver.js     # Multi-language placeholder resolver
│   │   ├── queue/
│   │   │   ├── publisher.js        # Durable message publisher
│   │   │   └── consumer.js         # Resilient consumer with backoff & DLQ
│   │   ├── pagination.js           # Offset pagination helper
│   │   └── jwtHelper.js            # JWT token creation & verification
│   └── utils/
│       ├── response.js             # Named response functions (OK_RESPONSE, CREATED_RESPONSE, etc.)
│       ├── asyncHandler.js         # Promise catch wrapper
│       ├── momentUtils.js          # Timestamp utilities (GET_CURRENT_TIMESTAMP)
│       ├── server.js               # Server start banner
│       └── validations/
│           └── schemas/
│               ├── common/
│               │   ├── baseSchemas.js
│               │   └── skipLimitSearchSchema.js
│               ├── SampleValidation.js
│               └── NotificationValidation.js
├── assets/
│   └── templates/
│       └── email/
│           └── sample-welcome.hbs  # Handlebars email template
└── models/
    ├── index.js                    # Sequelize model loader & associations
    └── Sample.js                   # Sample Sequelize model (with defaultAttributes)
```

---

## 🛠️ Quickstart

### 1. Installation
```bash
# Clone or copy into your target service directory
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```
Fill in your database credentials, JWT secrets, SendGrid API key, Firebase configuration, and RabbitMQ parameters in `.env`.

### 3. Run Application
```bash
# Local development mode (with nodemon)
npm run dev

# Production start
npm start

# Run with Docker Compose (includes PostgreSQL & RabbitMQ)
docker-compose up -d
```

---

## 📡 API Endpoint Reference (Included Sample Endpoints)

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/health` | Healthcheck & subsystem status | None |
| **GET** | `/api/v1/sample/list` | Paginated listing | `req.query`: `skip`, `limit`, `search`, `status` |
| **GET** | `/api/v1/sample/view` | View single record | `req.query`: `id` |
| **POST** | `/api/v1/sample/create` | Create new record | `req.body`: `title`, `description`, `status` |
| **PUT** | `/api/v1/sample/update` | Update existing record | `req.body`: `id`, `title`, `description`, `status` |
| **DELETE**| `/api/v1/sample/delete` | Soft delete record | `req.query`: `id` |
| **POST** | `/api/v1/notification/push` | Dispatch push notification | `req.body`: `deviceToken`, `type` or `title`/`body` |
| **POST** | `/api/v1/notification/email` | Dispatch template email | `req.body`: `to`, `subject`, `name` |
| **POST** | `/api/v1/notification/queue` | Publish message to queue | `req.body`: `queueName`, `payload` |

---

## 🛡️ License

ISC
