# Alexandria Library System — Sistema de Clubes de Leitura

Plataforma web para centralizar leitura digital, interação social e acompanhamento de progresso em clubes de leitura. Usuários podem gerenciar bibliotecas pessoais, participar de grupos de leitura, registrar progresso, escrever resenhas, definir metas e interagir com outros leitores.

---

## Funcionalidades

- **Autenticação JWT** — Login e cadastro com tokens seguros
- **Biblioteca pessoal** — Catálogo de livros com busca, filtros e detalhes
- **Registro de leitura** — Marcação de páginas lidas, acompanhamento de progresso
- **Resenhas** — Avaliação e comentários sobre livros
- **Grupos de leitura** — Criação e participação em clubes com mensagens em tempo real
- **Metas de leitura** — Definição de metas (livros por mês, páginas por dia)
- **Notificações** — Alertas sobre convites, novas mensagens e metas
- **Estatísticas** — Dashboard com gráficos de desempenho de leitura
- **Avatar personalizável** — Customização de perfil com gerador de avatar

---

## Stack Tecnológica

| Camada     | Tecnologia                                    |
| ---------- | --------------------------------------------- |
| Frontend   | HTML5, CSS3, JavaScript Vanilla (SPA)         |
| Backend    | Java 17 + Spring Boot 3.2.5                   |
| Banco      | MySQL 8.0 com Flyway migrations               |
| Build      | Maven 3.8+                                    |
| Auth       | JWT (jjwt 0.11.5) + Spring Security           |
| Testes     | JUnit 5, Mockito, MockMvc, H2                 |
| Deploy     | Docker + Docker Compose                       |

---

## Estrutura do Projeto

```
Alexandria-library-system/
├── leitura-backend/                  # API REST (Spring Boot)
│   ├── Dockerfile
│   ├── pom.xml
│   ├── postman/                      # Coleção Postman para testes
│   └── src/
│       ├── main/
│       │   ├── java/br/edu/clubeleitura/
│       │   │   ├── ClubeLeituraApplication.java
│       │   │   ├── config/           # SecurityConfig, CorsConfig, JwtConfig
│       │   │   ├── controller/       # 10 controllers REST
│       │   │   ├── service/          # 10 services (lógica de negócio)
│       │   │   ├── repository/       # 11 interfaces JPA
│       │   │   ├── model/            # 12 entidades JPA
│       │   │   ├── dto/request/      # 7 DTOs de entrada
│       │   │   ├── dto/response/     # 10 DTOs de saída
│       │   │   ├── exception/        # Tratamento de erros
│       │   │   └── security/         # JwtTokenProvider, JwtAuthFilter, UserDetailsServiceImpl
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── application-dev.properties
│       │       ├── application-prod.properties
│       │       └── db/migration/
│       │           ├── V1__create_tables.sql
│       │           └── V2__seed_data.sql
│       └── test/                     # Testes unitários e de integração
│
├── leitura-frontend/                 # Interface web (Vanilla JS)
│   ├── index.html                    # Página de login
│   └── pages/                        # 8 páginas HTML
│       ├── cadastro.html
│       ├── dashboard.html
│       ├── biblioteca.html
│       ├── livro-detalhes.html
│       ├── metas.html
│       ├── grupos.html
│       ├── grupo-detalhes.html
│       └── perfil.html
│
├── docker/
│   └── mysql/conf.d/charset.cnf
├── docker-compose.yml                # Orquestração MySQL + Backend
├── EXECUCAO.md                       # Instruções detalhadas de execução
└── README.md
```

---

## Como Executar

### Opção 1 — Docker Compose (recomendado)

```bash
docker compose up -d --build
```

- API: `http://localhost:8080`
- Frontend: servido à parte (veja abaixo)

### Opção 2 — Manual

```bash
# 1. Inicie o MySQL (Docker ou local)
docker run -d --name clube-leitura-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=clube_leitura -p 3306:3306 mysql:8.0

# 2. Backend
cd leitura-backend
mvn clean package -DskipTests
mvn spring-boot:run -Dspring.profiles.active=dev

# 3. Frontend (em outro terminal)
cd leitura-frontend
python3 -m http.server 3000
```

Acesse o frontend em `http://localhost:3000`.

---

## Credenciais de Teste

| Email | Senha | Perfil |
|---|---|---|
| `admin@clubeleitura.com` | `Senha@123` | admin |
| `isabel@email.com` | `Senha@123` | leitor |
| `caio@email.com` | `Senha@123` | leitor |
| `maycon@email.com` | `Senha@123` | leitor |
| `pedro@email.com` | `Senha@123` | autor |

---

## API Endpoints

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Login (retorna JWT) |
| POST | `/api/auth/cadastro` | Cadastro de usuário |

### Livros
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/livros` | Listar todos |
| GET | `/api/livros/{id}` | Detalhes do livro |
| POST | `/api/livros` | Criar livro (admin) |
| PUT | `/api/livros/{id}` | Atualizar livro (admin) |
| DELETE | `/api/livros/{id}` | Remover livro (admin) |

### Leituras
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/leituras/usuario/{id}` | Leituras do usuário |
| POST | `/api/leituras` | Registrar leitura |
| PUT | `/api/leituras/{id}` | Atualizar progresso |

### Grupos de Leitura
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/grupos` | Listar grupos |
| POST | `/api/grupos` | Criar grupo |
| POST | `/api/grupos/{id}/membros` | Entrar em grupo |
| GET | `/api/grupos/{id}/membros` | Listar membros |
| DELETE | `/api/grupos/{id}/membros/{usuarioId}` | Remover membro |

### Mensagens
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/grupos/{id}/mensagens` | Listar mensagens |
| POST | `/api/grupos/{id}/mensagens` | Enviar mensagem |

### Resenhas
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/resenhas/livro/{livroId}` | Resenhas de um livro |
| POST | `/api/resenhas` | Criar resenha |
| DELETE | `/api/resenhas/{id}` | Remover resenha |

### Metas
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/metas/usuario/{id}` | Metas do usuário |
| POST | `/api/metas` | Criar meta |
| PUT | `/api/metas/{id}` | Atualizar meta |

### Notificações
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/notificacoes/usuario/{id}` | Listar notificações |
| PUT | `/api/notificacoes/{id}/ler` | Marcar como lida |

### Estatísticas
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/estatisticas/usuario/{id}` | Estatísticas do usuário |

### Usuários
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/usuarios/{id}` | Perfil do usuário |
| PUT | `/api/usuarios/{id}` | Atualizar perfil |

---

## Testes

```bash
cd leitura-backend
mvn test
```

O projeto conta com **25 testes** distribuídos entre controllers e services, utilizando JUnit 5, Mockito e MockMvc com banco H2 em memória.

---

## Scripts Úteis

```bash
# Compilar sem testes
cd leitura-backend && mvn clean compile

# Executar apenas os testes
cd leitura-backend && mvn test

# Parar containers
docker compose down

# Limpar banco e recomeçar
docker compose down -v && docker compose up -d

# Verificar logs do backend
docker compose logs -f backend
```
