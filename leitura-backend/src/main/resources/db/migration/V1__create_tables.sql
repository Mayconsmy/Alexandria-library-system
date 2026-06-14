-- ============================================================
-- Sistema de Clubes de Leitura
-- V1 - Criação das tabelas
-- ============================================================

CREATE DATABASE IF NOT EXISTS clube_leitura
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE clube_leitura;

-- ------------------------------------------------------------
-- Tabela: usuario
-- ------------------------------------------------------------
CREATE TABLE usuario (
    id_usuario    INT          NOT NULL AUTO_INCREMENT,
    nome          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL,
    senha         VARCHAR(255) NOT NULL,
    foto_perfil   VARCHAR(255)          DEFAULT NULL,
    tipo_perfil   VARCHAR(50)           DEFAULT 'leitor',
    data_cadastro DATE         NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_usuario_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: livro
-- ------------------------------------------------------------
CREATE TABLE livro (
    id_livro         INT          NOT NULL AUTO_INCREMENT,
    titulo           VARCHAR(200) NOT NULL,
    autor            VARCHAR(150) NOT NULL,
    genero           VARCHAR(100)          DEFAULT NULL,
    descricao        TEXT                  DEFAULT NULL,
    tipo             VARCHAR(50)           DEFAULT 'livro',
    data_publicacao  DATE                  DEFAULT NULL,
    PRIMARY KEY (id_livro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: leitura
-- ------------------------------------------------------------
CREATE TABLE leitura (
    id_leitura  INT         NOT NULL AUTO_INCREMENT,
    id_usuario  INT         NOT NULL,
    id_livro    INT         NOT NULL,
    status      VARCHAR(30) NOT NULL COMMENT 'lendo | lido | quero_ler',
    data_inicio DATE                 DEFAULT NULL,
    data_fim    DATE                 DEFAULT NULL,
    PRIMARY KEY (id_leitura),
    KEY fk_leitura_usuario (id_usuario),
    KEY fk_leitura_livro   (id_livro),
    CONSTRAINT fk_leitura_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_leitura_livro   FOREIGN KEY (id_livro)   REFERENCES livro   (id_livro)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: resenha
-- ------------------------------------------------------------
CREATE TABLE resenha (
    id_resenha  INT   NOT NULL AUTO_INCREMENT,
    id_usuario  INT   NOT NULL,
    id_livro    INT   NOT NULL,
    texto       TEXT  NOT NULL,
    nota        FLOAT          DEFAULT NULL,
    data        DATE  NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (id_resenha),
    KEY fk_resenha_usuario (id_usuario),
    KEY fk_resenha_livro   (id_livro),
    CONSTRAINT fk_resenha_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_resenha_livro   FOREIGN KEY (id_livro)   REFERENCES livro   (id_livro)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: reacao
-- ------------------------------------------------------------
CREATE TABLE reacao (
    id_reacao   INT         NOT NULL AUTO_INCREMENT,
    id_usuario  INT         NOT NULL,
    id_resenha  INT         NOT NULL,
    tipo        VARCHAR(30) NOT NULL COMMENT 'curtida | amei | util | discordo',
    data        DATE        NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (id_reacao),
    UNIQUE KEY uq_reacao_usuario_resenha (id_usuario, id_resenha),
    KEY fk_reacao_usuario  (id_usuario),
    KEY fk_reacao_resenha  (id_resenha),
    CONSTRAINT fk_reacao_usuario  FOREIGN KEY (id_usuario)  REFERENCES usuario  (id_usuario)  ON DELETE CASCADE,
    CONSTRAINT fk_reacao_resenha  FOREIGN KEY (id_resenha)  REFERENCES resenha  (id_resenha)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: grupo_leitura
-- ------------------------------------------------------------
CREATE TABLE grupo_leitura (
    id_grupo      INT          NOT NULL AUTO_INCREMENT,
    nome          VARCHAR(150) NOT NULL,
    descricao     VARCHAR(500)          DEFAULT NULL,
    privado       TINYINT(1)            DEFAULT 0,
    data_criacao  DATE         NOT NULL DEFAULT (CURRENT_DATE),
    id_usuario    INT          NOT NULL COMMENT 'administrador do grupo',
    PRIMARY KEY (id_grupo),
    KEY fk_grupo_admin (id_usuario),
    CONSTRAINT fk_grupo_admin FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: usuario_grupo (N:N)
-- ------------------------------------------------------------
CREATE TABLE usuario_grupo (
    id_usuario        INT NOT NULL,
    id_grupo_leitura  INT NOT NULL,
    PRIMARY KEY (id_usuario, id_grupo_leitura),
    KEY fk_ug_grupo (id_grupo_leitura),
    CONSTRAINT fk_ug_usuario FOREIGN KEY (id_usuario)       REFERENCES usuario       (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_ug_grupo   FOREIGN KEY (id_grupo_leitura) REFERENCES grupo_leitura (id_grupo)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: mensagem
-- ------------------------------------------------------------
CREATE TABLE mensagem (
    id_mensagem       INT          NOT NULL AUTO_INCREMENT,
    id_usuario        INT          NOT NULL,
    id_grupo_leitura  INT          NOT NULL,
    conteudo          VARCHAR(1000) NOT NULL,
    data_envio        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_mensagem),
    KEY fk_msg_usuario (id_usuario),
    KEY fk_msg_grupo   (id_grupo_leitura),
    CONSTRAINT fk_msg_usuario FOREIGN KEY (id_usuario)       REFERENCES usuario       (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_msg_grupo   FOREIGN KEY (id_grupo_leitura) REFERENCES grupo_leitura (id_grupo)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: meta_leitura
-- ------------------------------------------------------------
CREATE TABLE meta_leitura (
    id_meta           INT      NOT NULL AUTO_INCREMENT,
    id_usuario        INT      NOT NULL,
    quantidade_livros INT      NOT NULL,
    prazo             DATETIME NOT NULL,
    progresso         INT               DEFAULT 0,
    PRIMARY KEY (id_meta),
    KEY fk_meta_usuario (id_usuario),
    CONSTRAINT fk_meta_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: notificacao
-- ------------------------------------------------------------
CREATE TABLE notificacao (
    id_notificacao  INT          NOT NULL AUTO_INCREMENT,
    id_usuario      INT          NOT NULL,
    mensagem        VARCHAR(500) NOT NULL,
    data            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lida            TINYINT(1)            DEFAULT 0,
    PRIMARY KEY (id_notificacao),
    KEY fk_notif_usuario (id_usuario),
    CONSTRAINT fk_notif_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Tabela: estatistica
-- ------------------------------------------------------------
CREATE TABLE estatistica (
    id_estatistica     INT NOT NULL AUTO_INCREMENT,
    id_usuario         INT NOT NULL,
    livros_lidos       INT          DEFAULT 0,
    livros_em_leitura  INT          DEFAULT 0,
    livros_desejados   INT          DEFAULT 0,
    PRIMARY KEY (id_estatistica),
    UNIQUE KEY uq_estatistica_usuario (id_usuario),
    CONSTRAINT fk_estat_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
