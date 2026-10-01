# Node.js Express Microservice Boilerplate

A production-grade, highly modular boilerplate for building scalable Node.js microservices. Strictly built according to SWP backend architecture conventions and developer standards defined in [`.agents/AGENTS.md`](.agents/AGENTS.md).

Built with **Express 5**, **Sequelize ORM (PostgreSQL)**, **RabbitMQ messaging (with Dead-Letter Queues)**, **SendGrid email service (with Handlebars templates)**, and **Firebase Cloud Messaging (FCM) push notifications**.

---

## 📜 Developer Rules & Coding Standards

All development in this repository MUST strictly follow the conventions documented in:
👉 **[`.agents/AGENTS.md`](.agents/AGENTS.md)**

---

## 🚀 Key Features & Capabilities

- **📦 Centralized Package Registry (`config/packages.js`)**: All third-party npm libraries and Node.js built-in modules are imported once in a single registry and exported as capitalized identifiers (`EXPRESS`, `JOI`, `JWT`, `SEQUELIZE`, `REDIS`, `CRON`, `XLSX`, `MULTER`, `AWS_S3`, `MOMENT`, `BCRYPT`, etc.) to enforce strict consistency across the codebase.
- **✨ Standardized Response Architecture**: All API endpoints return a uniform response envelope (`{ status, message, data, error }`) using named helper functions (`OK_RESPONSE`, `CREATED_RESPONSE`, `BAD_REQUEST_RESPONSE`, `NOT_FOUND_RESPONSE`, `SERVER_ERROR_RESPONSE`, etc.).
- **📋 Centralized Error & Message Catalog (`config/apiErrorCode.js`)**: Domain-specific coded messages (e.g. `VAL001`, `AUTH001`, `FILE001`, `ERR500`) eliminating hardcoded strings across handlers.
- **🗄️ Sequelize ORM via DB_URL**: Direct PostgreSQL connection via `DB_URL` with connection pooling, shared model attributes (`models.defaultAttributes` with UUIDs, timestamps, active flags, soft-deletes `is_deleted`), and manual standalone SQL scripts (`migration.sql`).
- **🛡️ In-Controller Joi Schema Validations**: Declarative input validation at the top of controller handlers, featuring reusable pagination schemas (`skipLimitSearchingSchema`).
- **☁️ AWS S3 Cloud Storage & Multer Uploads (`api/helpers/s3Helper.js`, `api/middlewares/upload.js`)**:
  - Memory-buffered Multer middlewares with MIME type & size filters for **Images** (10MB), **Videos** (100MB), **Documents** (25MB), **Spreadsheets**, and **Multi-Media**.
  - Direct S3 uploads with UUID collision protection.
  - **Pre-signed Upload URLs** (direct client/mobile-to-S3 PUT) and **Pre-signed Download URLs** (time-limited GET for private files).
  - Compatible with AWS S3, Cloudflare R2, MinIO, and LocalStack via custom endpoints.
- **📊 Excel & CSV Utilities via `xlsx` (`api/helpers/excelHelper.js`)**:
  - In-memory `.xlsx` workbook buffer generation from JSON arrays.
  - In-memory `.csv` buffer generation from JSON arrays.
  - Parsing uploaded spreadsheet buffers (`.xlsx`, `.xls`, `.csv`) into structured JSON row objects.
- **🔐 Cryptography, Passwords & Auth Helper (`api/helpers/cryptoHelper.js`)**:
  - Password hashing and verification via `bcryptjs`.
  - Cryptographically secure numeric OTPs and random hexadecimal tokens.
  - Timing-safe HMAC webhook signature generation & verification.
  - Authenticated symmetric AES-256-GCM data encryption and decryption.
- **⚡ Redis Manager, Caching & Token Blacklisting (`config/redis.js`, `api/helpers/redisHelper.js`)**:
  - Explicit env-flag (`ENABLE_REDIS=Y`) controlled connection with exponential backoff and safe mock fallback.
  - Route-level GET response caching middleware (`cacheMiddleware`).
  - Instant JWT token revocation / blacklist verification integrated into `isAuth` policy.
- **⏰ Scheduled Tasks / Cron Runner (`config/cron.js`, `api/tasks/`)**:
  - Explicit env-flag (`ENABLE_CRON=Y`) controlled recurring task runner powered by `node-cron`.
  - Modular task registry with automatic start and graceful shutdown on SIGTERM/SIGINT.
