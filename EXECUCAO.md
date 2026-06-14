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
docker run -d \
  --name clube-leitura-db \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=clube_leitura \
  -p 3306:3306 \
  mysql:8.0
```

Ou inicie o MySQL localmente e crie o database manualmente:
```sql
CREATE DATABASE clube_leitura CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend (Spring Boot)

```bash
cd leitura-backend
mvn clean package -DskipTests
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

## Opção 2 — Docker Compose (recomendado para demonstração)

```bash
# Constrói e sobe o backend + banco
docker-compose up -d --build

# Acompanhar logs
docker-compose logs -f
```

- API: `http://localhost:8080`
- O frontend precisa ser servido à parte (passo 3 da Opção 1)

> O docker-compose já contém o **backend** dentro do container, não apenas o MySQL.

---

## Credenciais de Teste

Após executar as migrations (Flyway executa automaticamente), use:

| Email | Senha | Perfil |
|---|---|---|
| `admin@clubeleitura.com` | `Senha@123` | admin |
| `isabel@email.com` | `Senha@123` | leitor |
| `caio@email.com` | `Senha@123` | leitor |
| `maycon@email.com` | `Senha@123` | leitor |
| `pedro@email.com` | `Senha@123` | autor |

---

## Verificando se está tudo funcionando

```bash
# Login (deve retornar um JWT)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clubeleitura.com","senha":"Senha@123"}'

# Listar livros (rota pública)
curl http://localhost:8080/api/livros

# Listar grupos (requer token — substitua <TOKEN>)
curl http://localhost:8080/api/grupos \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Estrutura de diretórios

```
Alexandria-library-system/
├── leitura-backend/          # API REST (Spring Boot 3.x + Java 17)
├── leitura-frontend/         # Interface web (HTML, CSS, JS vanilla)
├── docker-compose.yml        # Orquestração MySQL + Backend
├── EXECUCAO.md               # Este arquivo
└── README.md                 # Documentação geral do projeto
```

## Scripts úteis

```bash
# Executar apenas os testes do backend
cd leitura-backend && mvn test

# Compilar sem rodar testes
cd leitura-backend && mvn clean compile

# Parar containers Docker
docker-compose down

# Limpar banco e recomeçar
docker-compose down -v && docker-compose up -d
```
