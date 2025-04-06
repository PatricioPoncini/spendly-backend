# `Spendly Backend`
A backend for a daily expense management system for users.

## `💻 Stack`
[![Stack](https://skillicons.dev/icons?i=ts,nodejs,bun,postgres,docker)](https://skillicons.dev)

## `🏁 Getting Started`

### 1. Clone the repository

```sh
git clone https://github.com/your-username/spendly-backend.git
cd spendly-backend
```

### 2. Install dependencies
```sh
bun install
```

### 3. Set up your environment variables
Create a `.env` file using the `.env.example` provided:
```sh
POSTGRES_URL=
PORT=
FRONTEND_ORIGIN=
```

## `🐳 Start the services`
Launch the PostgreSQL container:
```sh
docker compose up -d
```

## `🚀 Run the server`
Run the backend server:
```sh
bun run dev
```

## `🛠️ Tooling`
### Lint and fix issues
```sh
bun run lint:fix
```

### Format code with Prettier
```sh
bun run format
```

## `🗃️ Access the PostgreSQL database`
To connect to the database container:
```sh
docker exec -it postgres_db psql -U user -d spendly
```