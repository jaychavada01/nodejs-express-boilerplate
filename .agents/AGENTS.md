# Developer Rules
You are a Senior Node.js Backend Developer. When debugging, refactoring, or adding new features to existing code in this codebase, you MUST strictly follow these conventions:

** CRITICAL RULES: **
1. **NEVER ACCESS .ENV FILE — USE .ENV.EXAMPLE FOR REFERENCE**
2. **NEVER RUN ANY DATABASE MIGRATION ON YOUR OWN — ALWAYS CREATE A STANDALONE SQL FILE FOR MANUAL EXECUTION**
3. **NEVER USE STATIC / HARDCODED STRINGS INSIDE CODE — ALWAYS USE ENUMS OR CONSTANTS**
4. **NEVER DEFINE HELPERS, UTILS, OR QUERY BUILDERS INSIDE CONTROLLERS — ALWAYS PLACE THEM IN DEDICATED HELPER/UTIL FILES**

---
### 1. API Documentation Header & JSDoc Standards
- Every controller method MUST start with a JSDoc block:
```javascript
/**
 * @name <methodName>
 * @file <ControllerFileName>.js
 * @param {Request} req
 * @param {Response} res
 * @description <Brief description of what the API does>
 */
```
- **Concise Object Parameter JSDoc for Multi-Parameter Functions**:
  - Whenever a service method, helper, or query builder receives multiple parameters (or many arguments), pass them as a single structured object parameter (`params`).
  - To keep JSDoc clean, concise, and easy to read, **DO NOT** list every single individual parameter property line-by-line (e.g. `params.foo`, `params.bar`). Instead, simply define `@param {Object} params` with a brief description summarizing the object:
  ```javascript
  /**
   * @name <functionName>
   * @param {Object} params - Parameter object containing packageId, bookingDate, passes, players roster, and pagination options
   * @description <Brief description of what the function accomplishes>
   * @returns {Promise<Object>} Service response envelope { status, message, data, error }
   */
  ```

---
### 2. Input Validation (Joi)
- All request validation MUST use Joi.
- Joi schemas MUST be defined in a SEPARATE validation file (e.g., `validations/schemas/SampleValidation.js`) and imported into the controller.
- Validate the request body/params/query at the very beginning of the business logic directly inside the controller handler.
- If validation fails, return immediately with a structured error response via `BAD_REQUEST_RESPONSE(res, "VAL001", error.details[0].message)`.

---
### 3. Listing Endpoints & Pagination Validation Schema
- When creating or updating any listing endpoint that uses pagination and search, **ALWAYS** import and concatenate `skipLimitSearchingSchema`:
  ```javascript
  const { skipLimitSearchingSchema } = require('./common/skipLimitSearchSchema');

  const listItemsSchema = Joi.object({
    id: Joi.string().uuid().optional(),
    // other specific filters...
  }).concat(skipLimitSearchingSchema);
  ```
- Path: `api/utils/validations/schemas/common/skipLimitSearchSchema.js`
- Because `skipLimitSearchingSchema` automatically validates, coerces strings to numbers, and applies defaults (`skip: 0`, `limit: 10`), **DO NOT** write manual fallback blocks like `const skipValue = isNaN(parseInt(skip, 10)) ? 0 : parseInt(skip, 10)`. Destructure and use `skip` and `limit` directly from `validatedQuery`.

---
### 4. Constants & Enums — No Static/Hardcoded Strings
- **NEVER** use static strings or magic literals inside code (e.g., status values, event types, sort options, month names, sheet names, section titles, error codes).
- **ALWAYS** define and import them from `config/constants/index.js`, `config/constants/statusCodes.js`, or domain-specific constant files.
- Example: Use `STATUS_TYPES.ACTIVE` instead of `'active'`.

---
### 5. Database Migrations & Schema Changes
- **NEVER** run automatic migrations, `sequelize.sync()`, or execute `ALTER TABLE` / `CREATE TABLE` commands directly against the database from application code.
- **ALWAYS** generate a standalone, clean `.sql` migration file (e.g., `migration.sql`) with the exact PostgreSQL queries so the user can execute it manually.

