# Project Documentation

## Prerequisites

Before you begin, ensure you have the following software installed on your system:

1. **Node.js**
2. **pnpm**
3. **Docker**
4. **Git**

## Getting Started

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/casantosmu/musicpoll
    cd musicpoll
    ```

2. **Install Dependencies:**

    ```bash
    pnpm install
    ```

3. **Set Up Environment Variables:**

    ```bash
    # In the root directory
    cp .env.example .env
    # In the backend directory
    cp apps/back/.env.example apps/back/.env
    ```

4. **Start the docker services:**

    ```bash
    docker compose up -d
    ```

5. **Run Database Migrations:**

    ```bash
    pnpm migrate:up
    ```

6. **Running the Application for Development:**

    ```bash
    pnpm dev
    ```

## Database Migrations

- `pnpm migrate:create <name>`: Creates new `_up.sql` and `_down.sql` migration files in the `migrations/` directory with a timestamp and the provided name (e.g., `pnpm migrate:create add_user_email`). You then edit these files with your SQL commands.

- `pnpm migrate:up`: Applies all pending migrations (runs the `_up.sql` scripts for migrations that haven't been run yet).

## 8. Linting and Formatting

This project uses tools to maintain code quality and consistency:

- **ESLint**
- **Prettier**
