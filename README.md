# Alexandria Library System — Sistema de Clubes de Leitura

Plataforma web para centralizar leitura digital, interação social e acompanhamento de progresso em clubes de leitura.

## Stack Tecnológica

| Camada     | Tecnologia                         |
| ---------- | ---------------------------------- |
| Frontend   | HTML5, CSS3, JavaScript (Vanilla)  |
| Backend    | Java 17 + Spring Boot 3.x         |
| Banco      | MySQL 8.x                          |
| Build      | Maven                              |
| Auth       | JWT + Spring Security              |

## Estrutura do Projeto

```
Alexandria-library-system/
├── leitura-backend/               # API REST (Spring Boot)
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/br/edu/clubeleitura/
│       │   │   ├── ClubeLeituraApplication.java
│       │   │   ├── config/           # SecurityConfig, CorsConfig (a criar)
│       │   │   ├── controller/       # Controllers REST (a criar)
│       │   │   ├── service/          # Lógica de negócio (a criar)
│       │   │   ├── repository/       # Interfaces JPA (a criar)
│       │   │   ├── model/           # Entidades JPA
│       │   │   │   ├── Usuario.java      ✓
│       │   │   │   ├── Livro.java        ✓
│       │   │   │   ├── Leitura.java      ✓
│       │   │   │   ├── Resenha.java      ✓
│       │   │   │   ├── Estatistica.java  ✓
│       │   │   │   └── (falta: GrupoLeitura, Reacao, Mensagem, MetaLeitura, Notificacao)
│       │   │   ├── dto/request/      # DTOs de entrada (a criar)
│       │   │   ├── dto/response/     # DTOs de saída (a criar)
│       │   │   ├── exception/        # Tratamento de erros (a criar)
│       │   │   └── security/
│       │   │       ├── JwtTokenProvider.java  ✓
│       │   │       ├── JwtAuthFilter.java     ✓
│       │   │       └── UserDetailsServiceImpl.java (a criar)
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── application-dev.properties
│       │       └── db/migration/
│       │           ├── V1__create_tables.sql  ✓
│       │           └── V2__seed_data.sql      ✓
│       └── test/                    # Testes unitários (a criar)
│
├── leitura-frontend/               # Interface web (a criar)
│   ├── index.html
│   ├── pages/                      # Páginas HTML
│   ├── assets/css/                 # Estilos
│   ├── assets/js/                  # Scripts
│   └── assets/img/                 # Imagens
│
├── plano de execucao .md           # Plano detalhado do projeto
└── README.md
```

## O que já está pronto (Sprint 1)

- [x] Projeto Spring Boot configurado (pom.xml, application.properties)
- [x] Migrations SQL (V1: tabelas, V2: seed data)
- [x] Entidades: Usuario, Livro, Leitura, Resenha, Estatistica
- [x] Segurança: JwtTokenProvider, JwtAuthFilter
- [x] Estrutura de diretórios organizada

## O que fazer agora

Com base no **plano de execução (Sprint 1)**, a prioridade é:

### Backend
1. **Criar entidades faltantes**: `GrupoLeitura`, `UsuarioGrupo`, `Reacao`, `Mensagem`, `MetaLeitura`, `Notificacao`
2. **Criar repositórios**: `UsuarioRepository`, `LivroRepository`, `LeituraRepository`, etc.
3. **Configurar segurança**: `SecurityConfig.java`, `UserDetailsServiceImpl.java`, `CorsConfig.java`
4. **Implementar autenticação**: `AuthController`, `AuthService`, DTOs de login/cadastro
5. **Criar exception handler**: `GlobalExceptionHandler` e exceções customizadas

### Frontend
6. **Páginas de autenticação**: `index.html` (login) e `cadastro.html`
7. **CSS base**: `reset.css`, `variables.css`, `global.css`
8. **JS de API**: `http.js` (wrapper fetch com JWT), `auth.api.js`
9. **Componentes**: `navbar.js`, `toast.js`

## Pré-requisitos

- Java 17+
- Maven 3.8+
- MySQL 8.x

## Execução

```bash
# Backend
cd leitura-backend
mvn spring-boot:run -Dspring.profiles.active=dev

# Frontend (servir arquivos estáticos)
cd leitura-frontend
python3 -m http.server 3000
```
