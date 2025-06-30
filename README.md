![ERP System Logo](./docs/images/MK-ERP.png)

# **ERP Backend System**

This repository hosts the backend for a flexible and robust Enterprise Resource Planning (ERP) system, designed to cater to diverse organizational structures and dynamic workflows through a multi-tenant architecture.

## **Table of Contents**

* [Requirements](#requirements)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Technologies](./docs/technologies.md)
* [Features](./docs/features.md)
* [Available Scripts](#available-scripts)
* [Documentation: How It Works](./docs/architectural-docs.md)

## **Requirements**

Ensure you have the following installed:

* **Node.js:** v22.16.0 (or compatible LTS version)
* **pnpm:** v10.12.4
* **Operating System:** Ubuntu 24.04.2 LTS (build environment) 
* **Database:** MySQL or PostgreSQL instance accessible from your development environment.

## **Installation**

1. **Clone the repository:** 
   git clone \<your-repo-url\>
   cd \<repo-name\>

2. **Install dependencies:**
   pnpm install

3. Create .env file:
   Copy the .env.example to .env in the project root and configure your environment variables.

## **Environment Variables**

The application relies on environment variables for configuration. Create a .env file in the project root based on the following structure.

**.env**

```
# Database Configuration  
DB_DBMS=mysql  
DB_HOST=localhost  
DB_PORT=3306  
DB_USERNAME=root  
DB_PASSWORD=''  
DB_DATABASE=erp-nest  
DB_SYNCHRONIZE=false

#DB_REGION #Only to be used in advanced case of aurora cloud setup  
#DB_SECRET_ARN #Only to be used in advanced case of aurora cloud setup  
#DB_RESOURCE_ARN #Only to be used in advanced case of aurora cloud setup

# JWT Configuration  
JWT_SECRET='GcpFfKWzIT/1xOdyM+lw67IDHZg0uCj6N/wataFB6xh1ydJlfe/+1543lStYZfU+hsbFQXKGq/QOTQ3s/urE4w=='  
JWT_EXPIRES_IN=3600

# Application Port  
PORT=3000

# CORS Allowed Origins (comma-separated URLs)  
ALLOWED_ORIGINS=http://localhost:3000
```

**Environment Variable Validation:**

The application enforces strict validation of these environment variables using [Zod](https://zod.dev/) during startup. If any required variable is missing or malformed according to the schema below, the application will not start.

* **DB\_DBMS**: (Required) Must be one of the supported database management systems (e.g., mysql, postgres, sqlite, mongodb, mssql, mariadb, cockroachdb, sap).  
* **DB\_HOST**: (Required) Database host string.  
* **DB\_PORT**: (Required) Database port number. Defaults to 3306\.  
* **DB\_USERNAME**: (Required) Database username string.  
* **DB\_PASSWORD**: (Optional) Database password string. Defaults to an empty string ''.  
* **DB\_DATABASE**: (Required) Database name string.  
* **DB\_SYNCHRONIZE**: (Required) Boolean (true or false) to indicate if database schema synchronization should run. Defaults to false.  
* **DB\_REGION**: (Optional) String, used in advanced Aurora cloud setups.  
* **DB\_SECRET\_ARN**: (Optional) String, used in advanced Aurora cloud setups.  
* **DB\_RESOURCE\_ARN**: (Optional) String, used in advanced Aurora cloud setups.  
* **JWT\_SECRET**: (Required) JWT secret string. Must be at least 32 characters long.
* **JWT\_EXPIRES\_IN**: (Required) JWT expiration time in seconds. Must be a positive number. Defaults to 3600\.
* **PORT**: (Required) Application port number. Defaults to 3000\.
* **ALLOWED\_ORIGINS**: (Required) A comma-separated string of allowed CORS origins. This string is transformed into an array of validated URLs. Defaults to http://localhost:3000.

## **Available Scripts**

In the project directory, you can run:
* `pnpm run build`: Compiles the TypeScript source code into JavaScript.
* `pnpm run format`: Formats TypeScript files using Prettier.
* `pnpm start`: Starts the application in production mode (node dist/main).
* `pnpm start:dev`: Starts the application in development mode with file watching and hot-reloading. 
* `pnpm start:debug`: Starts the application in development mode with debugging enabled and file watching. 
* `pnpm start:prod`: Starts the application in production mode directly from the compiled dist/main.js.
* `pnpm run lint`: Lints TypeScript files and attempts to fix issues.
* `pnpm test`: Runs unit tests. 
* `pnpm test:watch`: Runs unit tests in watch mode. 
* `pnpm test:cov`: Runs unit tests and generates a code coverage report.
* `pnpm test:debug`: Runs unit tests with debugger attached. 
* `pnpm test:e2e`: Runs end-to-end tests.
* `pnpm run migration:create -- -n <MigrationName>`: Creates a new TypeORM migration file.
* `pnpm run migration:run`: Runs all pending TypeORM migrations. 
* `pnpm run migration:revert`: Reverts the last executed TypeORM migration.
* `pnpm run migration:generate -- -n <MigrationName>`: Generates a new TypeORM migration based on schema changes.