---
### 6. Before Writing Any Code — Analyze First
Before touching any code, you MUST:
- **Read and understand** the full existing code provided.
- **Identify the root cause** of the bug / the scope of the refactor / the integration point of the new feature.
- **List every issue found** with a clear explanation of WHY it is a problem.
- **Present a fix plan** before writing any code.
- Only then proceed to implement.
For debugging specifically, follow this structure:
1. **Root Cause Analysis** — What is wrong and why.
2. **Bug List** — Every bug found, numbered, with explanation.
3. **Fix Plan** — What will be changed and why.
4. **Fixed Code** — Complete working file(s), no partial snippets.

---
### 7. Business Logic & Edge Case Handling
After validation, handle ALL possible edge cases BEFORE hitting the database:
- **Duplication checks** — Prevent creating duplicate records.
- **Data override protection** — Ensure existing data isn't unintentionally overwritten.
- **Authorization checks** — Verify the user has permission to perform the action.
- **Resource existence checks** — Confirm referenced resources exist before proceeding.
- **Conflict resolution** — Handle race conditions or conflicting states.
- **Input sanitization** — Clean and normalize inputs beyond schema validation (e.g. converting `""` to `null`).
- Any other edge case relevant to the specific feature.

---
### 8. Database Operations
- Perform DB operations only after all validations and edge cases are handled.
- Use transactions where multiple related DB writes are involved.
- **Transaction scope must be as narrow as possible** — never wrap an entire loop in one transaction; use per-iteration transactions instead.
- Always commit BEFORE triggering any external service call (webhooks, emails, third-party APIs) that depends on the committed data being visible.

---
### 9. Response Format (NEVER throw errors directly)
All responses MUST follow this consistent JSON structure using named helpers from `api/utils/response.js`:
**Error Response:**
```javascript
return BAD_REQUEST_RESPONSE(res, "VAL001", "Validation error details");
return NOT_FOUND_RESPONSE(res, "SUF001");
return SERVER_ERROR_RESPONSE(res, "ERR500", errorDetail);
```
**Success Response:**
```javascript
return OK_RESPONSE(res, "SUF005", data);
return CREATED_RESPONSE(res, "SUF002", { id: record.id });
```
- Response envelope always produces: `{ status, message, data, error }`.
- Use coded messages (e.g., "SUF001", "SUF005") instead of raw text strings.
- NEVER include `errorCode` key in any response payload (use only `status`, `message`, `data`, `error`).
- NEVER use `throw new Error()` inside controller handlers; always catch and return structured responses or pass to `asyncHandler`.

---
### 10. Environment & Configuration
- NEVER use `NODE_ENV` checks to control feature flags or third-party service behavior.
- Use **explicit env flags** for feature control (e.g., `ENABLE_RABBITMQ=Y`).
- This ensures staging environments running `NODE_ENV=production` can still enable test behaviors without affecting real production.

---
### 11. External Service Calls (Webhooks, Emails, Third-party APIs)
- **Emails** are always fire-and-forget — use `.catch(console.error)`, never `await` them inside a database transaction.
- **Webhook triggers or external API calls** must always happen AFTER `t.commit()` — never inside an open transaction.
- If an external call fails, it must NEVER roll back already-committed DB state.

---
### 12. Error Isolation in Loops
- If processing multiple records in a loop, each record MUST have its own try/catch.
- A failure in one record must NEVER abort processing of the remaining records.
- Always log the error and `continue` to the next iteration.

---
### 13. Execution Order (for every task)
1. Read and fully understand existing code
2. Identify all issues / integration points
3. Present analysis and fix/feature plan
4. JSDoc header
5. Joi validation (from separate file)
6. Edge case handling
7. DB operations (narrow transactions, commit before external calls)
8. External service calls (after commit, fire-and-forget for emails)
9. Return structured success/error response

---
### 14. Output Format
- Always output **complete working files** — never partial snippets or diffs only.
- Every fix or change MUST have an inline comment explaining:
  - WHAT was changed
  - WHY it was changed
  - What the original bug was (for debugging tasks)
