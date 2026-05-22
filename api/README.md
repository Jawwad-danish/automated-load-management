# Bobtail Load Management API - README

## Overview

Welcome to the Load Management API! This API is designed to manage loads. This document will guide you through setting up the API for local development.

## Prerequisites

Before setting up the API locally, ensure you have the following installed:

- **[nvm](https://github.com/nvm-sh/nvm)**: Node Version Manager (for managing Node.js versions).
- **[PostgreSQL](https://www.postgresql.org/)**: Ensure you have a local PostgreSQL instance running.

## Setup Instructions

Follow these steps to set up the Load Management API for local development.

### 1. Set Up Node.js Version

Use the Node.js version specified in the `.nvmrc` file:

```bash
nvm use
```

If you do not have the required version installed, run:

```bash
nvm install
```

### 2. Install Dependencies

Install all necessary dependencies using npm:

```bash
npm install
```

### 3. Configure the Database

Ensure your PostgreSQL database is up and running. The database connection details are stored in a JSON file located at `/envs/secrets/local/db-secret-arn.json`. 

Here's the format of the `db-secret-arn.json` file:

```json
{
    "password": "postgres",
    "dbname": "bobtail-lm",
    "port": 5432,
    "host": "localhost",
    "username": "postgres"
}
```

Ensure that these details are correct and match your local PostgreSQL setup.

### 4. Run Database Migrations

Before starting the API, apply all pending migrations to set up your local database schema:

```bash
npm run migration:run:local
```

This will ensure your database is correctly configured for use with the API.

### 5. Start the API Locally

Start the API in local development mode:

```bash
npm run start:local
```

This command will start the API using the local environment settings.

### 6. Access the API

Once the API is running, it should be accessible at:

```
http://localhost:3000
```

## Additional Scripts

- **npm run db:connect:dev**: Connect to the Development/QA environment through a tunnel
- **npm run db:connect:prod**: Connect to the Production environment through a tunnel
- **npm run migration:create**: Create a migration with current schema diff
  