- **🚧 Maintenance Mode Gateway (`api/middlewares/maintenance.js`)**:
  - Explicit env-flag (`MAINTENANCE_MODE=Y`) controlled gateway returning `503 Service Unavailable`.
  - Built-in bypass support for `/health`, secret bypass header (`x-maintenance-bypass`), and IP allowlisting.
- **🔍 Request Correlation ID (`X-Request-Id`)**: Unique UUID injection & propagation across headers and ANSI color-coded console logs for distributed request tracing.
- **📲 Picture-Perfect Push Notifications (FCM)**:
  - Multi-platform push service for **iOS (APNs headers & badge)**, **Android (notification channels)**, and **WebPush**.
  - Multi-language template catalog (`config/pushMessages.js`) with dynamic `{{placeholder}}` token substitution.
  - Initialized strictly via individual service account credentials (Option 2).
- **🐇 Picture-Perfect RabbitMQ Messaging (`config/rabbitmq.js`, `api/helpers/queue/`)**:
  - Connection manager with complete topology assertion (Queues, Exchanges, Dead-Letter Queues).
  - Durable message publisher and resilient consumer with **automatic exponential-backoff retries** (`2s, 4s, 8s...`) and DLQ routing.
- **📧 Picture-Perfect SendGrid Email Service (`config/sendgrid.js`, `api/helpers/mail/`)**:
  - Outbound email delivery with pre-compiled **Handlebars** HTML templates from `assets/templates/email/`.
  - Automatic error unwrapping from SendGrid API responses for instant debugging.
- **🔒 Security & Resilience**: Helmet HTTP security headers, CORS, rate limiting (`express-rate-limit`), promise-based `asyncHandler`, and graceful shutdown lifecycle hooks.

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
│   ├── packages.js                 # Centralized registry for all third-party & built-in packages
│   ├── envConfig.js                # Centralized environment variable validator
│   ├── constants/
│   │   ├── index.js                # System constants (roles, notification events, storage, cron, crypto)
│   │   └── statusCodes.js          # HTTP Status Code constants
│   ├── models.js                   # Default model attributes (id, is_active, created_at, is_deleted, etc.)
│   ├── pushMessages.js             # Push notification multi-language template catalog
│   ├── apiErrorCode.js             # Coded error and response message catalog
│   ├── database.js                 # Database authentication & healthcheck
│   ├── sequelize.js                # Sequelize ORM instance & connection pool (via DB_URL)
│   ├── redis.js                    # Redis connection manager (caching & blacklist)
│   ├── cron.js                     # Background task & cron scheduler loader
│   ├── security.js                 # Helmet and CORS configuration
│   ├── rabbitmq.js                 # RabbitMQ connection manager & topology setup
│   ├── firebase.js                 # Firebase Admin / FCM initializer (Option 2)
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
│   │   ├── requestId.js            # X-Request-Id UUID injection & propagation
│   │   ├── maintenance.js          # Maintenance mode gateway (503 Service Unavailable)
│   │   ├── upload.js               # Multer file upload filters (images, videos, documents, media)
│   │   ├── cacheMiddleware.js      # Route-level Redis response caching
│   │   ├── errorHandler.js         # Centralized error handler with coded errors
│   │   └── rateLimiter.js          # Express rate limiting
│   ├── policies/
│   │   ├── isAuth.js               # JWT bearer token & revocation verification
│   │   └── isAdmin.js              # Admin role authorization
│   ├── services/
│   │   └── SampleService.js        # Business logic layer (Direct Arrow Functions)
│   ├── subscribers/
│   │   ├── index.js                # Subscriber registry
│   │   └── sampleSubscriber.js     # RabbitMQ worker example
│   ├── tasks/
│   │   ├── index.js                # Cron task registry
│   │   └── sampleCleanupTask.js    # Sample scheduled background job
│   ├── helpers/
│   │   ├── s3Helper.js             # AWS S3 upload, pre-signed URLs, delete & public CDN URL resolver
│   │   ├── cryptoHelper.js         # Passwords (bcrypt), OTP, HMAC signatures, AES encryption
│   │   ├── excelHelper.js          # XLSX / CSV export and parsing (xlsx package)
│   │   ├── redisHelper.js          # Redis cache get/set/del & JWT token blacklist
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