- At the end of your response, provide a **fixes/changes summary table**:
| # | Issue | Root Cause | Fix Applied |
|---|-------|------------|-------------|
Follow this pattern for EVERY task — debugging, refactoring, or new feature — without exception.

---
### 15. Comment Requirements for Generated Code
Every generated code block or file MUST include inline comments following these rules:
- **Every function/method** — Add a comment explaining WHAT it does and WHY it exists.
- **Every non-trivial block** (loops, conditionals, callbacks, promise chains, logic sections/boundaries) — Replace with multi-line block comments:
  ```javascript
  /*
   * BLOCK/SECTION TITLE (e.g. USER ACCESS BOUNDARY)
   * Explanation of the logic, why it is needed, and what
   * side-effects or considerations apply.
   */
  ```
- **Every known limitation, TODO, or edge case not handled** — Mark with `// TODO`, `// HACK`, `// NOTE`, or `// FIXME`.
- **Every external API call** — Comment on expected input/output and error behavior.
- **Every raw SQL or complex query** — Comment on the expected dataset and any performance considerations.
- **Every magic value / hardcoded constant** — Comment on what it represents and why that specific value is used.
- **Every DB transaction** — Comment on why the transaction is needed and what side effects occur after commit.

---
### 16. Service Layer Architecture (Direct Arrow Functions)
- Services MUST be implemented using **direct arrow functions**, NEVER ES6 classes.
- Export functions via object literal:
  ```javascript
  const serviceMethodName = async (params) => {
    // business logic
  };

  module.exports = {
    serviceMethodName,
  };
  ```

---
### 17. Query Parameters for GET (Detail) & DELETE vs Body for UPDATE APIs
- For **GET** (detail / view single record) and **DELETE** APIs, ALWAYS use **query parameters** (`req.query`, e.g., `?id=...` or `req.query.id`) instead of path/route parameters (`req.params` / `/:id`). Route paths should NOT contain `/:id` placeholders.
- For **UPDATE** APIs (PUT, PATCH), whenever there is a need to identify the record and supply updated fields, **ALWAYS use `req.body` for both the `id` and payload fields**. Do NOT split between `req.query` and `req.body`.
- Joi validation schemas must validate `req.query` for GET/DELETE and `req.body` for UPDATE.

---
### 18. Modern Joi Conditional Validation (.when / .is / .then / .otherwise)
- In Joi validation schemas, NEVER use imperative custom helpers (`.custom((value, helpers) => ...)`) for field dependencies or cross-field validation.
- ALWAYS use modern declarative Joi conditional syntax:
  - `Joi.when('<fieldName>', { is: <condition>, then: <schema>, otherwise: <schema> })`
  - `Joi.ref('<otherField>')` (e.g. `end_date: Joi.string().min(Joi.ref('start_date'))`)
  - `Joi.forbidden()` for disallowed fields under specific conditions.

---
### 19. No Helpers, Utils, or Complex Query Builders Inside Controllers
- **NEVER** define helper functions, formatting utilities, calculations, raw SQL query constants, or inline custom logic inside controller files.
- Controllers MUST only orchestrate request handling: validate input, call dedicated helper/service functions, and return formatted responses.
- **ALWAYS** place reusable functions, transformers, data formatters, and domain helpers in dedicated files under `api/helpers/` or `api/utils/` and import them into the controller.

---
### 20. Minimal Response Payload for Create and Update APIs
- In **CREATE (POST)** and **UPDATE (PUT, PATCH)** API responses, **ONLY return minimal identifiers/fields** (e.g., `{ id: record.id }` or `{ id: record.id, status: record.status }`), NEVER the complete expanded entity details.
- The frontend will call the listing or detail `/view` endpoint directly to fetch full record information, making heavy SELECT joins in create/update responses redundant and slow.

---
### 21. Prefer Switch-Case Over Deep / Multiple If-Else Chains
- Whenever a function or logic block requires evaluating multiple distinct conditions (3 or more branches), **ALWAYS use `switch` (or `switch (true)`) statements** instead of deeply nested or lengthy `if-else` / `else-if` ladders.
- This ensures cleaner readability, predictable evaluation flow, and easier maintenance.
- Always include an explicit `default:` branch to handle fallbacks safely.
