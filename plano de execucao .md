# Plano de Execução — Sistema de Clubes de Leitura

---

## Sumário

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Estrutura de Pastas e Módulos](#3-estrutura-de-pastas-e-módulos)
4. [Modelagem do Banco de Dados](#4-modelagem-do-banco-de-dados)
5. [Plano de Releases e Sprints](#5-plano-de-releases-e-sprints)
6. [Detalhamento das Sprints](#6-detalhamento-das-sprints)
7. [Padrões e Convenções](#7-padrões-e-convenções)
8. [Estratégia de Testes](#8-estratégia-de-testes)
9. [Gestão de Riscos](#9-gestão-de-riscos)
10. [Critérios de Aceite por Release](#10-critérios-de-aceite-por-release)
11. [Checklist de Entrega Final](#11-checklist-de-entrega-final)

---

## 1. Visão Geral do Projeto

### 1.1 Resumo Executivo

O **Sistema de Clubes de Leitura** é uma plataforma web/mobile que centraliza leitura digital, interação social e acompanhamento de progresso em um único ambiente. O sistema resolve a fragmentação atual de ferramentas, oferecendo grupos de leitura, metas, gamificação e compartilhamento de resenhas.

### 1.2 Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) | Acessibilidade ampla, sem dependência de framework |
| Backend | Java 17 + Spring Boot 3.x | Robusto, maduro, amplo suporte a APIs REST |
| Banco de Dados | MySQL 8.x | Relacional, integração nativa com Spring Data JPA |
| Versionamento | Git + GitHub | Controle de versão e colaboração entre a equipe |
| IDE | Visual Studio Code | Leve, extensível, familiar à equipe |
| Testes de API | Postman | Validação de endpoints REST |
| Build | Maven | Gerenciamento de dependências Java |

### 1.3 Equipe e Papéis

| Membro | Papel Principal | Responsabilidades |
|---|---|---|
| Isabel Freire | Analista de Requisitos / Dev Backend | UC-1, UC-2, autenticação, segurança |
| Caio Soares | Dev Backend / Modelagem | UC-3, UC-4, grupos de leitura, relacionamentos DB |
| Maycon Maia | Dev Frontend / Dev Backend | UC-5, UC-6, progresso de leitura, resenhas |
| Pedro Sousa | Dev Backend / Arquitetura | UC-7, UC-8, metas, biblioteca, estrutura geral |

> Todos os membros atuarão em múltiplas funções conforme a necessidade de cada sprint.

---

## 2. Arquitetura do Sistema

### 2.1 Visão Arquitetural

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTE                             │
│         (Navegador Web / Dispositivo Mobile)            │
│              HTML + CSS + JavaScript                    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST (JSON)
┌──────────────────────▼──────────────────────────────────┐
│                  BACKEND (API REST)                     │
│              Java 17 + Spring Boot 3.x                  │
│                                                         │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │ Controller │  │  Service   │  │   Repository     │  │
│  │  (REST)    │→ │ (Negócio)  │→ │  (Spring Data    │  │
│  │            │  │            │  │     JPA)         │  │
│  └────────────┘  └────────────┘  └──────────────────┘  │
│                                                         │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │   Auth /   │  │   DTOs /   │  │    Exception     │  │
│  │ JWT Filter │  │  Mappers   │  │    Handler       │  │
│  └────────────┘  └────────────┘  └──────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ JDBC / JPA
┌──────────────────────▼──────────────────────────────────┐
│                   BANCO DE DADOS                        │
│                    MySQL 8.x                            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Padrão Arquitetural

Adotar **Arquitetura em Camadas (Layered Architecture)** com separação clara de responsabilidades:

- **Controller Layer** — Recebe requisições HTTP, delega ao Service, retorna resposta JSON.
- **Service Layer** — Contém toda a lógica de negócio. Não acessa o banco diretamente.
- **Repository Layer** — Interfaces Spring Data JPA. Apenas operações de persistência.
- **Model/Entity Layer** — Classes JPA mapeadas para as tabelas do MySQL.
- **DTO Layer** — Objetos de transferência para entrada (Request) e saída (Response) das APIs.

### 2.3 Segurança

- Autenticação via **JWT (JSON Web Token)** com Spring Security.
- Senhas armazenadas com hash **BCrypt**.
- Comunicação via **HTTPS** em produção.
- Validação de entrada em todas as requisições com Bean Validation (`@Valid`).

---

## 3. Estrutura de Pastas e Módulos

### 3.1 Backend (Spring Boot)

```
leitura-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── br/edu/clubeleitura/
│   │   │       ├── ClubeLeituraApplication.java
│   │   │       │
│   │   │       ├── config/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   ├── JwtConfig.java
│   │   │       │   └── CorsConfig.java
│   │   │       │
│   │   │       ├── controller/
│   │   │       │   ├── UsuarioController.java
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── LivroController.java
│   │   │       │   ├── LeituraController.java
│   │   │       │   ├── GrupoLeituraController.java
│   │   │       │   ├── ResenhaController.java
│   │   │       │   ├── MetaLeituraController.java
│   │   │       │   ├── NotificacaoController.java
│   │   │       │   └── EstatisticaController.java
│   │   │       │
│   │   │       ├── service/
│   │   │       │   ├── UsuarioService.java
│   │   │       │   ├── AuthService.java
│   │   │       │   ├── LivroService.java
│   │   │       │   ├── LeituraService.java
│   │   │       │   ├── GrupoLeituraService.java
│   │   │       │   ├── ResenhaService.java
│   │   │       │   ├── MetaLeituraService.java
│   │   │       │   ├── NotificacaoService.java
│   │   │       │   └── EstatisticaService.java
│   │   │       │
│   │   │       ├── repository/
│   │   │       │   ├── UsuarioRepository.java
│   │   │       │   ├── LivroRepository.java
│   │   │       │   ├── LeituraRepository.java
│   │   │       │   ├── GrupoLeituraRepository.java
│   │   │       │   ├── UsuarioGrupoRepository.java
│   │   │       │   ├── ResenhaRepository.java
│   │   │       │   ├── ReacaoRepository.java
│   │   │       │   ├── MensagemRepository.java
│   │   │       │   ├── MetaLeituraRepository.java
│   │   │       │   ├── NotificacaoRepository.java
│   │   │       │   └── EstatisticaRepository.java
│   │   │       │
│   │   │       ├── model/
│   │   │       │   ├── Usuario.java
│   │   │       │   ├── Livro.java
│   │   │       │   ├── Leitura.java
│   │   │       │   ├── GrupoLeitura.java
│   │   │       │   ├── UsuarioGrupo.java
│   │   │       │   ├── Resenha.java
│   │   │       │   ├── Reacao.java
│   │   │       │   ├── Mensagem.java
│   │   │       │   ├── MetaLeitura.java
│   │   │       │   ├── Notificacao.java
│   │   │       │   └── Estatistica.java
│   │   │       │
│   │   │       ├── dto/
│   │   │       │   ├── request/
│   │   │       │   │   ├── UsuarioRequestDTO.java
│   │   │       │   │   ├── LoginRequestDTO.java
│   │   │       │   │   ├── LivroRequestDTO.java
│   │   │       │   │   ├── LeituraRequestDTO.java
│   │   │       │   │   ├── GrupoRequestDTO.java
│   │   │       │   │   ├── ResenhaRequestDTO.java
│   │   │       │   │   └── MetaRequestDTO.java
│   │   │       │   └── response/
│   │   │       │       ├── UsuarioResponseDTO.java
│   │   │       │       ├── TokenResponseDTO.java
│   │   │       │       ├── LivroResponseDTO.java
│   │   │       │       ├── LeituraResponseDTO.java
│   │   │       │       ├── GrupoResponseDTO.java
│   │   │       │       ├── ResenhaResponseDTO.java
│   │   │       │       └── MetaResponseDTO.java
│   │   │       │
│   │   │       ├── exception/
│   │   │       │   ├── GlobalExceptionHandler.java
│   │   │       │   ├── ResourceNotFoundException.java
│   │   │       │   ├── EmailJaCadastradoException.java
│   │   │       │   └── AcessoNegadoException.java
│   │   │       │
│   │   │       └── security/
│   │   │           ├── JwtTokenProvider.java
│   │   │           ├── JwtAuthFilter.java
│   │   │           └── UserDetailsServiceImpl.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       └── db/
│   │           └── migration/
│   │               ├── V1__create_tables.sql
│   │               └── V2__seed_data.sql
│   │
│   └── test/
│       └── java/br/edu/clubeleitura/
│           ├── service/
│           │   ├── UsuarioServiceTest.java
│           │   ├── LeituraServiceTest.java
│           │   └── MetaLeituraServiceTest.java
│           └── controller/
│               ├── AuthControllerTest.java
│               └── LivroControllerTest.java
│
├── pom.xml
└── README.md
```

### 3.2 Frontend

```
leitura-frontend/
├── index.html                    ← Página inicial / Login
├── assets/
│   ├── css/
│   │   ├── reset.css
│   │   ├── variables.css         ← Variáveis de cor, fonte e espaçamento
│   │   ├── global.css
│   │   ├── components/
│   │   │   ├── navbar.css
│   │   │   ├── card.css
│   │   │   ├── modal.css
│   │   │   ├── form.css
│   │   │   └── toast.css
│   │   └── pages/
│   │       ├── auth.css
│   │       ├── dashboard.css
│   │       ├── biblioteca.css
│   │       ├── grupos.css
│   │       ├── perfil.css
│   │       └── metas.css
│   ├── js/
│   │   ├── api/
│   │   │   ├── http.js           ← Wrapper fetch com interceptor JWT
│   │   │   ├── auth.api.js
│   │   │   ├── livros.api.js
│   │   │   ├── grupos.api.js
│   │   │   ├── leitura.api.js
│   │   │   └── metas.api.js
│   │   ├── components/
│   │   │   ├── navbar.js
│   │   │   ├── modal.js
│   │   │   └── toast.js
│   │   ├── pages/
│   │   │   ├── login.js
│   │   │   ├── cadastro.js
│   │   │   ├── dashboard.js
│   │   │   ├── biblioteca.js
│   │   │   ├── grupos.js
│   │   │   ├── perfil.js
│   │   │   └── metas.js
│   │   └── utils/
│   │       ├── auth.utils.js     ← Armazenar/recuperar JWT no localStorage
│   │       └── format.utils.js
│   └── img/
│       ├── logo.svg
│       └── placeholder-book.png
├── pages/
│   ├── dashboard.html
│   ├── biblioteca.html
│   ├── grupos.html
│   ├── grupo-detalhes.html
│   ├── perfil.html
│   ├── livro-detalhes.html
│   └── metas.html
└── README.md
```

---

## 4. Modelagem do Banco de Dados

### 4.1 Script de Criação das Tabelas (V1__create_tables.sql)

```sql
-- Tabela: usuario
CREATE TABLE usuario (
    id_usuario   INT PRIMARY KEY AUTO_INCREMENT,
    nome         VARCHAR(100) NOT NULL,
    email        VARCHAR(150) NOT NULL UNIQUE,
    senha        VARCHAR(255) NOT NULL,
    foto_perfil  VARCHAR(255),
    tipo_perfil  VARCHAR(50) DEFAULT 'leitor',
    data_cadastro DATE NOT NULL DEFAULT (CURRENT_DATE)
);

-- Tabela: livro
CREATE TABLE livro (
    id_livro         INT PRIMARY KEY AUTO_INCREMENT,
    titulo           VARCHAR(200) NOT NULL,
    autor            VARCHAR(150) NOT NULL,
    genero           VARCHAR(100),
    descricao        TEXT,
    tipo             VARCHAR(50),
    data_publicacao  DATE
);

-- Tabela: leitura
CREATE TABLE leitura (
    id_leitura   INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario   INT NOT NULL,
    id_livro     INT NOT NULL,
    status       VARCHAR(30) NOT NULL,  -- 'lendo', 'lido', 'quero_ler'
    data_inicio  DATE,
    data_fim     DATE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_livro)   REFERENCES livro(id_livro)
);

-- Tabela: resenha
CREATE TABLE resenha (
    id_resenha   INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario   INT NOT NULL,
    id_livro     INT NOT NULL,
    texto        TEXT NOT NULL,
    nota         FLOAT,
    data         DATE NOT NULL DEFAULT (CURRENT_DATE),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_livro)   REFERENCES livro(id_livro)
);

-- Tabela: reacao
CREATE TABLE reacao (
    id_reacao    INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario   INT NOT NULL,
    id_resenha   INT NOT NULL,
    tipo         VARCHAR(30) NOT NULL,
    data         DATE NOT NULL DEFAULT (CURRENT_DATE),
    FOREIGN KEY (id_usuario)  REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_resenha)  REFERENCES resenha(id_resenha)
);

-- Tabela: grupo_leitura
CREATE TABLE grupo_leitura (
    id_grupo      INT PRIMARY KEY AUTO_INCREMENT,
    nome          VARCHAR(150) NOT NULL,
    descricao     VARCHAR(500),
    data_criacao  DATE NOT NULL DEFAULT (CURRENT_DATE),
    id_usuario    INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabela: usuario_grupo (N:N)
CREATE TABLE usuario_grupo (
    id_usuario         INT NOT NULL,
    id_grupo           INT NOT NULL,
    id_grupo_leitura   INT NOT NULL,
    PRIMARY KEY (id_usuario, id_grupo),
    FOREIGN KEY (id_usuario)       REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_grupo_leitura) REFERENCES grupo_leitura(id_grupo)
);

-- Tabela: mensagem
CREATE TABLE mensagem (
    id_mensagem       INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario        INT NOT NULL,
    id_grupo          INT NOT NULL,
    id_grupo_leitura  INT NOT NULL,
    conteudo          VARCHAR(1000) NOT NULL,
    data_envio        DATE NOT NULL DEFAULT (CURRENT_DATE),
    FOREIGN KEY (id_usuario)       REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_grupo_leitura) REFERENCES grupo_leitura(id_grupo)
);

-- Tabela: meta_leitura
CREATE TABLE meta_leitura (
    id_meta              INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario           INT NOT NULL,
    quantidade_livros    INT NOT NULL,
    prazo                DATETIME NOT NULL,
    progresso            INT DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabela: notificacao
CREATE TABLE notificacao (
    id_notificacao  INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario      INT NOT NULL,
    mensagem        VARCHAR(500) NOT NULL,
    data            DATE NOT NULL DEFAULT (CURRENT_DATE),
    lida            BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabela: estatistica
CREATE TABLE estatistica (
    id_estatistica     INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario         INT NOT NULL UNIQUE,
    livros_lidos       INT DEFAULT 0,
    livros_em_leitura  INT DEFAULT 0,
    livros_desejados   INT DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
```

### 4.2 Endpoints REST Principais

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/auth/cadastro` | Cadastrar novo usuário |
| POST | `/api/auth/login` | Autenticar e obter JWT |
| GET | `/api/usuarios/{id}` | Buscar perfil do usuário |
| PUT | `/api/usuarios/{id}` | Atualizar perfil |
| GET | `/api/livros` | Listar livros (com filtros) |
| GET | `/api/livros/{id}` | Detalhe de um livro |
| POST | `/api/livros` | Cadastrar livro (admin) |
| GET | `/api/leituras/usuario/{id}` | Leituras do usuário |
| POST | `/api/leituras` | Registrar leitura |
| PUT | `/api/leituras/{id}` | Atualizar progresso |
| GET | `/api/grupos` | Listar grupos |
| POST | `/api/grupos` | Criar grupo |
| POST | `/api/grupos/{id}/entrar` | Participar de grupo |
| GET | `/api/grupos/{id}/mensagens` | Mensagens do grupo |
| POST | `/api/grupos/{id}/mensagens` | Enviar mensagem |
| GET | `/api/resenhas/livro/{id}` | Resenhas de um livro |
| POST | `/api/resenhas` | Publicar resenha |
| PUT | `/api/resenhas/{id}` | Editar resenha |
| DELETE | `/api/resenhas/{id}` | Excluir resenha |
| GET | `/api/metas/usuario/{id}` | Metas do usuário |
| POST | `/api/metas` | Criar meta |
| GET | `/api/estatisticas/usuario/{id}` | Estatísticas do usuário |
| GET | `/api/notificacoes/usuario/{id}` | Notificações |
| PUT | `/api/notificacoes/{id}/lida` | Marcar como lida |

---

## 5. Plano de Releases e Sprints

### 5.1 Cronograma Macro

```
RELEASE 1 — MVP Core (Semanas 1–6)
├── Sprint 1 (Sem 1–2): Setup + Autenticação
├── Sprint 2 (Sem 3–4): Biblioteca + Leitura
└── Sprint 3 (Sem 5–6): Grupos + Resenhas

RELEASE 2 — Engajamento (Semanas 7–10)
├── Sprint 4 (Sem 7–8): Metas + Estatísticas
└── Sprint 5 (Sem 9–10): Chat + Gamificação básica

RELEASE 3 — Expansão (Semanas 11–13)
├── Sprint 6 (Sem 11–12): Recomendações + Notificações avançadas
└── Sprint 7 (Sem 13): Testes finais + Deploy + Documentação
```

### 5.2 Mapeamento de Requisitos por Release

| RF | Requisito | Release |
|---|---|---|
| RF01 | Cadastro e login | R1 |
| RF03 | Grupos de leitura | R1 |
| RF04 | Compartilhamento e resenhas | R1 |
| RF08 | Lista de desejos | R1 |
| RF10 | Interações sociais | R1 |
| RF02 | Personalização de perfil | R2 |
| RF05 | Estatísticas de leitura | R2 |
| RF06 | Metas de leitura | R2 |
| RF11 | Chat em grupo | R2 |
| RF13 | Gamificação (pontos) | R2 |
| RF12 | Notificações | R3 |
| RF07 | Recomendações | R3 |
| RF16 | Tipos de perfil | R3 |
| RF17 | Tipos de conteúdo | R3 |
| RF14 | Releitura | Backlog |
| RF15 | Audiobook | Backlog |
| RF18 | Offline parcial | Backlog |
| RF19 | Reação a trechos | Backlog |
| RF20 | Stories | Backlog |

---

## 6. Detalhamento das Sprints

### Sprint 1 — Setup e Autenticação (Semanas 1–2)

**Objetivo:** Ambiente configurado e fluxo de autenticação funcional.

| Tarefa | Responsável | Estimativa |
|---|---|---|
| Criar repositório GitHub com branches `main`, `dev`, `feature/*` | Todos | 0,5 dia |
| Configurar projeto Spring Boot (pom.xml, application.properties) | Pedro | 0,5 dia |
| Criar estrutura de pastas do backend | Pedro | 0,5 dia |
| Implementar entidade `Usuario` + migrations SQL | Isabel | 1 dia |
| Implementar `AuthController` (cadastro/login) | Isabel | 1,5 dias |
| Configurar Spring Security + JWT | Isabel | 1,5 dias |
| Criar estrutura de pastas do frontend | Maycon | 0,5 dia |
| Criar telas: `index.html` (login) e `cadastro.html` | Maycon | 1 dia |
| Integrar frontend com endpoint de autenticação | Maycon | 1 dia |
| Testes manuais no Postman (UC-1, UC-2) | Caio | 0,5 dia |

**Entregável:** Usuário consegue cadastrar conta e fazer login com retorno de JWT.

---

### Sprint 2 — Biblioteca e Progresso de Leitura (Semanas 3–4)

**Objetivo:** Usuário acessa livros e registra seu progresso de leitura.

| Tarefa | Responsável | Estimativa |
|---|---|---|
| Implementar entidade `Livro` + migration | Caio | 0,5 dia |
| Implementar `LivroController` (CRUD básico + busca) | Pedro | 1 dia |
| Implementar entidade `Leitura` | Caio | 0,5 dia |
| Implementar `LeituraController` (registrar, atualizar progresso) | Maycon | 1 dia |
| Criar tela `biblioteca.html` com listagem e filtros | Maycon | 1 dia |
| Criar tela `livro-detalhes.html` | Maycon | 1 dia |
| Implementar `EstatisticaService` (atualizar contadores automaticamente) | Pedro | 0,5 dia |
| Integrar frontend com endpoints de leitura e biblioteca | Maycon | 1 dia |
| Testes manuais (UC-5, UC-8) | Isabel | 0,5 dia |

**Entregável:** Usuário pesquisa livros, adiciona à sua lista e atualiza progresso.

---

### Sprint 3 — Grupos de Leitura e Resenhas (Semanas 5–6)

**Objetivo:** Usuário cria grupos, participa e publica resenhas.

| Tarefa | Responsável | Estimativa |
|---|---|---|
| Implementar entidades `GrupoLeitura`, `UsuarioGrupo` | Caio | 1 dia |
| Implementar `GrupoLeituraController` (criar, listar, entrar) | Caio | 1,5 dias |
| Implementar entidade `Resenha` + `Reacao` | Isabel | 0,5 dia |
| Implementar `ResenhaController` (publicar, editar, excluir) | Isabel | 1 dia |
| Criar tela `grupos.html` e `grupo-detalhes.html` | Maycon | 1,5 dias |
| Integrar área de resenhas nos detalhes do livro (frontend) | Maycon | 0,5 dia |
| Implementar `NotificacaoService` básico (entrada em grupo, nova resenha) | Pedro | 0,5 dia |
| Testes manuais (UC-3, UC-4, UC-6) | Todos | 0,5 dia |
| **Review de Release 1** | Todos | 0,5 dia |

**Entregável:** Release 1 completo — MVP com autenticação, biblioteca, leitura, grupos e resenhas.

---

### Sprint 4 — Metas e Estatísticas (Semanas 7–8)

**Objetivo:** Usuário define metas e visualiza seu desempenho de leitura.

| Tarefa | Responsável | Estimativa |
|---|---|---|
| Implementar entidade `MetaLeitura` | Pedro | 0,5 dia |
| Implementar `MetaLeituraController` e `MetaLeituraService` | Pedro | 1 dia |
| Atualizar `LeituraService` para incrementar progresso da meta automaticamente | Maycon | 1 dia |
| Criar tela `metas.html` com progresso visual | Maycon | 1 dia |
| Implementar `EstatisticaController` com dashboard de leitura | Pedro | 1 dia |
| Criar tela `perfil.html` com estatísticas e histórico | Maycon | 1 dia |
| Implementar edição de perfil (foto, preferências) | Isabel | 0,5 dia |
| Testes manuais (UC-7) | Caio | 0,5 dia |

**Entregável:** Usuário gerencia metas e visualiza estatísticas no perfil.

---

### Sprint 5 — Chat e Gamificação (Semanas 9–10)

**Objetivo:** Grupos com chat e sistema básico de pontos.

| Tarefa | Responsável | Estimativa |
|---|---|---|
| Implementar entidade `Mensagem` | Caio | 0,5 dia |
| Implementar `MensagemController` (enviar, listar por grupo) | Caio | 1 dia |
| Integrar chat no frontend (`grupo-detalhes.html`) com polling | Maycon | 1,5 dias |
| Implementar sistema de pontos básico (ação → pontos no perfil) | Pedro | 1 dia |
| Exibir pontos e nível no perfil do usuário | Maycon | 0,5 dia |
| Implementar notificações (listar, marcar lida) | Isabel | 0,5 dia |
| Testes manuais + ajustes de Release 2 | Todos | 0,5 dia |
| **Review de Release 2** | Todos | 0,5 dia |

**Entregável:** Release 2 completo — metas, estatísticas, chat em grupo, pontuação básica.

---

### Sprint 6 — Recomendações e Notificações Avançadas (Semanas 11–12)

**Objetivo:** Sugestões personalizadas e controle de notificações.

| Tarefa | Responsável | Estimativa |
|---|---|---|
| Implementar `RecomendacaoService` (baseado em gênero favorito do histórico) | Pedro | 1,5 dias |
| Exibir recomendações na tela inicial do dashboard | Maycon | 1 dia |
| Implementar preferências de notificação no perfil | Isabel | 0,5 dia |
| Diferenciar tipos de perfil (leitor, autor) | Isabel | 0,5 dia |
| Ajustes de UX e responsividade mobile | Maycon | 1 dia |
| Revisão geral de segurança (validações, tokens expirados) | Isabel | 0,5 dia |

---

### Sprint 7 — Testes, Documentação e Deploy (Semana 13)

**Objetivo:** Sistema estável, documentado e pronto para apresentação.

| Tarefa | Responsável | Estimativa |
|---|---|---|
| Escrever testes unitários (Services) | Pedro + Isabel | 1 dia |
| Testes de integração (Controllers) | Caio | 0,5 dia |
| Testes de aceitação baseados nos critérios dos RFs | Todos | 0,5 dia |
| Escrever README com instruções de setup e execução | Pedro | 0,5 dia |
| Documentar endpoints no Postman (Collection exportada) | Caio | 0,5 dia |
| Preparar ambiente de apresentação | Todos | 0,5 dia |
| **Review e Retrospectiva Final** | Todos | 0,5 dia |

---

## 7. Padrões e Convenções

### 7.1 Git Flow

```
main         ← Código estável/produção. Merge apenas via PR aprovado.
dev          ← Integração das features. Base para PRs.
feature/*    ← Uma branch por funcionalidade (ex: feature/auth-jwt)
fix/*        ← Correções de bugs (ex: fix/login-erro-500)
```

**Regras:**
- Nenhum commit direto em `main`.
- Todo PR deve ter ao menos 1 aprovação antes do merge em `dev`.
- Mensagens de commit no formato: `tipo(escopo): descrição` (ex: `feat(auth): adicionar geração de JWT`).

### 7.2 Nomenclatura

| Artefato | Padrão |
|---|---|
| Classes Java | PascalCase (`UsuarioService`) |
| Métodos/variáveis Java | camelCase (`buscarPorEmail`) |
| Tabelas SQL | snake_case (`grupo_leitura`) |
| Colunas SQL | snake_case (`data_cadastro`) |
| Endpoints REST | kebab-case plural (`/api/grupos-leitura`) |
| Arquivos JS/CSS | kebab-case (`auth.utils.js`) |
| IDs HTML | kebab-case (`btn-entrar`) |

### 7.3 Respostas da API

Todas as respostas seguirão o envelope padrão:

```json
// Sucesso
{
  "status": "success",
  "data": { ... }
}

// Erro
{
  "status": "error",
  "message": "Descrição do erro",
  "code": 400
}
```

---

## 8. Estratégia de Testes

### 8.1 Pirâmide de Testes

```
          /\
         /  \      ← Testes E2E (manuais no Postman)
        /----\
       /      \    ← Testes de Integração (Controller + DB em memória H2)
      /--------\
     /          \  ← Testes Unitários (Services com JUnit 5 + Mockito)
    /____________\
```

### 8.2 Casos de Teste Prioritários

| UC | Cenário | Tipo |
|---|---|---|
| UC-1 | Cadastro com e-mail duplicado → retornar 409 | Unitário |
| UC-1 | Senha com menos de 8 caracteres → retornar 400 | Unitário |
| UC-2 | Login com credenciais corretas → retornar JWT | Integração |
| UC-2 | Login com senha errada → retornar 401 | Integração |
| UC-5 | Progresso acima de 100% → retornar 400 | Unitário |
| UC-7 | Meta com prazo no passado → retornar 400 | Unitário |
| UC-3 | Criar grupo sem nome → retornar 400 | Integração |
| UC-4 | Entrar em grupo já participado → retornar 409 | Unitário |

### 8.3 Ferramenta de Testes

- **JUnit 5** para testes unitários e de integração.
- **Mockito** para mock dos repositórios nos testes de service.
- **Postman Collections** para testes manuais de endpoint.
- Cobertura mínima esperada: **70% nas classes de Service**.

---

## 9. Gestão de Riscos

| ID | Risco | Probabilidade | Impacto | Estratégia de Mitigação |
|---|---|---|---|---|
| RIS-1 | Baixa adesão de usuários | 0,4 | 9 | Focar em UX simples no Release 1; coletar feedback da turma |
| RIS-2 | Dificuldade de integração front/back | 0,5 | 7 | Definir contratos de API (DTOs) antes de codificar; testar com Postman antes de integrar |
| RIS-3 | Falta de tempo para todas as features | 0,7 | 8 | Priorizar RF de alta prioridade; mover baixa prioridade ao backlog |
| RIS-4 | Mudança de requisitos durante o projeto | 0,6 | 6 | Revisão de escopo a cada sprint; documentar mudanças no README |
| RIS-5 | Problemas de desempenho com muitos usuários | 0,3 | 7 | Usar paginação nas listagens; índices nas FK do banco |
| RIS-6 | Baixo engajamento da equipe | 0,4 | 5 | Daily assíncrona (via WhatsApp/Discord); revisão de tarefas a cada sprint |

---

## 10. Critérios de Aceite por Release

### Release 1 — MVP Core

- [ ] Usuário cria conta com e-mail e senha válidos (RF01)
- [ ] Usuário faz login e recebe token válido (RF01)
- [ ] Usuário visualiza catálogo de livros na biblioteca (UC-8)
- [ ] Usuário adiciona livro à lista "quero ler" (RF08)
- [ ] Usuário registra progresso de leitura com status (RF05 parcial)
- [ ] Usuário cria e participa de grupo de leitura (RF03)
- [ ] Usuário publica resenha em um livro (RF04)
- [ ] Usuário reage a resenha de outro usuário (RF10)

### Release 2 — Engajamento

- [ ] Usuário cria meta de leitura com prazo (RF06)
- [ ] Progresso da meta atualiza automaticamente ao registrar leitura (RF06)
- [ ] Usuário visualiza estatísticas no perfil (RF05)
- [ ] Usuário envia e recebe mensagens no chat do grupo (RF11)
- [ ] Sistema registra e exibe pontos de gamificação (RF13)
- [ ] Usuário recebe e visualiza notificações (RF12 parcial)

### Release 3 — Expansão

- [ ] Sistema sugere livros com base no histórico do usuário (RF07)
- [ ] Usuário controla preferências de notificação (RF12)
- [ ] Sistema diferencia tipos de perfil (RF16)
- [ ] Interface é responsiva em dispositivos móveis (RNF01, RNF06)

---

## 11. Checklist de Entrega Final

### Código e Repositório
- [ ] Branch `main` contém o código estável final
- [ ] Todos os PRs da sprint 7 foram revisados e mergeados
- [ ] Nenhuma credencial ou senha hardcoded no código
- [ ] Arquivo `.gitignore` configurado corretamente

### Banco de Dados
- [ ] Scripts de migration versionados em `db/migration/`
- [ ] Script de seed com dados de demonstração (ao menos 5 livros, 2 grupos)
- [ ] Todas as FK com índices criados

### Backend
- [ ] Todas as rotas retornam o envelope padrão de resposta
- [ ] Tratamento de exceções implementado (GlobalExceptionHandler)
- [ ] JWT com expiração configurada
- [ ] Cobertura de testes ≥ 70% nos Services

### Frontend
- [ ] Todas as páginas previstas no escopo estão acessíveis
- [ ] Token JWT armazenado e enviado no header das requisições protegidas
- [ ] Mensagens de erro amigáveis exibidas ao usuário
- [ ] Interface funciona em Chrome e Firefox

### Documentação
- [ ] `README.md` com: descrição, pré-requisitos, instruções de instalação e execução
- [ ] Collection do Postman exportada e commitada no repositório
- [ ] Diagrama ER atualizado caso haja mudanças no banco

### Apresentação
- [ ] Ambiente de demonstração rodando localmente sem erros
- [ ] Fluxo de demonstração definido (cadastro → login → biblioteca → grupo → resenha → meta)
- [ ] Todos os integrantes familiarizados com as funcionalidades para apresentar

---
