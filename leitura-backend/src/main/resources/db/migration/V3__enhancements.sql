-- V3 - Melhorias: editora, metas sem hora, estatísticas expandidas

ALTER TABLE livro ADD COLUMN editora VARCHAR(150) DEFAULT NULL AFTER descricao;

ALTER TABLE meta_leitura MODIFY COLUMN prazo DATE NOT NULL;

ALTER TABLE estatistica ADD COLUMN livros_abandonados INT DEFAULT 0 AFTER livros_desejados;
ALTER TABLE estatistica ADD COLUMN livros_relendo INT DEFAULT 0 AFTER livros_abandonados;
ALTER TABLE estatistica ADD COLUMN total_avaliacoes INT DEFAULT 0 AFTER livros_relendo;
ALTER TABLE estatistica ADD COLUMN media_avaliacoes DECIMAL(3,2) DEFAULT 0.00 AFTER total_avaliacoes;
