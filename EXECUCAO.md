# Como Executar o Alexandria Library System

## Pré-requisitos

- Java 17+
- Maven 3.8+
- MySQL 8.x (ou Docker)
- Python 3 (para servir o frontend)

---

## Opção 1 — Manual (recomendado para desenvolvimento)

### 1. Banco de Dados

```bash
# Com Docker (apenas o MySQL):
docker run -d \
  --name clube-leitura-db \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=clube_leitura \
  -p 3306:3306 \
  mysql:8.0
```

Ou inicie o MySQL localmente e crie o database:

```sql
CREATE DATABASE clube_leitura;
```

### 2. Backend (Spring Boot)

```bash
cd leitura-backend
mvn spring-boot:run -Dspring.profiles.active=dev
```

A API estará em `http://localhost:8080`.

### 3. Frontend

```bash
cd leitura-frontend
python3 -m http.server 3000
```

O frontend estará em `http://localhost:3000`.

---

## Opção 2 — Docker Compose (tudo de uma vez)

```bash
# Sobe MySQL + Backend
docker-compose up -d

# Acompanhar logs
docker-compose logs -f
```

- API: `http://localhost:8080`
- Frontend: sirva manualmente com `python3 -m http.server 3000` em `leitura-frontend/`

> O frontend **não** está no docker-compose. Para servir junto, abra outro terminal e rode o passo 3 da Opção 1.

---

## Credenciais de Teste

Após executar as migrations (V2__seed_data.sql), use:

- **Email:** `admin@clubeleitura.com`
- **Senha:** `admin123`

---

## Verificando se está tudo funcionando

```bash
# Health check da API
curl http://localhost:8080/actuator/health

# Ou tente fazer login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clubeleitura.com","senha":"admin123"}'
```
